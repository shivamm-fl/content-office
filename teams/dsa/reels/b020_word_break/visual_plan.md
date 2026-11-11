# Visual plan — Word Break

- A: cars split ca|rs, dictionary car,ca,rs and whole-string true
- B: Branch car|s fails while ca|rs reaches the end
- C: Longest-prefix path dead end and repeated suffix-state pattern
- D: Edges from reachable start to end exist only for exact dictionary-word spans
- E: Prefix cells0,1,2,3,4 fill true,false,true,true,true in order
- F: First source chunk initializes empty prefix and computes start for each word
- G: Remaining condition/early-break/final-return code with character-comparison complexity
