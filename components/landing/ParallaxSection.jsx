"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ParallaxSection = ({
  bgImage,
  children,
  overlayClass = "bg-black/40",
  className = "",
  id,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Background moves significantly slower than the page to create an "almost fixed" effect
  const y = useTransform(scrollYProgress, [0, 1], ["-35%", "35%"]);

  return (
    <section ref={ref} id={id} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 z-0 h-[170%] -top-[35%] will-change-transform"
        style={{ y }}
      >
        <img src={bgImage} alt="" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 z-10 ${overlayClass}`} />
      </motion.div>
      <div className="relative z-20">{children}</div>
    </section>
  );
};
