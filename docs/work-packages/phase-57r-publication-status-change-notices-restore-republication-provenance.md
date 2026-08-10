# Phase 57R Work Package: Publication Status, Change Notices, Restore Receipts, and Provenance

Status: complete and owner-only deployed

Captured: 2026-08-09

## Goal

Expose publication lifecycle state to readers without allowing a status display, change notice, provenance timeline, restoration fixture, or republication fixture to create evidence or change claim state.

## Delivered scope

- 45 reviewed records across all nine inherited reopening contracts;
- 36 Published controls, four per contract;
- all nine Phase 57Q holds preserved exactly once and no new visible hold;
- nine reader-facing current-publication-status registries;
- nine immutable public change-notice schemas;
- nine restoration and republication receipt schemas;
- 126 current-status derivation cases;
- 126 immutable change-notice integrity cases;
- 144 restoration, republication, history-preservation, and provenance cases;
- Research Watch 048, one research collection, one public update, and one 48-file archive;
- integration across five topics, three reader pathways, and the comparative-outcomes dependency map.

## Four controls per contract

Each of the nine contracts now has the same four bounded control records:

1. a reader-facing current-publication-status registry derived only from complete append-only history;
2. an immutable public change notice bound to the controlling event, receipt, event digest, and bundle digest;
3. restoration and republication receipts requiring a new named human authorization and a new exact bundle digest;
4. a complete provenance timeline that identifies exactly one controlling event while prohibiting evidence or claim-state inflation.

## Executable contract

### Current-status derivation

The status harness validates seven lifecycle event types and produces five reader-facing fields: current status, controlling event ID, controlling receipt ID, history-event count, and full-history digest. Across nine contracts, 54 bounded valid lifecycle states derive and 72 malformed, duplicate, regressive, receiptless, truncated, mutated, automated, or evidence-inflating fixtures reject.

### Immutable change notices

Every notice binds its type to the controlling lifecycle event, controlling receipt, event digest, and exact bundle digest. Publication, withdrawal, rollback, supersession, restoration, and republication each have a valid fixture per contract. Missing identifiers, mismatched types or bindings, digest drift, bundle drift, notice rewrites, and state inflation reject. Corrections append a new notice; they never rewrite an earlier notice.

### Restoration and republication

A restoration or republication receipt must identify a named human actor, carry a new authorization ID, bind a new exact bundle digest, target an existing withdrawal or rollback event, use a unique receipt ID, and advance chronology. Stale authorization, stale bundle, automated actor, unknown target, duplicate receipt, time regression, history rewrite, automatic republication, evidence inflation, and closure attempts reject.

## Test distribution

| Rail | Schemas | Cases | Valid or preservation routes | Rejections |
|---|---:|---:|---:|---:|
| Current publication status | 9 | 126 | 54 | 72 |
| Immutable change notices | 9 | 126 | 54 | 72 |
| Restore, republication, and provenance | 9 | 144 | 54 | 90 |
| Total | 27 | 396 | 162 | 234 |

All 396 cases pass. Every case is fixture-only. Actual publication statuses, change notices, restore actors, restore authorizations, restorations, republications, evidence records, history mutations, reopening triggers, automated publications, and automated closures remain zero.

## Publication decision

Publish all 36 contract-specific workflow controls because they describe bounded, executable reader-facing infrastructure. Keep all nine inherited outcome records In Review because Phase 57R acquires no new target evidence and records no actual lifecycle event, public notice, restore actor, restore authorization, restoration, or republication.

## Evidence boundaries

- A derived status is a view over history, not a publication decision.
- Earlier lifecycle states remain visible and digest-verifiable.
- A change notice cannot publish, restore, close, or change evidence state.
- Restoration or republication cannot reuse a withdrawn or rolled-back authorization or stale bundle digest.
- A new digest proves artifact identity, not claim truth or evidence sufficiency.
- Synthetic actors, statuses, notices, receipts, bundles, restores, republications, and timelines remain outside the evidence and publication ledgers.
- No status display changes acceptance, directive scope, implementation, capability, closure, attribution, or operating outcomes.
- Missing public evidence does not mean nonexistent, withheld, or never submitted.
- Agency assertions and independent oversight remain separate.
- FTFN submitted no agency contact or FOIA request.
- No ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference is supported.

## Visible result

The verified candidate contains 715 sources, 992 signals, 768 Published signals, 224 In Review signals, 53 research collections, 1,108 research documents, 56 briefings, 72 updates, 956 research export records, and 498 Published-support sources. The entity ledger remains one Closed, 21 Partially Closed, and two Open.

The 48-file archive contains 45 official-link records, consolidated summaries, a README, and a checksum manifest. It is 46,430 bytes with SHA-256 `C553AD67845E9F81E1126337EDF4A4C4F28106D3A713AD2134D442EECD76C960`.

## Phase 57S handoff

Build reader-verifiable lifecycle manifests, status-freshness and stale-view detection, provenance export snapshots, and digest-chain verification across all nine contracts. Prove that a reader can reconcile the displayed current status to the complete lifecycle history and controlling receipt, that partial or stale views fail closed, that exports preserve every prior event and immutable notice, and that verification itself cannot publish, restore, rewrite, accept, implement, close, attribute, or create operating outcomes. Preserve all nine Phase 57R holds and keep every synthetic verifier, manifest, export, mismatch, receipt, and event outside the evidence ledger.

## Validation checkpoint

Private-candidate validation, content references, source health, the Phase 57Q regression, the Phase 57R harness and assertions, Astro diagnostics, the expected 3,011-page production build, release assertions, sitemap membership, exports, private-registry exclusion, and the 48-file archive must pass at the counts above.

Public access, Hostinger DNS, custom-domain attachment, package freeze, public GitHub synchronization, and Supabase activation remain separate explicit decisions.

## Deployment receipt

Local content commit `043cebae1a76ad3d68898a3e3dcea76c55b71f91` maps to exact private runtime commit `1dc8df329c59f0e8d85a6f48da800d44463578cc`, whose verified parent is the Phase 57Q runtime `f368df8788f6aceeccd1815e91b9927be8a760e9`. The 4,342-file runtime was saved as Sites version 74 and deployed successfully in `appgdep_6a79521cb5408191812dbc5d5c18700c` at `https://ftfn-analytics.jbumstead.chatgpt.site`. Access remains custom owner-only with one owner, no groups, no editors, and zero external visitors. Public access, Hostinger DNS, custom-domain attachment, package freeze, and public GitHub synchronization remain unchanged.
