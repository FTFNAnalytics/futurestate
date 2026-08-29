# Dual-Review Audit Chains, Adjudication, and Publication-Decision Receipts, 2026

Phase 57P executes 333 synthetic append-only dual-review cases across nine audit chains while preserving every inherited outcome hold and requiring manual release after concordant accept.

Captured: 2026-08-09

## Interpretation boundary

Every identity, receipt, event, disagreement, escalation, and supersession is synthetic. Evidence and publication receipts remain separately attributable, earlier receipts remain immutable, and even concordant accept requires a separate manual release authorization.

## 1. Amtrak defines 2 append-only dual-review audit chains

**Publisher:** National Railroad Passenger Corporation

**Document type:** Data Release

**Capture status:** Official link record

2 contract-specific chains link evidence, publication, adjudication, supersession, release-authorization, and withdrawal events without permitting prior-event mutation. Denominator: 2 immutable schemas, six append-only event types per schema, and zero actual audit events.

### Key findings

- Evidence stage: Amtrak append-only audit, adjudication, and publication-receipt controls.
- Finding: 2 contract-specific chains link evidence, publication, adjudication, supersession, release-authorization, and withdrawal events without permitting prior-event mutation.
- Denominator: 2 immutable schemas, six append-only event types per schema, and zero actual audit events.
- Boundary: Audit schemas are workflow controls, not actual review history.
- Boundary: A later event may reference but never update, replace, or delete a prior receipt.
- Boundary: Audit-chain completion cannot trigger, close, release, or publish automatically.
- Next action: Create the first actual chain only after one complete cited packet receives a named evidence-review receipt.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Audit schemas are workflow controls, not actual review history.
- A later event may reference but never update, replace, or delete a prior receipt.
- Audit-chain completion cannot trigger, close, release, or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/01-amtrak-2-append-only-dual-review-audit-chain-schemas.txt`

## 2. Amtrak passes 18 append-only audit-chain integrity cases

**Publisher:** National Railroad Passenger Corporation

**Document type:** Data Release

**Capture status:** Official link record

Every Amtrak chain accepts ordered appends and rejects payload mutation, event replacement, time regression, and duplicate identifiers while preserving superseded receipts. Denominator: 18 fixture-only audit cases across 2 contracts; zero failures and zero actual audit events.

### Key findings

- Evidence stage: Amtrak append-only audit, adjudication, and publication-receipt controls.
- Finding: Every Amtrak chain accepts ordered appends and rejects payload mutation, event replacement, time regression, and duplicate identifiers while preserving superseded receipts.
- Denominator: 18 fixture-only audit cases across 2 contracts; zero failures and zero actual audit events.
- Boundary: Passing fixtures do not create evidence or reviewer history.
- Boundary: A valid hash link does not validate the underlying claim.
- Boundary: Supersession preserves rather than rewrites the earlier decision.
- Next action: Require contiguous sequence, increasing time, prior-event digest, payload digest, and immutable event digest for every actual append.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Passing fixtures do not create evidence or reviewer history.
- A valid hash link does not validate the underlying claim.
- Supersession preserves rather than rewrites the earlier decision.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/02-amtrak-18-audit-chain-integrity-cases.txt`

## 3. Amtrak passes 36 publication-review receipt cases

**Publisher:** National Railroad Passenger Corporation

**Document type:** Data Release

**Capture status:** Official link record

12 decision-specific receipt fixtures validate, while 24 incompatible-reason or mutated-attribution fixtures are rejected. Denominator: 36 cases across six publication decisions and 2 contracts; zero actual publication receipts.

### Key findings

- Evidence stage: Amtrak append-only audit, adjudication, and publication-receipt controls.
- Finding: 12 decision-specific receipt fixtures validate, while 24 incompatible-reason or mutated-attribution fixtures are rejected.
- Denominator: 36 cases across six publication decisions and 2 contracts; zero actual publication receipts.
- Boundary: A valid synthetic publication receipt is not a publication decision.
- Boundary: Publication attribution must remain distinct from evidence-review attribution.
- Boundary: A publication receipt cannot replace the linked evidence receipt.
- Next action: Require a separate signed publication receipt with a decision-specific reason code and immutable evidence-receipt digest.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- A valid synthetic publication receipt is not a publication decision.
- Publication attribution must remain distinct from evidence-review attribution.
- A publication receipt cannot replace the linked evidence receipt.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/03-amtrak-36-publication-review-decision-receipt-cases.txt`

## 4. Amtrak routes 20 cross-role adjudication cases without automatic release

**Publisher:** National Railroad Passenger Corporation

**Document type:** Data Release

**Capture status:** Official link record

2 concordant accept fixtures await manual release, 10 disagreements or bounded blocks escalate explicitly, and 2 later decisions append without mutation. Denominator: 20 adjudication fixtures across 2 contracts; zero actual escalations, releases, triggers, closures, or publications.

### Key findings

- Evidence stage: Amtrak append-only audit, adjudication, and publication-receipt controls.
- Finding: 2 concordant accept fixtures await manual release, 10 disagreements or bounded blocks escalate explicitly, and 2 later decisions append without mutation.
- Denominator: 20 adjudication fixtures across 2 contracts; zero actual escalations, releases, triggers, closures, or publications.
- Boundary: Disagreement cannot collapse into accept.
- Boundary: Escalation requires a third role distinct from both reviewers.
- Boundary: Even dual accept requires separate manual release authorization.
- Next action: Keep all disagreement states unresolved until a distinct human escalation owner records an append-only outcome.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Disagreement cannot collapse into accept.
- Escalation requires a third role distinct from both reviewers.
- Even dual accept requires separate manual release authorization.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/04-amtrak-20-cross-role-adjudication-cases.txt`

## 5. Amtrak records zero actual audit, adjudication, release, or publication events

**Publisher:** National Railroad Passenger Corporation

**Document type:** Data Release

**Capture status:** Official link record

Append-only chains, publication receipts, and adjudication fixtures prove bounded workflow behavior without assigning a person, evaluating evidence, authorizing release, or publishing. Denominator: 74 executable cases across 2 contracts and zero actual workflow events.

### Key findings

- Evidence stage: Amtrak append-only audit, adjudication, and publication-receipt controls.
- Finding: Append-only chains, publication receipts, and adjudication fixtures prove bounded workflow behavior without assigning a person, evaluating evidence, authorizing release, or publishing.
- Denominator: 74 executable cases across 2 contracts and zero actual workflow events.
- Boundary: Synthetic identities and receipts remain outside the evidence ledger.
- Boundary: Manual release authorization remains absent.
- Boundary: No fixture changes eligibility, trigger, closure, publication, or operating-outcome state.
- Next action: Preserve the hold until separately attributable evidence and publication receipts are followed by an explicit manual release decision.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic identities and receipts remain outside the evidence ledger.
- Manual release authorization remains absent.
- No fixture changes eligibility, trigger, closure, publication, or operating-outcome state.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/05-amtrak-zero-actual-audit-adjudication-release-or-publication-events.txt`

## 6. Broadband defines 3 append-only dual-review audit chains

**Publisher:** Montana Department of Administration

**Document type:** Data Release

**Capture status:** Official link record

3 contract-specific chains link evidence, publication, adjudication, supersession, release-authorization, and withdrawal events without permitting prior-event mutation. Denominator: 3 immutable schemas, six append-only event types per schema, and zero actual audit events.

### Key findings

- Evidence stage: Broadband append-only audit, adjudication, and publication-receipt controls.
- Finding: 3 contract-specific chains link evidence, publication, adjudication, supersession, release-authorization, and withdrawal events without permitting prior-event mutation.
- Denominator: 3 immutable schemas, six append-only event types per schema, and zero actual audit events.
- Boundary: Audit schemas are workflow controls, not actual review history.
- Boundary: A later event may reference but never update, replace, or delete a prior receipt.
- Boundary: Audit-chain completion cannot trigger, close, release, or publish automatically.
- Next action: Create the first actual chain only after one complete cited packet receives a named evidence-review receipt.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Audit schemas are workflow controls, not actual review history.
- A later event may reference but never update, replace, or delete a prior receipt.
- Audit-chain completion cannot trigger, close, release, or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/_docs/connectmt/MT-BEAD-Final-Proposal-1.5.26.pdf

**Archive member:** `official-links/06-broadband-3-append-only-dual-review-audit-chain-schemas.txt`

## 7. Broadband passes 27 append-only audit-chain integrity cases

**Publisher:** Montana Department of Administration

**Document type:** Data Release

**Capture status:** Official link record

Every Broadband chain accepts ordered appends and rejects payload mutation, event replacement, time regression, and duplicate identifiers while preserving superseded receipts. Denominator: 27 fixture-only audit cases across 3 contracts; zero failures and zero actual audit events.

### Key findings

- Evidence stage: Broadband append-only audit, adjudication, and publication-receipt controls.
- Finding: Every Broadband chain accepts ordered appends and rejects payload mutation, event replacement, time regression, and duplicate identifiers while preserving superseded receipts.
- Denominator: 27 fixture-only audit cases across 3 contracts; zero failures and zero actual audit events.
- Boundary: Passing fixtures do not create evidence or reviewer history.
- Boundary: A valid hash link does not validate the underlying claim.
- Boundary: Supersession preserves rather than rewrites the earlier decision.
- Next action: Require contiguous sequence, increasing time, prior-event digest, payload digest, and immutable event digest for every actual append.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Passing fixtures do not create evidence or reviewer history.
- A valid hash link does not validate the underlying claim.
- Supersession preserves rather than rewrites the earlier decision.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/_docs/connectmt/MT-BEAD-Final-Proposal-1.5.26.pdf

**Archive member:** `official-links/07-broadband-27-audit-chain-integrity-cases.txt`

## 8. Broadband passes 54 publication-review receipt cases

**Publisher:** Montana Department of Administration

**Document type:** Data Release

**Capture status:** Official link record

18 decision-specific receipt fixtures validate, while 36 incompatible-reason or mutated-attribution fixtures are rejected. Denominator: 54 cases across six publication decisions and 3 contracts; zero actual publication receipts.

### Key findings

- Evidence stage: Broadband append-only audit, adjudication, and publication-receipt controls.
- Finding: 18 decision-specific receipt fixtures validate, while 36 incompatible-reason or mutated-attribution fixtures are rejected.
- Denominator: 54 cases across six publication decisions and 3 contracts; zero actual publication receipts.
- Boundary: A valid synthetic publication receipt is not a publication decision.
- Boundary: Publication attribution must remain distinct from evidence-review attribution.
- Boundary: A publication receipt cannot replace the linked evidence receipt.
- Next action: Require a separate signed publication receipt with a decision-specific reason code and immutable evidence-receipt digest.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- A valid synthetic publication receipt is not a publication decision.
- Publication attribution must remain distinct from evidence-review attribution.
- A publication receipt cannot replace the linked evidence receipt.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/_docs/connectmt/MT-BEAD-Final-Proposal-1.5.26.pdf

**Archive member:** `official-links/08-broadband-54-publication-review-decision-receipt-cases.txt`

## 9. Broadband routes 30 cross-role adjudication cases without automatic release

**Publisher:** Montana Department of Administration

**Document type:** Data Release

**Capture status:** Official link record

3 concordant accept fixtures await manual release, 15 disagreements or bounded blocks escalate explicitly, and 3 later decisions append without mutation. Denominator: 30 adjudication fixtures across 3 contracts; zero actual escalations, releases, triggers, closures, or publications.

### Key findings

- Evidence stage: Broadband append-only audit, adjudication, and publication-receipt controls.
- Finding: 3 concordant accept fixtures await manual release, 15 disagreements or bounded blocks escalate explicitly, and 3 later decisions append without mutation.
- Denominator: 30 adjudication fixtures across 3 contracts; zero actual escalations, releases, triggers, closures, or publications.
- Boundary: Disagreement cannot collapse into accept.
- Boundary: Escalation requires a third role distinct from both reviewers.
- Boundary: Even dual accept requires separate manual release authorization.
- Next action: Keep all disagreement states unresolved until a distinct human escalation owner records an append-only outcome.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Disagreement cannot collapse into accept.
- Escalation requires a third role distinct from both reviewers.
- Even dual accept requires separate manual release authorization.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/_docs/connectmt/MT-BEAD-Final-Proposal-1.5.26.pdf

**Archive member:** `official-links/09-broadband-30-cross-role-adjudication-cases.txt`

## 10. Broadband records zero actual audit, adjudication, release, or publication events

**Publisher:** Montana Department of Administration

**Document type:** Data Release

**Capture status:** Official link record

Append-only chains, publication receipts, and adjudication fixtures prove bounded workflow behavior without assigning a person, evaluating evidence, authorizing release, or publishing. Denominator: 111 executable cases across 3 contracts and zero actual workflow events.

### Key findings

- Evidence stage: Broadband append-only audit, adjudication, and publication-receipt controls.
- Finding: Append-only chains, publication receipts, and adjudication fixtures prove bounded workflow behavior without assigning a person, evaluating evidence, authorizing release, or publishing.
- Denominator: 111 executable cases across 3 contracts and zero actual workflow events.
- Boundary: Synthetic identities and receipts remain outside the evidence ledger.
- Boundary: Manual release authorization remains absent.
- Boundary: No fixture changes eligibility, trigger, closure, publication, or operating-outcome state.
- Next action: Preserve the hold until separately attributable evidence and publication receipts are followed by an explicit manual release decision.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic identities and receipts remain outside the evidence ledger.
- Manual release authorization remains absent.
- No fixture changes eligibility, trigger, closure, publication, or operating-outcome state.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/_docs/connectmt/MT-BEAD-Final-Proposal-1.5.26.pdf

**Archive member:** `official-links/10-broadband-zero-actual-audit-adjudication-release-or-publication-events.txt`

## 11. Hanford defines 1 append-only dual-review audit chains

**Publisher:** U.S. Department of Energy, Office of Environmental Management

**Document type:** Data Release

**Capture status:** Official link record

1 contract-specific chains link evidence, publication, adjudication, supersession, release-authorization, and withdrawal events without permitting prior-event mutation. Denominator: 1 immutable schemas, six append-only event types per schema, and zero actual audit events.

### Key findings

- Evidence stage: Hanford append-only audit, adjudication, and publication-receipt controls.
- Finding: 1 contract-specific chains link evidence, publication, adjudication, supersession, release-authorization, and withdrawal events without permitting prior-event mutation.
- Denominator: 1 immutable schemas, six append-only event types per schema, and zero actual audit events.
- Boundary: Audit schemas are workflow controls, not actual review history.
- Boundary: A later event may reference but never update, replace, or delete a prior receipt.
- Boundary: Audit-chain completion cannot trigger, close, release, or publish automatically.
- Next action: Create the first actual chain only after one complete cited packet receives a named evidence-review receipt.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Audit schemas are workflow controls, not actual review history.
- A later event may reference but never update, replace, or delete a prior receipt.
- Audit-chain completion cannot trigger, close, release, or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/em/articles/hanford-releases-new-direct-feed-low-activity-waste-program-animation

**Archive member:** `official-links/11-hanford-1-append-only-dual-review-audit-chain-schemas.txt`

## 12. Hanford passes 9 append-only audit-chain integrity cases

**Publisher:** U.S. Department of Energy, Office of Environmental Management

**Document type:** Data Release

**Capture status:** Official link record

Every Hanford chain accepts ordered appends and rejects payload mutation, event replacement, time regression, and duplicate identifiers while preserving superseded receipts. Denominator: 9 fixture-only audit cases across 1 contracts; zero failures and zero actual audit events.

### Key findings

- Evidence stage: Hanford append-only audit, adjudication, and publication-receipt controls.
- Finding: Every Hanford chain accepts ordered appends and rejects payload mutation, event replacement, time regression, and duplicate identifiers while preserving superseded receipts.
- Denominator: 9 fixture-only audit cases across 1 contracts; zero failures and zero actual audit events.
- Boundary: Passing fixtures do not create evidence or reviewer history.
- Boundary: A valid hash link does not validate the underlying claim.
- Boundary: Supersession preserves rather than rewrites the earlier decision.
- Next action: Require contiguous sequence, increasing time, prior-event digest, payload digest, and immutable event digest for every actual append.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Passing fixtures do not create evidence or reviewer history.
- A valid hash link does not validate the underlying claim.
- Supersession preserves rather than rewrites the earlier decision.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/em/articles/hanford-releases-new-direct-feed-low-activity-waste-program-animation

**Archive member:** `official-links/12-hanford-9-audit-chain-integrity-cases.txt`

## 13. Hanford passes 18 publication-review receipt cases

**Publisher:** U.S. Department of Energy, Office of Environmental Management

**Document type:** Data Release

**Capture status:** Official link record

6 decision-specific receipt fixtures validate, while 12 incompatible-reason or mutated-attribution fixtures are rejected. Denominator: 18 cases across six publication decisions and 1 contracts; zero actual publication receipts.

### Key findings

- Evidence stage: Hanford append-only audit, adjudication, and publication-receipt controls.
- Finding: 6 decision-specific receipt fixtures validate, while 12 incompatible-reason or mutated-attribution fixtures are rejected.
- Denominator: 18 cases across six publication decisions and 1 contracts; zero actual publication receipts.
- Boundary: A valid synthetic publication receipt is not a publication decision.
- Boundary: Publication attribution must remain distinct from evidence-review attribution.
- Boundary: A publication receipt cannot replace the linked evidence receipt.
- Next action: Require a separate signed publication receipt with a decision-specific reason code and immutable evidence-receipt digest.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- A valid synthetic publication receipt is not a publication decision.
- Publication attribution must remain distinct from evidence-review attribution.
- A publication receipt cannot replace the linked evidence receipt.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/em/articles/hanford-releases-new-direct-feed-low-activity-waste-program-animation

**Archive member:** `official-links/13-hanford-18-publication-review-decision-receipt-cases.txt`

## 14. Hanford routes 10 cross-role adjudication cases without automatic release

**Publisher:** U.S. Department of Energy, Office of Environmental Management

**Document type:** Data Release

**Capture status:** Official link record

1 concordant accept fixtures await manual release, 5 disagreements or bounded blocks escalate explicitly, and 1 later decisions append without mutation. Denominator: 10 adjudication fixtures across 1 contracts; zero actual escalations, releases, triggers, closures, or publications.

### Key findings

- Evidence stage: Hanford append-only audit, adjudication, and publication-receipt controls.
- Finding: 1 concordant accept fixtures await manual release, 5 disagreements or bounded blocks escalate explicitly, and 1 later decisions append without mutation.
- Denominator: 10 adjudication fixtures across 1 contracts; zero actual escalations, releases, triggers, closures, or publications.
- Boundary: Disagreement cannot collapse into accept.
- Boundary: Escalation requires a third role distinct from both reviewers.
- Boundary: Even dual accept requires separate manual release authorization.
- Next action: Keep all disagreement states unresolved until a distinct human escalation owner records an append-only outcome.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Disagreement cannot collapse into accept.
- Escalation requires a third role distinct from both reviewers.
- Even dual accept requires separate manual release authorization.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/em/articles/hanford-releases-new-direct-feed-low-activity-waste-program-animation

**Archive member:** `official-links/14-hanford-10-cross-role-adjudication-cases.txt`

## 15. Hanford records zero actual audit, adjudication, release, or publication events

**Publisher:** U.S. Department of Energy, Office of Environmental Management

**Document type:** Data Release

**Capture status:** Official link record

Append-only chains, publication receipts, and adjudication fixtures prove bounded workflow behavior without assigning a person, evaluating evidence, authorizing release, or publishing. Denominator: 37 executable cases across 1 contracts and zero actual workflow events.

### Key findings

- Evidence stage: Hanford append-only audit, adjudication, and publication-receipt controls.
- Finding: Append-only chains, publication receipts, and adjudication fixtures prove bounded workflow behavior without assigning a person, evaluating evidence, authorizing release, or publishing.
- Denominator: 37 executable cases across 1 contracts and zero actual workflow events.
- Boundary: Synthetic identities and receipts remain outside the evidence ledger.
- Boundary: Manual release authorization remains absent.
- Boundary: No fixture changes eligibility, trigger, closure, publication, or operating-outcome state.
- Next action: Preserve the hold until separately attributable evidence and publication receipts are followed by an explicit manual release decision.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic identities and receipts remain outside the evidence ledger.
- Manual release authorization remains absent.
- No fixture changes eligibility, trigger, closure, publication, or operating-outcome state.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/em/articles/hanford-releases-new-direct-feed-low-activity-waste-program-animation

**Archive member:** `official-links/15-hanford-zero-actual-audit-adjudication-release-or-publication-events.txt`

## 16. NNSA defines 3 append-only dual-review audit chains

**Publisher:** U.S. Department of Energy and National Nuclear Security Administration

**Document type:** Data Release

**Capture status:** Official link record

3 contract-specific chains link evidence, publication, adjudication, supersession, release-authorization, and withdrawal events without permitting prior-event mutation. Denominator: 3 immutable schemas, six append-only event types per schema, and zero actual audit events.

### Key findings

- Evidence stage: NNSA append-only audit, adjudication, and publication-receipt controls.
- Finding: 3 contract-specific chains link evidence, publication, adjudication, supersession, release-authorization, and withdrawal events without permitting prior-event mutation.
- Denominator: 3 immutable schemas, six append-only event types per schema, and zero actual audit events.
- Boundary: Audit schemas are workflow controls, not actual review history.
- Boundary: A later event may reference but never update, replace, or delete a prior receipt.
- Boundary: Audit-chain completion cannot trigger, close, release, or publish automatically.
- Next action: Create the first actual chain only after one complete cited packet receives a named evidence-review receipt.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Audit schemas are workflow controls, not actual review history.
- A later event may reference but never update, replace, or delete a prior receipt.
- Audit-chain completion cannot trigger, close, release, or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2025-06/doe-fy-2026-vol-1-wa.pdf

**Archive member:** `official-links/16-nnsa-3-append-only-dual-review-audit-chain-schemas.txt`

## 17. NNSA passes 27 append-only audit-chain integrity cases

**Publisher:** U.S. Department of Energy and National Nuclear Security Administration

**Document type:** Data Release

**Capture status:** Official link record

Every NNSA chain accepts ordered appends and rejects payload mutation, event replacement, time regression, and duplicate identifiers while preserving superseded receipts. Denominator: 27 fixture-only audit cases across 3 contracts; zero failures and zero actual audit events.

### Key findings

- Evidence stage: NNSA append-only audit, adjudication, and publication-receipt controls.
- Finding: Every NNSA chain accepts ordered appends and rejects payload mutation, event replacement, time regression, and duplicate identifiers while preserving superseded receipts.
- Denominator: 27 fixture-only audit cases across 3 contracts; zero failures and zero actual audit events.
- Boundary: Passing fixtures do not create evidence or reviewer history.
- Boundary: A valid hash link does not validate the underlying claim.
- Boundary: Supersession preserves rather than rewrites the earlier decision.
- Next action: Require contiguous sequence, increasing time, prior-event digest, payload digest, and immutable event digest for every actual append.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Passing fixtures do not create evidence or reviewer history.
- A valid hash link does not validate the underlying claim.
- Supersession preserves rather than rewrites the earlier decision.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2025-06/doe-fy-2026-vol-1-wa.pdf

**Archive member:** `official-links/17-nnsa-27-audit-chain-integrity-cases.txt`

## 18. NNSA passes 54 publication-review receipt cases

**Publisher:** U.S. Department of Energy and National Nuclear Security Administration

**Document type:** Data Release

**Capture status:** Official link record

18 decision-specific receipt fixtures validate, while 36 incompatible-reason or mutated-attribution fixtures are rejected. Denominator: 54 cases across six publication decisions and 3 contracts; zero actual publication receipts.

### Key findings

- Evidence stage: NNSA append-only audit, adjudication, and publication-receipt controls.
- Finding: 18 decision-specific receipt fixtures validate, while 36 incompatible-reason or mutated-attribution fixtures are rejected.
- Denominator: 54 cases across six publication decisions and 3 contracts; zero actual publication receipts.
- Boundary: A valid synthetic publication receipt is not a publication decision.
- Boundary: Publication attribution must remain distinct from evidence-review attribution.
- Boundary: A publication receipt cannot replace the linked evidence receipt.
- Next action: Require a separate signed publication receipt with a decision-specific reason code and immutable evidence-receipt digest.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- A valid synthetic publication receipt is not a publication decision.
- Publication attribution must remain distinct from evidence-review attribution.
- A publication receipt cannot replace the linked evidence receipt.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2025-06/doe-fy-2026-vol-1-wa.pdf

**Archive member:** `official-links/18-nnsa-54-publication-review-decision-receipt-cases.txt`

## 19. NNSA routes 30 cross-role adjudication cases without automatic release

**Publisher:** U.S. Department of Energy and National Nuclear Security Administration

**Document type:** Data Release

**Capture status:** Official link record

3 concordant accept fixtures await manual release, 15 disagreements or bounded blocks escalate explicitly, and 3 later decisions append without mutation. Denominator: 30 adjudication fixtures across 3 contracts; zero actual escalations, releases, triggers, closures, or publications.

### Key findings

- Evidence stage: NNSA append-only audit, adjudication, and publication-receipt controls.
- Finding: 3 concordant accept fixtures await manual release, 15 disagreements or bounded blocks escalate explicitly, and 3 later decisions append without mutation.
- Denominator: 30 adjudication fixtures across 3 contracts; zero actual escalations, releases, triggers, closures, or publications.
- Boundary: Disagreement cannot collapse into accept.
- Boundary: Escalation requires a third role distinct from both reviewers.
- Boundary: Even dual accept requires separate manual release authorization.
- Next action: Keep all disagreement states unresolved until a distinct human escalation owner records an append-only outcome.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Disagreement cannot collapse into accept.
- Escalation requires a third role distinct from both reviewers.
- Even dual accept requires separate manual release authorization.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2025-06/doe-fy-2026-vol-1-wa.pdf

**Archive member:** `official-links/19-nnsa-30-cross-role-adjudication-cases.txt`

## 20. NNSA records zero actual audit, adjudication, release, or publication events

**Publisher:** U.S. Department of Energy and National Nuclear Security Administration

**Document type:** Data Release

**Capture status:** Official link record

Append-only chains, publication receipts, and adjudication fixtures prove bounded workflow behavior without assigning a person, evaluating evidence, authorizing release, or publishing. Denominator: 111 executable cases across 3 contracts and zero actual workflow events.

### Key findings

- Evidence stage: NNSA append-only audit, adjudication, and publication-receipt controls.
- Finding: Append-only chains, publication receipts, and adjudication fixtures prove bounded workflow behavior without assigning a person, evaluating evidence, authorizing release, or publishing.
- Denominator: 111 executable cases across 3 contracts and zero actual workflow events.
- Boundary: Synthetic identities and receipts remain outside the evidence ledger.
- Boundary: Manual release authorization remains absent.
- Boundary: No fixture changes eligibility, trigger, closure, publication, or operating-outcome state.
- Next action: Preserve the hold until separately attributable evidence and publication receipts are followed by an explicit manual release decision.

### Why it matters

The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic identities and receipts remain outside the evidence ledger.
- Manual release authorization remains absent.
- No fixture changes eligibility, trigger, closure, publication, or operating-outcome state.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2025-06/doe-fy-2026-vol-1-wa.pdf

**Archive member:** `official-links/20-nnsa-zero-actual-audit-adjudication-release-or-publication-events.txt`

## 21. Amtrak PIDS closeout remains In Review after dual-review audit and adjudication execution

**Publisher:** National Railroad Passenger Corporation

**Document type:** Technical Report

**Capture status:** Official link record

37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists. Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.

### Key findings

- Evidence stage: Dual-review audit and adjudication hold.
- Finding: 37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists.
- Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.
- Boundary: Synthetic dual-review chains are not actual audit history.
- Boundary: No fixture creates a reviewer identity, adjudication, or release decision.
- Boundary: The inherited hold cannot close or publish automatically.
- Next action: Code-bearing official current asset register or closeout table

### Why it matters

The hold remains actionable while synthetic audit and adjudication results stay separate from an actual cited packet and named human decisions.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic dual-review chains are not actual audit history.
- No fixture creates a reviewer identity, adjudication, or release decision.
- The inherited hold cannot close or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/21-preserved-amtrak-pids.txt`

## 22. Amtrak named-asset reliability remains In Review after dual-review audit and adjudication execution

**Publisher:** National Railroad Passenger Corporation

**Document type:** Technical Report

**Capture status:** Official link record

37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists. Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.

### Key findings

- Evidence stage: Dual-review audit and adjudication hold.
- Finding: 37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists.
- Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.
- Boundary: Synthetic dual-review chains are not actual audit history.
- Boundary: No fixture creates a reviewer identity, adjudication, or release decision.
- Boundary: The inherited hold cannot close or publish automatically.
- Next action: Named-asset-period reliability table

### Why it matters

The hold remains actionable while synthetic audit and adjudication results stay separate from an actual cited packet and named human decisions.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic dual-review chains are not actual audit history.
- No fixture creates a reviewer identity, adjudication, or release decision.
- The inherited hold cannot close or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf

**Archive member:** `official-links/22-preserved-amtrak-reliability.txt`

## 23. Louisiana Nextlink adoption remains In Review after dual-review audit and adjudication execution

**Publisher:** Louisiana Office of Broadband Development and Connectivity

**Document type:** Technical Report

**Capture status:** Official link record

37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists. Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.

### Key findings

- Evidence stage: Dual-review audit and adjudication hold.
- Finding: 37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists.
- Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.
- Boundary: Synthetic dual-review chains are not actual audit history.
- Boundary: No fixture creates a reviewer identity, adjudication, or release decision.
- Boundary: The inherited hold cannot close or publish automatically.
- Next action: Privacy-safe official completed-period adoption table

### Why it matters

The hold remains actionable while synthetic audit and adjudication results stay separate from an actual cited packet and named human decisions.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic dual-review chains are not actual audit history.
- No fixture creates a reviewer identity, adjudication, or release decision.
- The inherited hold cannot close or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://connect.la.gov/press-releases/nextlink-activates-first-bead-funded-tower-in-the-united-states-connecting-rural-louisiana

**Archive member:** `official-links/23-preserved-la-nextlink-adoption.txt`

## 24. Louisiana Starlink adoption remains In Review after dual-review audit and adjudication execution

**Publisher:** Louisiana Office of Broadband Development and Connectivity

**Document type:** Technical Report

**Capture status:** Official link record

37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists. Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.

### Key findings

- Evidence stage: Dual-review audit and adjudication hold.
- Finding: 37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists.
- Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.
- Boundary: Synthetic dual-review chains are not actual audit history.
- Boundary: No fixture creates a reviewer identity, adjudication, or release decision.
- Boundary: The inherited hold cannot close or publish automatically.
- Next action: Privacy-safe official completed-period LEO adoption table

### Why it matters

The hold remains actionable while synthetic audit and adjudication results stay separate from an actual cited packet and named human decisions.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic dual-review chains are not actual audit history.
- No fixture creates a reviewer identity, adjudication, or release decision.
- The inherited hold cannot close or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://connect.la.gov/press-releases/louisiana-signs-bead-grant-agreement-with-spacexs-starlink-continuing-push-for-statewide-broadband-access

**Archive member:** `official-links/24-preserved-la-starlink-adoption.txt`

## 25. Montana BEAD completed quarter remains In Review after dual-review audit and adjudication execution

**Publisher:** Montana Department of Administration

**Document type:** Technical Report

**Capture status:** Official link record

37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists. Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.

### Key findings

- Evidence stage: Dual-review audit and adjudication hold.
- Finding: 37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists.
- Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.
- Boundary: Synthetic dual-review chains are not actual audit history.
- Boundary: No fixture creates a reviewer identity, adjudication, or release decision.
- Boundary: The inherited hold cannot close or publish automatically.
- Next action: Completed public project-quarter table

### Why it matters

The hold remains actionable while synthetic audit and adjudication results stay separate from an actual cited packet and named human decisions.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic dual-review chains are not actual audit history.
- No fixture creates a reviewer identity, adjudication, or release decision.
- The inherited hold cannot close or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://doa.mt.gov/ConnectMT/iija/

**Archive member:** `official-links/25-preserved-mt-bead-quarter.txt`

## 26. Hanford complete material balance remains In Review after dual-review audit and adjudication execution

**Publisher:** U.S. Department of Energy Hanford Field Office and Washington State Department of Ecology

**Document type:** Technical Report

**Capture status:** Official link record

37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists. Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.

### Key findings

- Evidence stage: Dual-review audit and adjudication hold.
- Finding: 37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists.
- Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.
- Boundary: Synthetic dual-review chains are not actual audit history.
- Boundary: No fixture creates a reviewer identity, adjudication, or release decision.
- Boundary: The inherited hold cannot close or publish automatically.
- Next action: Stable-identity transfer, receipt, and disposition evidence chain

### Why it matters

The hold remains actionable while synthetic audit and adjudication results stay separate from an actual cited packet and named human decisions.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic dual-review chains are not actual audit history.
- No fixture creates a reviewer identity, adjudication, or release decision.
- The inherited hold cannot close or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://pdw.hanford.gov/download/v2/AR-39756

**Archive member:** `official-links/26-preserved-hanford-mass-balance.txt`

## 27. NNSA recurring qualified rate remains In Review after dual-review audit and adjudication execution

**Publisher:** National Nuclear Security Administration

**Document type:** Technical Report

**Capture status:** Official link record

37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists. Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.

### Key findings

- Evidence stage: Dual-review audit and adjudication hold.
- Finding: 37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists.
- Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.
- Boundary: Synthetic dual-review chains are not actual audit history.
- Boundary: No fixture creates a reviewer identity, adjudication, or release decision.
- Boundary: The inherited hold cannot close or publish automatically.
- Next action: Official site-period recurring qualified-output table

### Why it matters

The hold remains actionable while synthetic audit and adjudication results stay separate from an actual cited packet and named human decisions.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic dual-review chains are not actual audit history.
- No fixture creates a reviewer identity, adjudication, or release decision.
- The inherited hold cannot close or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/nnsa/plutonium-pit-production

**Archive member:** `official-links/27-preserved-nnsa-qualified-rate.txt`

## 28. NNSA accepted operating capacity remains In Review after dual-review audit and adjudication execution

**Publisher:** National Nuclear Security Administration

**Document type:** Technical Report

**Capture status:** Official link record

37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists. Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.

### Key findings

- Evidence stage: Dual-review audit and adjudication hold.
- Finding: 37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists.
- Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.
- Boundary: Synthetic dual-review chains are not actual audit history.
- Boundary: No fixture creates a reviewer identity, adjudication, or release decision.
- Boundary: The inherited hold cannot close or publish automatically.
- Next action: Official site-period installed, qualified, and accepted capacity table

### Why it matters

The hold remains actionable while synthetic audit and adjudication results stay separate from an actual cited packet and named human decisions.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic dual-review chains are not actual audit history.
- No fixture creates a reviewer identity, adjudication, or release decision.
- The inherited hold cannot close or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.energy.gov/sites/default/files/2026-04/draft-eis-0573-plutonium-pit-production-vol-1-2026-04.pdf

**Archive member:** `official-links/28-preserved-nnsa-accepted-capacity.txt`

## 29. NNSA GAO enterprise baseline remains In Review after dual-review audit and adjudication execution

**Publisher:** U.S. Government Accountability Office

**Document type:** Technical Report

**Capture status:** Official link record

37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists. Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.

### Key findings

- Evidence stage: Dual-review audit and adjudication hold.
- Finding: 37 fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists.
- Denominator: One inherited hold, one append-only chain, 9 audit cases, 18 publication-receipt cases, 10 adjudication cases, and zero actual workflow events.
- Boundary: Synthetic dual-review chains are not actual audit history.
- Boundary: No fixture creates a reviewer identity, adjudication, or release decision.
- Boundary: The inherited hold cannot close or publish automatically.
- Next action: GAO recommendation-status record with responsive agency evidence

### Why it matters

The hold remains actionable while synthetic audit and adjudication results stay separate from an actual cited packet and named human decisions.

### Evidence limits

- Not publicly acquired does not mean nonexistent, withheld, or never submitted.
- FTFN public-source research is not agency contact or a submitted FOIA request.
- Synthetic dual-review chains are not actual audit history.
- No fixture creates a reviewer identity, adjudication, or release decision.
- The inherited hold cannot close or publish automatically.
- The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.
- No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference.

**Official source:** https://www.gao.gov/products/gao-23-104661

**Archive member:** `official-links/29-preserved-nnsa-gao-baseline.txt`
