# Visual plan: s004 DNS (rules: docs-notes/diagram-first-visuals.md)

Idea in one line: a phone knows only a name; it asks a chain of helpers (cache, resolver, root, TLD, authoritative) that each hand a pointer on, and the number comes back and is kept for a limited time (TTL).
The picture with the sound off: one vertical chain PHONE > RESOLVER > ROOT > TLD > AUTH SERVER, built box by box; pointers come back as small chips; the IP number travels back up to the phone; a shrinking clock bar is the TTL.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | phone does not know the address, needs the IP number, DNS asks many places | phone box showing the name google.com on the left, server box on the right with "?.?.?.?" under it; a DNS box slides in below with three "?" chips for the many places | PHONE, SERVER, IP ADDRESS, DNS | M.box, custom chips |
| B | contact list, first place is own memory (cache), found = done | a contacts panel: name row Mom, tap highlights it, a number appears; then a big phone box with a CACHE panel of two name/IP rows; the matching row turns green with a check and a FOUND stamp | CONTACTS, CACHE, EXAMPLE, FOUND | custom panels |
| C | not found, resolver, root says "ask the .com server" | chain starts: phone on top, resolver below, root below it; a white token runs down; root answers with a ".COM SERVER" pointer chip and a green arrow back up | RESOLVER, ROOT, .COM SERVER | M.box, M.arrow, travel |
| D | .com is the TLD, TLD says which server holds the domain | name strip example.com with .com in gold; chain grows a TLD box; token runs down; TLD returns a pointer chip "DOMAIN'S SERVER" | TLD, .COM | M.box, M.arrow |
| E | authoritative server holds the real record, gives the IP, resolver returns it to the phone | chain gets AUTH SERVER with a record card example.com > 93.184.216.34 (EXAMPLE pill); the IP chip flies up the chain to the phone, which shows it | AUTH SERVER, EXAMPLE | M.box, custom chip tween |
| F | every answer cached for a set time, TTL, then asked again | cache row with a clock icon and a bar that shrinks; at zero the row turns red, then a new row in green after an ask-again arrow | TTL, EXPIRED, ASK AGAIN | custom |
| G | address changed, old copies stay till TTL ends, takes some time | auth record flips OLD to NEW; three caches (browser, computer, resolver) still show OLD, each with its own bar; they flip to NEW one at a time | OLD, NEW, BROWSER, COMPUTER, RESOLVER | custom |
| H | interview order, your question | five-step list lights on its words, clock for TTL; then a question card: NEW at server, OLD in caches, "?" and comment bar | CACHE, RESOLVER, ROOT, TLD, AUTH, TTL | M.box, custom |
