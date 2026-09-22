# Phase 206 — Editorial classification and claim integrity

**State:** In progress — 826 signal classifications, 825 corrected presentations and all reviewed-cohort feed holds retained. Twenty-two attribution tranches cover 839 research documents and 22 briefings. The latest [56G/56H corrections](../phase-206-reference-attribution-56gh-2026-09-15.md) add nine source analyses, twelve dockets and seven shared-signal reviews; preserve all earlier reviews and real receipts; and correct historical count/state/trigger claims. The two remaining lexical matches have narrow source-backed dispositions: zero unresolved current matches is not clearance of the rest of the corpus. Selected-release attribution, production and independent acceptance remain open. Phase 206 is not complete.

**September 14 implementation:** See the [current build report](../phase-205-216-build-2026-09-14.md) for concrete artifacts, validation and remaining exits. The original acceptance checklist below is not silently promoted by local implementation.
**Planning date:** September 9, 2026.  
**Priority:** P1; release blocker.  
**Accountable roles:** Editorial lead; build maintainer.  
**Effort estimate:** 4–7 editorial days and 2–3 engineering days.  
**Dependencies:** 205 baseline capture; current-state integration before publication.

## Outcome and reason

The audit found 405 signal bodies mentioning fixture/harness work, 288 marked Published, and a confirmed Amtrak headline/evidence-label mismatch.

## Starting points

- [signal-57n-amtrak-24-accepted-label-conformance-tests.mdx](../../app/src/content/signals/signal-57n-amtrak-24-accepted-label-conformance-tests.mdx)
- [content.config.ts](../../app/src/content.config.ts)
- [index.astro](../../app/src/pages/signals/index.astro)
- [editorial.ts](../../app/src/lib/editorial.ts)

## Work

1. Screen all 405 records and assign a claim-level disposition. Keep the keyword screen as a candidate list; do not bulk-reclassify based on a word match.
2. Model external observation, issuer claim, FTFN analysis, FTFN method/test note, and research docket distinctly. Keep evidence quality, verification, and publication status as separate dimensions.
3. Correct the confirmed Amtrak example through a dated correction with exact prior/new meaning. Review titles, summaries, maturity tags, and evidence labels for all confirmed cases.
4. Propagate corrected types into cards, default feeds, homepage counts, topic coverage, search, data exports, and sitemap policy. Make method work accessible in an appropriate method/archive view.
5. Review the launch-selected briefings and research documents for the same attribution problem. Merge repetitive coverage only with explicit identity and correction lineage.

## Acceptance

- [x] All 405 screened signals have recorded dispositions and a review date; every confirmed defect in that cohort has a correction or an explicit release exclusion. Source-level verification also covers the separate confirmed Amtrak correction, 215 additional origin-cohort records, 29 linked 57L records, 24 linked 56T records, 29 linked 57K records, 29 linked 57J records, 29 linked 57I records, 29 linked 57H records 29 linked 57G records and seven actual shared 56G/56H signals, for 826 total. This is not whole-corpus clearance or production acceptance.
- [ ] No internal test headline attributes an operational result to an outside organization.
- [ ] Default external-development feeds and totals exclude method/test notes; readers can deliberately retrieve those notes.
- [ ] A sampled card, detail page, topic total, search result, export, and index entry agree on the corrected record type.
- [ ] No source evidence, publication approval, or organization outcome is invented by reclassification.

## Boundary and handoff

Preserve original records and dated history. Published method notes can remain published as method notes; classification is not evidence admission.

Record completed work, exact changed artifacts, validation results, unresolved blockers, and the next action. Deliver working content or behavior as applicable, not another empty registry. Continue according to Phase 208's dependencies in the [Phase 205–216 roadmap](../roadmap-next-phases-205-216.md).
