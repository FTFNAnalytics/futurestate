# Phase 120 — Authority-to-artifact acquisition packets

**Status:** Complete
**Effective date:** 2026-08-30
**Program:** FTFN v0.5 — The Evidence Fieldbook

## Objective

Turn all eighty Phase 117 Candidate authority rails into explicit, reviewable acquisition contracts without pretending that a portal is an artifact or that a target has already been acquired. Each packet names four distinct artifact targets, the metadata and tests needed for admission, invalid substitutions, a dated preparation disposition, an owner, a stopping boundary, a next trigger, and the Phase 116 questions that a later Phase 121 mission may assign.

## Delivered

- 80 authority-to-artifact acquisition packets, one for every Phase 117 rail.
- 320 distinct targets, exactly four per packet.
- Exact joins to 80 Candidate source records, 20 jurisdiction layers, 4 authority classes, 17 topics, and 8 canonical conversion stages.
- Twelve required capture fields, five common admissibility tests, and six invalid-substitution controls on every packet.
- Phase 121 linkage placeholders drawn from the existing 68 Phase 116 priority questions.
- One public acquisition hub, one machine-readable JSON endpoint, and materially expanded sections on all eighty existing authority-rail pages.
- A deterministic builder, independent assertion script, and dated public update.

## Preparation state

Every packet is **Prepared — no exact artifact admitted**. Phase 120 did not browse for, open, capture, assess, or admit an exact official artifact. It did not infer that an artifact exists or does not exist. A later dated human review must record an exact-artifact admission, bounded no-find, or access blocker against a named mission.

The original eighty Phase 117 source records remain `Candidate`. An institutional portal cannot be promoted as though it were the exact report, dataset, docket, filing, permit, inspection, acceptance, operating, or outcome record. Any admitted artifact requires its own reviewed source identity.

## Public surfaces

- `/review/fieldbook/acquisition/`
- `/data/phase-120-evidence-acquisition-packets.json`
- Eighty enriched `/review/authority/rails/{slug}/` routes inherited from Phase 117

The hub is the only new HTML route. The eighty packet-bearing rail routes already existed and are counted as enhanced surfaces, not new routes.

## Completion standard

Phase 120 is complete when every Phase 117 rail and Candidate source resolves exactly once; every packet carries four unique target kinds and all required control fields; all 320 targets remain explicitly unreviewed with no exact artifact identity; all Phase 121 links remain placeholders over valid Phase 116 question IDs; all future Phase 60 decisions and receipts remain untouched; the hub, data endpoint, work package, update, and enriched rail template exist; and phase-local assertions and Astro checking pass.

## Verification

From `app/`:

```text
node ./scripts/build-phase120-evidence-acquisition-packets.mjs
node ./scripts/assert-phase120.mjs
npm run check
```
