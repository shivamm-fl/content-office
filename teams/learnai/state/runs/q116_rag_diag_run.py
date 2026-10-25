"""q116: RAG answer wrong -> retrieval or generation? Toy, real run (pure Python, word-overlap retrieval).
Step 1 look at the retrieved chunks; step 2 ask: was the gold chunk in them? Counts are computed here.
The documents and questions are INVENTED for teaching."""
import re
chunks = {
 "c1": "Refund is paid within 7 days after the returned item reaches our warehouse.",
 "c2": "Delivery takes 3 to 5 days for metro cities and 7 days elsewhere.",
 "c3": "Gift cards never expire and cannot be exchanged for cash.",
 "c4": "To cancel an order before it ships, open Orders and tap Cancel.",
 "c5": "Premium members get free delivery on every order above Rs 499.",
}
tests = [  # (question, gold chunk, what the generator said: 'ok' or 'wrong')
 ("How many days does a refund take after return?", "c1", "ok"),
 ("Will shipping cost me anything?", "c5", "wrong"),
 ("Can I get cash for my gift card?", "c3", "wrong"),
 ("Is delivery free for me as a premium member?", "c5", "ok"),
 ("How do I stop an order I just placed?", "c4", "ok"),
 ("What is the minimum order for free delivery?", "c5", "wrong"),
]
def words(s): return set(re.findall(r"[a-z0-9]+", s.lower()))
def retrieve(q, k=2):
    sc = {c: len(words(q) & words(t)) for c, t in chunks.items()}
    return sorted(sc, key=lambda c: -sc[c])[:k]
hit = 0; wrong = []
for q, gold, gen in tests:
    top = retrieve(q); h = gold in top; hit += h
    print(f"{q!r}: top2={top} gold={gold} gold_retrieved={h} answer={gen}")
    if gen == "wrong": wrong.append((q, h))
print(f"retrieval hit rate (gold in top 2): {hit}/{len(tests)}")
print(f"wrong answers: {len(wrong)}")
for q, h in wrong:
    print(" ->", "GENERATION problem (right chunk was there)" if h else "RETRIEVAL problem (right chunk never reached the model)", "|", q)
