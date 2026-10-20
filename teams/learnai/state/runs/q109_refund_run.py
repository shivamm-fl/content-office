"""q109: the model is a stub that always says yes; the backend checks the refund limit. No model is called."""
LIMIT = 500
def model(request):
    return "Approved!"
def backend(amount, reply):
    return reply == "Approved!" and amount <= LIMIT
amount = 2000
reply = model(amount)
print("Refund request:", amount)
print("Model response:", reply)
print("Allowed limit:", LIMIT)
print("Approved:", backend(amount, reply))
