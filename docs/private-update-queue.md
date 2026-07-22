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
| uq-002 | Needs Manual Portal Review | `source-arizona-corporation-commission-edocket` | Power and Grid / Local Systems | Arizona utility docket candidate for chip-corridor power evidence. | Search ACC eDocket for named APS/SRP/TEP planning, rate, transmission, or service records before writing a signal. |
| uq-003 | Needs Manual Portal Review | `source-city-toronto-application-information-centre` | Local Systems / Finance and Human Futures | Toronto application-level candidate for Ontario housing conversion evidence. | Select a named application file, type, status, ward, and submission/update date before writing a signal. |
| uq-004 | Needs Source Recheck | `source-ontario-housing-supply-progress` | Finance and Human Futures / Local Systems | Ontario housing target/progress update candidate. | Manually recheck the official tracker and confirm the latest update date, download availability, and municipal target values. |
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
| uq-022 | Candidate | `source-usaspending-api` | Finance and Human Futures / Compute and Chips | Federal award or contract record for funding-to-deployment analysis. | Select one award, recipient, agency, place, and obligation period; do not infer technical success from award data. |
| uq-023 | Signal Draft Created | `source-grants-gov-api` | Cross-Cutting Official Rails / AI and Advanced Manufacturing | DOE Critical Minerals and Materials Accelerator funding-opportunity signal created in Phase 50. | Watch for DOE selections, USAspending award records, recipient disclosures, and project-site records before making award or deployment claims. |
| uq-024 | Candidate | `source-bea-api` | Finance and Human Futures | Economic baseline signal for regional or industry context. | Select one BEA dataset, table, frequency, geography, and release date. |
| uq-025 | Candidate | `source-fhfa-house-price-index` | Finance and Human Futures / Local Systems | Housing-market price context for local-system dossiers. | Select geography and release table; pair with permits, starts, completions, and servicing evidence. |
| uq-026 | Candidate | `source-fema-national-risk-index` | Climate / Local Systems | Hazard-risk layer for local-system constraint analysis. | Select county or tract geography and document hazard metrics without treating them as parcel-level risk proof. |
| uq-027 | Candidate | `source-osti-gov-api` | AI and Advanced Manufacturing / Power and Grid | DOE research-output signal. | Select one DOE-funded record, date, subject, and full-text availability before signal drafting. |
| uq-028 | Candidate | `source-nsf-award-search-api` | AI and Advanced Manufacturing / Discovery Technologies | NSF award signal for emerging research programs. | Select one award with amount, institution, start date, directorate, and topic boundary. |
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

## First Repair Priorities

Start with these because they have existing signal records and clear repair paths:

1. ENSO signal: source has advanced to a 9 July 2026 NOAA CPC discussion.
2. StatCan/CMHC permits signal: needs a specific release/geography.
3. Arizona power signal: needs a specific ACC/utility planning record.
4. Arizona water signal: needs a specific ADWR/CAP/Phoenix/provider record.
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

Next queue step:

Select another bounded source item from Batch 02, with priority on `uq-022` USAspending award records, `uq-028` NSF awards, `uq-027` OSTI records, `uq-032`/`uq-033` critical minerals data and trade evidence, or a named ACC/Phoenix/Toronto local record.

## Operating Rule

No queue item becomes a signal until it has:

- one primary source,
- a dated source event or bounded data release,
- a clear claim scope,
- known limitations,
- a source checked date,
- a human next action completed.
