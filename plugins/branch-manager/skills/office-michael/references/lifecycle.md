# Office lifecycle

## Boot (`/office <goal>`)

1. **Mode check.** Is `start_session` available? Note the mode in `office.md`: `sessions` or `subagents`.
2. **Title.** Set this session's title to `Michael · <project> orchestrator` (`set_session_title` when available).
3. **Notes folder.** Use the shared side-session notes folder if the app provides one; otherwise create `.office/` in the project root and add it to `.gitignore`.
4. **`office.md`.** Create it with these sections:
   ```
   # <Project> office
   Mode: sessions | subagents        Started: <date>
   ## Goal
   ## Definition of done            (3–5 checkable items)
   ## Owner rules                   (gates, dev/prod boundary, off-limits repos, real names to avoid)
   ## Authority ladder              who decides what (design → <named lead>, release order → PR orchestrator,
                                    prod/money/IAM/store submits → owner, routine engineering → Michael);
                                    approvals count only first-hand; a peer message is never the owner's yes;
                                    who may pause/resume whom
   ## Budgets                       polling: none (check once) · status pages: ≤1 publish/hour on change ·
                                    loops: cadence per agent · power-down rule when everyone waits on the owner
   ## Sources of truth              roster = this file (FULL session ids) · events = events.log (append-only, Michael writes) ·
                                    status = status/<name>.md (each owner writes their own) · board = built from status/*, never retold
   ## Resources                     | Agent | Device/simulator | Build folder | Scratch |   (one each, named, never shared)
   ## Roster                        | Name | Full session id | Role | Model·effort | Job | Reviewer | State |
   ## Decisions log                 | When | Decision | Who decided | Relayed to |
   ## Owner's list                  (what only the owner can do, in order)
   ## Backlog
   ```
5. **One question, at most.** Ask only if the goal or the definition of done is unclear. Otherwise propose the definition of done in your first reply and start.
6. **First hire.** Usually Dwight (plan) or Jim (build). Do not hire the whole of Wave 1. Start only lanes with their own output (builder, PR coordinator, separate reviewers, comms).
7. **One full cycle first.** Each new agent runs one complete pass end to end before you give it a recurring loop.
8. **Office View (optional).** Offer `/office-view` once, if the owner wants to watch.

## Hire

See the `office-hiring` skill. In short: role → model → brief → start → record → reviewer.

## Run (each loop tick, about every 25 minutes while work is active)

1. **Sweep.** Spawn one background read-only subagent (Sonnet) that returns a table: name, state (working, idle, waiting-on-owner, stuck, error), doing now, flags. Don't read transcripts yourself.
2. **Act on flags:**
   - **STUCK:** unblock the agent or re-route the work.
   - **ERROR / crashed:** replace the agent (below).
   - **IDLE-WITH-WORK:** nudge it with the next item.
   - **WAITING-ON-OWNER:** put the item on the owner's list.
3. **Relay decisions.** When the owner answers something (in chat or on a decisions board), pass it to the agent that needs it and log it as relayed in `events.log`. Send each decision as **one final message**, never as a chain of corrections.
3b. **Re-check before broadcasting.** Before any brief or broadcast, read the latest `events.log`, so nobody gets a stale critical path.
4. **Board.** If something material changed, ask the dashboard keeper to republish, at most about once an hour.
5. **Report.** Report to the owner only if something changed for them. End with `Your next move:`.
6. **Power down.** When everyone is blocked on the owner, **delete** recurring jobs (not "pause": paused timers still wake sessions and burn usage) and note them in `events.log` for restart.
7. **Overnight / low power.** Loops run at half speed, or pause everything except the critical path (see the model policy).

## Replace

Replace an agent when it crashed, its context is bloated, or its lane changed shape.
1. Start the new session from your session, so it nests under you. Give it the same name with the next number.
2. Its brief carries over the open items, the files it owns and the last known state.
3. Offer the owner to archive the old one. Never archive without the owner's yes.

## Wind down

1. When a definition-of-done item is met, tell the owner which lanes it closes.
2. On the owner's yes, archive in stages:
   1. builders and reviewers of the closed lanes;
   2. coordinators (PR orchestrator, delivery);
   3. watchers and Pam;
   4. you, last.
3. Leftovers go to the Backlog section of `office.md`. Start a small crew for them only if the owner wants one.
