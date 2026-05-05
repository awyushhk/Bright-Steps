"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { ParallaxSection } from "./ParallaxSection";
import { fadeInUp, staggerContainer } from "./animations";

export const ReassuranceCallout = () => {
  const { user, isLoaded } = useUser();
  const isLoggedIn = isLoaded && !!user;

  return (
    <ParallaxSection
      bgImage="https://images.unsplash.com/photo-1662852920632-3a95ec8917cc?q=80&w=2070&auto=format&fit=crop"
      overlayClass="bg-black/40"
      className="py-52 min-h-[800px] flex items-center justify-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Preserved user's specific copy */}
          <motion.h2
            variants={fadeInUp}
            className="font-heading font-bold text-4xl md:text-6xl mb-10 leading-tight"
          >
            The early signs of autism are easy to miss. <br /> No need to
            wait and see.
          </motion.h2>
          <motion.div variants={fadeInUp}>
            <Link
              href={isLoggedIn ? "/dashboard" : "/sign-up"}
              className="inline-flex bg-transparent border-2 border-white text-white hover:bg-white hover:text-ink px-10 py-3 rounded-full font-bold transition-colors items-center gap-2"
            >
              {isLoggedIn ? "Go to Dashboard" : "You're just a click away"}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </ParallaxSection>
  );
};
