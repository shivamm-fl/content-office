# EXAMPLE sizes: weights only, no activations/KV cache. Bytes per parameter: 2 (16-bit), 0.5 (4-bit).
for name, p in [("7B", 7e9), ("70B", 70e9)]:
    for label, b in [("16-bit", 2), ("4-bit", 0.5)]:
        print(f"{name} {label}: {p*b/1e9:.1f} GB")
print("7B =", f"{int(7e9):,}", "numbers")
print("a011 toy network had 9 numbers; 7B is", f"{7e9/9:,.0f}", "times more")
