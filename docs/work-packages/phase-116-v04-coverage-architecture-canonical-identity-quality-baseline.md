# Phase 116 — Coverage architecture, canonical identity, and quality baseline

**Status:** Complete<br>
**Effective date:** 2026-08-30
**Program:** FTFN v0.4 — The Public Conversion Observatory

## Objective

Replace implicit coverage and page-count growth with a public, testable definition of what FTFN covers, which entities it is discussing, which conversion question each record can answer, and what evidence is required before a topic, place, case or comparison can be called complete.

Phase 116 is the control surface for the rest of v0.4. It reconciles the editorial program handed forward by Phases 103–115 without changing the status of any source, signal, project, gate, observation or outcome.

## Delivered

- One machine-readable coverage architecture at `app/src/data/phase-116-coverage-architecture.json`.
- 56 canonical editorial entities:
  - 17 topics;
  - 15 local systems;
  - 24 casebooks.
- 154 type-scoped discovery aliases with explicit non-equivalence rules.
- The eight Phase 64 conversion stages preserved verbatim and in order.
- A twelve-type claim taxonomy from baseline and announcement through acceptance, recurring operation, outcome and correction.
- Nine geographic scope types, seventeen canonical current evidence areas and six expansion priorities.
- Ten independent quality dimensions and six non-aggregated completion states.
- 68 priority research questions: four for each topic across baseline, conversion, operation and outcome horizons.
- One 17-row coverage matrix linking every topic to its current sources, Published signals, place systems, casebooks, conversion stages and next structural action.
- Eighteen public routes: one coverage hub and one topic coverage file for each topic.
- One machine-readable public JSON route and one dated public update.
- A deterministic builder and a phase-specific assertion suite.

## Baseline findings

The frozen Phase 115 handoff contains 1,121 Published signals and 715 registered sources. Those totals describe inventory, not adequacy.

The reconciliation exposes two distinct representation gaps:

- five local systems are schema-validated content records, while ten are editorial portraits awaiting promotion;
- eight casebooks resolve governed Phase 61 conversion files, while sixteen are editorial narratives awaiting named conversion files.

Four topics have no mapped local-system portrait in the current editorial shelf: Agriculture and Bioeconomy, AI for Science, Discovery Technologies, and Quantum. Agriculture and Bioeconomy also has no mapped named casebook. These are coverage gaps, not claims that no relevant project or place exists.

## Canonical identity contract

1. Topics, local systems and casebooks receive stable semantic canonical IDs.
2. Existing governed Phase 61 file IDs, Phase 112 portrait IDs and Phase 113 casebook IDs remain resolvable aliases or linked upstream IDs; they are not rewritten.
3. Aliases resolve only within an entity type. A shared name or keyword never proves that two facilities, projects, operators, services or cohorts are the same object.
4. A later split, merge or rename requires a dated change record that retains every prior ID and public route.
5. Canonicalization improves discovery and joins. It creates no new factual equivalence beyond the explicit mapping.

## Conversion and claim contract

The eight conversion stages remain evidence questions:

1. named context or baseline;
2. policy or authority;
3. finance, procurement or agreement;
4. build or implementation;
5. test, compliance or qualification;
6. accepted service, product or cutover;
7. recurring operation or output;
8. comparable outcome.

Technology maturity and conversion evidence are different systems. A mature technology can remain blocked at authority, finance, implementation or acceptance. A large number of signals cannot advance a named file to a later stage.

The claim taxonomy further distinguishes baseline, research, announcement, authority, commitment, implementation, validation, acceptance, recurring operation or adoption, measured outcome, forecast and correction. Each type publishes minimum evidence and an explicit stopping boundary.

## Quality contract

Every substantive artifact is reviewed independently for:

1. canonical identity;
2. claim bounding;
3. authority and provenance;
4. conversion-stage clarity;
5. geographic and local specificity;
6. time and freshness;
7. measurement and denominator;
8. comparability;
9. uncertainty and alternatives;
10. reproducibility and correction.

The completion states are Unmapped, Identified, Bounded, Evidenced, Reviewed and Maintained. They are never summed, averaged or converted into a rank. A failure in identity or denominator cannot be offset by strong prose or a large source count.

## Public routes

- `/review/coverage/`
- `/review/coverage/advanced-manufacturing/`
- `/review/coverage/agriculture-and-bioeconomy/`
- `/review/coverage/ai-for-science/`
- `/review/coverage/aviation/`
- `/review/coverage/chips-and-compute/`
- `/review/coverage/climate/`
- `/review/coverage/critical-minerals/`
- `/review/coverage/cybersecurity/`
- `/review/coverage/discovery-technologies/`
- `/review/coverage/energy/`
- `/review/coverage/finance-and-risk/`
- `/review/coverage/human-futures/`
- `/review/coverage/mobility/`
- `/review/coverage/policy-and-standards/`
- `/review/coverage/quantum/`
- `/review/coverage/space/`
- `/review/coverage/water/`
- `/data/phase-116-coverage-architecture.json`

The data route is a machine-readable contract and is not counted among the eighteen editorial routes.

## Publication boundary

Phase 116 creates no source fact, future receipt, evidence-gate decision, observation, outcome, score, ranking or translation approval. It does not infer evidence quality from record volume or treat technology maturity as a conversion stage. Every future Phase 60 gate remains scheduled until its due date and official-source review.

## Verification

- `node scripts/build-phase116-content.mjs`
- `node scripts/assert-phase116.mjs`
- candidate/source/reference validation
- Phase 58–61 assertions
- Astro content check and production build
- release verification and git diff review after shared integration
