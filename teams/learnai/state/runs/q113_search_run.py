"""q113: brute-force nearest-neighbour search with numpy, no database. EXAMPLE: random vectors (not real text),
384 dimensions (a common small embedding size). Timing is from this machine and will differ elsewhere."""
import time, numpy as np
rng = np.random.default_rng(0)
for n in (5_000, 100_000, 1_000_000):
    X = rng.standard_normal((n, 384), dtype=np.float32)
    X /= np.linalg.norm(X, axis=1, keepdims=True)
    q = X[123] if n > 123 else X[0]
    t = time.perf_counter()
    for _ in range(5): top = np.argsort(-(X @ q))[:3]
    ms = (time.perf_counter() - t) / 5 * 1000
    print(f"{n:>9,} vectors: {X.nbytes/1e6:8.0f} MB in memory, exact top-3 search {ms:7.1f} ms, found id {top[0]} (asked 123)")
    del X
