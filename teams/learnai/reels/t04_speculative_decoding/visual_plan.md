# Visual plan — speculative decoding

Idea: a small drafter proposes tokens and the large model checks a batch during one expensive weight read.

| Scene | Spoken | Picture and changes | Labels | Build |
|---|---|---|---|---|
| A | better, best, 2–3x | Frame zero has “AI ka jawab tez kaise?” and two mid-typing lanes. A large BETTER WAY card shows the small model and its tradeoff; BEST WAY replaces it with chhota + bada and 2–3x. Google AI Overviews lands below. | headline, BETTER WAY, BEST WAY, Google AI Overviews | Custom chat and cards |
| B | token by token | Large answer tokens arrive one at a time; each sends a bright sweep across the expanded WEIGHTS block. “100 tokens = 100 reads” lands when spoken. | WEIGHTS, one token, 100 reads | Custom tokens and sweep |
| C | draft and check | Small block writes five ghost tokens; one large scan turns them green together. | small draft, 5 guesses, big check, 1 read | Custom pipeline |
| D | memory cost | Memory-to-chip pipe feeds one byte against hundreds of operations; read time dwarfs compute; one and five share a cost bar. | 1 byte, 100s ops, weights read, ~same cost | Custom bars |
| E | square root | Question feeds a large draft grid. Correct prefix chips turn green; only the wrong “3” chip gets a red cross, the following draft chip fades, and the big model supplies its own gold “2.65” token below. | square root of 7, draft, 3 ✗, 2.65 | Custom token line |
| F | T5 result | 11B and 60M blocks feed one answer; speed counter reaches about 3x. | T5-XXL · 11B, T5-small · 60M, ~3x | Custom comparison |
| G | all wrong? | Five large bright red crosses remain visible after rejection; Slow and Normal options ask for a comment. | all wrong?, Slow, Normal, COMMENT | Custom quiz |
