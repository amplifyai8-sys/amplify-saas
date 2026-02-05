"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from 'next/navigation';
import { Search, Cpu, ArrowRight, Check, Zap, ShieldCheck, Users } from "lucide-react";

// ✅ STRATEGY UPDATE: FORENSIC LOADING STEPS
// Replaced generic "Connecting..." with specific "Value Calculation" steps.
// This primes the user for the "Unpaid Ad Value" number they will see in the dashboard.
const LOADING_STEPS = [
  "Initializing Forensic Identity Scan...",
  "Interrogating Competitor Rankings...",
  "Calculating Unpaid Ad Value...",
  "Detecting Brand Hallucinations...",
  "Generating Recovery Roadmap..."
];

// ✅ STRATEGY UPDATE: JEALOUSY HOOKS
// Replaced "Vibe check" with "Theft & Invisibility" hooks.
const ROTATING_TEXTS = [
  "Which competitors are stealing your traffic", 
  "Why AI is hiding your brand from high-value buyers",
  "The exact dollar value of your missing leads"
];

export default function HeroSection() {
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  const handleAnalyzeClick = async (e: React.FormEvent) => {
    e.preventDefault();
    let cleanUrl = urlInput.trim();
    if (!cleanUrl) {
      alert("Please enter a website URL first!");
      return;
    }
    setIsLoading(true);
    setLoadingStepIndex(0);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }), 
      });

      if (response.status === 429) {
        alert("⚡ Session Limit Reached: You have used your free market scans for now. Please try again later.");
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Analysis failed");
      }
      
      const data = await response.json();
      const resultWithUrl = { ...data, url: cleanUrl };
      
      localStorage.setItem('amplifyAnalysis', JSON.stringify(resultWithUrl));
      
      router.push('/dashboard'); 
    } catch (error) {
      console.error("Connection failed:", error);
      alert("System busy or offline. Please try again.");
      setIsLoading(false);
    }
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="relative pt-16 md:pt-32 pb-20 overflow-visible min-h-[85vh] flex flex-col justify-center">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[600px] bg-blue-500/20 blur-[130px] rounded-full pointer-events-none" />

      <motion.div 
        className="relative z-10 max-w-5xl mx-auto px-4 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        
        {/* Badge */}
        <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6 backdrop-blur-xl">
            <SparklesIcon />
            <span className="text-[10px] font-bold tracking-widest text-purple-300 uppercase">
              Free AI Diagnostic
            </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          variants={item}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight"
        >
          What Does AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Really Think</span> <br />
          About Your Brand?
        </motion.h1>

        {/* Dynamic Text Rotator */}
        <motion.div 
          variants={item}
          className="mb-6 flex flex-col items-center justify-center min-h-[70px]"
        >
          <p className="text-slate-400 font-medium mb-2 text-lg md:text-xl">
            In 10 seconds, we'll show you:
          </p>
          
          <div className="relative w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={textIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center gap-2 text-xs md:text-base text-white font-medium absolute px-2 text-center w-full justify-center"
              >
                <div className="p-1 rounded-full bg-green-500/20 shrink-0">
                  <Check size={12} className="text-green-400" />
                </div>
                <span>{ROTATING_TEXTS[textIndex]}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* INPUT BOX CONTAINER */}
        <motion.div 
          variants={item}
          className="max-w-2xl mx-auto mt-12 relative group"
        >
          {/* Animated Glow Border */}
          <motion.div 
            className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl opacity-30 group-hover:opacity-70 blur-sm bg-[length:200%_200%]"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          
          {!isLoading ? (
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl flex flex-col sm:flex-row gap-2 p-2 ring-1 ring-white/10 shadow-2xl">
              <div className="relative flex-1">
                 <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={20} />
                 </div>
                 <input 
                    id="hero-input"
                    type="text" 
                    placeholder="Enter your website (e.g., apple.com)" 
                    className="w-full h-full bg-transparent pl-14 pr-6 py-4 text-white outline-none placeholder:text-gray-500 text-lg font-medium rounded-xl"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                 />
              </div>
              <button 
                onClick={handleAnalyzeClick}
                className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 z-10 whitespace-nowrap active:scale-95"
              >
                Check My Brand Now <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 p-8 rounded-3xl text-left shadow-2xl font-mono min-h-[120px]">
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Amplify_Core_Engine</span>
                </div>
                <div className="space-y-3">
                    {LOADING_STEPS.map((step, idx) => (
                        <motion.div 
                            key={step}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                                opacity: idx === loadingStepIndex ? 1 : 0.3,
                                x: 0 
                            }}
                            className={`flex items-center gap-3 text-sm ${idx === loadingStepIndex ? 'text-white font-bold' : 'text-slate-500'}`}
                        >
                           {idx === loadingStepIndex && <Cpu size={14} className="animate-spin text-blue-400" />}
                           {idx < loadingStepIndex && <Check size={14} className="text-green-500" />}
                           <span>{step}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
          )}
        </motion.div>
        
        {/* TRUST BADGE ROW */}
        <motion.div 
            variants={item}
            className="mt-8 flex flex-wrap justify-center gap-3 md:gap-6 text-xs md:text-sm font-medium text-slate-400"
        >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <ShieldCheck size={14} className="text-green-400" />
                <span>No credit card required</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <Users size={14} className="text-blue-400" />
                <span>847 scans this week</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <Zap size={14} className="text-yellow-400" />
                <span>Results in 10 seconds</span>
            </div>
        </motion.div>

      </motion.div>
    </section>
  );
}

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" className="text-purple-400"/>
    </svg>
  );
}