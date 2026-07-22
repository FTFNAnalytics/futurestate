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
| gap-001 | Source Added | High | U.S. Southwest Chip Corridor | Energy | Power, Infrastructure, Regulation, Data Quality | Which utility records show real power capacity for semiconductor and AI infrastructure? | utility integrated resource plans, interconnection queues, tariff filings, rate cases, service-territory evidence, facility load estimates | Use ACC eDocket and utility sources to identify specific dockets, filings, and rate cases before making site-level power claims. |
| gap-002 | Source Added | High | U.S. Southwest Chip Corridor | Water | Water, Climate, Infrastructure, Public Trust | Which records show whether industrial growth has defensible water capacity? | provider-level water records, facility water demand, reuse plans, discharge permits, assured water supply records, drought sensitivity | ADWR criteria are now integrated into the Arizona water signal; next add provider, permit, facility-demand, discharge, and reuse-plan sources before facility-level water claims. |
| gap-003 | Open | High | U.S. Southwest Chip Corridor | Chips and Compute | Labor, Supply Chain, Manufacturing, Capital | Can local supplier and workforce systems support semiconductor scaling? | workforce pipeline data, training program capacity, supplier networks, construction labor availability, facility hiring data | Identify official workforce and economic development sources; update local profile only after source support exists. |
| gap-004 | Source Added | High | Ontario Real Estate | Human Futures | Infrastructure, Regulation, Capital, Labor | Which municipal systems can convert housing targets into completed units? | servicing capacity, development application timelines, infrastructure funding, permit processing, municipal approvals, completions by municipality | Use Toronto AIC as the first municipal application source, then add servicing and approval-timeline sources for priority municipalities. |
| gap-005 | Source Added | High | Ontario Real Estate | Finance and Risk | Capital, Data Quality, Infrastructure | Which permit intentions become starts, completions, and occupancy? | permit-to-start conversion, starts, completions, cancellations, financing conditions, local absorption data | CMHC starts/completions are now integrated into the permits signal; next add municipal completion, servicing, financing, and geography-specific conversion evidence. |
| gap-006 | Open | Medium | Cross-system | Climate | Climate, Weather, Interpretation | How should ENSO signals be interpreted for specific sectors and places? | local climate teleconnection evidence, sector impact models, water-basin data, crop-region data, insurance and hazard exposure data | Add regional climate and sector-specific sources before local ENSO conclusions. |
| gap-007 | Open | Medium | Cross-system | Critical Minerals | Materials, Supply Chain, Geopolitics, Data Quality | Which materials are binding for chips, grids, batteries, defense, and AI infrastructure? | commodity-specific supply, refining capacity, import reliance, substitution options, recycling capacity, offtake evidence | Create commodity-specific follow-up signals only where official or credible sources support the material question. |
| gap-008 | Open | Medium | Cross-system | Chips and Compute | Compute, Power, Water, Land Use, Permitting | Where does AI electricity demand become a local planning constraint? | data center siting, utility interconnection, local permitting, water/cooling evidence, grid congestion, community response | Add a future local system for a data center power corridor after source coverage improves. |
| gap-009 | Open | Medium | Cross-system | Policy and Standards | Standards, Cybersecurity, Labor, Unit Economics | Which institutions are actually migrating to post-quantum cryptography? | procurement rules, cryptographic inventory work, vendor readiness, migration timelines, critical infrastructure guidance | Add source records for migration guidance and procurement once a specific institution or sector is selected. |
| gap-010 | Open | Low | Cross-system | Aviation | Certification, Insurance, Weather, Public Trust | What turns eVTOL demonstrations into certified commercial service? | FAA certification milestones, operating approvals, vertiport permits, insurance evidence, city/airport agreements, weather operating limits | Keep company flight campaigns as interested-party evidence until independent regulatory or local sources exist. |

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
