"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare, Zap } from "lucide-react";

export default function SolutionSection() {
  const steps = [
    {
      step: "01",
      badge: "DIAGNOSE",
      title: "Free Ghost Score Scan",
      desc: "We audit your brand across 4 critical pillars: Vibe, AI Discoverability, Tech Foundation, and Authority. You see your exact score (0-100) instantly.",
      icon: <Search size={32} className="text-blue-400" />,
      color: "from-blue-500/20 to-blue-600/5",
      borderColor: "group-hover:border-blue-500/50"
    },
    {
      step: "02",
      badge: "STRATEGIZE",
      title: "Free 30-Min Strategy",
      desc: "No sales pressure. We walk you through your results, answer questions, and recommend next steps—whether you hire us or not.",
      icon: <MessageSquare size={32} className="text-purple-400" />,
      color: "from-purple-500/20 to-purple-600/5",
      borderColor: "group-hover:border-purple-500/50"
    },
    {
      step: "03",
      badge: "EXECUTE",
      title: "Done-For-You Fixes",
      desc: "Our team handles everything: Schema injection, AI-optimized content, and authority building. We fix your visibility while you focus on business.",
      icon: <Zap size={32} className="text-yellow-400" />,
      color: "from-yellow-500/20 to-yellow-600/5",
      borderColor: "group-hover:border-yellow-500/50"
    }
  ];

  return (
    <section className="relative py-24 px-4 bg-transparent" id="solution">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            We Don't Just Audit. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
               We Fix It For You.
            </span>
          </h2>
          <p className="text-xl text-slate-300/80 max-w-2xl mx-auto">
            Unlike traditional agencies that guess at strategy, we start with proof.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10">
             <motion.div 
               className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm"
               animate={{ x: ["-100%", "300%"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             />
          </div>

          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className={`relative bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 transition-all group hover:-translate-y-2 duration-300 ${item.borderColor}`}
            >
               <div className="absolute top-6 right-8 text-5xl font-black text-white/5 font-mono group-hover:text-white/10 transition-colors">
                 {item.step}
               </div>

               <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-slate-300 mb-6 group-hover:bg-white/10">
                  {item.badge}
               </div>

               <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5`}>
                 {item.icon}
               </div>

               <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
               <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}