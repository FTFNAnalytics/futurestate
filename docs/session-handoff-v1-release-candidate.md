# FTFN v1 release-candidate session handoff

**Effective date:** 2026-08-31  
**Current state:** Complete locally — v1 promotion held

## Read first

1. `docs/roadmap-v1-release-candidate.md`
2. `app/src/data/phase-145-evidence-gate-operations-journal.json`
3. `app/src/data/phase-146-authority-gap-resolution-program.json`
4. `app/src/data/phase-147-evidence-adjudication-record.json`
5. `app/src/data/phase-149-longitudinal-evidence-lab.json`
6. `app/src/data/phase-156-v1-launch-decision.json`

## Completed now

- Phases 145–156 are generated as a v1 release candidate.
- Alternative official-source shelves, source-linked field guides, sourced reports, method records, route inventories, and derived audit contracts are complete.
- Historical Phase 130–144 source checks, decisions, and validation receipt remain unchanged.

## Do not automate

- Future-dated Phase 60 or Phase 61 decisions.
- Requirement or mission owner adjudication.
- Authority close/carry/exclusion disposition.
- Acceptance of the zero-series launch boundary.
- Owner acceptance, public launch, hosting, custom domain, or DNS.

## Validation sequence

Receipt `156-LOCAL-VALIDATION-2026-08-31-a750bba9528e` is immutable and matches the current normalized candidate digest. Do not rerun the finalizer unless that digest changes.

Run from `app/`:

```text
npm run build:v1rc-content
npm run validate:candidates
npm run validate:content
npm run source:health
npm run test:v1rc
npm run check
npm run build
npm run verify:v1rc
npm run update:v1rc-manifest
npm run verify:release
```

## Current launch truth

- Held: evidence admission — 18 requirement and 6 mission decision(s) still lack a valid terminal owner receipt.
- Held: authority coverage — 12 of twelve authority gaps still require a dated owner close, carry, or exclusion disposition; alternative discovery alone does not clear the gate.
- Pass: atlas identity — All thirty-nine canonical project and place identities have a Phase 148 baseline review.
- Pass: project chronicles — Twenty-four stage-bounded project chronicles remain published.
- Pass: place ledgers — Fifteen receiving-system ledgers remain published without synthetic place stages.
- Held: longitudinal evidence — No series is admitted and the prepared zero-series launch boundary has not received owner acceptance.
- Pass: comparative integrity — All twelve passports retain explicit compatibility limits, zero scores, and zero ranks.
- Pass: content depth — Seventeen source-linked field guides and four reports with sixteen sourced claim blocks and at least 765 authored words each pass the content-depth contract.
- Pass: editorial cadence — Four source-binding edition templates are prepared, no future content is prepublished, and every due desk window and edition has a lawful terminal receipt.
- Pass: calendar gate integrity — As of 2026-08-31, all due operations have lawful dated receipts and every later operation remains scheduled with null decision fields.
- Pass: machine-readable contract — Twelve phase registries and one aggregate expose the v1 release-candidate layer as schema-1.0 JSON.
- Pass: accessible structure — The Phase 156 receipt structurally audited 58 v1-RC routes.
- Pass: release validation — Local validation receipt 156-LOCAL-VALIDATION-2026-08-31-a750bba9528e passed and matches candidate digest 5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a.
- Held: owner acceptance — No complete owner receipt binds the exact candidate digest, commit, fourteen-gate snapshot, limitations, and v1-promotion authorization.
