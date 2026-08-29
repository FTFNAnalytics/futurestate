# Phase 53: Publication Candidate Review

Date: 2026-07-22

Status: complete

## Objective

Apply the full publication gate to the 33-signal library and produce a balanced public set without promoting broad source frames, company claims, or unresolved local outcomes merely to meet a count.

## Result

Six `In Review` records moved to `Published`, bringing the public set from three to nine records:

| Record | Public role | Publication boundary |
| --- | --- | --- |
| `signal-doe-critical-minerals-materials-accelerator-nofo` | Dated federal funding opportunity | Funding intent and program design, not an award, project, or production result. |
| `signal-nsf-ai-materials-institute-award-2433348` | Named research award | Award and proposed scope, not portal delivery or scientific results. |
| `signal-usgs-2026-gallium-import-supplied-semiconductor-constraint` | Commodity-specific periodic baseline | National supply structure, not a current shortage or named-facility disruption. |
| `signal-srp-e67-large-load-service-conditions` | Named tariff and service rule | Service conditions, not proof of capacity, a customer agreement, or energization. |
| `signal-srp-huckleberry-meta-mesa-online-service` | Named local conversion record | One customer project, not spare capacity or readiness for another customer. |
| `signal-toronto-2025-development-pipeline-delivery-gap` | Municipal delivery-stage baseline | Pipeline potential and stage counts, not a completion forecast. |

The three existing Published records were also rechecked:

- NOAA's 9 July 2026 ENSO Diagnostic Discussion remains the current monthly discussion and schedules the next review for 13 August 2026.
- USGS Mineral Commodity Summaries 2026 remains available as version 1.3 dated May 2026.
- NIST's PQC page continues to support the three principal standards and migration framing and shows a 16 June 2026 update date.

## Review Matrix

### Published In Phase 53

- `signal-doe-critical-minerals-materials-accelerator-nofo`
- `signal-nsf-ai-materials-institute-award-2433348`
- `signal-usgs-2026-gallium-import-supplied-semiconductor-constraint`
- `signal-srp-e67-large-load-service-conditions`
- `signal-srp-huckleberry-meta-mesa-online-service`
- `signal-toronto-2025-development-pipeline-delivery-gap`

### Strong In Review Holds

These records are specific and useful, but their current evidence or review timing does not justify promotion in this batch:

| Record | Hold reason |
| --- | --- |
| `signal-usaspending-talon-nickel-battery-minerals-processing-award` | Recheck the live award transaction trail and pair it with an agency or project record before publication. |
| `signal-srp-2025-isp-actions-valley-power-buildout` | System implementation is not customer-level service or available site capacity. |
| `signal-phoenix-2026-water-security-provider-update` | Provider-level planning is not facility demand, service, discharge, reuse, or sufficiency evidence. |
| `signal-tsmc-phoenix-wastewater-infrastructure-agreement` | The agreement is project-specific, but the infrastructure and reclaimed-water system are not yet evidenced as complete or operating. |

### Item-Specific Evidence Holds

- `signal-cisa-kev-catalog-operational-remediation-clock`: select a specific entry or update window.
- `signal-federal-register-regulations-gov-regulatory-watch-rail`: select a specific docket, document, and action.
- `signal-sample-003`: select a specific CHIPS award, facility, rule, or milestone.
- `signal-sample-004`: select a specific FAA rule, certificate, approval, or deployment record.
- `signal-sample-005`: select a specific NHTSA rule, reporting update, exemption, or dataset release.
- `signal-sample-006`: select a specific Artemis mission, procurement, delay, or hardware milestone.
- `signal-sample-008`: select a specific grant, dataset, trial, result, or commercialization record.
- `signal-sample-009`: select a dated regional grid, utility, reliability, or data-center record.
- `signal-statcan-building-permits-construction-intentions-signal`: select a release, geography, and conversion question.
- `signal-ontario-housing-supply-progress-local-capacity-signal`: recheck the current tracker and add municipal delivery evidence.

### Local Stage And Outcome Holds

- `signal-arizona-electricity-profile-chip-corridor-power-constraint`: statewide context does not prove site readiness.
- `signal-arizona-water-resources-chip-corridor-constraint-map`: governance criteria do not prove provider or facility sufficiency.
- `signal-mag-2023-projections-phoenix-region-growth-evidence-layer`: projections are a planning baseline, not capacity or delivery evidence.
- `signal-phoenix-z37-20-1-tsmc-campus-planning-record`: an applicant-prepared planning envelope is not a permit, inspection, or occupancy record.
- `signal-tsmc-arizona-apprenticeship-workforce-pipeline`: active cohorts are not completion, credential, retention, or placement outcomes.
- `signal-toronto-application-24-254930-named-planning-record`: application evidence is upstream of approval and delivery.
- `signal-toronto-24-254930-staff-report-servicing-review`: staff recommendation and servicing review are not Council adoption or a permit.
- `signal-toronto-24-254930-community-council-recommendation`: recheck after the 29-31 July 2026 City Council meeting.

### Company Claim And Draft Holds

- `signal-phoenix-tsmc-fab1-production-fab2-construction-complete` remains `In Review` with `Company Claim` evidence quality until audited, regulatory, permit, occupancy, or utility evidence supports the operating claims.
- `signal-sample-010` remains `Draft Sample`; the interested-party press room is insufficient for promotion.

No reviewed record required `Needs Update` or `Archived` on 2026-07-22. The holds above are intentional evidence gates, not stale-status findings.

## Candidate Mix

The nine-record Published set now includes:

- four periodic or dated official baselines: NOAA ENSO, USGS MCS 2026, USGS gallium, and Toronto's 2025 pipeline;
- two standards, policy, or tariff actions: NIST PQC and SRP E-67;
- two funding or research milestones: DOE's accelerator NOFO and NSF award 2433348;
- one named local conversion record: SRP Project Huckleberry.

## Deliverables

- [x] Recheck all three existing Published records.
- [x] Review all 29 `In Review` records against the publication policy.
- [x] Promote six defensible records with publication dates and review notes.
- [x] Document the reason every other record remains outside the public export.
- [x] Add a public Publication Promotion update entry.
- [x] Update the living roadmap, queue, and handoff documents.
- [x] Run content validation, source health, Astro checks, and production build.
- [x] Verify Published export membership, robots directives, and sitemap membership.

## Acceptance Criteria

- Exactly nine signals appear in the Published export.
- Every Published signal has a current checked source and an explicit publication date.
- No company-claim or Draft Sample record is Published.
- Nonpublished signal routes remain `noindex, follow` and absent from the sitemap.
- The six newly Published routes use `index, follow` and appear in the sitemap.
- Validation and build pass.

## Next Step

Proceed to Phase 54 release QA and preview gate. Run desktop and mobile reader-journey QA, verify touch targets and public trust/data routes, prepare the v0.2 launch note and limitations statement, and request explicit approval before any preview deployment, DNS, or public launch action.

## Validation Results

```text
npm.cmd run validate:content
passed: 114 sources, 33 signals, 17 topics, 10 organizations, 5 technologies,
2 local systems, 1 briefing, 10 evidence gaps, 2 dependency maps, 7 updates

npm.cmd run source:health
passed: 114 sources; 56 manual review; 58 probe ready

npm.cmd run check
passed: 0 errors, 0 warnings, 0 hints

npm.cmd run build
passed: 210 pages
```

The Published signal export contains exactly nine records and only the approved IDs. All six newly Published routes render `index, follow` and appear in the sitemap. The sampled held route remains `noindex, follow`, is absent from the export, and is absent from the sitemap.
