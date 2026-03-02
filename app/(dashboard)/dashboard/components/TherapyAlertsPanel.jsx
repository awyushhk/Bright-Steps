"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BellOff, ChevronRight, Bell } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function TherapyAlertsPanel() {
  const router = useRouter();
  const [alerts, setAlerts]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [dismissingId, setDismissingId] = useState(null);

  useEffect(() => { loadAlerts(); }, []);

  async function loadAlerts() {
    try {
      const res = await fetch("/api/therapy/alerts?unread=true");
      const data = await res.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to load therapy alerts");
    } finally {
      setLoading(false);
    }
  }

  async function dismissAlert(alertId) {
    setDismissingId(alertId);
    try {
      await fetch("/api/therapy/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId }),
      });
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      toast.success("Alert dismissed");
    } catch {
      toast.error("Failed to dismiss alert");
    } finally {
      setDismissingId(null);
    }
  }

  // Don't render the panel at all if no alerts
  if (!loading && alerts.length === 0) return null;

  return (
    <Card className="rounded-3xl border-0 shadow-md overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
            <Bell className="h-4 w-4 text-rose-600" />
          </div>
          <div>
            <CardTitle className="text-base text-gray-900">Therapy Alerts</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              {loading ? "Loading…" : `${alerts.length} unread alert${alerts.length !== 1 ? "s" : ""} requiring attention`}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors ${
                  alert.type === "regressing" ? "border-l-4 border-l-rose-400" : "border-l-4 border-l-amber-400"
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  alert.type === "regressing" ? "bg-rose-100" : "bg-amber-100"
                }`}>
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.type === "regressing" ? "text-rose-600" : "text-amber-600"
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className={`text-sm font-bold ${
                      alert.type === "regressing" ? "text-rose-800" : "text-amber-800"
                    }`}>
                      {alert.childName ?? "Unknown Child"}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      alert.type === "regressing"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {alert.type === "regressing" ? "Regressing" : "Stagnant"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1 truncate">
                    {alert.planTitle ?? "Therapy Plan"}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(alert.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer actions */}
        {!loading && alerts.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-2">
            <p className="text-xs text-gray-400">
              Click a plan to review and dismiss alerts
            </p>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs border-rose-200 text-rose-700 hover:bg-rose-50 flex-shrink-0"
              onClick={() => router.push("/dashboard/clinician/therapy-overview")}
            >
              View All Plans <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}