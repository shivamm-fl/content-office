# EXAMPLE (invented stub screening model): 200 resume pairs, identical except the name (group A vs group B).
# The stub shortlists 90 resumes under A names and 74 under B names; 16 pairs flip only because of the name.
pairs = []
for i in range(200):
    a = i < 90                # shortlisted under the group A name
    b = i < 74                # shortlisted under the group B name (same resume)
    pairs.append((a, b))
a_n = sum(a for a, b in pairs); b_n = sum(b for a, b in pairs)
flips = sum(a != b for a, b in pairs)
print(f"pairs: {len(pairs)}")
print(f"group A shortlisted: {a_n} ({a_n/2:.1f} %)")
print(f"group B shortlisted: {b_n} ({b_n/2:.1f} %)")
print(f"gap: {(a_n-b_n)/2:.1f} points")
print(f"pairs flipped by the name alone: {flips}")
first5 = pairs[70:75]  # an eye-check sample of 5 pairs: 4 agree, 1 differs
print("first 5 pairs seen by eye (sample):", sum(a == b for a, b in first5), "agree,", sum(a != b for a, b in first5), "differ")
