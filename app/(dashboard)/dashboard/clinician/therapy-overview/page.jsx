"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HeartPulse, Search, TrendingUp, TrendingDown,
  Minus, ChevronRight, Calendar, AlertTriangle, Target,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

const PROGRESS_CONFIG = {
  improving:  { icon: TrendingUp,   color: "text-emerald-600", bg: "bg-emerald-50",  badge: "bg-emerald-100 text-emerald-700", label: "Improving"  },
  stagnant:   { icon: Minus,        color: "text-amber-600",   bg: "bg-amber-50",    badge: "bg-amber-100 text-amber-700",     label: "Stagnant"   },
  regressing: { icon: TrendingDown, color: "text-rose-600",    bg: "bg-rose-50",     badge: "bg-rose-100 text-rose-700",       label: "Regressing" },
};

const STATUS_CONFIG = {
  active:    { badge: "bg-emerald-100 text-emerald-700", label: "Active"    },
  paused:    { badge: "bg-amber-100 text-amber-700",     label: "Paused"    },
  completed: { badge: "bg-gray-100 text-gray-600",       label: "Completed" },
};

export default function TherapyOverviewPage() {
  const router = useRouter();
  const [plans, setPlans]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [progressMap, setProgressMap] = useState({});   // planId → latest progress
  const [alertsMap, setAlertsMap]     = useState({});   // planId → unread alert count

  useEffect(() => { loadPlans(); }, []);

  async function loadPlans() {
    setLoading(true);
    try {
      const res = await fetch("/api/therapy/plans?all=true");
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);

      // Fetch latest progress + alert counts for each plan in parallel
      const pMap = {};
      const aMap = {};
      await Promise.all(
        data.map(async (plan) => {
          const [progRes, alertRes] = await Promise.all([
            fetch(`/api/therapy/progress?planId=${plan.id}&latest=true`),
            fetch(`/api/therapy/alerts?planId=${plan.id}`),
          ]);
          const prog   = await progRes.json();
          const alerts = await alertRes.json();
          pMap[plan.id] = prog;
          aMap[plan.id] = Array.isArray(alerts) ? alerts.filter(a => !a.isRead).length : 0;
        }),
      );
      setProgressMap(pMap);
      setAlertsMap(aMap);
    } catch {
      toast.error("Failed to load therapy plans");
    } finally {
      setLoading(false);
    }
  }

  const filtered = plans.filter(p => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.childName?.toLowerCase().includes(q) ||
      p.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-7 text-white shadow-xl" style={{background: "linear-gradient(135deg, #065f46, #0f766e, #134e4a)"}}>
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HeartPulse className="h-4 w-4 text-emerald-200" />
              <span className="text-emerald-200 text-xs font-semibold tracking-widest uppercase">Therapy Management</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Therapy Plans</h1>
            <p className="text-emerald-100 text-sm max-w-sm leading-relaxed">
              Monitor active plans, track child progress, and respond to regression alerts.
            </p>
          </div>
          <div className="hidden md:flex w-16 h-16 rounded-2xl bg-white/10 items-center justify-center flex-shrink-0">
            <HeartPulse className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Summary stats */}
        <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Plans",    value: plans.length },
            { label: "Active",         value: plans.filter(p => p.status === "active").length },
            { label: "Need Attention", value: Object.values(alertsMap).filter(c => c > 0).length },
            { label: "Improving",      value: Object.values(progressMap).filter(p => p?.status === "improving").length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 text-center">
              <div className="text-2xl font-bold">{loading ? "—" : value}</div>
              <div className="text-emerald-100 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by child name or plan title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 rounded-xl border-gray-200"
        />
      </div>

      {/* ── Plans List ── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <HeartPulse className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">No therapy plans found</h3>
            <p className="text-gray-400 text-sm">
              {search ? "Try a different search" : "Create therapy plans from the case review page"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(plan => {
            const latestProgress = progressMap[plan.id];
            const progressCfg    = latestProgress ? PROGRESS_CONFIG[latestProgress.status] : null;
            const ProgressIcon   = progressCfg?.icon;
            const unreadCount    = alertsMap[plan.id] ?? 0;
            const statusCfg      = STATUS_CONFIG[plan.status] ?? STATUS_CONFIG.active;

            return (
              <Card
                key={plan.id}
                className={`rounded-2xl border hover:shadow-md transition-shadow ${
                  unreadCount > 0 ? "border-rose-200" : "border-gray-100"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-gray-900 truncate">{plan.title}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusCfg.badge}`}>
                          {statusCfg.label}
                        </span>
                        {unreadCount > 0 && (
                          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            <AlertTriangle className="h-3 w-3" />
                            {unreadCount} alert{unreadCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {plan.childName ?? "Unknown Child"}
                        {plan.frequency && <span className="ml-2 text-gray-400">• {plan.frequency}</span>}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {formatDate(plan.createdAt)}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl gap-1.5 text-xs flex-shrink-0"
                      onClick={() => router.push(`/dashboard/clinician/therapy/${plan.id}`)}
                    >
                      View Plan <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Progress status */}
                    {progressCfg && ProgressIcon ? (
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${progressCfg.badge}`}>
                        <ProgressIcon className={`h-3.5 w-3.5 ${progressCfg.color}`} />
                        {progressCfg.label}
                        {latestProgress?.score != null && (
                          <span className="ml-1 opacity-70">({latestProgress.score.toFixed(1)}/10)</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">No progress data</span>
                    )}

                    {/* Goals count */}
                    {plan.goals?.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Target className="h-3.5 w-3.5" />
                        {plan.goals.length} goal{plan.goals.length !== 1 ? "s" : ""}
                      </div>
                    )}

                    {/* Therapy types */}
                    {plan.therapyTypes?.slice(0, 2).map(t => (
                      <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg">
                        {t.split("(")[0].trim()}
                      </span>
                    ))}
                    {plan.therapyTypes?.length > 2 && (
                      <span className="text-xs text-gray-400">+{plan.therapyTypes.length - 2} more</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}