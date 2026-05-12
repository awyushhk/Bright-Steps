"use client";

import React from "react";
import { motion } from "framer-motion";
import { ParallaxSection } from "./ParallaxSection";

export const AboutASD = () => {
  return (
    <ParallaxSection
      id="about-asd"
      bgImage="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2070&auto=format&fit=crop"
      overlayClass="bg-black/50"
      className="py-24 md:py-48"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left Side: About ASD Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6 md:mb-8">
              What is <span className="text-primary-foreground">Autism Spectrum Disorder?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
              Autism spectrum disorder is a developmental condition that can
              affect communication, behavior, social interaction, and how a
              child experiences the world. Every child develops differently, and
              noticing signs early can help families seek support sooner.
            </p>
          </motion.div>

          {/* Right Side: Bullets */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ul className="grid grid-cols-1 gap-5">
              {[
                "Early detection can support better long-term outcomes",
                "Signs may appear in early childhood",
                "Every child develops at their own pace",
                "Parent and caregiver concerns matter",
              ].map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="w-3 h-3 rounded-full bg-primary shrink-0"></div>
                  <span className="text-white font-semibold text-lg leading-snug">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </ParallaxSection>
  );
};
