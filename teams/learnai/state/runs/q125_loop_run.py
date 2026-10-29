# A framework-free agent: the whole loop, tool table and stop rule. The model is a stub (no API call).
def model(history):
    if not any(k=="observe" for k,_ in history): return ("act",("get_weather","Pune"))
    return ("finish","Pune: "+history[-1][1])
TOOLS={"get_weather":lambda city:"31 C, clear"}
history=[("goal","Pune ka mausam?")]
for turn in range(1,6):                      # stop rule: max 5 turns
    kind,p=model(history)
    if kind=="finish": print("turn",turn,"FINISH ->",p); break
    name,arg=p; obs=TOOLS[name](arg)
    print("turn",turn,"CALL",name,arg,"->",obs); history.append(("observe",obs))
