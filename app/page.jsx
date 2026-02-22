"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Users, ClipboardList, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Brain className="h-9 w-9 text-indigo-600" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="text-indigo-600">Bright</span>
              <span className="ml-2 text-slate-900">Steps</span>
            </h1>
          </div>

          <div className="space-x-3">
            <Button variant="ghost" onClick={() => router.push("/sign-in")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/sign-up")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-24">
           <p className="text-sm font-medium text-indigo-600 mb-4 tracking-wide uppercase -mt-10">
    AI-Enabled Decision Support Platform for Early Detection of Autism
  </p>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Small Signs Today.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Stronger Steps Tomorrow.
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            Bright Steps helps families notice early developmental patterns through simple guidance and structured observations at home, giving you clearer insight when it matters most.
          </p>

          <Button size="lg" onClick={() => router.push("/sign-up")}>
            Begin Screening
          </Button>
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Users className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Made for Families</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Answer guided questions and record short home videos
              designed around everyday interactions.
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <ClipboardList className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Structured Review</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Observations are organized into clear summaries
              that help support thoughtful decision-making.
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Brain className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Behavioral Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Subtle developmental patterns are highlighted
              to assist understanding over time.
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Shield className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Clinically Responsible</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Designed to assist professional judgment
              within a transparent and guided workflow.
            </CardContent>
          </Card>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t py-10 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Bright Steps</p>
          <p className="mt-2">
            Supporting early developmental clarity through thoughtful technology.
          </p>
        </div>
      </footer>
    </div>
  );
}