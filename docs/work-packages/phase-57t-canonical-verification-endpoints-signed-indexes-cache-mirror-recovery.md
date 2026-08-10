# Phase 57T Work Package: Canonical Verification Endpoints, Signed Indexes, Cache and Mirror Integrity, and Recovery

Status: complete and release-validated locally; owner-only deployment pending

Captured: 2026-08-09

## Goal

Make every reader-verification bundle canonically resolvable, signed, cache-coherent, mirror-safe, redirect-safe, and recoverable from immutable source history while every mismatch fails closed and no delivery control creates evidence or changes publication state.

## Delivered scope

- 54 reviewed records across all nine inherited reopening contracts;
- 45 Published controls, five per contract;
- all nine Phase 57S holds preserved exactly once and no new visible hold;
- nine canonical reader-verification endpoint schemas;
- nine signed append-only release-index schemas;
- nine cache-coherence and revalidation schemas;
- nine mirror and redirect integrity schemas;
- nine immutable-source recovery-drill schemas;
- 828 executable cases across the five rails;
- Research Watch 050, one research collection, one public update, and one 57-file archive;
- integration across five topics, three reader pathways, and the comparative-outcomes dependency map.

## Five controls per contract

Each contract receives:

1. a stable HTTPS verification-URI contract binding the exact current manifest, provenance export, signed release index, representation digest, and entity tag;
2. an append-only signed release index binding the current bundle, release sequence, prior index digest, signing-key identity, index digest, and detached signature;
3. cache-coherence receipts requiring exact URI, index, entity-tag, representation, manifest, export, and revalidation-time agreement;
4. mirror and redirect integrity requiring exact digests, a canonical header, transport security, and one permanent canonical hop without downgrade, injection, loops, or transforms;
5. a recovery drill that reconstructs inactive reader state only from immutable lifecycle history, notices, the controlling manifest, provenance export, and signed release index.

## Executable contract

### Canonical endpoints

Nine endpoint schemas execute 162 cases. Fifty-four exact origin, URI, bundle, representation, index, entity-tag, and media-contract routes pass. One hundred eight origin, query, fragment, alias, method, media, digest, entity-tag, automation, or evidence-inflation fixtures reject or fail closed.

### Signed release indexes

Nine signed-index schemas execute 162 cases. Fifty-four current-bundle, prior-index, sequence, key-identity, signature, and preservation routes pass. One hundred eight missing, unknown, unauthorized, mismatched, regressive, substituted, erasing, publishing, or evidence-inflating fixtures reject.

### Cache coherence

Nine cache schemas execute 162 cases. Forty-five exact entity-tag, bundle, revalidation, age-window, and must-revalidate routes pass. One hundred seventeen stale, partial, time-regressive, serve-stale, warning-only, transformed, partition-drifting, publishing, or evidence-inflating fixtures fail closed or reject.

### Mirror and redirect integrity

Nine mirror and redirect schemas execute 162 cases. Forty-five exact representation, canonical-header, redirect-target, hop-count, and transport-security routes pass. One hundred seventeen drift, downgrade, injection, loop, temporary, transform, publishing, or evidence-inflating fixtures fail closed or reject.

### Immutable-source recovery

Nine recovery schemas execute 180 cases. Fifty-four complete or preservation routes reconstruct deterministic inactive reader state. One hundred twenty-six missing, mutable, mismatched, substituted, rewriting, activating, publishing, or closing fixtures reject.

## Test distribution

| Rail | Schemas | Cases | Valid or preservation routes | Rejections |
|---|---:|---:|---:|---:|
| Canonical endpoints | 9 | 162 | 54 | 108 |
| Signed release indexes | 9 | 162 | 54 | 108 |
| Cache coherence | 9 | 162 | 45 | 117 |
| Mirror and redirect integrity | 9 | 162 | 45 | 117 |
| Immutable-source recovery | 9 | 180 | 54 | 126 |
| Total | 45 | 828 | 252 | 576 |

All 828 cases pass. Every case is fixture-only. Actual endpoints, production signatures, cache receipts, mirror events, redirects, recovery drills, reader-state changes, evidence records, prior-artifact rewrites, reopening triggers, automated publications, and automated closures remain zero.

## Publication decision

Publish all 45 contract-specific controls because they define bounded and executable canonical-delivery, signing, cache, mirror, redirect, and recovery infrastructure. Keep all nine inherited outcome records In Review because Phase 57T acquires no new target evidence and records no actual endpoint, signature, cache receipt, mirror event, redirect event, recovery drill, reader-state activation, trigger, publication, or closure.

## Evidence boundaries

- Canonical resolution proves delivery and digest binding, not claim truth.
- Fixture signatures are not production releases and do not imply signer authority outside the tested contract.
- Serve-stale-on-error and warning-only mismatch behavior are prohibited.
- A mirror never becomes the lifecycle source-of-truth.
- Recovery reconstructs inactive reader state and cannot bypass human verification or publication authority.
- Endpoints, signatures, caches, mirrors, redirects, replays, receipts, and drills cannot publish, restore, accept, implement, establish capability, close, attribute, or establish operating outcomes.
- Every synthetic endpoint, signature, cache event, mirror, redirect, replay, receipt, and drill remains outside the evidence and publication ledgers.
- Missing public evidence does not mean nonexistent, withheld, or never submitted.
- Agency assertions and independent oversight remain separate.
- FTFN submitted no agency contact or FOIA request.
- No ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference is supported.

## Visible result

The verified candidate contains 715 sources, 1,091 signals, 849 Published signals, 242 In Review signals, 55 research collections, 1,207 research documents, 58 briefings, 74 updates, 1,039 research export records, and 498 Published-support sources. The entity ledger remains one Closed, 21 Partially Closed, and two Open.

The 57-file archive contains 54 official-link records, consolidated summaries, a README, and a checksum manifest. It is 56,572 bytes with SHA-256 `A51063D5CD3BBD5C20F1F7FFA4934307B8CCCE5A89272E33960AD8815D65FD96`.

## Phase 57U handoff

Build governed verification-key registries, rotation and revocation receipts, transparency-log inclusion and consistency proofs, multi-origin quorum checks, incident-containment receipts, and recovery-objective drills across all nine contracts. Prove that a reader can identify the currently trusted key, reject a revoked or unknown signer, verify that current and prior release indexes remain included in an append-only transparency log, detect origin divergence without majority-state substitution, and measure bounded recovery-point and recovery-time objectives without activating reconstructed state. Preserve all nine Phase 57T holds and keep every synthetic key, signature, log entry, proof, origin observation, incident, receipt, replay, and drill outside the evidence ledger.

## Validation checkpoint

Private-candidate validation, content references, source health, the Phase 57S regression, the Phase 57T harness and assertions, Astro diagnostics, the 3,213-page production build, release assertions, sitemap membership, exports, private-registry exclusion, and the 57-file archive pass at the counts above.

Public access, Hostinger DNS, custom-domain attachment, package freeze, public GitHub synchronization, and Supabase activation remain separate explicit decisions.
