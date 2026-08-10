# Phase 57O: Reviewer-Role Authorization, Receipt-Integrity Checks, And Publication-Handoff State Machines

Date: 2026-08-09

Status: complete and release-validated locally; deployment not requested

## Goal

Require distinct reviewer authority, immutable complete receipts, and an explicit publication-handoff state boundary before any future actual evidence decision can advance.

## Publication contract

- Review twenty-nine Phase 57O records.
- Publish twenty reviewer-authorization, receipt-integrity, and publication-handoff controls.
- Preserve all nine Phase 57N outcome holds exactly once and add no new hold.
- Reuse thirty-six Tier 1 source profiles and add no new source profile.
- Define one reviewer-role matrix for every Phase 57L reopening contract and cover all fifty-four Phase 57M decision rows.
- Require a distinct evidence reviewer and publication reviewer for every accept path.
- Validate every Phase 57N receipt template for completeness, decision-specific reason-code compatibility, immutable cited-source fields, immutable decision time, and signed-field digest integrity.
- Prove that only a complete accept receipt can enter a separate publication-review queue.
- Evaluate zero actual candidate packets, create zero actual reviewer identities or receipts, fire zero triggers, and permit no automated closure or publication.
- Preserve the visible-scope ledger and the one Closed / twenty-one Partially Closed / two Open entity ledger.

## Reviewer-role authorization matrices

Nine matrices define three non-interchangeable role classes:

1. an evidence reviewer may inspect a cited packet, select one bounded decision, and sign the evidence receipt;
2. a publication reviewer may inspect a complete accept receipt and record a later publication-review outcome, but may not be the evidence reviewer for the same packet; and
3. an escalation reviewer may resolve role or integrity exceptions without supplying evidence, mutating a signed receipt, firing a trigger, closing a hold, or publishing.

The matrices contain fifty-four decision-authorization rows and execute sixty-three authorization cases. All fifty-four valid fixture configurations pass, and all nine same-actor accept configurations are rejected with `evidence_and_publication_reviewers_must_differ`. No actual reviewer identity or authorization is created.

### Rail summary

| Rail | Contracts | Decision rows | Authorization cases | Same-actor rejections |
| --- | ---: | ---: | ---: | ---: |
| Amtrak | 2 | 12 | 14 | 2 |
| Broadband | 3 | 18 | 21 | 3 |
| Hanford | 1 | 6 | 7 | 1 |
| NNSA | 3 | 18 | 21 | 3 |
| Total | 9 | 54 | 63 | 9 |

## Receipt-integrity checks

Every one of the fifty-four Phase 57N templates executes five synthetic cases:

1. a complete fixture receipt;
2. a missing required-field rejection;
3. a decision-incompatible reason-code rejection;
4. a signed-citation mutation rejection; and
5. a signed-decision-time mutation rejection.

All 270 cases pass their expected route. The complete fixtures validate only the receipt schema and do not become actual receipts. Missing values cannot be inferred, incompatible reason codes cannot be substituted, and any changed citation or decision time is rejected against the immutable signed snapshot and digest.

## Publication-handoff state machines

Nine contract-specific state machines execute ninety fixture routes:

| Route | Executions |
| --- | ---: |
| Complete accept receipt to separate publication-review queue | 9 |
| Complete non-accept receipt to terminal no-handoff state | 45 |
| Invalid accept receipt to integrity-rejected state | 36 |
| Total | 90 |

Queue entry is not publication. An accept fixture reaches `awaiting_separate_publication_review` only after receipt integrity and distinct-role authorization pass. Non-accept fixtures cannot enter the queue, invalid accept fixtures stop before it, and no transition fires a trigger, closes a hold, or publishes automatically.

## Published controls

Five workflow controls publish for each rail:

1. reviewer-role authorization and separation of duties;
2. receipt completeness and reason-code compatibility;
3. signed citation and decision-time mutation rejection;
4. publication-handoff state routing; and
5. zero actual reviewer, receipt, handoff, trigger, closure, or publication events.

The nine inherited Amtrak closeout and reliability, Louisiana and Montana adoption, Hanford material-balance, NNSA recurring-output and accepted-capacity, and GAO enterprise-baseline records remain In Review.

## Content outputs

- `app/scripts/phase57o-workflow-harness.mjs`;
- `app/scripts/assert-phase57o.mjs`;
- `app/src/data/phase-57o-reviewer-role-authorization-matrices.json`;
- `app/src/data/phase-57o-receipt-integrity-checks.json`;
- `app/src/data/phase-57o-publication-handoff-state-machines.json`;
- `app/src/data/phase-57o-workflow-harness-results.json`;
- `app/src/data/phase-57o-reviewer-role-authorization-receipt-integrity-publication-handoff-state-machines.json`;
- `app/src/data/phase-57o-publication-review.json`;
- twenty-nine research documents;
- twenty-nine signals;
- Research Watch 045;
- one research collection;
- one public update;
- one thirty-two-file downloadable archive;
- five deepened topics, three reader pathways, and one dependency map.

## Evidence boundaries

- A role class is not an assigned reviewer identity.
- A complete synthetic receipt is not an actual receipt or evidence decision.
- Receipt integrity does not validate the truth or sufficiency of cited evidence.
- A publication-review queue entry is not a publication decision.
- An evidence reviewer cannot also perform publication review for the same packet.
- Signed citations, decision times, reason codes, and receipt fields cannot be mutated or backfilled after signing.
- Values cannot be invented, transformed, or assembled across records.
- Missing public evidence does not mean nonexistent, withheld, or never submitted.
- Agency assertions and independent oversight remain separate.
- FTFN submitted no agency contact or FOIA request.
- No ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference is supported.

## Phase 57P handoff

Build append-only dual-review audit chains, cross-role adjudication fixtures, and publication-review decision receipts across all nine contracts. Test evidence-review and publication-review disagreement, escalation ownership, supersession without mutation, and publication-review reason-code compatibility. Prove that an evidence receipt and a later publication-review receipt remain separately attributable and immutable, that disagreement cannot be collapsed into an accept outcome, and that no audit-chain event fires a trigger, closes a hold, or publishes automatically. Preserve all nine Phase 57O holds and keep every synthetic identity, receipt, adjudication, and transition outside the evidence ledger.

## Validation checkpoint

Private-candidate validation, content references, source health, Astro diagnostics, the expected 2,767-page production build, the Phase 57O harness and assertions, release assertions, sitemap membership, exports, private-registry exclusion, and the thirty-two-file archive must pass at 715 sources, 873 signals, 676 Published, 197 In Review, fifty-three briefings, fifty collections, 989 research documents, nine role matrices, 270 integrity cases, sixty-three authorization cases, and ninety handoff cases.

The archive is 39,395 bytes with SHA-256 `DE4E3A4B99229099CDF3DAB0A62767D570788860026F37421EE4F8BB9AB418F2`.

Deployment was not requested. Owner-only Sites version 70 continues to serve the exact Phase 57N runtime commit `77654203b4ce005620138de766966e5f3e2236c6` in `appgdep_6a792e9a01fc819192dabb660ae9bcd3` with one owner, no groups, no editors, and zero external visitors. Public access, Hostinger DNS, custom-domain attachment, package freeze, and public GitHub synchronization remain unchanged.
