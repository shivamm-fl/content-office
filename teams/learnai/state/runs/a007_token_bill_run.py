"""a007: same refund message in English, Roman Hinglish and Devanagari Hindi, counted with OpenAI's tiktoken, encoding cl100k_base (pip install tiktoken)."""
import tiktoken
e = tiktoken.get_encoding("cl100k_base")
S = {"English": "Please send me the refund status of my order.",
     "Roman Hinglish": "Kripya mere order ka refund status bhejiye.",
     "Devanagari Hindi": "कृपया मेरे ऑर्डर के रिफंड की स्थिति भेजिए।"}
for k, s in S.items():
    n = len(e.encode(s))
    print(f"{k}: {s!r}: {len(s.split())} words, {n} tokens, Rs {n*10000/1000:.0f} per 10,000 messages at Rs 1 per 1,000 tokens, {8000//n} messages in an 8,000-token window")
