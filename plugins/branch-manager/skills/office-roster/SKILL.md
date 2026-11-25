---
name: office-roster
description: The Office character roster — creation waves, the 30 core roles with home/secondary positions, handoffs and default model·effort, the work-type → character pre-selection table, and the extended bench. Use when choosing which Office character should own or review a piece of work, when registering profiles in wave order, or when someone asks "who should do X" in the office.
---

# Office roster

- `references/roster.md`: the human-readable roster. It has the waves, the core roles, the **pre-selection table** (work type → owner → reviewer), the extended bench and the naming rules.
- `references/roles.json`: the same core roles, machine-readable, with fields `id`, `name`, `wave`, `home`, `secondary`, `handoff`, `model`, `effort` and `kind`.

## How to use it

1. **Who owns this work?** Look it up in the pre-selection table first. Read the full role rows only if nothing matches.
2. **Who reviews it?** Use the reviewer column. The reviewer must be a different agent from the one who produced the work.
3. **What model?** Take the role default from `roles.json`, then raise it for risk using the `office-michael` model policy.
4. **Which wave?** Waves are the order to register profiles, and to reach for them when several roles could fit. They are **not** a hiring list: hire one agent per open piece of work.

Names are costumes; roles are the contract. A team may swap in other names; keep the roles and the rules the same.
