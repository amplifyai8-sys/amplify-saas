"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, TrendingDown, FileText, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProblemSection() {
  const router = useRouter();

  const cards = [
    {
      label: "Growing SaaS Startup",
      issue: "Invisible to Claude—zero brand mentions in 50 queries",
      score: "42",
      loss: "$18K/mo",
      color: "text-red-500",
      border: "border-red-500/20",
      bg: "bg-red-500/10"
    },
    {
      label: "Mid-Market Fintech",
      issue: "ChatGPT confuses them with competitor (wrong brand identity)",
      score: "58",
      loss: "$42K/mo",
      color: "text-orange-500",
      border: "border-orange-500/20",
      bg: "bg-orange-500/10"
    },
    {
      label: "Healthcare Provider",
      issue: "No trust signals detected—AI warns users to verify claims",
      score: "35",
      loss: "$28K/mo",
      color: "text-red-500",
      border: "border-red-500/20",
      bg: "bg-red-500/10"
    },
  ];

  // ✅ ROBUST SCROLL FIX
  const scrollToHero = () => {
    const heroInput = document.getElementById("hero-input");
    if (heroInput) {
      // 1. Smooth scroll
      heroInput.scrollIntoView({ behavior: "smooth", block: "center" });
      // 2. Focus for immediate typing
      setTimeout(() => heroInput.focus(), 500);
    } else {
      // 3. Fallback: If on another page, go home + anchor
      router.push("/#hero-input");
    }
  };

  return (
    <section className="relative py-24 px-4 bg-transparent" id="problem">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 mb-6 backdrop-blur-md"
          >
            <ShieldAlert size={14} className="text-red-400" />
            <span className="text-[10px] font-bold text-red-300 tracking-widest uppercase">The Reality Check</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            We Find Revenue Leaks <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Other Agencies Miss.
            </span>
          </h2>
          <p className="text-xl text-slate-300/80 max-w-2xl mx-auto">
            This week alone, our free scans uncovered critical gaps in top-tier brands.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {cards.map((card, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`group relative p-8 rounded-3xl border ${card.border} ${card.bg} backdrop-blur-xl overflow-hidden hover:bg-opacity-20 transition-all`}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-white/70 text-xs font-bold font-mono tracking-wider">
                            <FileText size={14} />
                            REDACTED CASE #{1024 + idx}
                        </div>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-2">{card.label}</h4>
                    <p className="text-slate-300/80 text-sm mb-6 border-b border-white/10 pb-6 leading-relaxed">
                        {card.issue}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Ghost Score</p>
                            <p className={`text-2xl font-mono font-bold ${card.color}`}>{card.score}/100</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Rev Risk</p>
                            <div className="flex items-center gap-1">
                                <TrendingDown size={16} className={card.color} />
                                <p className="text-lg font-bold text-white">{card.loss}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        <div className="mt-12 text-center">
             <p className="text-slate-500 text-sm mb-4">
               *Identities redacted to protect client confidentiality.
             </p>
             {/* ✅ BUTTON IMPLEMENTATION */}
             <button 
                onClick={scrollToHero}
                className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 cursor-pointer transition-colors bg-transparent border-none"
             >
                See Your Ghost Score (Free) <ArrowRight size={16} />
             </button>
        </div>
      </div>
    </section>
  );
}