# EXAMPLE only: invented week, 1000 requests/day. Errors stay near 1 %; from day 5 answer quality drops
# (a prompt/model change). 100 answers per day are graded by an eval (pass/fail).
import random
random.seed(7)
for day in range(1,8):
    err = sum(random.random()<0.01 for _ in range(1000))
    p = 0.92 if day<5 else 0.74
    passed = sum(random.random()<p for _ in range(100))
    print(f"day {day}: errors {err/10:.1f}%  eval pass {passed}/100 = {passed:.0f}%  error alert(>5%) {'FIRE' if err/10>5 else 'quiet'}  quality alert(<80%) {'FIRE' if passed/100<0.8 else 'quiet'}")
