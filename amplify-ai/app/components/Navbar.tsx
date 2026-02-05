"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  // 1. ALL HOOKS MUST BE AT THE TOP
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. NOW we can safely hide the Navbar on Dashboard
  // (Doing this before useEffect caused the crash!)
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const navLinks = [
    { name: "Solutions", href: "/services" },
    { name: "Resources", href: "/blog" },
    { name: "Mission", href: "/about" },
  ];

  return (
    <>
      {/* --- MAIN NAVBAR (THE STRIP) --- */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 border-b ${
          scrolled
            ? "h-20 bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl" 
            : "h-24 bg-transparent border-transparent"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group relative z-50">
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              <defs>
                <linearGradient id="brandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <rect x="10" y="45" width="8" height="12" rx="4" fill="#3b82f6" />
              <rect x="25" y="32" width="8" height="38" rx="4" fill="#3b82f6" />
              <rect x="40" y="22" width="8" height="58" rx="4" fill="url(#brandGradient)" />
              <rect x="55" y="8" width="8" height="85" rx="4" fill="url(#brandGradient)" />
              <path d="M25 55 L40 70 L55 35 L70 50" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="70" cy="38" r="5.5" fill="#a855f7" />
            </svg>
            <span className="text-xl font-bold text-white tracking-tight">AmplifyAI</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredPath(link.href)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className={`text-sm font-medium transition-all duration-300 relative group py-2 ${
                    pathname === link.href ? "text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"
                    />
                  )}
                  {hoveredPath === link.href && pathname !== link.href && (
                    <motion.div
                      layoutId="navbar-hover"
                      initial={{ opacity: 0, width: "0%" }}
                      animate={{ opacity: 1, width: "100%" }}
                      exit={{ opacity: 0, width: "0%" }}
                      transition={{ duration: 0.2 }}
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 opacity-70 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                    />
                  )}
                </Link>
              ))}
            </div>

            <Link href="/contact">
              <button className="group relative px-6 py-3 rounded-xl font-bold text-white text-sm shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] transition-all duration-500 group-hover:bg-right" />
                  <span className="relative z-10 flex items-center gap-2">
                  Book Strategy Call
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
              </button>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden relative z-50 text-white p-2 rounded-lg hover:bg-white/10"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU (MOVED OUTSIDE NAV TO FIX CLIPPING) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-0 z-[999] flex flex-col bg-[#0f172a]/95 backdrop-blur-xl pt-28 px-6 pb-10 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold text-white">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between border-b border-white/5 pb-4 text-slate-300 hover:text-white"
                >
                  {link.name}
                  <ChevronRight size={20} className="text-white/20" />
                </Link>
              ))}
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-lg font-bold text-white shadow-lg"
              >
                Book Strategy Call
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}