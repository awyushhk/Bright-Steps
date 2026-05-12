"use client";

import React from "react";
import { ReactLenis } from "lenis/react";

import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ServiceTiles } from "@/components/landing/ServiceTiles";
import { ReassuranceCallout } from "@/components/landing/ReassuranceCallout";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PlatformCore } from "@/components/landing/PlatformCore";
import { AboutASD } from "@/components/landing/AboutASD";
import { FAQSection } from "@/components/landing/FAQSection";
import { BrandStatement } from "@/components/landing/BrandStatement";
import { Footer } from "@/components/landing/Footer";

export default function BrightStepsHome() {
  return (
    <ReactLenis root options={{ smoothTouch: true, touchMultiplier: 2 }}>
      <div className="bg-background text-ink font-sans min-h-screen selection:bg-primary/20 selection:text-primary-dark">
        {/* Accessibility Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-white px-4 py-2 rounded-md shadow-md text-primary font-bold"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main-content">
          <Hero />
          <ServiceTiles />
          <ReassuranceCallout />
          <HowItWorks />
          <AboutASD />
          <PlatformCore />
          <FAQSection />
          <BrandStatement />
        </main>

        <Footer />
      </div>
    </ReactLenis>
  );
}
