# Agent Operating Contract

This repository is developed through explicit, documented orchestration. Markdown files are the project memory and source of truth.

## Required reading order

Before taking any implementation action, every agent must read:

1. `README.md`
2. `docs/PROJECT.md`
3. `docs/ARCHITECTURE.md`
4. `docs/SECURITY.md`
5. `docs/DECISIONS.md`
6. `docs/TASKS.md`
7. `docs/TESTING.md`
8. `docs/WORKLOG.md`

## Mandatory workflow

1. Confirm the requested task exists in `docs/TASKS.md` or add it before implementation.
2. Mark exactly one task as `in_progress` and record its owner.
3. Read the files and official documentation relevant to that task.
4. Record architecture-changing choices in `docs/DECISIONS.md` before implementation.
5. Define acceptance checks in `docs/TESTING.md` before considering the task complete.
6. Implement only the approved scope.
7. Run the smallest relevant verification first, then broader checks.
8. Add a dated entry to `docs/WORKLOG.md` with changes, evidence, failures, and follow-up work.
9. Update `docs/TASKS.md` immediately: completed, blocked, or pending.

## Agentic behavior

- Prefer autonomous research and tool selection inside explicit limits.
- Separate reasoning, evidence collection, evidence verification, and deterministic decisions.
- Preserve a reviewable trace of queries, sources, retries, decisions, and failures.
- Never invent successful results, citations, credentials, test output, or completed work.
- Fail closed when evidence, schemas, credentials, or required outputs are missing.
- Ask the user only for decisions, credentials, permissions, or facts that cannot be safely derived.
- Do not silently expand scope.

## Orchestration rules

- A coordinator owns decomposition, dependency order, integration, and final verification.
- Worker tasks must have disjoint file ownership whenever work is parallelized.
- Every worker receives the relevant Markdown context and explicit acceptance criteria.
- Workers report outcomes to the coordinator; they do not silently declare the overall project complete.
- Blocked tasks stay visible in `docs/TASKS.md` with the blocker and required resolution.
- No agent may expose secrets in chat, logs, workflow exports, fixtures, or commits.

## Change policy

- Product code and workflow exports are not created until the user explicitly starts implementation.
- Planning changes update Markdown only.
- Destructive operations require explicit confirmation.
- Commits and pushes happen only when explicitly requested.
- New project knowledge must be written into the appropriate Markdown file instead of relying on conversation history.

## Definition of done

A task is complete only when:

- its acceptance criteria pass;
- relevant documentation is updated;
- secrets are absent;
- failures and limitations are disclosed;
- `docs/TASKS.md` and `docs/WORKLOG.md` reflect reality.
