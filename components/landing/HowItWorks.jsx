"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./animations";

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-ink mb-6 tracking-tight">
            Get Results in <span className="text-primary">3 Simple Steps</span>
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {[
            {
              step: 1,
              title: "Answer Simple Questions",
              desc: "Complete a brief questionnaire based on your child's age to understand their development.",
              img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
            },
            {
              step: 2,
              title: "Upload a Short Video",
              desc: "Share a short home video to help our AI analyze your child's natural behaviors.",
              img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop"
            },
            {
              step: 3,
              title: "Get Clear Insights",
              desc: "Receive easy-to-understand results and guidance for your next steps.",
              img: "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=2070&auto=format&fit=crop"
            },
          ].map((item) => (
            <motion.div key={item.step} variants={fadeInUp}>
              <div className="group relative rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block hover:-translate-y-1 h-[400px]">
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
                
                {/* Step Number Badge */}
                <div className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-lg shadow-lg">
                  {item.step}
                </div>

                <div className="relative z-20 h-full flex flex-col justify-end items-center p-8 text-center text-white">
                  <h3 className="font-heading font-bold text-2xl mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed max-w-sm mx-auto min-h-[2.5rem] flex items-center">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
