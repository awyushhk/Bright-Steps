import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Brain, Shield, Users } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 border-b border-indigo-100 bg-white/70 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-1 hover:opacity-90 transition"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center">
            <Brain className="h-7 w-7 text-indigo-600" />
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            <span className="text-indigo-600">Bright</span>
            <span className="ml-1 text-slate-900">Steps</span>
          </h1>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Section */}
          <div className="space-y-8">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-200 bg-indigo-50 text-indigo-700">
              <Shield className="w-4 h-4" />
              Secure Access
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Welcome Back
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Sign in to continue your screening journey. 
              Your information remains private, protected, and handled with care.
            </p>

            {/* Role Info */}
            <div className="space-y-6 pt-4">

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Parents
                  </h3>
                  <p className="text-sm text-slate-600">
                    Access questionnaires, upload home observations, and review summaries.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Clinicians
                  </h3>
                  <p className="text-sm text-slate-600">
                    Review structured case insights and manage screening workflows.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Section - Clerk */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "w-full shadow-lg border border-indigo-100",
                    headerTitle: "text-slate-900",
                    headerSubtitle: "text-slate-500",
                    formButtonPrimary:
                      "bg-indigo-600 hover:bg-indigo-700 text-white",
                  },
                }}
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}