"use client";

import React from "react";
import Link from "next/link";
import { Brain } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export const Footer = () => {
  const { user, isLoaded } = useUser();
  const isLoggedIn = isLoaded && !!user;

  return (
    <footer className="bg-ink border-t border-white/10 pt-20 pb-10 text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2 mb-6 text-white">
              <Brain size={28} className="text-white" strokeWidth={2.5} />
              <span className="font-heading font-bold text-xl tracking-tight">
                <span className="text-white">Bright</span>{" "}
                <span className="text-white">Steps.</span>
              </span>
            </div>
            <p className="text-sm mt-4 max-w-[240px] leading-relaxed">
              Empowering families with early autism screening and developmental support.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="#about-asd"
                  className="hover:text-white transition-colors"
                >
                  About ASD
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">
              Account
            </h4>
            <ul className="space-y-3 text-sm">
              {isLoggedIn ? (
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/sign-in"
                      className="hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sign-up"
                      className="hover:text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}

            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">
              Stay Connected
            </h4>
            <p className="text-sm mb-4">
              Join our newsletter for updates and resources.
            </p>
            <form
              className="flex mb-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-l-sm text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-r-sm text-sm font-medium transition-colors whitespace-nowrap"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Bright Steps. All rights
            reserved.
          </p>
          <div className="flex gap-4 text-xs">
            <Link
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
