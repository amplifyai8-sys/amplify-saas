import requests
from bs4 import BeautifulSoup
from groq import Groq
import re
from textblob import TextBlob
from difflib import SequenceMatcher
import json
import datetime
import concurrent.futures

# --- 1. AI ENGINE ROOM (Single & Dual) ---

def ask_single_ai(prompt, groq_client):
    """
    Use only Groq for subjective/creative tasks to save tokens & time.
    Includes Error Logging (Enhancement #1).
    """
    try:
        return groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            timeout=6
        ).choices[0].message.content.strip()
    except Exception as e:
        print(f"⚠️ Groq Single-AI failed: {str(e)[:100]}")
        return "ERROR"

def ask_dual_intelligence(prompt, groq_client, gemini_client):
    """
    Fires Groq and Gemini simultaneously for Identity Verification.
    Returns a list of successful responses.
    ✅ UPDATED TO NEW GEMINI API
    """
    responses = []
    
    def call_groq():
        try:
            return groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.1,
                timeout=6
            ).choices[0].message.content.strip()
        except Exception as e:
            print(f"⚠️ Groq Dual-AI failed: {str(e)[:100]}")
            return None

    def call_gemini():
        """✅ NEW GEMINI API"""
        try:
            from google.genai import types
            
            response = gemini_client.models.generate_content(
                model='gemini-2.0-flash-exp',
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            print(f"⚠️ Gemini Dual-AI failed: {str(e)[:100]}")
            return None

    # Parallel Execution (~2s latency)
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_groq = executor.submit(call_groq)
        future_gemini = executor.submit(call_gemini)
        
        r1 = future_groq.result()
        r2 = future_gemini.result()
        
        if r1: responses.append(r1)
        if r2: responses.append(r2)

    if not responses: return ["ERROR"]
    return responses

# --- HELPER: CLEAN TEXT & TRUTH ---
def get_clean_text(html_content, limit=6000):
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        # Preserved 'nav' so AI can see menu links
        for script in soup(["script", "style", "footer", "svg", "noscript", "iframe", "button"]):
            script.extract()
        return soup.get_text(separator=' ', strip=True)[:limit]
    except:
        return ""

def get_ground_truth(html_content):
    """
    Extracts the 'Truth' for Hallucination Checking.
    Priority: Meta Description -> H1 -> First Paragraph
    """
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # 1. Meta Description
        meta = soup.find('meta', attrs={'name': 'description'})
        if meta and meta.get('content') and len(meta['content']) > 50:
            return meta['content']
            
        # 2. H1 Tag
        h1 = soup.find('h1')
        if h1 and h1.get_text() and len(h1.get_text()) > 10:
            return h1.get_text().strip()
            
        # 3. First Paragraph
        p1 = soup.find('p')
        if p1 and p1.get_text():
            return p1.get_text().strip()[:300]

        return "Unknown Website"
    except:
        return "Unknown Website"

def get_page_title(html_content):
    """Extracts <title> for AI Context Injection"""
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        if soup.title and soup.title.string:
            return soup.title.string.strip()[:100]
        return "No Title"
    except:
        return "No Title"

def _clean_money(value):
    if isinstance(value, (int, float)): return value
    try:
        clean = str(value).replace('$', '').replace(',', '').lower()
        if 'm' in clean: return float(clean.replace('m', '')) * 1000000
        if 'k' in clean: return float(clean.replace('k', '')) * 1000
        return float(clean)
    except:
        return 0

# --- FEATURE 1: THE CHAMELEON INTERROGATOR (Single AI) ---
def check_conversion_barriers(text, groq_client, gemini_client, industry):
    """
    Shapeshifts Persona based on Industry.
    Uses Single AI (Groq) for subjective analysis.
    """
    if len(text) < 200: return 0, ["🚫 Site Empty."]

    personas = {
        "SaaS": { "role": "Software Buyer", "q1": "PRICING: Is cost/pricing link visible?", "q2": "ICP: Who is this for?", "q3": "ACTION: Clear Demo/Start button?" },
        "Ecommerce": { "role": "Shopper", "q1": "COST: Shipping/Return policy clear?", "q2": "TRUST: Reviews/Badges visible?", "q3": "ACTION: Easy to checkout?" },
        "Healthcare": { "role": "Patient", "q1": "CREDENTIALS: Qualifications visible?", "q2": "LOCATION: Area clear?", "q3": "ACTION: Book Appointment button?" },
        "Entertainment": { "role": "Subscriber", "q1": "CONTENT: Library/Catalog clear?", "q2": "ACCESS: Easy signup?", "q3": "COMMITMENT: Cancel anytime?" },
        "Legal": { "role": "Client", "q1": "EXPERTISE: Practice area clear?", "q2": "AUTHORITY: Results/Years shown?", "q3": "ACTION: Free Consult offer?" },
        "General": { "role": "Visitor", "q1": "VALUE: Offer clear?", "q2": "TRUST: Active/Recent?", "q3": "ACTION: Next step?" }
    }

    target_persona = personas.get(industry, personas["General"])
    
    # Map niches to personas
    if industry in ["SaaS", "Fintech"]: target_persona = personas["SaaS"]
    elif industry in ["Ecommerce", "Retail"]: target_persona = personas["Ecommerce"]
    elif industry in ["Healthcare", "Medical", "Dental"]: target_persona = personas["Healthcare"]
    elif industry in ["Entertainment", "Media", "News"]: target_persona = personas["Entertainment"]
    elif industry in ["Legal", "Law"]: target_persona = personas["Legal"]

    prompt = f"""
    Act as a {target_persona['role']}. Analyze this text.
    Base answers ONLY on text provided. Do NOT guess.
    TEXT: "{text[:2000]}"
    
    QUESTIONS:
    1. {target_persona['q1']}
    2. {target_persona['q2']}
    3. {target_persona['q3']}
    
    Score 0-30. RETURN JSON: {{ "summary": "...", "interrogation_score": 15 }}
    """
    
    response = ask_single_ai(prompt, groq_client)
    
    try:
        data = json.loads(response.replace("```json", "").replace("```", "").strip())
        score = int(data.get("interrogation_score", 15))
        summary = data.get("summary", "Site analysis.")
        details = [f"🤖 Agent ({target_persona['role']}): \"{summary}\""]
        if score < 20: details.append(f"⚠️ Conversion Barrier: The {target_persona['role']} struggled.")
        return score, details
    except:
        return 15, ["⚠️ AI Analysis Failed: Could not interrogate site."]

# --- FEATURE 2: TECH & DENSITY (Pure Math) ---
def check_tech_seo(url):
    try:
        if not url.startswith("http"): url = "https://" + url
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, timeout=5, headers=headers)
        
        if response.status_code != 200: 
            return 0, [f"CRITICAL: Site unreachable ({response.status_code})."], None, 0
            
        text = get_clean_text(response.text)
        blob = TextBlob(text)
        
        # Info Density
        meaningful = [w for w, tag in blob.tags if tag.startswith('NN') or tag.startswith('VB')]
        total = len(text.split()) or 1
        density = int((len(meaningful) / total) * 100 * 2.5)
        
        # Tech Debt (Bloat Penalty)
        bloat_ratio = len(response.content) / max(1, len(text))
        
        score = 0
        details = []
        if density > 60:
            details.append(f"⚡ High Signal ({density}%): Efficient context usage.")
            score += 20
        elif density < 25:
            details.append(f"📉 Low Signal ({density}%): Too much fluff.")
            score += 5
        else:
            score += 10

        if bloat_ratio > 100:
            details.append("🕸️ High Technical Debt: Code bloat confuses crawlers.")
            score -= 5
        else:
            score += 5
            
        return max(0, score), details, response.content, response.elapsed.total_seconds()
    except Exception as e:
        return 0, [f"Connection Failed: {str(e)}"], None, 0

# --- FEATURE 3: DUAL-AI IDENTITY (The Judge) ---
def check_ai_seo(url, html_content, brand_name, groq_client, gemini_client):
    score = 0
    details = []
    text = get_clean_text(html_content, 1000)
    ground_truth = get_ground_truth(html_content)
    page_title = get_page_title(html_content)

    # Inject URL and Title so AI doesn't guess
    prompt = f"""
    Analyze website: {url}
    Page Title: "{page_title}"
    Extracted text: "{text[:600]}"
    
    Task: What specific product or service does '{brand_name}' sell?
    Base your answer ONLY on the text/title provided.
    If unknown, say 'Unknown'.
    """
    
    # 1. PARALLEL EXECUTION (Ask Both)
    responses = ask_dual_intelligence(prompt, groq_client, gemini_client)
    
    # 2. THE MATH JUDGE
    best_similarity = 0
    best_response = "Unknown"
    
    for resp in responses:
        sim = SequenceMatcher(None, ground_truth.lower(), resp.lower()).ratio()
        if sim > best_similarity:
            best_similarity = sim
            best_response = resp
            
    # 3. CONFIDENCE THRESHOLD
    confidence = round(best_similarity, 2)
    
    if best_similarity > 0.4: 
        score = 25
    elif best_similarity > 0.2:
        score = 15
        details.append(f"⚠️ Low Confidence ({int(confidence*100)}%): AI struggled to verify your exact offer.")
    else:
        score = 5
        details.append(f"😵 Hallucination Risk: Both AI models found your site confusing.")

    if "application/ld+json" in html_content: score += 10
    else: details.append("⚠️ Missing Schema: No Knowledge Graph anchors.")

    return min(score, 35), details, confidence

# --- FEATURE 4: AUTHORITY & TRENDS ---
def check_authority(html_content, brand_name, url, groq_client, gemini_client, industry):
    score = 0
    details = []
    text_lower = get_clean_text(html_content, 4000).lower()
    
    if any(x in url for x in ["amazon", "apple", "netflix", "stripe", "shopify"]):
        return 35, [], True, "Enterprise"

    trust_signals = ["case stud", "trusted by", "reviews", "testimoni", "client", "award", "partner"]
    found = [t for t in trust_signals if t in text_lower]
    
    if len(found) >= 2: score += 10
    else: details.append("📉 Social Proof Vacuum: No case studies detected.")

    if "linkedin.com" in html_content.lower(): score += 5
    else: details.append("👻 Digital Ghost: No LinkedIn profile.")
    
    current_year = str(datetime.datetime.now().year)
    if current_year in text_lower or "new" in text_lower:
        score += 5
        details.append(f"🚀 Velocity Bonus: Content updated for {current_year}.")

    return min(score, 20), details, False, "General"

# --- MAIN AGGREGATOR (Memoryless Simulator) ---
def analyze_industry_risk(html_content, groq_client, gemini_client, total_score, is_famous, tech_score):
    text = get_clean_text(html_content, 1000).lower()
    
    is_titan = False
    if any(x in text for x in ["amazon", "shopify", "stripe", "netflix"]) and is_famous:
        is_titan = True

    prompt = f"""
    Act as a VC Analyst. Analyze: "{text[:500]}"
    
    1. Detect specific Niche (e.g. 'Crypto Tax' instead of just Fintech).
    2. Estimate realistic Avg Customer Value (ACV) for this niche.
    3. Define a REALISTIC Benchmark Score (0-100) for market leaders in this niche.
       Base this on 2024-2025 industry standards. Do not invent aspirational requirements.
       Example: "Local Bakery" = 82, "Enterprise SaaS" = 95.
    
    RETURN JSON: {{ "industry": "SaaS", "niche": "Crypto Tax", "acv": 1000, "benchmark": 92 }}
    """
    
    try:
        resp = ask_single_ai(prompt, groq_client)
        data = json.loads(resp.replace("```json", "").replace("```", "").strip())
        industry = data.get("industry", "General")
        niche = data.get("niche", industry)
        acv = _clean_money(data.get("acv", 1000))
        target_standard = int(data.get("benchmark", 88))
        
        if len(niche) > 50: niche = niche[:50]
        if niche == industry: niche = f"{industry} Platform"
        
        if target_standard > 96: target_standard = 96
        if target_standard < 75: target_standard = 75
        
    except:
        industry = "General"
        niche = "General Business"
        acv = 1000
        target_standard = 88

    logic_score, logic_details = check_conversion_barriers(text, groq_client, gemini_client, industry)
    
    final_total = total_score + logic_score 
    if final_total > 98: final_total = 98
    
    benchmark_score = max(target_standard, final_total + 5)
    if benchmark_score > 99: benchmark_score = 99
    
    gap = benchmark_score - final_total
    traffic_multiplier = 100 if is_titan else 1
    revenue_risk = gap * (acv * 0.5) * traffic_multiplier
    
    if revenue_risk > 10000000: revenue_risk = "Enterprise Scale"
    
    if is_titan and final_total < 85: archetype = "The Drifting Giant"
    elif final_total >= benchmark_score - 3: archetype = "The Market Leader"
    elif tech_score < 10: archetype = "The Invisible Expert"
    else: archetype = "The Contender"

    return industry, niche, benchmark_score, revenue_risk, archetype, final_total, logic_details