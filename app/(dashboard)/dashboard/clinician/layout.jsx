import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Brain, Users, Activity, Shield, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-indigo-600" />

            <div className="flex flex-col leading-tight">
              <Link
                href="/"
                className="text-2xl md:text-3xl font-extrabold tracking-tight"
              >
                <span className="text-indigo-600">Bright</span>
                <span className="font-extrabold ml-2">Steps</span>
              </Link>

              <span className="text-xs md:text-sm text-slate-400 tracking-wide">
                Clinician Dashboard
              </span>
            </div>
          </div>

          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9", 
              },
            }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
