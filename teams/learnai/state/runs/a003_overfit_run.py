"""a003: overfitting. True rule y = 2x + 1 with noise (sd 1.0), x in 0..10. Fit polynomials of degree 1, 3, 5 and 9 by least squares.
Train = 10 points; new data = 1,000 fresh points from the same rule, inside the x range of the 10 training points (no extrapolation). Error = RMSE (average miss in the units of y).
Then the same degree-9 model with 100 training points. Median over 200 seeds, plus the seed closest to the median."""
import numpy as np
def data(rng, n, lo=0, hi=10):
    x = np.sort(rng.uniform(lo, hi, n)); return x, 2 * x + 1 + rng.normal(0, 1.0, n)
def fit(x, y, deg):
    return np.polynomial.Polynomial.fit(x, y, deg)   # scaled basis, stable
def rmse(p, x, y): return float(np.sqrt(np.mean((p(x) - y) ** 2)))
def run(seed):
    rng = np.random.default_rng(seed); xt, yt = data(rng, 10); xb, yb = data(rng, 100); xn, yn = data(rng, 1000, xt.min(), xt.max())
    out = {d: (rmse(fit(xt, yt, d), xt, yt), rmse(fit(xt, yt, d), xn, yn)) for d in (1, 3, 5, 9)}
    out["9_with_100"] = (rmse(fit(xb, yb, 9), xb, yb), rmse(fit(xb, yb, 9), xn, yn)); return out
res = {s: run(s) for s in range(200)}
keys = [1, 3, 5, 9, "9_with_100"]
M = {k: np.median([[res[s][k][0], res[s][k][1]] for s in res], axis=0) for k in keys}
for k in keys: print("median of 200 seeds, degree", k, ": train RMSE %.2f, new-data RMSE %.2f" % tuple(M[k]))
vec = lambda r: np.array([v for k in keys for v in r[k]]); med = np.array([v for k in keys for v in M[k]])
best = sorted(res, key=lambda s: np.abs(vec(res[s]) - med).sum())[:3]
for s in best:
    print("seed", s, " ".join("%s: %.2f / %.2f" % (k, *res[s][k]) for k in keys))
print("note: degree 9 with 10 points passes through every point, train RMSE is about 0")
