# main.py
# AmplifyAI Backend API - Hybrid Scoring Engine v3.14
# FIXED: URL Hash Mismatch (Fixes the "Empty Plan" bug)
# FIXED: Added 'impact_metric' to default fixes to match Frontend expectations.

import json
import re
import os
import time
import hashlib
import threading
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from curl_cffi import requests as cffi_requests
from bs4 import BeautifulSoup
from groq import Groq
from dotenv import load_dotenv
from supabase import create_client, Client
from playwright.async_api import async_playwright

# Import our modules
from scoring_engine import calculate_math_score
from famous_brands import get_brand_tier, detect_company_tier_from_content
from industry_config import validate_industry, get_industry_benchmark, calculate_revenue_message, calculate_archetype
from persona_engine import get_persona_context, generate_url_hash, generate_persona_copy_sync

# --- LOAD CONFIG ---
load_dotenv()
app = FastAPI()

# --- KEYS ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

# --- INITIALIZE CLIENTS ---
groq_client = None
gemini_client = None 
supabase: Client = None

try:
    if GROQ_API_KEY:
        groq_client = Groq(api_key=GROQ_API_KEY)
        print("   ✅ Groq AI Client Connected (Primary)")
    if GEMINI_API_KEY:
        from google import genai
        from google.genai import types
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        print("   ✅ Gemini AI Client Connected (Backup)")
    if SUPABASE_URL and SUPABASE_KEY:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("   ✅ Connected to Supabase Database")
except Exception as e:
    print(f"   ⚠️ Init Error: {e}")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- RATE LIMITER ---
request_history = {}
LIMIT_COUNT = 5
LIMIT_WINDOW = 3600
WHITELISTED_IPS = ["127.0.0.1", "::1"]

def check_rate_limit(ip_address: str):
    if ip_address in WHITELISTED_IPS: return True
    current_time = time.time()
    history = request_history.get(ip_address, [])
    clean_history = [t for t in history if (current_time - t) < LIMIT_WINDOW]
    if len(clean_history) >= LIMIT_COUNT:
        print(f"   ⛔ Rate Limit: {ip_address}")
        return False
    clean_history.append(current_time)
    request_history[ip_address] = clean_history
    return True

# --- CONSTANTS ---
# Default fixes for Titans (Now with impact_metric to match Frontend)
TITAN_DEFAULT_FIXES = [
    {"title": "Brand Authority Protection", "priority": "high", "description": "Ensure AI agents cite your canonical domain as the source of truth.", "impact_metric": "Hallucination Risk", "status": "pending"},
    {"title": "Knowledge Graph Verification", "priority": "high", "description": "Verify entity data in Google/Bing/LLM graphs to prevent hallucinations.", "impact_metric": "Entity Trust", "status": "pending"},
    {"title": "Snippet Dominance", "priority": "medium", "description": "Optimize schema to capture zero-click answers in AI search results.", "impact_metric": "Click-Through Rate", "status": "pending"}
]

# --- CACHE ---
persona_cache = {}
PERSONA_CACHE_TTL = 300

def get_cached_persona(url_hash: str):
    if url_hash in persona_cache:
        entry = persona_cache[url_hash]
        if time.time() - entry["created_at"] < PERSONA_CACHE_TTL:
            return entry
    return None

def set_cached_persona(url_hash: str, data: dict):
    if len(persona_cache) >= 1000:
        oldest = sorted(persona_cache.keys(), key=lambda k: persona_cache[k]["created_at"])[:100]
        for k in oldest: del persona_cache[k]
    persona_cache[url_hash] = {**data, "created_at": time.time(), "status": "ready"}

# --- MODELS ---
class URLRequest(BaseModel):
    url: str
    email: str = "guest_user@amplify.ai"

class LeadCaptureRequest(BaseModel):
    email: str
    full_name: str
    company_name: str

class PersonaCopyRequest(BaseModel):
    url: str
    score: int
    industry: str
    company_tier: str
    benchmark: int
    breakdown: dict
    detected_issues: list
    text: str = ""

# --- AI HELPERS ---
def call_ai_with_fallback(prompt: str, timeout_seconds: int = 10) -> dict:
    if groq_client:
        try:
            completion = groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.1,
                timeout=timeout_seconds,
                response_format={"type": "json_object"}
            )
            return {"status": "success", "source": "groq", "data": json.loads(completion.choices[0].message.content)}
        except Exception: pass
    if gemini_client:
        try:
            response = gemini_client.models.generate_content(
                model='gemini-2.0-flash-exp',
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.1, response_mime_type="application/json")
            )
            return {"status": "success", "source": "gemini", "data": json.loads(response.text)}
        except Exception: pass
    return {"status": "fallback", "source": "hardcoded", "data": None}

# --- ASYNC PERSONA GENERATION ---
def fire_persona_generation_async(url: str, context: dict):
    url_hash = generate_url_hash(url)
    persona_cache[url_hash] = {"status": "processing", "created_at": time.time()}
    def background_task():
        try:
            result = generate_persona_copy_sync(context)
            set_cached_persona(url_hash, result)
            print(f"   🎭 Persona generated async for {url_hash}")
        except Exception as e:
            print(f"   ⚠️ Async persona failed: {e}")
            persona_cache[url_hash] = {"status": "error", "created_at": time.time()}
    thread = threading.Thread(target=background_task)
    thread.start()

# --- DATABASE HELPERS ---
def get_score_value(value) -> int:
    if isinstance(value, dict): return int(value.get("score", 0))
    elif isinstance(value, (int, float)): return int(value)
    return 0

def save_analysis_to_db(email, website, data):
    if not supabase: return
    try:
        supabase.table("leads").upsert({"email": email, "last_scan_at": datetime.now(timezone.utc).isoformat(), "marketing_source": "web_scan"}, on_conflict="email").execute()
        lead_res = supabase.table("leads").select("id").eq("email", email).execute()
        lead_id = lead_res.data[0]['id'] if lead_res.data else None
        
        breakdown = data.get("breakdown", {})
        scan_payload = {
            "lead_id": lead_id,
            "url": website,
            "industry": data.get("industry", "Unknown"),
            "archetype": data.get("archetype", "General"),
            "total_score": int(data.get("score", 0)),
            "technical_score": get_score_value(breakdown.get("technical", 0)),
            "ai_score": get_score_value(breakdown.get("ai_judgment", 0)),
            "authority_score": get_score_value(breakdown.get("authority", 0)),
            "vibe_score": get_score_value(breakdown.get("content", 0)),
            "benchmark_gap": max(0, data.get("benchmark", 88) - data.get("score", 0)),
            "raw_analysis_json": data
        }
        supabase.table("scan_results").insert(scan_payload).execute()
    except Exception as e:
        print(f"   ⚠️ DB Save Error: {e}")

def log_scan_metrics(url, duration, scrape, ai, cache, score):
    if not supabase: return
    try:
        supabase.table("scan_logs").insert({
            "url": url, "total_duration_ms": int(duration * 1000), 
            "scrape_status": scrape, "ai_status": ai, "cache_status": cache, "final_score": score
        }).execute()
    except: pass

def get_cached_result(url: str):
    if not supabase: return None
    try:
        clean_url = url.lower().replace('https://', '').replace('http://', '').replace('www.', '').rstrip('/')
        cutoff = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
        result = supabase.table("scan_results").select("*").ilike("url", f"%{clean_url}%").gte("created_at", cutoff).order("created_at", desc=True).limit(1).execute()
        if result.data and len(result.data) > 0:
            cached = result.data[0]
            print(f"   📦 Cache HIT for {clean_url}")
            return {
                "score": cached.get("total_score"),
                "archetype": cached.get("archetype"),
                "industry": cached.get("industry"),
                "revenue_risk": cached.get("raw_analysis_json", {}).get("revenue_risk", "Unknown"),
                "benchmark": cached.get("raw_analysis_json", {}).get("benchmark", 88),
                "breakdown": cached.get("raw_analysis_json", {}).get("breakdown", {}),
                "fix_list": cached.get("raw_analysis_json", {}).get("fix_list", []),
                "revenue_message": cached.get("raw_analysis_json", {}).get("revenue_message", {}),
                "cached": True,
                "cached_at": cached.get("created_at")
            }
    except: pass
    return None

# --- ASYNC SCRAPER ---
async def sophisticated_scrape(url: str) -> dict:
    if not url.startswith('http'): url = 'https://' + url
    try:
        resp = cffi_requests.get(url, impersonate="chrome110", timeout=8)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.content, 'html.parser')
            for t in soup(["script", "style", "nav", "footer"]): t.decompose()
            text = re.sub(r'\s+', ' ', soup.get_text()).strip()
            if len(text) > 500: return {"status": "success", "html": str(resp.content)[:50000], "text": text[:6000], "title": soup.title.string if soup.title else "Unknown", "method": "curl-cffi"}
    except: pass
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
            page = await browser.new_page()
            await page.goto(url, timeout=15000)
            html = await page.content()
            await browser.close()
            soup = BeautifulSoup(html, 'html.parser')
            for t in soup(["script", "style"]): t.decompose()
            text = re.sub(r'\s+', ' ', soup.get_text()).strip()
            if len(text) < 100: return {"status": "empty", "code": 204}
            return {"status": "success", "html": html[:50000], "text": text[:6000], "title": soup.title.string if soup.title else "Unknown", "method": "playwright"}
    except Exception as e:
        return {"status": "blocked", "code": 403}

# --- AI JUDGMENT ---
def get_ai_judgment(text: str, url: str, title: str, math_score: dict, use_reputation: bool = False) -> dict:
    prompt = f"""
    You are an AI Visibility Analyst.
    Target URL: {url} | Title: {title}
    Website Content: "{text[:2500]}"
    Math Score: {math_score['total']}/60
    Evaluate 3 Dimensions (0-35 points total):
    1. BRAND CLARITY (0-15): Value prop clear?
    2. TRUST (0-15): Evidence/Social proof?
    3. SENTIMENT (0-5): Positive recommendation?
    RETURN JSON with: ai_judgment_score (total, breakdown), industry, company_tier, detected_issues, fix_list.
    """
    if use_reputation:
        prompt = f"""
        You are an AI Visibility Analyst.
        CRITICAL: The website '{url}' BLOCKED our scraper.
        However, this is a KNOWN GLOBAL MARKET LEADER (Titan).
        Task:
        1. Ignore the missing text.
        2. Rate their "Brand Clarity" and "Trust" based on their REAL-WORLD reputation.
        3. Score them VERY HIGH (30-35/35).
        RETURN JSON as requested.
        """
    ai_resp = call_ai_with_fallback(prompt)
    if ai_resp["status"] == "fallback":
        return {"ai_score": 20, "ai_judgment_score": {"total": 20}, "industry": "General", "company_tier": "unknown", "detected_issues": ["AI analysis unavailable"], "fix_list": [], "ai_source": "hardcoded"}
    try:
        data = ai_resp["data"]
        ai_total = data.get("ai_judgment_score", {}).get("total", 20)
        return {
            "ai_score": min(ai_total + 5, 40),
            "ai_judgment_score": data.get("ai_judgment_score"),
            "industry": data.get("industry", "General"),
            "company_tier": data.get("company_tier", "unknown"),
            "detected_issues": data.get("detected_issues", []),
            "fix_list": data.get("fix_list", []),
            "ai_source": ai_resp["source"]
        }
    except: return {"ai_score": 20, "industry": "General", "fix_list": [], "ai_source": "error"}

# --- MAIN ENDPOINT ---
@app.post("/analyze")
async def analyze_brand(request: URLRequest, req: Request):
    start_time = time.time()
    forwarded = req.headers.get("x-forwarded-for")
    client_ip = forwarded.split(",")[0].strip() if forwarded else req.client.host
    if not check_rate_limit(client_ip): raise HTTPException(status_code=429, detail="Rate limit exceeded.")
    print(f"🚀 Scanning: {request.url}")

    # 1. Cache
    cached_result = get_cached_result(request.url)
    if cached_result:
        log_scan_metrics(request.url, time.time() - start_time, "cached", "cached", "hit", cached_result.get("score", 0))
        return cached_result

    # 2. Scrape
    scrape_result = await sophisticated_scrape(request.url)
    brand_info = get_brand_tier(request.url)
    html_content = ""
    text_content = ""
    title_content = request.url
    is_blocked_famous = False
    
    # 3. Handle Explicit Block
    if scrape_result["status"] in ["blocked", "error", "empty"]:
        if brand_info:
            print(f"   🛡️ Blocked but Famous: {request.url} -> Activating Synthetic Injection")
            is_blocked_famous = True
            text_content = f"Official website of {request.url}. Global market leader in {brand_info['industry']}."
            title_content = f"{request.url} - Official Site"
        else:
            result = {"score": 15, "archetype": "Security Fortress", "industry": "High Security", "revenue_risk": "AI Invisibility", "benchmark": 98, "breakdown": {"technical": 5, "content": 10}, "fix_list": []}
            save_analysis_to_db(request.email, request.url, result)
            return result
    else:
        html_content = scrape_result.get("html", "")
        text_content = scrape_result.get("text", "")
        title_content = scrape_result.get("title", "")

    # 4. Scoring
    if is_blocked_famous:
        math_result = {'total': 55, 'breakdown': {'technical': {'score': 15}, 'content': {'score': 10}, 'authority': {'score': 15}, 'ai_discoverability': {'score': 10}, 'answerability': {'score': 5}}}
        ai_result = get_ai_judgment(text_content, request.url, title_content, math_result, use_reputation=True)
    else:
        math_result = calculate_math_score(html_content, text_content, request.url)
        ai_result = get_ai_judgment(text_content, request.url, title_content, math_result, use_reputation=False)

    final_score = min(100, math_result['total'] + ai_result['ai_score'])
    
    # 5. SAFETY FLOOR (Fixes Score, Bars AND Fix List)
    final_fix_list = ai_result.get("fix_list", [])
    
    if brand_info and final_score < brand_info['min_score']:
        print(f"   🏆 Boosting Titan Score: {final_score} -> {brand_info['min_score']}")
        final_score = brand_info['min_score']
        
        # FIX 1: Overwrite Breakdown (so bars fill up)
        math_result = {
            'total': 55, 
            'breakdown': {
                'technical': {'score': 15}, 
                'content': {'score': 10}, 
                'authority': {'score': 15}, 
                'ai_discoverability': {'score': 10}, 
                'answerability': {'score': 5}
            }
        }
        # FIX 2: Inject Default Titan Fixes (so dashboard isn't empty)
        if not final_fix_list or len(final_fix_list) == 0:
            final_fix_list = TITAN_DEFAULT_FIXES

    # 6. Finalize
    detected_tier = detect_company_tier_from_content(text_content)
    industry = brand_info['industry'] if brand_info else ai_result['industry']
    tier = brand_info['tier'] if brand_info else (detected_tier if detected_tier != "unknown" else ai_result['company_tier'])
    validated_industry = validate_industry(industry, text_content)
    archetype = calculate_archetype(final_score, tier)
    benchmark = get_industry_benchmark(validated_industry)
    rev_msg = calculate_revenue_message(final_score, validated_industry, tier)

    result = {
        "score": final_score,
        "archetype": archetype,
        "industry": validated_industry,
        "benchmark": benchmark["benchmark"],
        "revenue_risk": rev_msg["value_display"],
        "revenue_message": rev_msg,
        "company_tier": tier,
        "breakdown": {
            "technical": math_result['breakdown'].get('technical', {}).get('score', 0),
            "content": math_result['breakdown'].get('content', {}).get('score', 0),
            "authority": math_result['breakdown'].get('authority', {}).get('score', 0),
            "ai_discoverability": math_result['breakdown'].get('ai_discoverability', {}).get('score', 0),
            "answerability": math_result['breakdown'].get('answerability', {}).get('score', 0),
            "ai_judgment": ai_result['ai_score'],
        },
        "detected_issues": ai_result.get("detected_issues", []),
        "fix_list": final_fix_list
    }

    # 7. Async Persona
    context = get_persona_context(
        url=request.url, text=text_content, industry=validated_industry, 
        company_tier=tier, score=final_score, 
        breakdown=result["breakdown"], detected_issues=result["detected_issues"], 
        benchmark=benchmark["benchmark"]
    )
    fire_persona_generation_async(request.url, context)

    save_analysis_to_db(request.email, request.url, result)
    print(f"   ✅ Final Score: {final_score}")
    return result

# ✅ FIXED ENDPOINT: Handles both HASH and RAW URL
@app.get("/persona/{identifier}")
async def get_persona_copy(identifier: str):
    # Try 1: Identifier is the hash (e.g. a2a8...)
    cached = get_cached_persona(identifier)
    
    # Try 2: Identifier is the URL (e.g. amazon.com) - Frontend mismatch fix
    if not cached:
        hashed_url = generate_url_hash(identifier) 
        cached = get_cached_persona(hashed_url)
        
    if not cached: return {"status": "not_found", "message": "No persona data"}
    return {"status": "ready", "data": cached}

@app.post("/generate-persona-copy")
async def generate_persona_copy(request: PersonaCopyRequest):
    context = get_persona_context(
        url=request.url, text=request.text, industry=request.industry, 
        company_tier=request.company_tier, score=request.score, 
        breakdown=request.breakdown, detected_issues=request.detected_issues, 
        benchmark=request.benchmark
    )
    result = generate_persona_copy_sync(context)
    url_hash = generate_url_hash(request.url)
    set_cached_persona(url_hash, result)
    return result

@app.post("/capture-lead")
async def capture_lead(request: LeadCaptureRequest):
    if not supabase: return {"status": "error"}
    supabase.table("leads").upsert({"email": request.email, "full_name": request.full_name, "company_name": request.company_name, "is_subscribed": True}, on_conflict="email").execute()
    return {"status": "success"}

@app.get("/health")
async def health_check():
    return {"status": "alive", "timestamp": datetime.now(timezone.utc).isoformat()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)