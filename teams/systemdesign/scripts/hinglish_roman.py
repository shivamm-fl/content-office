"""Roman Hinglish for on-screen captions.  The voice keeps reading the Devanagari text (Microsoft Edge TTS, unchanged); the caption shows the same word in Roman letters.
  python scripts/hinglish_roman.py "इसलिए keyword नहीं, meaning match होता है।"   -> "isliye keyword nahi, meaning match hota hai."
Used by scripts/make_reel_audio.py (caption_script "roman" is the default since 2026-10-12) and scripts/romanize_reel.py (fixes an existing reel).
A word list gives the natural spelling of the common words ("kya", "hai", "nahi", "mein"); anything else goes through rule-based transliteration with schwa deletion.
Latin words, digits and punctuation pass through; the danda becomes a full stop."""
import re
import sys
import unicodedata

DEV = re.compile(r"[ऀ-ॿ]")

# natural Hinglish spellings of the words our scripts use all the time (Devanagari -> Roman)
WORDS = {
    "है": "hai", "हैं": "hain", "था": "tha", "थे": "the", "थी": "thi", "हो": "ho", "होता": "hota", "होती": "hoti", "होते": "hote", "होने": "hone", "होगा": "hoga", "होगी": "hogi", "हुआ": "hua", "हुई": "hui", "हुए": "hue",
    "रहा": "raha", "रही": "rahi", "रहे": "rahe", "गया": "gaya", "गई": "gayi", "गए": "gaye", "कर": "kar", "करता": "karta", "करती": "karti", "करते": "karte", "करना": "karna", "करो": "karo", "करें": "karen", "करे": "kare", "किया": "kiya",
    "की": "ki", "का": "ka", "के": "ke", "को": "ko", "से": "se", "में": "mein", "पर": "par", "पे": "pe", "और": "aur", "या": "ya", "भी": "bhi", "ही": "hi", "तो": "to", "जो": "jo", "कि": "ki", "कौन": "kaun",
    "क्या": "kya", "क्यों": "kyun", "कैसे": "kaise", "कब": "kab", "कहाँ": "kahan", "कितना": "kitna", "कितनी": "kitni", "कितने": "kitne", "यह": "yeh", "ये": "ye", "वह": "woh", "वो": "wo", "इस": "is", "उस": "us", "इन": "in", "उन": "un",
    "इसलिए": "isliye", "उसका": "uska", "उसकी": "uski", "उसके": "uske", "इसका": "iska", "इसकी": "iski", "इसके": "iske", "अपना": "apna", "अपनी": "apni", "अपने": "apne", "मेरा": "mera", "आपका": "aapka", "आपकी": "aapki", "आपके": "aapke",
    "आप": "aap", "हम": "hum", "तुम": "tum", "मैं": "main", "हमारा": "hamara", "नहीं": "nahi", "ना": "na", "मत": "mat", "बस": "bas", "सिर्फ़": "sirf", "सिर्फ": "sirf", "केवल": "keval", "बहुत": "bahut", "थोड़ा": "thoda",
    "ज़्यादा": "zyada", "ज्यादा": "zyada", "कम": "kam", "सब": "sab", "सभी": "sabhi", "हर": "har", "कुछ": "kuch", "कोई": "koi", "कभी": "kabhi", "अभी": "abhi", "अब": "ab", "जब": "jab", "तब": "tab", "फिर": "phir", "पहले": "pehle",
    "बाद": "baad", "बार": "baar", "लेकिन": "lekin", "मगर": "magar", "अगर": "agar", "जैसे": "jaise", "जैसा": "jaisa", "वैसे": "waise", "वही": "wahi", "यही": "yahi", "वहाँ": "wahan", "यहाँ": "yahan", "ऐसे": "aise", "ऐसा": "aisa", "ऐसी": "aisi",
    "इतना": "itna", "उतना": "utna", "एक": "ek", "दो": "do", "तीन": "teen", "चार": "chaar", "पाँच": "paanch", "छह": "chhah", "सात": "saat", "आठ": "aath", "नौ": "nau", "दस": "das", "साढ़े": "saadhe", "लगभग": "lagbhag", "तीस": "tees",
    "पूरा": "poora", "पूरी": "poori", "पूरे": "poore", "पुराना": "purana", "पुराने": "purane", "पुरानी": "purani", "नया": "naya", "नए": "naye", "नई": "nayi", "बड़ा": "bada", "बड़ी": "badi", "बड़े": "bade", "छोटा": "chhota", "छोटे": "chhote",
    "छोटी": "chhoti", "सबसे": "sabse", "बेहतर": "behtar", "अच्छा": "achha", "अच्छी": "achhi", "ठीक": "theek", "सही": "sahi", "गलत": "galat", "असल": "asal", "असली": "asli", "सीखना": "seekhna", "सीख": "seekh", "सकता": "sakta",
    "सकती": "sakti", "सकते": "sakte", "सके": "sake", "चाहिए": "chahiye", "पता": "pata", "चलता": "chalta", "चलती": "chalti", "चलते": "chalte", "चाल": "chaal", "देखकर": "dekhkar", "देखो": "dekho", "देखिए": "dekhiye", "देख": "dekh",
    "दिखते": "dikhte", "दिखता": "dikhta", "दिखाता": "dikhata", "बताओ": "batao", "बताता": "batata", "बताया": "bataya", "बनता": "banta", "बनते": "bante", "बनी": "bani", "बना": "bana", "बनाता": "banata", "बनाए": "banaye", "बनाया": "banaya",
    "लगता": "lagta", "लगाता": "lagata", "लगे": "lage", "लगा": "laga", "लगती": "lagti", "जीता": "jeeta", "जीते": "jeete", "जीत": "jeet", "हार": "haar", "हराया": "haraya", "खेलता": "khelta", "खेलते": "khelte", "पढ़ता": "padhta",
    "पढ़ते": "padhte", "पढ़ो": "padho", "पूछा": "poocha", "पूछे": "poochhe", "पूछता": "poochta", "जवाब": "jawab", "सवाल": "sawal", "फ़र्क": "fark", "फर्क": "fark", "अंदाज़ा": "andaza", "अंदाज़े": "andaze", "अंदाजा": "andaza",
    "छिपे": "chhupe", "छिपा": "chhupa", "दुश्मन": "dushman", "हिस्सा": "hissa", "टुकड़ा": "tukda", "टुकड़े": "tukde", "टूट": "toot", "टूटता": "tootta", "जुड़ता": "judta", "जुड़ते": "judte", "जुड़": "jud", "जाता": "jata", "जाती": "jati",
    "जाते": "jate", "जाना": "jaana", "जाए": "jaye", "आता": "aata", "आते": "aate", "आती": "aati", "आया": "aaya", "आगे": "aage", "निकले": "nikle", "निकलना": "nikalna", "बराबरी": "barabari", "सोचने": "sochne", "सोचता": "sochta",
    "सोच": "soch", "काम": "kaam", "तय": "tay", "इंसान": "insaan", "इंसानों": "insaano", "लोग": "log", "दोस्त": "dost", "दोबारा": "dobara", "दोहराया": "dohraya", "अगला": "agla", "अगली": "agli", "अगले": "agle", "तक": "tak",
    "सिखाया": "sikhaya", "चुना": "chuna", "चुनो": "chuno", "अलग": "alag", "कई": "kai", "पक्का": "pakka", "असर": "asar", "दिखा": "dikha", "साल": "saal", "हफ़्ता": "hafta", "हफ्ता": "hafta", "हफ़्ते": "hafte", "दिन": "din",
    "पैसा": "paisa", "पैसे": "paise", "डॉलर": "dollar", "खर्च": "kharch", "भारी": "bhaari", "मतलब": "matlab", "अंदर": "andar", "बाहर": "bahar", "ऊपर": "upar", "नीचे": "neeche", "साथ": "saath", "बिना": "bina", "वजह": "wajah",
    "इसे": "ise", "उसे": "use", "जिसे": "jise", "जिसमें": "jismein", "जिससे": "jisse", "तरह": "tarah", "बारे": "baare", "लिए": "liye", "वाला": "wala", "वाली": "wali", "वाले": "wale", "जैसी": "jaisi", "सकती": "sakti",
    "देता": "deta", "देती": "deti", "देते": "dete", "लेता": "leta", "लेते": "lete", "रखता": "rakhta", "रखो": "rakho", "रखा": "rakha", "बोलता": "bolta", "बोलो": "bolo", "समझ": "samajh", "समझता": "samajhta", "समझाता": "samjhata",
    "समझो": "samjho", "समझें": "samjhen", "सुनो": "suno", "जानो": "jaano", "जानना": "jaanna", "मिलता": "milta", "मिलते": "milte", "मिल": "mil", "भेजो": "bhejo", "भेज": "bhej", "गिरते": "girte", "गिर": "gir", "बढ़ते": "badhte",
    "बढ़ता": "badhta", "बढ़ा": "badha", "बढ़": "badh", "घटता": "ghatta", "रोकता": "rokta", "मदद": "madad", "तेज़": "tez", "तेज": "tez", "धीमा": "dheema", "आसान": "aasaan", "मुश्किल": "mushkil", "सच": "sach", "झूठ": "jhooth",
    "शुरू": "shuru", "ख़त्म": "khatam", "खत्म": "khatam", "नीचे": "neeche", "सामने": "saamne", "बाकी": "baaki", "पास": "paas", "दूर": "door", "हमेशा": "hamesha", "कहते": "kehte", "कहा": "kaha", "कह": "keh", "कहना": "kehna",
}
WORDS = {unicodedata.normalize("NFC", k): v for k, v in WORDS.items()}

CONS = {"क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "n", "च": "ch", "छ": "chh", "ज": "j", "झ": "jh", "ञ": "n", "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n", "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
        "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m", "य": "y", "र": "r", "ल": "l", "व": "v", "श": "sh", "ष": "sh", "स": "s", "ह": "h", "ळ": "l",
        "क़": "q", "ख़": "kh", "ग़": "gh", "ज़": "z", "ड़": "d", "ढ़": "dh", "फ़": "f", "य़": "y"}
NUKTA_BASE = {"क": "q", "ख": "kh", "ग": "gh", "ज": "z", "ड": "d", "ढ": "dh", "फ": "f"}
VOW = {"अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo", "ऋ": "ri", "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au", "ऑ": "o", "ऍ": "e"}
MATRA = {"ा": "aa", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo", "ृ": "ri", "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ॉ": "o", "ॅ": "e"}
HALANT, NUKTA, ANUS, CHAND, VISARGA = "्", "़", "ं", "ँ", "ः"
FINAL_MATRA = {"ा": "a", "ी": "i", "ू": "u"}   # at the end of a word: kya, ki, bahu


def translit(word):
    """Rule-based Devanagari -> Roman for one word (no punctuation): syllables, then schwa deletion (sabase -> sabse)."""
    word = unicodedata.normalize("NFC", word)   # precomposed nukta letters become base + nukta
    syl, i, n = [], 0, len(word)   # syllable = [consonants, vowel, tail]; vowel None = inherent a, "" = none (halant)
    while i < n:
        ch = word[i]
        if ch in VOW:
            syl.append(["", VOW[ch], ""])
            i += 1
        elif ch in CONS:
            cons, closed = "", False
            while True:
                c = CONS[word[i]]
                i += 1
                if i < n and word[i] == NUKTA:
                    c = NUKTA_BASE.get(word[i - 1], c)
                    i += 1
                cons += c
                if i < n and word[i] == HALANT:
                    i += 1
                    if i < n and word[i] in CONS:
                        continue   # a conjunct: the next consonant joins this syllable
                    syl.append([cons, "", ""])
                    closed = True
                break
            if closed:
                continue
            vow = None
            if i < n and word[i] in MATRA:
                vow = MATRA[word[i]]
                i += 1
            syl.append([cons, vow, ""])
        elif ch in (ANUS, CHAND):
            if syl:
                syl[-1][2] += "n"
            i += 1
        elif ch == VISARGA:
            if syl:
                syl[-1][2] += "h"
            i += 1
        else:
            i += 1   # a stray nukta, zero-width marks and the like
    has = [v[1] is None or v[1] != "" for v in syl]   # does the syllable carry a vowel at the moment
    for k in range(len(syl) - 1, -1, -1):             # schwa deletion, right to left
        if syl[k][1] is not None:
            continue
        if k == len(syl) - 1:
            has[k] = False
        elif k > 0 and has[k - 1] and has[k + 1] and syl[k + 1][0] != "":
            has[k] = False
    out = []
    for k, (cons, vow, tail) in enumerate(syl):
        if vow is None:
            v = "a" if has[k] else ""
        elif vow == "aa":
            v = "aa" if k == 0 else "a"
        elif vow == "ee":
            v = "ee" if k == 0 else "i"
        elif vow == "oo":
            v = "oo" if k == 0 else "u"
        else:
            v = vow
        out.append(cons + v + tail)
    return "".join(out)


def roman_word(w):
    """One caption token (may carry punctuation) -> Roman Hinglish."""
    w = w.replace("।", ".").replace("॥", ".")   # danda and double danda become full stops before anything else
    m = re.match(r"^([^ऀ-ॿA-Za-z0-9]*)(.*?)([^ऀ-ॿA-Za-z0-9]*)$", w, re.S)
    lead, core, trail = m.group(1), m.group(2), m.group(3)
    if not DEV.search(core):
        return w.replace("।", ".").replace("॥", ".")
    # a token like "word-शब्द" or "Python(पाइथन)": split on non-letters and convert the Devanagari pieces
    parts = re.split(r"([^ऀ-ॿ]+)", core)
    conv = [(WORDS.get(unicodedata.normalize("NFC", p)) or translit(p)) if DEV.search(p) else p for p in parts]
    return lead.replace("।", ".") + "".join(conv) + trail.replace("।", ".").replace("॥", ".")


def roman_text(s):
    return " ".join(roman_word(w) for w in s.split(" "))


def romanize_caps(caps):
    """Caption tokens of data.json: Devanagari tokens get a Roman `t` and keep the original in `sp` (M.W finds a word by either form). Idempotent."""
    for c in caps:
        if "sp" not in c and DEV.search(c["t"]):
            c["sp"] = c["t"]
            c["t"] = roman_word(c["t"])
    return caps


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    print(roman_text(" ".join(sys.argv[1:])) if len(sys.argv) > 1 else __doc__)
