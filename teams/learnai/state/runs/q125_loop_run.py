# q125 stub run: an agent without a framework. The model is a stub (no API call); the structure is the real one.
# The 10 code lines below (comments and blank lines not counted) are the whole loop, tool table and stop rule.
tools = {"get_weather": lambda c: "31 C, clear"}
def model(m):
    if len(m) < 2: return "get_weather", "Pune"
    return None, m[-1]
m = ["Weather in Pune?"]
for turn in range(1, 6):
    name, arg = model(m)
    print("turn", turn, name or "FINISH", arg)
    if name is None: break
    m.append(tools[name](arg))
