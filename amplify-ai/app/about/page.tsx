"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X, Zap, TrendingUp, DollarSign } from "lucide-react";

interface ComparisonRow {
  feature: string;
  traditional: string;
  amplifyai: string;
  icon: React.ReactNode;
}

export default function AboutPage() {
  const comparisonData: ComparisonRow[] = [
    {
      feature: "Speed",
      traditional: "Slow (weeks to months)",
      amplifyai: "Instant (10 seconds)",
      icon: <Zap size={24} className="text-purple-500" />,
    },
    {
      feature: "Focus",
      traditional: "Traffic & Rankings",
      amplifyai: "AI Answers & Visibility",
      icon: <TrendingUp size={24} className="text-purple-500" />,
    },
    {
      feature: "Cost",
      traditional: "High ($5K-$20K/mo)",
      amplifyai: "Fixed & Transparent",
      icon: <DollarSign size={24} className="text-purple-500" />,
    },
  ];

  return (
    <main className="relative min-h-screen bg-transparent px-4 py-20">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 font-sans text-5xl font-extrabold text-white md:text-6xl">
            The{" "}
            <span className="bg-gradient-to-r from-[#ef4444] to-[#facc15] bg-clip-text text-transparent">
              Invisible Brand
            </span>{" "}
            Crisis
          </h1>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16 space-y-6"
        >
          <p className="font-sans text-lg leading-relaxed text-slate-300">
            While you optimized for Google, the world moved to AI.
          </p>

          <p className="font-sans text-lg leading-relaxed text-slate-300">
            In 2026, <strong className="text-white">40% of all searches</strong>{" "}
            now happen on ChatGPT, Claude, and Perplexity. Your customers are
            asking AI for recommendations. Your competitors are being mentioned.
          </p>

          <p className="font-sans text-lg leading-relaxed text-slate-300">
            But <strong className="text-white">your brand doesn't exist there</strong>.
          </p>

          <p className="font-sans text-lg leading-relaxed text-slate-300">
            Traditional marketing agencies are still stuck in 2015, chasing
            keyword rankings and backlinks. They don't understand that{" "}
            <strong className="text-purple-400">
              AI models don't crawl websites the way Google does
            </strong>
            . They index conversations, Reddit threads, social proof, and trust
            signals.
          </p>

          <p className="font-sans text-lg leading-relaxed text-slate-300">
            That's why we built <strong className="text-white">AmplifyAI</strong>.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="mb-8 text-center font-sans text-3xl font-bold text-white">
            Traditional Agencies vs. AmplifyAI
          </h2>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md">
            {/* Table Header */}
            <div className="grid grid-cols-3 border-b border-white/10 bg-slate-800/50 p-6">
              <div className="font-sans text-sm font-semibold text-gray-400">
                Feature
              </div>
              <div className="text-center font-sans text-sm font-semibold text-gray-400">
                Traditional Agencies
              </div>
              <div className="text-center font-sans text-sm font-semibold text-purple-400">
                AmplifyAI
              </div>
            </div>

            {/* Table Rows */}
            {comparisonData.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="grid grid-cols-3 border-b border-white/10 p-6 last:border-b-0"
              >
                {/* Feature Name with Icon */}
                <div className="flex items-center gap-3">
                  {row.icon}
                  <span className="font-sans font-semibold text-white">{row.feature}</span>
                </div>

                {/* Traditional - Red X */}
                <div className="flex items-center justify-center gap-2">
                  <X size={20} className="flex-shrink-0 text-red-500" />
                  <span className="font-sans text-sm text-slate-300">{row.traditional}</span>
                </div>

                {/* AmplifyAI - Green Check */}
                <div className="flex items-center justify-center gap-2">
                  <Check size={20} className="flex-shrink-0 text-green-500" />
                  <span className="font-sans text-sm text-slate-300">{row.amplifyai}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="rounded-2xl border border-purple-500/30 bg-purple-900/20 p-8 text-center backdrop-blur-md"
        >
          <h3 className="mb-4 font-sans text-2xl font-bold text-white">Our Mission</h3>
          <p className="font-sans text-lg leading-relaxed text-slate-300">
            We exist to make sure no brand gets left behind in the AI search
            revolution. While others chase yesterday's metrics, we're building
            tomorrow's visibility.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-8 py-4 font-sans text-lg font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40"
          >
            Join the Revolution →
          </a>
        </motion.div>
      </div>
    </main>
  );
}
