# Visual plan: q156 Switching Provider (OpenAI-compatible API)

Idea in one line: compatible means the same SDK with a new key, address and model name, but some settings are silently dropped, so you test your own prompts.
The picture that explains it with the sound off: the real code with three highlighted lines and a green "it ran" tick, then a request whose fields grey out as ignored while one turns red 400, then a test table old vs new.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | Base URL changed, code ran, settings ignored. Interviewer asks. SDK = library. | Frame 0: Python code card, the base_url line turns gold, green IT RAN tick lands, a seed row greys out with IGNORED. Then app box, arrow, "other provider?" box. Then chain YOUR CODE, SDK (ringed), MODEL. | IT RAN, IGNORED, INTERVIEWER, SDK | custom HTML cards, FX show/hide |
| B | Answer: change key, URL, model, test prompts. Compatible is not same. 3 steps. | Four cards land on their words (KEY, URL, MODEL, TEST), dim, then COMPATIBLE with a red not-equal sign and SAME, then three numbered circles. | KEY, URL, MODEL, TEST | custom |
| C | Strict example: switched, code ran, strict silently ignored, format can break. | Tool schema card with strict: true (EXAMPLE pill), arrow BASE URL, response card with 200 OK and a good JSON line; strict gets struck out and the JSON line flips to a wrong value in red; NO WARNING chip. | STRICT, 200 OK, NO WARNING | custom |
| D | Step 1: change all three. | Three big cards KEY, URL, MODEL with sample values and a one-word meaning (SECRET, ADDRESS, WHICH MODEL); SAME SDK chip at the bottom. | STEP 1, KEY, URL, MODEL | custom |
| E | Step 2: 14 simple fields ignored, some requests get 400. | Request card: rows grey out with IGNORED tags and a 14 counter; the seed row is ringed; input_audio row turns red with a 400 stamp; two chips IGNORED = SILENT, 400 = LOUD. | 14, IGNORED, 400 | custom |
| F | Step 3: run 20 own prompts on both providers. | Test table OLD vs NEW with a 20 counter; rows fill with ticks; two rows differ and are ringed red (EXAMPLE pill). | 20 PROMPTS, OLD, NEW | custom |
| G | Boundary: layer is for testing, not production; native API for full features. | Card COMPAT LAYER with TEST and COMPARE ticks and PRODUCTION struck out; card NATIVE API (gold) with CACHING, CITATIONS, THINKING chips; Source label. | TEST, COMPARE, NATIVE API | custom |
| H | Say: compatible is not same. Comment which provider. | Big COMPATIBLE not-equal SAME, three checklist rows; then comment card with OPENAI, ANTHROPIC, GEMINI pills and a FOLLOW pill. | COMPATIBLE ≠ SAME, COMMENT | custom |
