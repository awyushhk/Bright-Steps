"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, CheckCircle, Plus, Calendar, Clock,
  Target, Activity, TrendingUp, TrendingDown, Minus,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import ProgressChart from "@/app/(dashboard)/dashboard/components/ProgressChart";

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

const MOOD_OPTIONS = [
  { value: "great",   label: "Great",   icon: "😄", color: "border-emerald-300 bg-emerald-50 text-emerald-700" },
  { value: "good",    label: "Good",    icon: "🙂", color: "border-blue-300 bg-blue-50 text-blue-700"         },
  { value: "neutral", label: "Neutral", icon: "😐", color: "border-gray-300 bg-gray-50 text-gray-700"         },
  { value: "tough",   label: "Tough",   icon: "😟", color: "border-amber-300 bg-amber-50 text-amber-700"      },
  { value: "bad",     label: "Bad",     icon: "😢", color: "border-rose-300 bg-rose-50 text-rose-700"         },
];

const PROGRESS_CONFIG = {
  improving:  { icon: TrendingUp,   color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", label: "Improving"  },
  stagnant:   { icon: Minus,        color: "text-amber-600",   bg: "bg-amber-50 border-amber-200",     label: "Stagnant"   },
  regressing: { icon: TrendingDown, color: "text-rose-600",    bg: "bg-rose-50 border-rose-200",       label: "Regressing" },
};

function BehaviorRating({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <span className={`text-sm font-bold ${value >= 7 ? "text-emerald-600" : value >= 4 ? "text-amber-600" : "text-rose-600"}`}>
          {value}/10
        </span>
      </div>
      <input
        type="range" min="0" max="10" value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${value >= 7 ? "#10b981" : value >= 4 ? "#f59e0b" : "#f43f5e"} 0%, ${value >= 7 ? "#10b981" : value >= 4 ? "#f59e0b" : "#f43f5e"} ${value * 10}%, #e5e7eb ${value * 10}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );
}

export default function ParentTherapyPage({ params }) {
  const router = useRouter();
  const { planId } = use(params);

  const [plan, setPlan]         = useState(null);
  const [sessions, setSessions] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [saving, setSaving]     = useState(false);

  const [form, setForm] = useState({
    sessionDate: new Date().toISOString().split("T")[0],
    durationMinutes: 45,
    mood: "good",
    notes: "",
    activities: "",
    behaviorRatings: {
      eye_contact: 5,
      response_to_name: 5,
      social_engagement: 5,
      engagement_with_activities: 5,
      overall_score: 5,
    },
  });

  useEffect(() => { loadAll(); }, [planId]);

  async function loadAll() {
    setLoading(true);
    try {
      const [planRes, sessionsRes, progressRes] = await Promise.all([
        fetch(`/api/therapy/plans/${planId}`),
        fetch(`/api/therapy/sessions?planId=${planId}`),
        fetch(`/api/therapy/progress?planId=${planId}`),
      ]);
      const [planData, sessionsData, progressData] = await Promise.all([
        planRes.json(), sessionsRes.json(), progressRes.json(),
      ]);
      setPlan(planData);
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      setProgress(Array.isArray(progressData) ? progressData : []);
    } catch {
      toast.error("Failed to load therapy data");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogSession() {
    if (!form.sessionDate) { toast.error("Please select a session date"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/therapy/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          childId: plan.childId,
          sessionDate: form.sessionDate,
          durationMinutes: Number(form.durationMinutes),
          mood: form.mood,
          notes: form.notes,
          activities: form.activities
            ? form.activities.split(",").map(a => a.trim()).filter(Boolean)
            : [],
          behaviorRatings: form.behaviorRatings,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Session logged successfully");
      setActiveTab("sessions");
      setForm({
        sessionDate: new Date().toISOString().split("T")[0],
        durationMinutes: 45,
        mood: "good",
        notes: "",
        activities: "",
        behaviorRatings: {
          eye_contact: 5, response_to_name: 5, social_engagement: 5,
          engagement_with_activities: 5, overall_score: 5,
        },
      });
      await loadAll();
    } catch {
      toast.error("Failed to log session");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-32 rounded-3xl" />
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

  return (
    <div className="space-y-6">

      {/* Back */}
      <Button variant="ghost" className="gap-2 text-gray-500 hover:text-gray-900 -ml-2"
        onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-6 text-white shadow-xl">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-slate-300" />
            <span className="text-slate-300 text-xs font-semibold tracking-widest uppercase">Therapy Plan</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{plan.title}</h1>
          <p className="text-slate-300 text-sm mb-4">
            {plan.childName} • {plan.frequency ?? "No frequency set"}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Sessions", value: sessions.length },
              { label: "Goals",    value: plan.goals?.length ?? 0 },
              { label: "Progress", value: latestProgress ? progressCfg?.label : "No data" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 text-center">
                <div className="text-xl font-bold">{value}</div>
                <div className="text-slate-300 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Progress Status ── */}
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
              Score: {latestProgress.score?.toFixed(1)}/10 •
              Last updated {formatDate(latestProgress.createdAt)}
            </p>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="rounded-xl bg-gray-100 p-1 w-full grid grid-cols-4">
          <TabsTrigger value="overview"  className="rounded-lg text-sm">Overview</TabsTrigger>
          <TabsTrigger value="sessions"  className="rounded-lg text-sm">Sessions ({sessions.length})</TabsTrigger>
          <TabsTrigger value="log"       className="rounded-lg text-sm">Log Session</TabsTrigger>
          <TabsTrigger value="progress"  className="rounded-lg text-sm">Progress</TabsTrigger>
        </TabsList>

        {/* ── OVERVIEW ── */}
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
              <CardHeader className="pb-3"><CardTitle className="text-base">Clinician Notes</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">{plan.notes}</p>
              </CardContent>
            </Card>
          )}
          {sessions.length === 0 && (
            <Card className="border-2 border-dashed border-indigo-200 rounded-2xl">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <ClipboardList className="h-10 w-10 text-indigo-300 mb-3" />
                <h3 className="font-semibold text-gray-700 mb-1">No sessions logged yet</h3>
                <p className="text-gray-400 text-sm mb-4 text-center">
                  Start logging therapy sessions to track your child&apos;s progress
                </p>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2"
                  onClick={() => setActiveTab("log")}
                >
                  <Plus className="h-4 w-4" />Log First Session
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── SESSIONS ── */}
        <TabsContent value="sessions" className="mt-6 space-y-4">
          {sessions.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-200 rounded-2xl">
              <CardContent className="flex flex-col items-center justify-center py-14">
                <Calendar className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="font-semibold text-gray-700 mb-1">No sessions yet</h3>
                <p className="text-gray-400 text-sm">Sessions you log will appear here</p>
              </CardContent>
            </Card>
          ) : (
            sessions.map(session => {
              const moodCfg      = MOOD_OPTIONS.find(m => m.value === session.mood);
              const overallScore = session.behaviorRatings?.overall_score;
              return (
                <Card key={session.id} className="rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow">
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
                          {moodCfg && (
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${moodCfg.color}`}>
                              {moodCfg.icon} {moodCfg.label}
                            </span>
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
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{session.notes}</p>
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

        {/* ── LOG SESSION ── */}
        <TabsContent value="log" className="mt-6">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-indigo-600" />Log a Therapy Session
              </CardTitle>
              <CardDescription>
                Record today&apos;s session to track {plan.childName}&apos;s progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Session Date</Label>
                  <Input type="date" value={form.sessionDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={e => setForm(p => ({ ...p, sessionDate: e.target.value }))}
                    className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>Duration (minutes)</Label>
                  <Input type="number" min="5" max="240" value={form.durationMinutes}
                    onChange={e => setForm(p => ({ ...p, durationMinutes: e.target.value }))}
                    className="rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Child&apos;s Mood</Label>
                <div className="flex gap-2 flex-wrap">
                  {MOOD_OPTIONS.map(m => (
                    <button key={m.value} type="button"
                      onClick={() => setForm(p => ({ ...p, mood: m.value }))}
                      className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${
                        form.mood === m.value ? m.color + " border-current" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}>
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Activities <span className="text-gray-400 font-normal">(comma separated)</span></Label>
                <Input placeholder="e.g. Flashcard exercises, Mirror play, Name response drills"
                  value={form.activities}
                  onChange={e => setForm(p => ({ ...p, activities: e.target.value }))}
                  className="rounded-xl" />
              </div>

              <div className="space-y-3">
                <Label>Behavior Ratings</Label>
                <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
                  {[
                    { key: "eye_contact",                label: "Eye Contact"                },
                    { key: "response_to_name",           label: "Response to Name"           },
                    { key: "social_engagement",          label: "Social Engagement"          },
                    { key: "engagement_with_activities", label: "Engagement with Activities" },
                    { key: "overall_score",              label: "Overall Session Score"      },
                  ].map(({ key, label }) => (
                    <BehaviorRating key={key} label={label} value={form.behaviorRatings[key]}
                      onChange={val => setForm(p => ({
                        ...p, behaviorRatings: { ...p.behaviorRatings, [key]: val }
                      }))} />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Session Notes <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Textarea placeholder="How did the session go? Any observations, breakthroughs, or challenges..."
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="rounded-xl resize-none" rows={4} />
              </div>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 text-base gap-2"
                onClick={handleLogSession} disabled={saving}>
                {saving ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving…</>
                ) : (
                  <><CheckCircle className="h-4 w-4" />Save Session</>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── PROGRESS ── */}
        <TabsContent value="progress" className="mt-6">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />Progress Over Time
              </CardTitle>
              <CardDescription>
                Behavioral score trend across all logged sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressChart progress={progress} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}