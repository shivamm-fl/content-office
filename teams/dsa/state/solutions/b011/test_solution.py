import ast, hashlib, itertools, json, random
from pathlib import Path
from solution import Solution

here = Path(__file__).resolve().parent
source = (here / 'solution.py').read_text(encoding='utf-8')
assert not any(isinstance(node, (ast.Add, ast.Sub)) for node in ast.walk(ast.parse(source)))
solve = Solution().getSum
cases = 0
def check(a, b):
    global cases
    assert solve(a, b) == a + b, (a, b, solve(a, b))
    x, y, rounds = a, b, 0
    while y:
        x, y = (x ^ y) & 0xFFFFFFFF, ((x & y) << 1) & 0xFFFFFFFF
        rounds += 1
        assert rounds <= 32
    cases += 1

for a, b in itertools.product(range(-64, 65), repeat=2): check(a, b)
rng = random.Random(75371)
for _ in range(8000): check(rng.randint(-1000, 1000), rng.randint(-1000, 1000))
for a, b in itertools.product([-1000, -999, -512, -1, 0, 1, 511, 512, 999, 1000], repeat=2): check(a, b)
check(5, 3); check(-2, 3); check(-2, -3)
out = dict(local_tests_passed=cases, leetcode_accepted=False, studio_started=False,
           code_sha256=hashlib.sha256(source.encode()).hexdigest(),
           example=[5, 3], answer=8, trace=[[5,3],[6,2],[4,4],[0,8],[8,0]],
           oracle='Python integer addition, exhaustive signed pairs, seeded legal inputs, domain boundaries; AST excludes Add/Sub; every carry trace terminates within 32 rounds')
(here/'local-verification.json').write_text(json.dumps(out, indent=2), encoding='utf-8')
print(f'{cases} independent cases passed; no Add/Sub; <=32 rounds. No LeetCode Accepted claim.')
