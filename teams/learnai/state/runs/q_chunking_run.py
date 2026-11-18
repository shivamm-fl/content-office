# INVENTED example ("maan lo"): a made-up refund policy, not a real company's.
import re
F = "Store policy. Orders ship from our warehouse in two working days. Shipping charges are paid by the buyer. Customer care answers on weekdays. Gift wrap costs extra. Coupons cannot be combined. Prices include tax. Delivery is to the address on the order. "
P = F + "Refund kitne din mein milega: 7 din, sirf unopened items par. Opened items ka refund nahi milta. Bill zaroori hai. Pickup bhi hota hai. Sale items par bhi yahi niyam hai. Gift card alag hota hai. Warranty claims go to the service centre with the invoice. Bulk orders need a separate quote from sales. Store timings are 10 to 7 on weekdays and 11 to 5 on Sunday. Prices may change without notice."
def split(t, size, ov): return [(i, t[i:i+size]) for i in range(0, len(t), size-ov)]
def score(q, c): w = re.findall(r"\w+", c.lower()); return sum(w.count(x) for x in set(q.split()))
Q = "refund kitne din"
print("policy length:", len(P), "| 'sirf unopened' starts at offset:", P.index("sirf unopened"))
for ov in (0, 50):
    cs = split(P, 300, ov); print(f"\n=== size 300, overlap {ov} ===")
    for n, (o, c) in enumerate(cs): print(f"chunk{n} offset {o}-{o+len(c)} score={score(Q,c)}: ...{c[-70:]!r}" if n == 0 else f"chunk{n} offset {o}-{o+len(c)} score={score(Q,c)}: {c[:90]!r}...")
    best = max(cs, key=lambda x: score(Q, x[1])); print(f"RETRIEVED: chunk at offset {best[0]} | 'unopened' visible in it: {'unopened' in best[1]}")
