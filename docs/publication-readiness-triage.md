# Publication Readiness Triage

This document tracks which FTFN records are closest to a credible first public release and which records still need source, specificity, or evidence work before they should be treated as launch material.

It is a triage document, not a publication approval. A record listed as a launch candidate is still not `Published`.

## Purpose

FTFN is moving from scaffold toward a public editorial product on `ftfn.io`. That means the next question is not "Can this route build?" but:

- Is the source still current?
- Is the record specific enough?
- Does the claim fit the evidence?
- Are local implications properly constrained?
- Would a reader understand what is known, what is claimed, and what is missing?

## Triage Categories

### Launch Candidate

The record is a plausible candidate for the first public release after final copy, citation, metadata, accessibility, and publication-policy checks.

Launch candidate does not mean `Published`.

### Keep In Review

The record is useful and source-backed, but it still needs a more specific event, dataset, dated release, local source, or public copy pass before launch.

### Needs Follow-Up

The record should not be considered a launch candidate until a clear repair is made. This may be because the source has changed, the claim is stale, or the record needs a better evidence base.

In app content, this may map to `record_status: "Needs Update"` or `verification_status: "Needs Follow-Up"` when the problem is visible enough to affect reader interpretation.

### Keep Draft Sample

The record is still useful for testing the model, but it relies on weak or interested-party evidence and should not be moved into review without stronger support.

## Phase 33 Source Check Notes

Official pages checked on 2026-06-13:

| Source | Check Result | Triage Implication |
| --- | --- | --- |
| NOAA CPC ENSO Diagnostic Discussion | Current English discussion is dated 11 June 2026 and lists El Nino Advisory status. | The older May 2026 El Nino Watch signal is now stale and needs a current-source rewrite. |
| USGS Mineral Commodity Summaries 2026 | Publication page, DOI, report link, data release, and revision metadata remain available. | Strong launch candidate source for a critical minerals baseline signal. |
| NIST Post-Quantum Cryptography Project | Page still supports final standards, migration framing, and the distinction between standards and implementation. | Strong launch candidate source for a PQC migration signal. |
| EIA Arizona Electricity Profile | 2024 state electricity profile table remains available with statewide capacity, generation, sales, and price context. | Useful launch candidate source if the signal stays statewide and does not claim facility-level power readiness. |
| EIA Electricity Data | Public electricity data hub remains available. | Useful support source for grid and compute-demand context. |
| Arizona Department of Water Resources | Official ADWR site remains available with data, permits, interactive maps, and program links. | Useful local source layer, but not a facility-level water conclusion. |
| ADWR Assured and Adequate Water Supply | Program page supports legal, physical, continuous, financial, and 100-year water-supply criteria. | Useful launch candidate source if the signal stays about governance criteria, not a specific semiconductor facility. |
| Statistics Canada Building Permits Survey | Survey page confirms permits as monthly construction intentions and not completions. | Useful source for an intentions-versus-delivery signal. |
| CMHC Housing Market Data | Data page includes starts, completions, units under construction, and building-permit-to-start duration tables. | Useful source for separating permits from delivery outcomes. |

Ontario's housing supply tracker should be rechecked in a later source pass before any launch use.

## Phase 35 Final Source Check Notes

Official pages checked on 2026-06-14:

| Source | Check Result | Triage Implication |
| --- | --- | --- |
| NOAA CPC ENSO Diagnostic Discussion | Current English discussion remains dated 11 June 2026, lists El Nino Advisory status, includes regional caveat language, and schedules the next discussion for 9 July 2026. | The repaired ENSO signal passed final review and can be published with a time-sensitive recheck note. |
| USGS Mineral Commodity Summaries 2026 | Publication page, DOI, report link, data release, version history, and May 2026 revision metadata remain available. | The mineral commodity signal passed final review as an annual baseline, not a commodity-specific shortage claim. |
| NIST Post-Quantum Cryptography Project | Page was updated 8 June 2026 and continues to support final standards plus migration framing. | The PQC signal passed final review because it separates standards progress from institution-level migration. |
| EIA Arizona Electricity Profile and EIA Electricity Data | State profile and electricity data hub remain available with statewide and monthly data context. | The Arizona power signal stays `In Review` because the evidence is statewide, not facility-level. |
| ADWR and Arizona AAWS | Water agency and AAWS pages remain available and support governance and 100-year water-supply criteria. | The Arizona water signal stays `In Review` because the evidence does not prove provider or facility-level sufficiency. |
| Arizona Corporation Commission Utilities Division | Utility jurisdiction, tariff links, and annual-report links remain available. | Useful regulatory source layer, but not enough to publish a project-level power or water conclusion. |
| Statistics Canada Building Permits Survey and CMHC housing data | StatCan supports construction-intention framing; CMHC supports starts, completions, units under construction, and permit-to-start tables. | The permits signal stays `In Review` until tied to a specific monthly release, geography, or municipal conversion question. |

## Signal Triage

| Record | Current Status After Phase 35 | Triage | Reason |
| --- | --- | --- | --- |
| `signal-sample-001` | `Published` | Published Launch Record | Passed final source, copy, citation, caveat, and publication-date review. Time-sensitive; recheck after the 9 July 2026 ENSO discussion. |
| `signal-sample-002` | `Published` | Published Launch Record | Passed final review as an official annual critical-minerals baseline, with commodity-specific conclusions reserved for follow-up records. |
| `signal-sample-007` | `Published` | Published Launch Record | Passed final review because the record clearly separates PQC standards availability from institution-level migration. |
| `signal-arizona-electricity-profile-chip-corridor-power-constraint` | `In Review` | Hold In Review | Official EIA and ACC sources support cautious statewide power context, but not site-level readiness, interconnection timing, or facility demand. |
| `signal-arizona-water-resources-chip-corridor-constraint-map` | `In Review` | Hold In Review | ADWR and AAWS sources support water-governance criteria, but not facility-level water sufficiency or provider capacity. |
| `signal-statcan-building-permits-construction-intentions-signal` | `In Review` | Hold In Review | StatCan and CMHC sources support permits-versus-delivery framing, but publication needs a specific monthly release, geography, or municipal conversion question. |
| `signal-sample-009` | `In Review` | Keep In Review | Strong systems argument, but uses broader IEA analysis plus EIA data. Needs a specific data release, region, utility filing, or data-center development before launch. |
| `signal-ontario-housing-supply-progress-local-capacity-signal` | `In Review` | Keep In Review | Useful official tracker, but Ontario source needs recheck and municipal servicing or permit-to-completion evidence before launch. |
| `signal-sample-003` | `In Review` | Keep In Review | NIST CHIPS page is strong institutional context but needs a specific award, facility, rule, or program milestone. |
| `signal-sample-004` | `In Review` | Keep In Review | FAA AAM page supports integration framing but needs a specific rule, certification milestone, local airport/vertiport source, or operator evidence. |
| `signal-sample-005` | `In Review` | Keep In Review | NHTSA AV page supports safety framing but needs a specific rule, reporting update, exemption, or deployment dataset. |
| `signal-sample-006` | `In Review` | Keep In Review | NASA Artemis source supports broad infrastructure framing but needs a specific mission update, procurement event, delay, or hardware milestone. |
| `signal-sample-008` | `In Review` | Keep In Review | USDA NIFA source supports broad agriculture genomics framing but needs a specific grant, research result, dataset, field trial, or commercialization record. |
| `signal-sample-010` | `Draft Sample` | Keep Draft Sample | Joby source is an interested-party press room. Needs FAA, local airport/city, customer, or independent evidence before review. |

## Minimum Public Launch Candidate Set

The first credible `ftfn.io` public release should be small. After Phase 35, the initial published launch core is:

- NOAA ENSO Diagnostic Discussion signal,
- USGS Mineral Commodity Summaries 2026 signal,
- NIST post-quantum cryptography standards and migration signal.

The broader preferred launch set remains:

- 5-6 signal records from the launch-candidate group above,
- the About and Method surfaces,
- the source transparency posture,
- 2 local system profiles clearly labeled as constraint maps,
- 2 qualitative dependency maps,
- 1 `In Review` briefing only if its underlying signal set passes final review.

The next signal additions to the launch set should prioritize:

1. Arizona electricity profile as state-level power context, once tied to a specific utility, interconnection, demand, or filing question.
2. Arizona water governance as a local constraint map, once paired with provider, facility, permit, reuse, or local evidence.
3. StatCan and CMHC permits-versus-delivery signal, once tied to a specific monthly release, geography, or municipal comparison.
4. Additional official-source launch signals from underdeveloped pillars if they can pass the publication gate.

## Phase 53 Publication Review

Phase 53 reviewed the complete 33-signal library on 2026-07-22.

Current publication state:

```text
9 Published
23 In Review
1 Draft Sample
```

Promoted in Phase 53:

- DOE Critical Minerals and Materials Accelerator funding opportunity,
- NSF award 2433348 for the AI-Materials Institute,
- USGS 2026 gallium supply-structure record,
- SRP E-67 large-load service conditions,
- SRP Project Huckleberry named Meta online-service record,
- Toronto's 2025 Development Pipeline delivery-gap baseline.

The full review matrix and hold reasons are recorded in `docs/work-packages/phase-53-publication-candidate-review.md`. No broad source frame, company-claim record, or unresolved local outcome was promoted. No record required `Needs Update` or `Archived` on the review date.

## Publication Boundary

Before any additional record becomes `Published`, FTFN still needs:

- final citation/source display check,
- final status and metadata check,
- source checked dates current to the launch pass,
- accessibility and mobile review,
- social preview and metadata basics,
- a clear rule for whether `In Review` records appear on public indexes during launch.

Phase 35 added visible publication dates to signal detail pages and created `docs/launch-candidate-review.md` for record-by-record publication decisions.

## Next Work

Phase 54 should verify the complete v0.2 release candidate:

- run content, source-health, Astro, and production-build checks,
- run desktop and mobile browser and accessibility QA,
- verify Published and noindex boundaries across routes, sitemap, robots, and canonical metadata,
- verify the update log and all three static exports,
- prepare the v0.2 launch note and limitations statement,
- keep preview deployment, DNS, and public launch behind explicit approval.
