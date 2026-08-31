# Phase 122 Work Package: Verification Playbook Library

**Edition:** FTFN v0.5<br>
**Effective date:** 2026-08-30
**Status:** Complete locally; aggregate v0.5 integration and publication remain separate steps.

## Goal

Turn the Phase 116 coverage grammar into a field-ready review library. Definitions say what a stage, claim, or quality dimension means. Phase 122 says how a reviewer makes and records the decision: which direct artifact is required, which tempting substitutes must be rejected, which checks must be run, where the reasoning must stop, and how a later correction reaches every dependent public surface.

## Delivered library

| Collection | Records | Purpose |
| --- | ---: | --- |
| Conversion-stage playbooks | 8 | Test Context through Comparable Outcome without transferring evidence between stages. |
| Claim-review protocols | 12 | Review baseline, research, plan, authority, commitment, implementation, validation, acceptance, operation, outcome, forecast, and correction claims. |
| Quality-audit cards | 10 | Audit identity, bounding, provenance, stage, place, freshness, measurement, comparability, uncertainty, and reproducibility. |
| Total leaf records | 30 | One procedural record for every Phase 116 method contract. |

Every leaf includes:

- what the method can establish;
- at least three minimum direct-evidence requirements;
- at least three false positives;
- at least three inadmissible substitutions;
- at least five ordered reviewer checks;
- a worked example and counterexample tied to explicit existing Published signal IDs;
- a stop rule;
- a four-step correction and propagation contract; and
- links to at least two encyclopedia foundations and two Phase 121 research missions.

## Public surfaces

- `/review/fieldbook/method/` — library hub.
- `/review/fieldbook/method/stages/{slug}/` — eight stage playbooks.
- `/review/fieldbook/method/claims/{slug}/` — twelve claim-review protocols.
- `/review/fieldbook/method/quality/{slug}/` — ten quality-audit cards.
- `/data/phase-122-verification-playbook-library.json` — complete machine-readable registry.

The library owns 31 HTML routes and one public JSON export. Aggregate navigation, sitemap, release-manifest, and v0.5 catalogue integration are owned by the v0.5 release layer rather than this phase-local package.

## Evidence and publication boundary

Phase 122 adds method, not evidence. It does not add or mutate a source, signal, gate, receipt, observation, outcome, score, ranking, or operational decision. A checklist cannot publish. Worked examples inherit the exact status, source lineage, scope, and limitations of existing Published signals. A failed requirement produces a stop or inadmissibility decision, never an inferred advancement.

Future Phase 60 gates remain scheduled and undecided. The September 1 Louisiana Starlink adoption check remains the next dated evidence operation.

## Deterministic build and verification

From `app/`:

```text
node ./scripts/build-phase122-verification-playbooks.mjs
node ./scripts/assert-phase122.mjs
node ./scripts/run-astro.mjs check
```

The assertion regenerates the registry in memory and compares it with the checked-in artifact. It also verifies exact collection counts, Phase 116 joins, procedural minimums, Published example signals, foundation and mission links, route inventory, the unchanged 795-source and 1,406-signal corpus, and all eleven untouched future Phase 60 gates.
