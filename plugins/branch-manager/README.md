# Branch Manager: a bootable Office of Claude agents

Run `/office <goal>` and the session becomes **Michael**, an orchestrator. Michael:
- hires Office-character agents as the work needs them;
- picks each agent's model by how risky its work is;
- routes everyone through **Pam** once the comms get busy;
- brings you only the decisions that are yours;
- winds the team down when the goal is done.

It's packaged from a real run: one owner, about 20 agents, one release shipped.

## Install

```bash
claude plugin marketplace add bixell/bixell-marketplace
claude plugin install branch-manager@bixell-marketplace
```

## Use

Plugin commands are namespaced. If `/office` isn't found, type `/branch-manager:office` (and likewise for the others).

| Command | What it does |
|---|---|
| `/office <goal>` | Boot. This session becomes Michael: definition of done, `office.md`, first hire. |
| `/office-hire <work> [as <name>]` | Hire one agent: role from the roster, model by risk, brief, reviewer. |
| `/office-status` | Sweep: who's working, stuck, waiting on you or idle with work, plus your next move. |
| `/office-wind-down` | Propose retiring lanes that are done (archives only on your yes). |
| `/office-view` | A live pixel-art office of your agents, on your Mac, or on your phone or TV if you opt in (desktop app, macOS). |

## What's inside

| Piece | Purpose |
|---|---|
| `docs/how-it-works.md` | **The behavior spec**: shape, boot, hiring, running, comms, models, gates, guardrails, wind-down, where it runs. |
| `skills/office-michael` | Michael's operating manual, plus references: lifecycle, brief template, model policy, guardrails. |
| `skills/office-hiring` | The exact steps to start an agent (desktop sessions or CLI subagents). |
| `skills/office-pam` | The front desk: triage, batch, the owner's list, NEEDS YOU / STUCK / DONE. |
| `skills/office-teammate` | The conduct rules every agent follows. |
| `skills/office-roster` | Waves, 30 core roles, work type → character table, the extended bench, `roles.json`. |
| `skills/office-view` | The live office visual (Node server, read-only). |
| `agents/*.md` | One subagent per role, for hosts without session spawning. |

## Where it runs

- **Claude desktop app (Code tab):** full mode. Agents are real sessions nested under Michael, with messaging, live model changes and the Office View.
- **Claude Code CLI:** agents run as background subagents from `agents/`. Michael relays between them, and there's no persistent team or Office View.

## Rules it enforces (short version)

- You talk to Michael. Every reply ends with `Your next move:`.
- Production, money, credentials, anything irreversible, legal and outside people stay yours. You type the yes **in that agent's session**, because a relayed yes isn't a yes.
- Nobody reviews their own work.
- No CI polling, batched pushes, status pages republished at most hourly, a usage watcher once the team is big.

## A note on names

Character names come from *The Office*, and every rule is written against the **role**, not the name.
