"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { fadeInUp, staggerContainer } from "./animations";

export const Hero = () => {
  const { user, isLoaded } = useUser();
  const isLoggedIn = isLoaded && !!user;

  const { scrollY } = useScroll();
  // Hero section parallax uses direct scrollY
  // 0.75 means the background scrolls 75% slower than the page, keeping it almost fixed
  const heroY = useTransform(scrollY, (value) => value * 0.75);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.1]);

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden flex items-center bg-ink">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 z-0 h-[130%] -top-[15%]"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-ink/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1621354598022-16599af1b8b2?q=80&w=2070&auto=format&fit=crop"
          alt="Girl in blue shirt lying on a yellow inflatable pool"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <motion.div
          className="max-w-3xl text-white"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            variants={fadeInUp}
            className="font-heading font-bold text-4xl md:text-6xl leading-tight mb-6 text-white text-shadow-sm"
          >
            Notice <span className="text-primary">Early Signs.</span> <br /> Take the Next Step with Confidence.
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl font-medium mb-10 text-white/90 max-w-2xl leading-relaxed"
          >
            Bright Steps helps families identify early developmental
            patterns with simple guidance and at home observations, so you
            get clarity when it matters most.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <Link
              href={isLoggedIn ? "/dashboard" : "/sign-up"}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-sm text-base font-semibold text-center transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isLoggedIn ? "Go to Dashboard" : "Begin Screening"} <ChevronRight size={18} />
            </Link>
            <a
              href="#how-it-works"
              className="bg-transparent border-2 border-white/80 hover:bg-white hover:text-ink text-white px-8 py-4 rounded-sm text-base font-semibold text-center transition-all"
            >
              How It Works
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
