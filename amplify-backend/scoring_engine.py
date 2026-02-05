# scoring_engine.py
# Math-based scoring engine - 60% of total score (0-60 points)
# No AI calls, instant execution, zero hallucination

import re
import json
import hashlib
from bs4 import BeautifulSoup
from textblob import TextBlob
from urllib.parse import urlparse

# ═══════════════════════════════════════════════════════════════════════════
# SECTION 1: TECHNICAL SEO SCORE (0-15 points)
# ═══════════════════════════════════════════════════════════════════════════

def calculate_technical_score(html_content: str, url: str) -> dict:
    """
    Pure math scoring for technical SEO signals.
    No AI, no tokens, instant execution.
    """
    score = 0
    factors = {}
    
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # 1. Meta Description (0-3 points)
        meta = soup.find('meta', attrs={'name': 'description'})
        if meta and meta.get('content'):
            meta_len = len(meta['content'])
            if 120 <= meta_len <= 160:
                score += 3
                factors['meta_description'] = {'score': 3, 'status': 'optimal', 'length': meta_len}
            elif 50 <= meta_len < 120:
                score += 2
                factors['meta_description'] = {'score': 2, 'status': 'short', 'length': meta_len}
            elif meta_len > 0:
                score += 1
                factors['meta_description'] = {'score': 1, 'status': 'exists', 'length': meta_len}
        else:
            factors['meta_description'] = {'score': 0, 'status': 'missing'}
        
        # 2. Title Tag (0-3 points)
        title = soup.find('title')
        if title and title.string:
            title_len = len(title.string.strip())
            if 30 <= title_len <= 60:
                score += 3
                factors['title_tag'] = {'score': 3, 'status': 'optimal', 'length': title_len}
            elif title_len > 0:
                score += 1
                factors['title_tag'] = {'score': 1, 'status': 'suboptimal', 'length': title_len}
        else:
            factors['title_tag'] = {'score': 0, 'status': 'missing'}
        
        # 3. Schema Markup (0-3 points)
        schema_scripts = soup.find_all('script', type='application/ld+json')
        if len(schema_scripts) >= 2:
            score += 3
            factors['schema_markup'] = {'score': 3, 'status': 'rich', 'count': len(schema_scripts)}
        elif len(schema_scripts) == 1:
            score += 2
            factors['schema_markup'] = {'score': 2, 'status': 'basic', 'count': 1}
        else:
            factors['schema_markup'] = {'score': 0, 'status': 'missing', 'count': 0}
        
        # 4. Heading Structure (0-3 points)
        h1_count = len(soup.find_all('h1'))
        h2_count = len(soup.find_all('h2'))
        if h1_count == 1 and h2_count >= 2:
            score += 3
            factors['heading_structure'] = {'score': 3, 'status': 'optimal', 'h1': h1_count, 'h2': h2_count}
        elif h1_count >= 1:
            score += 1
            factors['heading_structure'] = {'score': 1, 'status': 'basic', 'h1': h1_count, 'h2': h2_count}
        else:
            factors['heading_structure'] = {'score': 0, 'status': 'missing', 'h1': 0, 'h2': 0}
        
        # 5. HTTPS (0-3 points)
        if url.startswith('https://'):
            score += 3
            factors['https'] = {'score': 3, 'status': 'secure'}
        else:
            factors['https'] = {'score': 0, 'status': 'insecure'}
            
    except Exception as e:
        print(f"   ⚠️ Technical scoring error: {e}")
        
    return {
        'score': min(score, 15),
        'max': 15,
        'factors': factors
    }


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 2: CONTENT QUALITY SCORE (0-15 points)
# ═══════════════════════════════════════════════════════════════════════════

def calculate_content_score(text: str) -> dict:
    """
    NLP-based content analysis using TextBlob (FREE, local).
    No API calls, instant execution.
    """
    score = 0
    factors = {}
    
    try:
        # 1. Word Count (0-4 points)
        word_count = len(text.split())
        if word_count >= 1000:
            score += 4
            factors['word_count'] = {'score': 4, 'value': word_count, 'status': 'rich'}
        elif word_count >= 500:
            score += 3
            factors['word_count'] = {'score': 3, 'value': word_count, 'status': 'adequate'}
        elif word_count >= 200:
            score += 1
            factors['word_count'] = {'score': 1, 'value': word_count, 'status': 'thin'}
        else:
            factors['word_count'] = {'score': 0, 'value': word_count, 'status': 'empty'}
        
        # 2. Information Density (0-5 points) - TextBlob POS tagging
        blob = TextBlob(text[:3000])  # Limit for speed
        
        meaningful_tags = ['NN', 'NNS', 'NNP', 'NNPS', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ']
        meaningful_count = sum(1 for word, tag in blob.tags if tag in meaningful_tags)
        total_words = len(blob.words) or 1
        
        density_ratio = meaningful_count / total_words
        
        if density_ratio >= 0.45:
            score += 5
            factors['info_density'] = {'score': 5, 'ratio': round(density_ratio, 2), 'status': 'high_signal'}
        elif density_ratio >= 0.35:
            score += 3
            factors['info_density'] = {'score': 3, 'ratio': round(density_ratio, 2), 'status': 'medium_signal'}
        elif density_ratio >= 0.25:
            score += 1
            factors['info_density'] = {'score': 1, 'ratio': round(density_ratio, 2), 'status': 'low_signal'}
        else:
            factors['info_density'] = {'score': 0, 'ratio': round(density_ratio, 2), 'status': 'noise'}
        
        # 3. Readability (0-3 points)
        sentence_count = len(blob.sentences) or 1
        avg_sentence_length = word_count / sentence_count
        
        if 12 <= avg_sentence_length <= 22:
            score += 3
            factors['readability'] = {'score': 3, 'avg_sentence': round(avg_sentence_length, 1), 'status': 'optimal'}
        elif 8 <= avg_sentence_length <= 30:
            score += 2
            factors['readability'] = {'score': 2, 'avg_sentence': round(avg_sentence_length, 1), 'status': 'acceptable'}
        else:
            score += 1
            factors['readability'] = {'score': 1, 'avg_sentence': round(avg_sentence_length, 1), 'status': 'poor'}
        
        # 4. Sentiment Confidence (0-3 points)
        sentiment = blob.sentiment.polarity
        
        if sentiment >= 0.2:
            score += 3
            factors['sentiment'] = {'score': 3, 'polarity': round(sentiment, 2), 'status': 'positive'}
        elif sentiment >= 0:
            score += 2
            factors['sentiment'] = {'score': 2, 'polarity': round(sentiment, 2), 'status': 'neutral'}
        else:
            score += 0
            factors['sentiment'] = {'score': 0, 'polarity': round(sentiment, 2), 'status': 'negative'}
            
    except Exception as e:
        print(f"   ⚠️ Content scoring error: {e}")
        
    return {
        'score': min(score, 15),
        'max': 15,
        'factors': factors
    }


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 3: AUTHORITY SIGNALS SCORE (0-15 points)
# ═══════════════════════════════════════════════════════════════════════════

def calculate_authority_score(html_content: str, text: str) -> dict:
    """
    Detects trust signals using pattern matching.
    No AI, instant, deterministic.
    """
    score = 0
    factors = {}
    
    try:
        text_lower = text.lower()
        html_lower = html_content.lower()
        
        # 1. Social Proof Links (0-4 points)
        social_platforms = {
            'linkedin.com': 2,
            'twitter.com': 1, 'x.com': 1,
            'facebook.com': 1,
            'youtube.com': 1,
            'github.com': 1
        }
        
        social_score = 0
        found_socials = []
        for platform, points in social_platforms.items():
            if platform in html_lower:
                social_score += points
                found_socials.append(platform.split('.')[0])
        
        social_score = min(social_score, 4)
        score += social_score
        factors['social_presence'] = {
            'score': social_score, 
            'platforms': found_socials,
            'status': 'strong' if social_score >= 3 else 'weak' if social_score > 0 else 'missing'
        }
        
        # 2. Trust Language (0-5 points)
        trust_phrases = [
            'trusted by', 'case study', 'testimonial', 'review',
            'client', 'customer', 'partner', 'award', 'certified',
            'featured in', 'as seen', 'enterprise', 'security'
        ]
        
        found_trust = [phrase for phrase in trust_phrases if phrase in text_lower]
        trust_score = min(len(found_trust) * 2, 5)
        score += trust_score
        factors['trust_signals'] = {
            'score': trust_score,
            'found': found_trust[:5],
            'status': 'strong' if trust_score >= 4 else 'weak' if trust_score > 0 else 'missing'
        }
        
        # 3. Freshness Indicators (0-3 points)
        import datetime
        current_year = str(datetime.datetime.now().year)
        last_year = str(datetime.datetime.now().year - 1)
        
        freshness_score = 0
        if current_year in text_lower:
            freshness_score += 2
        elif last_year in text_lower:
            freshness_score += 1
            
        if any(x in html_lower for x in ['/blog', '/news', '/articles']):
            freshness_score += 1
            
        freshness_score = min(freshness_score, 3)
        score += freshness_score
        factors['freshness'] = {
            'score': freshness_score,
            'has_current_year': current_year in text_lower,
            'status': 'fresh' if freshness_score >= 2 else 'stale'
        }
        
        # 4. Contact Transparency (0-3 points)
        contact_signals = ['contact', 'email', 'phone', 'address', 'location']
        found_contact = [c for c in contact_signals if c in text_lower]
        
        contact_score = min(len(found_contact), 3)
        score += contact_score
        factors['contact_transparency'] = {
            'score': contact_score,
            'found': found_contact,
            'status': 'transparent' if contact_score >= 2 else 'hidden'
        }
        
    except Exception as e:
        print(f"   ⚠️ Authority scoring error: {e}")
        
    return {
        'score': min(score, 15),
        'max': 15,
        'factors': factors
    }


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 4: AI DISCOVERABILITY SCORE (0-10 points)
# ═══════════════════════════════════════════════════════════════════════════

def calculate_ai_discoverability_score(html_content: str, text: str) -> dict:
    """
    Measures how well optimized for AI search engines.
    Based on FAQ, schema, entities, conversational patterns.
    """
    score = 0
    factors = {}
    
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        text_lower = text.lower()
        
        # 1. FAQ Detection (0-3 points)
        faq_indicators = ['faq', 'frequently asked', 'common questions', 'q&a']
        has_faq_text = any(f in text_lower for f in faq_indicators)
        has_faq_schema = 'faqpage' in html_content.lower()
        
        if has_faq_schema:
            score += 3
            factors['faq_section'] = {'score': 3, 'status': 'schema_faq'}
        elif has_faq_text:
            score += 2
            factors['faq_section'] = {'score': 2, 'status': 'text_faq'}
        else:
            factors['faq_section'] = {'score': 0, 'status': 'missing'}
        
        # 2. Clear Value Proposition (0-3 points)
        h1 = soup.find('h1')
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        
        clarity_score = 0
        if h1 and len(h1.get_text().strip()) > 10:
            clarity_score += 1
        if meta_desc and meta_desc.get('content') and len(meta_desc['content']) > 80:
            clarity_score += 2
        
        score += clarity_score
        factors['value_clarity'] = {'score': clarity_score, 'max': 3}
        
        # 3. Conversational Content (0-2 points)
        question_patterns = ['what ', 'how ', 'why ', 'when ', 'where ', 'who ', 'can ', 'does ', 'is ']
        question_count = sum(1 for q in question_patterns if q in text_lower)
        
        if question_count >= 5:
            conv_score = 2
        elif question_count >= 2:
            conv_score = 1
        else:
            conv_score = 0
        
        score += conv_score
        factors['conversational_content'] = {'score': conv_score, 'question_patterns': question_count}
        
        # 4. Entity Mentions (0-2 points)
        entity_indicators = ['we ', 'our ', 'us ', ' inc', ' llc', ' ltd', 'founded', 'established']
        entity_count = sum(1 for e in entity_indicators if e in text_lower)
        
        if entity_count >= 3:
            entity_score = 2
        elif entity_count >= 1:
            entity_score = 1
        else:
            entity_score = 0
        
        score += entity_score
        factors['entity_clarity'] = {'score': entity_score, 'indicators': entity_count}
        
    except Exception as e:
        print(f"   ⚠️ AI Discoverability scoring error: {e}")
        
    return {
        'score': min(score, 10),
        'max': 10,
        'factors': factors
    }


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 5: CONTENT ANSWERABILITY SCORE (0-5 points) - NEW!
# ═══════════════════════════════════════════════════════════════════════════

def calculate_answerability_score(text: str) -> dict:
    """
    Measures how many TYPES of questions the content could answer.
    Proxy for "query coverage" without expensive embeddings.
    """
    score = 0
    factors = {}
    
    try:
        text_lower = text.lower()
        
        answerable_patterns = {
            "what_is": ["is a", "are a", "means", "defined as", "refers to"],
            "how_to": ["how to", "steps", "guide", "process", "method"],
            "why": ["because", "reason", "benefit", "advantage"],
            "comparison": ["vs", "versus", "compared to", "better than", "difference"],
            "cost": ["price", "cost", "pricing", "$", "free", "subscription"],
            "location": ["located", "address", "find us", "visit", "hours"],
            "contact": ["contact", "email", "phone", "call", "reach"],
            "reviews": ["review", "testimonial", "rating", "feedback"]
        }
        
        covered_types = []
        
        for query_type, indicators in answerable_patterns.items():
            if any(ind in text_lower for ind in indicators):
                covered_types.append(query_type)
        
        coverage_ratio = len(covered_types) / len(answerable_patterns)
        score = round(coverage_ratio * 5)
        
        factors['covered_types'] = covered_types
        factors['missing_types'] = [t for t in answerable_patterns.keys() if t not in covered_types]
        factors['coverage_ratio'] = round(coverage_ratio, 2)
        
    except Exception as e:
        print(f"   ⚠️ Answerability scoring error: {e}")
        
    return {
        'score': min(score, 5),
        'max': 5,
        'factors': factors
    }


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 6: URL VARIANCE (Uniqueness Factor)
# ═══════════════════════════════════════════════════════════════════════════

def calculate_url_variance(url: str) -> int:
    """
    Adds small deterministic variance based on URL hash.
    Same URL = same variance (consistent).
    Range: -2 to +2 points
    """
    url_hash = hashlib.md5(url.lower().encode()).hexdigest()
    variance = (int(url_hash[:2], 16) % 5) - 2
    return variance


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 7: MAIN AGGREGATOR
# ═══════════════════════════════════════════════════════════════════════════

def calculate_math_score(html_content: str, text: str, url: str) -> dict:
    """
    Calculates 60% of final score using pure math.
    Returns detailed breakdown for transparency.
    """
    technical = calculate_technical_score(html_content, url)
    content = calculate_content_score(text)
    authority = calculate_authority_score(html_content, text)
    ai_disc = calculate_ai_discoverability_score(html_content, text)
    answerability = calculate_answerability_score(text)
    variance = calculate_url_variance(url)
    
    base_score = (
        technical['score'] + 
        content['score'] + 
        authority['score'] + 
        ai_disc['score'] + 
        answerability['score']
    )
    
    final_math_score = max(0, min(60, base_score + variance))
    
    return {
        'total': final_math_score,
        'max': 60,
        'variance': variance,
        'breakdown': {
            'technical': technical,
            'content': content,
            'authority': authority,
            'ai_discoverability': ai_disc,
            'answerability': answerability
        }
    }