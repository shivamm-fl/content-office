"""q110: why guessing wins. Invented odds: the model's top guess A is right 30 % of the time.
No model is called. Expected score of guessing vs leaving blank under two grading rules."""
P_RIGHT = 0.30
for name, wrong in [("right +1, wrong 0, blank 0", 0), ("right +1, wrong -1, blank 0", -1)]:
    guess = P_RIGHT * 1 + (1 - P_RIGHT) * wrong
    blank = 0
    print(f"{name}: guess = {guess:.2f}, blank = {blank} -> {'guess' if guess > blank else 'abstain'}")
