import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Brain } from "lucide-react";
import ClinicianGuard from "./ClinicianGuard";

export default function ClinicianDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-indigo-600" />
            <div className="flex flex-col leading-tight">
              <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tight">
                <span className="text-indigo-600">Bright</span>
                <span className="font-extrabold ml-2">Steps</span>
              </Link>
              <span className="text-xs md:text-sm text-slate-400 tracking-wide">
                Clinician Dashboard
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard/clinician"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Cases
            </Link>
            <Link
              href="/dashboard/clinician/analytics"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="/dashboard/parent"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Patients
            </Link>
          </nav>

          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{ elements: { avatarBox: "h-9 w-9" } }}
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <ClinicianGuard>{children}</ClinicianGuard>
      </main>
    </div>
  );
}