"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ListTodo, Activity, LineChart } from "lucide-react";
import { fadeInUp, staggerContainer } from "./animations";

export const ServiceTiles = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-ink mb-6 tracking-tight">
            What We <span className="text-primary">Offer</span>
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Tile 1 */}
          <motion.div variants={fadeInUp}>
            <div
              className="group relative rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block hover:-translate-y-1 h-[300px] md:h-[400px]"
            >
              <img
                src="https://images.unsplash.com/photo-1584697964328-b1e7f63dca95?q=80&w=2070&auto=format&fit=crop"
                alt="Age-Calibrated Screening"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
              
              <div className="relative z-20 h-full flex flex-col justify-end items-center p-8 text-center text-white">
                <h3 className="font-heading font-bold text-2xl mb-3">
                  Guided Screening
                </h3>
                <p className="text-white/90 text-sm leading-relaxed max-w-sm mx-auto">
                  Simple age-based questions to track key developmental
                  milestones.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tile 2 */}
          <motion.div variants={fadeInUp}>
            <div
              className="group relative rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block hover:-translate-y-1 h-[300px] md:h-[400px]"
            >
              <img
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop"
                alt="Therapy Management"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
              
              <div className="relative z-20 h-full flex flex-col justify-end items-center p-8 text-center text-white">
                <h3 className="font-heading font-bold text-2xl mb-3">
                  Therapy Tracking
                </h3>
                <p className="text-white/90 text-sm leading-relaxed max-w-sm mx-auto">
                  Record daily activities, track behaviors, and follow therapy
                  plans with ease.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tile 3 */}
          <motion.div variants={fadeInUp}>
            <div
              className="group relative rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block hover:-translate-y-1 h-[300px] md:h-[400px]"
            >
              <img
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2070&auto=format&fit=crop"
                alt="Progress Tracking"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
              
              <div className="relative z-20 h-full flex flex-col justify-end items-center p-8 text-center text-white">
                <h3 className="font-heading font-bold text-2xl mb-3">
                  Progress Insights
                </h3>
                <p className="text-white/90 text-sm leading-relaxed max-w-sm mx-auto">
                  See clear progress over time with automatic insights after
                  each session.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
