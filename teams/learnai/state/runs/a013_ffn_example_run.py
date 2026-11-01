# EXAMPLE (ours): a tiny feed-forward block on ONE number, same shape as the paper's (expand -> max(0,x) -> shrink).
# Straight-line (linear) maps keep sign: f(-3) = -f(3). A feed-forward with the max(0,x) rule does not have to.
relu = lambda v: max(0.0, v)
def ffn(x):                       # 1 number in, 2 inside, 1 out
    h1, h2 = relu(1 * x), relu(-1 * x)   # expand: two small checks
    return h1 + h2                # shrink: add them back
def linear(x, w=1.0): return w * x
for x in [-3, -1, 0, 2, 3]:
    print(f"x={x:>2}  feed-forward -> {ffn(x):.0f}   straight line (w=1) -> {linear(x):.0f}")
# without the max(0,x) rule: h1 + h2 = x + (-x) = 0 for every x (two layers collapse to one line)
print("without the rule:", [(1 * x) + (-1 * x) for x in [-3, 0, 3]])
