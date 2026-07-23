# Launch Candidate Review

This document records the final publication review for the first small FTFN launch-candidate signal set.

Launch candidate is not `Published`. A record only becomes `Published` after source, copy, citation, caveat, metadata, and correction-policy checks.

## Phase 35 Review Summary

Review date: 2026-06-14.

Phase 35 reviewed six launch-candidate signal records:

- `signal-sample-001`
- `signal-sample-002`
- `signal-sample-007`
- `signal-arizona-electricity-profile-chip-corridor-power-constraint`
- `signal-arizona-water-resources-chip-corridor-constraint-map`
- `signal-statcan-building-permits-construction-intentions-signal`

Outcome:

- 3 records moved to `Published`.
- 3 records stayed `In Review`.
- No local constraint record was promoted to `Published`.
- No company-claim record was promoted.
- No automation, ingestion, scoring, CMS, graph library, or database work was started.

## Source Checks

Official or primary source pages rechecked on 2026-06-14:

| Source | URL | Phase 35 finding |
| --- | --- | --- |
| NOAA CPC ENSO Diagnostic Discussion | https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml | Current discussion is dated 11 June 2026, lists El Nino Advisory status, includes regional caveat language, and schedules the next discussion for 9 July 2026. |
| USGS Mineral Commodity Summaries 2026 | https://pubs.usgs.gov/publication/mcs2026 | 2026 publication page, DOI, report link, data release, version history, and May 2026 revision metadata remain available. |
| NIST Post-Quantum Cryptography Project | https://csrc.nist.gov/Projects/post-quantum-cryptography | Page was updated 8 June 2026 and continues to support final standards plus migration framing. |
| EIA Arizona Electricity Profile | https://www.eia.gov/electricity/state/arizona/index.php | 2024 Arizona profile remains available with statewide capacity, generation, sales, price, and data-source context. |
| EIA Electricity Data | https://www.eia.gov/electricity/data.php | Electricity data hub remains available with current monthly electricity data release links. |
| Arizona Department of Water Resources | https://www.azwater.gov/ | Program and data-tool links remain available for water governance, supply, demand, wells, permitting, and related evidence. |
| Arizona Assured and Adequate Water Supply Programs | https://www.azwater.gov/aaws/aaws-overview | Page supports physical, continuous, legal, water-quality, financial, and management-plan criteria, but not facility-level sufficiency. |
| Arizona Corporation Commission Utilities Division | https://www.azcc.gov/utilities | Page supports utility jurisdiction, tariff links, and annual-report links. |
| Statistics Canada Building Permits Survey | https://www.statcan.gc.ca/en/survey/business/2802 | Page supports monthly construction-intention framing and The Daily release pathway. |
| CMHC Housing Market Data | https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research/housing-data/data-tables/housing-market-data | Page supports starts, completions, units under construction, and building-permit-to-start duration tables. |
| CMHC Housing Market Information Portal | https://www03.cmhc-schl.gc.ca/hmip-pimh/portal | Portal remains useful as supporting context, but specific tables should carry the weight for claims. |

## Published Records

### `signal-sample-001`

Decision:

Move to `Published`.

Reason:

The record is tied to a dated official NOAA CPC discussion, is time-bound, clearly identifies the forecast source, and keeps local implications caveated.

Publication caveat:

Recheck after the scheduled 9 July 2026 ENSO discussion. Do not convert global ENSO probabilities into local claims without regional climate, infrastructure, and sector evidence.

### `signal-sample-002`

Decision:

Move to `Published`.

Reason:

USGS Mineral Commodity Summaries 2026 is a stable official annual source. The record is framed as a baseline, not a commodity-specific shortage, market-price, or project-viability claim.

Publication caveat:

Commodity-specific conclusions require follow-up records.

### `signal-sample-007`

Decision:

Move to `Published`.

Reason:

NIST's PQC project page is a primary standards source and the signal clearly separates standards availability from institution-level migration.

Publication caveat:

The record does not prove vendor readiness, institution-level migration, cryptographic inventory completion, procurement compliance, or critical-infrastructure execution.

## Held In Review

### `signal-arizona-electricity-profile-chip-corridor-power-constraint`

Decision:

Keep `In Review`.

Reason:

EIA and ACC sources support state-level electricity context and utility-regulatory pathways, but not facility-level power readiness.

Publication blocker:

Needs a specific utility filing, interconnection record, service-territory source, rate-case item, facility demand estimate, or demand forecast.

### `signal-arizona-water-resources-chip-corridor-constraint-map`

Decision:

Keep `In Review`.

Reason:

ADWR and AAWS sources support water-governance and 100-year supply-criteria context, but not provider capacity or facility-level water sufficiency.

Publication blocker:

Needs provider records, facility water demand, reuse plans, discharge evidence, permits, or local reporting.

### `signal-statcan-building-permits-construction-intentions-signal`

Decision:

Keep `In Review`.

Reason:

StatCan and CMHC sources support the distinction between construction intentions and delivery outcomes, but the record is still too general for publication.

Publication blocker:

Needs a specific monthly release, geography, municipal comparison, or permit-to-start-to-completion conversion question.

## Public Surface Check

Phase 35 also added publication-date visibility to signal detail pages. A `Published` signal now exposes:

- record status,
- publication date,
- captured date,
- verification status,
- evidence quality,
- source checked dates,
- claim scope,
- local evidence level,
- evidence gaps where relevant,
- original source links.

## Phase 53 Publication Review

Review date: 2026-07-22.

Phase 53 applied the current publication policy to all 33 signal records. The result is a nine-record Published set, a 23-record `In Review` shelf, and one retained `Draft Sample`.

Six records moved from `In Review` to `Published`:

| Record | Decision | Boundary retained |
| --- | --- | --- |
| `signal-doe-critical-minerals-materials-accelerator-nofo` | Published | Funding opportunity, not an award or deployment result. |
| `signal-nsf-ai-materials-institute-award-2433348` | Published | Award and proposed scope, not scientific results or delivered infrastructure. |
| `signal-usgs-2026-gallium-import-supplied-semiconductor-constraint` | Published | National commodity structure, not a current shortage or facility disruption. |
| `signal-srp-e67-large-load-service-conditions` | Published | Tariff conditions, not proof of adequate site capacity or a customer agreement. |
| `signal-srp-huckleberry-meta-mesa-online-service` | Published | One named customer project, not corridor-wide spare capacity or transfer to TSMC. |
| `signal-toronto-2025-development-pipeline-delivery-gap` | Published | Pipeline potential and stage counts, not guaranteed completions. |

The three earlier Published records also passed a current-source recheck: NOAA's 9 July ENSO discussion, USGS Mineral Commodity Summaries 2026 version 1.3, and NIST's current PQC standards and migration page.

No record moved to `Needs Update` or `Archived`. The remaining records stay in review for specific item, local stage, outcome, live-award, authority, or interested-party evidence reasons. The complete record-by-record matrix is in `docs/work-packages/phase-53-publication-candidate-review.md`.

## Follow-Up

Phase 53 completed the second publication gate without deploying.

Current next scope:

- run Phase 54 desktop and mobile browser and accessibility QA,
- inspect the nine Published routes, update log, exports, `robots.txt`, `sitemap.xml`, canonical metadata, and noindex routes,
- prepare the v0.2 launch note and limitations statement,
- decide whether to execute a preview deploy only after explicit approval,
- keep production domain attachment, DNS changes, analytics, automation, ingestion, CMS, database migration, scoring, and accounts out of scope unless separately approved.

## Phase 55F Publication Review

Review date: 2026-07-23.

Phase 55F reviewed the eight records repaired or added in Phase 55E. Seven moved to `Published`:

| Record | Decision boundary |
| --- | --- |
| `signal-sample-009` | Aggregate IEA data-centre electricity growth and bottleneck analysis, not AI-only demand or a local capacity forecast. |
| `signal-sample-005` | NHTSA reporting rule and data-quality limits, not normalized manufacturer safety rankings. |
| `signal-sample-003` | Definitive CHIPS funding agreement, not a qualified material, commercial product, fab, or production result. |
| `signal-sample-006` | Artemis hardware-integration milestone, not launch readiness, schedule proof, or mission success. |
| `signal-sample-008` | USDA award portfolio, not successful traits, field performance, commercialization, or adoption. |
| `signal-statcan-building-permits-construction-intentions-signal` | Specific monthly permit intentions, not starts, completions, affordability, or delivered housing. |
| `signal-doe-storage-step-prize-production-readiness` | Prize design and funding intent, not a winner, validated production process, or deployment. |

`signal-sample-010` remains `In Review`. Joby's first-flight and aircraft-status descriptions remain interested-party evidence, while the selected FAA page provides general program context rather than independent confirmation of the aircraft milestone.

The complete decision matrix is in `docs/work-packages/phase-55f-publication-readiness-review.md`.

## Phase 55F Follow-Up

The Published set now contains 16 records and the public update log contains eight entries. The next content lane should follow named downstream evidence rather than add volume:

- Toronto Council and by-law evidence after the 29-31 July 2026 meeting window,
- Project Baccara's executed county record or final air permit,
- or a named federal-agency post-quantum implementation or procurement record.

The Sites deployment remains owner-only. Package freeze, public access, custom-domain attachment, Hostinger DNS changes, and public launch remain separate decisions.
