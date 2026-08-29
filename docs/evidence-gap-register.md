# Evidence Gap Register

This register tracks missing evidence that prevents FTFN from turning signals into stronger conclusions.

The register is not a content backlog by itself. It is a bridge between editorial synthesis and future source, signal, local-system, and data-model work.

## Purpose

FTFN's core question is:

```text
What does this signal change, where, for whom, and through which constraints?
```

The evidence gap register exists because that question usually cannot be answered by one source. Official signals often show that something matters, but not how it transduces into local outcomes.

Use this register to:

- preserve missing-data needs from briefings and local profiles,
- prioritize source acquisition,
- prevent unsupported local conclusions,
- identify future schema fields,
- turn uncertainty into structured work.

## Status Values

```text
Open
Source Identified
Source Added
Signal Needed
Local Profile Update Needed
Schema Candidate
Resolved
Deferred
```

## Priority Values

```text
High
Medium
Low
```

High-priority gaps block interpretation across multiple records or affect local conclusions.

## Evidence Gap Fields

Each gap should include:

```text
id
status
priority
local_system
topic
constraint_tags
question
why_it_matters
current_support
missing_evidence
likely_source_types
candidate_records
next_action
future_data_model_need
notes
```

## Current Evidence Gaps

| ID | Status | Priority | Local System | Topic | Constraint Tags | Question | Missing Evidence | Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| gap-001 | Source Added | High | U.S. Southwest Chip Corridor | Energy | Power, Infrastructure, Regulation, Data Quality | Which utility records show real power capacity for semiconductor and AI infrastructure? | interconnection queues, named semiconductor-customer tariff treatment and facilities charges, executed electric-service agreements and service studies, facility load estimates, operating consumption and reliability evidence | Treat APS service territory as established but continue into a TSMC customer-specific service agreement, disclosed campus and facility load, dedicated infrastructure, construction, energization, facilities charges, consumption, and reliability evidence before making capacity claims. |
| gap-002 | Source Added | High | U.S. Southwest Chip Corridor | Water | Water, Climate, Infrastructure, Public Trust | Which records show whether industrial growth has defensible water capacity? | completed and accepted wastewater conveyance improvements, total facility water withdrawals and consumption, operating industrial reclaimed water plants and measured reuse, discharge permits, assured water supply records, drought sensitivity | Use Chandler and Intel only as operating comparators while continuing to require Phoenix and TSMC completion, acceptance, operating reuse, measured flow, discharge, compliance, and full water-balance records. |
| gap-003 | Source Added | High | U.S. Southwest Chip Corridor | Chips and Compute | Labor, Supply Chain, Manufacturing, Capital | Can local supplier and workforce systems support semiconductor scaling? | apprenticeship completion, credential, retention, and placement outcomes, occupation-specific labor supply, training capacity relative to fab and supplier demand, supplier networks, construction labor availability, facility occupation mix, vacancies, attrition, and hiring demand | Follow engagement and completion records into credential, placement, retention, wage, vacancy, quality, throughput, customer-delivery, and productivity outcomes with compatible denominators. |
| gap-004 | Source Added | High | Ontario Real Estate | Human Futures | Infrastructure, Regulation, Capital, Labor | Which municipal systems can convert housing targets into completed units? | final servicing conditions and detailed design, introduced and enacted by-laws for application 24 254930, satisfaction of the wind-study, land-exchange, and laneway conditions, project-specific infrastructure funding and utility connections, permit processing, municipal approvals, stage conversion and completions by municipality | Use the current CMHC stage baseline as aggregate context only. Recheck application 24 254930 on September 9 for introduced or enacted amendment numbers and accepted wind, land-exchange, laneway, or servicing conditions, then track a confirmed building permit, financing, start, completion, and occupancy. |
| gap-005 | Source Added | High | Ontario Real Estate | Finance and Risk | Capital, Data Quality, Infrastructure | Which permit intentions become starts, completions, and occupancy? | building permit and permit-to-start conversion for application 24 254930, project construction start, project completion and occupancy, cancellations, financing conditions, local absorption data | Keep CMHC's metropolitan stage stocks and flows separate and do not calculate an unmatched conversion rate. Recheck the bill and condition trail on September 9, then search the Building Permit portal using a confirmed application or later project identifier and track construction start, completion, and occupancy. |
| gap-006 | Source Added | Medium | Cross-system | Climate | Climate, Weather, Interpretation | How should ENSO signals be interpreted for specific sectors and places? | local climate teleconnection evidence, sector impact models, water-basin data, crop-region data, insurance and hazard exposure data | Follow the expanded observation shelf into a named regional model, exposed asset, responsible institution, documented decision, implementation record, and measured outcome. |
| gap-007 | Open | Medium | Cross-system | Critical Minerals | Materials, Supply Chain, Geopolitics, Data Quality | Which materials are binding for chips, grids, batteries, defense, and AI infrastructure? | additional commodity-specific production and supply, project sites, permits, and physical progress, refining capacity, import reliance, substitution options, recycling capacity, offtake evidence | Pair the selected gallium and Talon Nickel records with trade, permitting, facility, commissioning, production, inventory, qualification, and offtake evidence before treating either material or project as a binding system constraint. |
| gap-008 | Open | Medium | Cross-system | Chips and Compute | Compute, Power, Water, Land Use, Permitting | Where does AI electricity demand become a local planning constraint? | data center siting, utility interconnection, local permitting, water and cooling evidence, grid congestion, community response | Add a future local system for a data center power corridor after source coverage improves. |
| gap-009 | Source Added | Medium | Cross-system | Policy and Standards | Standards, Cybersecurity, Labor, Unit Economics | Which institutions are actually migrating to post-quantum cryptography? | completed Federal Acquisition Regulation changes and contract clauses, agency cryptographic inventory results, formal and final PIV revisions, validated dual-stack credential products and interoperability results, vendor readiness, migration timelines, critical infrastructure guidance | Move from the GSA acquisition path to institution-level solicitations, task orders, cryptographic inventory results, migration budgets, validated modules, interoperability tests, pilots, deployments, and legacy retirement while tracking formal PIV revisions, the 120-day agency plan deadline, NIST pilot, CISA guidance, and FAR rules. |
| gap-010 | Source Added | Low | Cross-system | Aviation | Certification, Insurance, Weather, Public Trust | What turns eVTOL demonstrations into certified commercial service? | aircraft type and production certification milestones, operator and route approvals, executed eIPP agreements, named sites, test plans, flights, and findings, vertiport and charging permits, insurance evidence, city or airport agreements, weather operating limits | Follow the final operating rule and pilot selections into executed agreements, aircraft and operator approvals, named sites, flights, safety data, local infrastructure, service, and operating outcomes. |
| gap-011 | Source Added | High | Northern Virginia Data Center Corridor | Energy | Power, Infrastructure, Land Use, Permitting, Water, Capital, Labor, Public Trust | Which named Northern Virginia projects progress from demand and authorization through built infrastructure, energization, compliant operation, and accepted local outcomes? | customer-specific service agreements and disclosed load, final transmission routes, land rights, construction, and energization, facility-level permit, water, construction, and operation records, workforce delivery and retention outcomes, measured cost, reliability, emissions, noise, water, and community outcomes | Follow Golden-Mars, GS-5, Loudoun Phase 2, named DEQ permits, and provider records through final rules, construction, service, compliance, and measured outcomes. |
| gap-012 | Source Added | High | Nevada Lithium And Battery Materials Corridor | Critical Minerals | Water, Permitting, Capital, Infrastructure, Supply Chain, Labor, Public Trust | When do Nevada's authorized and financed lithium projects become built, compliant, qualified, and sustained material supply? | current construction and commissioning milestones, project-specific water rights, pumping, monitoring, and impacts, inspection, compliance, mitigation, and enforcement outcomes, qualified product, customer acceptance, shipments, and sustained output, operating cost, recovery, loan performance, and local outcomes | Follow each named project from its current authorization or finance stage into water, construction, compliance, commissioning, qualification, production, and local outcomes. |
| gap-013 | Source Added | High | Florida Space Coast Launch Corridor | Space | Infrastructure, Regulation, Permitting, Safety, Weather, Labor, Capital, Climate | Which Space Coast plans, licenses, and capital programs convert into accepted infrastructure, available missions, safe operation, and sustained utilization? | formal current Shuttle Landing Facility license disposition, named state capital awards, contracts, construction, and acceptance, operator and mission licenses tied to infrastructure use, range availability, delay, incident, and utilization data, utility, resilience, workforce, housing, and environmental outcomes | Resolve the Shuttle Landing Facility license record first, then follow named master-plan, environmental, state-capital, and mission records through construction, acceptance, operation, and outcomes. |
| gap-014 | Source Added | High | Cross-system | AI for Science | Standards, Data Quality, Safety, Cybersecurity | Which records show that AI assurance methods have been adopted, validated, and maintained for named operating systems? | institution-level control adoption, system inventories and authorization decisions, repeat evaluations using documented methods, production monitoring and incident records, independent validation and corrective actions, measured mission, safety, and reliability outcomes | Follow agency inventories and audits into named system usage, impact assessment, authorization, performance, incident, corrective-action, cost, mission-benefit, and retirement records. |
| gap-015 | Source Added | High | Cross-system | Mobility | Regulation, Safety, Data Quality, Public Trust | Which records connect autonomous passenger-service authority to actual trips, exposure-adjusted safety, availability, accessibility, cost, and local outcomes? | carrier and geography-level trip counts, fleet size, service hours, availability, and cancellations, exposure-adjusted safety and incident severity, cost, accessibility, and rider outcomes, local emergency, curb, congestion, and enforcement records, repeatable multi-jurisdiction service performance | Follow effective CPUC authority into carrier-level service reports, DMV deployment records, exposure-adjusted safety analysis, local operating effects, accessibility, cost, and rider outcomes. |
| gap-016 | Source Added | High | Cross-system | Policy and Standards | Standards, Data Quality, Unit Economics, Safety, Public Trust | Which records make operating outcomes comparable without erasing differences in unit, denominator, period, geography, method, or attribution? | shared data dictionaries within each operating domain, compatible denominators and follow-up periods, quality, revision, and missing-data controls, independent validation for attributed outcomes, asset-, customer-, operator-, and geography-level breakdowns, outcome measures connected to incidents, cost, accessibility, reliability, and local effects, stable revision histories and vintage identifiers, explicit series-break crosswalks, three or more compatible observations for durable trend assessment | Extend the sixteen named series with revised and later observations; stop any line when unit, denominator, period, geography, method, attribution, or series definition changes. |

Phase 65 reconciliation note: this table is generated from the sixteen canonical JSON records. `gap-006` is the ENSO local-interpretation lane everywhere; no operating register reuses that ID for insurance or risk transfer.
## How To Use The Register

When writing a signal:

- check whether the signal answers an existing gap,
- add the gap ID to editorial notes if helpful,
- avoid resolving a gap unless the evidence directly supports the question.

When updating a local system profile:

- use gaps to decide which source records are needed next,
- update source IDs only when the source directly supports the local system,
- keep missing data public when it affects interpretation.

When writing a briefing:

- include only gaps that follow from the referenced signals,
- convert `what_to_watch_next` items into gap entries when they require evidence work,
- do not publish stronger conclusions just because a gap has been named.

When planning a data model:

- look for repeated gaps that imply structured fields,
- treat repeated local conversion questions as candidates for future entities such as Facility, Permit, Utility Filing, Dataset, Material, Policy, or Project.

## Active Schema Fields

Phase 20 promoted these fields into the active content schema:

Signal fields:

- `evidence_gap_ids`
- `claim_scope`
- `local_evidence_level`
- `last_reviewed_date`

Local system fields:

- `evidence_gap_ids`
- `local_evidence_level`
- `last_reviewed_date`

Briefing fields:

- `evidence_gap_ids`
- `claim_scope`
- `local_evidence_level`
- `last_reviewed_date`

These fields link records back to the register, but they do not resolve gaps by themselves.

## Structured App Collection

Phase 21 added structured evidence gap records in:

```text
app/src/content/evidence-gaps/
```

The Markdown register remains the editorial control document. The app collection supports:

- generated evidence-gap routes,
- relationship links from signals, local systems, and briefings,
- a lightweight research queue,
- future reference-integrity checks.

Phase 22 makes those checks active through `npm run validate:content`, which validates evidence-gap IDs, related source IDs, related signal IDs, and related local system IDs.

The current structured records are:

- `gap-001`
- `gap-002`
- `gap-003`
- `gap-004`
- `gap-005`
- `gap-006`
- `gap-007`
- `gap-008`
- `gap-009`
- `gap-010`

## Candidate Future Fields

These are not active schema fields yet. They are candidates revealed by current evidence gaps.

Source candidates:

- `source_scope`
- `jurisdiction`
- `data_granularity`
- `update_method`
- `license_or_usage_notes`

Briefing candidates:

- `primary_local_systems`
- `confidence_note`
- `briefing_type`

Future entity candidates:

- Facility
- Utility Filing
- Permit
- Dataset
- Material
- Policy or Regulation
- Funding Award
- Local Actor

## Phase 18 Candidates

The strongest next source-acquisition candidates are:

1. Arizona utility planning and rate-case sources for power capacity.
2. Arizona water provider, permit, or reuse-plan sources for industrial water constraints.
3. Ontario municipal planning, servicing, permit, and completion sources.
4. CMHC or municipal completions data that can distinguish targets, permits, starts, completions, and occupancy.
5. Commodity-specific official sources for minerals that matter to chips, grids, batteries, and defense.

Phase 18 should add only a small number of high-priority sources, then update local profiles or signals where the new evidence directly supports the claim.

## Phase 18 Progress

Source records added:

- `source-arizona-corporation-commission-edocket`
- `source-arizona-adwr-assured-water-supply`
- `source-city-toronto-application-information-centre`
- `source-cmhc-starts-completions-under-construction`

Gaps moved to `Source Added`:

- `gap-001`
- `gap-002`
- `gap-004`
- `gap-005`

Important caveat:

These gaps are not resolved. The new records add official source layers that make the next investigation more specific. FTFN still needs individual filings, provider records, application records, servicing evidence, completion data, and local interpretation before it can make stronger local conclusions.

## Phase 19 Progress

Signal repairs:

- `signal-arizona-water-resources-chip-corridor-constraint-map` now cites `source-arizona-adwr-assured-water-supply`.
- `signal-statcan-building-permits-construction-intentions-signal` now cites `source-cmhc-starts-completions-under-construction`.

Local profile integration:

- `local-us-southwest-chip-corridor` now distinguishes general Arizona water governance from the more specific 100-year water-supply criteria layer.
- `local-ontario-real-estate` now distinguishes permit intentions from starts, completions, and units under construction.

Still unresolved:

- `gap-001` needs specific ACC dockets, filings, utility plans, interconnection evidence, and service-territory records.
- `gap-002` needs provider, facility-demand, reuse, discharge, permit, and drought-sensitivity evidence.
- `gap-004` needs municipal servicing, infrastructure capacity, approval-timeline, and priority-municipality records beyond a general Toronto application portal.
- `gap-005` needs geography-specific permit-to-start-to-completion evidence and financing/local absorption context.

## Phase 20 Progress

Evidence-gap IDs are now active schema links on selected signals, local systems, and briefings. The local constraint signals now identify which gaps limit their claims, while the local profiles and Stack Watch 001 briefing expose their related unresolved gaps.

Important caveat:

Linking a record to an evidence gap is not the same as resolving the gap. It is an editorial control that says: this record's interpretation is bounded by these missing evidence needs.

## Phase 21 Progress

Evidence gaps are now structured app records and visible through the Atlas research queue. Each gap includes status, priority, local-system scope, topic, constraints, missing evidence, likely source types, next action, related records, and future data-model needs.

Important caveat:

The structured collection improves navigation and future validation. It does not change the evidence status of the gaps. No current gap is resolved.

## Phase 51B Progress

Named records added:

- SRP E-67 large-load price plan for `gap-001`,
- Phoenix-TSMC wastewater development agreement and North Phoenix 3,500 PUD for `gap-002`,
- TSMC registered technician apprenticeship for `gap-003`,
- Toronto item `2026.SC33.9` and the 2025 Development Pipeline for `gap-004` and `gap-005`.

Status change:

- `gap-003` moved from `Open` to `Source Added` because the dossier now has a named, facility-linked workforce program.

Important caveat:

All five gaps remain unresolved. Phase 51B adds conversion-layer evidence, not final outcomes. The next proof must come from customer service and energization, built water infrastructure and measured reuse, workforce outcomes, enacted Toronto by-laws, and project permits, starts, completions, and occupancy.
