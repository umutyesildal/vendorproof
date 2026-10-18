# VendorProof — 2-minute pitch (deck only)

No live demo. Present `pitch-deck.html` full screen (arrow keys / space to advance, `N` toggles speaker notes). ~15 seconds per slide.

| Time | Slide | Voiceover |
|---|---|---|
| 0:00–0:08 | 1 — Cover | "This is VendorProof. It researches a vendor for you — and proves every claim before you see it." |
| 0:08–0:23 | 2 — The problem | "AI research tools invent citations. They put a URL next to a claim, but nobody checks that the page actually says it. For a procurement decision, a link is not evidence." |
| 0:23–0:43 | 3 — How it works | "So we split the job. NVIDIA Nemotron plans the research, Tavily finds and extracts the sources, and the model drafts each claim with a verbatim quote. Then deterministic code checks that the URL was really extracted, the quote is really on that page, and the page names the vendor. It can only downgrade a claim — never upgrade one." |
| 0:43–1:00 | 4 — Fake vendor | "First test: a vendor that doesn't exist. Search came back with look-alike companies. Most tools would have written the report anyway. VendorProof refused — zero supported claims, cannot assess." |
| 1:00–1:15 | 5 — NVIDIA | "Then we ran the sponsor. Four NVIDIA claims verified word for word — supply chain, lock-in, compliance. Five were dropped because the quote didn't check out. The validator caught them, not us." |
| 1:15–1:32 | 6 — Under the hood | "It's all built in n8n: one orchestrator and three sub-workflows — planner, collector, verifier. Fifty nodes, only four of them Code; caching, the follow-up round, error handling and Gmail alerts are native n8n." |
| 1:32–1:47 | 7 — Stack | "Every partner is load-bearing. Nebius serves the model, Tavily supplies the evidence, n8n runs the system. Remove any one and the product stops existing." |
| 1:47–2:00 | 8 — Close | "Judge it like a jury — click three citations yourself. The repo is public. VendorProof: research once, verify every claim." |

## Submission checklist (Tech Europe dashboard)

- [ ] 2-minute video uploaded
- [ ] Public repo: https://github.com/umutyesildal/vendorproof
- [ ] Partner technologies listed: n8n, NVIDIA Nemotron, Nebius Token Factory, Tavily
- [ ] Submitted before 18:30
