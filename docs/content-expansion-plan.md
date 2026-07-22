# Content Expansion Plan

This document defines the first editorial expansion path for FTFN after the route scaffold. It identifies which seed records are closest to publishable, which records need more work, and which 20-30 records should be created next.

The expansion plan is not an ingestion plan. Phase 09 does not start automation. The goal is to create a human-reviewable editorial batch that proves the content model before scale.

## Expansion Principles

- Add sources before adding claims.
- Promote the strongest seed records first.
- Prefer official sources, standards bodies, research institutions, and credible reporting for the first public batch.
- Treat company announcements as useful but interested-party evidence.
- Do not publish local implications without local-system sources.
- Add records that improve the dependency stack, not just records that fill a category.
- Keep speculative ideas labeled as speculative.

## Current Seed Assessment

### Signals Closest to Publishable

These records have strong source categories and can become early reviewed signals after source URL checks, date checks, body edits, and publication metadata updates.

- `signal-sample-001`: ENSO outlook update changes climate risk posture. Strong source category. Phase 33 found the May Watch record was stale; Phase 34 repaired it against NOAA CPC's 11 June 2026 El Nino Advisory discussion. It is now a launch candidate that still needs final citation and regional caveat review.
- `signal-sample-002`: Mineral commodity data updates critical material assumptions. Strong because it uses USGS official data. Needs commodity-specific framing or a clearer annual-data angle.
- `signal-sample-003`: CHIPS program update shifts semiconductor infrastructure outlook. Strong primary institutional source. Needs a specific program update, award, rule, or facility-related development.
- `signal-sample-004`: FAA advanced air mobility guidance clarifies path for eVTOL deployment. Strong regulatory source. Needs specificity about which guidance, rule, or implementation step changed.
- `signal-sample-005`: Automated vehicle safety framework changes deployment assumptions. Strong federal safety source. Needs a concrete policy, reporting, exemption, or safety-development hook.
- `signal-sample-007`: Post-quantum cryptography standards change security migration clock. Strong standards source. Needs exact standard or project milestone and implementation context.

### Signals Requiring More Work

These records are useful scaffolds but should not be published without additional precision or evidence.

- `signal-sample-006`: Artemis update shifts lunar infrastructure roadmap. Needs a specific NASA update, mission milestone, contract, delay, or program decision.
- `signal-sample-008`: Plant genomics program points toward climate-resilient agriculture. Needs a specific grant, project, dataset, research result, or program update.
- `signal-sample-010`: eVTOL flight campaign illustrates gap between demonstration and deployment. Useful as a company-claim example, but needs FAA, customer, facility, or credible-reporting context before publication.

Resolved from this list:

- `signal-sample-009`: repaired in Phase 15 and moved to `In Review` as an AI electricity and grid constraint signal.

### Sources

The current source records are a stronger MVP evidence base. They are mostly Tier 1 official or institutional sources, with one Tier 3 company press-room source.

Before publication:

- Recheck every URL.
- Confirm `last_checked_date`.
- Keep `source-joby-press-releases` explicitly labeled as an interested-party source.
- Add local conversion evidence before making strong local-system claims.

### Topics

Current topic records:

- `Climate`
- `Chips and Compute`
- `Aviation`
- `Critical Minerals`
- `Quantum`
- `Mobility`
- `Energy`
- `Water`
- `Policy and Standards`
- `Finance and Risk`
- `Human Futures`

These are enough to support the first Atlas and briefing workflow. The next expansion step should prioritize source quality and evidence gaps before adding more topic volume.

### Organizations and Technologies

Current organization and technology records:

- `org-nist`
- `org-us-energy-information-administration`
- `org-arizona-department-water-resources`
- `org-arizona-corporation-commission`
- `org-cmhc`
- `org-government-of-ontario`
- `org-statistics-canada`
- `org-us-department-energy`
- `technology-lidar`
- `technology-post-quantum-cryptography`
- `technology-evtol-aircraft`
- `technology-grid-scale-energy-storage`
- `technology-advanced-semiconductor-packaging`

The current organization records are useful Atlas anchors for official sources. Phase 23 added source-backed technology records so the Technology Atlas can become a stronger dependency-map surface.

### Local Systems

Current local system profiles:

- `Ontario Real Estate`
- `U.S. Southwest Chip Corridor`

Both are useful concept tests. Neither should carry strong public conclusions until local utility, water, planning, permitting, market, labor, and climate sources are added.

### Briefings

`briefing-stack-watch-001` is now `In Review`. It uses only reviewed signals and should remain unpublished until the referenced signals pass final publication review. Future briefings should follow `docs/briefing-template.md` and should update `docs/evidence-gap-register.md` when they expose missing conversion evidence.

## Priority Topics To Add

Add these topic records first:

- Critical Minerals
- Energy
- Quantum
- Agriculture and Bioeconomy
- AI for Science
- Space
- Water
- Policy and Standards
- Advanced Manufacturing
- Finance and Risk

## Priority Source Areas

Add source records that improve evidence coverage in these areas:

- Energy and grid data
- Critical mineral supply chains
- Water and industrial resource constraints
- Space missions and launch infrastructure
- Quantum standards and research
- Agriculture genetics and bioinformatics
- AI for chemistry and materials science
- Aviation certification and safety
- Semiconductor manufacturing and supply chains
- Local planning, permitting, utility, and climate-risk sources

## First 30 Recommended Records

Create these records as the next content batch. The sequence starts with sources and topics because signals become stronger when the evidence layer exists first.

1. Source: U.S. Energy Information Administration electricity data.
2. Source: DOE grid or electricity infrastructure program source.
3. Source: DOE critical materials or manufacturing supply-chain source.
4. Source: EPA or USGS water data source for local constraints.
5. Source: FAA aircraft certification or advanced air mobility implementation source.
6. Source: NASA mission or lunar infrastructure updates source refinement.
7. Source: Peer-reviewed or national-lab AI-for-materials source.
8. Source: Local utility or planning source for the U.S. Southwest chip corridor.
9. Source: Local housing, rate, or planning source for Ontario real estate.
10. Source: Credible reporting or trade source for data center power and grid constraints.
11. Topic: Critical Minerals.
12. Topic: Energy.
13. Topic: Quantum.
14. Topic: Agriculture and Bioeconomy.
15. Topic: AI for Science.
16. Organization: U.S. Department of Energy.
17. Organization: Federal Aviation Administration.
18. Organization: NASA.
19. Organization: U.S. Geological Survey.
20. Technology: eVTOL aircraft.
21. Technology: Post-quantum cryptography.
22. Technology: Grid-scale energy storage.
23. Technology: Advanced semiconductor packaging.
24. Local system: North American data center power corridor.
25. Local system: Critical minerals refining corridor.
26. Signal: Current ENSO outlook and climate-risk posture.
27. Signal: USGS critical minerals update with commodity-specific implications.
28. Signal: CHIPS or semiconductor manufacturing program milestone.
29. Signal: Post-quantum cryptography standard or migration milestone.
30. Signal: AI/data center electricity demand constraint signal.

## First Promotion Batch

The first reviewed publication batch should be smaller than the 30-record expansion list.

Recommended Phase 10 batch:

- Promote or repair 6-8 closest seed signals.
- Add 5-8 source records needed for those signals.
- Add 3-5 topic records.
- Add 2-3 organization records.
- Add 2-3 technology records.
- Add 1 local system source-backed profile or repair one existing local system profile.
- Keep briefings in draft until enough reviewed signals exist.

## Phase 10 Progress

Completed in Phase 10:

- Repaired six strongest seed signals and moved them from `Draft Sample` to `In Review`.
- Marked those six records as `Reviewed`, but not `Published`.
- Verified official source pages for NOAA CPC ENSO, USGS MCS 2026, NIST CHIPS, FAA AAM, NHTSA Automated Vehicle Safety, and NIST PQC.
- Updated source checked dates for the six official source records.
- Added supporting topic records for `Critical Minerals`, `Quantum`, and `Mobility`.

Still needed before publication:

- Decide whether `In Review` records are visible to readers.
- Add visible citation/status UI on signal pages.
- Tie CHIPS, FAA, NHTSA, and PQC signals to more specific dated events where possible.
- Create source-backed local system evidence before making strong local claims.
- Keep briefing records in draft until their referenced signals are reviewed or published.

## Phase 12 Progress

Completed in Phase 12:

- Added official source records for U.S. electricity data, Arizona electricity context, Arizona water governance, Arizona utility regulation, CMHC housing market data, Ontario housing supply progress, and Statistics Canada building permits.
- Added source IDs to `local-ontario-real-estate` and `local-us-southwest-chip-corridor` where the relationship is defensible.
- Added evidence-foundation sections to both local profiles, with explicit limits on what the new sources do and do not support.
- Kept all records out of `Published`.
- Avoided adding new signals until the local evidence base is stronger.

Source gaps remaining:

- municipal infrastructure capacity,
- local permit timelines and development application records,
- project-level financing exposure,
- facility-level industrial water demand,
- utility interconnection and service-territory evidence,
- workforce pipeline capacity,
- supplier network maturity,
- local climate and hazard data tied to specific places.

Recommended Phase 13 path:

- harden the existing two local system profiles,
- add missing-data tables and constraint notes,
- decide which local-system fields and caveats should be public at MVP,
- add only official municipal, utility, permitting, facility, or workforce sources needed for profile quality.

## Phase 13 Progress

Completed in Phase 13:

- Hardened the Ontario Real Estate and U.S. Southwest Chip Corridor profiles.
- Added constraint notes, source-backed evidence sections, evidence-limit sections, missing-data matrices, actors-with-authority notes, second-order effect notes, and signals-to-watch sections.
- Added source cards to local system detail pages so readers can see source type, credibility tier, checked date, and limitations.
- Decided that local-system evidence caveats and missing data should remain public at MVP.
- Added no new source records, signals, dependencies, automation, or schema fields.

Recommended Phase 14 path:

- add missing priority topic records for Energy, Water, Policy and Standards, Finance and Risk, and Human Futures,
- add organization records for key official agencies where useful,
- add source-to-local-system backlinks where existing source IDs already support the relationship,
- avoid creating broad new signals until Atlas topic and relationship coverage catches up with the current source base.

## Phase 14 Progress

Completed in Phase 14:

- Added topic records for Energy, Water, Policy and Standards, Finance and Risk, and Human Futures.
- Added official organization records for EIA, Arizona Department of Water Resources, Arizona Corporation Commission, CMHC, Government of Ontario, and Statistics Canada.
- Added source detail backlinks to local system profiles that explicitly cite the source.
- Added topic detail backlinks to local systems through deterministic source-topic overlap.
- Kept relationships tied to explicit IDs and controlled topic fields.
- Added no new signals, sources, dependencies, automation, or publication promotions.

Recommended Phase 15 path:

- create or repair a small second batch of official-source-backed signals,
- prioritize the expanded evidence base: energy/grid, water, Ontario housing, building permits, and local constraints,
- make each signal specific, dated, and evidence-aware,
- keep records in `Draft` or `In Review` unless they meet the full publication criteria.

## Phase 15 Progress

Completed in Phase 15:

- Repaired the AI electricity demand signal and moved it from `Draft Sample` to `In Review`.
- Added four new `In Review` signals:
  - Arizona electricity profile and chip-corridor power questions.
  - Arizona water resources and chip-corridor governance questions.
  - Ontario housing supply progress as a local capacity signal.
  - Statistics Canada building permits as construction intentions, not completions.
- Refreshed the IEA AI source checked date.
- Kept all Phase 15 records unpublished.
- Avoided unsupported local conclusions by making evidence limits explicit in every new or repaired signal.

Current reviewed-signal base:

- ENSO outlook signal.
- USGS mineral commodity signal.
- CHIPS program signal.
- FAA advanced air mobility signal.
- NHTSA automated vehicle safety signal.
- NIST post-quantum cryptography signal.
- AI electricity and grid constraint signal.
- EIA Arizona electricity and chip-corridor power signal.
- Arizona water resources and chip-corridor governance signal.
- Ontario housing supply and local capacity signal.
- Statistics Canada building permits and construction intentions signal.

Recommended Phase 16 path:

- create or repair the first evidence-backed briefing draft,
- synthesize only the reviewed signals that can safely support the argument,
- make clear which conclusions are supported, which remain provisional, and which require more data,
- keep the briefing in `Draft` or `In Review` until underlying records are publication-ready.

## Phase 16 Progress

Completed in Phase 16:

- Converted the placeholder briefing into `Stack Watch 001: Local constraints are where the future arrives`.
- Moved the briefing from `Draft Sample` to `In Review`.
- Used only reviewed signals in the briefing evidence base.
- Added briefing UI context for record status, referenced-signal status, verification, and evidence quality.
- Kept the briefing unpublished.
- Avoided unsupported local readiness, project viability, or completion claims.

Synthesis result:

The reviewed signal base now supports a cautious but useful FTFN thesis: frontier futures are increasingly limited by the conversion layer between signal and outcome. That layer includes local power, water, materials, compute, regulation, capital, infrastructure, data quality, and interpretation.

Recommended Phase 17 path:

- create a reusable briefing template,
- create an evidence gap register for local conversion evidence,
- map missing evidence to future source records, signal records, local-system updates, and possible schema fields,
- avoid adding volume until evidence gaps are explicitly organized.

## Phase 17 Progress

Completed in Phase 17:

- Created a reusable briefing template from Stack Watch 001.
- Created an evidence gap register for conversion evidence.
- Added initial high-priority gaps for Arizona power, Arizona water, U.S. Southwest chip corridor workforce/suppliers, Ontario municipal servicing, Ontario permits-to-completions, ENSO local interpretation, critical minerals, AI electricity demand, post-quantum migration, and eVTOL deployment evidence.
- Updated the briefing checklist so missing evidence must be checked against the register.
- Updated the content model so briefing required fields match the active app schema.
- Added no new sources, signals, local-system conclusions, app code, automation, ingestion, or dependencies.

Recommended Phase 18 path:

- add only a small batch of high-priority source records from the evidence gap register,
- prioritize local conversion evidence over broad content expansion,
- update local profiles or signals only when new official sources directly support the relationship,
- keep records out of `Published`.

## Phase 18 Progress

Completed in Phase 18:

- Added ACC eDocket as an official Arizona utility/regulatory docket source.
- Added ADWR assured and adequate water supply as an official Arizona water-governance source.
- Added City of Toronto Application Information Centre as the first municipal planning application source for Ontario local-system work.
- Added CMHC starts, completions, and units-under-construction tables as a more specific housing delivery evidence source.
- Linked the new sources to the Ontario Real Estate and U.S. Southwest Chip Corridor profiles where the relationship is defensible.
- Updated the evidence gap register to show that the first source layer has been added for four high-priority gaps.
- Created no new signals and promoted no records to `Published`.

Source gaps remaining:

- specific Arizona utility dockets, rate cases, interconnection records, and service-territory evidence,
- specific Arizona provider records, facility water demand, reuse plans, and discharge or permit evidence,
- Ontario municipal servicing capacity, infrastructure funding, permit timing, and local completion evidence beyond Toronto,
- stronger permit-to-start-to-completion conversion evidence tied to specific municipalities and time periods.

Recommended Phase 19 path:

- inspect the Phase 18 sources for specific records that can support narrower local-system updates,
- update missing-data matrices only where evidence directly supports a narrower claim,
- create or repair one to two signals if official source evidence supports a specific table, filing, application, or local record,
- keep all local conclusions cautious until the source trail moves from general source layer to specific evidence.

## Phase 19 Progress

Completed in Phase 19:

- Repaired the Arizona water resources signal with ADWR assured and adequate water supply evidence.
- Repaired the Statistics Canada building permits signal with CMHC starts, completions, and units-under-construction evidence.
- Added evidence integration notes to both local system profiles.
- Refreshed the checked dates on the four Phase 18 source records.
- Created no new signals, sources, organizations, technologies, or local systems.
- Promoted no records to `Published`.

What the repairs reveal:

- ADWR criteria can make the Arizona water governance layer more specific, but facility-level conclusions still need provider, facility, permit, reuse, and discharge evidence.
- CMHC starts/completions tables can help distinguish upstream construction intention from downstream housing delivery, but municipal servicing, financing, and local completion evidence are still needed.
- ACC eDocket and Toronto AIC should become signal sources only after FTFN selects a specific docket, filing, application, approval timeline, or local record.

Recommended Phase 20 path:

- decide whether evidence-gap links and claim-scope metadata should become active schema fields,
- update content model and schemas only if the new fields improve editorial review,
- consider public display for evidence-gap or claim-scope information only if it clarifies source limits for readers.

## Phase 20 Progress

Completed in Phase 20:

- Added schema fields for evidence-gap IDs, claim scope, local evidence level, and last reviewed date.
- Tagged four local constraint signals with active evidence-gap metadata.
- Tagged both current local system profiles with active evidence-gap metadata.
- Tagged Stack Watch 001 with active evidence-gap metadata.
- Added lightweight detail-page display for claim scope, local evidence level, linked evidence gaps, and review dates.
- Updated the content model and review checklists.
- Created no new source or signal records.
- Promoted no records to `Published`.

Recommended Phase 21 path:

- decide whether evidence gaps should become their own structured content collection,
- seed `gap-001` through `gap-010` as structured records if useful,
- validate references from records to evidence gaps,
- add an evidence-gap index only if it improves the research workflow.

## Phase 21 Progress

Completed in Phase 21:

- Added an `evidenceGaps` content collection.
- Seeded structured records for `gap-001` through `gap-010`.
- Added an Atlas evidence-gap index and generated evidence-gap detail pages.
- Linked signal, local system, and briefing detail pages to evidence-gap records.
- Added evidence gaps to the Atlas landing page.
- Created no new signals, sources, organizations, technologies, or local systems.
- Resolved no evidence gaps.
- Promoted no records to `Published`.

Recommended Phase 22 path:

- add a lightweight reference-integrity validator,
- check source IDs, evidence gap IDs, signal IDs, and local system references across content collections,
- add an npm script for the QA gate if useful,
- run the gate before broader content expansion resumes.

## Phase 22 Progress

Completed in Phase 22:

- Added `app/scripts/validate-content-references.mjs`.
- Added `npm run validate:content`.
- Validated duplicate IDs, duplicate slugs, `source_ids`, topic `featured_sources`, `evidence_gap_ids`, briefing `signal_ids`, evidence-gap related record IDs, local-system names on evidence gaps, and publication guardrails.
- Confirmed the current content graph passes the new QA gate.
- Added no new sources, signals, organizations, technologies, local systems, briefings, evidence gaps, dependencies, automation, or ingestion.
- Promoted no records to `Published`.

Recommended Phase 23 path:

- resume small, reference-gated content expansion,
- create or repair only records with strong source support,
- prioritize active evidence gaps and source-backed technology records,
- run `npm run validate:content` before and after content expansion.

## Phase 23 Progress

Completed in Phase 23:

- Ran `npm run validate:content` before selecting records.
- Added a source-backed technology reference batch:
  - `technology-post-quantum-cryptography`,
  - `technology-evtol-aircraft`,
  - `technology-grid-scale-energy-storage`,
  - `technology-advanced-semiconductor-packaging`.
- Added `source-doe-office-electricity-energy-storage`.
- Added `org-us-department-energy`.
- Refreshed checked dates for `source-nist-pqc`, `source-faa-aam`, and `source-nist-chips`.
- Added DOE Office of Electricity Energy Storage to the Energy topic featured sources.
- Created no new signals and promoted no records to `Published`.

Recommended Phase 24 path:

- harden the Technology Atlas now that it has multiple source-backed technology records,
- add deterministic technology-to-signal links where source IDs or topic matches support them,
- add guardrails so technology pages explain dependencies and constraints without implying deployment readiness,
- keep dependency mapping qualitative until the content base is larger.

## Phase 24 Progress

Completed in Phase 24:

- Hardened the Technology Atlas index with reference-record framing.
- Added source and related-signal counts to technology cards.
- Added profile-scope, maturity, and relationship-rule guardrails to technology detail pages.
- Added source support, evidence-posture, dependency, constraint, topic, and related-signal modules.
- Added deterministic related-signal links using only shared source IDs or primary-topic overlap.
- Added no new records, no dependencies, no ingestion, and no automation.
- Promoted no records to `Published`.

Recommended Phase 25 path:

- define a lightweight qualitative dependency-map format,
- decide whether maps should be standalone records or generated from existing records,
- prototype one map using current technology, signal, source, local-system, and evidence-gap records,
- avoid numeric scoring until the editorial basis is stronger.

## Phase 25 Progress

Completed in Phase 25:

- Defined a reusable qualitative dependency-map format.
- Decided dependency maps should begin as standalone JSON records that link existing records rather than generated views.
- Added one prototype dependency map: `dependency-map-local-constraints-where-the-future-arrives`.
- Added dependency-map Atlas routes and a lightweight detail page.
- Extended the reference-integrity validator to check dependency-map record IDs, node references, and map links.
- Added no graph libraries, scoring, automation, ingestion, or database layer.
- Promoted no records to `Published`.

Recommended Phase 26 path:

- integrate dependency maps into existing reader journeys,
- add deterministic backlinks from related signal, technology, local-system, evidence-gap, and source pages,
- decide where maps should appear in topic pages and briefings,
- keep map relationships explicit and qualitative.

## Phase 26 Progress

Completed in Phase 26:

- Added deterministic dependency-map backlinks to signal, source, technology, local system, and evidence gap detail pages.
- Added dependency-map sections to topic pages when the map `primary_topic` matches the topic.
- Added dependency-map sections to briefing pages when maps share signal IDs or evidence gap IDs with the briefing.
- Added a reusable `DependencyMapLinks` component.
- Kept backlinks labeled by relationship type.
- Added no new content records, dependencies, graph libraries, scoring, automation, ingestion, or database layer.
- Promoted no records to `Published`.

Recommended Phase 27 path:

- define dependency-map selection rules,
- choose one second map candidate from the current content base,
- create the second map only if explicit existing records support it,
- keep the map qualitative and evidence-aware,
- avoid numeric 42/59 scoring.

## Phase 27 Progress

Completed in Phase 27:

- Added dependency-map selection rules to the dependency map format.
- Chose `Post-quantum standards are not migration` as the second dependency-map candidate.
- Added the second dependency map using only existing records:
  - `source-nist-pqc`,
  - `signal-sample-007`,
  - `technology-post-quantum-cryptography`,
  - `topic-quantum`,
  - `gap-009`.
- Used the map to distinguish standards progress from operational migration evidence.
- Added no new source, signal, technology, topic, local-system, briefing, or evidence-gap records.
- Added no graph libraries, scoring, automation, ingestion, or database layer.
- Promoted no records to `Published`.

Recommended Phase 28 path:

- harden the dependency-map Atlas index now that multiple maps exist,
- add lightweight grouping or filtering by map type, topic, and status,
- add a short public selection-rule note,
- avoid creating more maps until the map index is easier to scan.

## Phase 28 Progress

Completed in Phase 28:

- Hardened `/atlas/dependency-maps/` with static grouping and count surfaces.
- Added counts by map type, topic, status, and linked evidence gaps.
- Added a public selection-rule note explaining that maps exist when one record is not enough.
- Preserved the all-map card grid while adding grouped browse sections by type and topic.
- Created no new dependency maps, signals, sources, topics, local systems, technologies, organizations, briefings, or evidence gaps.
- Added no graph libraries, scoring, automation, ingestion, or database layer.
- Promoted no records to `Published`.

Recommended Phase 29 path:

- make dependency maps easier to discover from the homepage and Atlas landing page,
- use current map counts and selection-rule language where useful,
- avoid adding additional maps until the entry points are clear,
- keep maps qualitative and evidence-aware.

## Phase 29 Progress

Completed in Phase 29:

- Added a homepage dependency-map discovery band using current dependency-map records.
- Added map count, map-type count, and linked evidence-gap count to the homepage surface.
- Added a dedicated dependency-map entry section to the Atlas landing page.
- Added map counts, map topics, map types, and existing map links to the Atlas landing page.
- Created no new dependency maps, signals, sources, topics, local systems, technologies, organizations, briefings, or evidence gaps.
- Added no graph libraries, scoring, automation, ingestion, or database layer.
- Promoted no records to `Published`.

Recommended Phase 30 path:

- audit both current dependency maps against the selection rules,
- improve dependency-map detail-page readability if the current pages feel too dense,
- add static relationship summaries or map statistics only if they clarify evidence boundaries,
- avoid creating more maps until current map pages are polished.

## Phase 30 Progress

Completed in Phase 30:

- Audited both current dependency maps against the Phase 27 selection rules.
- Confirmed both current maps still qualify as useful qualitative maps.
- Added static structure summaries to dependency-map detail pages.
- Added linked-record-type counts and confidence-mix counts to the detail pages.
- Created no new dependency maps, signals, sources, topics, local systems, technologies, organizations, briefings, or evidence gaps.
- Added no graph libraries, scoring, automation, ingestion, or database layer.
- Promoted no records to `Published`.

Recommended Phase 31 path:

- test the full dependency-map reader journey from homepage through related record backlinks,
- decide whether current map work should pause or whether a third map candidate deserves review,
- create no third map unless the selection rules clearly justify it.

## Phase 31 Progress

Completed in Phase 31:

- Tested the generated reader path from homepage to Atlas landing to dependency-map index to both map detail pages.
- Confirmed representative dependency-map backlinks from signal, source, technology, local system, evidence gap, topic, and briefing pages.
- Separated wording mismatches from broken links. The app uses `Dependency Maps` as the public section label, not `Related Dependency Maps`.
- Created no new dependency maps, signals, sources, topics, local systems, technologies, organizations, briefings, or evidence gaps.
- Added no graph libraries, scoring, automation, ingestion, or database layer.
- Promoted no records to `Published`.

Decision:

Pause dependency-map expansion and return to broader source-backed content growth.

Recommended Phase 32 path:

- choose a small source-backed batch across underdeveloped pillars,
- prioritize official or primary source records before dependent records,
- focus candidates on Agriculture and Bioeconomy, AI for Science, Space, Advanced Manufacturing, Climate/ENSO, or other high-evidence gaps,
- repair remaining `Draft Sample` records only where strong sources support specific claims,
- keep dependency-map creation paused unless the new records clearly satisfy the Phase 27 selection rules.

## Phase 32 Progress

Completed in Phase 32:

- Ran `npm run validate:content` before content changes.
- Selected a small source-backed batch by source strength rather than topic coverage pressure.
- Added official Tier 1 source anchors:
  - DOE Office of Science,
  - NIST Materials Genome Initiative,
  - NIST Office of Advanced Manufacturing.
- Refreshed checked dates for:
  - NASA Artemis,
  - USDA NIFA Plant Breeding, Genetics and Genomics Programs.
- Added missing topic records for:
  - Space,
  - Agriculture and Bioeconomy,
  - AI for Science,
  - Advanced Manufacturing.
- Added organization records for:
  - NASA,
  - USDA National Institute of Food and Agriculture.
- Expanded existing NIST and DOE organization records to include the new source anchors.
- Repaired two remaining `Draft Sample` signals into cautious `In Review` records:
  - NASA Artemis roadmap and lunar infrastructure,
  - USDA plant genomics and future agriculture.
- Left the Joby/eVTOL company-claim sample in `Draft Sample`.
- Created no dependency maps, local systems, briefings, evidence gaps, scoring, automation, ingestion, or database layer.
- Promoted no records to `Published`.

What this reveals:

- Space and Agriculture/Bioeconomy now have enough official source support to appear as real Atlas pillars, but not enough specific event evidence for publication-ready reports.
- AI for Science and Advanced Manufacturing are now better anchored by DOE and NIST source records.
- The remaining eVTOL company-claim sample should not be reviewed until it has regulatory, local, customer, airport, or independent operational evidence.

Recommended Phase 33 path:

- audit `In Review` signals for publication readiness,
- recheck source URLs and checked dates for a small launch candidate set,
- decide which records should remain `In Review`, become `Needs Follow-Up`, or stay draft,
- triage the remaining Joby/eVTOL company-claim sample without promoting it,
- define the minimum public launch set for `ftfn.io`.

## Phase 33 Progress

Completed in Phase 33:

- Created `docs/publication-readiness-triage.md`.
- Audited all current signal records for launch readiness.
- Rechecked a small official-source launch-candidate set.
- Identified five signal records as launch candidates, while keeping them out of `Published`:
  - `signal-sample-002`,
  - `signal-sample-007`,
  - `signal-arizona-electricity-profile-chip-corridor-power-constraint`,
  - `signal-arizona-water-resources-chip-corridor-constraint-map`,
  - `signal-statcan-building-permits-construction-intentions-signal`.
- Moved the stale NOAA ENSO Watch signal to `Needs Update` because the current NOAA CPC discussion is dated 11 June 2026 and lists El Nino Advisory status.
- Kept the Joby/eVTOL company-claim record in `Draft Sample`.
- Refreshed checked dates for the official source pages rechecked in the launch-candidate set.
- Promoted no records to `Published`.

What this reveals:

- FTFN has enough reviewed records for a small launch-candidate set, but not enough process infrastructure to publish safely.
- Source freshness matters more now than raw record count.
- The first public release should be narrow: a few highly reviewable signals, visible caveats, source transparency, and no unsupported local conclusions.

Recommended Phase 34 path:

- create a publication and correction policy,
- decide whether source transparency needs a dedicated public page,
- repair the NOAA ENSO signal against the current source or exclude it from launch,
- define final launch-candidate copy and metadata checks,
- add metadata and social preview basics if small,
- keep all `Published` promotions gated until the policy and final review are complete.

## Phase 34 Progress

Completed in Phase 34:

- Created `docs/publication-policy.md`.
- Created a public `/method/` page for source transparency, publication policy, correction/update rules, and launch gates.
- Decided that Method should be a dedicated public surface while About remains the project identity page.
- Repaired the NOAA ENSO signal against NOAA CPC's 11 June 2026 ENSO Diagnostic Discussion.
- Moved the NOAA ENSO signal back to `In Review` with `Verified Against Primary Source`.
- Added sitewide metadata/social preview basics without adding dependencies.
- Linked Method from navigation, footer, About, and homepage source-transparency copy.
- Promoted no records to `Published`.

Launch-candidate set after Phase 34:

- `signal-sample-001`,
- `signal-sample-002`,
- `signal-sample-007`,
- `signal-arizona-electricity-profile-chip-corridor-power-constraint`,
- `signal-arizona-water-resources-chip-corridor-constraint-map`,
- `signal-statcan-building-permits-construction-intentions-signal`.

Recommended Phase 35 path:

- perform final copy and citation review across the six launch-candidate signals,
- verify source cards and source checked dates on public pages,
- decide whether any records can move to `Published` or whether the set should remain `In Review`,
- run mobile/accessibility QA on homepage, Method, representative signal detail, and representative source detail pages,
- keep publication promotion explicit and reversible.

## Phase 35 Progress

Completed in Phase 35:

- Rechecked the official and primary source pages for the six launch-candidate records.
- Published three bounded official-source records:
  - NOAA ENSO Diagnostic Discussion and climate-risk clock,
  - USGS Mineral Commodity Summaries 2026 critical-materials baseline,
  - NIST post-quantum cryptography standards and migration.
- Kept three local or conversion-layer records in `In Review`:
  - Arizona electricity profile and chip-corridor power questions,
  - Arizona water resources and chip-corridor governance question,
  - Statistics Canada building permits as construction intentions.
- Refreshed checked dates for the reviewed source set.
- Added publication-date visibility to signal detail pages.
- Created `docs/launch-candidate-review.md`.
- Promoted no local constraint records, no company claims, no briefings, and no dependency maps to `Published`.

What this reveals:

- FTFN can now publish a small official-source core without losing the evidence boundary.
- Local system records are still valuable, but they should remain review material until tied to specific utility, provider, facility, municipal, geography, or release evidence.
- The next expansion should not be raw volume; it should prepare the launch package and decide how public indexes handle mixed `Published` and `In Review` states.

Recommended Phase 36 path:

- create a launch package and deployment-readiness checklist,
- decide the static hosting path for `ftfn.io`,
- add sitemap and robots support if it stays small,
- verify generated routes, metadata, and public visibility rules,
- decide whether signal indexes default to `Published` after launch,
- defer analytics, automation, ingestion, CMS, database migration, accounts, and scoring.

## Phase 36 Progress

Completed in Phase 36:

- Created `docs/launch-package.md`.
- Chose Cloudflare Pages as the recommended first static hosting path for `ftfn.io`.
- Added `https://ftfn.io` as the Astro site URL.
- Added canonical and Open Graph URL metadata.
- Added generated `robots.txt`.
- Added generated `sitemap.xml`.
- Made Published signals the first section on `/signals/`.
- Kept `In Review` and `Draft Sample` signals visible in a labeled review shelf.
- Added `noindex, follow` to non-published signal and briefing detail pages.
- Excluded non-published signal and briefing detail URLs from the sitemap.
- Outlined the first launch note.
- Did not deploy, attach `ftfn.io`, change DNS, add analytics, start automation, add ingestion, add scoring, add a CMS, add accounts, or migrate to a database.

What this reveals:

- The content base is now good enough to support a small static launch package, but not broad enough to justify automation or scoring.
- Published records should anchor public discovery; review material can remain visible as transparent scaffolding while search indexing stays conservative.
- The next step should strengthen the source-control layer before broad content expansion, while still preserving browser QA and preview deploy readiness.

Recommended Phase 37 path:

- add a generated source monitor from current source records,
- expose source freshness, update cadence, authority, and review priority,
- link the monitor from Atlas, Sources, Method, and sitemap,
- keep automated ingestion and automated publishing out of scope,
- use the monitor to guide the next source-backed content cycle.

## Phase 37 Progress

Completed in Phase 37:

- Added `docs/source-monitoring-plan.md`.
- Added `/atlas/source-monitor/` as a generated source freshness and review queue.
- Added qualitative source freshness states: `Current`, `Watch soon`, and `Review due`.
- Added source freshness labels to source index cards and source profiles.
- Linked the monitor from Atlas, Sources, Method, and sitemap.
- Added no automated ingestion, automated publishing, scoring, CMS, database migration, analytics, deployment, or DNS changes.

What this reveals:

- FTFN's next content expansion should begin with source freshness and authority, not raw signal volume.
- A generated monitor is a useful bridge toward self-updating reference surfaces without weakening the publication gate.
- The next source batch should prioritize high-value watch lanes and sources that can support narrower dated signals.

## Signals Roadmap Checkpoint

Created `docs/signals-roadmap.md` as the dedicated planning surface for the next signal expansion cycle.

The roadmap defines:

- recurring watch lanes such as Power Watch, Water Watch, Compute and Chips Watch, Mobility Certification Watch, Climate Conversion Watch, Agriculture and Bioeconomy Watch, AI for Science and Materials Watch, Space Infrastructure Watch, Security and Standards Watch, Finance and Workforce Watch, and Local Systems Watch,
- a highest-value next signal batch,
- evidence requirements by lane,
- a source-first record sequence,
- reader-facing signal experience direction.

After Phase 37, the next content phase should use the source monitor and signals roadmap together to choose a small source-backed batch rather than creating records for volume. Final browser QA and deploy-preview preparation still need completion before public launch.

## Authority Red-Team Checkpoint

Created `docs/authority-red-team-and-resource-expansion-plan.md` in Phase 38.

The red-team finding is that FTFN is a credible prelaunch evidence scaffold, but not yet a comprehensive public resource. Content expansion should now be sequenced by authority gaps:

- recheck Review due and Watch soon sources before new claims,
- add missing public topic records for `Cybersecurity` and `Discovery Technologies`,
- add high-authority source depth by watch lane,
- repair broad In Review records into dated source-backed signals,
- build local evidence dossier tables before stronger local conclusions,
- add a public update/correction path before broader launch.

This means the next batch should not optimize for raw count. It should make the site harder to challenge.

## Records Not To Create Yet

Defer these until the core editorial workflow is stable:

- automated ingestion drafts,
- numeric 42/59 scores,
- public datasets,
- facility-level databases,
- speculative long-range essays without source-backed signals,
- alerts or saved watchlists.
