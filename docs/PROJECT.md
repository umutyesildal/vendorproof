# Project Context

## Product

**VendorProof — AI-Powered Vendor Due Diligence & Continuous Risk Monitoring**

> Research once. Verify every claim. Monitor what changes.

VendorProof will research a company, compare material claims with live source evidence, expose uncertainty, and trigger deterministic follow-up actions when risks or meaningful changes are detected.

## Hackathon context

- Event: Nebius Build Week × NVIDIA, Berlin
- Primary category: Tavily Agentic Deep Research
- Secondary category: Best Use of n8n
- Core inference: Nebius Token Factory
- Research: Tavily Search and Tavily Extract
- Orchestration and interface: n8n Cloud
- Planned report language: English

Organizer confirmed the submission deadline is **18:30** (Berlin time). Safe internal target: submit by ~18:00.

## Product principles

1. **Evidence first:** every material finding carries a verification state.
2. **No fabricated certainty:** missing evidence is a useful result.
3. **Agentic but bounded:** the system chooses research steps inside explicit cost, time, and retry limits.
4. **Deterministic operations:** validation, deduplication, persistence, routing, and notifications should not require an LLM.
5. **Auditable execution:** judges can inspect why a query was run, which source was opened, and how a claim was classified.
6. **Honest presentation:** simulations and fixtures are labeled; edited demos never imply false live behavior.

## Intended user flow

1. User submits a company and research objective (no email collected — ADR-006).
2. The form immediately acknowledges with a `job_id` (research runs async — held connections drop ~60–120 s).
3. The system validates, fingerprints, and deduplicates the request.
4. The research agent decomposes the objective into focused questions.
5. Tavily finds and extracts sources.
6. The evidence validator checks claim-to-source support per cited URL.
7. Missing retrievable evidence may trigger one bounded follow-up round.
8. n8n stores the result; the user retrieves the report by `job_id` via a lookup form.
9. Risk findings trigger an operator email; a later monitoring workflow may recheck and report meaningful changes.

## Data and privacy

- Inputs (company + objective) flow to third-party APIs (Nebius, Tavily). No confidential objectives; research targets are public companies.
- Claims are single atomic propositions; every `findings[]` item is validated — there is no materiality escape hatch.
- Full policy in `SECURITY.md`.

## Verification states

- `supported`: extracted source text directly supports the claim.
- `contradicted`: extracted source text directly conflicts with the claim.
- `insufficient_evidence`: the source is unavailable, irrelevant, too weak, or absent.

These states evaluate source support, not absolute truth.

## Current status

Orchestration has started in Markdown-first mode. Repository initialization is complete, but application implementation and live capability proof have not started. No Nebius, Tavily, n8n credential, or Gmail integration has been verified yet.

## Out of scope until explicitly approved

- Next.js dashboard
- User accounts and authentication
- PDF generation
- Unbounded autonomous loops
- Multi-agent runtime architecture
- Production-scale database design
- Scheduled monitoring before the core assessment workflow is proven
