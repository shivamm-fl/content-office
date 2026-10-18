# Roadmap

`series-150.json` is the plan of 150 Days of System Design: 12 phases, one entry per day with its `format` (concept, component, pattern, trade-off, case-study, recap), `level` (easy, medium, hard) for case studies, `status` (todo, in_progress, done) and `reels` (the ids built for it). Same schema as the DSA floor's file.

Day N is item `s` + N in three digits. The strategist plans the next `todo` days in order (`prompts/plan-series.md`). The file is the owner's plan: agents propose changes, they do not make them.

Titles are checklist names of well-known ideas and designs. Nothing from another channel, book or course is copied; scripts, numbers and examples are written fresh from fetched sources.

## The ladder (first draft, 2026-10-18, for the owner's approval)
| Phase | Days | Theme | Days in it |
|---|---|---|---|
| P1 | 1-12 | How one request travels | 12 |
| P2 | 13-26 | One server to a fleet (load balancing, stateless, rate limiting) | 14 |
| P3 | 27-40 | Caching (incl. consistent hashing, CDN, Redis) | 14 |
| P4 | 41-54 | Databases on one machine (indexes, transactions, storage engines) | 14 |
| P5 | 55-65 | Distributing data (replication, sharding, CAP, consistency, quorum) | 11 |
| P6 | 66-80 | Messaging and async (queues, Kafka, delivery guarantees, outbox) | 15 |
| P7 | 81-91 | Distributed systems core (clocks, election, consensus, locks) | 11 |
| P8 | 92-103 | Microservices and resilience (timeouts, circuit breaker, saga) | 12 |
| P9 | 104-116 | Reliability, security and operations | 13 |
| P10 | 117-128 | Classic designs (URL shortener to wallet and ledger) | 12 |
| P11 | 129-138 | Everyday Indian apps, typical designs | 10 |
| P12 | 139-150 | Interview practice and capstone | 12 |

Every phase ends with a `recap` day (the saveable map of the phase; Day 150 is the series recap). Mix over the 150 days: 42 concept, 13 component, 32 pattern, 23 trade-off, 28 case-study, 12 recap.

## What was changed from the research ladder, and why (teacher check)
- **CDN and consistent hashing moved to Caching.** Both only make sense after "why cache"; sharding (Day 58) reuses consistent hashing.
- **The 20-day data phase is two phases.** Databases on one machine first; replication, sharding and CAP after, so CAP comes after the learner has seen replication and replicas disagreeing. Latency numbers moved into Day 27 (Why cache). Pagination (offset vs cursor) added: it follows from indexes and is asked in API questions.
- **The distributed phase is two phases.** Theory first (clocks, election, split brain, consensus, locks), then microservices and resilience, so two-phase commit comes after consensus and saga after queues. Monolith vs microservices opens that phase because timeouts, circuit breakers and service discovery need services.
- **Percentiles and SLOs sit in operations,** after the learner has seen what gets measured. Idempotency (Day 72) comes before retries (Day 95): a retry only makes sense once duplicates are safe.
- **Classic designs come before the Indian-app designs.** The Indian-app days reuse parts the classics teach: video streaming and adaptive bitrate (live cricket), the wallet and ledger (UPI-style payment), geohash (ride matching, order tracking). Cost: app-named designs start at Day 129. The hooks do not have to wait: a hook may use an everyday app moment from Day 1 while the title stays generic. If the owner wants app days earlier, move Days 122, 123 and 127 in front of them.
- **Trimmed to fit 150:** gossip, capacity planning, time-series, resharding, a separate hot-key day, a separate forward-proxy day, webhooks (folded into push vs pull). Left out on purpose (tools or advanced, can be proposed later): containers and Kubernetes, GraphQL, CRDTs and collaborative editing, service mesh.
- Phase sizes run 10 to 15 days; no phase is more than one and a half times another.

## Case studies and real companies
Case-study titles are generic ("Design a URL shortener") and the design is told as "a typical design". A real company's or a standard's own design is only a day when it is source-gated: the researcher fetches a primary source first (engineering post, official incident report, the standard's own document) and the reel says no more than that page. Two days are gated: **Day 112** (outage post-mortem, incident chosen from a fetched official post-mortem) and **Day 137** (UPI-style payment). Every other day that wants a named company is a proposal to the owner. Naming an app as the everyday moment in a hook is fine; claiming how that app is built is not.

## Formats: why no `interview` or `teardown`
`state/config.json` keeps its formats. "Interview ka Sawaal" is a hook choice (`interviewer_asked`, `.claude/skills/hook-writer`) and a whole phase (P12), not a different shape of day. A `teardown` (how a real app works) would mostly be empty: company internals may only be told as far as the company's own post says (CLAUDE.md rule 11), so an app day is a generic case study plus an app-flavoured hook. Adding a format changes what `validate_queue.py` accepts and the day arcs in `docs-notes/series-style.md`; that is the owner's call. The research's weekly rhythm (concept days, a teardown, an interview question, a recap) is written up there as an owner decision, not a rule.
