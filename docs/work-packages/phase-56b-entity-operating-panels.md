# Phase 56B Work Package: Entity Operating Panels

Status: complete and owner-only deployed
Date: 2026-07-24  
Release boundary: owner-only; no public launch, DNS, package freeze, public GitHub, or custom-domain change

## Goal

Extend the strongest Phase 56A national and program series into named entity panels without treating national context as entity performance or turning unlike entities into a ranking.

## Delivered matrix

Phase 56B adds twelve Published panels in four portfolios:

1. Federal agency information security
   - NASA FISMA maturity, FY 2022-FY 2024
   - DHS FISMA effectiveness, FY 2021-FY 2023
   - HHS FISMA effectiveness, FY 2022-FY 2024
2. Manufacturing operations
   - Current Applications production output before and after a reported lean intervention
   - Island Components daily output before and after a reported lean intervention
   - Monaghan Medical line output before and after a reported lean intervention
3. Battery-storage assets
   - EIA plant code 260, Dynegy Moss Landing Power Plant Hybrid
   - EIA plant code 60014, Manatee Solar Energy Center
   - EIA plant code 63834, Gateway Energy Storage System
4. Reporting operating air carriers
   - United Airlines 2024-2025 cancellation rate
   - Southwest Airlines 2024-2025 cancellation rate
   - Delta Air Lines 2024-2025 cancellation rate

## Publication decisions

- 12 named entity panels: Published
- 4 proposed cross-entity rankings: In Review
- 17 supporting research documents: Published
- 17 supporting source profiles: current

The four holds prevent cross-agency, cross-manufacturer, cross-asset, and cross-carrier ranking. They do not challenge the official records or the bounded within-entity observations.

## Entity-panel contract

Every Published panel preserves:

- stable entity identifier;
- entity name and type;
- indicator and unit;
- denominator;
- covered period;
- geography and scope;
- collection or reporting method;
- source attribution;
- observation-level source links;
- revisions and reporting breaks;
- missing evidence;
- merger, exit, permit, or identity-change handling;
- comparison boundary.

At least two compatible observations are required. National or program context remains a separate evidence layer and is never substituted for entity performance.

## Evidence boundaries

- FISMA maturity and effectiveness labels do not share identical agency scope, component structure, tested systems, or annual metric design.
- NIST MEP success stories are company- and program-attributed intervention records, not independently audited causal estimates.
- EIA-860 nameplate power capacity is not stored energy, duration, availability, dispatch, safety, revenue, grid service, or customer reliability.
- DOT operating-carrier cancellation rates retain scheduled operations and cancellations. Marketing-carrier networks and the source table's cross-carrier rank are excluded.
- Two observations do not establish a durable trend.

## Integrated surfaces

- Research collection: `entity-operating-panels-2021-2026`
- Briefing: `research-watch-006-entity-operating-panels`
- Entity panel ledger: `app/src/data/phase-56b-entity-panels.json`
- Publication review: `app/src/data/phase-56b-publication-review.json`
- Comparison map: `comparative-outcomes-require-common-denominators`
- Eight topic profiles
- Six reader pathways
- Research Watch 005 handoff
- Public update log
- Downloadable 20-file collection archive with manifest and checksums

## Stop rules

- Stop or split a panel when entity identity, unit, denominator, method, geography, reporting scope, or attribution changes materially.
- Record mergers, exits, ownership changes, permit changes, revisions, and reporting breaks instead of silently rewriting prior observations.
- Keep agency, facility, asset, carrier, and national measures in separate measurement systems.
- Do not publish a ranking, composite, causal effect, readiness score, or cross-entity league table without a common independently reviewed measurement contract.
- Do not interpret unchanged capacity or ratings as unchanged operating performance.

## Next records

- Agency component and system control results, incidents, corrective actions, recovery, service effects, and mission outcomes.
- Repeat manufacturing output, labor, quality, scrap, downtime, cost, delivery, demand, and independent validation.
- Battery duration, availability, dispatch, safety, revenue, grid service, and customer-reliability outcomes.
- Later carrier cancellation, delay, complaint, accessibility, cause, schedule-mix, and airport-exposure records.

## Deployment receipt

- Validation: 422 sources, 188 signals, 141 Published signals, 47 In Review signals, 228 research documents, 231 current Published-support sources, and 950 generated pages.
- Local content commit: `1e5e03153d0744975630848fe4db736ce8c39519`
- Private Sites source commit: `34e41bb13b8d4b0a73d6201dac0c6e8ccb57e6bf`
- Sites version: 27 (`appgprj_6a614e1092d08191bf65779fc35df959~appgver_5f6c01b9b83481919aa83f59ce274207`)
- Deployment: `appgdep_6a640330de008191bd457d2d1b0bf9bf`
- URL: `https://ftfn-analytics.jbumstead.chatgpt.site`
- Access verification: custom owner-only policy, one allowed owner, no groups.
- Archive: 20 files with 17 official-link records; SHA-256 `3B708BADA252145BC77865C0E3ED74793CE72D203B4C6E74BDB197F3CBA565B6`.

## Handoff

Phase 56C should deepen the twelve panels into entity driver and constraint dossiers. Add entity-matched records for interventions, controls, inputs, constraints, and observed outcomes; require temporal ordering and explicit attribution; and preserve later observations before opening new indicators. Do not infer causation, rank entities, or create composite scores.
