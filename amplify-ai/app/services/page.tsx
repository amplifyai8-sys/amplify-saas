"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Shield, ArrowRight, Sparkles, BrainCircuit, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const faqs = [
    {
      q: "How does pricing work for each tier?",
      a: "Essentials: $3K-$6K/mo. Elite: $8K-$15K/mo. Enterprise: Custom. Pricing depends on content volume and market competitiveness. We recommend the right tier after your free scan."
    },
    {
      q: "Can I start with Essentials and upgrade later?",
      a: "Absolutely. 60% of our Elite clients started with Essentials. You can upgrade anytime—no penalties, no restart fees."
    },
    {
      q: "What's the difference between Essentials and Elite?",
      a: "Essentials covers core fixes (content, schema, monitoring). Elite includes a dedicated strategist, weekly war room calls, competitor defense, and our 90-day performance guarantee."
    },
    {
      q: "Do I need to know my Ghost Score before choosing?",
      a: "No. Get your free scan first. We'll recommend the best tier based on your score. Many clients are surprised—they think they need Elite but Essentials is perfect for their situation."
    },
    {
      q: "Do you guarantee results?",
      a: "Yes, but only for Elite tier clients. We guarantee a 15+ point Ghost Score improvement in 90 days, or we work for free until you hit it."
    }
  ];

  const pricingCards = [
    {
      name: "Essentials",
      price: "$3k-$6k",
      period: "/mo",
      description: "Fix critical AI gaps for growing brands (Scores 40-75).",
      features: [
        { text: "Monthly AI Visibility Reports", included: true },
        { text: "12-16 AI-Optimized Content Pieces", included: true },
        { text: "Schema Markup & Tech SEO Fixes", included: true },
        { text: "Competitor Tracking Dashboard", included: true },
        { text: "Monthly Strategy Call", included: true },
      ],
      buttonText: "Book Strategy Call",
      icon: <BrainCircuit size={42} className="text-blue-400" />,
      glowColor: "bg-blue-500/20",
      delay: 0.1,
    },
    {
      name: "Elite",
      price: "$8k-$15k",
      period: "/mo",
      description: "Dominate AI search with a dedicated expert (Scores 0-50).",
      features: [
        { text: "Dedicated Senior Strategist", included: true },
        { text: "Weekly War Room Strategy Calls", included: true },
        { text: "Advanced Competitor Defense", included: true },
        { text: "Manual 'Ghost Recovery' Protocol", included: true },
        { text: "90-Day Score Guarantee", included: true },
      ],
      buttonText: "Apply for Elite Membership",
      icon: <Shield size={42} className="text-purple-400" />,
      glowColor: "bg-purple-500/30",
      highlighted: true,
      delay: 0.2,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "Quote",
      description: "Custom-built for multi-brand portfolios & franchises.",
      features: [
        { text: "Multi-Brand Portfolio Monitoring", included: true },
        { text: "Custom Integrations (CRM/Data)", included: true },
        { text: "Global Market Domination Track", included: true },
        { text: "Quarterly On-Site Strategy", included: true },
        { text: "Dedicated Account Team", included: true },
      ],
      buttonText: "Request Custom Quote",
      icon: <Trophy size={42} className="text-green-400" />,
      glowColor: "bg-green-500/20",
      delay: 0.3,
    },
  ];

  return (
    <main className="relative min-h-screen bg-transparent px-4 py-20">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5"
          >
            <Sparkles size={14} className="text-purple-400" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-purple-400">
              Pricing & Tiers
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 font-sans text-5xl font-extrabold text-white md:text-7xl"
          >
            Choose Your <br />
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
              Growth Path
            </span>
          </motion.h1>
          <p className="text-xl text-slate-300/80 max-w-2xl mx-auto">
            All packages include your free Ghost Score diagnostic and 30-minute strategy call.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 mb-24">
          {pricingCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className={`group relative overflow-hidden rounded-[2.5rem] border backdrop-blur-md transition-all duration-500 flex flex-col ${
                card.highlighted
                  ? "border-purple-500/50 bg-purple-900/10 shadow-2xl shadow-purple-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="p-10 flex-1 flex flex-col">
                <div className="relative mb-8 inline-block">
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className={`absolute inset-0 blur-2xl rounded-full ${card.glowColor}`} 
                    />
                    <div className="relative z-10">{card.icon}</div>
                </div>

                <h3 className="mb-2 font-sans text-2xl font-bold text-white">{card.name}</h3>

                <div className="mb-6 flex items-baseline">
                  <span className="font-sans text-4xl font-extrabold text-white">{card.price}</span>
                  <span className="ml-2 font-sans text-lg text-gray-500">{card.period}</span>
                </div>

                <p className="mb-8 font-sans text-gray-400 text-sm leading-relaxed min-h-[40px]">{card.description}</p>

                <ul className="mb-10 space-y-4 flex-1">
                  {card.features.map((feature, fIndex) => (
                    <motion.li
                      key={fIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: card.delay + (fIndex * 0.1) }}
                      className="flex items-start gap-3"
                    >
                      <Check size={18} className="mt-0.5 text-green-400 shrink-0" />
                      <span className="font-sans text-sm text-gray-300">{feature.text}</span>
                    </motion.li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`group/btn flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-sans text-lg font-bold transition-all ${
                    card.highlighted
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg animate-pulse hover:animate-none"
                      : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {card.buttonText}
                  <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guarantee Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-24 rounded-[3rem] border border-blue-500/20 bg-white/5 p-16 text-center relative overflow-hidden mb-24"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20">
            <Shield size={32} className="text-blue-400" />
          </div>
          <h3 className="mb-4 font-sans text-3xl font-bold text-white">The Amplify Performance Guarantee</h3>
          <p className="mx-auto max-w-2xl font-sans text-lg text-gray-400 leading-relaxed">
            If your Ghost Check score doesn't improve by <span className="text-white font-bold underline decoration-blue-500">15+ points in 90 days</span> (Elite Tier), 
            we work for free until it does. No fine print. Just performance.
          </p>
        </motion.div>

        {/* FAQ SECTION */}
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} />
                ))}
            </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Still Not Sure Which Tier Is Right?</h2>
            <p className="text-slate-400 mb-8">Start with the free Ghost Score scan. We'll recommend the best path.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/" className="px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-200 transition-colors">
                    Get My Free Ghost Score
                </Link>
                <Link href="/contact" className="px-8 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors">
                    Book Strategy Call
                </Link>
            </div>
        </div>

      </div>
    </main>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left text-white font-semibold hover:bg-white/5 transition-colors"
            >
                {q}
                {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-slate-400 leading-relaxed text-sm border-t border-white/5">
                            {a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}