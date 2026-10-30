# a012: weights-only size = parameters x bytes per parameter (our arithmetic, labelled as example)
for name, n in (("7B", 7e9), ("70B", 70e9)):
    for label, b in (("2 bytes", 2), ("1 byte", 1), ("4-bit (0.5 byte)", 0.5)):
        print(f"{name} at {label}: {n*b/1e9:.1f} GB")
