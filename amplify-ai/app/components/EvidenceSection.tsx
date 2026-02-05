"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, TrendingDown, ArrowRight, Activity } from "lucide-react";

export default function EvidenceSection() {
  const cases = [
    {
      label: "Series D Fintech Unicorn",
      score: 42,
      loss: "$145,000/mo",
      issue: "Invisible to Claude 3.0",
      status: "REDACTED",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    },
    {
      label: "Global SaaS Leader",
      score: 58,
      loss: "$42,500/mo",
      issue: "Hallucinated Brand Identity",
      status: "REDACTED",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    },
    {
      label: "National Healthcare Provider",
      score: 35,
      loss: "$88,000/mo",
      issue: "Zero Trust Signals Found",
      status: "REDACTED",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    }
  ];

  return (
    // ✅ FIX: Removed bg-[#0f172a], set to transparent to let layout.tsx shine through
    <section className="relative py-24 px-4 bg-transparent" id="testimonials">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6 backdrop-blur-md"
          >
            <Activity size={14} className="text-blue-400" />
            <span className="text-xs font-bold text-blue-300 tracking-widest uppercase">Live Intelligence Feed</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            We Catch What <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Others Miss.
            </span>
          </motion.h2>
          <p className="text-xl text-slate-300/80 max-w-2xl mx-auto">
            We don't just guess. We audit the market leaders. See the hidden risks we uncovered in top-tier brands this week.
          </p>
        </div>

        {/* The Evidence Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              // ✅ FIX: Used exact glassmorphism tokens from your other components
              className={`relative p-8 rounded-2xl border ${item.border} ${item.bg} backdrop-blur-md overflow-hidden group hover:bg-opacity-20 transition-all bg-opacity-10`}
            >
              {/* "Confidential" Stamp Effect */}
              <div className="absolute top-4 right-4 opacity-30 rotate-12 group-hover:opacity-60 transition-opacity">
                <div className="border-2 border-white/40 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white/60">
                  {item.status}
                </div>
              </div>

              {/* Icon */}
              <div className="mb-6 flex items-center gap-3">
                <div className="p-3 rounded-lg bg-black/20">
                  <FileText size={24} className="text-white/70" />
                </div>
                <span className="text-sm font-bold text-white/50 tracking-wider">CASE #{1024 + idx}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2">{item.label}</h3>
              <p className="text-slate-300/70 text-sm mb-6 border-b border-white/10 pb-4">
                Identified Issue: <span className="text-white font-medium">{item.issue}</span>
              </p>

              {/* The "Bleed" Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Amplify Score</p>
                  <p className={`text-2xl font-mono font-bold ${item.color}`}>{item.score}/100</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Revenue Risk</p>
                  <div className="flex items-center gap-1">
                     <TrendingDown size={16} className={item.color} />
                     <p className="text-lg font-bold text-white">{item.loss}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Context */}
        <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            className="mt-12 text-center"
        >
             <p className="text-slate-400 text-sm mb-4">
               *Identities redacted to protect client confidentiality.
             </p>
             <div className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 cursor-pointer transition-colors">
                View Full Market Report <ArrowRight size={16} />
             </div>
        </motion.div>

      </div>
    </section>
  );
}