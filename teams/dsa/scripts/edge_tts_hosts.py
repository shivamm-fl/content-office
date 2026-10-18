"""Microsoft Edge TTS hosts, new one first.  Since 2026-10-10 Microsoft answers the legacy host speech.platform.bing.com with 403 (Europe first; the US and every GitHub runner from
2026-10-12 01:14 UTC). Microsoft Edge itself synthesizes through api.msedgeservices.com, which accepts the legacy trusted-client token as Ocp-Apim-Subscription-Key together with the
legacy Sec-MS-GEC parameters (rany2/edge-tts issue 490 and pull request 491). edge-tts 7.2.8 only knows the legacy host, so every call here tries the new host first and falls back to
the legacy one (the order can be changed with env EDGE_TTS_HOSTS="legacy,new"). Verified 2026-10-12: new host works on ubuntu, ubuntu-arm, macOS and Windows runners and on the laptop,
with the same MP3 format and word boundaries. Drop this module when the installed edge-tts already names api.msedgeservices.com in its WSS_URL."""
import os

NEW_HOST = "wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1?Ocp-Apim-Subscription-Key="


def hosts():
    import edge_tts.constants as K
    legacy = K.__dict__.setdefault("_LEARNAI_LEGACY_WSS", K.WSS_URL)   # remember the library's own URL before we patch it
    if "api.msedgeservices.com" in legacy:
        return [legacy]   # a fixed edge-tts: nothing to patch
    new = NEW_HOST + K.TRUSTED_CLIENT_TOKEN
    order = [x.strip() for x in os.environ.get("EDGE_TTS_HOSTS", "new,legacy").split(",") if x.strip()]
    return [new if o == "new" else legacy for o in order]


async def synth(text, voice, rate, pitch, vol):
    """-> (mp3 bytes, [(word, start_s, duration_s)]) like make_reel_audio._edge, trying each host in turn."""
    import edge_tts
    import edge_tts.communicate as C
    import edge_tts.constants as K
    last = None
    for url in hosts():
        C.WSS_URL = K.WSS_URL = url
        try:
            c = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, volume=vol, boundary="WordBoundary")
            audio, words = bytearray(), []
            async for ch in c.stream():
                if ch["type"] == "audio":
                    audio += ch["data"]
                elif ch["type"] == "WordBoundary":
                    words.append((ch["text"], ch["offset"] / 1e7, ch["duration"] / 1e7))
            return bytes(audio), words
        except Exception as e:   # handshake 403 on one host: try the other
            last = e
    raise last
