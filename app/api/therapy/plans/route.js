import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import {
  createTherapyPlan,
  getTherapyPlansByChild,
  getAllTherapyPlans,
} from "@/lib/therapy-queries";

const db = neon(process.env.DATABASE_URL);

export async function GET(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId");
  const all = searchParams.get("all");

  try {
    let plans;
    if (all === "true") {
      plans = await getAllTherapyPlans(db);
    } else if (childId) {
      plans = await getTherapyPlansByChild(db, childId);
    } else {
      plans = [];
    }
    return Response.json(plans, {
      headers: { "Cache-Control": "private, max-age=10, stale-while-revalidate=30" },
    });
  } catch (err) {
    console.error("GET /api/therapy/plans error:", err);
    return Response.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const plan = await createTherapyPlan(db, {
      childId: body.childId,
      clinicianId: userId,
      title: body.title,
      goals: body.goals ?? [],
      therapyTypes: body.therapyTypes ?? [],
      frequency: body.frequency,
      notes: body.notes,
    });
    return Response.json(plan, { status: 201 });
  } catch (err) {
    console.error("POST /api/therapy/plans error:", err);
    return Response.json({ error: "Failed to create plan" }, { status: 500 });
  }
}