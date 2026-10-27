"""EXAMPLE: a stub model and an invented order A17 show the think/act/observe loop. No real API."""
MAX_TURNS = 5
ORDERS = {"A17": "shipped 2 days ago"}
def stub_model(history):
    if not any(m["role"] == "tool" for m in history):
        return {"type": "tool_use", "name": "lookup_order", "input": "A17"}
    return {"type": "final", "text": "Order A17 shipped 2 days ago."}
history = [{"role": "user", "text": "Where is my order A17?"}]
model_calls = tool_runs = 0
for turn in range(1, MAX_TURNS + 1):
    reply = stub_model(history); model_calls += 1
    if reply["type"] == "final":
        print(f"turn {turn}: FINISH -> {reply['text']}"); break
    print(f"turn {turn}: ACT call {reply['name']}('{reply['input']}')")
    result = ORDERS[reply["input"]]; tool_runs += 1
    print(f"turn {turn}: OBSERVE '{result}'")
    history.append({"role": "tool", "text": result})
else:
    print("STOP: turn limit reached")
print(f"model calls: {model_calls}, tool runs by the app: {tool_runs}, max turns: {MAX_TURNS}")
