"use client";

import React from "react";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import EvidenceSection from "./components/EvidenceSection";
import FinalCTASection from "./components/FinalCTASection";
// ❌ Footer import removed from here

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <EvidenceSection />
      <FinalCTASection />
      {/* ❌ Footer component removed from here */}
    </main>
  );
}