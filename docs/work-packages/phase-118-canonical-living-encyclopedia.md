# Phase 118 — Canonical Living Encyclopedia

**Status:** Complete<br>
**Effective date:** 2026-08-30
**Program:** FTFN v0.4 — Canonical authority and depth

## Content goal

Replace the shallow canonical-topic card shelves with a genuinely authored, evidence-bounded encyclopedia: seventeen domain chapters and ten cross-system foundations that explain history, current evidence, conversion dependencies, contested interpretations, decisive next records and claim limits.

## Delivered

- Seventeen distinct domain chapters aligned one-to-one with the canonical topic taxonomy.
- Ten cross-system foundation chapters covering evidence boundaries, the conversion ladder, dependencies, authority, finance, place, acceptance, measurement, correction and comparability.
- A common public chapter template with executive synthesis, historical baseline, current evidence state, four-stage conversion chain, contested readings and counterevidence, decisive evidence, explicit claim boundaries, curated signal cards and direct source trails.
- A public encyclopedia hub and 27 chapter routes.
- A stable JSON registry route containing the full editorial edition and evidence IDs.
- A read-only content compiler and an independent Phase 118 assertion script.

## Public routes

- `/review/encyclopedia/`
- `/review/encyclopedia/topics/[seventeen canonical topic slugs]/`
- `/review/encyclopedia/foundations/[ten foundation slugs]/`
- `/data/phase-118-canonical-living-encyclopedia.json`

The exact 29-route inventory is published in `app/src/data/phase-118-canonical-living-encyclopedia.json`.

## Editorial construction

Each chapter was written as a distinct synthesis over a curated set of existing Published signals. The route resolves those signal IDs through the canonical Astro content collections and derives source links only from each upstream signal's `source_ids`. The registry contains no copied private data and no newly invented source record.

The historical-baseline section is deliberately bounded to the dated history represented by the cited repository shelf. It is not described as a complete history of a technology or institution. The current-evidence section distinguishes what the shelf establishes from the next records needed for a stronger conclusion.

## Publication boundary

Phase 118 creates no new source fact, future receipt, scheduled gate decision, observation, causal finding, forecast, recommendation, score, ranking or outcome claim. It does not advance Phase 60 evidence gates. Every evidence link must resolve to an existing `Published` signal, and every displayed source must be inherited from that signal's existing source IDs.

## Verification

Run from `app/`:

```text
node ./scripts/build-phase118-content.mjs
node ./scripts/assert-phase118.mjs
npm.cmd run check
npm.cmd run build
```

The Phase 118 compiler checks canonical topic identity, required chapter sections, minimum substantive depth, unique editorial text, exact route inventory, Published signal status and source-reference integrity. The assertion script independently checks route templates, source derivation, evidence filtering and the delivered work package.

Phase-local verification passes at 27 chapters, 10,073 authored narrative words, 90 distinct curated Published signals, 130 linked source records and 29 public routes. Every chapter carries at least four explicit Published evidence links.
