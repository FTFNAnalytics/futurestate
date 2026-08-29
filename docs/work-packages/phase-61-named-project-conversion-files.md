# Phase 61 Work Package — Named Project Conversion Files

Status: **Complete locally on August 11, 2026; owner-only deployment pending.**

## Objective

Convert the Phase 59 synthesis layer and Phase 60 operating contract into named project and institutional files. Each file must say what entity is being followed, what evidence stage it has actually reached, what remains unresolved, which exact artifact can advance it, when or why the file reopens, and which reader surfaces must change with it.

This phase is editorial and structural. It does not create readiness scores, infer outcomes, or replace Phase 60's dated evidence decisions.

## 61A — Gap Reconciliation

All sixteen evidence gaps now appear in the Phase 61 operating register with:

- one exact next artifact;
- either a next-check date or a source-explicit reopening trigger;
- links to a named conversion file when the current corpus supports one.

`gap-004` and `gap-005` are reconciled to Toronto City Council's July 29-30 adoption of item `2026.SC33.9`. The past-due pre-Council language is removed. The gaps now hold at amendment enactment, condition compliance, permit, start, completion, and occupancy.

## 61B — Stable Project Registry

The public-safe registry is `app/src/data/phase-61-project-conversion-registry.json`. Every record includes:

- stable file ID and kind;
- named entity;
- current evidence stage;
- established and unresolved claims;
- exact next artifact;
- next-check date or reopening trigger;
- explicit stop rule;
- source, signal, gap, local-system, briefing, pathway, and dependency-map IDs.

The public export is `/data/project-conversion.json`.

## 61C — Five Local Project Files

1. TSMC Arizona campus.
2. Toronto application `24 254930`.
3. Northern Virginia Golden-Mars and GS-5 large-load delivery.
4. Space Coast Shuttle Landing Facility, LC-39A, and SLC-40 authority-to-mission stack.
5. Nevada lithium project pair: Thacker Pass and Rhyolite Ridge.

Each file is Published and linked from its local system and assigned reader pathways.

## 61D — Three Named Adoption Cases

1. GSA post-quantum acquisition path.
2. NIST ARIA assurance path.
3. Waymo California fared driverless service.

The cases turn broad technology-adoption dossiers into named institution or operator trails without treating standards, procurement paths, pilots, authority, or reporting rules as accepted outcomes.

## 61E — Flagship Synthesis

`Project Conversion Watch 001: Where Authority Became Delivery — And Where It Did Not` compares all eight files. It highlights Toronto's bounded Council-stage advancement and explains why the other files remain split across authority, construction, service, acceptance, and outcome stages.

## Verified Delta

| Measure | Phase 61 delta |
| --- | ---: |
| Named conversion files | 8 |
| Local project files | 5 |
| Adoption cases | 3 |
| Gap operations reconciled | 16 |
| Evidence-gap records updated | 2 |
| Published briefings | 9 |
| Local systems deepened | 5 |
| Reader pathways deepened | 10 |
| Dependency maps deepened | 2 |
| Public JSON exports | 1 |
| Public updates | 1 |
| New sources | 0 |
| New signals | 0 |
| Signal promotions | 0 |
| Composite scores | 0 |
| Operating-outcome changes | 0 |

## Release Contract

The Phase 61 candidate contains:

- 3,891 generated HTML pages;
- 715 sources;
- 1,406 signals: 1,120 Published and 286 In Review;
- 87 briefings: 80 Published and seven In Review;
- nine dependency maps: eight Published and one In Review;
- sixteen evidence gaps;
- fifteen reader pathways across nineteen Atlas surfaces;
- 84 public updates;
- sixty-one research collections and 1,533 research documents;
- 1,326 Published research export records;
- ten held evidence-queue records;
- thirteen Evidence Cycle 001 records;
- eight named project-conversion records;
- eight public JSON exports;
- 501 current Published-support sources.

Required checks:

```text
npm.cmd run validate:content
npm.cmd run validate:candidates
npm.cmd run source:health
npm.cmd run check
npm.cmd run build
npm.cmd run verify:phase58
npm.cmd run verify:phase59
npm.cmd run verify:phase60
npm.cmd run verify:phase61
npm.cmd run verify:release
git diff --check
```

## Boundaries

Phase 61 does not:

- pre-complete Phase 60's August 14 through October 9 checks;
- infer that evidence does not exist from a bounded negative result;
- convert authorization, a rate, permit, agreement, procurement path, pilot, or licence listing into accepted operation;
- create a readiness, performance, probability, risk, or value score;
- add or promote a signal;
- deploy the local candidate, change owner-only access, synchronize public GitHub, attach the domain, alter DNS, or launch publicly.

## Exit State

The named-file layer is complete locally when the Phase 61 assertion, full content validation, static build, and release verification pass. Phase 60 remains operational rather than historically closed: future evidence decisions must be created on their actual check dates and propagated through the assigned surfaces.
