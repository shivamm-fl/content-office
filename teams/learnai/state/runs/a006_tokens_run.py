"""a006: how text becomes numbers. Real run with OpenAI's tiktoken, encoding cl100k_base (needs: pip install tiktoken; downloads its vocabulary)."""
import tiktoken
e = tiktoken.get_encoding("cl100k_base")
print("vocabulary size (n_vocab):", e.n_vocab)
for s in ["Hello world", "namaste dost", "unbelievable", "strawberry"]:
    ids = e.encode(s)
    print(f"{s!r}: {len(ids)} tokens, ids {ids}, pieces {[e.decode([i]) for i in ids]}, back: {e.decode(ids)!r}")
