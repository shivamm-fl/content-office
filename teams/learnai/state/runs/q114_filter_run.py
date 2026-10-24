"""q114: pgvector README says filtering is applied after the approximate index scan; 10 % matching rows with the default ef_search 40 leaves about 4 rows.
Arithmetic check plus a toy simulation (EXAMPLE: 100,000 random ids, 10 % tagged 2024, the index returns 40 nearest candidates, then the filter runs)."""
import random
random.seed(0)
print("expected rows after filter:", 40 * 0.10)
runs = [sum(random.random() < 0.10 for _ in range(40)) for _ in range(1000)]
print("toy runs, average rows left of 40 candidates over 1000 searches:", sum(runs) / len(runs), "min", min(runs), "max", max(runs))
print("searches that returned 0 rows:", sum(r == 0 for r in runs))
