"""a009: training vs inference on a toy model. Plain Python, no libraries.
Run: python state/runs/a009_train_infer_run.py
5 points that follow y = 2x + 1. Model: prediction = w*x + b. Training = gradient descent, 500 steps, learning rate 0.02.
Step n = the loss after the n-th weight update. Inference = the fixed w and b run on new x. A toy, not an LLM."""
xs = [1, 2, 3, 4, 5]
ys = [2 * x + 1 for x in xs]
w, b, lr = 0.0, 0.0, 0.02
def loss(w, b):
    return sum((w * x + b - y) ** 2 for x, y in zip(xs, ys)) / len(xs)
print(f"start: w={w:.2f} b={b:.2f} loss {loss(w, b):.4f}")
for step in range(1, 501):
    errs = [w * x + b - y for x, y in zip(xs, ys)]
    w -= lr * 2 * sum(e * x for e, x in zip(errs, xs)) / len(xs)
    b -= lr * 2 * sum(errs) / len(xs)
    if step in (1, 2, 5, 10, 50, 100, 200, 500):
        print(f"step {step}: loss {loss(w, b):.4f} w={w:.4f} b={b:.4f}")
print("--- inference: weights locked ---")
before = (w, b)
for x in (10, 100, 50):
    print(f"x={x}: prediction {w * x + b:.1f}")
print("weights changed by inference:", (w, b) != before)
