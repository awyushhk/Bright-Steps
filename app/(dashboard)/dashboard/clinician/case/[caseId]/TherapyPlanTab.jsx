"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus, Trash2, ClipboardList, CheckCircle,
  ArrowRight, Sparkles, Calendar, Activity,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

const THERAPY_TYPE_OPTIONS = [
  "Applied Behavior Analysis (ABA)",
  "Speech & Language Therapy",
  "Occupational Therapy",
  "Social Skills Training",
  "Play Therapy",
  "Cognitive Behavioral Therapy (CBT)",
  "Sensory Integration Therapy",
  "Parent-Mediated Therapy",
];

const FREQUENCY_OPTIONS = [
  "Daily",
  "3x per week",
  "2x per week",
  "Weekly",
  "Bi-weekly",
  "Monthly",
];

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

export default function TherapyPlanTab({ screening }) {
  const router = useRouter();
  const childId = screening?.childId;

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    therapyTypes: [],
    frequency: "",
    goals: [""],
    notes: "",
  });

  useEffect(() => {
    if (!childId) return;
    loadPlans();
  }, [childId]);

  async function loadPlans() {
    setLoading(true);
    try {
      const res = await fetch(`/api/therapy/plans?childId=${childId}`);
      const data = await res.json();
      setPlans(data);
    } catch {
      toast.error("Failed to load therapy plans");
    } finally {
      setLoading(false);
    }
  }

  function toggleTherapyType(type) {
    setForm(prev => ({
      ...prev,
      therapyTypes: prev.therapyTypes.includes(type)
        ? prev.therapyTypes.filter(t => t !== type)
        : [...prev.therapyTypes, type],
    }));
  }

  function updateGoal(index, value) {
    const updated = [...form.goals];
    updated[index] = value;
    setForm(prev => ({ ...prev, goals: updated }));
  }

  function addGoal() {
    setForm(prev => ({ ...prev, goals: [...prev.goals, ""] }));
  }

  function removeGoal(index) {
    setForm(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  }

  async function handleCreate() {
    if (!form.title.trim()) { toast.error("Plan title is required"); return; }
    if (form.therapyTypes.length === 0) { toast.error("Select at least one therapy type"); return; }
    if (!form.frequency) { toast.error("Select a session frequency"); return; }

    const cleanGoals = form.goals.filter(g => g.trim());
    if (cleanGoals.length === 0) { toast.error("Add at least one goal"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/therapy/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          title: form.title,
          therapyTypes: form.therapyTypes,
          frequency: form.frequency,
          goals: cleanGoals,
          notes: form.notes,
        }),
      });
      if (!res.ok) throw new Error();
      const plan = await res.json();
      setPlans(prev => [plan, ...prev]);
      setCreating(false);
      setForm({ title: "", therapyTypes: [], frequency: "", goals: [""], notes: "" });
      toast.success("Therapy plan created successfully");
    } catch {
      toast.error("Failed to create therapy plan");
    } finally {
      setSaving(false);
    }
  }

  const STATUS_CONFIG = {
    active:    { color: "bg-emerald-100 text-emerald-700", label: "Active"    },
    paused:    { color: "bg-amber-100 text-amber-700",     label: "Paused"    },
    completed: { color: "bg-gray-100 text-gray-600",       label: "Completed" },
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Therapy Plans</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Create and manage therapy plans for {screening?.childName ?? "this child"}
          </p>
        </div>
        {!creating && (
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2"
            onClick={() => setCreating(true)}
          >
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        )}
      </div>

      {/* Create Form */}
      {creating && (
        <Card className="border-2 border-indigo-200 rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Create Therapy Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title">Plan Title</Label>
              <Input
                id="title"
                placeholder="e.g. ABA + Speech Therapy — Phase 1"
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            {/* Therapy Types */}
            <div className="space-y-2">
              <Label>Therapy Types</Label>
              <div className="flex flex-wrap gap-2">
                {THERAPY_TYPE_OPTIONS.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleTherapyType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      form.therapyTypes.includes(type)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div className="space-y-1.5">
              <Label>Session Frequency</Label>
              <Select
                value={form.frequency}
                onValueChange={v => setForm(prev => ({ ...prev, frequency: v }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Goals */}
            <div className="space-y-2">
              <Label>Therapy Goals</Label>
              <div className="space-y-2">
                {form.goals.map((goal, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder={`Goal ${i + 1} — e.g. Improve eye contact during play`}
                      value={goal}
                      onChange={e => updateGoal(i, e.target.value)}
                      className="rounded-xl"
                    />
                    {form.goals.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl flex-shrink-0"
                        onClick={() => removeGoal(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  onClick={addGoal}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Goal
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes">Additional Notes <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Textarea
                id="notes"
                placeholder="Any additional context, precautions, or instructions for caregivers..."
                value={form.notes}
                onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                onClick={handleCreate}
                disabled={saving}
              >
                {saving ? "Creating…" : "Create Plan"}
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setCreating(false)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : plans.length === 0 && !creating ? (
        <Card className="border-2 border-dashed border-gray-200 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-14">
            <ClipboardList className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">No therapy plans yet</h3>
            <p className="text-gray-400 text-sm mb-4">
              Create a plan to start tracking therapy progress
            </p>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2"
              onClick={() => setCreating(true)}
            >
              <Plus className="h-4 w-4" />
              Create First Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.map(plan => {
            const statusCfg = STATUS_CONFIG[plan.status] ?? STATUS_CONFIG.active;
            return (
              <Card key={plan.id} className="rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{plan.title}</h4>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {formatDate(plan.createdAt)}
                        {plan.frequency && <span className="ml-2">• {plan.frequency}</span>}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl gap-1.5 text-xs"
                      onClick={() => router.push(`/dashboard/clinician/therapy/${plan.id}`)}
                    >
                      View Plan <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Therapy types */}
                  {plan.therapyTypes?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {plan.therapyTypes.map(t => (
                        <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Goals */}
                  {plan.goals?.length > 0 && (
                    <div className="space-y-1">
                      {plan.goals.slice(0, 3).map((goal, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                          {goal}
                        </div>
                      ))}
                      {plan.goals.length > 3 && (
                        <p className="text-xs text-gray-400 ml-5">+{plan.goals.length - 3} more goals</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}