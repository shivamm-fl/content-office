# Count fields from the Anthropic OpenAI-SDK compatibility page (fetched 2026-11-12).
ignored = ["logprobs","metadata","prediction","presence_penalty","frequency_penalty","seed","service_tier","audio","logit_bias","store","user","modalities","top_logprobs","reasoning_effort"]
errors_400 = ["n != 1","response_format json_object or text","input_audio content part","file content part"]
print("simple request fields silently ignored:", len(ignored))
print("things that change when switching (key, base URL, model name):", 3)
print("requests that return a 400 error (from the page):", len(errors_400))
print("ignored, e.g.:", ", ".join(ignored[:5]))
