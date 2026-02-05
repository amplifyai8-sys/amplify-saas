"use client";

import React from "react";
import Link from "next/link";
import { Linkedin } from "lucide-react";

export default function Footer() {
  return (
    // ✅ FIX: Changed background to transparent so global theme shows through
    <footer className="relative border-t border-white/10 bg-transparent pt-20 pb-10 overflow-hidden z-20">
      
      {/* Background Glow (Subtle Brand Pulse) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMN 1: BRAND IDENTITY */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              {/* ✅ FIX: RESTORED YOUR OFFICIAL SVG LOGO */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                <defs>
                  <linearGradient id="brandGradientFooter" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <rect x="10" y="45" width="8" height="12" rx="4" fill="#3b82f6" />
                <rect x="25" y="32" width="8" height="38" rx="4" fill="#3b82f6" />
                <rect x="40" y="22" width="8" height="58" rx="4" fill="url(#brandGradientFooter)" />
                <rect x="55" y="8" width="8" height="85" rx="4" fill="url(#brandGradientFooter)" />
                <circle cx="70" cy="38" r="5.5" fill="#a855f7" />
              </svg>
              <span className="text-xl font-bold text-white tracking-tight">AmplifyAI</span>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The only AI-native reputation defense platform. We help brands survive the shift from Search Engines to Answer Engines.
            </p>
            
            {/* Socials - Cleaned up */}
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/company/amplify-ai-ca/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* COLUMN 2: PLATFORM */}
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/services" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Solutions & Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Resources
                </Link>
              </li>
              {/* Removed Live Dashboard as requested */}
            </ul>
          </div>

          {/* COLUMN 3: COMPANY */}
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-purple-400 transition-colors text-sm">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-purple-400 transition-colors text-sm">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: LEGAL */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li>
                <span className="text-slate-500 text-sm cursor-not-allowed">
                  Privacy Policy (Coming Soon)
                </span>
              </li>
              <li>
                <span className="text-slate-500 text-sm cursor-not-allowed">
                  Terms of Service (Coming Soon)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © 2026 AmplifyAI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs text-slate-400 font-mono">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}