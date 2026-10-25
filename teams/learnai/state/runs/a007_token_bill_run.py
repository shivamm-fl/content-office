"""a007: why tokens decide the bill and the limit. Real run with OpenAI's tiktoken, encoding cl100k_base.
Run: pip install tiktoken; python state/runs/a007_token_bill_run.py
The prices and the limit below are INVENTED for teaching (round numbers), only the token counts are measured."""
import tiktoken
e = tiktoken.get_encoding("cl100k_base")
msgs = {
    "English": "Please send me the refund status of my order.",
    "Hinglish (Roman)": "Kripya mere order ka refund status bhejiye.",
    "Hindi (Devanagari)": "कृपया मेरे ऑर्डर के रिफंड का स्टेटस भेजिए।",
}
counts = {}
for name, s in msgs.items():
    ids = e.encode(s)
    counts[name] = len(ids)
    print(f"{name}: {len(s.split())} words, {len(s)} characters, {len(ids)} tokens | {s}")
PRICE_PER_1000 = 1.0   # INVENTED: Rs 1 per 1,000 tokens
REQUESTS = 10_000      # INVENTED: 10,000 such messages a day
for name, n in counts.items():
    print(f"{name}: {n} tokens x {REQUESTS} requests = {n*REQUESTS} tokens = Rs {n*REQUESTS/1000*PRICE_PER_1000:.0f}")
LIMIT = 8000           # INVENTED context limit in tokens
for name, n in counts.items():
    print(f"{name}: {LIMIT//n} such messages fit in a {LIMIT}-token window (prompt and reply share it)")
