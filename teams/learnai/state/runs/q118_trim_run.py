"""q118: truncate vs summarise a long chat. Words stand in for tokens. The chat is INVENTED for teaching."""
chat = [
 ("U", "Hi, order 4471 please, and I have a peanut allergy."),
 ("B", "Sure, noted. How will you pay?"),
 ("U", "UPI, I will pay now."),
 ("B", "Great, which snack box do you want?"),
 ("U", "The small box, delivered on Friday please."),
 ("B", "Small box, Friday delivery. Anything else?"),
 ("U", "Add one fruit juice, that is all."),
 ("B", "Done, juice added to your order."),
 ("U", "Thanks. What is in my box now?"),
 ("B", "Small snack box, one fruit juice."),
 ("U", "Okay, the box has nut bars."),
 ("U", "Is it safe for me?"),
]
summary = "Order 4471. User has a peanut allergy. Paid by UPI. Small box, Friday delivery."
BUDGET = 60
wc = lambda s: len(s.split())
total = sum(wc(t) for _, t in chat)
print(f"messages={len(chat)} total_words={total}")
kept = []; used = 0
for who, t in reversed(chat):
    if used + wc(t) > BUDGET: break
    kept.insert(0, (who, t)); used += wc(t)
print(f"TRUNCATE budget {BUDGET}: keeps {len(kept)} messages, {used} words, allergy kept={any('allergy' in t for _, t in kept)}")
last4 = chat[-4:]; l4 = sum(wc(t) for _, t in last4)
print(f"SUMMARISE: summary={wc(summary)} words + last 4 messages={l4} words = {wc(summary)+l4}, allergy kept={'allergy' in summary}")
for i, (w, t) in enumerate(chat, 1): print(i, w, wc(t), t)
