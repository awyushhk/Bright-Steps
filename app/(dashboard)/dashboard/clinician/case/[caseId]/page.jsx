"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  Video,
  AlertCircle,
  CheckCircle,
  FileText,
  Save,
  Brain,
  Eye,
  Volume2,
  Heart,
  Repeat,
  Hand,
  ClipboardList,
  User,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { calculateAge, formatDate } from "@/lib/utils";

// ── Skeleton ──
function Skeleton({ className }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
  );
}

// ── Behavioral indicator config ──
const INDICATOR_CONFIG = {
  eye_contact: {
    label: "Eye Contact",
    icon: Eye,
    desc: "Ability to initiate and sustain eye contact",
  },
  response_to_name: {
    label: "Response to Name",
    icon: Volume2,
    desc: "Responds consistently when called by name",
  },
  social_engagement: {
    label: "Social Engagement",
    icon: Heart,
    desc: "Interest in interacting with people",
  },
  repetitive_movements: {
    label: "Repetitive Movements",
    icon: Repeat,
    desc: "10 = none observed, 0 = frequent/intense",
  },
  pointing_gesturing: {
    label: "Pointing & Gesturing",
    icon: Hand,
    desc: "Uses gestures to communicate intent",
  },
};

function IndicatorBar({ indicatorKey, score }) {
  const cfg = INDICATOR_CONFIG[indicatorKey];
  if (!cfg) return null;
  const Icon = cfg.icon;
  const color =
    score >= 7
      ? {
          bar: "bg-emerald-500",
          text: "text-emerald-600",
          bg: "bg-emerald-50 border-emerald-100",
        }
      : score >= 4
        ? {
            bar: "bg-amber-500",
            text: "text-amber-600",
            bg: "bg-amber-50 border-amber-100",
          }
        : {
            bar: "bg-rose-500",
            text: "text-rose-600",
            bg: "bg-rose-50 border-rose-100",
          };
  return (
    <div className={`p-4 rounded-2xl border ${color.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color.text}`} />
          <span className="text-sm font-semibold text-gray-800">
            {cfg.label}
          </span>
        </div>
        <span className={`text-sm font-bold ${color.text}`}>{score}/10</span>
      </div>
      <div className="h-2 rounded-full bg-white/70">
        <div
          className={`h-2 rounded-full ${color.bar} transition-all duration-700`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1.5">{cfg.desc}</p>
    </div>
  );
}

const RISK_CONFIG = {
  low: {
    gradient: "from-emerald-500 to-teal-600",
    icon: CheckCircle,
    label: "Low Risk",
    border: "border-emerald-200 bg-emerald-50",
    text: "text-emerald-700",
  },
  medium: {
    gradient: "from-amber-500 to-orange-500",
    icon: AlertCircle,
    label: "Medium Risk",
    border: "border-amber-200 bg-amber-50",
    text: "text-amber-700",
  },
  high: {
    gradient: "from-rose-500 to-red-600",
    icon: AlertCircle,
    label: "High Risk",
    border: "border-rose-200 bg-rose-50",
    text: "text-rose-700",
  },
};

const ACTION_OPTIONS = [
  {
    value: "referral",
    label: "Refer to Specialist",
    desc: "Immediate specialist evaluation required",
    color: "border-rose-200 bg-rose-50 text-rose-700",
  },
  {
    value: "monitoring",
    label: "Continue Monitoring",
    desc: "Schedule follow-up screening in 3-6 months",
    color: "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    value: "routine",
    label: "Routine Follow-up",
    desc: "Standard developmental check at next visit",
    color: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
];

export default function CaseReviewPage({ params }) {
  const router = useRouter();
  const { caseId } = use(params);

  const [screening, setScreening] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [clinicianNotes, setClinicianNotes] = useState("");
  const [clinicianAction, setClinicianAction] = useState("monitoring");
  const [isSaving, setIsSaving] = useState(false);
  const [isActioning, setIsActioning] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [previousScreenings, setPreviousScreenings] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/screenings/${caseId}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setScreening(data);
        if (data.clinicianReview) {
          setClinicianNotes(data.clinicianReview.notes || "");
          setClinicianAction(data.clinicianReview.action || "monitoring");
        }
        if (data.status === "submitted") {
          fetch(`/api/screenings/${caseId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "under_review" }),
          });
        }

        // ← Fetch all screenings for this child
        if (data.childId) {
          const prevRes = await fetch(
            `/api/screenings?childId=${data.childId}`,
          );
          const all = await prevRes.json();
          // Exclude current, keep rest sorted newest first
          setPreviousScreenings(all.filter((s) => s.id !== caseId));
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [caseId]);

  async function handleSaveReview() {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/screenings/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "reviewed",
          clinicianReview: {
            notes: clinicianNotes,
            action: clinicianAction,
            reviewedAt: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) throw new Error();
      setScreening((prev) => ({ ...prev, status: "reviewed" }));
      toast.success("Review saved successfully");
    } catch {
      toast.error("Failed to save review");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMarkActioned() {
    if (!clinicianNotes.trim()) {
      toast.error("Please add clinical notes before actioning");
      return;
    }
    setIsActioning(true);
    try {
      const res = await fetch(`/api/screenings/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "actioned",
          clinicianReview: {
            notes: clinicianNotes,
            action: clinicianAction,
            reviewedAt: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Case actioned — parent will be notified");
      router.push("/dashboard/clinician");
    } catch {
      toast.error("Failed to action case");
    } finally {
      setIsActioning(false);
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-9 w-32" />
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-72" />
          </div>
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-3xl" />
      </div>
    );
  }

  // ── Error ──
  if (error || !screening) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-800">Case not found</h3>
        <Button
          onClick={() => router.push("/dashboard/clinician")}
          className="bg-slate-800 hover:bg-slate-900 rounded-xl"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const risk = screening.riskAssessment;
  const riskCfg = RISK_CONFIG[risk?.level] || RISK_CONFIG.low;
  const RiskIcon = riskCfg.icon;
  const hasVideos = screening.videos?.length > 0;
  const hasAI =
    risk?.videoIndicators && Object.keys(risk.videoIndicators).length > 0;
  const videoAnalyses = risk?.videoAnalyses || [];
  const childAge = screening.childDob ? calculateAge(screening.childDob) : null;

  const STATUS_LABEL = {
    submitted: "New",
    under_review: "Reviewing",
    reviewed: "Reviewed",
    actioned: "Actioned",
  };
  const STATUS_COLOR = {
    submitted: "bg-blue-100 text-blue-700 border-blue-200",
    under_review: "bg-violet-100 text-violet-700 border-violet-200",
    reviewed: "bg-gray-100 text-gray-600 border-gray-200",
    actioned: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/dashboard/clinician">
        <Button
          variant="ghost"
          className="gap-2 text-gray-500 hover:text-gray-900 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </Link>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {screening.childName ||
                `Case ${caseId.slice(0, 6).toUpperCase()}`}
            </h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${STATUS_COLOR[screening.status] || STATUS_COLOR.submitted}`}
            >
              {STATUS_LABEL[screening.status] || "Unknown"}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            {childAge ? `${childAge.display}` : "Age unknown"}
            {screening.childGender
              ? ` • ${screening.childGender.charAt(0).toUpperCase() + screening.childGender.slice(1)}`
              : ""}{" "}
            • Case ID: {screening.id
                              ?.replace("screening-", "")
                              .slice(0, 8)
                              .toUpperCase()} • Submitted{" "}
            {formatDate(screening.submittedAt || screening.createdAt)}
          </p>
        </div>
        {risk && (
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border ${riskCfg.border} ${riskCfg.text}`}
          >
            <RiskIcon className="h-4 w-4" />
            {riskCfg.label}
          </div>
        )}
      </div>

      {/* ── Risk Alert Banner ── */}
      {risk && (
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${riskCfg.gradient} p-6 text-white shadow-lg`}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <RiskIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
                  AI Risk Assessment
                </p>
                <h3 className="text-xl font-bold">{riskCfg.label}</h3>
                {risk.explanation && (
                  <p className="text-white/80 text-sm mt-1 max-w-lg leading-relaxed line-clamp-2">
                    {risk.explanation}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              {[
                {
                  label: "Combined Score",
                  value: `${risk.combinedScore ?? risk.score}%`,
                },
                {
                  label: "Q Score",
                  value: `${screening.questionnaireScore}/15`,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl bg-white/15 px-4 py-3 text-center"
                >
                  <div className="text-xl font-bold">{value}</div>
                  <div className="text-white/60 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="rounded-xl bg-gray-100 p-1 w-full grid grid-cols-4">
          <TabsTrigger value="overview" className="rounded-lg text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="questionnaire" className="rounded-lg text-sm">
            Questionnaire
          </TabsTrigger>
          <TabsTrigger value="videos" className="rounded-lg text-sm">
            Videos {hasVideos ? `(${screening.videos.length})` : ""}
          </TabsTrigger>
          <TabsTrigger value="review" className="rounded-lg text-sm">
            Clinical Review
          </TabsTrigger>
        </TabsList>

        {/* ────────── OVERVIEW ────────── */}
        <TabsContent value="overview" className="mt-6 space-y-5">
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: ClipboardList,
                label: "Questions",
                value: `${screening.questionnaireResponses?.length ?? 0} answered`,
                color: "text-violet-600 bg-violet-50",
              },
              {
                icon: TrendingUp,
                label: "Q Score",
                value: `${screening.questionnaireScore ?? 0} / 15`,
                color: "text-indigo-600 bg-indigo-50",
              },
              {
                icon: Video,
                label: "Videos",
                value: hasVideos
                  ? `${screening.videos.length} uploaded`
                  : "None",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: Brain,
                label: "AI Analysis",
                value: hasAI ? "Available" : "Not available",
                color: "text-fuchsia-600 bg-fuchsia-50",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <Card key={label} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-4">
                  <div
                    className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 leading-none">
                    {value}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI behavioral indicators */}
          {hasAI && (
            <Card className="rounded-3xl border-0 shadow-md shadow-gray-100">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-fuchsia-100 flex items-center justify-center">
                    <Brain className="h-4 w-4 text-fuchsia-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Video Behavioral Indicators
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Extracted by Gemini AI from uploaded videos
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 grid md:grid-cols-2 gap-3">
                {Object.entries(risk.videoIndicators).map(([key, score]) => (
                  <IndicatorBar key={key} indicatorKey={key} score={score} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Video observations */}
          {videoAnalyses.length > 0 && (
            <Card className="rounded-3xl border-0 shadow-md shadow-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  AI Video Observations
                </CardTitle>
                <CardDescription className="text-xs">
                  Per-video summaries from Gemini analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {videoAnalyses.map((analysis, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {analysis.category === "social"
                          ? "👥"
                          : analysis.category === "play"
                            ? "🧸"
                            : "🌟"}
                      </span>
                      <span className="text-sm font-semibold capitalize">
                        {analysis.category} Video
                      </span>
                    </div>
                    {analysis.summary && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {analysis.summary}
                      </p>
                    )}
                    {analysis.observations?.length > 0 && (
                      <ul className="space-y-1">
                        {analysis.observations.map((obs, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-xs text-gray-500"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                            {obs}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* System recommendations */}
          {risk?.recommendations?.length > 0 && (
            <Card className="rounded-3xl border-0 shadow-md shadow-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  System Recommendations
                </CardTitle>
                <CardDescription className="text-xs">
                  AI-generated based on risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {risk.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50"
                  >
                    <CheckCircle className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ────────── QUESTIONNAIRE ────────── */}
        <TabsContent value="questionnaire" className="mt-6">
          <Card className="rounded-3xl border-0 shadow-md shadow-gray-100">
            <CardHeader>
              <CardTitle>Questionnaire Responses</CardTitle>
              <CardDescription>
                {screening.questionnaireResponses?.length ?? 0} questions
                answered • Score: {screening.questionnaireScore ?? 0} / 15
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!screening.questionnaireResponses?.length ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  No responses recorded.
                </p>
              ) : (
                screening.questionnaireResponses.map((response, i) => {
                  const hasConcern = response.points > 0;
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border transition-colors ${
                        hasConcern
                          ? "border-amber-200 bg-amber-50"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            {i + 1}.{" "}
                            {response.questionText || response.questionId}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-600">
                              Answer: <strong>{response.answer}</strong>
                            </span>
                            {hasConcern && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-200 text-amber-800">
                                +{response.points} concern pts
                              </span>
                            )}
                          </div>
                        </div>
                        {hasConcern && (
                          <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ────────── VIDEOS ────────── */}
        <TabsContent value="videos" className="mt-6">
          {!hasVideos ? (
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Video className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  No Videos Uploaded
                </h3>
                <p className="text-gray-400 text-sm">
                  Parent did not upload videos for this screening
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {screening.videos.map((video, i) => (
                <Card
                  key={i}
                  className="rounded-3xl border-0 shadow-md shadow-gray-100"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {video.category === "social"
                          ? "👥"
                          : video.category === "play"
                            ? "🧸"
                            : "🌟"}
                      </span>
                      <div>
                        <CardTitle className="text-base capitalize">
                          {video.category} Interaction
                        </CardTitle>
                        {video.uploadedAt && (
                          <CardDescription className="text-xs">
                            Uploaded {formatDate(video.uploadedAt)}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {video.url ? (
                      <video
                        controls
                        className="w-full rounded-2xl bg-black"
                        src={video.url}
                        style={{ maxHeight: "260px" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="bg-gray-100 rounded-2xl p-8 text-center">
                        <Video className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Video URL not available
                        </p>
                      </div>
                    )}

                    {/* Per-video AI analysis snippet */}
                    {(() => {
                      const analysis = videoAnalyses.find(
                        (a) => a.category === video.category,
                      );
                      return analysis?.summary ? (
                        <div className="mt-3 p-3 rounded-xl bg-violet-50 border border-violet-100">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Brain className="h-3.5 w-3.5 text-violet-500" />
                            <span className="text-xs font-semibold text-violet-600">
                              AI Observation
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {analysis.summary}
                          </p>
                        </div>
                      ) : null;
                    })()}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ────────── CLINICAL REVIEW ────────── */}
        <TabsContent value="review" className="mt-6 space-y-5">
          {/* Existing review banner if already saved */}
          {screening.clinicianReview && (
            <Alert className="rounded-2xl border-emerald-200 bg-emerald-50">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="text-emerald-800">
                Review Previously Saved
              </AlertTitle>
              <AlertDescription className="text-emerald-700 text-sm">
                Action: <strong>{screening.clinicianReview.action}</strong> •
                Saved {formatDate(screening.clinicianReview.reviewedAt)}
              </AlertDescription>
            </Alert>
          )}

          {/* Action selection */}
          <Card className="rounded-3xl border-0 shadow-md shadow-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recommended Action</CardTitle>
              <CardDescription className="text-sm">
                Select the appropriate clinical decision for this case
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {ACTION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setClinicianAction(opt.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    clinicianAction === opt.value
                      ? `${opt.color} border-current`
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        clinicianAction === opt.value
                          ? "border-current"
                          : "border-gray-300"
                      }`}
                    >
                      {clinicianAction === opt.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-current" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="rounded-3xl border-0 shadow-md shadow-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Clinical Notes</CardTitle>
              <CardDescription className="text-sm">
                Professional assessment and observations — will be included in
                the case record
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Textarea
                placeholder="Enter your clinical observations, findings, and recommendations..."
                value={clinicianNotes}
                onChange={(e) => setClinicianNotes(e.target.value)}
                rows={7}
                className="resize-none rounded-2xl border-gray-200 focus:border-violet-300 text-sm"
              />
              <p className="text-xs text-gray-400 mt-2">
                Notes are required to action a case.{" "}
                {clinicianNotes.length > 0 &&
                  `${clinicianNotes.length} characters`}
              </p>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSaveReview}
              disabled={isSaving || isActioning}
              variant="outline"
              className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 gap-2"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Draft
                </>
              )}
            </Button>
            <Button
              onClick={handleMarkActioned}
              disabled={isSaving || isActioning || !clinicianNotes.trim()}
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white rounded-xl gap-2 shadow-md"
            >
              {isActioning ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" /> Complete & Action
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            &ldquo;Complete & Action&rdquo; finalises the case and updates its
            status. Clinical notes are required.
          </p>
        </TabsContent>
      </Tabs>

      {/* ── Previous Screenings ── */}
      {previousScreenings.length > 0 && (
        <div className="space-y-3 pb-8">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <h3 className="font-semibold text-gray-700 text-sm">
              Previous Screenings ({previousScreenings.length})
            </h3>
          </div>
          {previousScreenings.map((s, i) => {
            const r = s.riskAssessment;
            const riskColor =
              r?.level === "high"
                ? "border-l-rose-400"
                : r?.level === "medium"
                  ? "border-l-amber-400"
                  : r?.level === "low"
                    ? "border-l-emerald-400"
                    : "border-l-gray-200";
            return (
              <div
                key={s.id}
                className={`border-l-4 ${riskColor} bg-gray-50 rounded-2xl p-4 flex items-center justify-between gap-4 hover:bg-gray-100 transition-colors cursor-pointer`}
                onClick={() => router.push(`/dashboard/clinician/case/${s.id}`)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-800">
                      {formatDate(s.submittedAt || s.createdAt)}
                    </span>
                    {r?.level && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          r.level === "high"
                            ? "bg-rose-100 text-rose-700"
                            : r.level === "medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {r.level.toUpperCase()}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        s.status === "actioned"
                          ? "bg-emerald-100 text-emerald-700"
                          : s.status === "reviewed"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {s.status === "actioned"
                        ? "Actioned"
                        : s.status === "reviewed"
                          ? "Reviewed"
                          : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Q Score: {s.questionnaireScore ?? "—"}/15
                    {s.videos?.length > 0
                      ? ` • ${s.videos.length} video(s)`
                      : " • No videos"}
                    {r?.combinedScore != null
                      ? ` • ${r.combinedScore}% risk score`
                      : ""}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
