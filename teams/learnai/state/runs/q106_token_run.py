"""q106: how many tokens a small classification prompt costs with 0, 1, 3 and 5 examples (tiktoken, encoding o200k_base)."""
import json
import tiktoken

enc = tiktoken.get_encoding("o200k_base")
SYSTEM = "Classify the review as positive or negative."
EX = [("Loved it, works perfectly.", "positive"), ("Stopped working after two days.", "negative"), ("Fast delivery, good packaging.", "positive"),
      ("The battery dies in an hour.", "negative"), ("Great value for the price.", "positive")]
TEST = "The delivery was late and the box was damaged."


def prompt(k, examples=EX):
    return SYSTEM + "\n\n" + "".join(f"Review: {r}\nLabel: {l}\n\n" for r, l in examples[:k]) + f"Review: {TEST}\nLabel:"


rows = {}
for k in (0, 1, 3, 5):
    rows[k] = len(enc.encode(prompt(k)))
    print(f"{k} examples: {rows[k]} tokens")
extra = rows[5] - rows[0]
print("extra tokens of 5 examples on every request:", extra)
print("per example (average):", round(extra / 5, 1))
print("extra tokens over 1,000 requests:", extra * 1000)
print("extra tokens over 1,000,000 requests:", extra * 1_000_000, "=", extra * 1_000_000 / 1e6, "million")
print("ratio 5 examples vs none: %.1fx" % (rows[5] / rows[0]))
print("--- the prompt with 3 examples, exactly as the reel shows it ---")
print(prompt(3))
json.dump({"encoding": "o200k_base", "tokens": rows, "extra_for_5": extra}, open("q106_token_run.json", "w"))
