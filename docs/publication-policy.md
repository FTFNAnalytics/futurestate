# Publication Policy

This document defines how FTFN should move from reviewed records to published public intelligence on `ftfn.io`.

The short version:

```text
Launch candidate is not Published.
In Review is not Published.
Published means the record passed source, copy, citation, caveat, metadata, and correction-policy checks.
```

## Purpose

FTFN covers frontier systems, uncertain futures, and local constraints. That makes publication discipline part of the product. The site should help readers understand what is known, what is claimed, what is missing, and what could change.

The publication policy exists to keep FTFN from becoming:

- a press-release mirror,
- a hype amplifier,
- a stale data surface,
- a false-precision scoring system,
- or a local-outcome claim machine without local evidence.

## Publication States

### Draft Sample

Scaffold content used to test the model, schema, routes, and editorial posture.

Public treatment:

- visible during prelaunch only if clearly labeled,
- not launch material,
- not cited as public intelligence,
- not used as proof in briefings unless the briefing clearly says so.

### Draft

Editorial draft that may become reviewable.

Public treatment:

- normally hidden or de-emphasized in a launch context,
- not treated as evidence,
- can be used internally for development.

### In Review

Source-backed record that has passed a first editorial review but has not passed final publication review.

Public treatment:

- may be visible during prelaunch,
- must show status, verification, evidence quality, and source context,
- can support internal synthesis,
- should not be treated as finished public intelligence.

### Launch Candidate

Editorial triage label, not a schema status.

Public treatment:

- candidate for final launch review,
- still not `Published`,
- must pass the final publication gate before release.

### Published

Record approved for public use.

Public treatment:

- source links visible,
- publication date present,
- source checked dates current to the launch pass,
- caveats visible where needed,
- correction/update path active.

### Needs Update

Record with stale, incomplete, or materially changed context.

Public treatment:

- keep visible only if the stale status is clear,
- exclude from launch candidates until repaired,
- update source notes and editorial notes when repaired.

### Archived

Record preserved for history but no longer current.

Public treatment:

- clearly marked,
- not used as current evidence.

## Final Publication Gate

Before any record becomes `Published`, confirm:

- `npm run validate:content` passes.
- Required fields validate.
- Source URLs are visible or directly connected through the Atlas.
- Source checked dates are current to the publication pass.
- `published_date` is set.
- Record status is intentionally changed to `Published`.
- Verification status is `Reviewed` or `Verified Against Primary Source`.
- Evidence quality matches the source and claim.
- Company claims are labeled as interested-party evidence unless independently supported.
- Local outcomes are not claimed without local evidence.
- Evidence gaps are attached where unresolved gaps affect interpretation.
- The record can be understood without private notes.
- Public copy distinguishes evidence from interpretation.
- The record fits the FTFN thesis: dependencies, constraints, choices, or consequences.
- A correction/update path exists.

## Correction And Update Policy

FTFN should correct records when:

- a source changes,
- a link breaks,
- an official dataset is revised,
- a claim was too strong,
- a record misclassified evidence quality,
- a local implication overstated what evidence supports,
- or a better primary source becomes available.

Correction handling:

- Minor copy fixes do not need a public correction note.
- Material claim changes should be noted in editorial notes and, later, public update history.
- Source-date changes should update source `last_checked_date`.
- If a record becomes stale, use `Needs Update` before rewriting.
- If a record is no longer useful as current intelligence, use `Archived`.

Future product need:

FTFN should eventually add a public correction/update log or per-record update history. For MVP, the decision log and editorial notes are the control layer.

## Source Transparency

FTFN treats sources by type and incentive.

High-confidence source categories:

- official government agency pages,
- standards bodies,
- official statistical agencies,
- public data portals,
- research organizations and labs,
- peer-reviewed or formal technical publications.

Useful but limited categories:

- company press rooms,
- investor materials,
- trade reporting,
- credible journalism,
- expert commentary,
- forecasts and scenario analysis.

Rules:

- Company claims are interested-party evidence.
- Government data can still need interpretation and local context.
- Forecasts are probabilistic, not outcomes.
- Research findings do not automatically imply deployment.
- Standards progress does not automatically mean implementation progress.
- Local conclusions require local evidence.

## Source Transparency Surface Decision

Phase 34 decision:

FTFN should have a dedicated public Method page at `/method/`.

Rationale:

- About should explain what FTFN is.
- Method should explain how FTFN works.
- Source transparency and publication policy are trust infrastructure and should be easy to find.

The Method page can remain compact for MVP and expand later into a fuller editorial standards page.

## AI And Summaries

FTFN may use AI as an internal drafting, comparison, or summarization aid later, but public records should not rely on opaque machine-generated interpretation without human review.

MVP rule:

- human-reviewed source interpretation only,
- no automated publishing,
- no ingestion-to-public path,
- no numeric 42/59 scoring.

## Launch Policy

The first public launch should be small and defensible.

Minimum launch material:

- a clear homepage,
- About,
- Method/publication policy,
- a small launch-candidate signal set after final review,
- source profiles for all launch signals,
- clearly caveated local system profiles,
- existing qualitative dependency maps,
- one briefing only if its underlying signal set passes final review.

Do not launch with records that are merely broad source anchors unless their role is clearly labeled.

Phase 35 first applied this gate. The NOAA ENSO, USGS Mineral Commodity Summaries 2026, and NIST PQC records moved to `Published`; local constraint records stayed `In Review` until more specific conversion evidence exists.

Phase 36 visibility rule:

- Published signals appear first on the public signal index.
- `In Review` and `Draft Sample` signals remain visible in a labeled review shelf during the launch-readiness period.
- Non-published signal and briefing detail pages use `noindex, follow`.
- The launch sitemap includes only Published signal and briefing detail pages.

Phase 53 second publication-gate result:

- Six bounded records passed current primary-source, copy, citation, caveat, metadata, and correction-path review.
- The Published set now contains nine signals.
- Twenty-three signals remain a documented review shelf and one remains a Draft Sample.
- A public Publication Promotion entry records the decision.
- Company claims, broad source rails, and unresolved local outcomes remain outside the Published export.

## Open Questions

- Should `In Review` remain linked from public indexes after public launch, or move behind a clearer research/prelaunch route?
- Should each record eventually show a short "last materially updated" field?
- Should source checked dates appear in every card, or only detail pages?
- Should launch candidates become a schema field later, or remain an editorial document label?
