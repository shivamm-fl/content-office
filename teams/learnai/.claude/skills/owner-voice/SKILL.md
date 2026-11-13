---
name: owner-voice
description: Voice a Learnvora reel with the OWNER'S OWN cloned ElevenLabs voice ("Shivam Trainer") on narration recipe v4 (owner 2026-11-13) - eleven_v4, the whole reel in one take, stability 0.5 / similarity 0.8 / seed 121126, sparse delivery tags, no tempo change. Use for every new reel ("tts": "owner_v4"); in the office the make_voice tool runs it. Reels voiced before 2026-11-13 keep the old phrase recipe on a revision.
---

# Owner's voice (ElevenLabs), narration recipe v4

The full recipe (writing, format, safe area, loudness, checks) is `docs-notes/narration-recipe-v4.md`. This skill is the voice part only.

**In the office** the studio tool `make_voice` voices the reel: it sets `"tts": "owner_v4"` and uses the owner's voice whenever the month's characters cover the reel, and Swara (Edge TTS) otherwise. The office keeps the key; agents never see it, print it or write it anywhere.

## The recipe (owner 2026-11-13: "tu voice abhi bhi shivam trainer hi rakhna"; q158 and q159 approved: "mast mast")
- Voice: the cloned voice named exactly `Shivam Trainer` (looked up by name; the run stops on zero or several matches). Not the older `Shivam` clone.
- Model `eleven_v4`, `voice_settings` `{"stability": 0.5, "similarity_boost": 0.8}`, `seed` 121126, no other settings.
- The whole reel is ONE request (scenes joined by a paragraph break), so the delivery is continuous. Never stitch sentence-by-sentence clips.
- Never speed up, slow down or pitch-shift the voice to fit a length: cut words.
- Captions and scene starts come from the returned character alignment (tags removed). Sentence spans (`ph[scene][k]`, for cues and timelines) split at । ? ! and at a single full stop before a space.
- Every generation is cached in `audio/hi/v4_<sha12>.mp3` + `.json` + `.marker.json` (sha256 of text, model, voice, settings, seed); the runner keeps them with the reel's media, so a revision that does not change the narration costs nothing.
- On an API error the run stops; it never retries a paid call by itself.

## Writing for this voice
- One paragraph per scene in `copy.hi`. Delivery tags only `[warm, conversational]`, `[curious]`, `[thoughtful]`, `[short pause]`, at the start of a paragraph or before an answer. `...` for a thinking beat. No `|`, no `@hook`.
- Numbers and maths in words ("fifty one percent", "ग्यारह बड़े chatbots"); no digits or symbols.
```
"A": "[warm, conversational] मान लो AI से पूछा: seventeen prime number है? बोला, हाँ। तुमने लिखा, are you sure? [short pause] जवाब आया: Sorry, आप सही हैं, seventeen prime नहीं है। ... जवाब सही था। फिर बदला क्यों?",
"B": "[thoughtful] Training में लोग AI के जवाबों को marks देते हैं। और लोगों को कौन सा जवाब अच्छा लगता है? ... जो उनसे सहमत हो।"
```

## Run (local)
1. `OWNER_VOICE_DRY=1 python scripts/make_reel_audio.py reels/<folder>` prints the characters it would generate (`0 characters` when cached). Credits are limited (about 900 to 1,000 characters a reel): when the owner asked to see the script, show it with this number and wait.
2. `ELEVENLABS_API_KEY=... python scripts/make_reel_audio.py reels/<folder>` (the key only from the environment) makes the voice, the word-exact captions and the v2 mix.
3. Transcribe the voice with Whisper (unprompted) and compare it with the script; check the start and the end are not clipped. `render_reel.py` brings the final video to -14 LUFS, true peak <= -1 dBTP.

## Old recipe (reels voiced before 2026-11-13 only)
`"tts": "owner"`: one request per phrase on `eleven_flash_v2_5` (or `eleven_multilingual_v2`), `owner_tempo`, a primed first line, pause marks `|`. The studio keeps it for a reel whose `el_*` phrase cache exists, so an approved voice is not bought again or changed. Never start a new reel on it.
