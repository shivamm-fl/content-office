# EXAMPLE (invented ticket): a regex mask for phone and email; the name has no fixed pattern and stays.
import re
ticket = "Riya Sharma, phone 98765 43210, email riya.s@example.com: order nahi aaya, refund chahiye."
masked = re.sub(r"\b\d{5} ?\d{5}\b", "[PHONE]", ticket)
masked = re.sub(r"[\w.+-]+@[\w-]+\.[\w.]+", "[EMAIL]", masked)
print(masked)
fields = {"name": "Riya Sharma", "phone": "98765 43210", "email": "riya.s@example.com"}
left = [k for k, v in fields.items() if v in masked]
print(f"masked {3-len(left)} of 3 personal fields; still visible: {left}")
