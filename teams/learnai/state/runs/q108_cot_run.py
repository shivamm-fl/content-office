"""q108: a 3-step word problem and its two answers (written by us, no model was called). Counts are words split on spaces."""
direct = "41"
steps = ["3 notebooks x 45 rupees = 135", "2 pens x 12 rupees = 24", "total 135 + 24 = 159", "change 200 - 159 = 41", "Answer: 41"]
a = 3 * 45; b = 2 * 12; t = a + b; c = 200 - t
print("steps check:", a, b, t, c)
w_direct = len(direct.split()); w_steps = sum(len(s.split()) for s in steps)
print("direct answer words:", w_direct, "| step-by-step answer words:", w_steps, "| ratio: %.1fx" % (w_steps / w_direct))
easy_d = "Paris"; easy_s = ["The question asks for the capital of France.", "The capital of France is Paris.", "Answer: Paris"]
w_ed = len(easy_d.split()); w_es = sum(len(s.split()) for s in easy_s)
print("easy question (capital of France): direct", w_ed, "word | step-by-step", w_es, "words | ratio: %.1fx" % (w_es / w_ed))
print("if every answer is billed per output word-piece, 1,000 easy requests: +%d extra words of output" % (1000 * (w_es - w_ed)))
