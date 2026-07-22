# Phase 51B: Service, Permitting, Workforce, And Delivery Records

Date: 2026-07-22

## Goal

Advance both local-system dossiers through the next evidence-conversion layers: large-load power conditions, project-specific industrial wastewater infrastructure, a named Phoenix planning case, facility-linked workforce training, Toronto committee follow-through, and a citywide delivery baseline.

## Selected Records

### SRP E-67 Large-Load Price Plan

Official record:

`https://www.srpnet.com/assets/srpnet/pdf/price-plans/FY26/2025%20Ratebook%20E-67.pdf`

The plan applies to new SRP accounts at or forecast to reach at least 20 MW within five years. It defines adequate-facility, forecast, minimum-billing, maximum-load, service-agreement, and possible customer-funded infrastructure conditions.

Boundary:

The tariff does not name a semiconductor customer or prove site capacity, an executed electric-service agreement, interconnection, construction, or energization.

### Phoenix-TSMC Wastewater Development Agreement

Official record:

`https://www.phoenix.gov/content/dam/phoenix/cityclerksite/city-council-meeting-files/2026/5-20-26%20Formal%20Agenda-FINAL.pdf`

Agenda Item 73 authorizes a development agreement for TSMC-funded lift-station, force-main, and gravity-sewer work. After completion, Phoenix agrees to accept an increase in wastewater flow from approximately 333,000 to 755,000 gallons per hour. The agreement ties additional fab flows to industrial reclaimed-water plants and requires the initial plant to operate by June 30, 2028.

Boundary:

The agreement does not provide a complete facility water balance, quantify total withdrawals or consumption, prove completed infrastructure, or establish long-term water sufficiency.

### North Phoenix 3,500 PUD, Case Z-37-20-1

Official record:

`https://www.phoenix.gov/content/dam/phoenix/pddsite/documents/planning-zoning-pud/z-37-20n.pdf`

The January 2026 City-hosted narrative records the adopted PUD and minor-amendment approvals for the planning area containing TSMC's first fab phase.

Boundary:

The PUD is an entitlement and development-standard record. It is not a site plan, grading or building permit, inspection, utility connection, construction-completion, or occupancy record.

### TSMC Registered Technician Apprenticeship

Official record:

`https://www.azcommerce.com/news-events/news/2024/11/tsmc-arizona-joined-by-governor-hobbs-to-announce-expansion-of-registered-technician-apprenticeship-program/`

The Arizona Commerce Authority record names facilities, equipment, process, and manufacturing technician pathways, their education partners, more than $5 million of TSMC support, an 18-to-24-month apprenticeship horizon, and a target of nearly 130 apprentices and trainees in 2025.

Boundary:

The announcement does not report actual enrollment against target, completions, credentials, retention, placement, construction-trade capacity, supplier labor, or sufficiency for the eventual fab workforce.

### Toronto Agenda Item 2026.SC33.9

Official record:

`https://secure.toronto.ca/council/agenda-item.do?item=2026.SC33.9`

Scarborough Community Council recommended the Official Plan and Zoning By-law amendments for application `24 254930 ESC 20 OZ` on July 9, 2026.

Boundary:

The committee recommendation is not City Council adoption, an enacted by-law, a building permit, a construction start, completion, or occupancy.

### Toronto Development Pipeline 2025

Official record:

`https://www.toronto.ca/city-government/data-research-maps/research-reports/planning-development/development-pipeline/`

The City reports 791,045 proposed residential units in the 2021-2025 pipeline and separates projects under review, approved, pursuing permits, holding permits, under construction, and built. The bulletin explicitly distinguishes pipeline potential from guaranteed delivery.

Boundary:

Citywide planning and permit-stage totals do not establish the current status or viability of application `24 254930`, and proposed or approved units are not guaranteed completions.

## Implemented

- added six official source records,
- added six `In Review` signals,
- updated both local-system dossiers,
- advanced `gap-003` from `Open` to `Source Added`,
- strengthened `gap-001`, `gap-002`, `gap-004`, and `gap-005` without resolving them,
- added queue items `uq-043` through `uq-048`,
- added one public source-refresh entry without promoting any signal.

## Evidence-Gate Result

| Layer | Added | Still Needed |
| --- | --- | --- |
| Arizona power | Named large-load tariff | Customer service agreement, facilities charge, interconnection, construction, energization, or disclosed project load |
| Arizona industrial water | Project-specific wastewater and reclaimed-water agreement | Executed-agreement follow-through, built and accepted infrastructure, facility water balance, measured reuse, operating IRWPs |
| Phoenix planning | Named PUD and approved amendments | Site plans, civil and building permits, inspections, certificates of occupancy |
| Arizona workforce | Named technician pathways and target | Enrollment, completion, credentials, retention, placement, occupation-level and construction-labor evidence |
| Toronto application | Community-council recommendation | City Council adoption, enacted by-laws, building permit, start, completion, occupancy |
| Toronto delivery | Citywide stage and completion baseline | Project stage conversion, financing, cancellations, and later pipeline refreshes |

## Publication State

All six signals remain `In Review`. They use `noindex, follow`, remain outside the Published data export, and cannot be promoted without the Phase 53 editorial gate.

## Validation

```text
npm.cmd run validate:content
passed: 111 sources, 31 signals, 17 topics, 10 organizations, 5 technologies,
2 local systems, 1 briefing, 10 evidence gaps, 2 dependency maps, 5 updates

npm.cmd run source:health
passed: 111 sources; 53 manual review; 58 probe ready

npm.cmd run check
passed: 0 errors, 0 warnings, 0 hints

npm.cmd run build
passed: 0 errors, 0 warnings, 0 hints; 205 page(s) built
```

## Next

Continue Phase 51C only through downstream named records:

1. a project-specific electric-service agreement, interconnection, construction, energization, or facility-load disclosure,
2. TSMC wastewater construction and industrial-reclaimed-water-plant operating evidence,
3. named Phoenix site, civil, or building permits and occupancy records,
4. apprenticeship enrollment, completion, credential, retention, or placement outcomes,
5. Toronto City Council and enacted by-law follow-through for application `24 254930`,
6. the first building permit, start, completion, or occupancy record for the named Toronto project.
