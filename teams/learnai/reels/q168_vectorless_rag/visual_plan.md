# Visual plan: q168 Vectorless RAG (PageIndex)

Idea in one line: similarity search over chunks returns look-alikes; PageIndex builds a tree of sections (title, summary, page range) and the LLM walks it to the one section that holds the answer, so no embeddings and no vector database are needed.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels | Built with |
|---|---|---|---|---|
| A | why a vector DB when AI can search itself | A stacked annual report with a 500 PAGES badge on the left, a vector database cylinder on the right; an AI chip points at the report and the cylinder dims | 500 PAGES, VECTOR DB, AI | custom HTML + Viz.icon |
| B | 500-page report, why did the company lose | Big report stack, a count-up 0 to 500 pages, a red question chip lands on it | 500 PAGES, WHY LOSS?, EXAMPLE | custom, M.count |
| C | traditional RAG: chunks, embeddings, similarity | Report splits into a 4x3 grid of chunk tiles, each becomes a dot on a map, a query marker lands and its three nearest dots and tiles turn gold | PDF, CHUNKS, EMBEDDINGS, QUERY | custom |
| D | similar is not relevant; answer elsewhere; chunking loses context | Same grid: three gold look-alike tiles get red crosses, a far tile turns green with ANSWER; then a sentence card is cut in two by a seam and the lower half dims | LOOK-ALIKE, ANSWER, CONTEXT LOST, EXAMPLE | custom |
| E | how a human does it: open the index, go to the section | A contents card with four rows and page ranges, the Financials row turns gold, a page card slides out below with a green ANSWER, then an LLM chip pops in | INDEX, ANSWER, LLM, EXAMPLE | custom |
| F | PageIndex builds a tree with headings, summaries, page numbers | Root node, three section nodes, two sub-nodes drawn with connecting lines; summary bars then page-range chips land on every node | ANNUAL REPORT, PAGE RANGE | custom SVG + HTML |
| G | LLM reasons which section to explore | Same tree; an LLM chip points at the root, other sections dim, a gold path runs root, Financials, Loss and a page card opens with ANSWER | LLM, REASON, ANSWER | custom |
| H | similarity replaced by reasoning; no embeddings, no vector DB; Vectorless RAG | Similarity card is crossed out and a reasoning card lands; embeddings and vector DB cards are crossed out in red; RAG stays with a green tick; final VECTORLESS RAG card | SIMILARITY, REASONING, EMBEDDINGS, VECTOR DB, RAG, VECTORLESS RAG | custom |

Honesty labels: page ranges and the report text carry EXAMPLE pills. Source credit on F and H: Source: github.com/VectifyAI/PageIndex.
