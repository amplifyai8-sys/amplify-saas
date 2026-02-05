"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";

export default function FinalCTASection() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let cleanUrl = url.trim();
    if (!cleanUrl) return;

    setIsLoading(true);
    
    try {
      // ✅ Environment Switcher (Matches HeroSection)
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }), 
      });

      // 🛑 GATEKEEPER LOGIC (Handle Rate Limit)
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
      
      // Save data for the Dashboard to pick up
      localStorage.setItem('amplifyAnalysis', JSON.stringify(resultWithUrl));
      
      // Navigate to Dashboard
      router.push('/dashboard'); 
    } catch (error) {
      console.error("Connection failed:", error);
      alert("System busy or offline. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <section className="relative px-4 py-20" id="cta">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 p-12 text-center backdrop-blur-lg"
        >
          {/* Animated Background Sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#3b82f6]/20 blur-3xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#8b5cf6]/20 blur-3xl"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 flex justify-center"
            >
              <div className="rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] p-4">
                <Sparkles size={32} className="text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-4 text-4xl font-extrabold text-white md:text-5xl"
            >
              Ready to See Your Score?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8 text-xl text-white/70"
            >
              Join 500+ brands who've already discovered their blind spots
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <motion.input
                type="text"
                placeholder="yoursite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-center text-lg text-white placeholder-white/50 outline-none transition-all focus:border-white focus:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                whileFocus={{ scale: 1.01 }}
              />
              
              <button
                type="submit"
                disabled={isLoading}
                className="group relative overflow-hidden rounded-xl bg-white px-8 py-4 text-lg font-bold text-[#0f172a] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Get My Free Score
                      <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </button>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-6 text-sm text-white/50"
            >
              🔒 No credit card required • Results in 10 seconds
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}