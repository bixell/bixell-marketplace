# Model and effort policy

Tiers, from cheapest to most careful: **haiku → sonnet → opus → fable**. Use aliases in agent files and when spawning; pin exact ids only if the owner asks.

## Defaults by kind of role

| Kind | Default | Examples |
|---|---|---|
| Lead / decider | opus · high/medium | Michael, Jan, David |
| Builder (product code) | opus · medium | Jim, Clark (the original office ran builders on Opus) |
| Builder (contained) | sonnet · medium | Meredith, Ryan, Nellie, Nick |
| Design builder | opus · medium | Kelly |
| Staff / architecture | opus · high | Dwight |
| Reviewer (general) | sonnet · medium | Devon, Karen, Holly, Creed |
| Reviewer (high stakes) | opus or fable · high | Angela (release), Oscar (numbers), Kevin (billing), Toby (security: fable) |
| Operator (prod) | fable · high | Val |
| Operator (non-prod) | sonnet/haiku · low | Erin, Nate, Pete |
| Router | sonnet · low | Pam (a Haiku router paraphrased a reviewer's "clear" into "bug") |
| Watcher / scribe / sweep | haiku or sonnet · low | usage watcher, gossip, board refresh, status sweeps, Gabe |

The exact default for each role is in `office-roster/references/roles.json`.

## Raise (for the risky step)

| Trigger | Raise to |
|---|---|
| Production deploy, prod data write, rollback | fable · high |
| Money: billing, refunds, pricing, purchases | fable · high |
| Auth, permissions, secrets, PII | fable · high (and Toby reviews) |
| Data deletion, migration, restore | opus · high minimum; fable if prod |
| Legal, privacy, terms | fable · high |
| Architecture or cross-repo contract | opus · high |
| The same task failed twice | one tier up |
| Two reviewers disagree | the tie-break reviewer one tier above both |
| A review said CLEAR and something slipped through | that reviewer's next reviews at higher effort |

How:
- **Sessions mode:** `set_session_model` / `set_session_effort` on that agent, then set it back when the step is done. Log the change in `office.md`.
- **Subagents mode:** spawn the step as a separate subagent with the higher `model`.
- **Or** keep the builder where it is and hire a dedicated reviewer at the higher tier. This is usually cheaper than raising a long-running builder.

## Lower

- Watchers, triage, board keeping, gossip and sweeps: haiku.
- **Low power mode** (the usage watcher projects a cap within the window):
  1. pause every loop except the critical path;
  2. switch remaining watchers to haiku;
  3. halve the cadences;
  4. tell the owner, in one line, what's paused and what still runs.
- **Overnight:** routine loops run at half speed.

## Never

- Raise a whole long-running session to the top tier "just in case".
- Downgrade a reviewer in the middle of a security or prod review.
