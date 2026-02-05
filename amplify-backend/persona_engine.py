# persona_engine.py
# Persona Detection Engine - Extracts signals and generates custom AI copy
# Includes: Signal Extraction, Persona Logic, and Copy Generation

import os
import re
import json
import hashlib
from urllib.parse import urlparse
from groq import Groq
from dotenv import load_dotenv

# --- CONFIG ---
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

# ═══════════════════════════════════════════════════════════════════════════
# PERSONA SIGNAL DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════════

PERSONA_SIGNALS = {
    "startup_founder": {
        "signals": [
            "series a", "series b", "series c", "we're hiring", "we are hiring",
            "startup", "founding team", "backed by", "raised", "seed round",
            "venture", "co-founder", "our investors", "yc", "y combinator",
            "techstars", "accelerator", "pre-seed", "funding"
        ],
        "weight": 1.0
    },
    "enterprise_marketing": {
        "signals": [
            "fortune 500", "enterprise", "global", "publicly traded", "nyse",
            "nasdaq", "worldwide", "multinational", "fortune 100", "inc 5000",
            "billion", "corporate", "institutional", "large scale"
        ],
        "weight": 1.0
    },
    "local_business": {
        "signals": [
            "family owned", "locally owned", "serving", "since 19", "since 20",
            "call us", "free estimate", "free consultation", "our location",
            "visit us", "walk-in", "appointment", "licensed and insured",
            "years in business", "neighborhood", "community"
        ],
        "weight": 1.0
    },
    "solo_consultant": {
        "signals": [
            "i help", "i work with", "coaching", "consulting", "book a call",
            "my clients", "1-on-1", "one-on-one", "personal brand", "solopreneur",
            "freelance", "independent", "my approach", "i specialize"
        ],
        "weight": 1.0
    },
    "saas_product": {
        "signals": [
            "platform", "api", "integrate", "developers", "documentation",
            "sdk", "webhook", "dashboard", "login", "sign up free",
            "free trial", "pricing plans", "per month", "/mo", "saas"
        ],
        "weight": 1.0
    },
    "ecommerce_owner": {
        "signals": [
            "shop", "cart", "add to cart", "shipping", "products", "checkout",
            "buy now", "returns", "free shipping", "order", "delivery",
            "in stock", "out of stock", "add to bag", "wishlist"
        ],
        "weight": 1.0
    }
}

# Fallback persona
FALLBACK_PERSONA = "growth_marketer"


def extract_brand_name(url: str) -> str:
    try:
        parsed = urlparse(url if url.startswith('http') else f'https://{url}')
        domain = parsed.netloc.lower().replace('www.', '')
        brand = domain.split('.')[0]
        return brand.capitalize()
    except:
        return "Unknown Brand"


def extract_content_signals(text: str) -> dict:
    text_lower = text.lower()
    results = {}
    all_found_signals = []
    
    for persona, config in PERSONA_SIGNALS.items():
        found = []
        for signal in config["signals"]:
            if signal in text_lower:
                found.append(signal)
        
        results[persona] = {
            "count": len(found),
            "signals": found,
            "weighted_score": len(found) * config["weight"]
        }
        all_found_signals.extend(found)
    
    return {
        "persona_scores": results,
        "all_signals_found": list(set(all_found_signals))
    }


def detect_persona(signal_data: dict) -> dict:
    scores = signal_data["persona_scores"]
    sorted_personas = sorted(scores.items(), key=lambda x: x[1]["weighted_score"], reverse=True)
    
    if not sorted_personas:
        return {"persona": FALLBACK_PERSONA, "confidence": "low", "signals_found": []}
    
    top_persona, top_data = sorted_personas[0]
    top_count = top_data["count"]
    second_count = sorted_personas[1][1]["count"] if len(sorted_personas) > 1 else 0
    
    if top_count == 0:
        return {"persona": FALLBACK_PERSONA, "confidence": "low", "signals_found": []}
    if top_count >= 3 and top_count >= (second_count * 2):
        return {"persona": top_persona, "confidence": "high", "signals_found": top_data["signals"]}
    if top_count >= 2:
        return {"persona": top_persona, "confidence": "medium", "signals_found": top_data["signals"]}
    
    return {"persona": FALLBACK_PERSONA, "confidence": "low", "signals_found": top_data["signals"]}


def get_persona_context(url: str, text: str, industry: str, company_tier: str, score: int, breakdown: dict, detected_issues: list, benchmark: int) -> dict:
    brand_name = extract_brand_name(url)
    signal_data = extract_content_signals(text)
    persona_result = detect_persona(signal_data)
    gap = max(0, benchmark - score)
    
    issues_formatted = "\n".join([f"- {issue}" for issue in detected_issues[:5]]) if detected_issues else "- No specific issues detected"
    signals_formatted = ", ".join(signal_data["all_signals_found"][:10]) or "None detected"
    
    def safe_get(d, key, default=0):
        val = d.get(key, default)
        if isinstance(val, dict): return val.get("score", default)
        return val if isinstance(val, (int, float)) else default
    
    return {
        "url": url,
        "brand_name": brand_name,
        "industry": industry,
        "company_tier": company_tier,
        "score": score,
        "benchmark": benchmark,
        "gap": gap,
        "technical": safe_get(breakdown, "technical", 0),
        "content": safe_get(breakdown, "content", 0),
        "authority": safe_get(breakdown, "authority", 0),
        "ai_disc": safe_get(breakdown, "ai_discoverability", 0),
        "answerability": safe_get(breakdown, "answerability", 0),
        "detected_issues": issues_formatted,
        "content_signals": signals_formatted,
        "persona_detected": persona_result["persona"],
        "persona_confidence": persona_result["confidence"],
        "persona_signals_found": persona_result["signals_found"]
    }


def generate_url_hash(url: str) -> str:
    clean_url = url.lower().replace('https://', '').replace('http://', '').replace('www.', '').rstrip('/')
    return hashlib.md5(clean_url.encode()).hexdigest()[:16]


# ═══════════════════════════════════════════════════════════════════════════
# ✅ THE MISSING GENERATION FUNCTION
# ═══════════════════════════════════════════════════════════════════════════

def generate_persona_copy_sync(context: dict) -> dict:
    """Generates the actual dashboard copy (Pain Hook, CTA, etc.) using Groq/Gemini."""
    
    prompt = f"""
    Act as a Conversion Copywriter. Write dashboard copy for a user who just scanned their website.
    
    USER PROFILE:
    - Role/Persona: {context['persona_detected'].upper().replace('_', ' ')}
    - Industry: {context['industry']}
    - Website: {context['brand_name']} ({context['url']})
    - Score: {context['score']}/100 (Benchmark: {context['benchmark']})
    - Key Issues: {context['detected_issues']}
    
    TASK:
    Generate a JSON response with 4 specific copy blocks. 
    Tone: Urgent, professional, authoritative. No fluff.
    
    REQUIRED JSON STRUCTURE:
    {{
        "messaging": {{
            "pain_hook": "1 sentence. Visceral pain point specific to their persona.",
            "context_why": "1 sentence explaining WHY they are losing traffic.",
            "dream_outcome": "1 sentence promising the result of fixing it.",
            "competitor_line": "Specific comparison (e.g. '3 competitors dominate this keyword').",
            "cta_button": "Action-oriented button text.",
            "cta_subtext": "Reassurance text under button.",
            "urgency_line": "Scarcity or urgency trigger."
        }},
        "recovery_causes": [
            {{ "title": "Fix Title", "priority": "high", "description": "Fix description", "impact_metric": "Metric", "status": "pending" }},
            {{ "title": "Fix Title", "priority": "high", "description": "Fix description", "impact_metric": "Metric", "status": "pending" }},
            {{ "title": "Fix Title", "priority": "medium", "description": "Fix description", "impact_metric": "Metric", "status": "pending" }}
        ]
    }}
    """

    try:
        if GROQ_API_KEY:
            client = Groq(api_key=GROQ_API_KEY)
            completion = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            return json.loads(completion.choices[0].message.content)
            
        elif GEMINI_API_KEY:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=GEMINI_API_KEY)
            response = client.models.generate_content(
                model='gemini-2.0-flash-exp',
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            return json.loads(response.text)

    except Exception as e:
        print(f"   ⚠️ Persona Gen Failed: {e}")

    # Fallback
    return {
        "messaging": {
            "pain_hook": f"Your competitors in {context['industry']} are capturing your traffic.",
            "context_why": "AI search engines cannot read your key value propositions.",
            "dream_outcome": "Recover lost revenue by fixing your digital footprint.",
            "competitor_line": "Market leaders score 85+ on this benchmark.",
            "cta_button": "Unlock Recovery Plan",
            "cta_subtext": "Free strategy session included.",
            "urgency_line": "Limited audit slots available this week."
        },
        "recovery_causes": [
            {"title": "Fix AI Indexing Errors", "priority": "high", "description": "Ensure bots can read your site.", "status": "pending"},
            {"title": "Optimize Schema Data", "priority": "high", "description": "Help AI understand your pricing.", "status": "pending"},
            {"title": "Boost Domain Authority", "priority": "medium", "description": "Increase trust signals.", "status": "pending"}
        ]
    }