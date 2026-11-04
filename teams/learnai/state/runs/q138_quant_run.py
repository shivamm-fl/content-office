# EXAMPLE arithmetic: weight memory = parameters x bytes per weight (decimal GB, weights only)
P = 7_000_000_000
for name, b in [("fp32", 4), ("fp16", 2), ("int8", 1), ("int4", 0.5)]:
    print(f"{name}: {P*b/1e9:.1f} GB")
print("laptop 16 GB; fp16 leaves", 16 - P*2/1e9, "GB; int4 leaves", 16 - P*0.5/1e9, "GB")
