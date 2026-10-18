# Documentation Index

- [`PROJECT.md`](PROJECT.md) — product context, goals, principles, and scope
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — planned system boundaries and data flow
- [`ROADMAP.md`](ROADMAP.md) — phased delivery strategy
- [`TASKS.md`](TASKS.md) — executable task queue and ownership
- [`DECISIONS.md`](DECISIONS.md) — architecture decision record
- [`TESTING.md`](TESTING.md) — acceptance and verification strategy
- [`SECURITY.md`](SECURITY.md) — secrets, export hygiene, abuse controls, privacy policy
- [`WORKLOG.md`](WORKLOG.md) — chronological execution journal
- [`../AGENTS.md`](../AGENTS.md) — mandatory operating contract for all agents

## Source-of-truth rules

- Product intent belongs in `PROJECT.md`.
- System design belongs in `ARCHITECTURE.md`.
- Approved sequencing belongs in `ROADMAP.md`.
- Current work state belongs in `TASKS.md`.
- Lasting choices and trade-offs belong in `DECISIONS.md`.
- Acceptance criteria and evidence belong in `TESTING.md`.
- What actually happened belongs in `WORKLOG.md`.

When documents disagree, the newest accepted entry in `DECISIONS.md` wins for architecture, while `TASKS.md` wins for current execution status.
