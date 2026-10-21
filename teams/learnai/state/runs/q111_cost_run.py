# q111: API (pay per request) vs self-hosted server (fixed monthly bill). INVENTED prices.
API_PER_REQUEST = 0.5      # Rs per request
SERVER_PER_MONTH = 60000   # Rs per month, fixed
for n in (20000, 120000, 500000):
    api = n * API_PER_REQUEST
    print(f"{n:>7} requests: API Rs {api:>9,.0f} | server Rs {SERVER_PER_MONTH:>7,}")
print("break-even requests:", int(SERVER_PER_MONTH / API_PER_REQUEST))
print("20000 requests: server / API =", SERVER_PER_MONTH / (20000 * API_PER_REQUEST))
