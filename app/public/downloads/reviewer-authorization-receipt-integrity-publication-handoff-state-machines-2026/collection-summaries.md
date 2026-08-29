# Reviewer Authorization, Receipt Integrity, and Publication-Handoff State Machines, 2026

Phase 57O executes 423 synthetic workflow cases across nine reviewer-role matrices, fifty-four receipt templates, and nine publication-handoff state machines while preserving every inherited outcome hold.

Captured: 2026-08-09

## Interpretation boundary

Every identity, receipt, citation, timestamp, and transition used in testing is synthetic. Only a complete accept fixture may enter a separate publication-review queue, and queue entry never publishes automatically.

## 1. Amtrak separates evidence and publication review across 2 contracts

**Publisher:** National Railroad Passenger Corporation

**Document type:** Data Release

**Capture status:** Official link record

2 role matrices authorize evidence, publication, and escalation review separately, and reject 2 same-actor accept configurations. Denominator: 2 matrices, 12 decision rows, 14 authorization cases, and zero actual reviewer identities.

### Key findings

- Evidence stage: Amtrak reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: 2 role matrices authorize evidence, publication, and escalation review separately, and reject 2 same-actor accept configurations.
- Denominator: 2 matrices, 12 decision rows, 14 authorization cases, and zero actual reviewer identities.
- Boundary: Role classes are workflow definitions, not assigned people.
- Boundary: An evidence reviewer cannot perform publication review for the same packet.
- Boundary: Authorization cannot supply evidence, fire a trigger, close a hold, or publish.
- Next action: Assign distinct named reviewers only when one complete cited packet enters actual review.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Role classes are workflow definitions, not assigned people.
- An evidence reviewer cannot perform publication review for the same packet.
- Authorization cannot supply evidence, fire a trigger, close a hold, or publish.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/01-amtrak-2-reviewer-role-authorization-matrices.txt`

## 2. Amtrak passes 60 receipt completeness and reason-code checks

**Publisher:** National Railroad Passenger Corporation

**Document type:** Data Release

**Capture status:** Official link record

Every Amtrak receipt template passes a complete synthetic case and rejects missing required fields or decision-incompatible reason codes. Denominator: 60 fixture-only integrity cases across 12 templates; zero failures and zero actual receipts.

### Key findings

- Evidence stage: Amtrak reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Every Amtrak receipt template passes a complete synthetic case and rejects missing required fields or decision-incompatible reason codes.
- Denominator: 60 fixture-only integrity cases across 12 templates; zero failures and zero actual receipts.
- Boundary: A complete synthetic receipt is not an actual review receipt.
- Boundary: Reason-code compatibility does not validate the underlying evidence.
- Boundary: Missing fields cannot be inferred or backfilled across records.
- Next action: Require every actual receipt field and decision-specific reason code before signing.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- A complete synthetic receipt is not an actual review receipt.
- Reason-code compatibility does not validate the underlying evidence.
- Missing fields cannot be inferred or backfilled across records.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/02-amtrak-60-receipt-completeness-reason-code-checks.txt`

## 3. Amtrak rejects 24 signed citation and timestamp mutations

**Publisher:** National Railroad Passenger Corporation

**Document type:** Data Release

**Capture status:** Official link record

Every post-signature Amtrak citation and decision-time mutation is detected against the immutable signed snapshot and rejected. Denominator: 24 mutation cases across 12 templates; all rejected and zero source records altered.

### Key findings

- Evidence stage: Amtrak reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Every post-signature Amtrak citation and decision-time mutation is detected against the immutable signed snapshot and rejected.
- Denominator: 24 mutation cases across 12 templates; all rejected and zero source records altered.
- Boundary: Synthetic mutation cases do not alter public source records.
- Boundary: Integrity rejection does not determine the substantive review outcome.
- Boundary: A rejected receipt cannot enter publication review.
- Next action: Preserve signed citation, timestamp, and digest values as immutable audit fields.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic mutation cases do not alter public source records.
- Integrity rejection does not determine the substantive review outcome.
- A rejected receipt cannot enter publication review.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/03-amtrak-24-citation-timestamp-mutation-rejections.txt`

## 4. Amtrak routes 20 publication-handoff cases without automatic publication

**Publisher:** National Railroad Passenger Corporation

**Document type:** Data Release

**Capture status:** Official link record

2 complete accept fixtures reach a separate publication-review queue, 10 non-accept fixtures terminate without handoff, and 8 invalid accept fixtures are rejected. Denominator: 20 state-machine cases across 2 contracts; zero actual handoffs, triggers, closures, or publications.

### Key findings

- Evidence stage: Amtrak reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: 2 complete accept fixtures reach a separate publication-review queue, 10 non-accept fixtures terminate without handoff, and 8 invalid accept fixtures are rejected.
- Denominator: 20 state-machine cases across 2 contracts; zero actual handoffs, triggers, closures, or publications.
- Boundary: Queue entry is not a publication decision.
- Boundary: Only complete accept receipts may reach separate publication review.
- Boundary: No state transition fires a trigger, closes a hold, or publishes automatically.
- Next action: Keep the publication queue empty until one actual complete accept receipt has a distinct authorized reviewer.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Queue entry is not a publication decision.
- Only complete accept receipts may reach separate publication review.
- No state transition fires a trigger, closes a hold, or publishes automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/04-amtrak-20-publication-handoff-state-routes.txt`

## 5. Amtrak records zero actual reviews, handoffs, triggers, closures, or publications

**Publisher:** National Railroad Passenger Corporation

**Document type:** Data Release

**Capture status:** Official link record

Authorization, integrity, and handoff fixtures prove bounded workflow behavior without evaluating evidence, assigning reviewers, or creating an editorial decision. Denominator: 94 executable cases, 12 receipt templates, and zero actual workflow events.

### Key findings

- Evidence stage: Amtrak reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Authorization, integrity, and handoff fixtures prove bounded workflow behavior without evaluating evidence, assigning reviewers, or creating an editorial decision.
- Denominator: 94 executable cases, 12 receipt templates, and zero actual workflow events.
- Boundary: Passing fixture tests are not candidate eligibility.
- Boundary: Synthetic roles and receipts do not create reviewer identity or evidence.
- Boundary: Human evidence review and separate publication review remain mandatory.
- Next action: Preserve the hold until a complete cited packet receives a named evidence decision and separate publication review.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Passing fixture tests are not candidate eligibility.
- Synthetic roles and receipts do not create reviewer identity or evidence.
- Human evidence review and separate publication review remain mandatory.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/05-amtrak-zero-actual-review-handoff-trigger-or-publication-events.txt`

## 6. Broadband separates evidence and publication review across 3 contracts

**Publisher:** Montana Department of Administration

**Document type:** Data Release

**Capture status:** Official link record

3 role matrices authorize evidence, publication, and escalation review separately, and reject 3 same-actor accept configurations. Denominator: 3 matrices, 18 decision rows, 21 authorization cases, and zero actual reviewer identities.

### Key findings

- Evidence stage: Broadband reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: 3 role matrices authorize evidence, publication, and escalation review separately, and reject 3 same-actor accept configurations.
- Denominator: 3 matrices, 18 decision rows, 21 authorization cases, and zero actual reviewer identities.
- Boundary: Role classes are workflow definitions, not assigned people.
- Boundary: An evidence reviewer cannot perform publication review for the same packet.
- Boundary: Authorization cannot supply evidence, fire a trigger, close a hold, or publish.
- Next action: Assign distinct named reviewers only when one complete cited packet enters actual review.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Role classes are workflow definitions, not assigned people.
- An evidence reviewer cannot perform publication review for the same packet.
- Authorization cannot supply evidence, fire a trigger, close a hold, or publish.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/_docs/connectmt/MT-BEAD-Final-Proposal-1.5.26.pdf

**Archive member:** `official-links/06-broadband-3-reviewer-role-authorization-matrices.txt`

## 7. Broadband passes 90 receipt completeness and reason-code checks

**Publisher:** Montana Department of Administration

**Document type:** Data Release

**Capture status:** Official link record

Every Broadband receipt template passes a complete synthetic case and rejects missing required fields or decision-incompatible reason codes. Denominator: 90 fixture-only integrity cases across 18 templates; zero failures and zero actual receipts.

### Key findings

- Evidence stage: Broadband reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Every Broadband receipt template passes a complete synthetic case and rejects missing required fields or decision-incompatible reason codes.
- Denominator: 90 fixture-only integrity cases across 18 templates; zero failures and zero actual receipts.
- Boundary: A complete synthetic receipt is not an actual review receipt.
- Boundary: Reason-code compatibility does not validate the underlying evidence.
- Boundary: Missing fields cannot be inferred or backfilled across records.
- Next action: Require every actual receipt field and decision-specific reason code before signing.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- A complete synthetic receipt is not an actual review receipt.
- Reason-code compatibility does not validate the underlying evidence.
- Missing fields cannot be inferred or backfilled across records.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/_docs/connectmt/MT-BEAD-Final-Proposal-1.5.26.pdf

**Archive member:** `official-links/07-broadband-90-receipt-completeness-reason-code-checks.txt`

## 8. Broadband rejects 36 signed citation and timestamp mutations

**Publisher:** Montana Department of Administration

**Document type:** Data Release

**Capture status:** Official link record

Every post-signature Broadband citation and decision-time mutation is detected against the immutable signed snapshot and rejected. Denominator: 36 mutation cases across 18 templates; all rejected and zero source records altered.

### Key findings

- Evidence stage: Broadband reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Every post-signature Broadband citation and decision-time mutation is detected against the immutable signed snapshot and rejected.
- Denominator: 36 mutation cases across 18 templates; all rejected and zero source records altered.
- Boundary: Synthetic mutation cases do not alter public source records.
- Boundary: Integrity rejection does not determine the substantive review outcome.
- Boundary: A rejected receipt cannot enter publication review.
- Next action: Preserve signed citation, timestamp, and digest values as immutable audit fields.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic mutation cases do not alter public source records.
- Integrity rejection does not determine the substantive review outcome.
- A rejected receipt cannot enter publication review.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/_docs/connectmt/MT-BEAD-Final-Proposal-1.5.26.pdf

**Archive member:** `official-links/08-broadband-36-citation-timestamp-mutation-rejections.txt`

## 9. Broadband routes 30 publication-handoff cases without automatic publication

**Publisher:** Montana Department of Administration

**Document type:** Data Release

**Capture status:** Official link record

3 complete accept fixtures reach a separate publication-review queue, 15 non-accept fixtures terminate without handoff, and 12 invalid accept fixtures are rejected. Denominator: 30 state-machine cases across 3 contracts; zero actual handoffs, triggers, closures, or publications.

### Key findings

- Evidence stage: Broadband reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: 3 complete accept fixtures reach a separate publication-review queue, 15 non-accept fixtures terminate without handoff, and 12 invalid accept fixtures are rejected.
- Denominator: 30 state-machine cases across 3 contracts; zero actual handoffs, triggers, closures, or publications.
- Boundary: Queue entry is not a publication decision.
- Boundary: Only complete accept receipts may reach separate publication review.
- Boundary: No state transition fires a trigger, closes a hold, or publishes automatically.
- Next action: Keep the publication queue empty until one actual complete accept receipt has a distinct authorized reviewer.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Queue entry is not a publication decision.
- Only complete accept receipts may reach separate publication review.
- No state transition fires a trigger, closes a hold, or publishes automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/_docs/connectmt/MT-BEAD-Final-Proposal-1.5.26.pdf

**Archive member:** `official-links/09-broadband-30-publication-handoff-state-routes.txt`

## 10. Broadband records zero actual reviews, handoffs, triggers, closures, or publications

**Publisher:** Montana Department of Administration

**Document type:** Data Release

**Capture status:** Official link record

Authorization, integrity, and handoff fixtures prove bounded workflow behavior without evaluating evidence, assigning reviewers, or creating an editorial decision. Denominator: 141 executable cases, 18 receipt templates, and zero actual workflow events.

### Key findings

- Evidence stage: Broadband reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Authorization, integrity, and handoff fixtures prove bounded workflow behavior without evaluating evidence, assigning reviewers, or creating an editorial decision.
- Denominator: 141 executable cases, 18 receipt templates, and zero actual workflow events.
- Boundary: Passing fixture tests are not candidate eligibility.
- Boundary: Synthetic roles and receipts do not create reviewer identity or evidence.
- Boundary: Human evidence review and separate publication review remain mandatory.
- Next action: Preserve the hold until a complete cited packet receives a named evidence decision and separate publication review.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Passing fixture tests are not candidate eligibility.
- Synthetic roles and receipts do not create reviewer identity or evidence.
- Human evidence review and separate publication review remain mandatory.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/_docs/connectmt/MT-BEAD-Final-Proposal-1.5.26.pdf

**Archive member:** `official-links/10-broadband-zero-actual-review-handoff-trigger-or-publication-events.txt`

## 11. Hanford separates evidence and publication review across 1 contracts

**Publisher:** U.S. Department of Energy, Office of Environmental Management

**Document type:** Data Release

**Capture status:** Official link record

1 role matrices authorize evidence, publication, and escalation review separately, and reject 1 same-actor accept configurations. Denominator: 1 matrices, 6 decision rows, 7 authorization cases, and zero actual reviewer identities.

### Key findings

- Evidence stage: Hanford reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: 1 role matrices authorize evidence, publication, and escalation review separately, and reject 1 same-actor accept configurations.
- Denominator: 1 matrices, 6 decision rows, 7 authorization cases, and zero actual reviewer identities.
- Boundary: Role classes are workflow definitions, not assigned people.
- Boundary: An evidence reviewer cannot perform publication review for the same packet.
- Boundary: Authorization cannot supply evidence, fire a trigger, close a hold, or publish.
- Next action: Assign distinct named reviewers only when one complete cited packet enters actual review.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Role classes are workflow definitions, not assigned people.
- An evidence reviewer cannot perform publication review for the same packet.
- Authorization cannot supply evidence, fire a trigger, close a hold, or publish.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/em/articles/hanford-releases-new-direct-feed-low-activity-waste-program-animation

**Archive member:** `official-links/11-hanford-1-reviewer-role-authorization-matrices.txt`

## 12. Hanford passes 30 receipt completeness and reason-code checks

**Publisher:** U.S. Department of Energy, Office of Environmental Management

**Document type:** Data Release

**Capture status:** Official link record

Every Hanford receipt template passes a complete synthetic case and rejects missing required fields or decision-incompatible reason codes. Denominator: 30 fixture-only integrity cases across 6 templates; zero failures and zero actual receipts.

### Key findings

- Evidence stage: Hanford reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Every Hanford receipt template passes a complete synthetic case and rejects missing required fields or decision-incompatible reason codes.
- Denominator: 30 fixture-only integrity cases across 6 templates; zero failures and zero actual receipts.
- Boundary: A complete synthetic receipt is not an actual review receipt.
- Boundary: Reason-code compatibility does not validate the underlying evidence.
- Boundary: Missing fields cannot be inferred or backfilled across records.
- Next action: Require every actual receipt field and decision-specific reason code before signing.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- A complete synthetic receipt is not an actual review receipt.
- Reason-code compatibility does not validate the underlying evidence.
- Missing fields cannot be inferred or backfilled across records.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/em/articles/hanford-releases-new-direct-feed-low-activity-waste-program-animation

**Archive member:** `official-links/12-hanford-30-receipt-completeness-reason-code-checks.txt`

## 13. Hanford rejects 12 signed citation and timestamp mutations

**Publisher:** U.S. Department of Energy, Office of Environmental Management

**Document type:** Data Release

**Capture status:** Official link record

Every post-signature Hanford citation and decision-time mutation is detected against the immutable signed snapshot and rejected. Denominator: 12 mutation cases across 6 templates; all rejected and zero source records altered.

### Key findings

- Evidence stage: Hanford reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Every post-signature Hanford citation and decision-time mutation is detected against the immutable signed snapshot and rejected.
- Denominator: 12 mutation cases across 6 templates; all rejected and zero source records altered.
- Boundary: Synthetic mutation cases do not alter public source records.
- Boundary: Integrity rejection does not determine the substantive review outcome.
- Boundary: A rejected receipt cannot enter publication review.
- Next action: Preserve signed citation, timestamp, and digest values as immutable audit fields.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic mutation cases do not alter public source records.
- Integrity rejection does not determine the substantive review outcome.
- A rejected receipt cannot enter publication review.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/em/articles/hanford-releases-new-direct-feed-low-activity-waste-program-animation

**Archive member:** `official-links/13-hanford-12-citation-timestamp-mutation-rejections.txt`

## 14. Hanford routes 10 publication-handoff cases without automatic publication

**Publisher:** U.S. Department of Energy, Office of Environmental Management

**Document type:** Data Release

**Capture status:** Official link record

1 complete accept fixtures reach a separate publication-review queue, 5 non-accept fixtures terminate without handoff, and 4 invalid accept fixtures are rejected. Denominator: 10 state-machine cases across 1 contracts; zero actual handoffs, triggers, closures, or publications.

### Key findings

- Evidence stage: Hanford reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: 1 complete accept fixtures reach a separate publication-review queue, 5 non-accept fixtures terminate without handoff, and 4 invalid accept fixtures are rejected.
- Denominator: 10 state-machine cases across 1 contracts; zero actual handoffs, triggers, closures, or publications.
- Boundary: Queue entry is not a publication decision.
- Boundary: Only complete accept receipts may reach separate publication review.
- Boundary: No state transition fires a trigger, closes a hold, or publishes automatically.
- Next action: Keep the publication queue empty until one actual complete accept receipt has a distinct authorized reviewer.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Queue entry is not a publication decision.
- Only complete accept receipts may reach separate publication review.
- No state transition fires a trigger, closes a hold, or publishes automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/em/articles/hanford-releases-new-direct-feed-low-activity-waste-program-animation

**Archive member:** `official-links/14-hanford-10-publication-handoff-state-routes.txt`

## 15. Hanford records zero actual reviews, handoffs, triggers, closures, or publications

**Publisher:** U.S. Department of Energy, Office of Environmental Management

**Document type:** Data Release

**Capture status:** Official link record

Authorization, integrity, and handoff fixtures prove bounded workflow behavior without evaluating evidence, assigning reviewers, or creating an editorial decision. Denominator: 47 executable cases, 6 receipt templates, and zero actual workflow events.

### Key findings

- Evidence stage: Hanford reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Authorization, integrity, and handoff fixtures prove bounded workflow behavior without evaluating evidence, assigning reviewers, or creating an editorial decision.
- Denominator: 47 executable cases, 6 receipt templates, and zero actual workflow events.
- Boundary: Passing fixture tests are not candidate eligibility.
- Boundary: Synthetic roles and receipts do not create reviewer identity or evidence.
- Boundary: Human evidence review and separate publication review remain mandatory.
- Next action: Preserve the hold until a complete cited packet receives a named evidence decision and separate publication review.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Passing fixture tests are not candidate eligibility.
- Synthetic roles and receipts do not create reviewer identity or evidence.
- Human evidence review and separate publication review remain mandatory.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/em/articles/hanford-releases-new-direct-feed-low-activity-waste-program-animation

**Archive member:** `official-links/15-hanford-zero-actual-review-handoff-trigger-or-publication-events.txt`

## 16. NNSA separates evidence and publication review across 3 contracts

**Publisher:** U.S. Department of Energy and National Nuclear Security Administration

**Document type:** Data Release

**Capture status:** Official link record

3 role matrices authorize evidence, publication, and escalation review separately, and reject 3 same-actor accept configurations. Denominator: 3 matrices, 18 decision rows, 21 authorization cases, and zero actual reviewer identities.

### Key findings

- Evidence stage: NNSA reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: 3 role matrices authorize evidence, publication, and escalation review separately, and reject 3 same-actor accept configurations.
- Denominator: 3 matrices, 18 decision rows, 21 authorization cases, and zero actual reviewer identities.
- Boundary: Role classes are workflow definitions, not assigned people.
- Boundary: An evidence reviewer cannot perform publication review for the same packet.
- Boundary: Authorization cannot supply evidence, fire a trigger, close a hold, or publish.
- Next action: Assign distinct named reviewers only when one complete cited packet enters actual review.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Role classes are workflow definitions, not assigned people.
- An evidence reviewer cannot perform publication review for the same packet.
- Authorization cannot supply evidence, fire a trigger, close a hold, or publish.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2025-06/doe-fy-2026-vol-1-wa.pdf

**Archive member:** `official-links/16-nnsa-3-reviewer-role-authorization-matrices.txt`

## 17. NNSA passes 90 receipt completeness and reason-code checks

**Publisher:** U.S. Department of Energy and National Nuclear Security Administration

**Document type:** Data Release

**Capture status:** Official link record

Every NNSA receipt template passes a complete synthetic case and rejects missing required fields or decision-incompatible reason codes. Denominator: 90 fixture-only integrity cases across 18 templates; zero failures and zero actual receipts.

### Key findings

- Evidence stage: NNSA reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Every NNSA receipt template passes a complete synthetic case and rejects missing required fields or decision-incompatible reason codes.
- Denominator: 90 fixture-only integrity cases across 18 templates; zero failures and zero actual receipts.
- Boundary: A complete synthetic receipt is not an actual review receipt.
- Boundary: Reason-code compatibility does not validate the underlying evidence.
- Boundary: Missing fields cannot be inferred or backfilled across records.
- Next action: Require every actual receipt field and decision-specific reason code before signing.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- A complete synthetic receipt is not an actual review receipt.
- Reason-code compatibility does not validate the underlying evidence.
- Missing fields cannot be inferred or backfilled across records.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2025-06/doe-fy-2026-vol-1-wa.pdf

**Archive member:** `official-links/17-nnsa-90-receipt-completeness-reason-code-checks.txt`

## 18. NNSA rejects 36 signed citation and timestamp mutations

**Publisher:** U.S. Department of Energy and National Nuclear Security Administration

**Document type:** Data Release

**Capture status:** Official link record

Every post-signature NNSA citation and decision-time mutation is detected against the immutable signed snapshot and rejected. Denominator: 36 mutation cases across 18 templates; all rejected and zero source records altered.

### Key findings

- Evidence stage: NNSA reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Every post-signature NNSA citation and decision-time mutation is detected against the immutable signed snapshot and rejected.
- Denominator: 36 mutation cases across 18 templates; all rejected and zero source records altered.
- Boundary: Synthetic mutation cases do not alter public source records.
- Boundary: Integrity rejection does not determine the substantive review outcome.
- Boundary: A rejected receipt cannot enter publication review.
- Next action: Preserve signed citation, timestamp, and digest values as immutable audit fields.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic mutation cases do not alter public source records.
- Integrity rejection does not determine the substantive review outcome.
- A rejected receipt cannot enter publication review.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2025-06/doe-fy-2026-vol-1-wa.pdf

**Archive member:** `official-links/18-nnsa-36-citation-timestamp-mutation-rejections.txt`

## 19. NNSA routes 30 publication-handoff cases without automatic publication

**Publisher:** U.S. Department of Energy and National Nuclear Security Administration

**Document type:** Data Release

**Capture status:** Official link record

3 complete accept fixtures reach a separate publication-review queue, 15 non-accept fixtures terminate without handoff, and 12 invalid accept fixtures are rejected. Denominator: 30 state-machine cases across 3 contracts; zero actual handoffs, triggers, closures, or publications.

### Key findings

- Evidence stage: NNSA reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: 3 complete accept fixtures reach a separate publication-review queue, 15 non-accept fixtures terminate without handoff, and 12 invalid accept fixtures are rejected.
- Denominator: 30 state-machine cases across 3 contracts; zero actual handoffs, triggers, closures, or publications.
- Boundary: Queue entry is not a publication decision.
- Boundary: Only complete accept receipts may reach separate publication review.
- Boundary: No state transition fires a trigger, closes a hold, or publishes automatically.
- Next action: Keep the publication queue empty until one actual complete accept receipt has a distinct authorized reviewer.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Queue entry is not a publication decision.
- Only complete accept receipts may reach separate publication review.
- No state transition fires a trigger, closes a hold, or publishes automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2025-06/doe-fy-2026-vol-1-wa.pdf

**Archive member:** `official-links/19-nnsa-30-publication-handoff-state-routes.txt`

## 20. NNSA records zero actual reviews, handoffs, triggers, closures, or publications

**Publisher:** U.S. Department of Energy and National Nuclear Security Administration

**Document type:** Data Release

**Capture status:** Official link record

Authorization, integrity, and handoff fixtures prove bounded workflow behavior without evaluating evidence, assigning reviewers, or creating an editorial decision. Denominator: 141 executable cases, 18 receipt templates, and zero actual workflow events.

### Key findings

- Evidence stage: NNSA reviewer authorization, receipt integrity, and publication handoff controls.
- Finding: Authorization, integrity, and handoff fixtures prove bounded workflow behavior without evaluating evidence, assigning reviewers, or creating an editorial decision.
- Denominator: 141 executable cases, 18 receipt templates, and zero actual workflow events.
- Boundary: Passing fixture tests are not candidate eligibility.
- Boundary: Synthetic roles and receipts do not create reviewer identity or evidence.
- Boundary: Human evidence review and separate publication review remain mandatory.
- Next action: Preserve the hold until a complete cited packet receives a named evidence decision and separate publication review.

### Why it matters

The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Passing fixture tests are not candidate eligibility.
- Synthetic roles and receipts do not create reviewer identity or evidence.
- Human evidence review and separate publication review remain mandatory.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2025-06/doe-fy-2026-vol-1-wa.pdf

**Archive member:** `official-links/20-nnsa-zero-actual-review-handoff-trigger-or-publication-events.txt`

## 21. Amtrak PIDS closeout remains In Review after authorization and receipt-integrity execution

**Publisher:** National Railroad Passenger Corporation

**Document type:** Technical Report

**Capture status:** Official link record

47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists. Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.

### Key findings

- Evidence stage: Authorization, integrity, and handoff hold.
- Finding: 47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists.
- Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.
- Boundary: Synthetic authorization and integrity passage is not evidence or eligibility.
- Boundary: No fixture creates a reviewer identity, signed receipt, or publication decision.
- Boundary: The inherited hold cannot close automatically.
- Next action: Code-bearing official current asset register or closeout table

### Why it matters

The hold remains actionable while synthetic authorization and integrity results stay separate from an actual cited packet and named human decision.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic authorization and integrity passage is not evidence or eligibility.
- No fixture creates a reviewer identity, signed receipt, or publication decision.
- The inherited hold cannot close automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/21-preserved-amtrak-pids.txt`

## 22. Amtrak named-asset reliability remains In Review after authorization and receipt-integrity execution

**Publisher:** National Railroad Passenger Corporation

**Document type:** Technical Report

**Capture status:** Official link record

47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists. Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.

### Key findings

- Evidence stage: Authorization, integrity, and handoff hold.
- Finding: 47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists.
- Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.
- Boundary: Synthetic authorization and integrity passage is not evidence or eligibility.
- Boundary: No fixture creates a reviewer identity, signed receipt, or publication decision.
- Boundary: The inherited hold cannot close automatically.
- Next action: Named-asset-period reliability table

### Why it matters

The hold remains actionable while synthetic authorization and integrity results stay separate from an actual cited packet and named human decision.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic authorization and integrity passage is not evidence or eligibility.
- No fixture creates a reviewer identity, signed receipt, or publication decision.
- The inherited hold cannot close automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/22-preserved-amtrak-reliability.txt`

## 23. Louisiana Nextlink adoption remains In Review after authorization and receipt-integrity execution

**Publisher:** Louisiana Office of Broadband Development and Connectivity

**Document type:** Technical Report

**Capture status:** Official link record

47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists. Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.

### Key findings

- Evidence stage: Authorization, integrity, and handoff hold.
- Finding: 47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists.
- Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.
- Boundary: Synthetic authorization and integrity passage is not evidence or eligibility.
- Boundary: No fixture creates a reviewer identity, signed receipt, or publication decision.
- Boundary: The inherited hold cannot close automatically.
- Next action: Privacy-safe official completed-period adoption table

### Why it matters

The hold remains actionable while synthetic authorization and integrity results stay separate from an actual cited packet and named human decision.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic authorization and integrity passage is not evidence or eligibility.
- No fixture creates a reviewer identity, signed receipt, or publication decision.
- The inherited hold cannot close automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://connect.la.gov/press-releases/nextlink-activates-first-bead-funded-tower-in-the-united-states-connecting-rural-louisiana

**Archive member:** `official-links/23-preserved-la-nextlink-adoption.txt`

## 24. Louisiana Starlink adoption remains In Review after authorization and receipt-integrity execution

**Publisher:** Louisiana Office of Broadband Development and Connectivity

**Document type:** Technical Report

**Capture status:** Official link record

47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists. Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.

### Key findings

- Evidence stage: Authorization, integrity, and handoff hold.
- Finding: 47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists.
- Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.
- Boundary: Synthetic authorization and integrity passage is not evidence or eligibility.
- Boundary: No fixture creates a reviewer identity, signed receipt, or publication decision.
- Boundary: The inherited hold cannot close automatically.
- Next action: Privacy-safe official completed-period LEO adoption table

### Why it matters

The hold remains actionable while synthetic authorization and integrity results stay separate from an actual cited packet and named human decision.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic authorization and integrity passage is not evidence or eligibility.
- No fixture creates a reviewer identity, signed receipt, or publication decision.
- The inherited hold cannot close automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://connect.la.gov/press-releases/louisiana-signs-bead-grant-agreement-with-spacexs-starlink-continuing-push-for-statewide-broadband-access

**Archive member:** `official-links/24-preserved-la-starlink-adoption.txt`

## 25. Montana BEAD completed quarter remains In Review after authorization and receipt-integrity execution

**Publisher:** Montana Department of Administration

**Document type:** Technical Report

**Capture status:** Official link record

47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists. Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.

### Key findings

- Evidence stage: Authorization, integrity, and handoff hold.
- Finding: 47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists.
- Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.
- Boundary: Synthetic authorization and integrity passage is not evidence or eligibility.
- Boundary: No fixture creates a reviewer identity, signed receipt, or publication decision.
- Boundary: The inherited hold cannot close automatically.
- Next action: Completed public project-quarter table

### Why it matters

The hold remains actionable while synthetic authorization and integrity results stay separate from an actual cited packet and named human decision.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic authorization and integrity passage is not evidence or eligibility.
- No fixture creates a reviewer identity, signed receipt, or publication decision.
- The inherited hold cannot close automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/ConnectMT/iija/

**Archive member:** `official-links/25-preserved-mt-bead-quarter.txt`

## 26. Hanford complete material balance remains In Review after authorization and receipt-integrity execution

**Publisher:** U.S. Department of Energy Hanford Field Office and Washington State Department of Ecology

**Document type:** Technical Report

**Capture status:** Official link record

47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists. Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.

### Key findings

- Evidence stage: Authorization, integrity, and handoff hold.
- Finding: 47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists.
- Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.
- Boundary: Synthetic authorization and integrity passage is not evidence or eligibility.
- Boundary: No fixture creates a reviewer identity, signed receipt, or publication decision.
- Boundary: The inherited hold cannot close automatically.
- Next action: Stable-identity transfer, receipt, and disposition evidence chain

### Why it matters

The hold remains actionable while synthetic authorization and integrity results stay separate from an actual cited packet and named human decision.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic authorization and integrity passage is not evidence or eligibility.
- No fixture creates a reviewer identity, signed receipt, or publication decision.
- The inherited hold cannot close automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://pdw.hanford.gov/download/v2/AR-39756

**Archive member:** `official-links/26-preserved-hanford-mass-balance.txt`

## 27. NNSA recurring qualified rate remains In Review after authorization and receipt-integrity execution

**Publisher:** National Nuclear Security Administration

**Document type:** Technical Report

**Capture status:** Official link record

47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists. Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.

### Key findings

- Evidence stage: Authorization, integrity, and handoff hold.
- Finding: 47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists.
- Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.
- Boundary: Synthetic authorization and integrity passage is not evidence or eligibility.
- Boundary: No fixture creates a reviewer identity, signed receipt, or publication decision.
- Boundary: The inherited hold cannot close automatically.
- Next action: Official site-period recurring qualified-output table

### Why it matters

The hold remains actionable while synthetic authorization and integrity results stay separate from an actual cited packet and named human decision.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic authorization and integrity passage is not evidence or eligibility.
- No fixture creates a reviewer identity, signed receipt, or publication decision.
- The inherited hold cannot close automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/nnsa/plutonium-pit-production

**Archive member:** `official-links/27-preserved-nnsa-qualified-rate.txt`

## 28. NNSA accepted operating capacity remains In Review after authorization and receipt-integrity execution

**Publisher:** National Nuclear Security Administration

**Document type:** Technical Report

**Capture status:** Official link record

47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists. Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.

### Key findings

- Evidence stage: Authorization, integrity, and handoff hold.
- Finding: 47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists.
- Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.
- Boundary: Synthetic authorization and integrity passage is not evidence or eligibility.
- Boundary: No fixture creates a reviewer identity, signed receipt, or publication decision.
- Boundary: The inherited hold cannot close automatically.
- Next action: Official site-period installed, qualified, and accepted capacity table

### Why it matters

The hold remains actionable while synthetic authorization and integrity results stay separate from an actual cited packet and named human decision.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic authorization and integrity passage is not evidence or eligibility.
- No fixture creates a reviewer identity, signed receipt, or publication decision.
- The inherited hold cannot close automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2026-04/draft-eis-0573-plutonium-pit-production-vol-1-2026-04.pdf

**Archive member:** `official-links/28-preserved-nnsa-accepted-capacity.txt`

## 29. NNSA GAO enterprise baseline remains In Review after authorization and receipt-integrity execution

**Publisher:** U.S. Government Accountability Office

**Document type:** Technical Report

**Capture status:** Official link record

47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists. Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.

### Key findings

- Evidence stage: Authorization, integrity, and handoff hold.
- Finding: 47 fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists.
- Denominator: One inherited hold, one role matrix, 30 integrity cases, 7 authorization cases, 10 handoff cases, zero actual receipts, and zero trigger events.
- Boundary: Synthetic authorization and integrity passage is not evidence or eligibility.
- Boundary: No fixture creates a reviewer identity, signed receipt, or publication decision.
- Boundary: The inherited hold cannot close automatically.
- Next action: GAO recommendation-status record with responsive agency evidence

### Why it matters

The hold remains actionable while synthetic authorization and integrity results stay separate from an actual cited packet and named human decision.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic authorization and integrity passage is not evidence or eligibility.
- No fixture creates a reviewer identity, signed receipt, or publication decision.
- The inherited hold cannot close automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.gao.gov/products/gao-23-104661

**Archive member:** `official-links/29-preserved-nnsa-gao-baseline.txt`
