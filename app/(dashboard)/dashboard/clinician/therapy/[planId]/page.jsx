"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, AlertTriangle, CheckCircle, TrendingUp,
  TrendingDown, Minus, Calendar, Clock, Activity,
  Target, BellOff,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import ProgressChart from "../../../components/ProgressChart";

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

const PROGRESS_CONFIG = {
  improving:  { icon: TrendingUp,   color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", label: "Improving"  },
  stagnant:   { icon: Minus,        color: "text-amber-600",   bg: "bg-amber-50 border-amber-200",     label: "Stagnant"   },
  regressing: { icon: TrendingDown, color: "text-rose-600",    bg: "bg-rose-50 border-rose-200",       label: "Regressing" },
};

const MOOD_EMOJI = { great: "😄", good: "🙂", neutral: "😐", tough: "😟", bad: "😢" };

export default function ClinicianTherapyPlanPage({ params }) {
  const router = useRouter();
  const { planId } = use(params);

  const [plan, setPlan]         = useState(null);
  const [sessions, setSessions] = useState([]);
  const [progress, setProgress] = useState([]);
  const [alerts, setAlerts]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dismissingId, setDismissingId] = useState(null);
  const [endingPlan, setEndingPlan]     = useState(false);

  async function handleEndPlan() {
    if (!confirm("Are you sure you want to end this therapy plan? This will mark it as completed.")) return;
    setEndingPlan(true);
    try {
      const res = await fetch(`/api/therapy/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) throw new Error();
      setPlan(prev => ({ ...prev, status: "completed" }));
      toast.success("Therapy plan marked as completed");
    } catch {
      toast.error("Failed to end plan");
    } finally {
      setEndingPlan(false);
    }
  }

  useEffect(() => { loadAll(); }, [planId]);

  async function loadAll() {
    setLoading(true);
    try {
      const [planRes, sessionsRes, progressRes, alertsRes] = await Promise.all([
        fetch(`/api/therapy/plans/${planId}`),
        fetch(`/api/therapy/sessions?planId=${planId}`),
        fetch(`/api/therapy/progress?planId=${planId}`),
        fetch(`/api/therapy/alerts?planId=${planId}`),
      ]);
      const [planData, sessionsData, progressData, alertsData] = await Promise.all([
        planRes.json(), sessionsRes.json(), progressRes.json(), alertsRes.json(),
      ]);
      setPlan(planData);
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      setProgress(Array.isArray(progressData) ? progressData : []);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
    } catch {
      toast.error("Failed to load therapy data");
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
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a));
      toast.success("Alert dismissed");
    } catch {
      toast.error("Failed to dismiss alert");
    } finally {
      setDismissingId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-20">
        <h3 className="font-semibold text-gray-700 mb-3">Plan not found</h3>
        <Button onClick={() => router.back()} className="rounded-xl">Go Back</Button>
      </div>
    );
  }

  const latestProgress = progress[progress.length - 1];
  const progressCfg    = latestProgress ? PROGRESS_CONFIG[latestProgress.status] : null;
  const ProgressIcon   = progressCfg?.icon;
  const unreadAlerts   = alerts.filter(a => !a.isRead);

  return (
    <div className="space-y-6">

      {/* Back */}
      <Button variant="ghost" className="gap-2 text-gray-500 hover:text-gray-900 -ml-2"
        onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl" style={{background: "linear-gradient(135deg, #047857, #0d9488, #065f46)"}}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-emerald-200" />
            <span className="text-emerald-200 text-xs font-semibold tracking-widest uppercase">Therapy Plan</span>
          </div>
          <div className="flex items-start justify-between gap-4 mb-1">
            <h1 className="text-2xl font-bold">{plan.title}</h1>
            {plan.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs border-white/30 text-white hover:bg-white/10 bg-white/10 flex-shrink-0"
                disabled={endingPlan}
                onClick={handleEndPlan}
              >
                {endingPlan ? "Ending…" : "✓ End Plan"}
              </Button>
            )}
            {plan.status === "completed" && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 text-emerald-100 flex-shrink-0">
                ✓ Completed
              </span>
            )}
          </div>
          <p className="text-emerald-100 text-sm mb-4">
            {plan.childName} • {plan.frequency ?? "No frequency set"} • Created {formatDate(plan.createdAt)}
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Sessions",   value: sessions.length },
              { label: "Goals",      value: plan.goals?.length ?? 0 },
              { label: "Progress",   value: latestProgress ? progressCfg?.label : "No data" },
              { label: "Alerts",     value: unreadAlerts.length },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl bg-white/10 backdrop-blur px-3 py-2.5 text-center">
                <div className="text-lg font-bold">{value}</div>
                <div className="text-emerald-100 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Unread Alerts ── */}
      {unreadAlerts.length > 0 && (
        <div className="space-y-3">
          {unreadAlerts.map(alert => (
            <div key={alert.id} className={`rounded-2xl border p-4 flex items-start gap-4 ${
              alert.type === "regressing" ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                alert.type === "regressing" ? "bg-rose-100" : "bg-amber-100"
              }`}>
                <AlertTriangle className={`h-5 w-5 ${alert.type === "regressing" ? "text-rose-600" : "text-amber-600"}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${alert.type === "regressing" ? "text-rose-800" : "text-amber-800"}`}>
                  {alert.type === "regressing" ? "Progress Regressing" : "Progress Stagnant"}
                </p>
                <p className={`text-xs mt-0.5 ${alert.type === "regressing" ? "text-rose-600" : "text-amber-600"}`}>
                  {alert.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(alert.createdAt)}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs flex-shrink-0"
                disabled={dismissingId === alert.id}
                onClick={() => dismissAlert(alert.id)}
              >
                {dismissingId === alert.id ? "…" : "Dismiss"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ── Latest Progress ── */}
      {latestProgress && progressCfg && ProgressIcon && (
        <div className={`rounded-2xl border p-4 flex items-center gap-4 ${progressCfg.bg}`}>
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <ProgressIcon className={`h-6 w-6 ${progressCfg.color}`} />
          </div>
          <div>
            <p className="font-bold text-gray-900">
              Current Status: <span className={progressCfg.color}>{progressCfg.label}</span>
            </p>
            <p className="text-sm text-gray-500">
              Score: {latestProgress.score?.toFixed(1)}/10 • Last updated {formatDate(latestProgress.createdAt)}
            </p>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="rounded-xl bg-gray-100 p-1 w-full grid grid-cols-4">
          <TabsTrigger value="overview"  className="rounded-lg text-sm">Overview</TabsTrigger>
          <TabsTrigger value="progress"  className="rounded-lg text-sm">Progress</TabsTrigger>
          <TabsTrigger value="sessions"  className="rounded-lg text-sm">Sessions ({sessions.length})</TabsTrigger>
          <TabsTrigger value="alerts"    className="rounded-lg text-sm">
            Alerts {unreadAlerts.length > 0 && `(${unreadAlerts.length})`}
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-6 space-y-5">
          {plan.therapyTypes?.length > 0 && (
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-base">Therapy Types</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {plan.therapyTypes.map(t => (
                  <span key={t} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium">{t}</span>
                ))}
              </CardContent>
            </Card>
          )}
          {plan.goals?.length > 0 && (
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-600" />Therapy Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {plan.goals.map((goal, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                    <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {plan.notes && (
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-base">Plan Notes</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">{plan.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* PROGRESS */}
        <TabsContent value="progress" className="mt-6">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />Progress Over Time
              </CardTitle>
              <CardDescription>Behavioral score trend across all logged sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressChart progress={progress} />
            </CardContent>
          </Card>

          {/* Per-snapshot table */}
          {progress.length > 0 && (
            <Card className="rounded-2xl border-0 shadow-sm mt-4">
              <CardHeader className="pb-3"><CardTitle className="text-base">All Snapshots</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[...progress].reverse().map((p, i) => {
                  const cfg = PROGRESS_CONFIG[p.status];
                  const Icon = cfg?.icon;
                  return (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className={`h-4 w-4 ${cfg.color}`} />}
                        <div>
                          <p className={`text-sm font-semibold ${cfg?.color}`}>{cfg?.label}</p>
                          <p className="text-xs text-gray-400">{formatDate(p.createdAt)}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{p.score?.toFixed(1)}/10</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SESSIONS */}
        <TabsContent value="sessions" className="mt-6 space-y-4">
          {sessions.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-200 rounded-2xl">
              <CardContent className="flex flex-col items-center justify-center py-14">
                <Calendar className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="font-semibold text-gray-700">No sessions logged yet</h3>
                <p className="text-gray-400 text-sm mt-1">Parent hasn't logged any sessions</p>
              </CardContent>
            </Card>
          ) : (
            sessions.map(session => {
              const overallScore = session.behaviorRatings?.overall_score;
              return (
                <Card key={session.id} className="rounded-2xl border border-gray-100">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900 text-sm">
                            {new Date(session.sessionDate).toLocaleDateString("en-GB", {
                              day: "numeric", month: "long", year: "numeric"
                            })}
                          </span>
                          {session.mood && (
                            <span className="text-lg">{MOOD_EMOJI[session.mood] ?? "😐"}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />{session.durationMinutes} min
                          </span>
                          {overallScore != null && (
                            <span className={`font-semibold ${overallScore >= 7 ? "text-emerald-600" : overallScore >= 4 ? "text-amber-600" : "text-rose-600"}`}>
                              Score: {overallScore}/10
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {session.activities?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {session.activities.map((a, i) => (
                          <span key={i} className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-lg">{a}</span>
                        ))}
                      </div>
                    )}
                    {session.notes && (
                      <p className="text-sm text-gray-500 leading-relaxed">{session.notes}</p>
                    )}
                    {session.behaviorRatings && Object.keys(session.behaviorRatings).length > 0 && (
                      <div className="mt-3 grid grid-cols-5 gap-1.5">
                        {Object.entries(session.behaviorRatings).map(([key, val]) => (
                          <div key={key} className="text-center">
                            <div className={`text-xs font-bold ${val >= 7 ? "text-emerald-600" : val >= 4 ? "text-amber-600" : "text-rose-600"}`}>{val}</div>
                            <div className="text-xs text-gray-400 truncate">{key.replace(/_/g, " ")}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* ALERTS */}
        <TabsContent value="alerts" className="mt-6 space-y-4">
          {alerts.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-200 rounded-2xl">
              <CardContent className="flex flex-col items-center justify-center py-14">
                <BellOff className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="font-semibold text-gray-700">No alerts</h3>
                <p className="text-gray-400 text-sm mt-1">Alerts appear when progress is stagnant or regressing</p>
              </CardContent>
            </Card>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className={`rounded-2xl border p-4 flex items-start gap-4 transition-opacity ${
                alert.isRead ? "opacity-50" : ""
              } ${alert.type === "regressing" ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  alert.type === "regressing" ? "bg-rose-100" : "bg-amber-100"
                }`}>
                  <AlertTriangle className={`h-5 w-5 ${alert.type === "regressing" ? "text-rose-600" : "text-amber-600"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-bold ${alert.type === "regressing" ? "text-rose-800" : "text-amber-800"}`}>
                      {alert.type === "regressing" ? "Progress Regressing" : "Progress Stagnant"}
                    </p>
                    {alert.isRead && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Dismissed</span>
                    )}
                  </div>
                  <p className={`text-xs ${alert.type === "regressing" ? "text-rose-600" : "text-amber-600"}`}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(alert.createdAt)}</p>
                </div>
                {!alert.isRead && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs flex-shrink-0"
                    disabled={dismissingId === alert.id}
                    onClick={() => dismissAlert(alert.id)}
                  >
                    {dismissingId === alert.id ? "…" : "Dismiss"}
                  </Button>
                )}
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}