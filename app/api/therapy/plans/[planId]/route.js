import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { getTherapyPlan, updateTherapyPlan } from "@/lib/therapy-queries";

const db = neon(process.env.DATABASE_URL);

export async function GET(request, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { planId } = await params;
    const plan = await getTherapyPlan(db, planId);
    if (!plan) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(plan);
  } catch (err) {
    console.error("GET /api/therapy/plans/[planId] error:", err);
    return Response.json({ error: "Failed to fetch plan" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { planId } = await params;
    const body = await request.json();
    const plan = await updateTherapyPlan(db, planId, body);
    return Response.json(plan);
  } catch (err) {
    console.error("PATCH /api/therapy/plans/[planId] error:", err);
    return Response.json({ error: "Failed to update plan" }, { status: 500 });
  }
}