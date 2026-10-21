"""q110: why a model guesses. EXAMPLE numbers (invented). A question the model does not know; it has 5 candidate answers with odds.
Part 1: always answering means the top guess is wrong most of the time. Part 2: grading by accuracy only (1 right, 0 wrong, 0 for 'I don't know')
makes guessing the better strategy (idea of Kalai et al. 2025, arXiv 2509.04664)."""
odds = {"A": .30, "B": .25, "C": .20, "D": .15, "E": .10}
top = max(odds, key=odds.get)
print(f"model picks {top} with {odds[top]*100:.0f}% odds -> wrong {100-odds[top]*100:.0f}% of the time, in the same confident tone")
for wrong_penalty in (0, 1):
    guess = odds[top]*1 - (1-odds[top])*wrong_penalty
    print(f"grading: right=+1, wrong=-{wrong_penalty}, 'I don't know'=0 -> expected score guessing {guess:.2f} vs abstaining 0.00 ->", "guess" if guess > 0 else "abstain")
