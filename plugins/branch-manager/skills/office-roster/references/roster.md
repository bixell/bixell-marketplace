# Office roster

`roles.json` in this folder is the machine-readable copy of this file. When the two disagree, `roles.json` wins.

**Name vs role.** A character name is a costume; the **role** is the contract. Every rule in the skills is written against roles (Orchestrator, Receptionist, Staff Engineer…). A team that prefers different names keeps the same roles.

## Creation order (waves)

Register profiles in this order. At runtime, keep Michael and Pam available for intake and dispatch, then activate only the workers and reviewers the project needs.

| Wave | Create in this order | First assignment |
|---|---|---|
| 1 · Core office | Michael → Pam → Dwight → Jim → Kelly | Take a request, break it into work, design a flow, build a preview. Until Wave 2 exists, route review to the human or stop at the preview. |
| 2 · Review and merge | Jan → Devon → Erin → Karen → Toby → Darryl | Define acceptance criteria, gather browser evidence, run independent reviews, sequence approved PRs. |
| 3 · Delivery and rollout | Andy → Clark → Meredith → Nate → Angela → Val | Coordinate a multi-PR feature, test integrations, verify release readiness, run a staged rollout. |
| 4 · Customer and measurement | Pete → Ryan → Oscar → Phyllis → Gabe | Onboard or support users, check adoption, validate reporting, collect pilot sign-off. |
| 5 · Specialist bench | Creed → Holly → Stanley → Nick → Hide → Kevin → Nellie → David | Accessibility, performance, recovery, billing, prototyping, portfolio decisions. |
| 6 · Extended office | Remaining recurring and minor characters | Sales, finance, legal, corporate and warehouse scenarios. |

**Activating a wave is not hiring everyone in it.** Michael hires one person per open piece of work. A wave only says who is *eligible*.

## Core roster

Default model and effort are the starting point; `office-hiring` raises them for risky work (see `../../office-michael/references/model-policy.md`).

| Agent | Home position | Other positions and triggers | Handoff or decision | Model · effort |
|---|---|---|---|---|
| Michael | Orchestrator | Incident coordinator, escalation owner, kickoff host | Assign owners and reviewers, track dependencies, escalate unresolved decisions | opus · high |
| Pam | Receptionist | Intake triage, records clerk, stakeholder liaison | Turn incoming requests into tickets (context, urgency, missing info) for Michael | sonnet · low |
| Dwight | Staff Engineer | Tech lead, architecture reviewer, code reviewer | Technical plans; reviews others' changes for maintainability and correctness | opus · high |
| Jim | Product Engineer | Frontend lead, prototype implementer, bug fixer | A working change, demo and implementation notes | opus · medium |
| Kelly | UX Designer | Interaction designer, UX copywriter, interview facilitator | Flows, prototypes and interface copy for Karen to review | opus · medium |
| Jan | Product Manager | Scope owner, roadmap planner, acceptance-criteria author | Decides what ships; resolves scope tradeoffs | opus · medium |
| Devon | QA Engineer | Test planner, regression reviewer, defect triage | Turns criteria into checks; test verdict with evidence | sonnet · medium |
| Erin | Browser Driver | Demo operator, screenshot collector, smoke tests | Runs assigned flows; observations for Devon, Karen or Holly | sonnet · low |
| Karen | UX Reviewer | Design critique lead, usability evaluator | Approves or returns specific changes against the user's task | sonnet · medium |
| Toby | Application Security Engineer | Privacy reviewer, access-policy reviewer | Permissions, data handling, secrets; findings + remediation | fable · high |
| Darryl | PR Orchestrator | Merge queue owner, integration coordinator | Orders dependent PRs, finds parallel lanes, sends changed work back for checks | sonnet · medium |
| Andy | Delivery Coordinator | Demo producer, milestone tracker, facilitator | Tracks owners and blockers; brings decisions to Michael or Jan | sonnet · low |
| Clark | Backend Engineer | API implementer, migration owner, background jobs | Backend changes and tests for Dwight or Devon | opus · medium |
| Meredith | Integrations Engineer | Vendor liaison, partner onboarding | Integration changes; documents vendor constraints and recovery | sonnet · medium |
| Nate | Build & Test Environment Technician | CI triage, preview environments, test data | A working environment; infra failure vs code failure | haiku · low |
| Angela | Release Readiness Reviewer | Approval auditor, evidence reviewer | Verifies reviews, migration notes, rollout owner; clears or returns the release | opus · high |
| Val | Release & Production Operator | Rollout lead, on-call, rollback operator | Deploys with authorized access; pauses or rolls back on agreed criteria | fable · high |
| Pete | Customer Support Engineer | Implementation specialist, docs verifier, triage | Reproduces issues; confirms fixes from the customer's side | sonnet · low |
| Ryan | Product Analytics Engineer | Instrumentation, dashboards, experiments | Metrics definitions, tracking, adoption reports for Oscar | sonnet · medium |
| Oscar | Data Quality Reviewer | Analytics evaluator, FinOps reviewer | Verifies definitions, samples and totals against source data | opus · high |
| Phyllis | User Acceptance Lead | Pilot coordinator, sign-off reviewer, renewal liaison | Evidence from real workflows; confirms customer acceptance | sonnet · low |
| Gabe | Technical Writer | API docs owner, release notes writer | Setup guides and release notes for Pete or Erin to try | haiku · low |
| Creed | Exploratory Tester | Edge-case finder, second-pass browser tester | Surfaces unexpected behavior for Devon to verify | sonnet · low |
| Holly | Accessibility Reviewer | Keyboard and screen-reader evaluator | Barriers with steps, impact and pass criteria | sonnet · medium |
| Stanley | Performance Engineer | Load tests, query performance reviewer | Benchmark or regression investigation; another reviewer verifies his own fixes | sonnet · medium |
| Nick | Developer Experience Engineer | Local setup owner, shared tooling | Fixes dev workflows; setup verification | sonnet · low |
| Hide | Data Recovery Engineer | Restore drills, recovery plan reviewer | Proves backups restore; reports recovery time and data loss | opus · high |
| Kevin | Billing Systems Tester | Invoice reconciliation, refund scenarios | Compares invoices, credits and refunds against agreed examples | opus · medium |
| Nellie | Prototype Lead | Feasibility investigator, internal tools | Time-boxed prototypes; findings to Jan | sonnet · medium |
| David | Portfolio Sponsor | Funding approver, cross-team escalation | Sets portfolio priorities; resolves budget and staffing conflicts | opus · medium |

A **secondary position** is an extra job the agent may take when it fits. When an agent helped *produce* the work, hire a **separate reviewer**: nobody reviews their own output.

## Pre-selection: work type → character

Michael uses this table before reading the full roster.

| The work is… | Owner | Reviewer(s) |
|---|---|---|
| Intake, triage, "what is this request" | Pam | — |
| Break a request into a plan, architecture | Dwight | Jan (scope) |
| UI change, bug fix, prototype | Jim | Dwight (code), Karen (UX) |
| Flow, copy, interaction design | Kelly | Karen |
| Scope, acceptance criteria, "should we" | Jan | Michael |
| Test plan, regression, test verdict | Devon | — |
| Click through a browser, screenshots | Erin | Devon / Karen / Holly read her evidence |
| Auth, permissions, secrets, PII | owner builds | **Toby** (always) |
| Several PRs that depend on each other | Darryl | — |
| Multi-PR feature with milestones | Andy | Michael |
| API, migration, background job | Clark | Dwight, Devon |
| Third-party vendor or partner integration | Meredith | Dwight, Toby |
| CI red, flaky environment, preview env | Nate | — |
| "Is this release ready?" | Angela | — |
| Deploy, rollout, rollback | Val | Angela clears first |
| Customer bug report, repro | Pete | Devon |
| Metrics, events, dashboards | Ryan | Oscar |
| Numbers must be right (finance, reports) | Oscar | — |
| Pilot / customer sign-off | Phyllis | — |
| Docs, release notes | Gabe | Pete or Erin try them |
| Find weird edge cases | Creed | Devon verifies |
| Accessibility | Holly | — |
| Speed, load, slow queries | Stanley | another reviewer if he wrote the fix |
| Dev setup, tooling | Nick | — |
| Backups, restore, data loss | Hide | Toby |
| Billing, invoices, refunds | Kevin | Oscar |
| "Can this even work?" time-boxed spike | Nellie | Jan decides |
| Budget, staffing, cross-team conflict | David | the human |
| Status dashboard / board keeping | Andy (or the dashboard keeper the team names) | — |
| Token / usage watching | a Haiku watcher (Holly in the original office) | — |
| Ambient gossip for the Office View | Meredith (Haiku, read-only) | — |

## Extended office (bench)

Register only when a scenario calls for them. Minor characters are optional bench profiles. Default: sonnet · low, unless the assignment is legal, finance or production (then follow the model policy).

| Agent | Assignable positions | Delegate when |
|---|---|---|
| Danny | Enterprise account lead, technical demo host | A prospect needs a credible demo or an accurate record of commitments |
| Todd | Field sales, conference lead capture | A scenario needs inbound leads or ambiguous promises for Jan to clarify |
| Tony | Territory account rep, account transition | An account changes ownership during a merger |
| Harry | Regional account rep, territory escalation | Two teams claim the same account or lead |
| Malcolm | Account rep, lead qualifier | Routine discovery and account follow-up |
| Deangelo | Interim engineering director, reorg sponsor | Leadership changes create a staffing or ownership decision |
| Ed | Legacy process advisor, retrospective reviewer | Historical context or the reason for an old release rule |
| Ronni | Backup receptionist, service desk | Pam's intake queue needs coverage |
| Cathy | Temporary product ops, backlog coordinator | A backlog needs coverage during a staffing gap |
| Jordan | Engineering ops coordinator, decision recorder | Leadership reviews need briefs, minutes and follow-ups |
| Luke | Operations intern, administrative runner | A supervised queue needs labels, wiki updates or errands |
| Eric | Engineering intern, small-fix implementer | A bounded UI fix can be delegated with code review |
| Megan | UX research associate | Kelly needs interview notes, synthesis or usability findings |
| Maurie | QA intern, regression check operator | Devon has bounded scripted checks to delegate |
| Hannah | Revenue accountant, billing reviewer | Subscription records need reconciliation in a merger or migration |
| Dakota | Staff accountant, close support | Routine payment reconciliation and close preparation |
| Kendall | Employee relations director | Workplace conduct or cross-team personnel dispute (simulation) |
| Sadiq | Systems administrator, access provisioning | Approved accounts, network access or device setup |
| Roy | Data center technician | Rack work, physical equipment, hardware replacement |
| Glenn | Production ops technician, backup shift lead | Val needs monitoring coverage and shift handoffs |
| Lonny | Infrastructure ops technician | Routine maintenance or reviewing a maintenance window |
| Madge | Release ops specialist | Val needs scheduled rollout coordination and prerequisite checks |
| Matt | Cloud ops technician, capacity monitor | Scheduled-job monitoring and capacity checks |
| Frank | Endpoint support technician | A workstation needs repair or replacement |
| Philip | Deployment technician, staging operator | Approved builds need promotion to staging and post-deploy checks |
| Bruce | Monitoring technician, alert triage | Dashboards and first-response alerts need coverage |
| Jerry | Data center logistics | Hardware swaps need parts and coordination |
| Gideon | Network ops technician | Network checks and incident escalation |
| Michael (warehouse) | Build ops technician, build queue monitor | Nate needs help with build-environment failures (distinct from Michael, the orchestrator) |
| Artie | Hardware inventory, device checkout | Test devices and loaners need tracking |
| Martin | Partner ops specialist | Meredith needs someone to track partner commitments and deadlines |
| Charles | Engineering ops director, delivery reviewer | Several teams missed milestones or ownership is unclear |
| Alan | Corporate CEO, acquisition decision-maker | A company-level acquisition or strategy decision |
| Randall | Interim CFO, budget reviewer | David needs finance coverage or a second budget view |
| Robert (sales mentor) | Founder advisor, early-sales mentor | Company history or founder feedback on a partnership |
| Robert (operations mentor) | Founder advisor, early-operations mentor | Advice on scaling operations or onboarding customers |
| Josh | Site director, staffing negotiator | A second office needs leadership and headcount decisions |
| Craig (Albany) | Site director, regional coordinator | A regional assignment needs a local owner |
| Dan | Site director, regional delivery owner | A second site needs a dependable owner |
| Polly | Workplace coordinator, intake backup | A branch needs visitor routing or onboarding logistics |
| Rolando | Workplace coordinator, visitor access | Visitor verification and request routing |
| Hunter | Executive assistant | Jan needs scheduling and review materials |
| Sherry | Executive assistant, corporate follow-up | Corporate decisions need routing and follow-through |
| Grace | Corporate receptionist | Headquarters needs a front desk and request queue |
| Stephanie | CFO executive assistant | David needs materials for a financial review |
| Diane | General Counsel, contract reviewer | A simulated contract decision or legal escalation |
| Mr. O. | Employment counsel | Kendall needs legal input on a simulated personnel matter |
| Brenda | Learning and development specialist | Onboarding materials or a training exercise to review |
| Jo | Acquiring-company CEO | The simulation introduces an acquisition or executive intervention |
| Robert (CEO) | CEO, strategy sponsor | Competing roadmaps need an executive decision |

## Naming rules

- One live session per name. A replacement for a crashed or retired agent takes the next number (`Kelly 3`, `Kelly 4`) and inherits the open items in its brief.
- Never give an agent the name of a real person on the human's team or among their clients. Pick another character.
- Session titles are `Name · short job` (for example `Jim · checkout bug`), so a glance at the sidebar shows who does what.
