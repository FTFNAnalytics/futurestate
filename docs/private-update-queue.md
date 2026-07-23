# Private Update Queue

Date: 2026-07-22

This is the first private source-update queue for v0.2. It turns source monitoring into a human-reviewed editorial workflow before any automated ingestion or public publishing.

## Purpose

The private update queue exists to answer:

- which sources should be checked next,
- why they matter,
- what signal or local dossier they might support,
- what the source can prove,
- what it cannot prove,
- what a human should do next.

It does not publish records, rewrite public content, generate claims automatically, or replace source review.

## Queue Item Fields

Each item should include:

```text
queue_id
status
source_id
source_url
watch_lane
related_signal_or_gap
review_reason
what_to_check
candidate_output
evidence_boundary
human_next_action
last_queue_reviewed
```

Recommended statuses:

```text
Candidate
Needs Source Recheck
Needs Manual Portal Review
Ready For Signal Repair
Ready For Local Dossier Selection
Signal Repaired
Signal Draft Created
Blocked
Archived
```

## Batch 01: v0.2 Source Review Candidates

| Queue ID | Status | Source | Watch Lane | Candidate Output | Human Next Action |
| --- | --- | --- | --- | --- | --- |
| uq-001 | Signal Repaired | `source-noaa-cpc-enso` | Climate | Repaired the existing ENSO signal with the 9 July 2026 discussion. | Watch the next NOAA CPC discussion scheduled for 13 August 2026. |
| uq-002 | Signal Draft Created | `source-arizona-corporation-commission-edocket` | Power and Grid / Local Systems | Selected Project Baccara docket `L-21369A-25-0222-00253` and added a bounded facility-level CEC signal. | Track the full CEC conditions plus ADEQ air, county, military-compatibility, construction, interconnection, water, and operating records. |
| uq-003 | Signal Draft Created | `source-city-toronto-application-information-centre` | Local Systems / Finance and Human Futures | Selected Toronto application 24 254930 ESC 20 OZ and created a bounded named planning-record signal. | Track later AIC, staff-report, decision, servicing, permit, start, and completion records without inferring current status from the dated notice. |
| uq-004 | Source Rechecked | `source-ontario-housing-supply-progress` | Finance and Human Futures / Local Systems | Rechecked the live tracker; it still reports the 2024 target year and says the page was updated December 15, 2025. | Watch for a later target year or methodology update; do not describe the current page as a 2025 or 2026 delivery measure. |
| uq-005 | Candidate | `source-chips-for-america-awards` | Compute and Chips | CHIPS award or facility milestone signal. | Select a specific award announcement and pair with company filings or local records before making capacity claims. |
| uq-006 | Signal Draft Created | `source-federal-register-api` | Cross-Cutting Official Rails | Regulatory watch-rail signal created in Phase 48. | Select a specific FAA, NHTSA, DOE, FERC, CISA, BIS, NOAA, USDA, or NASA document before promoting the rail into a dated publication candidate. |
| uq-007 | Signal Draft Created | `source-regulations-gov-api` | Cross-Cutting Official Rails | Docket/document watch-rail signal created in Phase 48. | Pair a specific docket and document ID with the Federal Register record before making a regulatory outcome claim. |
| uq-008 | Candidate | `source-nist-nvd-api` | Security and Standards | Vulnerability/data-source signal for Cybersecurity. | Choose a bounded vulnerability trend, API change, or source-use signal; do not turn raw CVE volume into a risk claim without context. |
| uq-009 | Signal Draft Created | `source-cisa-kev-catalog` | Security and Standards | CISA KEV operating-rail signal created in Phase 48. | Pull the JSON feed directly and select a specific KEV entry or update window before making count-based or latest-entry claims. |
| uq-010 | Candidate | `source-cisa-cybersecurity-advisories` | Security and Standards | Advisory-driven security signal. | Select a specific advisory and identify affected systems, mitigations, and limits. |
| uq-011 | Candidate | `source-faa-dynamic-regulatory-system` | Mobility Certification | FAA certification/regulatory document signal. | Select a specific FAA document before repairing aviation/AAM records. |
| uq-012 | Candidate | `source-nhtsa-sgo-crash-reporting` | Mobility Certification | AV/ADAS crash reporting signal. | Select a specific data release, update, or reporting action before repairing the NHTSA signal. |
| uq-013 | Candidate | `source-eia-grid-monitor` | Power and Grid | Grid demand/reliability signal. | Choose a specific geography/time window; avoid broad AI-grid claims without local or regional evidence. |
| uq-014 | Candidate | `source-nerc-reliability-assessments` | Power and Grid | Reliability assessment signal. | Select a seasonal or long-term assessment and extract only bounded reliability claims. |
| uq-015 | Candidate | `source-us-drought-monitor-data` | Climate / Water | Drought condition signal. | Select a weekly update and tie it to water/agriculture/local implications only with caveats. |
| uq-016 | Candidate | `source-usgs-water-services` | Water / Local Systems | Water-data signal or local evidence candidate. | Select specific site, basin, variable, and period before making local water claims. |
| uq-017 | Candidate | `source-nasa-earthdata-cmr-api` | Discovery Technologies | Discovery/data-catalog signal. | Select a dataset family, collection, instrument, or data-access change before writing a signal. |
| uq-018 | Candidate | `source-usgs-3d-elevation-program` | Discovery Technologies / Local Systems | 3DEP/lidar evidence signal. | Select a product, coverage, or acquisition update; do not infer local planning outcomes from data availability alone. |
| uq-019 | Candidate | `source-statcan-web-data-service` | Finance and Human Futures | Canadian statistical update signal. | Select a table, geography, period, and release; pair with CMHC where interpreting housing conversion. |
| uq-020 | Candidate | `source-cmhc-starts-completions-under-construction` | Finance and Human Futures | Starts/completions conversion signal. | Select geography and table release; distinguish permits, starts, completions, and units under construction. |

## Batch 02: Phase 49 Promoted-Source Candidates

These items come from the 36-source Phase 49 promotion batch. They should be used to select bounded source items, not to create claims from broad catalog presence.

| Queue ID | Status | Source | Watch Lane | Candidate Output | Human Next Action |
| --- | --- | --- | --- | --- | --- |
| uq-021 | Candidate | `source-govinfo-api` | Cross-Cutting Official Rails | Official federal document source item for a policy or standards signal. | Select one collection, package, or document and pair it with agency context before writing a signal. |
| uq-022 | Signal Draft Created | `source-usaspending-api` | Finance and Human Futures / Compute and Chips | Selected assistance award DEMS0000003 to Talon Nickel (USA) LLC as a funding-to-deployment trail. | Watch transactions and pair the award with site, permit, construction, commissioning, production, and offtake evidence. |
| uq-023 | Published | `source-grants-gov-api` | Cross-Cutting Official Rails / AI and Advanced Manufacturing | DOE Critical Minerals and Materials Accelerator funding-opportunity signal published in Phase 53. | Watch for DOE selections, USAspending award records, recipient disclosures, and project-site records before making award or deployment claims. |
| uq-024 | Candidate | `source-bea-api` | Finance and Human Futures | Economic baseline signal for regional or industry context. | Select one BEA dataset, table, frequency, geography, and release date. |
| uq-025 | Candidate | `source-fhfa-house-price-index` | Finance and Human Futures / Local Systems | Housing-market price context for local-system dossiers. | Select geography and release table; pair with permits, starts, completions, and servicing evidence. |
| uq-026 | Candidate | `source-fema-national-risk-index` | Climate / Local Systems | Hazard-risk layer for local-system constraint analysis. | Select county or tract geography and document hazard metrics without treating them as parcel-level risk proof. |
| uq-027 | Candidate | `source-osti-gov-api` | AI and Advanced Manufacturing / Power and Grid | DOE research-output signal. | Select one DOE-funded record, date, subject, and full-text availability before signal drafting. |
| uq-028 | Published | `source-nsf-award-search-api` | AI and Advanced Manufacturing / Discovery Technologies | NSF award 2433348 to Cornell University for the AI-Materials Institute published in Phase 53. | Watch amendments, portal delivery, published datasets, experiments, results, and reproducibility evidence. |
| uq-029 | Candidate | `source-nasa-techport-api` | Space / Discovery Technologies | NASA technology-project signal. | Select one project record and preserve project status, organization, and technology taxonomy. |
| uq-030 | Candidate | `source-uspto-patentsview` | Compute and Chips / Critical Minerals | Patent-landscape or IP activity signal. | Select a bounded patent set and label it as invention/disclosure evidence, not deployment proof. |
| uq-031 | Candidate | `source-bureau-reclamation-rise-api` | Water / Local Systems | Water time-series or site record for western local-system evidence. | Select site, parameter, date range, and local allocation context before using it in a signal. |
| uq-032 | Candidate | `source-usgs-mineral-resources-data` | Critical Minerals | Mineral occurrence or resource-data signal. | Select dataset, commodity, geography, and vintage; distinguish occurrence from active production. |
| uq-033 | Candidate | `source-usitc-dataweb-api` | Critical Minerals / Compute and Chips | Trade-flow signal for minerals, chips, batteries, or advanced manufacturing. | Build one saved query with commodity code, trade flow, years, and partners; preserve code definitions. |
| uq-034 | Candidate | `source-usda-aphis-biotechnology` | Agriculture and Bioeconomy | Biotechnology regulatory signal. | Select one permit, notification, petition, deregulation decision, or public update. |
| uq-035 | Candidate | `source-faa-commercial-space-licenses` | Space / Mobility Certification | Commercial space licensing or approval signal. | Select one active license, permit, approval, operator, site, and date. |
| uq-036 | Candidate | `source-fcc-space-bureau-icfs` | Space / Security and Standards | Satellite or space-communications filing signal. | Select one ICFS file number, public notice, order, or license action. |
| uq-037 | Signal Draft Created | `source-maricopa-association-governments-open-data` | Local Systems | MAG 2023 population, housing, and employment projections signal created in Phase 50. | Pair the projections layer with workforce, training, supplier, utility, water, permitting, or facility records before local capacity conclusions. |
| uq-038 | Candidate | `source-phoenix-open-data-portal` | Local Systems / Water | Phoenix local data signal or dossier input. | Select one dataset or portal record and pair it with department context, permit records, or water-service evidence. |

## Batch 03: Phase 50B Direct Commodity Selection

| Queue ID | Status | Source | Watch Lane | Candidate Output | Human Next Action |
| --- | --- | --- | --- | --- | --- |
| uq-039 | Published | `source-usgs-mineral-commodity-summaries`, `source-usgs-nmic` | Critical Minerals / Compute and Chips | The 2026 gallium material published in Phase 53 as the first commodity-specific follow-up to the broad MCS baseline. | Watch import-source changes, export licensing, refining projects, wafer-supplier evidence, substitution, recycling, and named facility exposure. |

## Batch 04: Phase 51 Named Local Dossier Records

| Queue ID | Status | Source | Watch Lane | Candidate Output | Human Next Action |
| --- | --- | --- | --- | --- | --- |
| uq-040 | Signal Draft Created | `source-srp-2025-isp-actions-progress-report` | Power and Grid / Local Systems | Added a named SRP resource, distribution, siting, and transmission implementation signal. | Select a customer- or project-specific service, tariff, load, or interconnection record before making site-level capacity claims. |
| uq-041 | Signal Draft Created | `source-phoenix-2026-water-security-council-update` | Water / Local Systems | Added the first named Phoenix provider-level water signal. | Select an industrial service, facility-demand, discharge, reuse, or infrastructure record before making facility-level water claims. |
| uq-042 | Signal Draft Created | `source-toronto-24-254930-june-2026-decision-report` | Local Systems / Finance and Human Futures | Added a staff recommendation and application-stage servicing-review signal for Toronto application 24 254930. | Track the Council item history, enacted by-laws, land and laneway conditions, building permit, start, completion, and occupancy. |
| uq-043 | Published | `source-srp-e67-large-load-price-plan-2025` | Power and Grid / Local Systems | The first named SRP large-load tariff signal published in Phase 53 with its capacity and customer-agreement boundaries intact. | Select a named customer service agreement, facilities charge, interconnection, construction, energization, or project-load record. |
| uq-044 | Signal Draft Created | `source-phoenix-tsmc-2026-wastewater-development-agreement` | Water / Local Systems | Added a project-specific TSMC wastewater-conveyance and reclaimed-water milestone signal. | Track execution, construction and acceptance of the improvements, the June 30, 2028 IRWP deadline, measured reuse, and a facility water balance. |
| uq-045 | Signal Draft Created | `source-phoenix-north-3500-pud-2026` | Local Systems / Compute and Chips | Added the adopted and amended PUD planning envelope for the TSMC campus area. | Select named site, civil, grading, or building permits, inspections, and certificates of occupancy. |
| uq-046 | Signal Draft Created | `source-aca-tsmc-registered-technician-apprenticeship-2024` | Compute and Chips / Finance and Human Futures | Added a facility-linked technician apprenticeship with named pathways, partners, funding, and a 2025 recruitment target. | Add enrollment, completion, credential, retention, placement, construction-labor, and supplier-workforce evidence. |
| uq-047 | Needs Source Recheck | `source-toronto-2026-sc33-9-item-history` | Local Systems / Finance and Human Futures | Added Scarborough Community Council's July 9, 2026 recommendation for application 24 254930; no later Council decision was available on July 22. | Recheck immediately after the July 29-31, 2026 City Council meeting for adoption, enacted by-laws, land conditions, and the first building permit. |
| uq-048 | Published | `source-toronto-development-pipeline-2025` | Local Systems / Finance and Human Futures | Toronto's citywide planning-to-permit-to-construction delivery baseline published in Phase 53. | Track stage conversion, completions, cancellations, financing conditions, and the named project's downstream records. |

## Batch 05: Phase 51C Downstream Service And Facility Evidence

| Queue ID | Status | Source | Watch Lane | Candidate Output | Human Next Action |
| --- | --- | --- | --- | --- | --- |
| uq-049 | Published | `source-srp-project-huckleberry-meta-mesa-online` | Power and Grid / Local Systems | The named Meta Mesa Data Center service signal published in Phase 53 as a bounded single-project conversion record. | Track disclosed load, executed service or facilities agreements, tariff treatment, operating consumption, and a comparable semiconductor-customer service record. |
| uq-050 | Signal Draft Created | `source-phoenix-tsmc-july-2026-fab-update` | Compute and Chips / Local Systems | Added a company-claim-labeled signal for Fab 1 volume production, Fab 2 construction completion, and more than 3,500 current employees. | Track named permits and occupancy, audited or regulatory production evidence, Fab 2 commissioning, occupation mix, and utility or water records. |
| uq-051 | Signal Repaired | `source-phoenix-2025-semiconductor-apprenticeship-agenda` | Compute and Chips / Finance and Human Futures | Repaired the TSMC apprenticeship signal with an eight-person first cohort and a 46-person second cohort. | Track completion, credentials, retention, placement, wages, and later program reports; do not treat active cohorts as completed outcomes. |

## Batch 06: Phase 55B Migration And Facility Evidence

| Queue ID | Status | Source | Watch Lane | Candidate Output | Human Next Action |
| --- | --- | --- | --- | --- | --- |
| uq-052 | Signal Draft Created | `source-white-house-eo-14412-pqc-migration`, `source-omb-m-26-15-pqc-migration` | Security and Standards / Cross-Cutting Official Rails | Added a bounded federal PQC migration signal with leadership, plan, pilot, procurement, and 2030-2031 deadline boundaries. | Track agency plans, the NIST pilot, CISA guidance, FAR rulemaking, vendor readiness, and completed system transitions. |
| uq-053 | Signal Draft Created | `source-acc-project-baccara-cec-2026` | Power and Grid / Water / Local Systems | Added a Project Baccara CEC signal separating proposed generation and water strategy from downstream permits, construction, and operation. | Track the full docket, ADEQ air permit, county and military-compatibility approvals, built infrastructure, and measured operating evidence. |
| uq-054 | Source Rechecked | `source-toronto-building-permits` | Local Systems / Finance and Human Futures | Replaced the retired dataset candidate with Toronto's current permit and inspection status rail; a focused address query did not identify the selected project's permit. | Recheck with a known building-permit application number or all project addresses; absence from one portal query is not proof that no permit exists. |
| uq-055 | Source Rechecked | `source-ontario-housing-supply-progress` | Finance and Human Futures / Local Systems | Confirmed the tracker remains live but still presents the 2024 target year. | Watch the official page and Ontario Data Catalogue for the next target-year release. |

## Batch 07: Phase 55C Conditional Permit Follow-Through

| Queue ID | Status | Source | Watch Lane | Candidate Output | Human Next Action |
| --- | --- | --- | --- | --- | --- |
| uq-056 | Signal Repaired | `source-maricopa-project-baccara-mcp250007-2026`, `source-maricopa-baccara-proposed-air-permit-2026`, `source-kjzz-project-baccara-mcp-vote-2026` | Power and Grid / Water / Local Systems | Repaired the existing Project Baccara signal with the reported 4-1 military-compatibility vote, official conditions a-p, and proposed air-permit stage while preserving every construction and operating gate. | Obtain the County summary minutes or executed MCP, then track final Permit P0013417 and EPA review, service agreements, Plan of Development, military compliance, building permits, construction, occupancy, and measured operation. |

## Batch 08: Phase 55G Baccara Authority Conversion

| Queue ID | Status | Source | Watch Lane | Candidate Output | Human Next Action |
| --- | --- | --- | --- | --- | --- |
| uq-057 | Signal Repaired | `source-maricopa-baccara-board-action-2026`, `source-maricopa-baccara-final-air-permit-2026` | Power and Grid / Water / Local Systems | Converted the reported 4-1 vote and proposed-air-permit stopping point into an official County action record and signed final Title V permit while keeping the signal `In Review`. | Obtain the fully executed MCP and track service and water commitments, precise Plan of Development, military compliance, construction and building permits, performance testing, occupancy, emissions, and measured operation. |

## First Repair Priorities

Start with these because they have existing signal records and clear repair paths:

1. ENSO signal: source has advanced to a 9 July 2026 NOAA CPC discussion.
2. StatCan/CMHC permits signal: needs a specific release/geography.
3. Arizona power signal: SRP implementation and large-load tariff records added; still needs named customer service, interconnection, construction, energization, or load evidence.
4. Arizona water signal: Phoenix provider and TSMC wastewater-agreement records added; still needs completed infrastructure, facility water balance, measured reuse, and operating IRWP evidence.
5. FAA AAM signal: needs a specific FAA document or certification/regulatory action.
6. NHTSA AV signal: needs a specific reporting/safety data action.
7. CHIPS signal: needs a specific award/facility/program milestone.
8. AI-grid signal: needs a specific source update, region, or utility/planning record.

## Phase 48 Progress

Moved from queue into content:

- `uq-001` repaired the published NOAA ENSO signal against the 9 July 2026 CPC discussion.
- `uq-006` and `uq-007` created the first cross-cutting regulatory watch-rail signal.
- `uq-009` created the first cybersecurity operating-rail signal.

Next queue step:

Select one named local dossier record before writing the next local signal. The strongest candidates are `uq-002` ACC eDocket for Arizona power, `uq-003` Toronto AIC for Ontario application evidence, or a Phoenix water/permitting record if a specific record can be selected.

## Phase 49 Progress

Moved from promoted source records into queue:

- added Batch 02 with 18 promoted-source review candidates,
- prioritized funding, research, patents, space licensing, minerals and trade, agriculture biotechnology, water, hazard risk, finance, and Phoenix/MAG local-system sources,
- kept every Batch 02 item in `Candidate` status until a bounded source item is selected.

Next queue step:

Choose one Batch 02 item with a clean dated record, then use `docs/signal-repair-workflow.md` to decide whether it becomes a new `In Review` signal, a local dossier input, an evidence-gap update, or an archived queue item.

## Phase 50 Progress

Moved from promoted source records into content:

- `uq-023` selected Grants.gov opportunity ID 361773, opportunity number `DE-FOA-0003589`, and created `signal-doe-critical-minerals-materials-accelerator-nofo`.
- `uq-037` selected MAG Open Data item `c1990106ce3840d6af8bc476ca31c30e` and created `signal-mag-2023-projections-phoenix-region-growth-evidence-layer`.
- updated `gap-007` for critical minerals funding and processing evidence boundaries.
- updated `gap-003` and the U.S. Southwest Chip Corridor profile with a named MAG regional projections dataset.
- refreshed source notes for Grants.gov, DOE Critical Materials Collaborative, and MAG Open Data.
- `uq-022` selected USAspending award DEMS0000003 to Talon Nickel (USA) LLC and created a bounded award-trail signal.
- `uq-028` selected NSF award 2433348 to Cornell University for the AI-Materials Institute and created a research-funding signal.
- `uq-039` selected the USGS 2026 gallium material and created the first commodity-specific supply-structure signal.
- `uq-003` selected Toronto application 24 254930 ESC 20 OZ and created the first named municipal application signal for the Ontario dossier.

Next queue step:

Phase 50B has reached six bounded additions across the two Phase 50 batches. Move next into Phase 51 local dossier deepening, prioritizing a named Arizona power or water record, a Toronto decision or servicing record, and downstream evidence for the selected award and gallium records.

## Phase 51A Progress

Moved from queue priorities into content:

- `uq-040` selected SRP's 2025 Integrated System Plan Actions Progress Report and created a bounded Valley power-system implementation signal,
- `uq-041` selected Phoenix Water Services' April 28, 2026 council update and created a provider-level water signal,
- `uq-042` selected Toronto's June 22, 2026 decision report for application 24 254930 and created a staff-recommendation and servicing-review signal,
- strengthened `gap-001`, `gap-002`, `gap-004`, and `gap-005` without marking any gap resolved.

Next queue step:

Phase 51B completed the service, infrastructure, planning, workforce, committee, and delivery-baseline layer. Continue only with downstream project evidence: electric service or energization, built wastewater and IRWP infrastructure, named Phoenix permits and occupancy, apprenticeship outcomes, Toronto City Council and by-laws, and the named project's permit/start/completion trail.

## Phase 51B Progress

Moved from queue priorities into content:

- `uq-043` selected SRP's E-67 large-load price plan,
- `uq-044` selected Phoenix's May 2026 TSMC wastewater development agreement,
- `uq-045` selected Phoenix case `Z-37-20-1` for the TSMC-campus planning envelope,
- `uq-046` selected the TSMC registered technician apprenticeship expansion,
- `uq-047` captured Scarborough Community Council follow-through for Toronto application 24 254930,
- `uq-048` selected Toronto's 2025 Development Pipeline as the citywide delivery baseline,
- advanced `gap-003` to `Source Added` and strengthened `gap-001`, `gap-002`, `gap-004`, and `gap-005` without resolving them.

Next queue step:

Run Phase 51C as a downstream-evidence pass, not another source expansion. Select only named service, construction, permit, workforce-outcome, Council/by-law, start, completion, or occupancy records.

## Phase 51C Progress

Moved downstream evidence into content:

- `uq-049` selected SRP Project Huckleberry as the first named online electric-service project,
- `uq-050` selected Phoenix's July 2026 TSMC update and kept the facility claims labeled as company evidence,
- `uq-051` repaired the apprenticeship signal with two recorded cohorts while preserving the outcome gate,
- no record was forced for TSMC reclaimed-water operation, Phoenix occupancy, apprenticeship completion, or Toronto enactment because the official evidence had not reached those stages.

Next queue step:

Move into Phase 53 publication-candidate review. Keep `uq-044`, `uq-045`, `uq-047`, and `uq-051` as dated monitors for reclaimed-water infrastructure, permits and occupancy, Toronto Council and by-laws, and apprenticeship outcomes.

## Phase 53 Progress

Moved through the publication gate:

- `uq-023`, `uq-028`, `uq-039`, `uq-043`, `uq-048`, and `uq-049` are now Published,
- the exact current sources were rechecked before promotion,
- every remaining queue-derived signal retains its documented evidence or timing hold,
- no company-claim, broad source-rail, or unresolved local-outcome record was promoted to meet the count.

Next queue step:

Proceed to Phase 54 release QA. Keep `uq-044`, `uq-045`, `uq-047`, and `uq-051` as dated monitors and recheck `uq-047` after the July 29-31, 2026 Toronto City Council meeting.

## Operating Rule

No queue item becomes a signal until it has:

- one primary source,
- a dated source event or bounded data release,
- a clear claim scope,
- known limitations,
- a source checked date,
- a human next action completed.
