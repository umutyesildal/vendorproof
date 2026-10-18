# Security and Safety Policy

## Secret handling

- Secrets exist in exactly two places: **n8n managed credentials** (runtime) and the **ignored local `.env`** (local capability checks only). Nothing in the n8n-native runtime reads `.env`.
- Never store secrets in: n8n Variables (they export with values), Sticky Notes, node parameters, pinned data, item payloads, Markdown, fixtures, or commits.
- Code nodes **cannot** read credentials by design — never work around this by passing keys through item data (which persists them in execution history).
- All API auth uses managed credential types (Header Auth / OAuth2). Never literal `Authorization` header values in node parameters; never API keys in query params (they leak into error objects and execution data).
- **Credential naming convention:** neutral names only — `vendorproof-nebius`, `vendorproof-tavily`, `vendorproof-gmail`. Credential `id` and `name` do appear in workflow exports.

## Public form abuse controls

The n8n Form URL is unguessable-but-public. Anyone with it can trigger paid API calls.

- Hard input caps (deterministic, before fingerprinting): company ≤ 200 chars, objective ≤ 2,000 chars; trim + whitespace-collapse.
- Hard budget caps per run enforced by deterministic counters in workflow state — never by prompt instructions: max search calls, max extract URLs, max model calls, max follow-up rounds.
- **The intake form must NOT accept a recipient email.** An open form + user-supplied recipient = spam/phishing relay. The user receives a `job_id`; the report is retrieved via a fast lookup form or delivered to the fixed operator address only.

## URL and fetch discipline

- n8n HTTP Request nodes never fetch user- or model-supplied URLs. Only Tavily Extract fetches URLs, and only URLs previously returned by Tavily Search enter the extract set (`extract ⊆ search results`).
- `source_url` validation: http/https scheme only, no userinfo, deduped, count-capped.
- Model output may only produce (a) query strings within caps, (b) report fields. It must never produce executable n8n expressions, node parameters, or fetch targets.

## Prompt injection stance

Extracted web content is **untrusted input** to the model:

- Extracted passages are wrapped and labeled as data, never instructions.
- Only company, objective, and extracted passages enter model context — never credentials, recipient addresses, workflow internals, or prior executions.
- Users must not submit confidential objectives; inputs flow to third-party APIs (Nebius, Tavily). Research targets are public companies only.

## Notification policy

- Recipient: fixed operator email from configuration, never user input.
- Body: summary + severity + assessment ID — not the full report or raw evidence.
- Error alerts contain normalized diagnostics only (node name, error type, HTTP status, execution ID, timestamp) — never raw error JSON, which can embed request headers/URLs.
- Cache hits send zero notifications.

## Execution data policy

- n8n Cloud stores full item data per execution; execution-data redaction is Enterprise-gated — likely unavailable (verify during P1-05).
- Therefore: nothing secret ever enters item data.
- Auditability is satisfied by logging decisions, counters, states, and source URLs to Data Tables — not raw extracted content or full error payloads.
- `workflow_failures` schema: `{execution_id, node, error_type, http_status, timestamp}` — no raw error dumps.
- Demo screenshots/recordings must not show credentials, secrets, or recipient addresses.

## Export checklist (required before sharing any workflow JSON)

1. Strip `pinData` (pinned items export verbatim).
2. Grep export for key patterns, bearer strings, emails, credential names.
3. Confirm only neutral credential names and table names (resource-locator caches can leak names/URLs).
4. Confirm no literal Authorization headers or `?api_key=` params.
5. Keep exports under `n8n/` and run the secret scan pre-commit.

## Git hygiene

- `.gitignore` covers `.env`, `.env.*` (except `.env.example`), `*.pem`, `*.key`, `*.p12`, `id_rsa*`, `*.credentials.json`, `*.har`, `.n8n/`, `secrets/`, `n8n/credentials/`, `*.log`, `n8n/backups/`.
- Commit-time checklist: `git status` → `git diff --cached` → secret grep → confirm exports have no `pinData`/emails.
- Commits and pushes only when explicitly requested.

## Fail-closed edge cases

- **Zombie jobs:** `processing` rows older than N minutes reconcile to `failed` (dedup must not block resubmission forever).
- **Recursive errors:** the Error Workflow must not reference itself; notification failure inside the Error Workflow writes to `workflow_failures`, never loops alerts.
- **Non-retryable failures:** Tavily 432/433 (plan/paygo exhausted), 401, and schema-invalid model output fail closed — zero retries.
