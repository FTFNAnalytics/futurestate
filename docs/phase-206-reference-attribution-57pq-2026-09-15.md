# Phase 206 — separate 57Q and 57P attribution corrections

September 15, 2026. Two complete local attribution tranches are implemented. This is not completion of Phase 206, Phases 205–216, production validation or launch approval.

## Content correction

57Q contains 36 FTFN method records and nine historical dockets. 57P contains 20 method records in four cohorts and nine historical dockets. The inherited agency `Data Release` / `Technical Report` labels confuse contextual source publishers with the author of an internal FTFN workflow. Current titles, summaries, findings, publisher/type and 74 separate corrected link downloads now identify FTFN authorship. Original raw records, August 9 dates, source bindings, publication states and downloads remain unchanged.

Full narrative patterns, individual reopening clauses, both complete briefings and both collections were reviewed. Metadata was grouped only by exact matching field values; twelve distinct source/publisher/topic profiles were inspected. All 74 complete original link files match record-derived metadata, full boundary prose and supporting URLs. Their hashes include the original encoding and line endings. This pass did not refresh external sources or rerun the historical tests.

| Historical group | Underlying synthetic cases | Counting boundary |
| --- | --- | --- |
| 57Q, each of nine contracts | 14 release (1 valid / 13 rejected), 14 bundle integrity (1 / 13), 16 lifecycle (6 / 10) | 44 per contract, 396 total; the no-event overview adds no cases |
| 57P Amtrak, two contracts | 18 audit, 36 publication receipt, 20 adjudication | 74 total; two schemas and the overview add no cases |
| 57P Broadband, three contracts | 27 audit, 54 publication receipt, 30 adjudication | 111 total; three schemas and the overview add no cases |
| 57P Hanford, one contract | 9 audit, 18 publication receipt, 10 adjudication | 37 total; one schema and the overview add no cases |
| 57P NNSA, three contracts | 27 audit, 54 publication receipt, 30 adjudication | 111 total; three schemas and the overview add no cases |

57P totals 333 cases, not nine copies of a uniform five-method case count. Its publication-receipt groups report six valid and twelve rejected fixtures per contract. The adjudication narratives identify one concordant accept, five disagreements/bounded blocks and one later append per contract; that is not an exhaustive partition of all ten cases. No missing outcomes or audit valid/rejected split were invented.

The corrected explanations preserve the critical differences:

- Evidence review and publication review require separate attribution; publication review cannot replace its evidence receipt.
- Disagreements remain explicit and require a distinct third escalation role. A synthetic accept is not actual reviewer approval.
- Manual release requires a human distinct from both reviewers and does not publish automatically.
- Bundle integrity is not claim truth. Withdrawal and rollback append history; they do not rewrite evidence or create operating outcomes.
- Historical no-event statements describe FTFN rehearsals, not current evidence absence.

All eighteen exact historical reopening clauses remain visible: separate PIDS/reliability, Nextlink/LEO adoption, Montana project-quarter, Hanford transfer/receipt/disposition, NNSA recurring output/accepted capacity and GAO recommendation-status requests. The four 57P cohorts do not merge these nine requirements. The broader method source lists also remain intact: three Amtrak, eleven broadband, twelve Hanford and ten NNSA links. Docket-specific agency labels and source lists remain in provenance, including the distinct GAO publisher.

Research Watch 047 and 046 are presented as historical FTFN method retrospectives. Their original August 9 bodies, proof headings and watch lists remain historical beneath separate correction notices.

## Implementation and verification

- [Exact input and earlier-review pins](../app/scripts/content-205-216/reference-attribution-57pq-inputs.json)
- [Authored 57Q/57P corrections](../app/scripts/content-205-216/reference-attribution-57pq-reviews.mjs)
- [57Q receipt](../app/src/content/updates/2026-09-15-reference-attribution-57q.json) and [57P receipt](../app/src/content/updates/2026-09-15-reference-attribution-57p.json)
- [Current combined ledger](../app/src/data/phase-206-reference-attribution.json) and [regression assertions](../app/scripts/assert-current-reference-attribution.mjs)

The combined ledger now covers 533 documents and ten briefings: 443 method/test notes and 90 historical dockets. All 467 earlier serialized reviews and 21 earlier authored input/update files are pinned. The six real current evidence receipts retain their exact hash. Corrections use existing non-mutating projections across details, collections, cards, topic/source/pathway consumers, search and exports. Each tranche links to its own dated correction. Published-only exports continue to exclude held dockets.

Current generation and the complete `current:test` suite pass. Candidate/content validation, source endpoint metadata checks and Phase 58/59/60/60C/61/67 assertions pass. Source-derived candidate expectations are 11,074 HTML pages, 157 top-level JSON exports and 291 updates; these are not verified production totals. Targeted tests cover all 74 original/corrected download pairs, preserved review pins, original dates/statuses, eighteen historical requests, four distinct cohort sizes, independent case arithmetic, non-mutating projections and card/search/export consistency. Source endpoint metadata checks do not establish live source reachability or currency.

Production output is interrupted/mixed and must not be used for acceptance, packaging or deployment. Dependency repair and audit approval remain outstanding; no installation, audit retry or permission workaround is authorized by this correction. The production verifier is prepared to inspect all ten tranches, but was not run against mixed output.

The refreshed aggregate and `test:v1ref` pass with current validation still Pending build and v1 Held. Changed JavaScript syntax checks, all 79 new attribution-file whitespace/merge-marker/JSON checks and tracked-file `git diff --check` pass. No Git commit, push, hosted change, new independent acceptance or launch occurred.

Outside these ten reviewed tranches remain 1,096 raw research documents and 448 briefings. These are remaining corpus counts, not an approved launch exclusion. Remaining launch-selected review, independent factual/reader/accessibility acceptance, authorized research dispositions, future evidence gates, hosted release approval, owner launch and thirty actual post-launch days remain open. Phases 205–216 are incomplete.
