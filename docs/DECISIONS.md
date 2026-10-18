# Architecture Decision Record

## ADR-001 — Markdown is project memory

- Status: accepted
- Date: 2026-10-18

### Decision

All durable project context, plans, task state, architecture choices, verification criteria, and execution outcomes are stored in repository Markdown files.

### Rationale

The project will use agentic orchestration. Agents need shared, reviewable context that survives chat boundaries and prevents silent assumptions.

### Consequences

- Every agent has a mandatory reading order.
- Chat-only decisions are incomplete until written to the repository.
- Documentation updates are part of task completion.

## ADR-002 — Implementation is paused after initialization

- Status: superseded by ADR-011
- Date: 2026-10-18

### Decision

Do not create product code, n8n workflow exports, fixtures, or live integrations until the user explicitly starts the implementation/orchestration phase.

### Rationale

The user requested a clean initialization stage first, then explicitly authorized orchestration research and build preparation.

## ADR-003 — Current preferred runtime is n8n Cloud-native

- Status: provisionally accepted — pending capability probes C-1..C-10
- Date: 2026-10-18

### Decision

Prefer n8n Cloud for interface, orchestration, bounded agent control, persistence, notifications, and failure handling. Call Nebius and Tavily through managed credentials via HTTP Request nodes (portable; no community-node dependency).

### Rationale

Strengthens the Best Use of n8n submission; avoids deploying a separate service. Five research audits confirmed feasibility with bounded-work constraints.

### Risks (expanded by P1-00a)

- Held form connections drop ~60–120 s → resolved by ADR-006.
- `retryOnFail` + `Continue` combo silently disables retries → resolved by ADR-007.
- Code nodes are pure JS, no schema libraries → validator is hand-rolled.
- Cloud RAM 640 MiB; Data Table cell-size/type/unique constraints; Form/IF version drift — all require probes.
- Cookbook `deepagents` cannot be claimed; we describe an n8n-native bounded loop.

## ADR-004 — Evidence validation must fail closed

- Status: accepted (refined — resolves "downgraded or fails" ambiguity)
- Date: 2026-10-18

### Decision

A finding may be `supported` only when (a) its normalized `source_url` exists in the *successful* extraction set, and (b) its quoted `evidence` is found in the **cited source's own content** via two-tier matching (exact after NFC+whitespace-collapse; then normalized quote/dash canonicalization). The validator only ever downgrades — it never upgrades.

### Refined ladder (replaces ambiguous wording)

- Schema-invalid report → whole run fails closed (`invalid_schema`).
- Schema-valid with citation failures → per-finding downgrade with `downgrade_reason`.
- `downgraded ≥ 2` or ≥50% material-topic insufficient → `requires_review`/`degraded`.

### Rationale

Citation correctness is the primary differentiator; per-source membership closes the wrong-source-quoting hole; two-tier normalization prevents unfair downgrades on Unicode/whitespace differences.

### Known limitation

Membership proves the quote exists, not semantic entailment (test T19). Mitigation: manual audit protocol + optional entailment-judge variant.

## ADR-005 — Research autonomy is bounded

- Status: accepted (limits calibrated by API research)
- Date: 2026-10-18

### Decision

The model chooses research questions and follow-up queries; deterministic orchestration enforces all limits. Loop guard is `state.round < maxRounds` evaluated in a Code/IF node — never model-decided.

### Calibrated limits

- 3–5 initial queries, `search_depth=basic`, `max_results=5`, `auto_parameters` disabled/pinned
- `maxRounds=1`, flag-gated (follow-up adds one search+extract+verify pass)
- ≤20 URLs per extract batch (hard API cap); prefer 2×≤10 batches
- Manual retry loops: ≤3 attempts, Wait 2–5 s, honor `Retry-After`; zero retries on 401/432/433
- Deterministic call/budget counters per run; extracted content truncated ~4–8 KB/source
- Follow-up eligibility restricted to `url_not_in_extraction_set` downgrades; queries deduped vs prior rounds

## ADR-006 — Async report delivery over synchronous form wait

- Status: accepted
- Date: 2026-10-18

### Decision

The intake Form Trigger responds immediately ("Form Is Submitted") with an ack containing `job_id`. The report is delivered via (a) a separate Report Retrieval form (job_id → Data Table Get → Show Text, fast enough for `lastNode`) and (b) Gmail to the fixed operator address when `requires_review`. The intake form collects **no user email** (open-form spam relay — `SECURITY.md`).

### Rationale

n8n research established held form/webhook connections drop at ~60–120 s while research takes 2–8 min. A retrieval form is a single table read — safe to hold synchronously.

### Consequences

- User-facing UX: "Assessment started. Job ID: {id}. Use the report lookup form."
- Optional `fast_mode` demo path (<~90 s, no follow-up) may show inline result — labeled honestly.
- Gmail recipients are fixed operators only.

## ADR-007 — Manual retry loops, not node retries

- Status: accepted
- Date: 2026-10-18

### Decision

HTTP nodes for Nebius/Tavily use `On Error: Continue (using error output)` + IF + Wait + attempt-counter + loop-back (max 3, Wait 2–5 s, `Retry-After` honored on 429). `retryOnFail` is only ever combined with `Stop Workflow` for genuinely fatal calls handled by the Error Trigger.

### Rationale

n8n staff-confirmed: `retryOnFail` is ignored when `On Error` is a `Continue*` option. Caps: 5 tries / 5000 ms wait. Manual loops give bounded retry + graceful failure routing.

## ADR-008 — Managed credentials only, neutral naming

- Status: accepted
- Date: 2026-10-18

### Decision

All auth via n8n managed credentials: Header Auth for Nebius and Tavily (Bearer headers), Gmail OAuth2. Neutral names `vendorproof-{nebius,tavily,gmail}` because credential names/IDs export with workflows. No literal auth headers, query-param keys, n8n Variables, or Code-node credential workarounds.

## ADR-009 — Input, budget, and privacy caps

- Status: accepted
- Date: 2026-10-18

### Decision

- Input caps: company ≤200 chars, objective ≤2,000 chars, trim + whitespace-collapse before fingerprinting (SHA-256 of normalized company+objective+schema version).
- Per-run deterministic counters cap searches, extracted URLs, model calls.
- No user-supplied email field. Model context contains only company+objective+extracted passages (treated as untrusted data). `workflow_failures` stores normalized diagnostics only.
- `processing` rows older than a TTL reconcile to `failed` (zombie-job guard); the Error Workflow cannot self-reference.

## ADR-010 — Report schema v1 + deterministic `requires_review`

- Status: accepted
- Date: 2026-10-18

### Decision

Adopt the extended finding schema (`source_class`, `validation` block) and report envelope (`requires_review`, `review_reasons`, `trace`, `usage`, `validator_version`, `model`). `requires_review` triggers: any `contradicted`; normalized-only evidence match; `downgraded ≥ 2`; ≥50% material-topic insufficient; `compound_claim_suspected`. Severity floor: `contradicted` ⇒ ≥`medium` with `severity_adjusted` flag. Every `findings[]` item is validated — no materiality escape hatch.

## ADR-011 — Orchestration and build authorized

- Status: accepted
- Date: 2026-10-18

### Decision

The user authorized multi-agent orchestration to understand the problem, fix the plan, and finish the project. Research audits (P1-00a–e) completed; findings integrated. Implementation proceeds under capability-gated sequencing: probes first, then evidence kernel, then workflows. Remaining hard blockers: absent credentials (`NEBIUS_API_KEY`, `TAVILY_API_KEY`, n8n Cloud, Gmail OAuth) and organizer confirmations (deadline, partner-challenge names, submission channel).

## ADR template

```md
## ADR-NNN — Title

- Status: proposed | accepted | superseded | rejected
- Date: YYYY-MM-DD

### Context

### Decision

### Rationale

### Consequences

### Verification
```
