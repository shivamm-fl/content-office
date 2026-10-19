---
name: owner-voice
description: Voice a Learnvora DSA reel with the OWNER'S OWN cloned ElevenLabs voice ("Shivam Trainer") using the recipe he approved on 2026-10-15 (Flash v2.5 at tempo 0.9 since 2026-10-19, multilingual_v2 before, voice defaults, one request per phrase, primed first line, exact word timings). OPT-IN ONLY — use it only when the owner explicitly says "meri voice use karo" / "my voice" / "ElevenLabs se bana" AND the ElevenLabs key is available; every other reel (including all CI builds) stays on the free Edge TTS default.
---

# Owner's voice (ElevenLabs)

**In the office (owner decision 2026-10-17) this is the DEFAULT voice**: the studio's `make_voice` tool uses it whenever the ElevenLabs characters of the month cover the reel, and falls back to Swara (Edge TTS, `"tts": "edge"`) otherwise. The office keeps the key; agents never see or need it. The rest of this file is the recipe (in ai-course it stays opt-in). This skill changes only the voice, nothing else of the pipeline.

## When (ai-course, local)
- The owner asks for his own voice in this session and the key is present (`ELEVENLABS_API_KEY` in the environment or in `ai-course/.env`, which is git-ignored). Never put the key in a committed file, a spec, a log or a message.

## The recipe (why each point: the owner tested the alternatives)
- Voice `Shivam Trainer` (`KgBloOsGmp6r57GIimqQ`), not the older `Shivam` clone. Model `eleven_multilingual_v2`.
- **Model (owner decision 2026-10-19): `eleven_flash_v2_5` at `"owner_tempo": 0.9` for every new reel.** Same voice, half the price per character ($0.04 instead of $0.08 per 1,000); he listened to the first 20 seconds of Day 1 and the whole of Day 2 this way and approved it. `scripts/new_reel.py` writes `"owner_model": "eleven_flash_v2_5", "owner_tempo": 0.9` into the spec. A spec without `owner_model` is a reel voiced before this decision: it stays on `eleven_multilingual_v2` at tempo 1.0 (a new model is a new voice for a reel the owner already approved, and it spends the month's characters again). `owner_tempo` slows or speeds the cached audio with ffmpeg (0.9 = 10 percent slower), so a new tempo costs nothing; the model is part of the phrase cache key.
- **No voice_settings** (stability/style/speed tweaks sounded unnatural). **No eleven_v3, no audio tags** like `[excited]` (sounded like shouting).
- **One request per phrase**, never the whole script: one request makes it rushed with no pauses. `previous_text` / `next_text` keep the intonation continuous (not billed).
- **Primed first line**: spec `"prime": "सुनो, ये बहुत interesting है!"` is sent as the first phrase's `previous_text` — never spoken, it lifts the hook's energy. The owner picked this over plain, "expressive settings" and v3.
- Mixed script: Hindi in Devanagari, English in Latin. Do not transliterate English ("मॉडल") and do not write Hindi in Roman. In braced tokens the engine takes the Latin form (`JSON{जेसन}` → JSON, `30{thirty}` → thirty).
- Trim and caption timings come from the character alignment (`/with-timestamps`): exact, no whisper.

## Writing for this voice (reels)
Short punchy phrases with `...`, `?`, `!` carry the expression (the voice follows the text, not settings):
```
"A": "@hook Chatbot ने customer को बोला... | refund तीस दिन में! | और policy में? | सिर्फ़ सात दिन।",
"B": "Document उसके पास था... | फिर भी गलत जवाब! | यही interview में पूछा जाता है। | और जवाब? | तीन वजहें।"
```
Pauses: `|` 0.3 s between phrases (reel rhythm), `||` 0.6 s only at a real section change; a question gets its own phrase so the pause lands after it. Close with comment + follow (clean-reel rule 7), never "save kar lo".

## Run
1. In `spec.json`: `"tts": "owner", "prime": "सुनो, ये बहुत interesting है!"` (keep `"audio": "v2"`; `pace` is ignored for this voice).
2. `OWNER_VOICE_DRY=1 .venv/bin/python scripts/make_reel_audio.py reels/<folder>` → prints the characters to generate (the plan has about 32k characters a month). Tell the owner the number before a full reel; a 10–15 s test (the hook scene) first.
3. `.venv/bin/python scripts/make_reel_audio.py reels/<folder>` → voice, word-exact captions, mix at -14 LUFS. Phrases are cached by content (`audio/hi/el_*.mp3`): editing one phrase regenerates only it and its two neighbours.
4. Render as usual. Reference implementation outside the repo: `~/ai-engineering-course-videos/tools/eleven.py`, `eleven_project.py`.
