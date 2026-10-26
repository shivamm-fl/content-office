# q119 EXAMPLE (invented): 25 words per turn, 3 stored facts = 5 words total.
W=25; FACTS=5; KEEP=2
for t in (1,5,10,30):
    full=W*t; mem=min(t,KEEP)*W+FACTS
    print(f"turn {t:>2}: resend all = {full:>3} words | memory = {mem} words")
