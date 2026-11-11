# Storyboard — Blind 75 20: Word Break

Owner tempo 0.9; 103.0s. Actual accepted source; no invented runtimes.

| Scene | Seconds | Viewer learns |
|---|---|---|
| A | 0.0–13.6 | cars split ca|rs, dictionary car,ca,rs and whole-string true |
| B | 13.6–27.4 | Branch car|s fails while ca|rs reaches the end |
| C | 27.4–40.0 | Longest-prefix path dead end and repeated suffix-state pattern |
| D | 40.0–57.9 | Edges from reachable start to end exist only for exact dictionary-word spans |
| E | 57.9–71.7 | Prefix cells0,1,2,3,4 fill true,false,true,true,true in order |
| F | 71.7–88.0 | First source chunk initializes empty prefix and computes start for each word |
| G | 88.0–103.0 | Remaining condition/early-break/final-return code with character-comparison complexity |
