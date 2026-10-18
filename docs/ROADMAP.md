# Roadmap

## Phase 0 — Repository and project memory ✅

Done: Git on `main`, secret-safe ignores, Markdown source of truth, agent contract.

## Phase 1a — Orchestration research gate ✅

Five read-only audits completed and integrated:

- n8n feasibility: feasible with async delivery, manual retries, hand-rolled JS validation (probes C-1..C-10)
- API contracts: Nebius/Tavily endpoints, limits, probes N-1..T-3
- Evidence design: R0–R8 validator contract, T1–T20 matrix, audit protocol
- Scope: minimal credible MVP, demo script, submission checklist
- Security: `SECURITY.md`, export checklist, abuse controls

## Phase 1b — Capability proof (blocked on credentials)

Goal: prove each dependency independently before architecture lock-in (ADR-003 gate).

Probes: N-1..N-4 (Nebius), T-1..T-3 (Tavily), C-1..C-10 (n8n), Gmail C-8. See `TESTING.md` probe table.

No workflow is built until probe results are recorded.

## Phase 2 — Evidence kernel

Goal: the differentiator — deterministic claim-to-evidence validation.

- R0–R8 validator in pure-JS Code nodes (no libraries)
- Report schema v1 with `source_class`, `validation`, `trace`, `usage`, `validator_version`
- T1–T20 fixture matrix passes
- Monotonic downgrade only; follow-up eligibility restricted to retrievable downgrades

Exit: three manually audited citations; malformed JSON fails closed; missing evidence can never be `supported`.

## Phase 3 — Main n8n workflows

Goal: connect intake to persisted, retrievable assessment.

- **Workflow A — Vendor Assessment:** immediate ack + `job_id`; normalize+fingerprint; dedupe; `processing` upsert; bounded loop (plan → search → extract → verify → optional 1 follow-up); render; `completed` upsert; `requires_review` routing.
- **Workflow B — Report Retrieval:** job_id → table get → Show Text HTML (safe synchronous read).
- **Workflow C — Error Handler:** published; normalized diagnostics; failure row; operator alert.
- **Data Tables:** `vendor_assessments`, `workflow_failures` (string columns; report stringified).

## Phase 4 — Reliability and actions

- Manual retry loops (≤3 attempts, honor `Retry-After`; zero retries on 401/432/433)
- Zombie-job TTL reconciler; recursive-error guard
- Operator Gmail alerts (summary only, fixed recipient)
- Secret-free workflow exports per `SECURITY.md` checklist

## Phase 5 — Verification and demo

- Acceptance matrix rows (TESTING.md) including security and error-path scenarios
- Manual audit protocol (all `contradicted`, ≥max(3,20%) `supported`, ≥2 downgraded)
- Export secret scan
- Demo: async submission → pre-baked completed report → deterministic validator highlight → n8n backbone tour → operator alert evidence
- Submission: public repo, README, exported workflow JSON, category tags; submit ~18:00 (organizer-confirmed deadline 18:30)

## Phase 6 — Optional, only if all MVP criteria pass

- Scheduled recheck + finding fingerprints + meaningful-change alerts
- Nemotron smoke test (NVIDIA narrative)
- Entailment-judge variant (S1)
- Optional submissions: Oct 19 same-venue hackathon; global Devpost (Oct 30)

## Explicit MVP non-goals

- Dashboard, PDF, auth/user accounts, multi-agent runtime, unbounded research, external DB
- User-supplied email collection, synchronous long-running form waits
