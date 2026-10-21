"""q113: exact (brute-force) vector search in memory. EXAMPLE: random vectors, 384 dims, float32. Times are from the run machine."""
import time, numpy as np
rng = np.random.default_rng(0)
D = 384
q = rng.standard_normal(D).astype(np.float32); q /= np.linalg.norm(q)
for n in (5000, 100000, 1000000):
    X = rng.standard_normal((n, D)).astype(np.float32)
    X /= np.linalg.norm(X, axis=1, keepdims=True)
    mb = X.nbytes / 1e6
    best = 1e9
    for _ in range(5):
        t = time.perf_counter(); s = X @ q; top = np.argpartition(-s, 3)[:3]; top = top[np.argsort(-s[top])]
        best = min(best, time.perf_counter() - t)
    print(f"{n:>9,} vectors: {mb:7.0f} MB, exact top-3 search {best*1000:6.1f} ms, top ids {top.tolist()}")
    del X
