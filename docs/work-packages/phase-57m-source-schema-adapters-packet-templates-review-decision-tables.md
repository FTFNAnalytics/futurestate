# Phase 57M: Source-Schema Adapters, Candidate-Evidence Packet Templates, And Human-Review Decision Tables

Date: 2026-08-08

Status: complete and release-validated; owner-only deployment pending

## Goal

Make all nine Phase 57L intake queues executable against future cited records without inventing evidence, coercing source labels, assembling values across records, or automating a publication decision.

## Publication contract

- Review twenty-nine Phase 57M records.
- Publish twenty adapter, packet-fixture, and human-review controls.
- Preserve all nine Phase 57L outcome holds exactly once and add no new hold.
- Reuse thirty-six Tier 1 source profiles and add no new source profile.
- Map all sixty required contract fields one-to-one into non-coercive adapters.
- Build one empty and one deliberately incomplete non-evidence fixture for every queue.
- Rehearse six bounded human-review outcomes for every contract.
- Evaluate and accept zero actual candidate packets, fire zero reopening triggers, and permit no automated closure or publication.
- Preserve the visible-scope ledger and the one Closed / twenty-one Partially Closed / two Open entity ledger.

## Non-coercive source-schema adapters

All sixty Phase 57L fields receive one adapter containing:

- a canonical field label;
- one readable accepted input label;
- exact-match behavior after case normalization and outer-whitespace trim only;
- a source-explicit data-type boundary;
- definition and unit rules;
- source-authority, period, and privacy rules;
- rejection and clarification handling for unrecognized labels; and
- explicit prohibitions on value transformation, imputation, and cross-record carry.

The registry contains 120 accepted adapter-vocabulary labels. These labels are workflow vocabulary rather than an assertion that a source field exists. All sixty source values remain null, no unrecognized label is coerced, and no value transformation is allowed.

### Rail summary

| Rail | Contracts | Fields | Accepted labels |
| --- | ---: | ---: | ---: |
| Amtrak | 2 | 12 | 24 |
| Broadband | 3 | 19 | 38 |
| Hanford | 1 | 12 | 24 |
| NNSA | 3 | 17 | 34 |
| Total | 9 | 60 | 120 |

## Candidate-evidence packet templates

Each of the nine intake queues now has:

- one canonical empty packet with null source metadata and null required fields;
- one deliberately incomplete synthetic fixture with exactly one marked fixture-only test value;
- the complete Phase 57L required-field list;
- explicit missing-field output;
- source-metadata slots for URL, publisher, publication date, authority, capture date, and record identifier;
- an expected bounded reviewer route for the incomplete test condition; and
- explicit non-evidence, non-eligibility, non-triggering, and non-publication states.

The eighteen fixtures exercise one rejection path, two clarification paths, two privacy holds, two authority holds, and two period holds. They are workflow test artifacts, not candidate records. Zero actual candidate packets are evaluated or accepted.

## Human-review decision tables

Nine decision tables contain fifty-four rehearsal rows. Every contract covers:

1. accept;
2. reject;
3. return for clarification;
4. privacy hold;
5. authority hold; and
6. period hold.

The accept-path rehearsal routes only to a separate human publication review after every required field, source, identity, schema, definition, unit, method, denominator, completed period, privacy, authority, and acceptance check passes. It does not fire a trigger, close a hold, or publish automatically.

## Published controls

Five workflow controls publish for each rail:

1. non-coercive field-adapter coverage;
2. exact accepted input-label coverage;
3. empty and incomplete non-evidence packet fixtures;
4. six-outcome human-review decision tables; and
5. zero evaluated or accepted packets and zero trigger events.

The nine inherited Amtrak closeout and reliability, Louisiana and Montana adoption, Hanford material-balance, NNSA recurring-output and accepted-capacity, and GAO enterprise-baseline records remain In Review.

## Content outputs

- `app/src/data/phase-57m-source-schema-adapters.json`;
- `app/src/data/phase-57m-candidate-evidence-packet-templates.json`;
- `app/src/data/phase-57m-human-review-decision-tables.json`;
- `app/src/data/phase-57m-source-schema-adapters-packet-templates-review-decision-tables.json`;
- `app/src/data/phase-57m-publication-review.json`;
- twenty-nine research documents;
- twenty-nine signals;
- Research Watch 043;
- one research collection;
- one public update;
- one thirty-two-file downloadable archive;
- five deepened topics, three reader pathways, and one dependency map.

## Evidence boundaries

- Adapter vocabulary is not observed source evidence.
- A label match cannot supply or validate a source value.
- Fixture placeholders are not evidence and cannot enter the evidence ledger.
- A rehearsal row is not an actual reviewer decision.
- Accept routes only to a separate publication review and never fires a trigger automatically.
- Values cannot be invented, transformed, or assembled across records.
- Missing public evidence does not mean nonexistent, withheld, or never submitted.
- Agency assertions and independent oversight remain separate.
- FTFN submitted no agency contact or FOIA request.
- No ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference is supported.

## Phase 57N handoff

Build adapter-conformance tests, packet-validation harnesses, and reviewer-receipt ledgers across all nine contracts. Test all 120 accepted labels plus explicit ambiguous-label rejections, execute all eighteen non-evidence fixtures against their expected bounded outcomes, and create a machine-readable receipt format for reviewer identity, reason code, cited source, decision time, escalation state, and publication-review handoff. Preserve all nine Phase 57M holds, keep every synthetic test outside the evidence ledger, and prohibit automated trigger firing, closure, or publication.

## Deployment checkpoint

Content references, source health, Astro diagnostics, the 2,647-page production build, Phase 57M assertions, release assertions, sitemap membership, exports, private-registry exclusion, and the thirty-two-file archive pass at 715 sources, 815 signals, 636 Published, 179 In Review, fifty-one briefings, forty-eight collections, 931 research documents, sixty adapters, eighteen fixtures, nine decision tables, and fifty-four rehearsal rows. Owner-only Sites publication remains pending. Public access, Hostinger DNS, custom-domain attachment, package freeze, and public GitHub synchronization remain unchanged.

The thirty-two-file research archive is 38,431 bytes with SHA-256 `8B947312FA5514D2110BD79B57AE74E5A4CCFDACEC0C37FCBFFDD975F3254D2B`.
