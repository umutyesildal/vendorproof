# VendorProof — 2-minute demo video (Stage 1 submission)

Goal: win the n8n side track. The n8n canvas and executions are on screen for ~45 of the 120 seconds; every claim in the voiceover is shown, not told.

## Pre-flight (do before recording)

1. NVIDIA and Nimbus reports already exist (fresh reruns) — lookup is instant.
2. Chrome tabs, in this order, all logged in, zoomed so text is legible at 1080p:
   1. `https://yesildal.app.n8n.cloud/form/vp-lookup` → Nimbus report rendered
   2. `https://yesildal.app.n8n.cloud/form/vp-assessment` (empty form)
   3. n8n orchestrator canvas (lanes layout, zoom-to-fit)
   4. n8n Executions → the NVIDIA execution (green), zoom-to-fit
   5. `https://yesildal.app.n8n.cloud/form/vp-lookup` → NVIDIA report rendered
   6. The source page of one NVIDIA supported finding (the URL under its quote)
3. Close notifications (Do Not Disturb), hide bookmarks bar (Cmd+Shift+B), close the n8n checklist popup.
4. Record with QuickTime / Cmd+Shift+5, full screen, mic on. One take per section is fine — cut in any editor.

## Shot list + voiceover

| Time | Screen | Voiceover |
|---|---|---|
| 0:00–0:12 | Tab 1 — Nimbus report, "CANNOT ASSESS — NO SUPPORTED EVIDENCE" | "We asked an AI to research a vendor that doesn't exist. Most tools would write the report anyway. VendorProof refused — no quote, no claim." |
| 0:12–0:25 | Tab 2 — type `NVIDIA` + objective, click Start assessment, instant acknowledgement | "VendorProof is evidence-first vendor due diligence. You name a company and what you need to know. The research runs in the background." |
| 0:25–0:50 | Tab 3 — orchestrator canvas, pan lane by lane | "It is built entirely as n8n workflows. One orchestrator: intake and a dedupe cache, then three sub-workflows — plan, collect, verify — a bounded follow-up round, and persistence with Gmail alerts. The whole research pipeline is native nodes except one: the Code node that validates the evidence." |
| 0:50–1:05 | Tab 4 — green execution; open the Evidence Collector sub-execution | "NVIDIA Nemotron on Nebius Token Factory writes the research plan. Tavily searches and extracts the sources — every query gets an equal share of URLs, all with Split Out, Filter, Remove Duplicates, Limit and Aggregate." |
| 1:05–1:35 | Tab 5 — NVIDIA report: risk line, assessment, scroll to a SUPPORTED finding with its quote → Tab 6, Cmd+F the quote on the source page | "The model must quote its source for every claim. Then deterministic code — not another model — checks that the quote really exists in that exact page. Here is the claim, here is the quote, and here it is on the source. <NVIDIA_SUPPORTED> claims verified for NVIDIA; <NVIDIA_DOWNGRADED> were downgraded automatically because the quote wasn't there." |
| 1:35–1:50 | Tab 5 — scroll to an INSUFFICIENT EVIDENCE finding, then the review banner | "Claims can only move down: supported, insufficient evidence, contradicted. When evidence is missing, the report says so and flags a human for review." |
| 1:50–2:00 | Tab 3 or final deck slide | "Research once. Verify every claim. Monitor what changes. VendorProof — built on n8n, NVIDIA Nemotron, Nebius and Tavily." |

Fill `<NVIDIA_SUPPORTED>` / `<NVIDIA_DOWNGRADED>` from the final NVIDIA rerun before recording.

## Fallbacks

- If a live form submit is slow, cut straight from the acknowledgement to the existing green execution (Tab 4) — never wait on camera.
- If wifi drops, the deck (`pitch-deck.html`) contains the real canvas and report screenshots; narrate over slides 4–6.

## Submission checklist (Tech Europe dashboard)

- [ ] 2-minute video uploaded
- [ ] Public repo: https://github.com/umutyesildal/vendorproof (README: setup, APIs, frameworks, partner tech, architecture)
- [ ] Partner technologies listed: n8n, NVIDIA Nemotron, Nebius Token Factory, Tavily
- [ ] Submitted before 18:30 — only by the user, explicitly
