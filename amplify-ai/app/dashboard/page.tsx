"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import posthog from 'posthog-js';
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

// Phosphor Icons (Premium - install: npm install @phosphor-icons/react)
import {
  WarningCircle,
  TrendDown,
  ShieldCheck,
  Users,
  CurrencyDollar,
  PencilSimple,
  Info,
  LockSimple,
  LockOpen,
  CheckCircle,
  XCircle,
  CaretLeft,
  CaretRight,
  CaretDown,
  House,
  ChartBar,
  Briefcase,
  Calendar,
  Path,
  Lightning,
  Package,
  Clock,
  ChatTeardrop,
  Eye,
  Wrench,
  List,
  X,
  ArrowRight,
  Target,
  FileText,
  CircleNotch,
  PhoneCall
} from "@phosphor-icons/react";

// --- CONFIG: JUNK DATA BLOCKLIST ---
const BLOCKED_EMAILS = [
  "test@test.com", "test@gmail.com", "user@user.com", "user@gmail.com",
  "admin@gmail.com", "a@a.com", "abc@abc.com", "1@1.com", "me@me.com",
  "no@no.com", "mail@mail.com", "example@example.com", "email@email.com"
];

const BLOCKED_DOMAINS = [
  "example.com", "test.com", "mailinator.com", "tempmail.com", "10minutemail.com"
];

// ✅ HARDCODED SAFETY LISTS (The "First Paint" Safeguard)
const TITAN_FIXES: FixItem[] = [
  { title: "Brand Authority Protection", priority: "high", description: "Ensure AI agents cite your canonical domain as the source of truth.", impact_metric: "Brand Hallucination Risk", status: "pending" },
  { title: "Snippet Dominance", priority: "high", description: "Optimize schema to capture zero-click answers in AI search results.", impact_metric: "Lower Click-Through", status: "pending" },
  { title: "Crawl Budget Efficiency", priority: "medium", description: "Prevent AI bots from wasting resources on low-value utility pages.", impact_metric: "Indexing Lag", status: "pending" }
];

const FORTRESS_FIXES: FixItem[] = [
  { title: "Firewall Blocking AI Agents", priority: "high", description: "Your WAF is blocking OpenAI/Perplexity user agents.", impact_metric: "Total Invisibility", status: "pending" },
  { title: "Robots.txt Too Restrictive", priority: "high", description: "Disallow rules prevent AI from indexing your pricing/content.", impact_metric: "De-indexing", status: "pending" },
  { title: "Schema Readability Error", priority: "medium", description: "Structured data cannot be parsed behind the login wall.", impact_metric: "Rich Snippet Failure", status: "pending" }
];

const DEFAULT_FIXES: FixItem[] = [
  { title: "Key Pages Not AI-Indexed", priority: "high", description: "Important pages aren't structured for AI extraction.", impact_metric: "Lower visibility", status: "pending" },
  { title: "Value Proposition Unclear", priority: "high", description: "AI can't confidently explain what you do.", impact_metric: "Fewer recommendations", status: "pending" },
  { title: "Trust Signals Missing Structure", priority: "medium", description: "Your credibility markers aren't AI-readable.", impact_metric: "Reduced authority", status: "pending" }
];

// --- ANIMATED COUNTER ---
function Counter({ value, color }: { value: number; color: string }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => { spring.set(value); }, [value, spring]);

  return (
    <motion.span className="font-sans text-4xl md:text-5xl font-extrabold" style={{ color }}>
      {display}
    </motion.span>
  );
}

// --- TYPES ---
interface FixItem {
  title: string;
  priority: "high" | "medium" | "low" | "critical";
  description: string;
  status?: "pending" | "in-progress" | "completed";
  impact_metric?: string;
  category?: string;
}

interface LeadFormData {
  name: string;
  email: string;
  website: string;
}

interface PersonaData {
  persona_detected: string;
  persona_confidence: string;
  messaging: {
    pain_hook: string;
    context_why: string;
    dream_outcome: string;
    competitor_line: string;
    cta_button: string;
    cta_subtext: string;
    urgency_line: string;
  };
  recovery_causes: FixItem[];
  ai_visibility_status: {
    status: string;
    explanation: string;
    recommendation_potential: string;
  };
}

interface PersonalizedRevenue {
  customers: number;
  revenuePerCustomer: number;
  totalRevenue: number;
  riskAmount: number;
  riskCustomers: number;
  isPersonalized: boolean;
}

// --- COMPONENT: PERSONALIZE MODAL ---
function PersonalizeModal({
  isOpen,
  onClose,
  onSubmit,
  industry
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customers: number, revenue: number) => void;
  industry: string;
}) {
  const [customers, setCustomers] = useState("");
  const [revenue, setRevenue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = parseInt(customers) || 0;
    const r = parseInt(revenue) || 0;
    if (c > 0 && r > 0) {
      onSubmit(c, r);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed left-1/2 top-1/2 z-[10000] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-slate-900 p-6 md:p-8 shadow-2xl"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
            <ChartBar size={24} className="text-blue-400" weight="duotone" />
          </div>
          <h2 className="font-sans text-xl md:text-2xl font-bold text-white">Personalize Your Estimate</h2>
          <p className="mt-2 font-sans text-sm text-gray-400">Answer 2 questions for accurate analysis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Users size={16} className="text-blue-400" weight="duotone" />
              How many new customers per month?
            </label>
            <input
              type="number"
              value={customers}
              onChange={(e) => setCustomers(e.target.value)}
              placeholder="e.g., 15"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-sans text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
              min="1"
              required
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-gray-400">
              <CurrencyDollar size={16} className="text-green-400" weight="duotone" />
              Average revenue per customer?
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="e.g., 400"
                className="w-full rounded-lg border border-white/10 bg-white/5 pl-8 pr-4 py-3 font-sans text-white placeholder-gray-600 focus:border-green-500 focus:outline-none"
                min="1"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-sans text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-transform hover:scale-[1.02]"
          >
            Update My Analysis
          </button>

          <p className="text-center font-sans text-xs text-gray-500 flex items-center justify-center gap-1">
            <LockSimple size={12} weight="duotone" />
            Your data stays private. Used only to personalize your estimate.
          </p>
        </form>
      </motion.div>
    </>
  );
}

// --- COMPONENT: PAIN HOOK REVEAL ---
function PainHookReveal({ painHook, competitorLine }: { painHook: string; competitorLine: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 md:p-8 text-center">
        <ChatTeardrop size={32} className="mx-auto mb-4 text-purple-400" weight="duotone" />
        <blockquote className="font-sans text-lg md:text-xl font-bold text-white leading-relaxed mb-4">
          "{painHook}"
        </blockquote>
        <p className="font-sans text-sm text-gray-400">— AI Visibility Analysis</p>

        {competitorLine && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-yellow-400/80">
            <Eye size={16} weight="duotone" />
            <span>{competitorLine}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// --- COMPONENT: RECOVERY JOURNEY (Polished with Dynamic Glow Arrows) ---
function RecoveryJourney() {
  const steps = [
    { label: "AI Scan", status: "complete" },
    { label: "Issues Detected", status: "complete" },
    { label: "Specialist Review Pending", status: "pending_review" }, // ✅ RENAMED & BLINKING
    { label: "Custom Roadmap", status: "future" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-md"
    >
      <div className="flex items-center gap-2 mb-6">
        <Path size={20} className="text-blue-400" weight="duotone" />
        <h3 className="font-sans text-lg font-bold text-white">Your Recovery Journey</h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 relative">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-3 md:flex-col md:gap-2 relative group z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-500 ${
                step.status === "complete" ? "bg-green-500/20 border-2 border-green-500" :
                step.status === "pending_review" ? "bg-yellow-500/20 border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" :
                "bg-white/5 border-2 border-white/20"
              }`}>
                {step.status === "complete" ? (
                  <CheckCircle size={20} className="text-green-500" weight="fill" />
                ) : step.status === "pending_review" ? (
                  // ✅ BLINKING DOT FOR SPECIALIST REVIEW
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 w-3 h-3 rounded-full bg-yellow-500"
                    />
                  </div>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                )}
              </div>
              
              <span className={`font-sans text-xs font-bold uppercase tracking-wide transition-colors ${
                step.status === "complete" ? "text-green-400" :
                step.status === "pending_review" ? "text-yellow-400 drop-shadow-sm" :
                "text-gray-500"
              }`}>
                {step.label}
              </span>
            </div>

            {/* ✅ DYNAMIC GLOWING CONNECTOR (Desktop) */}
            {idx < steps.length - 1 && (
              <div className="hidden md:flex flex-1 items-center justify-center px-4 relative">
                {/* The Track */}
                <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                    {/* The Pulse */}
                    <motion.div 
                        className={`absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent ${step.status === 'complete' ? 'via-green-500' : ''}`}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>
              </div>
            )}
            
            {/* ✅ DYNAMIC CONNECTING LINE (Mobile) */}
            {idx < steps.length - 1 && (
              <div className="md:hidden flex justify-start pl-[19px] -mt-2 -mb-2 relative">
                 <div className="w-[2px] h-8 bg-white/10 overflow-hidden relative">
                    <motion.div 
                        className={`absolute left-0 right-0 h-1/2 bg-gradient-to-b from-transparent via-blue-500 to-transparent ${step.status === 'complete' ? 'via-green-500' : ''}`}
                        animate={{ y: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                 </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20">
        <Lightning size={20} className="text-blue-400 shrink-0 mt-0.5" weight="fill" />
        <div>
          <p className="font-sans text-sm text-blue-200 font-semibold">AI-generated insights</p>
          <p className="font-sans text-xs text-blue-300/70 mt-1 leading-relaxed">
            Human specialist verifies accuracy and tailors fixes to YOUR business context on the strategy call.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// --- COMPONENT: VALUE STACK CTA ---
function ValueStackCTA({
  ctaButton,
  ctaSubtext,
  urgencyLine,
  onBookCall
}: {
  ctaButton: string;
  ctaSubtext: string;
  urgencyLine: string;
  onBookCall: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="rounded-2xl border border-purple-500/50 bg-gradient-to-br from-slate-900 via-[#1e1b4b] to-slate-900 p-6 md:p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
    >
      <div className="text-center mb-6">
        <button
          onClick={onBookCall}
          className="group relative w-full md:w-auto overflow-hidden rounded-xl bg-white px-8 py-4 font-sans text-lg md:text-xl font-bold text-slate-900 transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {/* ✅ FIXED: Consistent CTA Text */}
            Book Free Strategy Call <ArrowRight size={20} weight="bold" />
          </span>
        </button>
        <p className="mt-3 font-sans text-sm text-gray-400">{ctaSubtext || "30-min call: See exactly why competitors are winning"}</p>
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} className="text-purple-400" weight="duotone" />
          <span className="font-sans text-sm font-bold text-white">What you'll get (Total value: $4,000 → FREE):</span>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { label: "Competitor AI visibility analysis", value: "$1,500 value" },
            { label: "Priority fix roadmap", value: "$2,000 value" },
            { label: "AI recommendation audit", value: "$500 value" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" weight="fill" />
                <span className="font-sans text-sm text-gray-300">{item.label}</span>
              </div>
              <span className="font-sans text-xs text-gray-500">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-yellow-400/80 mb-4">
          <Clock size={16} weight="duotone" />
          <span className="font-sans text-sm">{urgencyLine || "7 of 10 weekly slots filled • Strategy spots fill quickly"}</span>
        </div>

        <div className="flex items-center gap-2 text-green-400/80">
          <ShieldCheck size={16} weight="duotone" />
          <span className="font-sans text-sm">Zero sales pitch. We walk you through fixes. You decide.</span>
        </div>
      </div>
    </motion.div>
  );
}

// --- COMPONENT: RECOVERY CAUSE CARD ---
function RecoveryCauseCard({ 
  item, 
  isUnlocked, 
  onBookCall 
}: { 
  item: FixItem; 
  isUnlocked: boolean; 
  onBookCall?: () => void 
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-500 bg-red-500/10 border-red-500/30";
      case "high": return "text-orange-500 bg-orange-500/10 border-orange-500/30";
      case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
      default: return "text-green-500 bg-green-500/10 border-green-500/30";
    }
  };

  return (
    <div className={`relative rounded-xl border border-white/10 bg-white/5 p-4 md:p-5 transition-all ${
      isUnlocked ? "hover:border-purple-500/50" : "blur-sm select-none opacity-50 grayscale"
    }`}>
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex items-start gap-3 flex-1">
          <WarningCircle size={20} className="text-yellow-500 shrink-0 mt-1" weight="duotone" />
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
              <h4 className="font-sans font-semibold text-white">{item.title}</h4>
              <span className={`self-start rounded-full border px-3 py-1 font-sans text-xs font-semibold uppercase ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </span>
            </div>
            <p className="font-sans text-sm text-gray-400 mb-3">{item.description}</p>

            {item.impact_metric && (
              <div className="flex items-center gap-2 text-red-400/80 mb-3">
                <TrendDown size={14} weight="duotone" />
                <span className="font-sans text-xs font-medium">Impact: {item.impact_metric}</span>
              </div>
            )}

            {/* ✅ FIXED: Interactive Strategy Call Button */}
            <div 
              onClick={isUnlocked ? onBookCall : undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 transition-all w-full md:w-auto ${
                isUnlocked 
                  ? "bg-slate-800/80 cursor-pointer hover:bg-slate-700 hover:border-purple-500/30 group shadow-lg" 
                  : "bg-slate-800/50 cursor-default"
              }`}
            >
              <div className="flex items-center gap-2">
                {isUnlocked ? (
                  <PhoneCall size={14} className="text-purple-400 group-hover:text-white transition-colors" weight="duotone" />
                ) : (
                  <LockSimple size={14} className="text-gray-500" weight="duotone" />
                )}
                <span className={`font-sans text-xs ${isUnlocked ? "text-purple-300 group-hover:text-white font-medium" : "text-gray-500"}`}>
                  {isUnlocked ? "Discuss solution on free strategy call →" : "Solution discussed on strategy call"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function DashboardPage() {
  // Navigation State
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);

  // Core State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState<LeadFormData>({ name: "", email: "", website: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formStartTime, setFormStartTime] = useState(0);
  const [honeypot, setHoneypot] = useState("");

  // Analysis Data
  const [ghostScore, setGhostScore] = useState(0);
  const [industry, setIndustry] = useState("General");
  const [benchmark, setBenchmark] = useState(88);
  const [revenueRisk, setRevenueRisk] = useState<string | number>(0);
  const [archetype, setArchetype] = useState("Digital Ghost");
  const [companyTier, setCompanyTier] = useState("unknown");
  const [fixList, setFixList] = useState<FixItem[]>([]);
  
  const [breakdown, setBreakdown] = useState({
    technical: 0,
    content: 0,
    authority: 0,
    ai_discoverability: 0,
    answerability: 0
  });

  // Persona Data
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [personaLoading, setPersonaLoading] = useState(false);

  // Personalized Revenue
  const [personalizedRevenue, setPersonalizedRevenue] = useState<PersonalizedRevenue>({
    customers: 0,
    revenuePerCustomer: 0,
    totalRevenue: 0,
    riskAmount: 0,
    riskCustomers: 0,
    isPersonalized: false
  });

  const BASE_CALENDLY_URL = "https://calendly.com/amplifyai8/30min";

  // --- INITIALIZATION ---
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop) setIsCollapsed(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const storedData = localStorage.getItem('amplifyAnalysis');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const score = parsed.score ?? 0;
        const arc = parsed.archetype || "Digital Ghost";

        setGhostScore(score);
        setIndustry(parsed.industry || "General");
        setBenchmark(parsed.benchmark || 88);
        setRevenueRisk(parsed.revenue_risk ?? 0);
        setArchetype(arc);
        setCompanyTier(parsed.company_tier || "unknown");
        setFormData(prev => ({ ...prev, website: parsed.url || "" }));

        if (parsed.breakdown) {
          setBreakdown(parsed.breakdown);
        }

        // ✅ RECOVERY LOGIC: Use Saved AI Data first, then Fallback
        if (parsed.persona) {
            setPersonaData(parsed.persona);
        }
        
        if (parsed.fix_list?.length > 0) {
          setFixList(parsed.fix_list.map((item: any) => ({
            title: item.title,
            priority: item.priority,
            description: item.description,
            status: item.status,
            impact_metric: item.impact_metric || item.description
          })));
        } else {
            // No saved list? Use Safe Defaults immediately
            if (score >= 85 || arc === "The Titan") setFixList(TITAN_FIXES);
            else if (arc === "Security Fortress") setFixList(FORTRESS_FIXES);
            else setFixList(DEFAULT_FIXES);
        }

        if (parsed.url) {
          fetchPersonaData(parsed.url);
        }

      } catch (e) {
        setGhostScore(42);
        setFixList(DEFAULT_FIXES);
      }
    } else {
      setGhostScore(42);
      setFixList(DEFAULT_FIXES);
    }
    setLoading(false);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (showModal) setFormStartTime(Date.now());
  }, [showModal]);

  // --- FETCH PERSONA DATA (Updated with LocalStorage Write) ---
  const fetchPersonaData = async (url: string) => {
    setPersonaLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const cleanUrl = url.toLowerCase().replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
      
      // Wait for backend generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const response = await fetch(`${API_BASE}/persona/${cleanUrl}`);

      if (response.ok) {
        const data = await response.json();
        if (data.status === "ready" && data.data) {
          setPersonaData(data.data);
          
          // ✅ CRITICAL FIX: Save AI results to Local Storage
          // This ensures data persists on refresh!
          const currentStorage = JSON.parse(localStorage.getItem('amplifyAnalysis') || '{}');
          const updatedStorage = {
            ...currentStorage,
            fix_list: data.data.recovery_causes, 
            persona: data.data              
          };
          localStorage.setItem('amplifyAnalysis', JSON.stringify(updatedStorage));

          // Only override if new data is valid
          if (data.data.recovery_causes?.length > 0) {
            setFixList(data.data.recovery_causes);
          }
        }
      }
    } catch (error) {
      console.error("Persona fetch failed:", error);
    } finally {
      setPersonaLoading(false);
    }
  };

  // --- PERSONALIZATION HANDLER ---
  const handlePersonalize = (customers: number, revenue: number) => {
    const gap = Math.max(0, benchmark - ghostScore);
    const gapPercent = gap / 100;
    const totalRevenue = customers * revenue;
    const riskAmount = Math.round(totalRevenue * gapPercent);
    const riskCustomers = Math.round(customers * gapPercent);

    setPersonalizedRevenue({
      customers,
      revenuePerCustomer: revenue,
      totalRevenue,
      riskAmount,
      riskCustomers,
      isPersonalized: true
    });

    posthog.capture('revenue_personalized', {
      customers,
      revenue_per_customer: revenue,
      calculated_risk: riskAmount
    });
  };

  // --- DERIVED STATE ---
  const isTitan = ghostScore >= 93 || archetype === "The Titan";
  const isFortress = archetype === "Security Fortress";
  const isBlackout = archetype === "Signal Blackout" || (ghostScore < 10 && !isFortress);
  const scoreColor = isBlackout ? "#6b7280" : isFortress ? "#ef4444" : ghostScore < 50 ? "#ef4444" : ghostScore < 70 ? "#facc15" : "#4ade80";
  const gap = Math.max(0, benchmark - ghostScore);

  const formatRevenue = (val: string | number) => {
    if (val === "Enterprise Scale" || val === "AI Invisibility" || val === "Total Erasure") return val;
    if (typeof val === "number") return `$${val.toLocaleString()}`;
    return val;
  };

  // --- HANDLERS ---
  const handleFixClick = () => {
    if (isUnlocked) return;
    if (isFortress || isBlackout) {
      setIsUnlocked(true);
    } else {
      setShowModal(true);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim().toLowerCase();

    if (Date.now() - formStartTime < 1000) return;
    if (honeypot) return;
    if (cleanName.length < 2) { setFormError("Please enter your name."); return; }

    const domain = cleanEmail.split('@')[1] || "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || BLOCKED_EMAILS.includes(cleanEmail) || BLOCKED_DOMAINS.includes(domain)) {
      setFormError("Please use a valid work email.");
      return;
    }

    setIsSubmitting(true);
    setIsUnlocked(true);
    setShowModal(false);

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      fetch(`${BACKEND_URL}/capture-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.name,
          company_name: formData.website || "Unknown Website"
        })
      }).then((res) => {
        if (res.ok) {
          posthog.capture('lead_captured', { email: formData.email, score: ghostScore, tier: archetype });
          posthog.identify(formData.email, { email: formData.email });
        }
      });
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError("");
  };

  const handleBookCall = () => {
    posthog.capture('book_call_clicked', { score: ghostScore, industry, archetype });
    window.open(BASE_CALENDLY_URL, "_blank");
  };

  // --- LOADING STATE ---
  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a]">
      <div className="flex items-center gap-3 text-white">
        <CircleNotch size={24} className="animate-spin" />
        <span>Loading Intelligence...</span>
      </div>
    </div>
  );

  // --- REVENUE RISK DISPLAY ---
  const getRevenueRiskDisplay = () => {
    if (personalizedRevenue.isPersonalized) {
      return {
        primary: `$${personalizedRevenue.riskAmount.toLocaleString()}/month`,
        secondary: `(~${personalizedRevenue.riskCustomers} customers going to competitors)`,
        isPersonalized: true
      };
    }

    if (typeof revenueRisk === "string") {
      return { primary: revenueRisk, secondary: "", isPersonalized: false };
    }

    if (companyTier === "local") {
      const customers = Math.max(3, Math.round(gap / 8));
      return {
        primary: `~${customers} customers/month`,
        secondary: "going elsewhere",
        isPersonalized: false
      };
    }

    return {
      primary: formatRevenue(revenueRisk),
      secondary: "",
      isPersonalized: false
    };
  };

  const revenueDisplay = getRevenueRiskDisplay();

  // ✅ LOGIC FIX: Determine Active List
  // Use persona data if available, otherwise use fixList (which defaults to safeguards)
  const activeRecoveryPlan = (personaData?.recovery_causes && personaData.recovery_causes.length > 0) 
    ? personaData.recovery_causes 
    : fixList;

  return (
    <div className="relative min-h-screen bg-transparent">
      
      {/* ✅ MOBILE HEADER (Fixed Top, High Z-Index, BRAND SVG ADDED) */}
      <div className="lg:hidden sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-xl">
        <Link href="/" className="flex items-center gap-2">
          {/* ✅ FIXED: Correct Brand SVG */}
          <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
            <defs>
                <linearGradient id="g2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
            <rect x="10" y="45" width="8" height="12" rx="4" fill="#3b82f6" />
            <rect x="25" y="32" width="8" height="38" rx="4" fill="#3b82f6" />
            <rect x="40" y="22" width="8" height="58" rx="4" fill="url(#g2)" />
            <rect x="55" y="8" width="8" height="85" rx="4" fill="url(#g2)" />
          </svg>
          <span className="font-sans text-lg font-bold text-white tracking-tight">AmplifyAI</span>
        </Link>
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
          <List size={24} />
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <motion.aside
        initial={{ width: isCollapsed ? 80 : 256 }}
        animate={{ width: isDesktop ? (isCollapsed ? 80 : 256) : 256, x: (isDesktop || sidebarOpen) ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-40 h-screen border-r border-white/10 bg-slate-900/60 backdrop-blur-md overflow-hidden flex flex-col"
      >
        <div className="flex h-full flex-col p-4">
          <div className={`mb-8 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="g1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <rect x="10" y="45" width="8" height="12" rx="4" fill="#3b82f6" />
                <rect x="25" y="32" width="8" height="38" rx="4" fill="#3b82f6" />
                <rect x="40" y="22" width="8" height="58" rx="4" fill="url(#g1)" />
                <rect x="55" y="8" width="8" height="85" rx="4" fill="url(#g1)" />
              </svg>
              {!isCollapsed && <span className="font-sans text-xl font-bold text-white whitespace-nowrap">AmplifyAI</span>}
            </Link>
            {isDesktop && (
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white">
                {isCollapsed ? <CaretRight size={14} /> : <CaretLeft size={14} />}
              </button>
            )}
            {!isDesktop && (
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
                <X size={20} />
              </button>
            )}
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { label: "Overview", icon: <ChartBar size={20} weight="duotone" />, id: "overview" },
              { label: "Ghost Check", icon: <ShieldCheck size={20} weight="duotone" />, id: "ghost-check" },
              { label: "Solutions", icon: <Briefcase size={20} weight="duotone" />, id: "solutions", action: () => window.open("/services", "_self") },
              { label: "Book Strategy", icon: <Calendar size={20} weight="duotone" />, id: "book-strategy", action: () => window.open("/contact", "_self") }
            ].map((link) => (
              <button
                key={link.id}
                onClick={link.action ? link.action : () => setActiveNav(link.id)}
                className={`group flex w-full items-center gap-3 rounded-lg p-3 font-sans text-sm font-medium transition-all ${
                  activeNav === link.id ? "bg-gradient-to-r from-[#3b82f6]/20 to-[#8b5cf6]/20 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <span className={`${activeNav === link.id ? "text-purple-400" : "text-gray-500 group-hover:text-white"}`}>{link.icon}</span>
                {!isCollapsed && <span className="whitespace-nowrap">{link.label}</span>}
              </button>
            ))}
          </nav>

          <div className="border-t border-white/10 pt-4 mt-auto">
            <Link href="/" className={`flex w-full items-center gap-3 rounded-lg p-3 font-sans text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all group ${isCollapsed ? "justify-center" : ""}`}>
              <House size={20} weight="duotone" className="text-gray-500 group-hover:text-white" />
              {!isCollapsed && <span className="whitespace-nowrap">Back to Website</span>}
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <motion.div animate={{ paddingLeft: isDesktop ? (isCollapsed ? 80 : 256) : 0 }} className="lg:pl-64 transition-all duration-300">
        
        <div className="p-4 md:p-6 lg:p-8 pb-32">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="mb-2 font-sans text-2xl md:text-3xl font-extrabold text-white">Competitive Threat Monitor</h1>
            <p className="font-sans text-sm md:text-base text-gray-400">Real-time analysis of your market position vs. {industry} leaders</p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">

            {/* --- SCORE CARD --- */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 md:p-8 backdrop-blur-md h-full">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="mb-1 font-sans text-lg md:text-xl font-bold text-white">
                      {isBlackout ? "Critical Error: SIGNAL LOST" : isFortress ? "Security Status: LOCKED" : "Ghost Check Score"}
                    </h2>
                    <p className="font-sans text-xs md:text-sm text-gray-400">
                      {isBlackout ? "Digital Pulse Flatline. Site Unreadable." : isFortress ? "Bot Protection Active. AI Crawlers Blocked." : "AI Search Visibility Rating"}
                    </p>
                  </div>
                  <div className="self-start md:self-auto rounded-full bg-white/5 px-4 py-2 border border-white/10">
                    <span className="font-sans text-xs md:text-sm font-bold" style={{ color: scoreColor }}>
                      {isBlackout ? "OFFLINE" : isFortress ? "SECURE" : ghostScore < 50 ? "CRITICAL" : ghostScore < 70 ? "AT RISK" : "OPTIMIZED"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
                  <motion.div className="relative mx-auto flex h-40 w-40 md:h-48 md:w-48 items-center justify-center">
                    <svg className="h-full w-full -rotate-90 transform">
                      <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                      <motion.circle
                        cx="50%" cy="50%" r="45%"
                        stroke={scoreColor}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - ghostScore / 100) }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Counter value={ghostScore} color={scoreColor} />
                      <span className="font-sans text-xs md:text-sm text-gray-400">/100</span>
                    </div>
                  </motion.div>

                  <div className="flex-1 space-y-4">
                    {/* ✅ ALREADY CORRECT: Progress bars use correct field mapping */}
                    {[
                      { l: "Technical SEO", v: breakdown.technical, max: 15 },
                      { l: "Content Quality", v: breakdown.content, max: 15 },         // ✅ Uses "content"
                      { l: "AI Discoverability", v: breakdown.ai_discoverability, max: 10 } // ✅ Uses "ai_discoverability"
                    ].map((m, i) => (
                      <div key={i}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-sans text-xs md:text-sm text-gray-400">{m.l}</span>
                          <span className="font-sans text-xs md:text-sm font-semibold text-white">{Math.round((m.v / m.max) * 100)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(m.v / m.max) * 100}%` }}
                            transition={{ delay: 0.5 + (i * 0.2), duration: 1 }}
                            className={`h-full ${m.v / m.max > 0.6 ? "bg-green-500" : m.v / m.max > 0.3 ? "bg-yellow-500" : "bg-red-500"}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Risk Alert */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-6">
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <WarningCircle size={24} className="text-red-500 shrink-0" weight="duotone" />
                        <div>
                          <p className="font-sans text-sm md:text-base font-bold text-red-400">
                            {isBlackout ? "Risk: Total Digital Erasure" : isFortress ? "Risk: AI Invisibility" : `Est. Revenue Risk: ${revenueDisplay.primary}`}
                          </p>
                          {revenueDisplay.secondary && (
                            <p className="font-sans text-xs text-red-400/70">{revenueDisplay.secondary}</p>
                          )}
                          {revenueDisplay.isPersonalized && (
                            <p className="font-sans text-[10px] text-green-400 flex items-center gap-1 mt-1">
                              <CheckCircle size={10} weight="fill" /> Personalized based on your data
                            </p>
                          )}
                        </div>
                      </div>

                      {!isBlackout && !isFortress && (
                        /* ✅ FIXED: High-visibility Personalize CTA Button (White Fill) */
                        <button
                          onClick={() => setShowPersonalizeModal(true)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                        >
                          <PencilSimple size={14} weight="bold" />
                          {personalizedRevenue.isPersonalized ? "Edit Strategy" : "Personalize ROI"}
                        </button>
                      )}
                    </div>

                    {!personalizedRevenue.isPersonalized && !isBlackout && !isFortress && (
                      <div className="flex items-center gap-1 mt-3 text-[10px] text-gray-500">
                        <Info size={10} weight="duotone" />
                        <span>Based on {industry} industry averages</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* --- BENCHMARK CARD --- */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 md:p-8 backdrop-blur-md h-full flex flex-col justify-between">
                <div>
                  <h3 className="mb-6 font-sans text-lg font-bold text-white">{industry} Benchmark</h3>

                  <div className="space-y-6">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-sans text-sm font-semibold text-white">Your Score</span>
                        <span className="font-sans text-lg font-bold" style={{ color: scoreColor }}>{ghostScore}</span>
                      </div>
                      <div className="h-8 overflow-hidden rounded-lg bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${ghostScore}%` }}
                          transition={{ delay: 0.4, duration: 1.2 }}
                          className="h-full"
                          style={{ backgroundColor: scoreColor }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-sans text-sm font-semibold text-gray-400">{industry} Leader</span>
                        <span className="font-sans text-lg font-bold text-gray-300">{benchmark}</span>
                      </div>
                      <div className="h-8 overflow-hidden rounded-lg bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${benchmark}%` }}
                          transition={{ delay: 0.6, duration: 1.2 }}
                          className="h-full bg-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-4 mt-6">
                  <p className="font-sans text-sm text-gray-400">
                    You are trailing the market leader by <span className="font-bold text-red-500">{gap}%</span>.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* --- RECOVERY CAUSES SECTION --- */}
            <div className="relative lg:col-span-3">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 md:p-8 backdrop-blur-md">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="mb-1 font-sans text-lg md:text-xl font-bold text-white flex items-center gap-2">
                      <Wrench size={20} className="text-purple-400" weight="duotone" />
                      Revenue Recovery Plan
                    </h2>
                    <p className="font-sans text-sm text-gray-400">High-priority issues affecting your AI visibility</p>
                  </div>
                  {/* ✅ FIXED: Header CTA Toggles based on Lock State */}
                  <button
                    onClick={isUnlocked ? handleBookCall : handleFixClick}
                    className="rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-4 py-2 font-sans text-sm font-semibold text-white transition-transform hover:scale-105 shadow-lg"
                  >
                    {isUnlocked ? "Book Free Strategy Call" : "Unlock Risk Report"}
                  </button>
                </div>

                <div className="relative space-y-4">
                  {/* ✅ FIXED: Ensures list is never empty (Safety Fallback) */}
                  {activeRecoveryPlan.map((item, index) => (
                    <RecoveryCauseCard 
                      key={index} 
                      item={item} 
                      isUnlocked={isUnlocked} 
                      onBookCall={handleBookCall}  // ✅ Passing the handler down
                    />
                  ))}

                  {/* Lock Overlay */}
                  <AnimatePresence>
                    {!isUnlocked && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center z-50"
                      >
                        <motion.div
                          initial={{ scale: 0.9, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          className="max-w-md rounded-2xl border border-purple-500/50 bg-slate-900/95 p-6 md:p-8 text-center shadow-2xl shadow-purple-500/20"
                        >
                          <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] p-4 shadow-lg shadow-purple-500/30">
                              <LockSimple size={32} className="text-white" weight="duotone" />
                            </div>
                          </div>
                          <h3 className="mb-2 font-sans text-xl md:text-2xl font-bold text-white">Unlock {industry} Recovery Plan</h3>
                          <p className="mb-6 font-sans text-gray-400 text-sm md:text-base">
                            Reveal specific fixes to recover <span className="font-bold text-white">{revenueDisplay.primary}</span>
                          </p>
                          <button
                            onClick={handleFixClick}
                            className="w-full rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-8 py-4 font-sans text-lg font-bold text-white shadow-lg shadow-purple-500/30 transition-transform hover:scale-105"
                          >
                            Unlock Now →
                          </button>
                          <p className="mt-4 font-sans text-xs text-gray-500 flex items-center justify-center gap-1">
                            <LockSimple size={10} weight="duotone" /> Free instant access. No credit card.
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* --- UNLOCKED CONTENT --- */}
            {isUnlocked && (
              <>
                {/* Pain Hook */}
                <div className="lg:col-span-3">
                  <PainHookReveal
                    painHook={personaData?.messaging?.pain_hook || "When someone searches for your service, competitors appear. You don't."}
                    competitorLine={personaData?.messaging?.competitor_line || "3 competitors in your space have higher AI visibility scores"}
                  />
                </div>

                {/* Recovery Journey */}
                <div className="lg:col-span-3">
                  <RecoveryJourney />
                </div>

                {/* Value Stack CTA */}
                <div className="lg:col-span-3">
                  <ValueStackCTA
                    ctaButton={personaData?.messaging?.cta_button || "Book Free Strategy Call"}
                    ctaSubtext={personaData?.messaging?.cta_subtext || "30-min call: See exactly why competitors are winning"}
                    urgencyLine={personaData?.messaging?.urgency_line || "7 of 10 weekly slots filled • Strategy spots fill quickly"}
                    onBookCall={handleBookCall}
                  />
                </div>
              </>
            )}

          </div>
        </div>
      </motion.div>

      {/* --- PERSONALIZE MODAL --- */}
      <AnimatePresence>
        <PersonalizeModal
          isOpen={showPersonalizeModal}
          onClose={() => setShowPersonalizeModal(false)}
          onSubmit={handlePersonalize}
          industry={industry}
        />
      </AnimatePresence>

      {/* --- LEAD CAPTURE MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-[10000] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-slate-900 p-6 md:p-8 shadow-2xl"
            >
              <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-white">
                <X size={24} />
              </button>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                  <LockOpen size={24} className="text-purple-400" weight="duotone" />
                </div>
                <h2 className="font-sans text-xl md:text-2xl font-bold text-white">Where should we send the report?</h2>
                <p className="mt-2 font-sans text-sm text-gray-400">Unlock your {industry} analysis and recovery steps.</p>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-4 relative">
                {/* Honeypot */}
                <div className="absolute opacity-0 -left-[9999px] top-0 pointer-events-none">
                  <input type="text" name="business_role" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </div>

                <div>
                  <label className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wider text-gray-500">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-sans text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wider text-gray-500">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-sans text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wider text-gray-500">Website URL</label>
                  <input
                    type="text"
                    name="website"
                    readOnly
                    value={formData.website}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-sans text-gray-400 cursor-not-allowed opacity-60 focus:outline-none"
                  />
                </div>

                {formError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-medium text-red-400 border border-red-500/20">
                    {formError}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] py-3 font-sans text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-transform hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <CircleNotch size={16} className="animate-spin" /> Unlocking...
                    </>
                  ) : (
                    "Reveal My Report"
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}