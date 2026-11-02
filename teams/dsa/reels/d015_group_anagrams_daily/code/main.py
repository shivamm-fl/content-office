from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        counts = [0] * 26
        for ch in word:
            index = ord(ch) - ord("a")
            counts[index] += 1
        key = tuple(counts)
        groups[key].append(word)
    return list(groups.values())
