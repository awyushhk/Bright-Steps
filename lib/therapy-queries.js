// ─────────────────────────────────────────────
// MODULE 3 — THERAPY QUERIES
// Append everything below to your existing lib/queries.js
// ─────────────────────────────────────────────

// ── Therapy Plans ──────────────────────────────

export async function createTherapyPlan(db, {
  childId, clinicianId, title, goals, therapyTypes, frequency, notes
}) {
  const id = `plan-${crypto.randomUUID()}`;
  await db`
    INSERT INTO therapy_plans (id, child_id, clinician_id, title, goals, therapy_types, frequency, notes)
    VALUES (
      ${id}, ${childId}, ${clinicianId}, ${title},
      ${JSON.stringify(goals ?? [])}::jsonb,
      ${JSON.stringify(therapyTypes ?? [])}::jsonb,
      ${frequency ?? null}, ${notes ?? null}
    )
  `;
  return getTherapyPlan(db, id);
}

export async function getTherapyPlan(db, planId) {
  const rows = await db`
    SELECT tp.*, c.name as child_name, c.date_of_birth as child_dob
    FROM therapy_plans tp
    LEFT JOIN children c ON c.id = tp.child_id
    WHERE tp.id = ${planId}
  `;
  return rows[0] ? toTherapyPlan(rows[0]) : null;
}

export async function getTherapyPlansByChild(db, childId) {
  const rows = await db`
    SELECT tp.*, c.name as child_name, c.date_of_birth as child_dob
    FROM therapy_plans tp
    LEFT JOIN children c ON c.id = tp.child_id
    WHERE tp.child_id = ${childId}
    ORDER BY tp.created_at DESC
  `;
  return rows.map(toTherapyPlan);
}

export async function getAllTherapyPlans(db) {
  const rows = await db`
    SELECT tp.*, c.name as child_name, c.date_of_birth as child_dob
    FROM therapy_plans tp
    LEFT JOIN children c ON c.id = tp.child_id
    ORDER BY tp.created_at DESC
  `;
  return rows.map(toTherapyPlan);
}

export async function updateTherapyPlan(db, planId, updates) {
  await db`
    UPDATE therapy_plans SET
      title         = COALESCE(${updates.title ?? null}, title),
      goals         = COALESCE(${updates.goals ? JSON.stringify(updates.goals) : null}::jsonb, goals),
      therapy_types = COALESCE(${updates.therapyTypes ? JSON.stringify(updates.therapyTypes) : null}::jsonb, therapy_types),
      frequency     = COALESCE(${updates.frequency ?? null}, frequency),
      notes         = COALESCE(${updates.notes ?? null}, notes),
      status        = COALESCE(${updates.status ?? null}, status),
      updated_at    = NOW()
    WHERE id = ${planId}
  `;
  return getTherapyPlan(db, planId);
}

// ── Therapy Sessions ───────────────────────────

export async function createTherapySession(db, {
  planId, childId, loggedBy, sessionDate, durationMinutes,
  activities, behaviorRatings, notes, mood
}) {
  const id = `session-${crypto.randomUUID()}`;
  await db`
    INSERT INTO therapy_sessions
      (id, plan_id, child_id, logged_by, session_date, duration_minutes, activities, behavior_ratings, notes, mood)
    VALUES (
      ${id}, ${planId}, ${childId}, ${loggedBy}, ${sessionDate},
      ${durationMinutes ?? null},
      ${JSON.stringify(activities ?? [])}::jsonb,
      ${JSON.stringify(behaviorRatings ?? {})}::jsonb,
      ${notes ?? null}, ${mood ?? null}
    )
  `;
  // Auto-compute progress after each session
  await computeAndSaveProgress(db, planId, childId);
  return getTherapySession(db, id);
}

export async function getTherapySession(db, sessionId) {
  const rows = await db`SELECT * FROM therapy_sessions WHERE id = ${sessionId}`;
  return rows[0] ? toTherapySession(rows[0]) : null;
}

export async function getTherapySessionsByPlan(db, planId) {
  const rows = await db`
    SELECT * FROM therapy_sessions
    WHERE plan_id = ${planId}
    ORDER BY session_date DESC, created_at DESC
  `;
  return rows.map(toTherapySession);
}

// ── Progress Snapshots ─────────────────────────

export async function computeAndSaveProgress(db, planId, childId) {
  // Get last 5 sessions for this plan
  const sessions = await db`
    SELECT behavior_ratings FROM therapy_sessions
    WHERE plan_id = ${planId}
    ORDER BY session_date DESC, created_at DESC
    LIMIT 5
  `;

  if (sessions.length === 0) return null;

  // Average the overall_score across sessions
  const scores = sessions
    .map(s => s.behavior_ratings?.overall_score)
    .filter(v => v != null);

  if (scores.length < 2) return null;

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const recent = scores[0];
  const older = scores[scores.length - 1];
  const diff = recent - older;

  let status = "stagnant";
  if (diff >= 1) status = "improving";
  else if (diff <= -1) status = "regressing";

  const id = `progress-${crypto.randomUUID()}`;
  await db`
    INSERT INTO progress_snapshots (id, plan_id, child_id, status, score)
    VALUES (${id}, ${planId}, ${childId}, ${status}, ${Math.round(avg * 10) / 10})
  `;

  // Auto-generate alert if stagnant or regressing
  if (status === "stagnant" || status === "regressing") {
    await maybeCreateAlert(db, planId, childId, status);
  }

  return { status, score: avg };
}

export async function getProgressByPlan(db, planId) {
  const rows = await db`
    SELECT * FROM progress_snapshots
    WHERE plan_id = ${planId}
    ORDER BY created_at ASC
  `;
  return rows.map(r => ({
    id: r.id,
    planId: r.plan_id,
    childId: r.child_id,
    status: r.status,
    score: parseFloat(r.score),
    notes: r.notes,
    createdAt: r.created_at,
  }));
}

export async function getLatestProgress(db, planId) {
  const rows = await db`
    SELECT * FROM progress_snapshots
    WHERE plan_id = ${planId}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  if (!rows[0]) return null;
  return {
    status: rows[0].status,
    score: parseFloat(rows[0].score),
    createdAt: rows[0].created_at,
  };
}

// ── Alerts ─────────────────────────────────────

async function maybeCreateAlert(db, planId, childId, progressStatus) {
  // Only create if no unread alert of same type already exists
  const existing = await db`
    SELECT id FROM therapy_alerts
    WHERE plan_id = ${planId} AND type = ${progressStatus} AND is_read = FALSE
    LIMIT 1
  `;
  if (existing.length > 0) return;

  const message =
    progressStatus === "regressing"
      ? "Child's progress is regressing. Therapy plan review is recommended."
      : "Child's progress has been stagnant. Consider adjusting therapy activities.";

  const id = `alert-${crypto.randomUUID()}`;
  await db`
    INSERT INTO therapy_alerts (id, plan_id, child_id, type, message)
    VALUES (${id}, ${planId}, ${childId}, ${progressStatus}, ${message})
  `;
}

export async function getAlertsByPlan(db, planId) {
  const rows = await db`
    SELECT * FROM therapy_alerts WHERE plan_id = ${planId} ORDER BY created_at DESC
  `;
  return rows.map(toAlert);
}

export async function getAllUnreadAlerts(db) {
  const rows = await db`
    SELECT ta.*, tp.title as plan_title, c.name as child_name
    FROM therapy_alerts ta
    LEFT JOIN therapy_plans tp ON tp.id = ta.plan_id
    LEFT JOIN children c ON c.id = ta.child_id
    WHERE ta.is_read = FALSE
    ORDER BY ta.created_at DESC
  `;
  return rows.map(r => ({
    ...toAlert(r),
    planTitle: r.plan_title,
    childName: r.child_name,
  }));
}

export async function markAlertRead(db, alertId) {
  await db`UPDATE therapy_alerts SET is_read = TRUE WHERE id = ${alertId}`;
}

// ── Camelcase helpers ──────────────────────────

function toTherapyPlan(r) {
  return {
    id: r.id,
    childId: r.child_id,
    clinicianId: r.clinician_id,
    childName: r.child_name ?? null,
    childDob: r.child_dob ?? null,
    title: r.title,
    goals: r.goals ?? [],
    therapyTypes: r.therapy_types ?? [],
    frequency: r.frequency,
    status: r.status,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toTherapySession(r) {
  return {
    id: r.id,
    planId: r.plan_id,
    childId: r.child_id,
    loggedBy: r.logged_by,
    sessionDate: r.session_date,
    durationMinutes: r.duration_minutes,
    activities: r.activities ?? [],
    behaviorRatings: r.behavior_ratings ?? {},
    notes: r.notes,
    mood: r.mood,
    createdAt: r.created_at,
  };
}

function toAlert(r) {
  return {
    id: r.id,
    planId: r.plan_id,
    childId: r.child_id,
    type: r.type,
    message: r.message,
    isRead: r.is_read,
    createdAt: r.created_at,
  };
}