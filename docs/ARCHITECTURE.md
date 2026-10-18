# Planned Architecture

## Status

**Implemented and verified live (2026-10-18).** All three workflows are published on `yesildal.app.n8n.cloud`; the E2E assessment, dedupe cache hit, and report retrieval each passed with real API calls — see `docs/WORKLOG.md` for resource IDs and runtime corrections. The notes below remain the design reference.

## Live-verified corrections (runtime facts, supersede probe assumptions)

- Form Trigger async ack = `responseMode: 'onReceived'` + `options.formSubmittedText` (`'formSubmitted'` is invalid).
- Form output keys are the `fieldLabel` strings (`"Company"`, `"Research objective"`), not `fieldName`.
- n8n Code sandbox has **no `URL` global** — validate/normalize URLs with regex + string ops; never inside swallowing `try/catch`.
- Retrieval flow: `responseMode:'lastNode'` + `n8n-nodes-base.form` node (`operation:'completion'`, `respondWith:'showText'`, `responseText`) returns a `formWaitingUrl` that renders the report page.
- This instance uses the publish model: workflows must be published (`/activate`), and `settings.errorWorkflow` only accepts a published error workflow.
- Retries shipped as `retryOnFail:true` + default `Stop Workflow` — the combination where retries actually run (ADR-007).

## Verified feasibility verdict

The n8n Cloud-native direction is **feasible**, subject to three binding constraints (P1-00a research):

1. **The intake form cannot synchronously wait for a research run.** `lastNode`/"Workflow Finishes" holds the HTTP connection ~60–120 s before proxies/browsers drop it; a bounded research loop realistically takes 2–8 min. → async delivery.
2. **`retryOnFail` is silently disabled when `On Error = Continue*`.** Retries under graceful error handling require manual retry loops (HTTP → error branch → Wait → counter → loop back).
3. **n8n Code nodes are bare JavaScript** — no npm modules (only allowlisted `crypto`/`moment`), no imports beyond `require`, no filesystem, no HTTP, no credential access. All validation is hand-rolled pure JS.

## System topology (async-by-default)

```text
Workflow A — Vendor Assessment
  n8n Form Trigger (respond: "Form Is Submitted" — immediate ack + job_id)
    -> Code: normalize + fingerprint (SHA-256 via crypto)
    -> Data Table: If Row Exists / Get (dedupe on fingerprint + status)
       -> duplicate -> short-circuit (no API calls, no notification)
    -> Data Table: Upsert status=processing
    -> Code: planner-state init {round, maxRounds, counters}
    -> LOOP (bounded by IF on state.round < maxRounds):
         HTTP: Nebius planner (manual retry wrapper)
         Code: parse + schema-validate JSON (fail closed)
         HTTP: Tavily Search xN (manual retry wrapper)
         HTTP: Tavily Extract <=20 URLs (manual retry wrapper)
         Code: merge, honor failed_results, update counters
         HTTP: Nebius verifier -> Code: deterministic evidence validation
         IF gaps AND round < maxRounds -> loop
    -> Code: render report (JSON + HTML, hand-rolled)
    -> Data Table: Upsert status=completed
    -> IF requires_review -> Gmail: operator alert (summary only)

Workflow B — Report Retrieval (fast, synchronous-safe)
  n8n Form Trigger (job_id input, responseMode=lastNode)
    -> Data Table: Get by job_id (<2 s)
    -> Show Text: rendered report HTML

Workflow C — Error Handler (published, automatic executions only)
  Error Trigger
    -> Code: normalize safe diagnostics (node, error type, status, id)
    -> Data Table: Insert workflow_failures
    -> Gmail: operator alert

Workflow D — Recheck (deferred, only after MVP verification)
```

**Why async:** immediate ack avoids the held-connection ceiling entirely; the user gets a `job_id` and retrieves the report via Workflow B (a single table read — safe to hold synchronously). The intake form never accepts a recipient email (spam-relay risk — see `SECURITY.md`).

**Optional demo fast path:** a `fast_mode` IF branch — 1 query, ≤5 extract URLs, no follow-up — may fit the `lastNode` window (<~90 s). Label honestly if used.

## Bounded agent loop

States: `intake -> plan -> search -> extract -> verify -> gap_analysis -> follow_up|finalize -> persist -> notify`.

### Autonomy boundary

The model may choose: sub-questions, search queries, source priorities, gap declarations, follow-up queries within caps.

Deterministic workflow logic must control: input limits, state transitions, `round < maxRounds` guard, counters (queries/URLs/model calls), timeouts, retry loop bounds, schema validation, per-source evidence membership, deduplication, risk routing, persistence, notifications.

## Evidence model (v1, extended)

```json
{
  "claim": "single atomic proposition",
  "topic": "string",
  "verification": "supported | contradicted | insufficient_evidence",
  "source_url": "string",
  "source_title": "string",
  "source_class": "first_party|independent|regulatory|aggregator|unknown",
  "evidence": "single contiguous quote, 20-2000 chars",
  "severity": "info|low|medium|high|critical",
  "validation": {
    "original_state": "supported",
    "final_state": "insufficient_evidence",
    "url_match": true,
    "evidence_match": "exact|normalized|none",
    "downgrade_reason": "none|url_not_in_extraction_set|evidence_not_found_in_source|evidence_format_invalid"
  }
}
```

## Deterministic validator contract (R0–R8, monotonic downgrade only)

- **R0 Schema gate:** malformed report, missing fields, bad enums → `invalid_schema`, fail closed. No report.
- **R1 URL membership:** normalize URLs (lowercase scheme/host, strip fragment, strip tracking params `utm_*`/`fbclid`/`gclid`, trailing `/`); match against `status:"ok"` extraction entries only — never `failed_results`.
- **R2 Evidence format:** 20–2000 chars; reject `…`/`...`/`[...]` spans → `evidence_format_invalid`.
- **R3 Quote membership, per cited source, two tiers:** (a) exact substring after NFC + whitespace-collapse on both sides; (b) normalized — additionally canonicalize quote/dash chars and NBSP → `normalized` (still supported, audit-flagged). Never fuzzy. Miss → downgrade. Same check applies to `contradicted` spans. **The span must exist in the cited URL's own content — not any other source.**
- **R4 Atomicity guard:** claim > 300 chars → `compound_claim_suspected` flag (does not downgrade; feeds review).
- **R5 Follow-up attribution:** only `url_not_in_extraction_set` downgrades are retrievable and eligible for follow-up; `evidence_not_found_in_source` is non-retrievable. Follow-up queries deduped vs prior rounds.
- **R6 `requires_review` triggers:** any `contradicted`; any normalized-only match; `downgraded ≥ 2`; ≥50% of material-topic findings insufficient; any `compound_claim_suspected`. `review_reasons` is an enum list.
- **R7 Severity floor:** `contradicted` ⇒ severity ≥ `medium` (clamp, set `severity_adjusted`); `insufficient_evidence` caps at `medium` unless material topic.
- **R8 Trace/usage block (required):** per-round `{round, queries[], result_count, urls_requested[], urls_extracted[], failed_results[], follow_up_reason}`; totals; usage `{nebius_tokens_in/out, tavily_credits}`; `downgrades[]`; `validator_version`.

**Known v1 limitation:** substring membership proves the quote is real, not that it semantically entails the claim (test T19). Mitigations: manual audit protocol + optional entailment-judge variant (S1–S7 in `TESTING.md`).

## n8n constraints (verified by research, pending live probes C-1..C-10)

- **Data Tables:** no JSON column type (stringify report); no unique constraints (dedupe via Get/If-Row-Exists + Upsert, not DB-enforced); column types locked after creation; ~200 MiB instance cap; cell-size limit undocumented → probe C-3; **not accessible from Code nodes**; truncate extracted content (~4–8 KB/source).
- **HTTP retries:** `retryOnFail` caps at 5 tries / 5000 ms wait and requires `On Error=Stop Workflow`; graceful handling needs manual Wait+counter loops (recommended: 3 attempts, honor `Retry-After` on 429).
- **Error Trigger:** fires only on automatic/production executions — never manual test runs; suppressed by Continue-on-error nodes; reduced payload for trigger-node failures; error workflow itself must be published on recent n8n versions.
- **Memory:** 640 MiB on Trial/Starter/Pro-1 Cloud plans — batch extract results, keep item `state` small, never pin large data.
- **IF/typeValidation drift:** editor may flip loose→strict on open; pin typeVersions deliberately and re-verify after export/import.
- **Data Table resource locators:** `{__rl, value:"<id>", mode:"list"}` bind to the source instance — re-select by name after import.
- **Tavily:** HTTP Request + Header Auth credential (portable); community node `@tavily/n8n-nodes-tavily` exists but adds a dependency.
- **Nebius:** OpenAI-compatible → HTTP Request + Header Auth, or OpenAI node with custom base URL.

## API contract summary (verified)

- **Nebius Token Factory:** `POST https://api.tokenfactory.nebius.com/v1/chat/completions`, Bearer auth. MiniMax-M3 confirmed in catalog (~428B/23B-active MoE, 1M context, $0.30/M in, $1.20/M out, us-central1). **Thinking model ON by default** — thinking tokens consume output budget; too-small `max_completion_tokens` yields `finish_reason:"length"` with empty content (distinct error class → retry with larger budget, not schema violation). `service_tier`: `default` returns 429 on limit; `flex` lower-priority. Public catalog `GET tokenfactory.nebius.com/api/public/models_info` usable for no-key probe.
- **Tavily Search:** `POST /search`, Bearer auth. `search_depth=basic|fast|ultra-fast|advanced`; set `max_results` explicitly (docs say 10, OpenAPI says 5); `auto_parameters` defaults false (can auto-upgrade depth → keep disabled or pin); `chunks_per_source` 1–3; no server-side timeout → client timeout 30 s. Response: `results[{title,url,content,score}]`, `usage.credits`, `request_id`.
- **Tavily Extract:** `POST /extract`, `urls` ≤20/batch, `query` enables chunk reranking (`chunks_per_source` 1–5), `timeout` 1–60 s (default 10 s basic / 30 s advanced), `failed_results[{url,error}]` must be checked even on HTTP 200. Credits: 1 per 5 URLs basic / 2 per 5 advanced; failed URLs free.
- **Tavily errors:** 401/400 → no retry; **429 retryable with `Retry-After`**; **432/433 = plan/paygo exhausted → fail closed, never retry**. `GET /usage` for budget telemetry. Dev key 100 RPM, production 1000 RPM.
- **Structured output (RESOLVED by live probe):** MiniMax-M3 accepts `response_format: {"type":"json_object"}` AND `{"type":"json_schema","json_schema":{...}}` — strict schema-validated JSON confirmed working. Use `json_schema` for all model calls. `guided_json` remains as fallback.

## Recommended run limits (pending live calibration)

| Control | Value |
|---|---|
| Initial queries | 3–5, `search_depth=basic`, `max_results=5` |
| Follow-up rounds | `maxRounds=1` (flag-gated) |
| Extract batch | ≤20 URLs, prefer 2 batches of ≤10 for latency isolation |
| Extract depth | `basic` default; `advanced` only on basic failures/table pages |
| Retries | 3 attempts, Wait 2–5 s, honor `Retry-After`; zero retries on 401/432/433 |
| Client timeouts | Search 30 s; Extract 45–90 s batch |
| Nebius | `max_completion_tokens` ≥ 8k (thinking consumes budget); `service_tier=default` |
| Estimated cost/run | ~15–25 Tavily credits + ~$0.01–0.05 Nebius |

## Open questions (probe-gated)

- ~~Structured-output mode~~ → **RESOLVED:** `json_schema` works on MiniMax-M3 (probe N-3, 2026-10-18).
- Form hold-time ceiling on this instance; report-HTML rendering in Show Text (C-2)
- Data Table cell-size ceiling for `report_json` (C-3)
- Empty `Get` behavior for dedupe branch (C-4)
- Error-workflow publish requirement on installed version (C-5)
- Memory headroom with ~20 extracted pages (C-9)
- Execution-data retention settings on this plan (P1-05)
- Nemotron smoke test for NVIDIA narrative — optional 15-min check
