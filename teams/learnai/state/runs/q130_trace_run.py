# Invented trace of one chatbot request (EXAMPLE numbers for q130).
spans = [("embed", 0.3), ("vector search", 0.5), ("rerank", 6.2), ("LLM call 1", 2.4),
         ("order API timeout", 5.0), ("order API retry", 0.8), ("LLM answer", 4.8)]
total = round(sum(d for _, d in spans), 1)
print("total", total)
for n, d in sorted(spans, key=lambda s: -s[1]):
    print(f"{n:20s} {d:4.1f} s {100*d/total:5.1f} %")
llm = 2.4 + 4.8
print("LLM calls", llm, "s", round(100*llm/total), "%; rest", round(total-llm, 1), "s")
tool = 5.0 + 0.8
print("tool incl. retry", tool, "s", round(100*tool/total), "%")
print("parallel searches 3 s and 2 s -> total", max(3, 2), "s (not", 3+2, ")")
