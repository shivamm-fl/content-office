# EXAMPLE only: invented trace of one slow request (seconds). Spans = steps with a start and an end.
spans = [("embed query",0.3),("vector search",0.5),("rerank",6.2),("LLM call 1",2.4),("tool: order API (timeout)",5.0),("tool: order API (retry)",0.8),("LLM call 2 (answer)",4.8)]
total = sum(d for _,d in spans)
print("total", round(total,1), "s")
for n,d in spans: print(f"{n:28s} {d:4.1f} s {d/total*100:5.1f}%")
top = max(spans,key=lambda s:s[1]); print("slowest:", top[0], round(top[1]/total*100), "%")
print("waiting on tool incl. retry:", round(5.0+0.8,1), "s =", round(5.8/total*100), "%")
