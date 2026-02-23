import sql from './db';
import { generateId } from './utils';

// ============================================
// CHILDREN
// ============================================

export async function getChildrenByParent(parentId) {
  const rows = await sql`
    SELECT * FROM children WHERE parent_id = ${parentId} ORDER BY created_at DESC
  `;
  return rows.map(toCamelChild);
}

export async function getChildById(childId) {
  const rows = await sql`
    SELECT * FROM children WHERE id = ${childId}
  `;
  return rows[0] ? toCamelChild(rows[0]) : null;
}

export async function addChild({ parentId, name, dateOfBirth, gender }) {
  const id = generateId('child');
  const now = new Date().toISOString();
  await sql`
    INSERT INTO children (id, parent_id, name, date_of_birth, gender, created_at, updated_at)
    VALUES (${id}, ${parentId}, ${name}, ${dateOfBirth}, ${gender}, ${now}, ${now})
  `;
  return { id, parentId, name, dateOfBirth, gender, createdAt: now, updatedAt: now };
}

export async function updateChild(childId, updates) {
  const now = new Date().toISOString();
  if (updates.name !== undefined) {
    await sql`UPDATE children SET name = ${updates.name}, updated_at = ${now} WHERE id = ${childId}`;
  }
}

// ============================================
// SCREENINGS
// ============================================

export async function getScreeningsByChild(childId) {
  const rows = await sql`
    SELECT * FROM screenings WHERE child_id = ${childId} ORDER BY created_at DESC
  `;
  return rows.map(toCamelScreening);
}

export async function getScreeningsByParent(parentId) {
  const rows = await sql`
    SELECT * FROM screenings WHERE parent_id = ${parentId} ORDER BY created_at DESC
  `;
  return rows.map(toCamelScreening);
}

export async function getScreeningById(screeningId) {
  const rows = await sql`
    SELECT * FROM screenings WHERE id = ${screeningId}
  `;
  return rows[0] ? toCamelScreening(rows[0]) : null;
}

export async function getAllSubmittedScreenings() {
  const rows = await sql`
    SELECT s.*, c.name AS child_name, c.date_of_birth AS child_dob, c.gender AS child_gender
    FROM screenings s
    LEFT JOIN children c ON s.child_id = c.id
    WHERE s.status != 'draft'
    ORDER BY s.created_at DESC
  `;
  
  return rows.map(toCamelScreening);
}

export async function getScreeningWithChild(screeningId) {
  const rows = await sql`
    SELECT s.*, c.name AS child_name, c.date_of_birth AS child_dob, c.gender AS child_gender
    FROM screenings s
    LEFT JOIN children c ON s.child_id = c.id
    WHERE s.id = ${screeningId}
  `;
  return rows[0] ? toCamelScreening(rows[0]) : null;
}

export async function addScreening(screening) {
  const {
    id,
    childId,
    parentId,
    status,
    createdAt,
    submittedAt,
    questionnaireResponses,
    questionnaireScore,
    videos,
    riskAssessment,
  } = screening;

  await sql`
    INSERT INTO screenings (
      id, child_id, parent_id, status, created_at, submitted_at,
      questionnaire_responses, questionnaire_score, videos, risk_assessment
    ) VALUES (
      ${id}, ${childId}, ${parentId}, ${status}, ${createdAt}, ${submittedAt ?? null},
      ${JSON.stringify(questionnaireResponses)}, ${questionnaireScore},
      ${JSON.stringify(videos)}, ${JSON.stringify(riskAssessment)}
    )
  `;
  return screening;
}

export async function updateScreening(screeningId, updates) {
  if (updates.clinicianReview !== undefined) {
    await sql`
      UPDATE screenings
      SET clinician_review = ${JSON.stringify(updates.clinicianReview)},
          status = ${updates.status ?? 'reviewed'}
      WHERE id = ${screeningId}
    `;
  }
  if (updates.status !== undefined && updates.clinicianReview === undefined) {
    await sql`UPDATE screenings SET status = ${updates.status} WHERE id = ${screeningId}`;
  }
}

// ============================================
// Helpers
// ============================================
function toCamelChild(row) {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toCamelScreening(row) {
  return {
    id: row.id,
    childId: row.child_id,
    parentId: row.parent_id,
    status: row.status,
    createdAt: row.created_at,
    submittedAt: row.submitted_at,
    questionnaireResponses: row.questionnaire_responses ?? [],
    questionnaireScore: row.questionnaire_score ?? 0,
    videos: row.videos ?? [],
    riskAssessment: row.risk_assessment ?? null,
    clinicianReview: row.clinician_review ?? null,
    // Joined child fields (present when queried with JOIN)
    childName: row.child_name ?? null,
    childDob: row.child_dob ?? null,
    childGender: row.child_gender ?? null,
  };
}