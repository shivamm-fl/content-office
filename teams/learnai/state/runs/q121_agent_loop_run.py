# Stub "model": decides the next step from what it has seen. Tools run in app code, not in the model.
orders={"A17":"shipped 2 days ago"}
def tool_lookup(i): return orders.get(i,"not found")
def model(history):
    if not any(h[0]=="observe" for h in history): return ("act",("lookup_order","A17"))
    return ("finish","Order A17 "+history[-1][1])
history=[("goal","Where is my order A17?")]
for turn in range(1,6):                       # max-turn limit
    kind,payload=model(history)
    if kind=="finish": print(f"turn {turn}: FINISH -> {payload}"); break
    name,arg=payload; print(f"turn {turn}: THINK+ACT -> call {name}({arg!r})")
    obs=tool_lookup(arg); print(f"turn {turn}: OBSERVE -> {obs!r}"); history.append(("observe",obs))
print("model calls:",turn,"| tool runs by app:",len([h for h in history if h[0]=='observe']))
