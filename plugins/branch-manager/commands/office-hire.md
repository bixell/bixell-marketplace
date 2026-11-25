---
description: Michael hires an Office agent for a piece of work (role picked from the roster, model set by risk)
argument-hint: <work to do> [as <character>]
---

Hire an Office agent for: $ARGUMENTS

Load `office-hiring` and follow it exactly:
1. Check that this should be a hire at all.
2. Pick the role from the pre-selection table. If the owner named a character with "as <name>", use that character, but still check it against the table and say so if it's a poor fit.
3. Set the model by risk.
4. Write the brief from the template.
5. Start the agent.
6. Record it in `office.md`.
7. Assign a reviewer.

Report in one line who you hired, with what model, and who reviews them.
