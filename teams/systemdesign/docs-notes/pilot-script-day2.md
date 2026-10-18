# Pilot script, Day 2: Client, server and API: who asks, who answers (draft for the owner, not wired into any queue)

Floor: Learnvora System Design (`systemdesign`) | day type: `concept` | working id: s002 | hook_type: `direct_question`
Built to `docs-notes/teaching-flow.md`. Length: **272 spoken words** (braces resolved, `lint_script.py` counting) = about **101 s at 2.7 w/s** and about **115 s at the 2.36 w/s that lint_script measured** (165 words = 70 s). If the owner's voice runs at the lint rate this is at the top of the 120 s limit, so the cut-first list in section 8 (21 words, about 9 s) is ready.
Roadmap Day 2 (P1 How one request travels). Stand-alone: no "kal", no "part", no tease. The food app, the 10,000 phones and the order number are EXAMPLE; the design told is "a typical design", not any company's.

## 1. Hook (first line at most 10 words, up to 16 for interviewer_asked; spoken from frame 0)
- Chosen: `Food app को आपका order status कैसे पता चलता है?` (direct_question).
- Alternate 2: `App में रखा database password, किसी भी phone से निकल सकता है।` (relatable_stake; the claim is OWASP's).
- Alternate 3: `Interviewer ने पूछा: client, server और API में असली फ़र्क क्या है?` (interviewer_asked; 11-word question, lint may warn on "और" (false positive)).

## 2. The script the owner reads (Roman Hinglish, one line per beat group)
1. "Food app ko aapka order status kaise pata chalta hai? Seedha jawab: app poochta hai, aur server jawab deta hai. Teen cheezein samajhni hain: client, server aur API."
2. "Pehle galat tareeka. Maan lo 10,000 phones mein app hai, aur har app seedha database se baat karta hai. To password 10,000 jagah rakhna padega. OWASP ke mutabik, app mein rakha password aasani se mil jaata hai. Ek phone se nikla, to poora database khula."
3. "Pehla step: Client. Wo jo poochta hai: tumhare phone ka app ya browser. HTTP mein pahal hamesha client karta hai, server kabhi pehle nahi bolta."
4. "Doosra step: Server. Wo machine jo data ke paas baithi hai, aur jawab deti hai. Password sirf uske paas rehta hai: 10,000 jagah nahi, sirf 1."
5. "Teesra step: API. Ye client aur server ke beech ka tay kiya hua contract hai: kaun si request bhej sakte ho, aur jawab kis shakl mein aayega."
6. "Maine Python mein chalaya. Request: GET, yaani lao, aur path orders slash 1042. Response: status 200, yaani sab theek, aur body mein order ka data: on the way. Ab 9999 manga: jawab 404, yaani wo cheez mili nahi."
7. "Par ek baat: client aur server naam nahi, role hain. Wahi web server, database se baat karte samay, khud client ban jaata hai. Isiliye app ko sirf API pata hoti hai, database ka rasta nahi."
8. "Yaad rakho: client poochta hai, server jawab deta hai, aur API batati hai ki kaise poochna hai. Aise hi roz ek idea ke liye follow karo. Ab tum batao: jab server database se order nikalta hai, to us pal database ke saamne client kaun hai? Comment mein likho." 

## 3. Narration source (Hindi in Devanagari, English in Roman; `|` clause, `||` thought, spoken numbers in braces)
```
A: @hook Food app को आपका order status कैसे पता चलता है? || सीधा जवाब: | app पूछता है, और server जवाब देता है। || तीन चीज़ें समझनी हैं: | client, server और API।
B: पहले गलत तरीका। || मान लो 10,000{ten-thousand} phones में app है, | और हर app सीधे database से बात करता है। || तो password 10,000{ten-thousand} जगह रखना पड़ेगा। || OWASP{ओवास्प} के मुताबिक, app में रखा password आसानी से मिल जाता है। || एक phone से निकला, तो पूरा database खुला।
C: पहला step: Client। | वो जो पूछता है: तुम्हारे phone का app या browser। || HTTP में पहल हमेशा client करता है, | server कभी पहले नहीं बोलता।
D: दूसरा step: Server। | वो machine जो data के पास बैठी है, और जवाब देती है। || Password सिर्फ़ उसके पास रहता है: | 10,000{ten-thousand} जगह नहीं, सिर्फ़ 1{one}।
E: तीसरा step: API। | ये client और server के बीच का तय किया हुआ contract है: | कौन सी request भेज सकते हो, और जवाब किस शक्ल में आएगा।
F: मैंने Python में चलाया। || Request: GET, यानी लाओ, और path orders slash 1042{ten-forty-two}। || Response: status 200{two-hundred}, यानी सब ठीक, | और body में order का data: on the way। || अब 9999{ninety-nine-ninety-nine} माँगा: | जवाब 404{four-oh-four}, यानी वो चीज़ मिली नहीं।
G: @emph पर एक बात: | client और server नाम नहीं, role हैं। || वही web server, database से बात करते समय, खुद client बन जाता है। || इसीलिए app को सिर्फ़ API पता होती है, database का रास्ता नहीं।
H: याद रखो: | client पूछता है, server जवाब देता है, | और API बताती है कि कैसे पूछना है। || ऐसे ही रोज़ एक idea के लिए follow करो। || अब तुम बताओ: | जब server database से order निकालता है, | तो उस पल database के सामने client कौन है? | Comment में लिखो।
```

## 4. Beat table (seconds at 2.7 w/s from the word count of each beat)
| # | seconds | says | the picture that moves | on-screen label (1 to 3 words) |
|---|---|---|---|---|
| 1 |    0 to   10 (28 w) | Hook: how does a food app know the order status? Answer: the app asks, the server answers. 3 terms promised | A phone shows Order 1042: On the way; a dotted arrow to a box marked ? which splits into three chips: client, server, API | ORDER STATUS? / 3 TERMS |
| 2 |   10 to   20 (25 w) | Wrong way: every app talks to the database, so the password sits in 10,000 phones | 10,000 phone dots, each holding a key icon, all wired to one database; counter 10,000 KEYS with the EXAMPLE pill | WRONG WAY / 10,000 KEYS / EXAMPLE |
| 3 |   20 to   27 (20 w) | OWASP: a password kept inside an app is easy to find; one leaked phone opens the whole database | One phone turns red, its key slides out, the database lock opens (red); a small source tag | KEY LEAKS / SOURCE: OWASP |
| 4 |   27 to   36 (25 w) | Step 1, client: whoever asks (an app or a browser); in HTTP the client always starts | Phone and browser chips merge into a CLIENT box; an arrow labelled request leaves it first | STEP 1/3 / CLIENT / ASKS FIRST |
| 5 |   36 to   46 (26 w) | Step 2, server: the machine next to the data that answers; the password lives only there | A SERVER box beside the database; the counter animates from 10,000 keys to 1 | STEP 2/3 / SERVER / 1 KEY |
| 6 |   46 to   56 (27 w) | Step 3, API: the agreed contract, which requests are allowed and what shape the reply has | A menu card between client and server listing GET /orders/1042 and the reply shape | STEP 3/3 / API CONTRACT |
| 7 |   56 to   66 (28 w) | The run: request GET /orders/1042, response status 200 with the order data | The 7-line client code, the request line lit, then the real printed line (200, {'id': 1042, 'status': 'on the way'}) | REAL RUN / 200 = OK |
| 8 |   66 to   70 (10 w) | Ask for order 9999: status 404, the thing was not found | Same code, the path line changes to 9999; the printed line (404, {'error': 'order not found'}) | 404 NOT FOUND |
| 9 |   70 to   79 (23 w) | Catch: client and server are roles; the web server is the database's client | The SERVER box flips its tag to CLIENT while it points at the database | ROLES NOT NAMES |
| 10 |   79 to   83 (12 w) | So the app knows only the API, not the database route | The phone sees one door (API); the database is greyed out behind the server | ONLY THE API |
| 11 |   83 to   93 (26 w) | One-line recap, then the follow line | Three chips in a row with a one-line caption each | REMEMBER |
| 12 |   93 to  101 (22 w) | Check yourself: when the server reads the database, who is the client? | Question card: SERVER to DATABASE with a ? over the client end, 2 s hold; the answer is not shown | CHECK YOURSELF |
Total 101 s at 2.7 w/s. The `STEP n/3` kicker appears only when step 1 starts, never in the first 10 s. Look: clean-reel (flat navy and gold, one new object per beat, the running example stays on screen). Labels are English or Roman Hinglish, never the spoken sentence.

## 5. Caption (ig-caption linter: READY)
```
Day 2/150: Food app ko aapka order status kaise pata chalta hai?

Client wo hai jo poochta hai, server wo hai jo jawab deta hai, aur API wo contract hai jo batata hai kaise poochna hai. Yahi client server model hai.

Ek food app ka example, teen cheezein:
Client: aapke phone ka app ya browser
Server: wo machine jo data ke paas baithi hai
API: kaun si request bhej sakte ho, aur jawab kis shakal mein aayega
Maine ek chhota server Python mein chalaya: order 1042 par 200, order 9999 par 404.

Check yourself: jab server database se order nikalta hai, to us pal database ke saamne client kaun hai? Comment mein jawab likho.

Jawab: server khud client ban jaata hai, client aur server role hain, naam nahi.

#SystemDesign #API #ClientServer
```
The part under the "... more" cut carries the answer, so the check-yourself question can be marked by the viewer.

## 6. Sources (all fetched with WebFetch on 2026-10-18)
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview (HTTP is client-server; the client always initiates; a request has a method and a path; a response has a status code and a body)
- https://developer.mozilla.org/en-US/docs/Glossary/API (an API as a contract, the interface, between the software offering it and other items)
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status (200 means the request succeeded; 404 means the server cannot find the requested resource)
- https://owasp.github.io/www-project-mobile-top-10/2023-risks/m1-improper-credential-usage.html (hardcoded credentials in an app are easy for attackers to find; avoid them; the owasp.org address redirects here)
- https://en.wikipedia.org/wiki/Client%E2%80%93server_model (the client sends a request and the server returns a response; a machine may be client, server or both; a web server accesses the database server as a client)
- The 10,000 phones, the food app and order 1042 are EXAMPLE; the "password in every app" design is labelled as the wrong way, not as any real product.

## 7. What was run (real output is what the script says)
A tiny server (Python standard library `http.server`) and the client below were run in one process on localhost, so the output is real. The client is what the screen shows (7 lines):
```python
import urllib.request, urllib.error, json
def ask(path):
    try: r = urllib.request.urlopen("http://localhost:8765" + path)
    except urllib.error.HTTPError as e: r = e
    return r.status, json.load(r)
print(ask("/orders/1042"))
print(ask("/orders/9999"))
```
Output:
```
(200, {'id': 1042, 'status': 'on the way'})
(404, {'error': 'order not found'})
```

## 8. Checks
- `python -I scripts/lint_script.py` of this floor, on the narration above as a spec (hook_type set): **VERDICT OK**, 14 checks ok, 0 FAIL. WARN: none. The lint's own length check (about 2.3 w/s) puts it at about 118 s, inside its 55 to 120 s window (it was 60 to 100 s until the owner allowed 90 to 120 s teaching days).
- Shape against teaching-flow: the mechanism steps are 43 percent of the words (aim about 40), the catch starts at 69 percent (aim 70 to 80; the frames show 70 to 77), 3 numbered steps with the `STEP n/3` kicker starting at step 1, a new object about every 4 s in the beat table (nothing still for more than 8 s).
- Detail checklist (teaching-flow section c): terms defined: client, server, API (3), plus request, response and status code decoded in the same breath. Running example: order 1042 and 10,000 phones, run on localhost. Naive way first: beats 2 and 3, with the number 10,000. WHY per step: step 2 gives the password count, step 3 the contract; step 1 gives the HTTP rule. Catch: roles, not names (beat 9), from the Client-server model page. Consequence: the app knows only the API. Recap and one check question (answer in the caption). Stand-alone.
- Cut first if the take runs past 115 s: the follow line (9 words, end card instead) and "isiliye app ko sirf API pata hoti hai" (12 words).
- Unsure: (1) More than three terms are touched (request, response, status code are decoded in passing); I judged that fine for a first day, the owner may want two days (the split rule in teaching-flow section f does not trigger: 3 new terms, 3 steps, code of 7 lines). (2) "HTTP mein pahal hamesha client karta hai" follows MDN's wording for the browser as the entity that always initiates; push styles (WebSocket and so on) are another day. (3) The wrong-way story (one leaked key opens the whole database) is OWASP's general risk applied to an invented design, so it is marked EXAMPLE and "wrong way" on screen.
