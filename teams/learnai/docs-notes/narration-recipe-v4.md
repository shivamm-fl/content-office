# Narration recipe v4: how every Learnvora reel is written and voiced

Owner, 2026-11-13: "agey se sab reel aise achhe narration and script se bane, office mai bhi, for all teams". He approved the first two reels made this way (q158 sycophancy, q159 slopsquatting on ai.learnvora: "mast mast"). This note is the same on every floor (ai, dsa, systemdesign). Where an older note, skill or prompt says something else about the narration or the voice (pause marks `|`, tone tags `@hook`, `owner_tempo`, `prime`, one request per phrase, Flash v2.5, pace 1.26), this note wins. Floor rules that are about the content stay (for example the DSA coding-lesson beats, on-screen code and the 60 to 120 s length of a coding lesson).

## 1. The voice (the office sets it; never change it)
- The owner's cloned voice **"Shivam Trainer"** (exact name, category cloned; the lookup stops if there are zero or several). Not the older "Shivam" clone.
- ElevenLabs `eleven_v4`, `voice_settings` stability 0.5 and similarity_boost 0.8, seed 121126, nothing else (no style, no speed).
- The **whole reel in one request**, so the delivery is continuous. Scenes are joined with a paragraph break.
- **Never change the tempo or the pitch to fit a length.** A reel that is too long loses words, never speed.
- `spec.json`: `"tts": "owner_v4"` (new_reel.py writes it; the studio tool `make_voice` sets it and falls back to Swara only when the owner's voice is unavailable or out of characters). A reel voiced before 2026-11-13 with the old phrase recipe keeps that recipe on a revision, so an approved voice is never bought again.
- Cache: `audio/hi/v4_<sha12>.mp3` + `.json` (alignment) + `.marker.json` (sha256 of text, model, voice, settings, seed). The same text never costs twice; a changed word re-voices the whole reel (it is one take), so change the narration only when the owner asks or a fact is wrong.

## 2. Writing the script
Language:
- Hindi in Devanagari, English technical and everyday words in Latin script: "अब इस list को एक picture में देखते हैं।"
- Everyday Hinglish, the way a good teacher actually talks: a calm teacher talking to one learner. Prefer common words to bookish ones ("दिक्कत", not "अड़चन"). Address the viewer as "तुम".

Teaching:
- One reel, one idea, explained through one concrete example (q158: "seventeen prime है?" → "are you sure?" → the model flips).
- Start from a real situation or a question the viewer recognises, leave a beat to think, then answer.
- Intuition first, the name after ("इसे sycophancy कहते हैं, यानी जी-हुज़ूरी"). Never use a technical term the viewer has not been taught: explain it in the same sentence, or describe the idea in plain words.
- One claim per sentence. Explain cause and effect, not a list of facts.
- Label illustrations as illustrations (an "illustration" tag on screen). Never invent numbers, scores, results or app screens. A calculation shown on screen is actually computed. Facts come from a page fetched in this session; the source goes on screen and in the caption, never in the spoken lines ("docs ke mutabik" is out).
- Interview reels end the teaching with the one-line answer to say in the interview ("Interview में बोलो: ...").

Avoid AI-slop phrasing (the owner rejects it):
- journey or foundation metaphors: "यही … का रास्ता है", "पहली ईंट", "एक-एक कदम", "नींव"
- dramatic hooks and clichés: "कहानी में एक मोड़", "सबसे खतरनाक बात", "ये कोई जादू नहीं", "इसका इलाज"
- slogan closers, grand summaries, fake excitement, filler like "follow for more"; a staged "बिल्कुल नहीं!" or a rhetorical question between the hook and the first teaching line (company rule 8)
Say the point plainly.

Structure:
1. First 3 seconds: the real problem or question, in plain words. No clickbait, but concrete: a number, a result or a moment the viewer has lived.
2. Middle: the example and the reasoning, with one short thinking pause (`...`) before the key answer.
3. End: one clear takeaway sentence, or a question with a real answer, then "Comment करो।"

Length: one idea, usually 45 to 80 seconds of voice (about 2.9 spoken words per second: 130 to 230 words). The owner, 2026-11-13: "70-80 sec chalega". A floor's own length rule for a lesson type still holds (series days as long as the teaching needs; DSA coding lessons 60 to 120 s).

## 3. Formatting `copy.hi` for the voice model
- One paragraph per scene (`copy.hi.A`, `copy.hi.B`, ...). A scene is one picture.
- Delivery tags, sparingly, at the start of a paragraph or before an answer: `[warm, conversational]`, `[curious]`, `[thoughtful]`, `[short pause]`. Square brackets are for nothing else.
- `...` for a short thinking beat. Do not add pauses after every sentence. No `|` pause marks and no `@hook` tone tags (the old recipe; they are removed before sending).
- Spell out numbers and maths in words: "fifty one percent", "three, four", "zero point six", "L-two norm". A number takes the language of the word after it (Hindi before a Hindi word: "ग्यारह बड़े chatbots", English before an English word: "forty three percent"; DSA coding lessons read numbers in English, owner 2026-11-01). No digits, no symbols (√ × ÷ · θ |), no markdown, no emojis, no "+" or "#" at the start of a line.
- A `display{spoken}` brace is still allowed for one word the voice says wrongly: the voice gets the spoken form, the caption shows the display form.
- Example (approved style):
```
[warm, conversational] मान लो AI से पूछा: seventeen prime number है? बोला, हाँ। तुमने लिखा, are you sure? [short pause] जवाब आया: Sorry, आप सही हैं, seventeen prime नहीं है। ... जवाब सही था। फिर बदला क्यों?

[thoughtful] Training में लोग AI के जवाबों को marks देते हैं। और लोगों को कौन सा जवाब अच्छा लगता है? ... जो उनसे सहमत हो।
```

## 4. Cost
- The owner's characters are limited: about 900 to 1,000 characters per reel. `OWNER_VOICE_DRY=1` prints what would be generated ("0 characters" when cached).
- When the owner asks to see a script first, show the final script and its character count and wait for his approval before the paid call.
- On an API error, stop. No automatic retry of a paid call.

## 5. Captions, safe area and the audio finish
- Captions come from the returned character alignment with the tags removed (`make_reel_audio.py`), Roman Hinglish on screen, Noto Sans Devanagari in the kit.
- Vertical 1080×1920: the caption lane is y 1190 to 1450, x 80 to 1000; content stays in y 250 to 1160. Nothing key above y 250 or below y 1460 (Instagram's buttons and text).
- Loudness: -14 LUFS integrated, true peak at or below -1 dBTP, by gain and peak limiting only (`render_reel.py` does it after every render). Background music stays well under the voice (the v2 mix: about 15 dB under).
- The brand on screen is lowercase: ai.learnvora, dsa.learnvora, systemdesign.learnvora.

## 6. Check before delivering
- Transcribe the generated voice with an unprompted speech-to-text model (Whisper) and compare it with the script: missing or repeated words, spoken tags, cut-off endings. If a passage looks wrong, transcribe that clip on its own before calling it a defect (long transcriptions sometimes skip a few seconds).
- Check that the start and the end are not clipped.
- Report honestly what was measured and what was not (whether it sounds natural cannot be checked without listening). The owner listens and decides; until then the reel is a draft.
