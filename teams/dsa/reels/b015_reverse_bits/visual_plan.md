# Visual plan — Reverse Bits

- A: Ten shown as00000000 00000000 00000000 00001010 with32-position reversal target
- B: Correct padded string reversal contrasted with invalid four-bit-only1010 to0101
- C: Temporary32-character buffer contrasted with two scalar registers
- D: Low-bit extraction arrow and shift-append invariant
- E: Chronological result0,1,2,5 then28 zero appends ending0x50000000
- F: Complete Accepted32-round loop; input zero never truncates loop
- G: Full result1342177280 and fixed32-round time/space qualification
