# Phase 126 — Mission Evidence Audits

**Status:** Complete locally and integrated into v0.6 on August 30, 2026.
**Program:** FTFN v0.6 — Open Evidence Review

## Objective

Screen all sixty-eight Phase 121 research missions against the exact Phase 125 annotation titles and factual nuclei, then expose the unresolved evidence burden at requirement level. The audit tells readers which lexical leads were found, which exact fields had no screened-term overlap, which false positive must be avoided, and what kind of exact record a later dated review needs.

The audit is deliberately distinct from adjudication. It cannot change the Phase 121 answer state or convert a context record into direct evidence.

## Delivered content

- 68 `126-AUDIT-*` records, one-to-one and order-preserving with Phase 121 missions.
- 204 `126-REQ-*` tests: the exact three required-evidence strings for every mission, retained verbatim and in upstream order.
- 79,500 rendered audit words across the mission narrative, requirement analyses and exact factual excerpts.
- 34,104 words of requirement- and context-specific analysis after standard audit scaffolding, publication boundaries and imported factual excerpts are excluded; 26,902 remain when exact repeated substantive passages are counted once.
- 90 bounded `Potentially relevant context — not accepted` results and 114 `No screened-term overlap in title/factual nucleus` results, with 119 exact relevant-note references.
- One new index at `/review/fieldbook/mission-audits/`.
- Conditional Phase 126 audit sections on exactly 68 existing `/review/fieldbook/missions/{slug}/` routes; no duplicate mission routes.
- Direct schema-1.0 JSON export at `/data/phase-126-mission-evidence-audits.json`.

## Record contract

Every mission audit carries:

- stable audit, mission, question and topic IDs;
- the exact research horizon and canonical mission route;
- the Phase 121 answer state copied byte-for-byte;
- the fixed disposition `Title/factual-nucleus screen complete — mission remains unadjudicated`;
- exact Phase 125 evidence-note IDs;
- three ordered requirement tests;
- a non-ranking reading of the current context shelf;
- the unchanged completion rule and an explicit `completed: false` state;
- the next acquisition action inherited from Phase 121 stewardship; and
- a record-specific narrative and interpretation boundary.

Every requirement test carries its stable ID and index, the verbatim upstream requirement, all exact context-note IDs, the screened relevant-note IDs, exact factual excerpts and matched terms where present, requirement-specific reasoning, a false-positive guard, the missing-record description, and a requirement-analysis word count.

The bounded states are:

- `Potentially relevant context — not accepted` when a distinguishing requirement term occurs in an exact Phase 125 note title or factual nucleus; and
- `No screened-term overlap in title/factual nucleus` when the lexical screen finds no such occurrence.

The screen examines only titles and factual nuclei. It does not claim to perform semantic adjudication. A match is a review lead, not acceptance; no match is not proof that a note is semantically irrelevant or that qualifying evidence does not exist externally. Exact Phase 125 limitation fields are applied after a match to state why contextual overlap remains insufficient.

## Content-quality floor

The published counters separate `rendered_audit_words` from `authored_requirement_words`. The latter excludes mission scaffolding, publication boundaries, imported factual excerpts and generic route copy. It counts requirement reasoning, requirement-specific false-positive analysis, missing-record analysis, and note-specific relevance and limitation reasoning. The deterministic build contains 34,104 such words, with a minimum of 137 per requirement test. `deduplicated_substantive_words` then counts each exact normalized substantive passage once, producing 26,902 words.

The assertion also computes repeated eight-word sequences over those authored fields. The repaired registry records a 0.5157 repeat ratio, materially below the rejected blanket audit, and enforces a ceiling of 0.55. Every full mission narrative must also remain unique.

## Preserved upstream state

- 68 of 68 Phase 121 answer states remain `Research packet assembled — answer not adjudicated`.
- 204 of 204 requirements receive no evidence-admission or satisfaction decision.
- 56 missions retain exact topic-and-stage packet joins.
- 12 missions retain visible acquisition coverage gaps.
- All Phase 120 sources remain Candidate.
- Eleven Phase 60 gates after August 30 remain scheduled, undecided and without receipts.

## Evidence boundary

Phase 126 creates no artifact, source fact, signal, receipt, event, stage advance, observation, outcome, score, ranking, recommendation, forecast or causal finding. It does not infer external nonexistence from a repository gap and does not rank context records as strongest evidence.

## Verification

Run:

```text
node app/scripts/build-phase125-evidence-annotation-ledger.mjs
node app/scripts/build-phase126-mission-evidence-audits.mjs
node app/scripts/assert-phase126.mjs
```

The assertion checks exact one-to-one mission parity, ordered requirement equality, exact Phase 125 joins, allowed bounded states, lexical grounding, exact relevant-note excerpts, analysis-only word counts, repeated eight-word limits, unique mission fingerprints, complete update route/record inventory, route integration, absence of decision fields, preservation of all twelve coverage gaps, and the future-gate boundary.

## Exit state

Phase 126 is complete when all sixty-eight missions expose the exact three requirement tests on their canonical routes, the hub and export exist, every answer and coverage state remains unchanged, and deterministic content and boundary assertions pass.
