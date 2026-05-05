"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { ParallaxSection } from "./ParallaxSection";
import { fadeInUp, staggerContainer } from "./animations";

export const FAQSection = () => {
  const faqs = [
    {
      q: "At what age can I start screening my child?",
      a: "Bright Steps is designed for toddlers and young children between 6 months and 5 years old, helping you track their developmental milestones during these critical early years.",
    },
    {
      q: "How does the video analysis work?",
      a: "Our technology securely analyzes your home videos for key behavioral markers like eye contact and social engagement, providing a deeper level of insight than a questionnaire alone.",
    },
    {
      q: "How are the screening results calculated?",
      a: "We combine your personal observations from the questionnaire with our advanced behavioral analysis to give you a clear, trustworthy risk assessment and a path for next steps.",
    },
    {
      q: "How is my child's privacy protected?",
      a: "We take your privacy seriously. All data and videos are stored securely, and only you and the healthcare professionals you choose to invite can access your child’s information.",
    },
    {
      q: "Can I share these results with my doctor?",
      a: "Yes! You can grant your pediatrician or therapist access to a detailed dashboard that shows your child's progress, videos, and screening reports to help with their formal evaluation.",
    },
    {
      q: "Does the app help with ongoing progress?",
      a: "Absolutely. Beyond screening, you can log daily therapy sessions and behaviors to see clear trends in your child’s progress and receive alerts if any regressions are detected.",
    },
  ];

  return (
    <ParallaxSection
      bgImage="https://images.unsplash.com/photo-1604552781095-388b94f80281?q=80&w=2070&auto=format&fit=crop"
      overlayClass="bg-black/60"
      className="py-32"
      id="faq"
    >
      <div className="relative z-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-white/70 text-lg mt-4 max-w-3xl mx-auto">
            Everything you need to know about how Bright Steps supports your family's journey.
          </p>
        </div>

        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} faq={faq} />
          ))}
        </motion.div>
      </div>
    </ParallaxSection>
  );
};

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden transition-colors hover:bg-white/15">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
      >
        <h3 className="font-heading font-bold text-lg md:text-xl text-white pr-8">
          {faq.q}
        </h3>
        <div className="shrink-0 text-white/70">
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-white/80 leading-relaxed text-lg">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
