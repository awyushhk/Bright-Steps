"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, ClipboardList, Shield, ChevronRight, Menu, X, Star, Target, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const isLoggedIn = isLoaded && !!user;

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Brain className="h-9 w-9 text-indigo-600" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="text-indigo-600">Bright</span>
              <span className="ml-2 text-slate-900">Steps</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#about-asd"    className="hover:text-indigo-600 transition-colors">About ASD</a>
            <a href="#features"     className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#faq"          className="hover:text-indigo-600 transition-colors">FAQ</a>
          </nav>

          {/* Desktop CTA — conditional on auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button
                  className="text-sm bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { avatarBox: "h-9 w-9" } }}
                />
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-sm" onClick={() => router.push("/sign-in")}>
                  Sign In
                </Button>
                <Button
                  className="text-sm bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5"
                  onClick={() => router.push("/sign-up")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
            {["How It Works", "About ASD", "Features", "FAQ"].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="block text-sm font-medium text-gray-700 hover:text-indigo-600 py-1"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex gap-2 pt-2 items-center">
              {isLoggedIn ? (
                <>
                  <Button
                    className="flex-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                    onClick={() => { router.push("/dashboard"); setMenuOpen(false); }}
                  >
                    Dashboard
                  </Button>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{ elements: { avatarBox: "h-9 w-9" } }}
                  />
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1 text-sm rounded-xl" onClick={() => router.push("/sign-in")}>
                    Sign In
                  </Button>
                  <Button
                    className="flex-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                    onClick={() => router.push("/sign-up")}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://plus.unsplash.com/premium_photo-1661696107834-b2630692aaeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 via-transparent to-transparent" />

        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Star className="h-3 w-3" />
              AI-Enabled Decision Support Platform for Early Detection of Autism
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Small Signs Today.
              <br />
              <span className="bg-gradient-to-r from-indigo-300 to-indigo-500 bg-clip-text text-transparent">
                Stronger Steps Tomorrow.
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-xl">
              Bright Steps helps families notice early developmental patterns through simple guidance and structured observations at home, giving you clearer insight when it matters most.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 text-base shadow-lg shadow-indigo-900/40"
                onClick={() => router.push(isLoggedIn ? "/dashboard" : "/sign-up")}
              >
                {isLoggedIn ? "Go to Dashboard" : "Begin Screening"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8 text-base backdrop-blur-sm bg-white/5"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-indigo-600 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { value: "5,000+",  label: "Screenings Completed" },
              { value: "94%",     label: "Accuracy Rate"         },
              { value: "4",       label: "Age Groups Covered"    },
              { value: "10 min",  label: "Avg. Time to Complete" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl md:text-4xl font-extrabold">{value}</div>
                <div className="text-indigo-200 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Three simple steps to gain valuable insights into your child&apos;s development.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Add Your Child",      desc: "Create a profile with your child's age and basic information.",                                    icon: Users        },
              { step: "2", title: "Complete Screening",  desc: "Answer age-appropriate questions and optionally upload a short video.",                            icon: ClipboardList },
              { step: "3", title: "View Results",        desc: "Receive a comprehensive AI-assisted assessment with clear risk indicators.",                        icon: Target       },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="flex flex-col items-center text-center relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+48px)] w-[calc(100%-48px)] h-0.5 bg-indigo-100 z-0" />
                )}
                <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
                  <span className="text-2xl font-extrabold text-white">{step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ASD ── */}
      <section id="about-asd" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=700&q=80"
                  alt="Parent with child"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-indigo-600 text-white rounded-2xl px-5 py-3 shadow-lg">
                <div className="text-2xl font-extrabold">1 in 36</div>
                <div className="text-indigo-200 text-xs">children diagnosed with ASD</div>
              </div>
            </div>
            <div>
              <span className="text-indigo-600 text-sm font-semibold uppercase tracking-widest">Understanding</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-6 leading-tight">
                What is Autism Spectrum Disorder?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Autism spectrum disorder (ASD) is a neurodevelopmental condition defined by persistent differences in social communication and interaction, accompanied by restricted or repetitive patterns of behavior.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                The signs of ASD are often visible in early childhood. With appropriate early intervention, children with ASD can lead productive and fulfilling lives. Early identification is key, and that&apos;s exactly what Bright Steps is designed to support.
              </p>
              <div className="space-y-3">
                {[
                  "Early detection significantly improves outcomes",
                  "Signs can appear as early as 6 months",
                  "Every child develops at their own pace",
                ].map(point => (
                  <div key={point} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
              <Button
                className="mt-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                onClick={() => router.push(isLoggedIn ? "/dashboard" : "/sign-up")}
              >
                {isLoggedIn ? "Go to Dashboard" : "Start Free Screening"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-indigo-600 text-sm font-semibold uppercase tracking-widest">Why Bright Steps</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">Built for Families & Clinicians</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every feature is designed with one goal — earlier, clearer, and more accessible developmental support.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users,       title: "Made for Families",      desc: "Answer guided questions and record short home videos designed around everyday interactions.",                     color: "bg-indigo-50 text-indigo-600"  },
              { icon: ClipboardList, title: "Structured Review",    desc: "Observations are organized into clear summaries that help support thoughtful decision-making.",                  color: "bg-violet-50 text-violet-600"  },
              { icon: Brain,       title: "Behavioral Insights",    desc: "Subtle developmental patterns are highlighted using Gemini AI to assist understanding over time.",               color: "bg-fuchsia-50 text-fuchsia-600" },
              { icon: Shield,      title: "Clinically Responsible", desc: "Designed to assist professional judgment within a transparent and accountable workflow.",                        color: "bg-emerald-50 text-emerald-600" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <Card key={title} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-3xl bg-white">
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base font-bold">{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-500 leading-relaxed">{desc}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1600&q=80')` }}
        />
        <div className="absolute inset-0 bg-indigo-900/80" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Your child&apos;s development<br />deserves early attention.
          </h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Start a free screening today. No clinical knowledge required — just your observations as a parent.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl px-8 font-bold"
              onClick={() => router.push(isLoggedIn ? "/dashboard" : "/sign-up")}
            >
              {isLoggedIn ? "Go to Dashboard" : "Begin Free Screening"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            {!isLoggedIn && (
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8 bg-white/5"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <span className="text-indigo-600 text-sm font-semibold uppercase tracking-widest">Questions</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Frequently Asked</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is this a medical diagnosis?",         a: "No. Bright Steps is a screening support tool designed to help families and clinicians identify potential developmental concerns early. It does not replace a formal clinical evaluation or diagnosis." },
              { q: "Who can use Bright Steps?",            a: "Parents and guardians of children aged 6 months to 5 years can complete screenings. Clinicians also have access to a dedicated dashboard to review and manage submitted cases." },
              { q: "How long does a screening take?",      a: "Most screenings take around 10–15 minutes to complete, including answering the questionnaire and optionally uploading a short video." },
              { q: "Is my child's data secure?",           a: "Yes. All data is encrypted and stored securely. Videos are stored on Cloudinary with controlled access, and your personal information is never shared without consent." },
              { q: "What happens after I submit a screening?", a: "A risk assessment is generated immediately using AI. If your account is connected to a clinical team, a clinician will review the case and follow up with recommendations." },
            ].map(({ q, a }, i) => (
              <details key={i} className="group border border-gray-100 rounded-2xl bg-gray-50 open:bg-white open:shadow-sm transition-all">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 text-sm list-none">
                  {q}
                  <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0 ml-3" />
                </summary>
                <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 py-14">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-extrabold text-white">
                  Bright <span className="text-indigo-400">Steps</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Supporting early developmental clarity through thoughtful, AI-assisted technology for families and clinicians.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                {["How It Works", "About ASD", "Features", "FAQ"].map(l => (
                  <li key={l}><a href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="hover:text-indigo-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                {isLoggedIn ? (
                  <li>
                    <button onClick={() => router.push("/dashboard")} className="hover:text-indigo-400 transition-colors text-left">
                      Dashboard
                    </button>
                  </li>
                ) : (
                  <>
                    <li><button onClick={() => router.push("/sign-in")} className="hover:text-indigo-400 transition-colors text-left">Sign In</button></li>
                    <li><button onClick={() => router.push("/sign-up")} className="hover:text-indigo-400 transition-colors text-left">Sign Up</button></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <p>© 2026 Bright Steps. All rights reserved.</p>
            <p className="text-slate-500">Not a diagnostic tool. Always consult a qualified healthcare professional.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}