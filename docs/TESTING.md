# Verification Strategy

## Current phase checks

- Git branch is `main`; commits only when requested.
- Required Markdown files exist; relative links resolve.
- `.env` is ignored; `.env.example` is placeholders only.
- No secrets anywhere (grep scan).
- No workflow export or implementation artifact exists yet.

## Capability probes (Phase 1 — from agent research)

| # | Probe | Decides |
|---|---|---|
| C-1 | Installed n8n Cloud version + node typeVersions | Export compatibility |
| C-2 | Form hold-time ceiling + Show Text HTML rendering | Async vs fast-path report UX |
| C-3 | Data Table cell-size limit for `report_json` | Storage strategy |
| C-4 | Empty `Get` behavior for dedupe branch | Dedupe node config |
| C-5 | Error-workflow publish requirement | Error Handler topology |
| C-6 | `retryOnFail`+`Continue` behavior on installed version | Confirms manual retry loop |
| C-7 | Code node runtime limits | Validator design |
| C-8 | Gmail OAuth + HTML body | Report delivery |
| C-9 | Memory headroom, ~20-page extract | Extract batching |
| C-10 | Community Tavily node availability | Optional node path |
| N-1 | Public catalog `GET /api/public/models_info` (no key) | Model presence/pricing |
| N-2 | `GET /v1/models` with key; bad-key 401 shape | Nebius auth |
| N-3 | `json_object` vs `json_schema` vs `guided_json` on M3 | Structured-output path |
| N-4 | Small `max_completion_tokens` → `finish_reason:"length"`+empty content | Truncation error class |
| T-1 | Tavily search basic probe (latency, fields); bad-key 401 | Tavily auth/perf |
| T-2 | Extract mixed batch incl. dead URL → `failed_results` on HTTP 200 | Failure handling |
| T-3 | `GET /usage` before/after | Credit accounting |

## Acceptance matrix

| Scenario | Required behavior |
|---|---|
| Normal research | Structured, sourced report persisted and retrievable |
| Unsupported claim | `insufficient_evidence`, never `supported` |
| Contradictory evidence | `contradicted` + `requires_review` + severity ≥ medium |
| Extraction failure | `failed_results` checked on HTTP 200; URL never counts as evidence |
| Duplicate request | Existing row reused; zero API calls; zero notifications |
| Tavily 429 | Retry with `Retry-After`, bounded ≤3; then explicit failure |
| Tavily 432/433 | **Fail closed immediately — no retry** (plan/paygo exhausted) |
| Nebius malformed JSON | Schema error; no completed report |
| Nebius `finish_reason:"length"` | Distinct error class → retry with larger token budget, not schema violation |
| Follow-up needed | Runs only if `round < maxRounds`; only `url_not_in_extraction_set` downgrades are retrievable; deduped queries |
| Form submission | Ack + `job_id` returned immediately; report via retrieval form/operator email |
| Error workflow | Fires only on published/production executions; manual test runs do NOT fire it; normalized failure row + operator alert |
| Zombie job | `processing` older than TTL reconciles to `failed`; resubmission allowed |
| Recursive error | Error workflow cannot reference itself; its notification failure logs silently to `workflow_failures` |
| Oversized form input | Rejected deterministically before any API call |
| Call-cap exceeded | Deterministic counter blocks extra calls regardless of model intent |
| Type-validation drift | `typeValidation` verified unchanged after node open/export/import |

## Evidence validator test matrix (fixtures through the Code-node contract)

| # | Test | Expected |
|---|---|---|
| T1 | Exact span in cited source | `supported`, `exact` |
| T2 | Newlines/NBSP difference | `supported`, `normalized` |
| T3 | Curly vs straight quotes | `normalized` |
| T4 | NFC vs NFD | `normalized` |
| T5 | Quote from source B cited under A | downgrade `evidence_not_found_in_source` |
| T6 | Cited URL + tracking params vs clean URL | membership via normalization |
| T7 | URL only in `failed_results` | `url_not_in_extraction_set` |
| T8 | Ellipsis-joined span | `evidence_format_invalid` |
| T9 | Span > 2000 chars | `evidence_format_invalid` |
| T10 | `contradicted` + verified span | stays `contradicted`, `requires_review`, severity ≥ medium |
| T11 | `contradicted` + missing span | `insufficient_evidence` |
| T12 | Missing field/bad enum | `invalid_schema`, fail closed |
| T13 | Empty extraction set | all → `insufficient_evidence`, `requires_review` |
| T14 | `insufficient_evidence` + matching quote | never upgraded (monotonicity) |
| T15 | ≥2 downgrades | `requires_review`, `downgrade_threshold` |
| T16 | Retrievable vs non-retrievable downgrade | only `url_not_in_extraction_set` eligible for follow-up |
| T17 | `contradicted` + severity `info` | clamped to `medium`, `severity_adjusted` |
| T18 | Duplicate follow-up query | deduped/blocked |
| T19 | Irrelevant real quote labeled `supported` | **passes v1 — known limitation**; covered by audit protocol + S1/S4 |
| T20 | Compound claim with half support | `compound_claim_suspected` → `requires_review` |

## Manual audit protocol (replaces "three citations")

- Audit **all** `contradicted` findings.
- Audit ≥ max(3, 20%) of `supported` findings, sampled deterministically (every k-th).
- Audit ≥2 **downgraded** findings (unfair-downgrade rate).
- Each verdict: `entailed | not_entailed | ambiguous`, recorded in `WORKLOG.md`.
- Any `supported`-audit failure blocks demo sign-off.

## Optional stricter variants (post-MVP)

- **S1** Entailment judge: second model call per (claim, span) → `supports|contradicts|neutral`; mismatch → downgrade/review.
- **S2** Multi-evidence array; critical findings need ≥2 non-first-party sources.
- **S3** First-party restriction on adverse topics (breach/litigation/sanctions/fraud/layoffs).
- **S4** Numeric/entity cross-check: numbers, dates, proper nouns in claim must appear in evidence.
- **S5** Negation-proximity screen on matched spans.
- **S6** `conflicting` state for verified-but-disagreeing spans → always review.
- **S7** Freshness window for time-sensitive topics.

## Security acceptance rows (from P1-00e)

- Export passes secret scan; no `pinData`, emails, or credential names beyond neutral convention.
- No secrets in Variables, Sticky Notes, node params, item payloads, execution logs.
- Intake form has no recipient-email field; Gmail targets fixed operator only.
- Extract ⊆ search results; model/user URLs never fetched directly.
- Oversized input rejected; call caps enforced deterministically.
- Demo recordings contain no credentials or recipient addresses.

## Completion evidence format

```md
- Check:
- Command or execution:
- Expected:
- Actual:
- Result: pass | fail
- Evidence location:
- Limitations:
```

No check may be marked passed without actual output or a reviewable artifact.
