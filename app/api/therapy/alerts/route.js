import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import {
  getAllUnreadAlerts,
  getAlertsByPlan,
  markAlertRead,
} from "@/lib/therapy-queries";

const db = neon(process.env.DATABASE_URL);

export async function GET(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const planId = searchParams.get("planId");
  const unread = searchParams.get("unread");

  try {
    if (unread === "true") {
      const alerts = await getAllUnreadAlerts(db);
      return Response.json(alerts);
    }
    if (planId) {
      const alerts = await getAlertsByPlan(db, planId);
      return Response.json(alerts);
    }
    return Response.json([]);
  } catch (err) {
    console.error("GET /api/therapy/alerts error:", err);
    return Response.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { alertId } = await request.json();
    await markAlertRead(db, alertId);
    return Response.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/therapy/alerts error:", err);
    return Response.json({ error: "Failed to mark alert read" }, { status: 500 });
  }
}