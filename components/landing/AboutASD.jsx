"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export const AboutASD = () => {
  return (
    <section id="about-asd" className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1 h-full min-h-[500px]"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl h-full border border-black/5">
              <img
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop"
                alt="Clinician gently interacting with young child"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {/* Floating Stat Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 md:-right-10 bg-white p-6 rounded-2xl shadow-2xl border border-surface max-w-[280px]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <Users size={24} />
                </div>
                <h4 className="font-heading font-bold text-ink leading-tight">
                  1 in 36 children are diagnosed with ASD
                </h4>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-ink mb-6">
              What is <span className="text-primary">Autism Spectrum Disorder?</span>
            </h2>
            <p className="text-lg text-muted leading-relaxed mb-8">
              Autism spectrum disorder is a developmental condition that can
              affect communication, behavior, social interaction, and how a
              child experiences the world. Every child develops differently, and
              noticing signs early can help families seek support sooner.
            </p>
            <ul className="space-y-6">
              {[
                "Early detection can support better long-term outcomes",
                "Signs may appear in early childhood",
                "Every child develops at their own pace",
                "Parent and caregiver concerns matter",
              ].map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-black/5"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></div>
                  <span className="text-ink font-medium text-lg leading-snug">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
