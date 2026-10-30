# EXAMPLE (invented): a refund-bot judged on 2 golden sets, before and after a prompt change that breaks Hinglish and 'partial refund' cases.
# Each case is (kind, passes_before, passes_after).
import collections
alike = [("plain refund", True, True)] * 20
varied = ([("plain refund", True, True)] * 8 + [("Hinglish spelling", True, False)] * 4 +
          [("partial refund", True, False)] * 3 + [("angry message", True, True)] * 3 +
          [("empty/odd input", True, True)] * 2)
for name, ds in [("20 alike", alike), ("20 varied", varied)]:
    after = sum(c[2] for c in ds)
    print(f"{name}: before {sum(c[1] for c in ds)}/20, after {after}/20")
    fails = collections.Counter(c[0] for c in ds if not c[2])
    print("  failing kinds:", dict(fails) or "none")
