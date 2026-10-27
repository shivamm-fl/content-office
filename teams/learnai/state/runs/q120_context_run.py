# q120: invented sizes (words stand in for tokens). Shared context vs three subagents with notes.
pages = {"pricing": 3000, "reviews": 4000, "rivals": 5000}
note = 200
shared = sum(pages.values())
lead_view = note * len(pages)
total_work = sum(pages.values()) + lead_view
print("shared context, lead sees:", shared)
print("subagents read (own windows):", pages)
print("lead sees:", lead_view)
print("total work:", total_work)
print("longest single job (parallel wait):", max(pages.values()))
