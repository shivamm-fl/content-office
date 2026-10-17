# e102 visual plan (mute test: a door, a guard, a crash)
- A (hook): door with a guard box; red cross on the guard, door open, agent arrow passes. Label: CRASH.
- B: agent -> CHECK -> action. Check times out (clock), action still goes out. Labels: HOOK, FAIL-OPEN (red).
- C: three cards stacking, each ends in a locked door: NO START, TIMEOUT, BAD EXIT. Label: onFailure block, FAIL-CLOSED (green).
- D: rule card DEFAULT = STOP; UPI payment with fraud check DOWN: two options PAY / WAIT; COMMENT card + FOLLOW pill.
Status: not built. Blocked: voice step fails (scripts/make_reel_audio.py imports missing make_intro_audio).
