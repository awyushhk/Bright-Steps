"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Stethoscope, Lock, Activity } from "lucide-react";
import { ParallaxSection } from "./ParallaxSection";

export const PlatformCore = () => {
  return (
    <ParallaxSection
      bgImage="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2070&auto=format&fit=crop"
      overlayClass="bg-black/50"
      className="py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Clinical & Trustworthy Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-6 leading-tight">
              Built on Clinical Standards
            </h2>
            <div className="space-y-6 text-white/90 text-lg leading-relaxed mb-8">
              <p>
                Bright Steps is grounded in the <strong>M-CHAT-R/F™</strong> (Modified Checklist for Autism in Toddlers, Revised), the globally recognized gold standard for early autism screening.
              </p>
              <p>
                Our digital platform covers children from <strong>6 months to 5 years old</strong>, securely combining clinical algorithms with modern behavioral tracking to give you a comprehensive view of your child’s development.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Stethoscope size={20} className="text-teal" />
                </div>
                <span className="text-white font-medium text-sm">Clinically Validated</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Lock size={20} className="text-primary" />
                </div>
                <span className="text-white font-medium text-sm">100% Private & Secure</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: M-CHAT-R Zones Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl relative overflow-hidden"
          >
            <div className="mb-8">
              <h4 className="text-white font-heading font-bold text-xl">
                M-CHAT-R Scoring Zones
              </h4>
              <p className="text-white/60 text-sm mt-1">
                How our algorithm categorizes results for action
              </p>
            </div>

            <div className="space-y-6">
              {/* Low Risk */}
              <div>
                <div className="flex justify-between text-sm text-white/90 font-medium mb-2">
                  <span>Low-Risk Zone (Scores 0-2)</span>
                  <span className="text-teal font-bold">Standard Monitoring</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div className="bg-teal h-3 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              {/* Medium Risk */}
              <div>
                <div className="flex justify-between text-sm text-white/90 font-medium mb-2">
                  <span>Medium-Risk Zone (Scores 3-7)</span>
                  <span className="text-amber-400 font-bold">Follow-Up Recommended</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div className="bg-amber-400 h-3 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              {/* High Risk */}
              <div>
                <div className="flex justify-between text-sm text-white/90 font-medium mb-2">
                  <span>High-Risk Zone (Scores 8-20)</span>
                  <span className="text-rose-400 font-bold">Immediate Action</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div className="bg-rose-400 h-3 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-white/5 p-4 rounded-lg border border-white/10 flex items-start gap-3">
              <Activity className="shrink-0 mt-0.5 text-primary" size={18} />
              <p className="text-white/70 text-sm leading-snug">
                Our engine automatically calculates your risk zone based on the official M-CHAT-R algorithm, guiding you on exactly what to do next.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </ParallaxSection>
  );
};
