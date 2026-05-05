"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Menu } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";

export const Header = () => {
  const { user, isLoaded } = useUser();
  const isLoggedIn = isLoaded && !!user;

  return (
    <header className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <Brain className="h-7 w-7 text-indigo-600" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              <span className="text-indigo-600">Bright</span>
              <span className="ml-2 text-slate-900">Steps</span>
            </h1>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { name: "Services", href: "#services" },
            { name: "How it works", href: "#how-it-works" },
            { name: "About ASD", href: "#about-asd" },
            { name: "FAQs", href: "#faq" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-base font-semibold text-muted hover:text-primary transition-colors cursor-pointer"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-base font-semibold text-muted hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-base font-semibold text-muted hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-sm text-sm font-bold transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-ink" aria-label="Toggle Menu">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};
