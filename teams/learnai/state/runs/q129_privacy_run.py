# EXAMPLE only: invented support ticket; mask obvious personal data BEFORE it goes into a hosted model's prompt.
import re
ticket = "Hi, I am Riya Sharma, phone 9876543210, email riya.s@example.com. Order 55012 never arrived, refund please."
masked = re.sub(r"\b\d{10}\b", "[PHONE]", ticket)
masked = re.sub(r"[\w.]+@[\w.]*\w", "[EMAIL]", masked)
print("before:", ticket)
print("after: ", masked)
print("fields masked by pattern: 2 of 3 (the name 'Riya Sharma' is still there -> patterns alone are not enough)")
