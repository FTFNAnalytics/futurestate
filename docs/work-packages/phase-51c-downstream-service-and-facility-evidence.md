# Phase 51C: Downstream Service And Facility Evidence

Date: 2026-07-22

Status: complete

## Objective

Follow the Phase 51B local records downstream without forcing a record into service, construction, permitting, operating, workforce-outcome, Council, by-law, start, completion, or occupancy status before the official evidence reaches that stage.

## Selected Records

### SRP Project Huckleberry

SRP identifies Meta's Mesa Data Center as the customer, says the project is online, records an initial December 2022 69 kV service path, and records the Prickly Pear Substation and 230 kV transmission line in service in May 2024.

This is customer-specific service evidence for one named compute project. It does not disclose load, price, an executed service agreement, operating consumption, spare capacity, or service readiness for TSMC or another site.

### Phoenix TSMC Fab Update

The City of Phoenix's July 16, 2026 release says TSMC Fab 1 has been in N4 volume production since late 2024, Fab 2 construction is complete, and TSMC Arizona currently employs more than 3,500 people.

The source relays company claims. It is not an audited production or employment report, a named permit, or a certificate of occupancy. The signal therefore remains `In Review` with `Company Claim` evidence quality.

### Phoenix Semiconductor Apprenticeship Agenda

Phoenix City Council Agenda Item 36 from November 19, 2025 says the first eight-person Facilities Technician cohort began in April 2024 and a second cohort included 10 Process, 18 Manufacturing, and 18 Facilities Technicians.

This repairs the existing apprenticeship signal from a recruitment target to recorded active cohorts. It does not report completions, credentials, retention, placement, or later job performance.

## Gates Deliberately Left Open

- No official downstream record was found showing the TSMC wastewater improvements complete or the initial industrial reclaimed-water plant operating.
- No named Phoenix building permit, inspection, or certificate of occupancy was captured. Phoenix directs location-specific certificate checks to its search tool or public-records request process.
- No apprenticeship completion, credential, retention, or placement result was found.
- Toronto application `24 254930 ESC 20 OZ` remains upstream of the July 29-31, 2026 City Council meeting; no Council adoption or enacted by-law was available on July 22.
- No named Toronto permit, start, completion, or occupancy record was found for the application.

## Deliverables

- [x] Add three official source records.
- [x] Add one named electric-service and energization signal.
- [x] Add one facility operating and construction signal with company-claim labeling.
- [x] Repair the TSMC apprenticeship signal with active-cohort evidence.
- [x] Update the Southwest chip-corridor dossier and evidence gaps.
- [x] Add queue items and a public update-log entry.
- [x] Preserve unresolved downstream gates.
- [x] Run content validation, source health, Astro checks, and production build.
- [x] Verify the Published export and indexing boundary.

## Acceptance Criteria

- No signal claims load, spare capacity, audited output, permit issuance, occupancy, workforce outcomes, water-plant operation, Toronto Council adoption, or completed housing without a record that directly supports it.
- The Meta service record is not transferred to TSMC or generalized to regional capacity.
- The City-relayed TSMC facts are visibly labeled as company claims.
- Active apprenticeship cohorts are not described as completed outcomes.
- All new records remain `In Review` and outside the Published export.
- Validation and build pass.

## Next Step

Move into Phase 53 publication-candidate review. Keep the unresolved Phase 51 trails as dated monitors: Toronto Council after July 29-31, the TSMC reclaimed-water deadline and construction milestones, Phoenix permits and occupancy, and apprenticeship outcome reporting.

## Validation Results

```text
npm.cmd run validate:content
passed: 114 sources, 33 signals, 17 topics, 10 organizations, 5 technologies,
2 local systems, 1 briefing, 10 evidence gaps, 2 dependency maps, 6 updates

npm.cmd run source:health
passed: 114 sources; 56 manual review; 58 probe ready

npm.cmd run check
passed: 0 errors, 0 warnings, 0 hints

npm.cmd run build
passed: 210 pages
```

The public signal export remains at three `Published` records. Both new signal pages render `noindex, follow`, and neither new route appears in the sitemap.
