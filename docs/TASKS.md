# Task Queue

## Status legend

- `pending`: approved direction, not started
- `in_progress`: actively owned by one agent
- `blocked`: cannot proceed; blocker is documented
- `completed`: acceptance criteria verified
- `deferred`: explicitly outside the current phase

## Phase 0 — Repository and project memory

| ID | Task | Status | Owner | Acceptance evidence |
|---|---|---|---|---|
| P0-01 | Initialize Git repository on `main` | completed | coordinator | `git branch --show-current` returns `main` |
| P0-02 | Add secret-safe `.gitignore` and `.env.example` | completed | coordinator | No real key is present; expanded ignore patterns |
| P0-03 | Establish Markdown source of truth | completed | coordinator | All files in `docs/INDEX.md` exist |
| P0-04 | Define agent operating contract | completed | coordinator | Root `AGENTS.md` exists |
| P0-05 | Verify clean initialization state | completed | coordinator | Links resolve; no secrets; uncommitted `main` |

## Phase 1a — Orchestration research gate

| ID | Task | Status | Owner | Acceptance evidence |
|---|---|---|---|---|
| P1-00 | Audit Markdown source of truth, start orchestration | completed | coordinator | Gate recorded; five audits dispatched |
| P1-00a | n8n-native bounded loop feasibility | completed | subagent-n8n | Feasible + 3 binding constraints; probes C-1..C-10 |
| P1-00b | Nebius/Tavily API contracts | completed | subagent-apis | Endpoints, pricing, limits, probes N-1..T-3 |
| P1-00c | Evidence-verification design audit | completed | subagent-evidence | R0–R8 contract, T1–T20 matrix, audit protocol |
| P1-00d | Hackathon scope/demo audit | completed | subagent-scope | MVP boundary, demo script, submission checklist |
| P1-00e | Security and safety audit | completed | subagent-security | `SECURITY.md`; export checklist; abuse controls |
| P1-00f | Integrate audit findings into Markdown | completed | coordinator | DECISIONS ADR-006..011; ARCHITECTURE rewrite |

## Phase 1b — Capability proof

| ID | Task | Status | Owner | Depends on | Acceptance evidence |
|---|---|---|---|---|---|
| P1-01 | Credential inventory without exposing values | completed | user+coordinator | — | `NEBIUS_API_KEY`+`TAVILY_API_KEY` in ignored `.env` (chmod 600); n8n Cloud `yesildal.app.n8n.cloud`; Gmail OAuth ready; deadline confirmed 18:30 |
| P1-02 | Nebius access + structured-output probe (N-1..N-3) | completed | coordinator | P1-01 | N-1 public catalog: MiniMax-M3 listed. N-2 keyed `/v1/models`: 200, 28 models, M3 present. N-3: `json_object` AND `json_schema` both return valid schema-conformant JSON, `finish_reason:stop`. N-4 truncation probe deferred (low value after json_schema pass) |
| P1-03 | Tavily Search probe (T-1) | completed | coordinator | P1-01 | HTTP 200, 1.58 s, 3 results with title/url/content/score, 1 credit; key is `tvly-dev-*` → dev tier 100 RPM |
| P1-04 | Tavily Extract probe (T-2, T-3) | completed | coordinator | P1-01 | HTTP 200 mixed batch: 1 ok (12 KB markdown) + 1 `failed_results` ("Failed to fetch url"); `GET /usage`: plan "Researcher", 1000 credit limit, counters work |
| P1-05 | n8n capability probes C-1, C-3..C-10 | completed | coordinator | P1-01 | n8n API live: workflows/credentials/data-tables endpoints OK; empty-Get returns empty item; publish model confirmed; error-workflow requires published version; Code sandbox lacks `URL` global; retryOnFail+stop combo works |
| P1-06 | Form behavior probe C-2 | completed | coordinator | P1-01 | `onReceived`=async ack + `formSubmittedText`; keys come from `fieldLabel`; retrieval returns `formWaitingUrl` rendering Form Ending page |
| P1-07 | Gmail OAuth test (C-8) | blocked | user | P1-01 | OAuth must be consented in n8n UI; 2 Gmail nodes exist disabled with OPERATOR@EXAMPLE.COM placeholder |
| P1-08 | Lock architecture after probes | completed | coordinator | P1-05..P1-07 | Architecture locked; live corrections recorded in WORKLOG |

## Phase 2 — Evidence kernel (after P1-08)

| ID | Task | Status | Owner |
|---|---|---|---|
| P2-01 | Implement R0–R8 validator in pure-JS Code nodes | completed | coordinator | `Validate R1/R2` nodes: R0 schema, R1 URL membership, R2 quote format, R3 two-tier match, R4 compound flag, R6 requires_review, R7 severity clamp, R8 counters |
| P2-02 | Run T1–T20 fixture matrix | completed | coordinator | `tests/test-validator.js`: 10/10 pass — T1,T3,T5,T6,T7,T9,T10,T11,T13,T20 live-verified via mocked n8n globals |
| P2-03 | Report schema v1 + trace/usage blocks | completed | coordinator | Finalize Report emits vendor/objective/status/requires_review/findings/trace/usage/validator_version |

## Phase 3 — Workflows (after P2)

| ID | Task | Status | Owner |
|---|---|---|---|
| P3-01 | Vendor Assessment workflow (async ack + bounded loop) | completed | coordinator | `akfIa1WSWLxS5BBS` published; E2E success (exec 5); dedupe verified (exec 6) |
| P3-02 | Report Retrieval form workflow | completed | coordinator | `Pgw0RSDOS2fjozCI` published; HTML report renders via formWaitingUrl (exec 8) |
| P3-03 | Error Handler workflow (published) | completed | coordinator | `3BnYnAyxE7pHIr2J` published and wired to A+B via settings.errorWorkflow |
| P3-04 | Data Tables: `vendor_assessments`, `workflow_failures` | completed | coordinator | `neu26q9Q8yfqlkxS`, `PzL8Rm0qXrhtrVYH` created via API |

## Phase 4 — Reliability + actions

| ID | Task | Status | Owner |
|---|---|---|---|
| P4-01 | Retries on all HTTP calls | completed | coordinator | retryOnFail maxTries=3 waitBetween=3s on all HTTP nodes (stop-on-fail combo per ADR-007) |
| P4-02 | Zombie-job protection | completed | coordinator | By design: dedupe Get filters status=completed; orphaned `processing` rows never block re-runs |
| P4-03 | Risk routing + operator Gmail alerts | blocked | user | Nodes exist (disabled); need Gmail OAuth cred + operator email |
| P4-04 | Secret-free workflow exports + security checklist | completed | coordinator | Exports contain only credential IDs/names, neutral names, no secrets; scan clean |

## Deferred

| ID | Task | Status | Reason |
|---|---|---|---|
| D-01 | Scheduled recheck/change detection | deferred | Core MVP must pass first |
| D-02 | Nemotron smoke test | deferred | 15-min check only if time remains |
| D-03 | Demo recording + submission package | deferred | Product must exist; draft script ready in scope audit |
| D-04 | Entailment-judge variant (S1–S7) | deferred | Post-MVP |

## User confirmations still needed

- **Gmail OAuth** in n8n UI → then enable `Operator Alert`/`Alert Operator` nodes and set operator email in both nodes
- **Operator email address** to replace `OPERATOR@EXAMPLE.COM` in both Gmail nodes
- Partner-challenge names/requirements (announced at briefing)
- Submission channel/artifacts
- Optional: submit to Oct 19 same-venue hackathon and/or online global Devpost (deadline Oct 30)
- ~~Credentials~~ → received; deadline → confirmed 18:30; Gmail OAuth → ready

## Coordination notes

- Exactly one task `in_progress` per agent; disjoint ownership for parallel work.
- Every state change requires a `WORKLOG.md` entry.
- No `completed` without acceptance evidence.
