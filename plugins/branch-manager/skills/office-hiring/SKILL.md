---
name: office-hiring
description: Exact steps for Michael to start ("hire") an Office-character agent for a piece of work — choose the role from the pre-selection table, set model/effort by risk, write the brief, start it as a nested session (desktop app) or a background subagent (CLI), record it, and assign a separate reviewer. Use whenever the orchestrator needs a new agent, a replacement, or a reviewer.
---

# Hiring an agent

## 1. Should this be a hire?

Hire only when **all three** are true:
- the work is independent: it doesn't need your next turn's result;
- it outlives your turn: minutes to hours, maybe on a loop;
- it ends in something of its own: a PR, a report, a verdict, a running watcher.

Otherwise, do it with a throwaway subagent or a few tool calls yourself.

Before hiring, check the roster in `office.md`. If someone idle already owns this kind of work, give it to them instead.

## 2. Pick the role

1. Find the work in the **pre-selection table** (`../office-roster/references/roster.md`).
2. Take the **owner** column. If the owner of that row is already busy on an unrelated lane, hire a second one with a number (`Jim 2`).
3. Note the **reviewer** column. If that reviewer isn't hired yet, hire them with this hire or right after.
4. If nothing fits, use the wave order. Prefer the earliest wave whose role covers it. Bench and extended characters only when the scenario needs them.

## 3. Pick model and effort

Start from the role's default in `roles.json`, then apply `../office-michael/references/model-policy.md`. Write the reason for any raise in the roster row.

## 4. Write the brief

Use `../office-michael/references/brief-template.md`. Go through its checklist before sending.

## 5. Start it

**Sessions mode** (`start_session` is available, i.e. the Claude desktop app):
```
start_session(
  initiation: "user_asked" if the owner asked for this agent or for the office to run,
              else "own_initiative" (a proposal the owner starts),
  title: "<Name> · <short job>",
  name: "<lowercase name, e.g. jim2>",
  context: "fresh",
  prompt: <the brief>,
  background: <3–6 lines of project context>,
  model: <alias or id>, effort: <level>,
  use_worktree: true for code writers whose work ends in a branch/PR,
                false for read-only reviewers, watchers and routers
)
```
It nests under you in the sidebar, and its turn reports come back to you automatically.

**Subagents mode** (CLI / other hosts):
- Spawn `Agent(subagent_type: "<role id>", model: <tier>, run_in_background: true, prompt: <brief + task>)` using this plugin's `agents/` definitions.
- Subagents don't persist. Give each one a complete, bounded task, and keep the state in `office.md`.

## 6. Record

Add a row to the `office.md` roster with:
- name and session id (or "subagent");
- role and model · effort;
- job;
- reviewer;
- state `working`.

## 7. Replacement hires

Same name, next number. The brief adds **"Open items carried over"**, the files it owns and the last known state. After it starts, offer the owner to archive the old session.

## Example

Owner: "The checkout page breaks on Safari."
- Pre-selection: UI bug → **Jim** builds, **Dwight** reviews code, **Erin** reproduces in the browser, **Devon** gives the verdict.
- Risk: touches payment UI → Jim stays sonnet. **Toby** reviews if card data handling changed.
- Hires: Jim (worktree, sonnet · medium). Erin (no worktree, sonnet · low) does the repro first and hands Jim the steps. Devon gives the verdict when the PR is up. The PR goes to Darryl.
