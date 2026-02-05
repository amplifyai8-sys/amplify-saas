# famous_brands.py
# Famous brand detection and tier classification
# Expanded list: Major US & Canadian Giants (Tier 1)
# Prevents wrong scores for blocked enterprise sites

from urllib.parse import urlparse

# ═══════════════════════════════════════════════════════════════════════════
# TIER 1 GIANTS: Known brands with pre-set minimum scores
# ═══════════════════════════════════════════════════════════════════════════

TIER_1_GIANTS = {
    # --- US TECH GIANTS ---
    "amazon.com": {"industry": "E-Commerce", "tier": "enterprise", "min_score": 85},
    "apple.com": {"industry": "Technology", "tier": "enterprise", "min_score": 90},
    "google.com": {"industry": "Technology", "tier": "enterprise", "min_score": 92},
    "microsoft.com": {"industry": "Technology", "tier": "enterprise", "min_score": 90},
    "meta.com": {"industry": "Technology", "tier": "enterprise", "min_score": 85},
    "netflix.com": {"industry": "Entertainment", "tier": "enterprise", "min_score": 88},
    "spotify.com": {"industry": "Entertainment", "tier": "enterprise", "min_score": 85},
    "salesforce.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 88},
    "adobe.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 87},
    "oracle.com": {"industry": "Technology", "tier": "enterprise", "min_score": 82},
    "ibm.com": {"industry": "Technology", "tier": "enterprise", "min_score": 80},
    "intel.com": {"industry": "Technology", "tier": "enterprise", "min_score": 80},
    "nvidia.com": {"industry": "Technology", "tier": "enterprise", "min_score": 88},
    "cisco.com": {"industry": "Technology", "tier": "enterprise", "min_score": 82},
    "uber.com": {"industry": "Transportation", "tier": "enterprise", "min_score": 85},
    "lyft.com": {"industry": "Transportation", "tier": "enterprise", "min_score": 80},
    "airbnb.com": {"industry": "Travel", "tier": "enterprise", "min_score": 86},
    "booking.com": {"industry": "Travel", "tier": "enterprise", "min_score": 85},
    "expedia.com": {"industry": "Travel", "tier": "enterprise", "min_score": 82},
    "zillow.com": {"industry": "Real Estate", "tier": "enterprise", "min_score": 84},
    "openai.com": {"industry": "AI/Tech", "tier": "enterprise", "min_score": 90},
    "anthropic.com": {"industry": "AI/Tech", "tier": "enterprise", "min_score": 88},

    # --- US RETAIL & CPG ---
    "walmart.com": {"industry": "Retail", "tier": "enterprise", "min_score": 82},
    "target.com": {"industry": "Retail", "tier": "enterprise", "min_score": 80},
    "costco.com": {"industry": "Retail", "tier": "enterprise", "min_score": 78},
    "homedepot.com": {"industry": "Retail", "tier": "enterprise", "min_score": 80},
    "lowes.com": {"industry": "Retail", "tier": "enterprise", "min_score": 78},
    "bestbuy.com": {"industry": "Retail", "tier": "enterprise", "min_score": 80},
    "nike.com": {"industry": "Retail", "tier": "enterprise", "min_score": 88},
    "starbucks.com": {"industry": "Food & Bev", "tier": "enterprise", "min_score": 85},
    "mcdonalds.com": {"industry": "Food & Bev", "tier": "enterprise", "min_score": 82},
    "cocacola.com": {"industry": "Food & Bev", "tier": "enterprise", "min_score": 85},
    "pepsi.com": {"industry": "Food & Bev", "tier": "enterprise", "min_score": 82},
    "procterandgamble.com": {"industry": "CPG", "tier": "enterprise", "min_score": 80},
    "jnj.com": {"industry": "Healthcare", "tier": "enterprise", "min_score": 82},
    "cvs.com": {"industry": "Healthcare", "tier": "enterprise", "min_score": 80},
    "walgreens.com": {"industry": "Healthcare", "tier": "enterprise", "min_score": 78},

    # --- US FINANCE ---
    "jpmorganchase.com": {"industry": "Finance", "tier": "enterprise", "min_score": 85},
    "chase.com": {"industry": "Finance", "tier": "enterprise", "min_score": 85},
    "bankofamerica.com": {"industry": "Finance", "tier": "enterprise", "min_score": 82},
    "wellsfargo.com": {"industry": "Finance", "tier": "enterprise", "min_score": 80},
    "citigroup.com": {"industry": "Finance", "tier": "enterprise", "min_score": 80},
    "americanexpress.com": {"industry": "Finance", "tier": "enterprise", "min_score": 85},
    "visa.com": {"industry": "Finance", "tier": "enterprise", "min_score": 88},
    "mastercard.com": {"industry": "Finance", "tier": "enterprise", "min_score": 88},
    "paypal.com": {"industry": "Fintech", "tier": "enterprise", "min_score": 85},
    "stripe.com": {"industry": "Fintech", "tier": "enterprise", "min_score": 90},
    "square.com": {"industry": "Fintech", "tier": "enterprise", "min_score": 85},
    "intuit.com": {"industry": "Fintech", "tier": "enterprise", "min_score": 84},
    "goldmansachs.com": {"industry": "Finance", "tier": "enterprise", "min_score": 85},
    "fidelity.com": {"industry": "Finance", "tier": "enterprise", "min_score": 84},
    "schwab.com": {"industry": "Finance", "tier": "enterprise", "min_score": 82},

    # --- US MEDIA & TELCO ---
    "disney.com": {"industry": "Entertainment", "tier": "enterprise", "min_score": 88},
    "hbo.com": {"industry": "Entertainment", "tier": "enterprise", "min_score": 85},
    "nytimes.com": {"industry": "Media", "tier": "enterprise", "min_score": 88},
    "cnn.com": {"industry": "Media", "tier": "enterprise", "min_score": 85},
    "foxnews.com": {"industry": "Media", "tier": "enterprise", "min_score": 82},
    "att.com": {"industry": "Telecom", "tier": "enterprise", "min_score": 78},
    "verizon.com": {"industry": "Telecom", "tier": "enterprise", "min_score": 80},
    "t-mobile.com": {"industry": "Telecom", "tier": "enterprise", "min_score": 80},
    "comcast.com": {"industry": "Telecom", "tier": "enterprise", "min_score": 78},
    "xfinity.com": {"industry": "Telecom", "tier": "enterprise", "min_score": 78},

    # --- US AUTO ---
    "tesla.com": {"industry": "Automotive", "tier": "enterprise", "min_score": 88},
    "ford.com": {"industry": "Automotive", "tier": "enterprise", "min_score": 80},
    "gm.com": {"industry": "Automotive", "tier": "enterprise", "min_score": 78},
    "chevrolet.com": {"industry": "Automotive", "tier": "enterprise", "min_score": 78},
    "toyota.com": {"industry": "Automotive", "tier": "enterprise", "min_score": 82},
    "honda.com": {"industry": "Automotive", "tier": "enterprise", "min_score": 80},

    # --- CANADIAN GIANTS (Tier 1 Mix) ---
    "shopify.ca": {"industry": "E-Commerce", "tier": "enterprise", "min_score": 89},
    "shopify.com": {"industry": "E-Commerce", "tier": "enterprise", "min_score": 89},
    "rbc.com": {"industry": "Finance", "tier": "enterprise", "min_score": 85},
    "td.com": {"industry": "Finance", "tier": "enterprise", "min_score": 84},
    "scotiabank.com": {"industry": "Finance", "tier": "enterprise", "min_score": 82},
    "bmo.com": {"industry": "Finance", "tier": "enterprise", "min_score": 82},
    "cibc.com": {"industry": "Finance", "tier": "enterprise", "min_score": 80},
    "manulife.com": {"industry": "Insurance", "tier": "enterprise", "min_score": 80},
    "sunlife.com": {"industry": "Insurance", "tier": "enterprise", "min_score": 80},
    "thomsonreuters.com": {"industry": "Media", "tier": "enterprise", "min_score": 85},
    "lululemon.com": {"industry": "Retail", "tier": "enterprise", "min_score": 88},
    "aritzia.com": {"industry": "Retail", "tier": "enterprise", "min_score": 84},
    "canadagoose.com": {"industry": "Retail", "tier": "enterprise", "min_score": 82},
    "roots.com": {"industry": "Retail", "tier": "growth", "min_score": 78},
    "timhortons.ca": {"industry": "Food & Bev", "tier": "enterprise", "min_score": 80},
    "timhortons.com": {"industry": "Food & Bev", "tier": "enterprise", "min_score": 80},
    "aircanada.com": {"industry": "Travel", "tier": "enterprise", "min_score": 80},
    "westjet.com": {"industry": "Travel", "tier": "enterprise", "min_score": 78},
    "rogers.com": {"industry": "Telecom", "tier": "enterprise", "min_score": 78},
    "bell.ca": {"industry": "Telecom", "tier": "enterprise", "min_score": 78},
    "telus.com": {"industry": "Telecom", "tier": "enterprise", "min_score": 78},
    "blackberry.com": {"industry": "Technology", "tier": "enterprise", "min_score": 75},
    "opentext.com": {"industry": "Technology", "tier": "enterprise", "min_score": 80},
    "cgi.com": {"industry": "Technology", "tier": "enterprise", "min_score": 80},
    "loblaws.ca": {"industry": "Retail", "tier": "enterprise", "min_score": 78},
    "metro.ca": {"industry": "Retail", "tier": "enterprise", "min_score": 78},
    "sobeys.com": {"industry": "Retail", "tier": "enterprise", "min_score": 78},
    "enbridge.com": {"industry": "Energy", "tier": "enterprise", "min_score": 78},
    "cn.ca": {"industry": "Transportation", "tier": "enterprise", "min_score": 80},
    
    # --- CANADIAN GROWTH & TECH ---
    "neofinancial.com": {"industry": "Fintech", "tier": "growth", "min_score": 75},
    "wealthsimple.com": {"industry": "Fintech", "tier": "growth", "min_score": 78},
    "hootsuite.com": {"industry": "SaaS", "tier": "growth", "min_score": 76},
    "clio.com": {"industry": "Legal Tech", "tier": "growth", "min_score": 74},
    "freshbooks.com": {"industry": "SaaS", "tier": "growth", "min_score": 75},
    "unbounce.com": {"industry": "SaaS", "tier": "growth", "min_score": 73},
    "dapperlabs.com": {"industry": "Web3", "tier": "growth", "min_score": 75},
    "1password.com": {"industry": "SaaS", "tier": "growth", "min_score": 82},
    "kik.com": {"industry": "Social", "tier": "growth", "min_score": 70},
    "wattpad.com": {"industry": "Media", "tier": "growth", "min_score": 80},
    "koho.ca": {"industry": "Fintech", "tier": "growth", "min_score": 72},
    "jobber.com": {"industry": "SaaS", "tier": "growth", "min_score": 74},
    "jane.app": {"industry": "SaaS", "tier": "growth", "min_score": 75},
    "lightspeedhq.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 82},
    
    # --- COMMON SAAS & TOOLS (Global/US) ---
    "slack.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 85},
    "zoom.us": {"industry": "SaaS", "tier": "enterprise", "min_score": 84},
    "notion.so": {"industry": "SaaS", "tier": "enterprise", "min_score": 83},
    "figma.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 84},
    "canva.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 85},
    "mailchimp.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 82},
    "zendesk.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 83},
    "hubspot.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 87},
    "atlassian.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 84},
    "trello.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 82},
    "asana.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 82},
    "monday.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 82},
    "clickup.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 80},
    "intercom.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 80},
    "drift.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 78},
    "linear.app": {"industry": "SaaS", "tier": "growth", "min_score": 78},
    "airtable.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 82},
    "loom.com": {"industry": "SaaS", "tier": "growth", "min_score": 78},
    "miro.com": {"industry": "SaaS", "tier": "enterprise", "min_score": 82},
}

# Social platforms that always block (don't penalize)
KNOWN_BLOCKED_DOMAINS = {
    "facebook.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 85},
    "instagram.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 85},
    "twitter.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 82},
    "x.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 82},
    "linkedin.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 88},
    "tiktok.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 80},
    "pinterest.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 80},
    "reddit.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 80},
    "snapchat.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 78},
    "whatsapp.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 85},
    "youtube.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 88},
    "vimeo.com": {"industry": "Social Media", "tier": "enterprise", "min_score": 80},
}


def get_brand_tier(url: str) -> dict | None:
    """
    Check if URL belongs to a known brand.
    Returns tier info or None if unknown.
    """
    try:
        parsed = urlparse(url if url.startswith('http') else f'https://{url}')
        domain = parsed.netloc.lower().replace('www.', '')
        
        # Check Tier 1 Giants
        if domain in TIER_1_GIANTS:
            return {**TIER_1_GIANTS[domain], "domain": domain, "source": "tier1_giants"}
        
        # Check Known Blocked
        if domain in KNOWN_BLOCKED_DOMAINS:
            return {**KNOWN_BLOCKED_DOMAINS[domain], "domain": domain, "source": "known_blocked"}
        
        # Check subdomain matches (e.g., shop.nike.com)
        for known_domain, info in TIER_1_GIANTS.items():
            if domain.endswith(f'.{known_domain}') or domain.endswith(known_domain):
                return {**info, "domain": domain, "source": "subdomain_match"}
        
        return None
        
    except Exception as e:
        print(f"   ⚠️ Brand tier check error: {e}")
        return None

def detect_company_tier_from_content(text: str) -> str:
    """
    Detects company tier (enterprise/growth/local) from content signals.
    Used when brand is NOT in our known list.
    """
    text_lower = text.lower()
    
    # Enterprise Signals
    enterprise_signals = [
        "fortune 500", "enterprise", "global", "publicly traded",
        "nasdaq", "nyse", "series d", "series e", "ipo",
        "billion", "10,000+ employees", "worldwide", "multinational"
    ]
    
    # Growth/Scale-up Signals
    growth_signals = [
        "series a", "series b", "series c", "backed by",
        "funded", "venture", "raised", "million in funding",
        "scaling", "growing team", "100+ employees", "startup"
    ]
    
    # Local Business Signals
    local_signals = [
        "family owned", "locally owned", "serving the", "neighborhood",
        "call us today", "visit our location", "hours:", "appointment",
        "free consultation", "free estimate", "licensed and insured"
    ]
    
    enterprise_count = sum(1 for s in enterprise_signals if s in text_lower)
    growth_count = sum(1 for s in growth_signals if s in text_lower)
    local_count = sum(1 for s in local_signals if s in text_lower)
    
    if enterprise_count > growth_count and enterprise_count > local_count:
        return "enterprise"
    elif growth_count > local_count:
        return "growth"
    elif local_count > 0:
        return "local"
    
    return "unknown"