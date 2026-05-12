"use client";

import React from "react";
import { motion } from "framer-motion";

export const BrandStatement = () => {
  return (
    <section className="py-20 md:py-32 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-heading font-bold text-2xl md:text-4xl lg:text-5xl text-white leading-tight mb-6 md:mb-8">
            "Bright Steps brings structured screening, AI insights, and
            family-friendly guidance together to help you act earlier and
            with greater clarity."
          </h2>
        </motion.div>
      </div>
    </section>
  );
};
