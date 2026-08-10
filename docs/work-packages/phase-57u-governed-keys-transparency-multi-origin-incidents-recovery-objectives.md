# Phase 57U Work Package: Governed Keys, Transparency, Multi-Origin Integrity, Incidents, and Recovery Objectives

Status: complete, release-validated, and owner-only deployed as Sites version 77

Captured: 2026-08-09

## Goal

Let every reader identify the current trust root, verify append-only release history across canonical, mirror, and archive origins, contain integrity incidents, and measure recovery objectives while every unknown signer, inconsistent log, divergent origin, incomplete containment action, or missed recovery objective fails closed and no integrity control creates evidence or activates reconstructed state.

## Delivered scope

- 63 reviewed records across all nine inherited reopening contracts;
- 54 Published controls, six per contract;
- all nine Phase 57T holds preserved exactly once and no new visible hold;
- nine governed verification-key registry schemas;
- nine append-only key activation, rotation, expiry, and revocation receipt schemas;
- nine transparency-log inclusion and consistency proof schemas;
- nine exact multi-origin consistency schemas;
- nine incident declaration and containment receipt schemas;
- nine recovery-point and recovery-time objective schemas;
- 1,170 executable cases across the six rails;
- Research Watch 051, one research collection, one public update, and one 66-file archive;
- integration across five topics, three reader pathways, and the comparative-outcomes dependency map.

## Six controls per contract

Each contract receives:

1. a role-separated trust registry with staged, active, rotated, expired, and revoked key states, exactly one active key, and distinct signing, custody, release-authorization, and incident-command identities;
2. append-only activation, rotation, expiry, and revocation receipts that bind lifecycle sequence, prior receipt, registry digest, authorized actors, key identity, receipt digest, and detached fixture signature;
3. transparency-log inclusion and consistency proofs that preserve current and prior release indexes plus the governed key registry in an append-only tree;
4. exact canonical, mirror, and immutable-archive observation checks that reject every divergence without allowing majority-state substitution;
5. incident declaration and containment receipts requiring monotonic chronology, authorized command, key freeze, fail-closed readers, cache purge, mirror quarantine, log preservation, and disabled recovery activation;
6. recovery-point and recovery-time objective drills with explicit targets, complete telemetry, immutable-source reconstruction, measured margins, append-only receipts, and inactive reconstructed state.

## Executable contract

### Governed verification keys

Nine key-registry schemas execute 180 cases. Fifty-four one-active-key, role-separation, digest, validity-window, staged-key, and rotated-key-history routes pass. One hundred twenty-six unknown, expired, revoked, staged, ambiguous, overlapping, conflicted, downgraded, rewritten, publishing, or evidence-inflating fixtures reject or fail closed.

### Key lifecycle receipts

Nine lifecycle schemas execute 198 cases. Sixty-three activation, rotation, expiry, revocation, prior-receipt, registry-binding, and independent-authority routes pass. One hundred thirty-five missing-lineage, sequence-regression, digest, signature, event, authority, role-conflict, revoked-target, expired-target, overlapping, erasing, publishing, closing, or evidence-inflating fixtures reject.

### Transparency proofs

Nine transparency schemas execute 198 cases. Sixty-three current-index, prior-index, registry, tree-root, consistency, append-only-growth, and prior-tree-preservation routes pass. One hundred thirty-five missing-leaf, root, inclusion-path, consistency-path, tree-regression, truncation, replacement, reordering, split-view, unknown-log, publishing, rewriting, or evidence-inflating fixtures reject.

### Multi-origin consistency

Nine multi-origin schemas execute 180 cases. Forty-five complete three-origin, canonical, mirror, archive, and observation-time routes pass. One hundred thirty-five missing, stale, index-divergent, representation-divergent, log-divergent, key-divergent, majority-substituting, authority-promoting, publishing, closing, or evidence-inflating fixtures fail closed or reject.

### Incident containment

Nine incident schemas execute 198 cases. Fifty-four declaration, containment, chronology, incident-command, log-preservation, and inactive-reader routes pass. One hundred forty-four missing, time-regressive, unauthorized, incompletely contained, mutable, undeclared, majority-overriding, publishing, closing, or evidence-inflating fixtures reject.

### Recovery objectives

Nine recovery-objective schemas execute 216 cases. Sixty-three RPO, RTO, immutable-history, complete-telemetry, append-only-receipt, inactive-reconstruction, and objective-margin routes pass. One hundred fifty-three missing, negative, missed, mutable, rewriting, activating, backdated, substituted, publishing, or evidence-inflating fixtures reject or fail closed.

## Test distribution

| Rail | Schemas | Cases | Valid or preservation routes | Rejections |
|---|---:|---:|---:|---:|
| Governed key registries | 9 | 180 | 54 | 126 |
| Key lifecycle receipts | 9 | 198 | 63 | 135 |
| Transparency proofs | 9 | 198 | 63 | 135 |
| Multi-origin consistency | 9 | 180 | 45 | 135 |
| Incident containment | 9 | 198 | 54 | 144 |
| Recovery objectives | 9 | 216 | 63 | 153 |
| Total | 54 | 1,170 | 342 | 828 |

All 1,170 cases pass. Every case is fixture-only. Actual production keys, signatures, lifecycle events, log entries, proofs, origin observations, incidents, containment actions, receipts, replays, recovery drills, reader-state changes, evidence records, prior-artifact rewrites, reopening triggers, automated publications, and automated closures remain zero.

## Publication decision

Publish all 54 contract-specific controls because they define bounded and executable trust-root, append-only history, origin-consistency, incident-containment, and recovery-objective infrastructure. Keep all nine inherited outcome records In Review because Phase 57U acquires no new target evidence and records no actual key event, signature, log entry, proof, origin observation, incident, receipt, recovery, reader-state activation, trigger, publication, or closure.

## Evidence boundaries

- Fixture keys and signatures contain no production key material and confer no production authority.
- Key identity and cryptographic integrity do not establish claim truth, evidence acceptance, implementation, closure, attribution, or outcomes.
- Current and prior release indexes plus the governed key registry must remain included in the append-only transparency history.
- A canonical, mirror, or archive divergence fails closed; two matching origins cannot vote an inconsistent third origin into authority.
- A mirror or archive never becomes the lifecycle source-of-truth.
- Fixture incidents are drills, not reports of an operational compromise.
- Recovery-objective values are control targets, not production service guarantees.
- Recovery reconstructs inactive reader state and cannot bypass human verification or publication authority.
- Keys, signatures, lifecycle events, logs, proofs, observations, incidents, receipts, replays, and drills cannot publish, restore, accept, implement, establish capability, close, attribute, or establish operating outcomes.
- Every synthetic key, signature, lifecycle event, log entry, proof, observation, incident, receipt, replay, and drill remains outside the evidence and publication ledgers.
- Missing public evidence does not mean nonexistent, withheld, or never submitted.
- Agency assertions and independent oversight remain separate.
- FTFN submitted no agency contact or FOIA request.
- No ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference is supported.

## Visible result

The verified candidate contains 715 sources, 1,154 signals, 903 Published signals, 251 In Review signals, 56 research collections, 1,270 research documents, 59 briefings, 75 updates, 1,094 research export records, and 498 Published-support sources. The entity ledger remains one Closed, 21 Partially Closed, and two Open.

The 66-file archive contains 63 official-link records, consolidated summaries, a README, and a checksum manifest. It is 67,762 bytes with SHA-256 `7A6969CF2EC49808EFDAD84251E9578E637D90918843BC08B6DB3FB3BED98857`.

## Phase 57V handoff

Build threshold release authorization, independent witness checkpoints, cross-log gossip, trusted-time anti-rollback receipts, verifier-diversity conformance, and key-compromise recovery across all nine contracts. Require an explicit M-of-N authorization policy without same-actor quorum, independently witnessed transparency checkpoints, gossip detection of split views, monotonic trusted time, reproducible results across at least three verifier implementations, and bounded crypto-agility and compromise recovery without retroactively trusting artifacts signed by a compromised key. Preserve all nine Phase 57U holds and keep every synthetic threshold share, witness signature, checkpoint, gossip message, time receipt, verifier result, compromise event, recovery action, and drill outside the evidence ledger.

## Deployment receipt

Local content commit `8facebbffbcf6f3d27910de1c549e755f5fe11d0` maps to exact private runtime commit `07121a8290c775e6672574a678fe659cbe94d38b`, whose verified parent is the Phase 57T runtime `784f72c412f3dda8592d097fe665296206bd273f`. The 4,846-file runtime archive is 181,022,720 bytes with content hash `sha256:dd0a576c90333242ef626440ce3fa463f12c98647365de863d9a74c816cefb9a`. Sites version 77 (`appgprj_6a614e1092d08191bf65779fc35df959~appgver_058244f69c248191b918e83a4703b6b7`) deployed successfully in `appgdep_6a7964874854819198ab50f448f65039` at `https://ftfn-analytics.jbumstead.chatgpt.site`. Access remains custom owner-only with one owner, no groups, no editors, and zero external visitors. Visual route QA was not requested because this release uses the existing content templates and route families.

## Validation checkpoint

Private-candidate validation, content references, source health, the Phase 57T regression, the Phase 57U harness and assertions, Astro diagnostics, the 3,341-page production build, release assertions, sitemap membership, exports, private-registry exclusion, and the 66-file archive pass at the counts above.

Public access, Hostinger DNS, custom-domain attachment, package freeze, public GitHub synchronization, and Supabase activation remain separate explicit decisions.
