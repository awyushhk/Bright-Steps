import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { getProgressByPlan, getLatestProgress } from "@/lib/therapy-queries";

const db = neon(process.env.DATABASE_URL);

export async function GET(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const planId = searchParams.get("planId");
  const latest = searchParams.get("latest");

  if (!planId) return Response.json({ error: "planId required" }, { status: 400 });

  try {
    if (latest === "true") {
      const progress = await getLatestProgress(db, planId);
      return Response.json(progress);
    }
    const progress = await getProgressByPlan(db, planId);
    return Response.json(progress);
  } catch (err) {
    console.error("GET /api/therapy/progress error:", err);
    return Response.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}