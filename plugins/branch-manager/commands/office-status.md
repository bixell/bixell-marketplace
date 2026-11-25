---
description: Office status sweep — who is working, stuck, waiting on the owner, or idle with work; plus the owner's next move
---

Run one Office status sweep (`office-michael` → `references/lifecycle.md` → **Run**).

1. Spawn one background read-only subagent (sonnet). Give it the roster from `office.md` and ask for a table with these columns:
   - name;
   - state: working, idle, waiting-on-owner, stuck or error;
   - doing now (≤8 words);
   - flags.
2. Act on the flags: unblock, replace, nudge, or add to the owner's list.
3. Reply to the owner with:
   - one status line;
   - the table, but only the rows with flags;
   - `Your next move:`.
