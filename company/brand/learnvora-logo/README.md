# Learnvora logo: brand guide

Status: accepted by the owner on 18 Oct 2026 ("The Bite"), with one change: the v of the wordmark is filled with the disc colour and the master is gold. Open `options.html` for how it was chosen and `usage.html` for the three handles in use.

## The idea
The mark is a disc with a V bitten out of the top: a **v** biting an **o**, the "vo" of vora, so "learn voraciously" is one picture. The bite is negative space and its angle comes from the counter of the wordmark's own v. The v in the wordmark carries the disc colour, so the bite and the letter it came from match.

## Colourways
**The disc and the v are always the same colour; every other letter is ivory on dark.** The bite is never filled: it is the background showing through.

| Version | Disc and v | Other letters | Contrast on navy | Files (suffix) |
|---|---|---|---|---|
| Master (company, website when no track is active) | gold `#F2B544` | ivory `#F3EFE6` | 10.2 | no suffix |
| ai.learnvora | gold `#F2B544` | ivory | 10.2 | `-ai` |
| dsa.learnvora | violet `#A78BFA` | ivory | 6.9 | `-dsa` |
| systemdesign.learnvora | cyan `#4CC9F0` | ivory | 9.7 | `-systemdesign` |
| Light grounds | navy `#0B1220` | navy | 17.3 on `#F4F6FB` | `-navy` (mark: `mark-mono.svg`) |
| One colour, dark (stamps, embroidery) | ivory | ivory | 16.3 | `-ivory` |

The master and ai.learnvora share the same gold on purpose (owner decision). Ground is navy `#0B1220` or panel `#131C2E`; slate `#8FA0B8` is for secondary text only. **On light grounds always use the all-navy version**: the accent discs and v are only 1.7 to 2.5 : 1 on light, which is too weak.

## Wordmark
Lowercase `learnvora`, Space Grotesk 700, tracking minus 1 percent, converted to outlines with fontTools (weight pinned with varLib.instancer, kerning from the font's own table). No live text in any SVG. The v is cut out as its own path so it can take the accent.

## Recolouring from CSS (web)
Every SVG is path-only. The disc path has `id="disc"`, the v path has `id="v"`, the other letters `id="letters"`. Inline the SVG and set `fill` on `#disc` and `#v` (same value) to switch handle; leave `#letters` ivory. The files already contain the right colours, so no CSS is needed for the standard versions.

## Construction
- Grid 120 by 120. Disc radius 56, centred. Bite: two straight edges at 22 degrees from the vertical (the wordmark's v counter is 16), apex 12 below the disc centre, apex radius 3, corner radius 2.4.
- Small-size cut (`favicon.svg`, use under 32 px): 27 degrees, apex 9 below centre, radii 3.6 and 3.
- Horizontal lockup, per 100 em wordmark: disc diameter 72 (baseline to the top of the l, one unit of overshoot each side), gap 22. Stacked: disc 150, gap 30.
- Avatars: 1080 square, navy, disc diameter 640 (59 percent of the circle), lifted 24 px for optical centring. The farthest pixel is 342 px from the centre of a 540 px radius, so the circle crop never touches it.

## Clear space and minimum size
Clear space x is half the disc diameter on every side.

| Version | Screen | Print |
|---|---|---|
| Mark alone | 16 px (cut under 32 px) | 5 mm |
| Horizontal lockup | 90 px wide | 24 mm |
| Stacked lockup | 72 px wide | 20 mm |
| Wordmark alone | 72 px wide | 20 mm |

## Do
- Colour the disc and the v with the same accent; keep every other letter ivory.
- Use the navy files on light grounds.
- Use `favicon.svg` below 32 px.
- On covers, put the mark and the @handle below the grid crop (below y 1680 of 1920), never in the headline area.

## Don't
- Colour any letter except the v, give the disc and the v different colours, or put two accents in one logo.
- Leave the v ivory next to a coloured disc (the first version, now retired).
- Fill or decorate the bite (an eye makes it Pac-Man), rotate it, flip it, stretch it.
- Add glow, shadow, outline or gradient.
- Put an accent logo on a light ground.
- Retype the wordmark in another font, or use the mark as the letter v inside a word.
- Crop the disc or crowd it inside its clear space.

## Files
- Marks: `mark.svg` (gold master), `mark-ai.svg`, `mark-dsa.svg`, `mark-systemdesign.svg`, `mark-mono.svg` (navy), `mark-ivory.svg`.
- Wordmarks: `wordmark.svg` (master), `wordmark-ai.svg`, `wordmark-dsa.svg`, `wordmark-systemdesign.svg`, `wordmark-navy.svg`, `wordmark-ivory.svg`.
- Lockups: `lockup-horizontal.svg` and `lockup-stacked.svg` (master), each also with `-ai`, `-dsa`, `-systemdesign`, `-navy`, `-ivory`.
- `favicon.svg` (gold disc on a navy tile).
- PNG: `avatar-ai.png`, `avatar-dsa.png`, `avatar-systemdesign.png`, `avatar-learnvora.png` (gold master), all 1080 by 1080; `favicon-512.png`; `wordmark-on-navy.png`; `lockup-horizontal-ai.png`, `-dsa.png`, `-systemdesign.png` on navy.
- Pages: `options.html` (concept sheet), `usage.html` (handle usage).

Every SVG except `favicon.svg` has a transparent background, so the ivory and navy ones look empty on the wrong page colour: view the dark ones on navy and the navy ones on a light page.
