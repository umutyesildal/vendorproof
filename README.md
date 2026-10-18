# VendorProof

AI-powered vendor due diligence — **research once, verify every claim, monitor what changes.**

Built for Nebius Build Week × NVIDIA Berlin (Tavily deep-research track + n8n award), fully n8n-Cloud native: Nebius Token Factory (`MiniMaxAI/MiniMax-M3`) plans and verifies research, Tavily Search + Extract supply live evidence, and a deterministic validator proves every citation before a report ships.

## Live system (orchestrator + sub-workflows)

| Workflow | Purpose |
|---|---|
| **Orchestrator** | Form → Set → IF → Stop and Error → Crypto fingerprint → dedupe → `Execute Workflow` calls → bounded follow-up round → persist → operator alert. Zero Code nodes. |
| **Sub: Research Planner** | Nebius `json_schema` plan → native Set/Split Out/Limit fan-out. Zero Code nodes. |
| **Sub: Evidence Collector** | Tavily Search per query → Split Out → Filter → Remove Duplicates → Limit → Aggregate → Tavily Extract. Zero Code nodes. |
| **Sub: Claim Verifier** | Nebius verifier → deterministic R0–R8 evidence validator (the one Code node that matters). |
| **Report Retrieval** | Same company + objective → fingerprint → Data Table lookup → rendered HTML report. |
| **Error Handler** | Error Trigger → failure logged to `workflow_failures` table → operator Gmail alert. |

Form endpoints (production): `/form/vp-assessment`, `/form/vp-lookup` on the n8n Cloud instance.

## Why it's different

- **Evidence-first:** every `supported` finding must cite a URL that was actually extracted *and* a verbatim passage found inside that URL's own content — checked deterministically, not by the model. Wrong-source quotes, extraction failures, and malformed evidence are downgraded to `insufficient_evidence`. Validation only ever downgrades — never upgrades.
- **Agentic but bounded:** the model plans its own queries and may request one follow-up research round when evidence is missing (hard cap enforced deterministically).
- **Real automation:** async form ack, SHA-256 dedupe fingerprint, zero-API-call cache hits, retry-on-fail on every HTTP node, dedicated published error workflow, Data Table persistence.

## Verified results

- E2E run (Nebius): 12 findings — 8 supported with verbatim evidence, 4 honestly `insufficient_evidence`; validator downgrades triggered `requires_review`.
- Duplicate request: 5 nodes, zero API calls, `cache_hit: true`.
- Error path: bad input → execution failure → logged to `workflow_failures`.
- Validator fixtures: `tests/test-validator.js` — **10/10 pass**.

## Layout

```
n8n/                      workflow exports (secret-free)
  orchestrator.json           main pipeline — zero Code nodes
  sub-planner.json            Nebius research planning — zero Code nodes
  sub-collector.json          Tavily search/extract fan-out — zero Code nodes
  sub-verifier.json           claim verification + deterministic validator
  report-retrieval.json       report lookup form
  error-handler.json          published error workflow
  vendor-assessment-v1-archived.json  earlier monolith, kept for reference
examples/sample-report.json   real report from a live run
tests/test-validator.js       validator fixture suite (node tests/test-validator.js)
docs/                       Markdown source of truth (see docs/INDEX.md)
```

## Safety

- API keys live only in n8n managed credentials (`vendorproof-{nebius,tavily}`) and a git-ignored local `.env`.
- Intake form collects no recipient email — operator address is fixed (spam-relay protection).
- Web page content is treated as untrusted data in all prompts.
