"""Market signals for the daily planner (free, no keys; every source is optional and fails soft).  python scripts/market_signals.py [--out state/market_signals.json]
 - Google/YouTube autocomplete for Hinglish + English seed queries = what people actually type (demand)
 - Google Trends daily trending searches (India)  = what is hot today
 - Hacker News front page, AI-related titles       = what the AI world is talking about (news hooks)
 - YouTube Data API (only if env YT_API_KEY is set): most-viewed recent Hindi AI videos = what is working in Hindi short video
Instagram has no public trending-Reels API, so YouTube + search demand are the proxies. The planner (Claude) adds WebSearch on top."""
import argparse, json, os, re, sys, time, urllib.parse, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta

SEEDS = ["ai kya hai", "chatgpt kaise kaam karta hai", "ai agent kya hai", "rag kya hai", "llm kya hai", "prompt engineering hindi", "machine learning hindi",
         "ai tools hindi", "ai engineer kaise bane", "chatgpt vs gemini", "claude ai", "deepseek", "ai jobs", "ai se paise kaise kamaye", "vibe coding", "mcp kya hai",
         "fine tuning kya hai", "transformer kya hai", "hallucination ai", "token kya hota hai"]
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}

def fetch(url, timeout=20):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout).read()

def autocomplete(q, yt=False):
    u = "https://suggestqueries.google.com/complete/search?" + urllib.parse.urlencode({"client": "firefox", "q": q, "hl": "hi", "gl": "in", **({"ds": "yt"} if yt else {})})
    try: return json.loads(fetch(u).decode("utf-8", "replace"))[1][:10]
    except Exception as e: return [f"ERR {type(e).__name__}"]

def trends():
    try:
        root = ET.fromstring(fetch("https://trends.google.com/trending/rss?geo=IN"))
        ns = {"ht": "https://trends.google.com/trending/rss"}
        return [{"query": (i.findtext("title") or ""), "traffic": (i.findtext("ht:approx_traffic", namespaces=ns) or "")} for i in root.iter("item")][:25]
    except Exception as e: return [{"query": f"ERR {type(e).__name__}: {e}"}]

def hn():
    try:
        ids = json.loads(fetch("https://hacker-news.firebaseio.com/v0/topstories.json"))[:60]; out = []
        for i in ids:
            it = json.loads(fetch(f"https://hacker-news.firebaseio.com/v0/item/{i}.json", 10) or b"{}")
            t = it.get("title", "")
            if re.search(r"\b(AI|LLM|GPT|Claude|Gemini|OpenAI|Anthropic|model|agent|neural|transformer|DeepSeek|Llama|Mistral)\b", t, re.I): out.append({"title": t, "score": it.get("score"), "url": it.get("url")})
        return out[:15]
    except Exception as e: return [{"title": f"ERR {type(e).__name__}: {e}"}]

def youtube(key):
    out = []; after = (datetime.now(timezone.utc) - timedelta(days=21)).strftime("%Y-%m-%dT00:00:00Z")
    for q in ["hindi ai explained shorts", "chatgpt kaise kaam karta hai", "ai agent kya hai hindi", "ai tools hindi"]:
        try:
            s = json.loads(fetch("https://www.googleapis.com/youtube/v3/search?" + urllib.parse.urlencode({"part": "snippet", "q": q, "type": "video", "videoDuration": "short", "order": "viewCount", "publishedAfter": after, "regionCode": "IN", "relevanceLanguage": "hi", "maxResults": 8, "key": key})))
            ids = ",".join(i["id"]["videoId"] for i in s.get("items", []))
            v = json.loads(fetch("https://www.googleapis.com/youtube/v3/videos?" + urllib.parse.urlencode({"part": "statistics,snippet", "id": ids, "key": key})))
            for i in v.get("items", []): out.append({"q": q, "title": i["snippet"]["title"], "channel": i["snippet"]["channelTitle"], "views": int(i["statistics"].get("viewCount", 0)), "likes": int(i["statistics"].get("likeCount", 0)), "published": i["snippet"]["publishedAt"][:10]})
        except Exception as e: out.append({"q": q, "err": f"{type(e).__name__}: {e}"})
    return sorted(out, key=lambda x: -x.get("views", 0))[:25]

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default="state/market_signals.json"); a = ap.parse_args()
    res = {"generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ"), "google_autocomplete": {}, "youtube_autocomplete": {}}
    for q in SEEDS:
        res["google_autocomplete"][q] = autocomplete(q); res["youtube_autocomplete"][q] = autocomplete(q, yt=True); time.sleep(0.3)
    res["google_trends_india"] = trends(); res["hacker_news_ai"] = hn()
    k = os.environ.get("YT_API_KEY"); res["youtube_top_hindi_ai_shorts"] = youtube(k) if k else "set YT_API_KEY (free Google Cloud key, YouTube Data API v3) to enable"
    p = Path(a.out) if (Path := __import__("pathlib").Path) else None
    p.parent.mkdir(parents=True, exist_ok=True); p.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
    print("wrote", p, "| trends", len(res["google_trends_india"]), "| hn", len(res["hacker_news_ai"]))
