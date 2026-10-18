# Worklog

## 2026-10-18 — Repository initialization

### Requested scope

Initialize the repository only. Do not begin product implementation.

### Completed

- Initialized Git with branch `main`.
- Added `.gitignore`.
- Added placeholder-only `.env.example`.
- Added a minimal project `README.md`.
- Did not create a commit.

### Correction

An initial workflow draft was created too early. After explicit user approval, all draft workflow and example files were removed. The repository returned to initialization-only scope.

### Verification

- Git reported `No commits yet on main`.
- Only `.env.example`, `.gitignore`, and `README.md` remained before the documentation layer was added.

## 2026-10-18 — Markdown orchestration foundation

### Requested scope

Store all plans and durable project context in Markdown and prepare for highly agentic orchestration without starting implementation.

### Added

- Root agent operating contract
- Project context
- Documentation index
- Proposed architecture
- Phased roadmap
- Task queue
- Architecture decision record
- Verification strategy
- Worklog

### Verification performed

- All relative Markdown links resolved successfully.
- Secret-pattern scan found no API keys or bearer tokens.
- Git remains on `main` with no commits.
- Repository contains no product workflow or application implementation.

### Current boundary

No product code, n8n workflow, API call, credential setup, or application implementation is authorized yet.

## 2026-10-18 — Orchestration research gate started

### Requested scope

Use multiple independent research agents to understand and correct the project plan, keep all durable state in Markdown, and prepare implementation without exposing secrets.

### Current constraint

No `.env` file or usable local credential inventory exists in the repository. Live API calls and n8n credential setup remain blocked until credentials are supplied through approved local files or managed n8n credentials.

### Orchestration plan

- Coordinator audits and integrates results.
- Read-only subagents investigate n8n feasibility, API contracts, evidence validation, scope/demo requirements, and security.
- Agents report findings; only the coordinator updates shared Markdown state.

## 2026-10-18 — Five-agent audit integrated; architecture corrected

### Agents dispatched (read-only, Markdown-context-required)

- subagent-n8n (P1-00a): n8n feasibility
- subagent-apis (P1-00b): Nebius/Tavily contracts
- subagent-evidence (P1-00c): evidence design audit
- subagent-scope (P1-00d): hackathon scope/demo
- subagent-security (P1-00e): security/safety audit

### Key corrections applied

- **ADR-006 (new):** Async report delivery — held form connections drop ~60–120 s; intake form acks with `job_id`; report via retrieval form + fixed operator email. Intake form collects NO user email (spam relay).
- **ADR-007 (new):** Manual retry loops — `retryOnFail` is disabled under `Continue` error handling (n8n staff-confirmed); bounded 3-attempt loops with `Retry-After` honor.
- **ADR-004 (refined):** Monotonic downgrade ladder resolved; per-source quote membership; two-tier normalization (exact → normalized).
- **ADR-005 (calibrated):** maxRounds=1; 3–5 queries; ≤20-URL extract batches; deterministic counters; retrievable-only follow-ups.
- **ADR-008/009/010 (new):** managed credentials + neutral naming; input/budget/privacy caps; report schema v1 + deterministic `requires_review`.
- **ADR-011 (new):** orchestration authorized; ADR-002 superseded.
- New file `docs/SECURITY.md`; `.gitignore` expanded (pem/key/har/credentials patterns).

### Facts confirmed by research

- MiniMax-M3 confirmed in Token Factory catalog ($0.30/M in, $1.20/M out, thinking-on-by-default — token budget must cover reasoning).
- Tavily Extract `failed_results` must be checked on HTTP 200; 432/433 = plan exhaustion = fail closed, never retry.
- Deadline ambiguity verified: official 17:30 vs Luma 18:30 → submit ~17:00.
- n8n Code nodes: pure JS only, no npm/schema libs, no credential access.
- Data Tables: no JSON type, no unique constraints, ~200 MiB cap, no Code-node access.
- Error Trigger: production executions only; error workflow must be published.

### Blockers (user action needed)

- `NEBIUS_API_KEY`, `TAVILY_API_KEY` → `.env` (ignored); n8n Cloud access; Gmail OAuth.
- Deadline, partner-challenge names, submission channel → organizer.

## 2026-10-18 — Live API capability probes passed

### Credentials received

- `NEBIUS_API_KEY`, `TAVILY_API_KEY` written to git-ignored `.env` (mode 600). n8n Cloud instance confirmed at `yesildal.app.n8n.cloud`; Gmail OAuth reported ready; organizer confirmed deadline **18:30** (internal target ~18:00).

### Probe results

| Probe | Result |
|---|---|
| N-1 public catalog | 200; MiniMax-M3 listed |
| N-2 `GET /v1/models` (keyed) | 200; 28 models; M3 present → auth OK |
| N-3a `response_format: json_object` | 200; valid parsed JSON, `finish_reason:stop` |
| N-3b `response_format: json_schema` | 200; strict schema-conformant `{"answer":12}` → **use json_schema everywhere** |
| T-1 Tavily Search basic | 200; 1.58 s; 3 results; 1 credit; key tier `tvly-dev-*` (100 RPM) |
| T-2 Tavily Extract mixed batch | 200; 1 success (12 KB markdown) + 1 `failed_results` entry — failure path confirmed on HTTP 200 |
| T-3 `GET /usage` | 200; plan "Researcher", 1000-credit limit, counters functional |

### Decisions updated

- Structured output: **RESOLVED** — `json_schema` confirmed on MiniMax-M3 (ARCHITECTURE.md).
- Deadline: organizer-confirmed 18:30; submit target ~18:00 (PROJECT.md, ROADMAP.md).
- TASKS P1-01..P1-04 → completed; P1-05..P1-07 remain blocked on n8n-side access (API key or session).

## 2026-10-18 — Live build: three workflows deployed and verified end-to-end

### Credentials received

- `N8N_API_KEY` → ignored `.env`. Two managed `httpHeaderAuth` credentials created via public API under neutral names: `vendorproof-nebius` (`myiguujEgpIHCaZo`), `vendorproof-tavily` (`rXTgwF8fdkiVBpCJ`).

### n8n resources created (via public REST API)

| Resource | ID |
|---|---|
| Data Table `vendor_assessments` | `neu26q9Q8yfqlkxS` |
| Data Table `workflow_failures` | `PzL8Rm0qXrhtrVYH` |
| Workflow A Vendor Assessment | `akfIa1WSWLxS5BBS` — **published** |
| Workflow B Report Retrieval | `Pgw0RSDOS2fjozCI` — **published** |
| Workflow C Error Handler | `3BnYnAyxE7pHIr2J` — **published**, wired via `settings.errorWorkflow` on A+B |

Exports in repo: `n8n/vendor-assessment.json` (30 nodes), `n8n/report-retrieval.json` (5), `n8n/error-handler.json` (4). No secrets in exports.

### Live verification results

| Test | Result |
|---|---|
| E2E assessment (exec 5) | **success** — full pipeline: plan → 4 searches → extract → verify → validate → persist. ~2 model calls, 4 searches, 1 extract |
| Report quality | 12 findings: 8 `supported` (verbatim quotes), 4 `insufficient_evidence` — honest degrade, no fabrication |
| Validator live | downgrades detected → `review_reasons:[downgrade_threshold]` → `requires_review:true` |
| Dedupe (exec 6) | **pass** — identical request: 5 nodes only, zero API calls, `cache_hit:true` |
| Retrieval (exec 8) | **pass** — form → `formWaitingUrl` → full HTML report rendered |
| Error workflow | published, wired to A and B |

### Runtime bugs found and fixed

1. `responseMode: 'formSubmitted'` invalid → `'onReceived'`; ack text lives in `options.formSubmittedText` (verified in n8n source).
2. Form output keys = `fieldLabel` (`"Company"`, `"Research objective"`), not `fieldName` → Normalize reads both.
3. n8n Code sandbox lacks the `URL` global → silent catch emptied URL lists. Replaced with regex `^https?:\/\/` + string normalization (incl. validator `norm()`).
4. Gmail nodes can't publish without OAuth cred → `disabled:true` until user completes OAuth in UI; email recipient placeholder `OPERATOR@EXAMPLE.COM` must be set.
5. `PUT /activate` requires `Content-Type: application/json` body.

### Architecture notes (update to ARCHITECTURE)

- Retry = `retryOnFail:true` + default `Stop Workflow` (the working combo per ADR-007; manual loops only if `Continue` is ever used).
- Zombie protection by design: dedupe Get filters `status=completed`, so abandoned `processing` rows never block re-runs (P4-02).
- This instance uses the publish model — error workflow needed a published version before wiring.

### Post-deploy hardening (same session)

- **Error path verified live:** invalid form input → execution failed → Error Trigger fired → row in `workflow_failures` (table logging works; Gmail alert still pending OAuth).
- **Validator fixture tests:** `tests/test-validator.js` runs `Validate R1` jsCode under mocked n8n globals — **10/10 pass** (T1, T3, T5, T6, T7, T9, T10, T11, T13, T20). Found + fixed: error-handler node-name extraction (`err.node` can be a string).
- P2-02 → completed.

### Remaining blockers (user)

- **Gmail OAuth credential** must be created in n8n UI (browser flow), then enable the 2 disabled Gmail nodes + set operator email.
- Rotate the API keys shared in chat after the hackathon.

## Entry template

```md
## YYYY-MM-DD — Short title

### Requested scope

### Files changed

### Decisions

### Verification performed

### Failures or blockers

### Follow-up tasks
```
