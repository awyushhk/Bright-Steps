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
  Plus,
  User,
  Calendar,
  ClipboardList,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { calculateAge } from "@/lib/utils";

export default function ParentDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [children, setChildren] = useState([]);
  const [screenings, setScreenings] = useState({});
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChild, setNewChild] = useState({
    name: "",
    dateOfBirth: "",
    gender: "male",
  });

  useEffect(() => {
    if (!isLoaded || !user) return;
    loadData();
  }, [isLoaded, user]);

  async function loadData() {
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
    } catch (err) {
      toast.error("Failed to add child");
    }
  }

  async function handleDeleteChild(childId, childName) {
    if (
      !confirm(
        `Are you sure you want to delete ${childName}? This will also delete all their screenings.`,
      )
    )
      return;

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
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Children
            </CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{children.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Screenings
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(screenings).reduce(
                (sum, s) =>
                  sum + s.filter((sc) => sc.status === "submitted").length,
                0,
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Child */}
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
              <DialogDescription>
                Add a child to start developmental screening
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Child&apos;s Name</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={newChild.name}
                  onChange={(e) =>
                    setNewChild({ ...newChild, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={newChild.dateOfBirth}
                  onChange={(e) =>
                    setNewChild({ ...newChild, dateOfBirth: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={newChild.gender}
                  onValueChange={(value) =>
                    setNewChild({ ...newChild, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingChild(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddChild}>Add Child</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Children List */}
      {children.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No children added yet
            </h3>
            <p className="text-gray-500 mb-4">
              Add a child to start developmental screening
            </p>
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

            return (
              <Card key={child.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{child.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {age.display} •{" "}
                        {child.gender.charAt(0).toUpperCase() +
                          child.gender.slice(1)}
                      </CardDescription>
                    </div>
                    {latestScreening?.riskAssessment && (
                      <Badge
                        className={getRiskBadgeColor(
                          latestScreening.riskAssessment.level,
                        )}
                      >
                        {latestScreening.riskAssessment.level.toUpperCase()}{" "}
                        Risk
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Born: {new Date(child.dateOfBirth).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    {childScreenings.length} screening
                    {childScreenings.length !== 1 ? "s" : ""} completed
                  </div>
                  <div className="pt-4 flex space-x-2">
                    <Button
                      className="flex-1"
                      onClick={() =>
                        router.push(`/dashboard/parent/screening/${child.id}`)
                      }
                    >
                      New Screening
                    </Button>
                    {childScreenings.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/dashboard/parent/screening/result/${latestScreening.id}`,
                          )
                        }
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
