import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Brain, Users, Stethoscope } from "lucide-react";

export default async function SignUpPage({ searchParams }) {
  const params = await searchParams;
  const selectedRole = params?.role ?? "parent";

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
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Section - Role Selection & Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Create Your Account
              </h2>
              <p className="text-lg text-slate-600">
                Choose how you will be using BrightSteps
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Parent */}
              <Link
                href="/sign-up?role=parent"
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedRole === "parent"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-indigo-100 hover:border-indigo-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedRole === "parent"
                        ? "bg-indigo-600"
                        : "bg-indigo-100"
                    }`}
                  >
                    <Users
                      className={`w-5 h-5 ${
                        selectedRole === "parent"
                          ? "text-white"
                          : "text-indigo-600"
                      }`}
                    />
                  </div>

                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">
                      Parent or Guardian
                    </h3>
                    <p className="text-sm text-slate-600">
                      Complete guided screenings and upload observations
                    </p>
                  </div>
                </div>
              </Link>

              {/* Clinician */}
              <Link
                href="/sign-up?role=clinician"
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedRole === "clinician"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-indigo-100 hover:border-indigo-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedRole === "clinician"
                        ? "bg-indigo-600"
                        : "bg-indigo-100"
                    }`}
                  >
                    <Stethoscope
                      className={`w-5 h-5 ${
                        selectedRole === "clinician"
                          ? "text-white"
                          : "text-indigo-600"
                      }`}
                    />
                  </div>

                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">
                      Clinician
                    </h3>
                    <p className="text-sm text-slate-600">
                      Review structured cases and manage workflows
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Info Section */}
            <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-1">
                {selectedRole === "parent"
                  ? "For Parents and Guardians"
                  : "For Healthcare Professionals"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedRole === "parent"
                  ? "Bright Steps helps you document early developmental behaviors through structured guidance and home observations."
                  : "BrightSteps supports structured case review and organized screening workflows within clinical settings."}
              </p>
            </div>
          </div>

          {/* Right Section - Clerk SignUp */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <SignUp
                unsafeMetadata={{ role: selectedRole }}
                localization={{
                  signUp: {
                    start: {
                      title: "Create your Bright Steps account",
                    },
                  },
                }}
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
                path="/sign-up"
                signInUrl="/sign-in"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}