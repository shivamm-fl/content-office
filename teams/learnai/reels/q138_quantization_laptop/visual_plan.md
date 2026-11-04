# Visual plan · 4 November 2026

| Scene | Spoken beat | Picture | Labels | Built with |
|---|---|---|---|---|
| A | Hook: 7B model, laptop? | An empty 16 GB laptop memory bar; a gold 7B MODEL block of 14 GB slides in and nearly fills it, a red question mark beside it. | 7B model, WILL IT FIT?, Hugging Face | Custom SVG/DOM and phrase-aligned GSAP |
| B | Answer: fewer bits per weight | One weight as a strip of 16 bit squares that shrinks to 4 squares, a QUANTIZATION stamp lands, then three numbered step pills. | 16 bits, 4 bits, 3 steps | Custom DOM and GSAP |
| C | Problem: 14 GB in 16 GB | The same memory bar: 40 weight squares appear, x 2 bytes, then the gold block grows to 14 GB leaving a thin red strip, stamp WON'T RUN. | 7B weights, 14 GB, system + apps | Custom DOM and GSAP |
| D | Step 1: the memory formula | Three cards MEMORY = PARAMS x BYTES with real values, then a true-scale bar for fp16, int8 and int4 bytes per weight, arrow lower. | Memory, Params, Bytes | Custom DOM and GSAP |
| E | Step 2: int8 | Memory bar with the 14 GB block; 8 bit squares, then two photo cards (full vs lower quality, file bar shorter), then the block halves to 7 GB. | 8 bits = 1 byte, 7 GB | Custom DOM and GSAP |
| F | Step 3: int4 and KV cache | Same bar: 4 bit squares, the block shrinks to 3.5 GB, a cyan KV CACHE block lands beside it, chat icon, free space stays green, stamp RUNS. | 4 bits, KV cache, Runs | Custom DOM and GSAP |
| G | Boundary: test it | Two accuracy bars, fp16 full and int4 slightly shorter with a red question mark; a your-own-task card with a magnifier turns the mark into a green check. | Accuracy, Your own task, Test it first | Custom DOM and GSAP |
| H | Interview answer | Three stacked cards: params x bytes, 14 GB arrow 3.5 GB with laptop tick, test on your task. | Params x bytes, 14 to 3.5 GB, Test | Custom DOM and GSAP |
| I | Comment and follow | A comment card with answer pills 8 GB, 16 GB, 32 GB and a follow pill that presses on the word follow. | Comment karo, Follow | Custom DOM and GSAP |
