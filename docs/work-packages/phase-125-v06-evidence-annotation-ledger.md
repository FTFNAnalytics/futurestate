# Phase 125 — Source-linked Evidence Annotation Ledger

**Status:** Complete locally and integrated into v0.6 on August 30, 2026.
**Program:** FTFN v0.6 — Open Evidence Review

## Objective

Turn the exact Published context shelf already attached to the sixty-eight Phase 121 missions into an inspectable evidence-reading layer. Each annotation must tell a reader what the existing signal says, which exact source records support it, why it is relevant, which inference it cannot carry, and how it may be used in later research without pretending that mission requirements have been satisfied.

Phase 125 is an overlay. It does not rewrite Phase 118, Phase 120, Phase 121, Phase 124, a source record, or a signal record.

## Delivered content

- 82 `125-NOTE-*` evidence annotations, exactly one for every distinct Published signal in the Phase 121 context shelves.
- 114 exact source records resolved from those signals.
- 340 `125-LINK-*` mission-signal relationships, exactly equal to the upstream Phase 121 joins.
- 35,494 rendered annotation words, including each inherited factual nucleus exactly once.
- 33,235 substantive annotation words after inherited factual nuclei and publication boundaries are excluded; 18,221 words remain after exact repeated passages are counted once.
- One new index at `/review/fieldbook/evidence-notes/`.
- Conditional Phase 125 sections on exactly 82 existing `/signals/{slug}/` routes; no duplicate signal routes.
- Direct schema-1.0 JSON export at `/data/phase-125-evidence-annotation-ledger.json`.

## Record contract

Every annotation carries:

- stable note, signal, route, source and mission IDs;
- the exact Published signal identity and date fields;
- the inherited factual nucleus;
- a bounded-support reading and explicit excluded inference;
- a provenance reading over exact source IDs;
- a measurement reading preserving identity, period and denominator limits;
- a research-use statement naming the exact Phase 121 mission joins;
- the fixed state `Published context annotated — no mission answer created`; and
- an interpretation boundary prohibiting every downstream evidence-state inference.

Every mission-signal link carries the stable mission, note and signal IDs, topic and horizon, plus the fixed state `Context only — requirement satisfaction not adjudicated`.

## Deterministic membership

The builder takes the sorted set union of `relationships.context_signal_ids` across all Phase 121 missions. It never selects evidence by title, alias, keyword, substring, or fuzzy similarity. Source membership is the exact union of each selected signal's `source_ids`. Mission membership is copied from the exact upstream mission-signal relationships.

## Content-quality floor

Word accounting is explicit:

- `rendered_annotation_words` counts the six annotation fields displayed to readers, with the inherited factual nucleus present once rather than repeated inside bounded support;
- `substantive_annotation_words` excludes the inherited factual nucleus and the standard interpretation boundary;
- `deduplicated_substantive_words` splits the five substantive reading fields into passages and counts an exact normalized passage only once across the registry; and
- `substantive_8gram_repeat_ratio` reports recurring eight-word sequences over those five fields instead of hiding template reuse.

Every note must contain at least 120 substantive words after its factual nucleus is excluded. The current minimum is 351. Every normalized combined annotation remains unique. The repaired eight-word repeat ratio is exposed as 0.5574 rather than presenting all rendered text as new authored prose.

## Evidence boundary

Phase 125 creates no artifact, acquisition result, source fact, signal, receipt, evidence decision, mission answer, conversion-stage advance, observation, outcome, score, ranking, recommendation, forecast or causal finding. A note can guide later review; it cannot satisfy a mission requirement. Absence from the repository cannot be reported as external nonexistence.

All eighty Phase 120 authority sources remain Candidate. All sixty-eight Phase 121 answer states remain `Research packet assembled — answer not adjudicated`. The twelve packet-coverage gaps and eleven future Phase 60 gates remain unchanged.

## Verification

Run:

```text
node app/scripts/build-phase125-evidence-annotation-ledger.mjs
node app/scripts/assert-phase125.mjs
```

The assertion recomputes the exact 82-signal, 114-source and 340-link sets; verifies Published status and source resolution; rejects a factual nucleus repeated inside bounded support; recomputes rendered, substantive, deduplicated and recurring-eight-word metrics; checks the minimum floor and unique fingerprints; requires the dated update to enumerate all 82 signal IDs and all 84 hub/export/enhanced paths; inspects public integration; prohibits evidence-state fields; and rechecks the future-gate boundary.

## Exit state

Phase 125 is complete when every exact upstream context relationship is annotated once, all 82 canonical signal pages visibly render the correct note ID and Phase 125 marker, the hub and export exist, substantive content assertions pass, and no upstream evidence state changes.
