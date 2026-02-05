# industry_config.py
# Industry benchmarks, keywords, and revenue messaging
# Supports 15 industries with Hormozi-style messaging

# ═══════════════════════════════════════════════════════════════════════════
# INDUSTRY KEYWORDS FOR DETECTION
# ═══════════════════════════════════════════════════════════════════════════

INDUSTRY_KEYWORDS = {
    "SaaS/Tech": ["software", "platform", "api", "cloud", "dashboard", "pricing", "free trial", "enterprise", "integration", "saas"],
    "E-Commerce": ["shop", "cart", "checkout", "shipping", "product", "buy now", "add to cart", "returns", "order"],
    "Fintech": ["banking", "finance", "investment", "trading", "payment", "transfer", "wallet", "crypto", "fdic"],
    "Healthcare/Medical": ["doctor", "medical", "clinic", "patient", "appointment", "health", "treatment", "hospital"],
    "Dental": ["dental", "dentist", "teeth", "orthodontic", "cleaning", "implant", "smile", "oral"],
    "Legal": ["attorney", "lawyer", "law firm", "legal", "court", "injury", "defense", "litigation"],
    "Real Estate": ["realtor", "property", "home", "listing", "mls", "mortgage", "buying", "selling", "rental"],
    "Restaurant/Food": ["menu", "restaurant", "cafe", "food", "cuisine", "reservation", "delivery", "dine"],
    "Home Services": ["plumbing", "hvac", "roofing", "contractor", "repair", "estimate", "licensed", "emergency"],
    "Fitness/Wellness": ["gym", "fitness", "workout", "yoga", "membership", "trainer", "wellness", "health"],
    "Professional Services": ["consulting", "accounting", "advisory", "strategy", "business", "firm"],
    "Education/EdTech": ["course", "learn", "training", "certification", "student", "enroll", "education"],
    "Automotive": ["auto", "car", "vehicle", "service", "repair", "dealership", "oil change", "mechanic"],
    "Travel/Hospitality": ["hotel", "travel", "booking", "vacation", "resort", "flight", "accommodation"],
    "Non-Profit": ["donate", "mission", "volunteer", "cause", "charity", "foundation", "support"]
}

# ═══════════════════════════════════════════════════════════════════════════
# INDUSTRY BENCHMARKS
# ═══════════════════════════════════════════════════════════════════════════

INDUSTRY_BENCHMARKS = {
    "SaaS/Tech": {"benchmark": 88, "avg_customer_value": 1500},
    "E-Commerce": {"benchmark": 85, "avg_customer_value": 75},
    "Fintech": {"benchmark": 90, "avg_customer_value": 2000},
    "Healthcare/Medical": {"benchmark": 82, "avg_customer_value": 500},
    "Dental": {"benchmark": 80, "avg_customer_value": 400},
    "Legal": {"benchmark": 85, "avg_customer_value": 3000},
    "Real Estate": {"benchmark": 78, "avg_customer_value": 8000},
    "Restaurant/Food": {"benchmark": 72, "avg_customer_value": 35},
    "Home Services": {"benchmark": 75, "avg_customer_value": 350},
    "Fitness/Wellness": {"benchmark": 76, "avg_customer_value": 80},
    "Professional Services": {"benchmark": 82, "avg_customer_value": 2500},
    "Education/EdTech": {"benchmark": 80, "avg_customer_value": 500},
    "Automotive": {"benchmark": 74, "avg_customer_value": 150},
    "Travel/Hospitality": {"benchmark": 77, "avg_customer_value": 200},
    "Non-Profit": {"benchmark": 70, "avg_customer_value": 100},
    "Local Service": {"benchmark": 72, "avg_customer_value": 200},
    "General": {"benchmark": 75, "avg_customer_value": 300}
}


def validate_industry(ai_suggested_industry: str, text: str) -> str:
    """
    Cross-checks AI's industry guess against content keywords.
    Returns validated or corrected industry.
    """
    text_lower = text.lower()
    
    industry_scores = {}
    for industry, keywords in INDUSTRY_KEYWORDS.items():
        matches = sum(1 for k in keywords if k in text_lower)
        if matches > 0:
            industry_scores[industry] = matches
    
    if not industry_scores:
        return ai_suggested_industry or "General"
    
    best_match = max(industry_scores, key=industry_scores.get)
    best_score = industry_scores[best_match]
    
    # Need at least 3 keyword matches to override AI
    if best_score >= 3:
        return best_match
    
    # If AI suggested something valid, trust it
    if ai_suggested_industry in INDUSTRY_BENCHMARKS:
        return ai_suggested_industry
    
    return best_match


def get_industry_benchmark(industry: str) -> dict:
    """Returns benchmark data for an industry."""
    return INDUSTRY_BENCHMARKS.get(industry, INDUSTRY_BENCHMARKS["General"])


# ═══════════════════════════════════════════════════════════════════════════
# REVENUE MESSAGING (HORMOZI-STYLE)
# ═══════════════════════════════════════════════════════════════════════════

def calculate_revenue_message(score: int, industry: str, company_tier: str) -> dict:
    """
    Returns tier-appropriate revenue risk messaging.
    Based on Alex Hormozi's $100M Offers psychology.
    """
    benchmark_data = get_industry_benchmark(industry)
    benchmark = benchmark_data["benchmark"]
    acv = benchmark_data["avg_customer_value"]
    gap = max(0, benchmark - score)
    
    if company_tier == "enterprise":
        # ENTERPRISE: Sell competitive advantage, not money
        return {
            "display_type": "competitive",
            "headline": f"Competitive Blind Spot: {gap}% Below AI-First Leaders",
            "subheadline": "Your competitors are already optimizing for AI search. Every month you wait, they capture more market share.",
            "value_display": None,
            "cta_text": "Protect Market Position",
            "psychology": "fear_of_falling_behind"
        }
    
    elif company_tier == "growth":
        # GROWTH: Sell opportunity cost with specific numbers
        multiplier = 1500 if "tech" in industry.lower() or "saas" in industry.lower() else 800
        estimated_loss = gap * multiplier
        
        return {
            "display_type": "monetary",
            "headline": f"Est. Pipeline Leak: ${estimated_loss:,}/mo",
            "subheadline": "AI-assisted buyers are researching your category right now. When they ask ChatGPT, are you in the answer?",
            "value_display": f"${estimated_loss:,}",
            "cta_text": "Capture Hidden Pipeline",
            "psychology": "opportunity_cost"
        }
    
    elif company_tier == "local":
        # LOCAL: Sell customer count, not abstract dollars
        estimated_customers = max(3, gap // 8)
        implied_value = estimated_customers * acv
        
        return {
            "display_type": "customers",
            "headline": f"~{estimated_customers} Customers Finding Competitors Instead",
            "subheadline": f"When locals ask AI 'best {industry.lower()} near me', you're invisible. Your competitors aren't.",
            "value_display": f"{estimated_customers} customers/mo",
            "implied_value": f"~${implied_value:,}/mo",
            "cta_text": "Show Up in AI Search",
            "psychology": "local_competition"
        }
    
    else:
        # DEFAULT: Standard messaging
        estimated_loss = gap * 500
        
        return {
            "display_type": "monetary",
            "headline": f"Est. Revenue at Risk: ${estimated_loss:,}/mo",
            "subheadline": "AI search is capturing 40% of purchase-intent queries. Are you showing up?",
            "value_display": f"${estimated_loss:,}",
            "cta_text": "Get AI Visibility Audit",
            "psychology": "standard_fomo"
        }


def calculate_archetype(score: int, company_tier: str) -> str:
    """
    Determines archetype based on score ranges.
    Consistent, no AI hallucination.
    """
    if score >= 85:
        return "The Titan"
    elif score >= 75:
        return "High Performer"
    elif score >= 60:
        return "The Contender"
    elif score >= 45:
        return "Vulnerable Incumbent"
    else:
        return "Signal Dilution"