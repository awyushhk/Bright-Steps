"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export const PlatformCore = () => {
  return (
    <section id="platform-core" className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: AI Behavioral Insights Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-black/5 shadow-xl relative overflow-hidden order-2 lg:order-1"
          >
            <div className="mb-8">
              <h4 className="text-ink font-heading font-bold text-xl">
                AI Behavioral Insights
              </h4>
              <p className="text-muted text-sm mt-1">
                Real-time video analysis metric tracking
              </p>
            </div>

            <div className="space-y-5">
              {[
                { label: "Eye Contact", score: 7.5, color: "bg-emerald-500" },
                { label: "Response to Name", score: 6.0, color: "bg-sky-400" },
                { label: "Social Engagement", score: 8.5, color: "bg-primary" },
                {
                  label: "Repetitive Behavior",
                  score: 3.0,
                  color: "bg-amber-400",
                },
                { label: "Gestures", score: 5.5, color: "bg-rose-400" },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm text-ink font-medium mb-1.5">
                    <span>{stat.label}</span>
                    <span className="text-muted">{stat.score}/10</span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-2 rounded-full ${stat.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.score * 10}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        delay: 0.4 + idx * 0.15,
                        ease: "easeOut",
                      }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-surface p-4 rounded-lg border border-black/5 flex items-center gap-3">
              <CheckCircle2 className="shrink-0 text-primary" size={18} />
              <p className="text-muted text-sm leading-snug">
                Our engine automatically scores key developmental markers from
                your uploaded videos to provide a comprehensive behavioral
                profile.
              </p>
            </div>
          </motion.div>

          {/* Right Side: Clinical & Trustworthy Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-ink mb-6 leading-tight">
              Built on Clinical Standards
            </h2>
            <div className="space-y-6 text-muted text-lg leading-relaxed mb-8">
              <p>
                Bright Steps is grounded in the <strong>M-CHAT-R/F™</strong>{" "}
                (Modified Checklist for Autism in Toddlers, Revised), the
                globally recognized gold standard for early autism screening.
              </p>
              <p>
                Our digital platform covers children from{" "}
                <strong>6 months to 5 years old</strong>, securely combining
                proven algorithms with modern behavioral tracking to give you a
                comprehensive view of your child’s development.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
