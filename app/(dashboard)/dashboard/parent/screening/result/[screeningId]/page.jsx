'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ArrowLeft, Printer, AlertCircle, CheckCircle, AlertTriangle,
  ClipboardList, Video, Star, Eye, Volume2, Heart, Repeat, Hand, Brain,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const INDICATOR_CONFIG = {
  eye_contact:          { label: 'Eye Contact',           icon: Eye,     description: 'Ability to make and maintain eye contact' },
  response_to_name:     { label: 'Response to Name',      icon: Volume2, description: 'Responding when called by name' },
  social_engagement:    { label: 'Social Engagement',     icon: Heart,   description: 'Interest in interacting with others' },
  repetitive_movements: { label: 'Repetitive Movements',  icon: Repeat,  description: 'Presence of repetitive behaviors (higher = fewer observed)' },
  pointing_gesturing:   { label: 'Pointing & Gesturing',  icon: Hand,    description: 'Using gestures to communicate' },
};

function IndicatorBar({ indicatorKey, score }) {
  const config = INDICATOR_CONFIG[indicatorKey];
  if (!config) return null;
  const Icon = config.icon;

  const getColor = (s) => {
    if (s >= 7) return { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (s >= 4) return { bar: 'bg-amber-500',   text: 'text-amber-600',   bg: 'bg-amber-50'   };
    return              { bar: 'bg-rose-500',    text: 'text-rose-600',    bg: 'bg-rose-50'    };
  };
  const colors = getColor(score);

  return (
    <div className={`p-4 rounded-2xl ${colors.bg} border border-white`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${colors.text}`} />
          <span className="text-sm font-semibold text-gray-800">{config.label}</span>
        </div>
        <span className={`text-sm font-bold ${colors.text}`}>{score}/10</span>
      </div>
      <div className="h-2 rounded-full bg-white/70">
        <div
          className={`h-2 rounded-full ${colors.bar} transition-all duration-700`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1.5">{config.description}</p>
    </div>
  );
}

export default function ResultsPage({ params }) {
  const router = useRouter();
  const { screeningId } = use(params);
  const [screening, setScreening] = useState(null);
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ✅ Only depend on screeningId — NOT router
  useEffect(() => {
    async function fetchData() {
      try {
        const sRes = await fetch(`/api/screenings/${screeningId}`);
        if (!sRes.ok) {
          setError(true);  // ← don't redirect, just show error
          setLoading(false);
          return;
        }
        const screeningData = await sRes.json();
        setScreening(screeningData);

        const cRes = await fetch('/api/children');
        const children = await cRes.json();
        const found = children.find((c) => c.id === screeningData.childId);
        setChild(found || null);
      } catch {
        setError(true);  // ← don't redirect on error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [screeningId]); // ← removed router

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          <p className="text-sm text-violet-500 font-medium">Loading results...</p>
        </div>
      </div>
    );
  }

  // ✅ Show proper error state instead of returning null or redirecting
  if (error || !screening) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-800">Screening not found</h3>
        <p className="text-gray-400 text-sm">This screening may have been deleted or doesn&apos;t exist.</p>
        <Button onClick={() => router.push('/dashboard/parent')} className="bg-violet-600 hover:bg-violet-700 rounded-xl">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const { riskAssessment } = screening;
  if (!riskAssessment) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <p className="text-gray-400 text-sm">No risk assessment data found.</p>
        <Button onClick={() => router.push('/dashboard/parent')} className="bg-violet-600 hover:bg-violet-700 rounded-xl">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const riskConfigs = {
    low: {
      gradient: 'from-emerald-500 to-teal-600',
      lightBg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      icon: <CheckCircle className="h-10 w-10 text-white" />,
      label: 'Low Risk',
    },
    medium: {
      gradient: 'from-amber-500 to-orange-500',
      lightBg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      icon: <AlertTriangle className="h-10 w-10 text-white" />,
      label: 'Medium Risk',
    },
    high: {
      gradient: 'from-rose-500 to-red-600',
      lightBg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      icon: <AlertCircle className="h-10 w-10 text-white" />,
      label: 'High Risk',
    },
  };

  const config = riskConfigs[riskAssessment.level] || riskConfigs.low;
  const hasVideoAnalysis = riskAssessment.videoIndicators && Object.keys(riskAssessment.videoIndicators).length > 0;
  const videoAnalyses = riskAssessment.videoAnalyses || [];
  const scorePercentage = Math.min(((riskAssessment.combinedScore ?? riskAssessment.score) / 100) * 100, 100);

  // Child name fallback if child failed to load
  const childName = child?.name || 'Your child';

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <Link href="/dashboard/parent">
        <Button variant="ghost" className="gap-2 text-gray-500 hover:text-gray-900 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </Link>

      {/* ── Hero ── */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${config.gradient} p-7 text-white shadow-xl`}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">Screening Results</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              {config.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold leading-none">{config.label}</h1>
              <p className="text-white/80 text-sm mt-1">
                {hasVideoAnalysis ? 'Based on questionnaire + video analysis' : 'Based on questionnaire responses'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/15 backdrop-blur px-4 py-3">
              <p className="text-white/60 text-xs mb-0.5">Child</p>
              <p className="font-bold text-base">{childName}</p>
            </div>
            <div className="rounded-2xl bg-white/15 backdrop-blur px-4 py-3">
              <p className="text-white/60 text-xs mb-0.5">Completed</p>
              <p className="font-bold text-base">{formatDate(screening.submittedAt || screening.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Explanation ── */}
      {riskAssessment.explanation && (
        <Card className="rounded-3xl border-0 shadow-md shadow-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                <Brain className="h-4 w-4 text-violet-600" />
              </div>
              <h3 className="font-bold text-gray-900">AI Risk Summary</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed bg-violet-50 rounded-2xl p-4">
              {riskAssessment.explanation}
            </p>

            {riskAssessment.breakdown && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-2xl bg-gray-50">
                  <div className="text-lg font-bold text-gray-900">
                    {riskAssessment.breakdown.questionnaireConcern}%
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Questionnaire Concern</div>
                  <div className="text-xs text-gray-400">(60% weight)</div>
                </div>
                <div className="text-center p-3 rounded-2xl bg-gray-50">
                  <div className="text-lg font-bold text-gray-900">
                    {riskAssessment.breakdown.videoConcern !== null
                      ? `${riskAssessment.breakdown.videoConcern}%`
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Video Concern</div>
                  <div className="text-xs text-gray-400">(40% weight)</div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Combined Risk Score</span>
                <span className="font-semibold">{riskAssessment.combinedScore ?? riskAssessment.score}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100">
                <div
                  className={`h-2.5 rounded-full transition-all duration-1000 ${
                    riskAssessment.level === 'high' ? 'bg-rose-500' :
                    riskAssessment.level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${scorePercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low Risk</span>
                <span>High Risk</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Video Analysis Indicators ── */}
      {hasVideoAnalysis && (
        <Card className="rounded-3xl border-0 shadow-md shadow-gray-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Video className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-base">Video Behavioral Analysis</CardTitle>
                <CardDescription className="text-xs">
                  Analyzed by Gemini AI • {videoAnalyses.length} video{videoAnalyses.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {Object.entries(riskAssessment.videoIndicators).map(([key, score]) => (
              <IndicatorBar key={key} indicatorKey={key} score={score} />
            ))}

            {videoAnalyses.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Video Observations</h4>
                {videoAnalyses.map((analysis, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gray-50 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {analysis.category === 'social' ? '👥' : analysis.category === 'play' ? '🧸' : '🌟'}
                      </span>
                      <span className="text-sm font-semibold text-gray-800 capitalize">
                        {analysis.category} Video
                      </span>
                    </div>
                    {analysis.summary && (
                      <p className="text-sm text-gray-600 leading-relaxed">{analysis.summary}</p>
                    )}
                    {analysis.observations?.length > 0 && (
                      <ul className="space-y-1">
                        {analysis.observations.map((obs, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                            {obs}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: ClipboardList, label: 'Questions', value: screening.questionnaireResponses?.length ?? 0, color: 'text-violet-600', bg: 'bg-violet-50' },
          { icon: Star, label: 'Q Score', value: `${screening.questionnaireScore}/15`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { icon: Video, label: 'Videos', value: screening.videos?.length ?? 0, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label} className="rounded-2xl border-0 shadow-sm bg-white">
            <CardContent className="p-4 text-center">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="text-xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Recommendations ── */}
      <Card className="rounded-3xl border-0 shadow-md shadow-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-gray-900">Recommendations</CardTitle>
          <CardDescription className="text-sm">Next steps based on your child&apos;s results</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {riskAssessment.recommendations?.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50">
              <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="h-3.5 w-3.5 text-violet-600" />
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Disclaimer ── */}
      <Alert className="rounded-2xl border-blue-100 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-900 text-sm font-semibold">Medical Disclaimer</AlertTitle>
        <AlertDescription className="text-blue-700 text-sm leading-relaxed">
          This AI-assisted screening provides preliminary assessment only and does not constitute a medical diagnosis.
          Always consult a qualified healthcare professional for comprehensive evaluation.
        </AlertDescription>
      </Alert>

      {/* ── Actions ── */}
      <div className="flex gap-3 pb-8">
        <Button
          onClick={() => router.push('/dashboard/parent')}
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-md shadow-violet-200"
        >
          Back to Dashboard
        </Button>
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="rounded-xl border-gray-200 hover:bg-gray-50 gap-2"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

    </div>
  );
}