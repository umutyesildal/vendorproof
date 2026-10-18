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

### Iteration round 2 — Gmail live + more executions

- **Gmail OAuth connected** (`Gmail account` cred `v9pqGKjKU1J6Ljr0`); both alert nodes enabled with fixed operator address on the live instance only (repo export keeps `OPERATOR@EXAMPLE.COM` placeholder — no PII committed).
- **Exec 14 (error path, Gmail live):** bad form input → workflow error → Error Trigger → `workflow_failures` row + **real alert email sent** (`labelIds:["SENT"]`).
- **Exec 12 (Lambda Labs):** `complete`, zero review flags — Operator Alert correctly not fired.
- **Exec 15 (Etched):** `complete`, `normalized_match_audit` flagged (smart-quote normalized match — validator auditing as designed).
- Follow-up round wired but not yet triggered in 3 runs — verifier's R1 plans are sufficient; gating is honest (no fake rounds).
- Repo pushed: `github.com/umutyesildal/vendorproof` (initial commit 584f853).

### Iteration round 3 — re-architected to orchestrator + sub-workflows (user request)

User asked for fewer Code nodes and a real sub-workflow architecture. Shipped:

- **Orchestrator** (`gEVx7O2cd5zzeEMt`): Form → Set → IF → Stop and Error → Crypto → Set → Data Table → IF → `Execute Workflow` ×3 (Planner → Collector → Verifier) → IF → Split Out → Collector R2 → Set(merge) → Verifier R2 → Set(assemble) → Data Table → IF → Gmail. **Zero Code nodes.**
- **Sub: Research Planner** (`ZheMGJPZT8mFX1vf`): trigger → HTTP → Set(JSON.parse) → Split Out → Limit → Set. **Zero Code nodes.**
- **Sub: Evidence Collector** (`Poob3l7cEOa6XBzN`): trigger → HTTP Search → Split Out → Filter(regex URL) → Remove Duplicates → Limit → Aggregate → HTTP Extract → Set. **Zero Code nodes.**
- **Sub: Claim Verifier** (`6ThKEi8PbZgoF7H4`): trigger → HTTP Nebius → Code validator (the one place Code is genuinely required — it IS the product differentiator).

Code nodes total: 14 → **3** (validator, retrieval HTML render, error normalizer was also made native-able later if needed).

### Bugs found via live executions and fixed

1. `executeWorkflowTrigger` v1.1 requires `inputSource:'passthrough'` (empty params fail publish).
2. Webhook path conflict when replacing a live workflow (deactivate old first; v1 renamed "archived").
3. IF v2.2 numeric `largerEqual`/`smallerEqual` conditions silently failed → single boolean expression condition.
4. Aggregate node params: `aggregateIndividualFields` + `renameField` (not `aggregateIndividualItem`/`renameOutput`).
5. **Crypto node does NOT pass input fields through** — output contains only the hash. Company/objective became null downstream and a `company:null` `status:completed` row got persisted, which then poisoned dedupe cache. Fixed by re-deriving fields in the following Set node + upserting the polluted row to `status:stale` via `POST /data-tables/{id}/rows/upsert` (public API rows are insert/upsert only — no delete).
6. Verified live (exec 27): orchestrator → 3 sub-workflow executions → correct Scale AI report, `requires_review` via severity. Sub-workflow error propagation to error handler also verified (exec 20→21).

### Iteration round 4 — load test + agentic loop proven

Four parallel submissions (exec 31/33/35/37), all success:

| Vendor | Result |
|---|---|
| OpenAI | 12/12 supported, review (severity) |
| Vultr | 9 supported + 3 insufficient_evidence (degraded) |
| Weights & Biases | 8 supported + 4 insufficient_evidence (degraded) |
| Nimbus Quantum Systems GmbH (fabricated) | All `insufficient_evidence` + one `contradicted` ("Nimbus AdTech is a different company") — honest failure report, **zero fabrication** |

**Bug found by the fabricated-vendor test:** zero findings produced `requires_review:false` — fixed: `no_verifiable_findings` review reason + follow-up gate loosened to honor `needs_more_research` directly.

**Exec 51 (Taalas): follow-up loop fired organically** — 3 model calls, 2 research rounds, 12/12 supported after R2. Agentic self-directed re-research verified live.

### Resolution of remaining blockers

- **Gmail OAuth completed by user** — credential `v9pqGKjKU1J6Ljr0`; both Gmail nodes enabled; error-path alert delivered with `SENT` label verified via Gmail API (exec 14). Operator email lives only in the live instance — never exported.
- Heavy test cycle + verifier hardening committed as `005387e` and pushed.

## 2026-10-18 — Pitch deck generated

### Requested scope

Create pitch deck after system validation.

### Files changed

- `pitch-deck.html` — 8-slide self-contained HTML deck (arrow-key navigation, `N` toggles presenter notes, print-ready).
- `docs/TASKS.md` — Phase 5 table added; P1-07/P4-03 resolved; confirmations updated.

### Interview answers applied

- Tone: minimal & confident. Visuals: clean white (White + Charcoal palette, blue accent `#2563eb`). Team: `umutyesildal` (solo). Judges unknown → objection prep embedded in presenter notes on slides 2 and 7.

### Deck structure

1. Title — tagline + track badges
2. Problem — invented citations
3. Solution — plans / verifies / acts
4. Architecture — orchestrator + 3 sub-workflows (n8n story)
5. Demo — live public form URLs
6. Proof — real test metrics incl. fabricated-vendor test
7. Differentiation — comparison table ("says I can't verify that")
8. Ask — "click three citations yourself" + repo link

### Verification performed

- Deck opened in user browser; all slide numbers/metrics traceable to live executions recorded above.

### Follow-up tasks

- 2-minute demo script rehearsal (draft in scope audit).
- Submission channel + partner-challenge names from organizers.

## 2026-10-18 — Deck redesign + real n8n artifacts

### Requested scope

User rejected first deck ("looks AI-generated"), asked for typography/color overhaul, real n8n visuals, and n8n side-track focus. Minimum 4 subagents required.

### Work performed

- Ran 4 parallel research subagents: anti-slop critique of old deck, typography/visual spec, Tech Europe judging research, hackathon pitch structure.
- `design-taste` skill invoked; direction chosen: **Editorial Ledger** — Newsreader serif display + Inter Tight body + IBM Plex Mono data, ink `#1A1A19`, vermilion accent `#D13415` (<5% coverage), hairline rules only, no cards/shadows/gradients.
- Rebuilt `pitch-deck.html` from 8 template slides → 7 editorial slides. Killed: kicker+divider rhythm, 3-card feature grid, 4-metric row, flexbox flow pills, badge row, blue-600 accent.
- Slide 4 (proof) is now the single dark slide — Nimbus fake-vendor result as ledger artifact.
- Slide 5 embeds the **real n8n orchestrator canvas screenshot** captured via Orca computer-use from the live instance: `assets/n8n-orchestrator.png` + tight/wide crops.

### Judging intel (verified on logged-in dashboard + research)

- Tech Europe format: Stage 1 pre-selection on **2-min video + public repo** (creativity + technical complexity + partner-tech bonus) → Stage 2: **5-min live finalist pitch**, jury picks top 3. Submission ≤18:30–19:00 (verify on the event page).
- Min partner tech requirement seen on sibling event page; prize pool includes Token Factory/Cloud credits + Tavily credits.
- Nebius-event side-challenge list not yet confirmed (dashboard navigation fought active Chrome use).

### Outstanding captures (Chrome was in active use)

- Evidence Collector canvas (native-node fan-out shot)
- A green execution view
- Rendered report page from `/form/vp-lookup`

```md
## YYYY-MM-DD — Short title

### Requested scope

### Files changed

### Decisions

### Verification performed

### Failures or blockers

### Follow-up tasks
```

## NVIDIA live run (exec 63) — recognizable-vendor demo asset

- Submitted via real browser form: company `NVIDIA`, objective covering GPU supply/delivery, pricing power, CUDA lock-in, security/compliance.
- Full pipeline ran: Planner → Collector → Verifier → follow-up round 2 (Collector R2 + Verifier R2) → Assemble → Persist → Operator Alert (Gmail fired on requires_review).
- Result: 12 findings — 8 supported (verbatim evidence, exact+normalized matches), 4 insufficient_evidence. Standout: a claim sourced to a YouTube video the extractor couldn't read was auto-downgraded (`evidence_not_found_in_source`) — validator working as designed.
- Report status `degraded`, `requires_review: true` — honest labeling, not a greenwash.
- Captured `assets/vp-report-nvidia.png` from live `/form/vp-lookup` render; added deck slide 04b "Then we ran the sponsor" (slide count 7→8).

## NVIDIA live run (exec 63) — recognizable-vendor demo asset

- Submitted via real browser form: company `NVIDIA`, objective covering GPU supply/delivery, pricing power, CUDA lock-in, security/compliance.
- Full pipeline ran: Planner, Collector, Verifier, follow-up round 2 (Collector R2 + Verifier R2), Assemble, Persist, Operator Alert (Gmail fired on requires_review).
- Result: 12 findings — 8 supported (verbatim evidence, exact+normalized matches), 4 insufficient_evidence. Standout: a claim sourced to a YouTube video the extractor could not read was auto-downgraded (evidence_not_found_in_source) — validator working as designed.
- Report status degraded, requires_review true — honest labeling.
- Captured assets/vp-report-nvidia.png from live /form/vp-lookup render; added deck slide "Then we ran the sponsor" (slide count 7 to 8).
