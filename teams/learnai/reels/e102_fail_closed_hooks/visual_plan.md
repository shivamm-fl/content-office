# e102 visual plan (mute test: a guard, a crash, a locked door)

| Scene | Spoken | Picture | Labels | Built with |
|---|---|---|---|---|
| A | Guard crashed, agent still did the work | AGENT box -> GUARD box (red cross lands on it) -> arrow still reaches a red ACTION DONE box | AGENT, GUARD, ACTION DONE | M.box, M.arrow, M.icon |
| B | A hook is a small check around an action; it times out and the action leaks through | AGENT -> HOOK (gear) with a clock on it; dashed red arrow bypasses to ACTION; FAIL-OPEN pill | AGENT, HOOK, ACTION, TIMEOUT, FAIL-OPEN | M.box, M.arrow, M.icon, M.pill |
| C | onFailure block: three cases stop the action | onFailure: block pill; three red cards (cross, clock, warn) each get a green lock; closing FAIL-CLOSED lock card | NO START, TIMEOUT, BAD EXIT CODE, FAIL-CLOSED | M.box, M.icon, M.pill |
| D | Default must be stop; UPI fraud check down: pay or wait? | DEFAULT: STOP lock card; EXAMPLE payment -> fraud check with red cross; PAY? WAIT? chips; COMMENT card; FOLLOW pill | DEFAULT: STOP, PAYMENT, FRAUD CHECK, PAY?, WAIT?, COMMENT | M.box, M.arrow, M.pill |
