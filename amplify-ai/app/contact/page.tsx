"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Calendar, ShieldAlert, CheckCircle2 } from "lucide-react";
// Ensure you have this component or use a standard iframe
import { InlineWidget } from "react-calendly"; 

interface FormData {
  name: string;
  email: string;
  website: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    website: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // ✅ FIXED: CONNECTED TO YOUR REAL CALENDLY
  const CALENDLY_URL = "https://calendly.com/amplifyai8/30min";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API to Brevo (Replace with real API later)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="relative min-h-screen bg-transparent px-4 py-20">
      <div className="mx-auto max-w-6xl">
        
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
             <ShieldAlert size={32} className="text-red-500" />
          </div>
          <h1 className="mb-4 font-sans text-4xl font-extrabold text-white md:text-6xl">
            Secure Your <span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">Revenue Defense</span> Strategy
          </h1>
          <p className="mx-auto max-w-2xl font-sans text-lg text-gray-400">
            Stop losing traffic to AI. Book a high-level strategy session to review your audit and build a recovery roadmap.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* LEFT: THE CALENDAR (HERO ACTION) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md"
          >
            <div className="border-b border-white/10 bg-white/5 p-6">
              <h3 className="flex items-center gap-2 font-sans text-xl font-bold text-white">
                <Calendar className="text-purple-400" />
                Priority Scheduling
              </h3>
              <p className="font-sans text-sm text-gray-400">
                Direct access to our Strategy Team. No gatekeepers.
              </p>
            </div>
            <div className="h-[600px] w-full bg-slate-50">
               {/* REACT CALENDLY WIDGET */}
               <InlineWidget 
                 url={CALENDLY_URL} 
                 styles={{ height: '100%', width: '100%' }}
               />
            </div>
          </motion.div>

          {/* RIGHT: THE "CAN'T WAIT" FORM */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-center rounded-2xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-md md:p-12"
          >
            {!isSent ? (
              <>
                <div className="mb-8">
                  <h3 className="mb-2 font-sans text-2xl font-bold text-white">
                    Can't find a time?
                  </h3>
                  <p className="font-sans text-gray-400">
                    Send us a direct message. We usually respond within 2 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block font-sans text-sm font-semibold text-white">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 font-sans text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-sans text-sm font-semibold text-white">Work Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 font-sans text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-sans text-sm font-semibold text-white">Website</label>
                    <input
                      type="url"
                      name="website"
                      required
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 font-sans text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-sans text-sm font-semibold text-white">How can we help?</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 font-sans text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                      placeholder="I ran the audit and got a score of 42..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 font-sans text-lg font-bold text-slate-900 transition-colors hover:bg-gray-200 disabled:opacity-70"
                  >
                    {isSubmitting ? "Sending..." : "Send Priority Message"}
                    {!isSubmitting && <Send size={18} />}
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 rounded-full bg-green-500/20 p-4">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <h3 className="mb-2 font-sans text-2xl font-bold text-white">Message Received</h3>
                <p className="font-sans text-gray-400">
                  We've flagged this as urgent. Expect a personal reply from our Strategy Team shortly.
                </p>
                <button 
                  onClick={() => setIsSent(false)} 
                  className="mt-8 text-sm text-purple-400 hover:text-purple-300"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}