# Phase 55Z Comparative Operating Outcomes

Date: 2026-07-24

Status: complete and owner-only deployed

## Objective

Move FTFN from isolated operating records toward useful outcome trails without inventing a cross-system score. The phase adds four balanced evidence portfolios and permits comparison only when the unit, denominator, period, geography, method, and attribution are compatible.

## Delivered Scope

| Portfolio | Primary records | Published documents | Held documents | Published signals | Held signals |
| --- | ---: | ---: | ---: | ---: | ---: |
| Institutional AI and cybersecurity operation | 8 | 7 | 1 | 3 | 1 |
| Manufacturing workforce and production outcomes | 8 | 7 | 1 | 3 | 1 |
| Grid, water, storage, and critical-minerals performance | 8 | 7 | 1 | 3 | 1 |
| Mobility, aviation, and space service or mission outcomes | 8 | 7 | 1 | 3 | 1 |
| Total | 32 | 28 | 4 | 12 | 4 |

The machine-readable decision record is `app/src/data/phase-55z-publication-review.json`.

## Evidence Matrix

### Institutional AI And Cybersecurity

- GAO federal generative-AI use, acquisitions, IRS governance, and operational use-case records.
- NASA's 2024 AI use-case inventory.
- GAO Continuous Diagnostics and Mitigation, FISMA effectiveness, and incident-response records.
- Published outcomes cover federal AI inventory growth, the IRS development-versus-operation boundary, and CDM data-quality remediation.
- Hold: NASA's disclosed active use cases do not expose a compatible public outcome measure.

### Manufacturing Workforce And Production

- NIST MEP FY2024 network results and client-challenge data.
- Manufacturing USA report-to-Congress material.
- NIIMBL, MxD, IACMI, door-to-floor training, and Arizona MEP company-result records.
- Published outcomes cover MEP client-reported results, a 47-graduate NIIMBL cohort, and company/program-attributed savings at Amphenol.
- Hold: Manufacturing USA engagement totals do not provide a common completion or production denominator.

### Infrastructure Performance

- NERC reliability, EIA outage duration, battery-capacity, and battery-market records.
- EPA water-reuse action-plan and monitoring-practice records.
- USGS Mineral Commodity Summaries and its associated data release.
- Published outcomes cover U.S. customer outage duration, Texas battery frequency response, and U.S. mineral production and import reliance.
- Hold: the fifth-year water-reuse action-plan record lacks a national operating-volume denominator.

### Mobility, Aviation, And Space

- BTS airline consumer and on-time tables.
- CPUC autonomous-vehicle reporting, California DMV test miles, and NHTSA standing-general-order crash data.
- FAA commercial-space milestones and NASA space-operations outcomes.
- Published outcomes cover the U.S. airline cancellation rate, California autonomous-vehicle test mileage, and the FAA's thousandth commercial-space operation.
- Hold: CPUC reporting still needs a current, public, method-compatible rollup.

## Comparison Boundary

FTFN does not rank institutions, programs, corridors, operators, technologies, or jurisdictions from these records. A comparison is allowed only when all of the following align:

1. unit,
2. denominator,
3. reporting period,
4. geography or operating scope,
5. collection and calculation method,
6. attribution boundary.

If any field is missing or incompatible, the record remains an independently useful outcome, a context record, or an explicit hold. The Published dependency map `Comparative Outcomes Require Common Denominators` and evidence gap `gap-016` preserve this rule in the public product.

## Product Integration

Phase 55Z adds:

- the `Comparative Operating Outcomes 2023-2026` research collection;
- Research Watch 004;
- one Published comparison-boundary dependency map;
- evidence gap `gap-016`;
- 30 new source profiles supporting 32 research-document records;
- 16 bounded signals with twelve Published and four `In Review`;
- a 35-file archive containing 32 official-link records, summaries, README, and manifest;
- one public update entry.

The outcome evidence is integrated into:

- eight reader pathways,
- eleven topic pages,
- seven existing evidence gaps,
- the research, signals, Source Monitor, topic, briefing, map, update, sitemap, and public-data surfaces.

## Release Contract

The verified local candidate contains:

- 780 generated HTML pages,
- 357 sources,
- 152 signals: 113 Published and 39 `In Review`,
- 17 topics,
- 19 organizations,
- 5 technologies,
- 5 local systems,
- 12 briefings: 5 Published and 7 `In Review`,
- 16 evidence gaps,
- 7 dependency maps: 6 Published and 1 `In Review`,
- 9 research collections with 163 research documents,
- 15 reader pathways across 19 Atlas surfaces,
- 28 update entries,
- 166 current Published-support sources,
- 5 public JSON exports.

The Phase 55Z archive is:

- path: `app/public/downloads/comparative-operating-outcomes-2023-2026.zip`
- file count: 35
- SHA-256: `6DA1BB8CCD3CB6FE344ED7363CD80C1A9E5373216F2B0F0573D165D273F143DE`

## Validation

Passed:

- `npm.cmd run validate:content`
- `npm.cmd run validate:candidates`
- `npm.cmd run source:health`
- Phase 55Z archive generation and manifest verification
- `npm.cmd run check`
- `npm.cmd run build`
- `npm.cmd run verify:release`
- `git diff --check`

The release assertions require exact Published sitemap membership, non-published indexing exclusion, current Published-support sources, all research routes and archive files, the Phase 55Z signal and document decisions, pathway rendering, public exports, and private-registry exclusion.

## Deployment Boundary

Local app commit `db18ef9` is represented by private Sites source commit `2f1c2e6d07f24a75a80d0fb83bab123b38fa2fbf` and deployed from the verified 780-page package as Sites version 25 in deployment `appgdep_6a63f3041f8481918754adf70ddeea70`. Deployment status passed at `https://ftfn-analytics.jbumstead.chatgpt.site`, and the access policy remains custom with one allowed owner and no groups.

This phase does not authorize:

- public access,
- `0.2.0` package freeze,
- public GitHub synchronization,
- `ftfn.io` or `www.ftfn.io` attachment,
- Hostinger or Google Workspace DNS changes,
- automated publication.

## Next Phase

Phase 56A should build within-domain longitudinal outcome series:

- 48 primary records,
- 20 bounded signals,
- four twelve-record portfolios,
- at least two compatible time points for every published series,
- no cross-domain ranking.

The four portfolios are institutional AI/cyber system performance, manufacturing cohort and facility production, asset-level grid/water/storage/mineral performance, and carrier/operator/mission service outcomes. Dated project checks remain bounded inserts and do not pause the queue.
