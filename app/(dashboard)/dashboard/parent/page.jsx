"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus, User, Calendar, ClipboardList, AlertCircle,
  Trash2, CheckCircle, Activity, Stethoscope, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { calculateAge, formatDate } from "@/lib/utils";

// ── Skeleton primitives ──
function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-12" />
      </CardContent>
    </Card>
  );
}

function ChildCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-36" />
        <div className="pt-4 flex space-x-2">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── Clinician action config ──
const ACTION_CONFIG = {
  referral: {
    label: "Refer to Specialist",
    desc: "Your child has been referred for immediate specialist evaluation. Please contact your healthcare provider to schedule an appointment as soon as possible.",
    icon: Stethoscope,
    cardBorder: "border-rose-200",
    bg: "bg-rose-50 border-rose-200",
    iconColor: "text-rose-600",
    textColor: "text-rose-800",
    badge: "bg-rose-100 text-rose-700",
    noteBorder: "border-rose-200/60",
  },
  monitoring: {
    label: "Continue Monitoring",
    desc: "A follow-up screening has been recommended in 3–6 months. Continue observing your child's development at home.",
    icon: Activity,
    cardBorder: "border-amber-200",
    bg: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    textColor: "text-amber-800",
    badge: "bg-amber-100 text-amber-700",
    noteBorder: "border-amber-200/60",
  },
  routine: {
    label: "Routine Follow-up",
    desc: "No immediate concerns identified. Continue with standard developmental checks at your next regular visit.",
    icon: CheckCircle,
    cardBorder: "border-emerald-200",
    bg: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-800",
    badge: "bg-emerald-100 text-emerald-700",
    noteBorder: "border-emerald-200/60",
  },
};

export default function ParentDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [children, setChildren] = useState([]);
  const [screenings, setScreenings] = useState({});
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [newChild, setNewChild] = useState({
    name: "",
    dateOfBirth: "",
    gender: "male",
  });

  useEffect(() => {
    if (!isLoaded || !user) return;
    loadData();
  }, [isLoaded]);

  async function loadData() {
    setDataLoading(true);
    try {
      const res = await fetch("/api/children");
      const childList = await res.json();
      setChildren(childList);

      const screeningsMap = {};
      await Promise.all(
        childList.map(async (child) => {
          const sRes = await fetch(`/api/screenings?childId=${child.id}`);
          screeningsMap[child.id] = await sRes.json();
        }),
      );
      setScreenings(screeningsMap);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setDataLoading(false);
    }
  }

  async function handleAddChild() {
    if (!newChild.name || !newChild.dateOfBirth) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChild),
      });
      if (!res.ok) throw new Error("Failed to add child");
      const child = await res.json();
      setChildren([...children, child]);
      setScreenings({ ...screenings, [child.id]: [] });
      setNewChild({ name: "", dateOfBirth: "", gender: "male" });
      setIsAddingChild(false);
      toast.success(`${child.name} added successfully`);
    } catch {
      toast.error("Failed to add child");
    }
  }

  async function handleDeleteChild(childId, childName) {
    if (!confirm(`Are you sure you want to delete ${childName}? This will also delete all their screenings.`)) return;
    try {
      const res = await fetch(`/api/children/${childId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setChildren(children.filter((c) => c.id !== childId));
      const updated = { ...screenings };
      delete updated[childId];
      setScreenings(updated);
      toast.success(`${childName} removed`);
    } catch {
      toast.error("Failed to delete child");
    }
  }

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case "low":    return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high":   return "bg-red-100 text-red-800";
      default:       return "bg-gray-100 text-gray-800";
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-bold mb-2">
          Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
        </h2>
        <p className="text-gray-600">
          Manage your children and track their developmental screenings
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {dataLoading ? (
          <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Children</CardTitle>
                <User className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{children.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Screenings</CardTitle>
                <ClipboardList className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.values(screenings).reduce((sum, s) => sum + s.length, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">High Risk Alerts</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.values(screenings).filter(
                    (s) => s[0]?.riskAssessment?.level === "high"
                  ).length}
                </div>
                <p className="text-xs text-gray-500 mt-1">children flagged high risk</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Add Child header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Your Children</h3>
        <Dialog open={isAddingChild} onOpenChange={setIsAddingChild}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Child</DialogTitle>
              <DialogDescription>Add a child to start developmental screening</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Child&apos;s Name</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={newChild.name}
                  onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={newChild.dateOfBirth}
                  onChange={(e) => setNewChild({ ...newChild, dateOfBirth: e.target.value })}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={newChild.gender}
                  onValueChange={(value) => setNewChild({ ...newChild, gender: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingChild(false)}>Cancel</Button>
              <Button onClick={handleAddChild}>Add Child</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Children List */}
      {dataLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          <ChildCardSkeleton />
          <ChildCardSkeleton />
        </div>
      ) : children.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No children added yet</h3>
            <p className="text-gray-500 mb-4">Add a child to start developmental screening</p>
            <Button onClick={() => setIsAddingChild(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Child
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {children.map((child) => {
            const childScreenings = screenings[child.id] || [];
            const latestScreening = childScreenings[0];
            const age = calculateAge(child.dateOfBirth);

            const clinicianReview = latestScreening?.clinicianReview;
            const isActioned = latestScreening?.status === "actioned" && clinicianReview?.action;
            const actionCfg = isActioned ? ACTION_CONFIG[clinicianReview.action] : null;
            const ActionIcon = actionCfg?.icon;

            return (
              <Card
                key={child.id}
                className={`border-2 transition-colors ${isActioned && actionCfg ? actionCfg.cardBorder : "border-transparent"}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{child.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {age.display} • {child.gender.charAt(0).toUpperCase() + child.gender.slice(1)}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {latestScreening?.riskAssessment && (
                        <Badge className={getRiskBadgeColor(latestScreening.riskAssessment.level)}>
                          {latestScreening.riskAssessment.level.toUpperCase()} Risk
                        </Badge>
                      )}
                      {isActioned && actionCfg && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${actionCfg.badge}`}>
                          ✓ Clinician Reviewed
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Born: {new Date(child.dateOfBirth).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    {childScreenings.length} screening{childScreenings.length !== 1 ? "s" : ""} completed
                  </div>

                  {/* ── Clinician Decision Banner ── */}
                  {isActioned && actionCfg && ActionIcon && (
                    <div className={`rounded-xl border p-4 ${actionCfg.bg}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <ActionIcon className={`h-4 w-4 flex-shrink-0 ${actionCfg.iconColor}`} />
                        <span className={`text-sm font-bold ${actionCfg.textColor}`}>
                          Clinical Decision: {actionCfg.label}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${actionCfg.textColor} opacity-80 mb-2`}>
                        {actionCfg.desc}
                      </p>
                      {clinicianReview.notes && (
                        <div className={`mt-2 pt-2 border-t ${actionCfg.noteBorder}`}>
                          <p className={`text-xs font-semibold mb-0.5 ${actionCfg.textColor} opacity-70`}>
                            Clinician Notes:
                          </p>
                          <p className={`text-xs leading-relaxed ${actionCfg.textColor} opacity-75 line-clamp-3`}>
                            {clinicianReview.notes}
                          </p>
                        </div>
                      )}
                      {clinicianReview.reviewedAt && (
                        <p className={`text-xs mt-2 ${actionCfg.textColor} opacity-50`}>
                          Reviewed on {formatDate(clinicianReview.reviewedAt)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── Awaiting review notice ── */}
                  {latestScreening && !isActioned && ["submitted", "under_review"].includes(latestScreening.status) && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <p className="text-xs text-blue-700 font-medium">
                        {latestScreening.status === "under_review"
                          ? "A clinician is currently reviewing this screening."
                          : "Screening submitted — awaiting clinician review."}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex space-x-2">
                    <Button
                      className="flex-1"
                      onMouseEnter={() => router.prefetch(`/dashboard/parent/screening/${child.id}`)}
                      onClick={() => router.push(`/dashboard/parent/screening/${child.id}`)}
                    >
                      New Screening
                    </Button>
                    {childScreenings.length > 0 && (
                      <Button
                        variant="outline"
                        onMouseEnter={() => router.prefetch(`/dashboard/parent/screening/result/${latestScreening.id}`)}
                        onClick={() => router.push(`/dashboard/parent/screening/result/${latestScreening.id}`)}
                      >
                        View Latest
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteChild(child.id, child.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 text-sm">
          <p>
            This screening tool is designed to identify children who may benefit
            from further evaluation. It is not a diagnostic tool. If you have
            concerns about your child&apos;s development, please consult with a
            qualified healthcare professional.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}