"""q111: API vs self-hosted break-even. EXAMPLE numbers (invented, not real prices):
API: Rs 0.5 per 1,000 requests-equivalent unit; self-host: one rented GPU server Rs 60,000 per month fixed."""
api_per_request = 0.5            # Rs per request
gpu_month = 60000                # Rs per month, fixed
be = gpu_month / api_per_request
print(f"API: Rs {api_per_request} per request; GPU server: Rs {gpu_month} per month fixed")
for r in (20000, 120000, 500000):
    print(f"{r:>7,} requests/month: API Rs {r*api_per_request:>9,.0f} | self-host Rs {gpu_month:>7,}")
print(f"break-even: {be:,.0f} requests per month (and self-host also needs someone to run it)")
