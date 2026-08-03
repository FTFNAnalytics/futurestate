# Phase 57G: Named-Asset And Project-Cohort Registry Expansion

Date: 2026-08-03

Status: complete, validated, and owner-only deployed

## Goal

Turn current official inventories into stable public identity and lineage registries that can accept future compatible observations without converting registry structure, historical status, proposal assignment, lifecycle position, capacity, or work-breakdown state into an operating outcome.

## Delivered

- twenty-nine reviewed records;
- twenty Published registry panels and nine preserved In Review operating-outcome holds;
- five Amtrak panels backed by a complete 197-membership Appendix B register: 30 train-access rows, 120 PIDS rows, and 47 access-and-amenity rows resolving to 178 normalized station keys;
- five Montana panels backed by all 19 Final Proposal subgrantees, 32 deployment projects, 68,315 BSL rows, 183 CAI rows, $303,686,528 in proposed BEAD support, and $145,190,798 in proposed subgrantee match;
- five Hanford panels backed by fourteen DFLAW process, asset, custody, container, staging, and disposal nodes plus nine bounded observations;
- five NNSA panels backed by eighteen distinct enterprise, site, facility, project, subproject, scope-strategy, capacity-plan, qualification-event, and independent-recommendation objects;
- all nine Phase 57F holds preserved exactly once and no new hold added;
- nine new Tier 1 source profiles and twenty-seven carried official sources;
- four structured registry files, a main ledger, and a publication-review ledger;
- Research Watch 037, one collection, one public update, and a thirty-two-file archive;
- integrations across one organization, five topics, three reader pathways, and the comparative-outcomes dependency map;
- zero exact-target artifacts, trigger events, directive-scope changes, implementation changes, closure changes, agency contacts, or FOIA requests.

## Structured registries

| Registry | Public rows or objects | Identity boundary |
| --- | ---: | --- |
| Amtrak Appendix B named-station registry | 197 memberships / 178 normalized station keys | historical source row and cohort membership, not current device identity or reliability |
| Montana Final Proposal project-cohort registry | 19 subgrantees / 32 projects / 68,315 BSL rows / 183 CAI rows | project-level public denominator only; no individual BSL or CAI details |
| Hanford DFLAW batch-container-stage registry | 14 stages / 9 bounded observations | zero public batch IDs and zero public container IDs; no synthetic join or conversion |
| NNSA work-breakdown registry | 18 objects | site, facility, project, subproject, strategy, capacity, qualification, and GAO baseline remain distinct |

## Strongest findings

- Amtrak's Appendix B historical PIDS registry contains 96 Complete, 18 In Progress, three Pending, two On Hold, and one Cancelled deployment rows. Detroit and Atlanta remain On Hold and Hanford remains Cancelled in the source snapshot.
- The 30 train-access rows contain 18 source-reported Complete, two In Progress, and ten Pending construction states. All 47 access-and-amenity rows are source-reported Complete by FY2019.
- The 197 Appendix B memberships resolve to 178 normalized station keys. Overlap is preserved through membership joins; it is not treated as proof that cohorts share the same underlying asset.
- Montana's Final Proposal files reconcile exactly to 19 subgrantees, 32 project IDs, 68,315 BSL rows, and 183 CAI rows. One project, Triangle Communications Hill 2, has 21 CAI rows and zero BSL rows and therefore remains visible.
- Montana raw classification and technology codes are preserved as raw codes. FTFN does not guess their meaning, and public output excludes individual BSL identifiers and CAI details.
- Montana's project rows total $303,686,528 in proposed BEAD support and $145,190,798 in proposed match. Those are proposal baselines, not executed agreements, disbursements, expenditure, service, adoption, or accepted closeout.
- Hanford's DFLAW path now separates retrieval, TSCR, AP-106, 222-S certification, transfer, LAW receipt, two melters, container handling, export, transport, IDF staging, and disposal. The public source set still provides no stable batch or container IDs.
- Hanford's nine observations retain exact threshold operators, dates, units, stages, and authorities. A nominal seven-metric-ton container specification is never multiplied by a count, and gallons are never converted into glass or waste mass without a source method.
- NNSA's crosswalk separates LANL, PF-4, LAP4, 30 Base, 30 Reliable, 30 Diamond scope, D&D, TDC, WECF, SRS, former MOX, SRPPF, Main Process Building, HFTOC, the W87-1 first production unit, the 30-plus-50 capacity plan, and GAO-23-104661 Recommendation 1.
- The W87-1 first production unit remains one qualification-and-acceptance event. The 30-plus-50 plan remains a capacity object. GAO-23-104661 Recommendation 1 remains a distinct Open independent-baseline object.

## Publication ledger

| Evidence stage | Published | In Review | Boundary |
| --- | ---: | ---: | --- |
| Named-asset registry | 5 | 0 | station and cohort identity do not establish current asset condition, uptime, use, or closeout |
| Project-cohort registry | 5 | 0 | approved proposal assignment and reporting controls do not establish construction, service, adoption, or acceptance |
| Batch-container-stage registry | 5 | 0 | lifecycle nodes and bounded observations do not create batch identity, container identity, mass balance, or yield |
| Site-facility-program registry | 5 | 0 | work-breakdown and capacity objects do not establish completion, readiness, recurring qualified output, or closure |
| Preserved operating-outcome holds | 0 | 9 | exact Phase 57F reopening conditions remain unmet |

## Hold decisions

1. Amtrak PIDS closeout and named physical-asset reliability remain In Review.
2. Louisiana Nextlink and Starlink adoption and retention, plus Montana project-level quarterly and closeout results, remain In Review.
3. The complete Hanford monthly batch and container mass balance remains In Review.
4. NNSA recurring qualified output, final installed and accepted capacity, and the exact GAO-23-104661 enterprise baseline remain In Review.
5. Every Phase 57F hold is preserved through an explicit parent-child lineage; Phase 57G adds no new hold.

## Release contract

- Content reference validation: passed.
- Source health: 715 sources, 494 Manual Review, 221 Probe Ready, zero incomplete endpoint declarations.
- Astro diagnostics: zero errors, warnings, or hints.
- Production build: passed at 2,287 generated pages.
- Phase 57G assertions: passed.
- Release assertions: passed.
- Signals: 516 Published and 125 In Review.
- Current Published-support sources: 495.
- Research collections: 42; research documents: 757.
- Briefings: 38 Published and 7 In Review.
- Public updates: 61.
- Research export records: 693.
- Archive SHA-256: `7B407FBF11A9FF25A62217B28DE0D089A4E08298D9BAF7EFE275B60822A73552`.
- Directive-scope, implementation, closure, and inherited entity-ledger changes: zero.
- Entity evidence ledger: one Closed, twenty-one Partially Closed, and two Open.

## Evidence boundaries

- registry identity and lineage are not operating outcomes;
- historical plan state is not current reliability;
- normalized names are not official device or location identifiers;
- approved proposal, project assignment, funding, and reporting requirements are not agreement execution, construction, service, adoption, retention, disbursement, expenditure, or acceptance;
- raw source codes remain untranslated until an official schema is joined;
- individual BSL identifiers and CAI details remain outside public output;
- lifecycle stage, threshold operator, date, unit, and authority remain explicit and non-interchangeable;
- unknown batch or container identity remains null rather than becoming a synthetic join;
- a nominal equipment specification cannot be multiplied into observed production mass;
- site, facility, project, subproject, strategy, capacity plan, qualification event, and independent recommendation baseline remain distinct;
- operator, regulator, agency, contractor, state, federal, and independent evidence retain distinct attribution;
- no ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference is supported;
- FTFN submitted no agency contact or FOIA request.

## Phase 57H handoff

Build a registry-revision, provenance, and compatible-observation join matrix without waiting for any held outcome. Prioritize an Amtrak historical-to-current station alias and revision table; an official Montana field dictionary and per-project attribute/version diff; a Hanford authority, custody, transition, and observation-compatibility matrix; and an NNSA FY2026-to-FY2027-to-GAO work-breakdown change history. Every change must retain the source version, effective date, join key, field meaning, privacy boundary, and compatibility decision. Preserve all nine Phase 57G holds until their exact reopening conditions are met.

## Deployment receipt

Local content commit `c4410e56f5dd8e569deee100241e683fb3aaf937` maps to exact private runtime commit `aa7a53d4e60b59120a641620fcf40c7a1704ec24`. The 3,223-file runtime archive was saved as Sites version 59 and deployed successfully in `appgdep_6a71116f01f48191b22ec5f4709f8409`. Post-deploy checks confirmed the exact source provenance, runtime archive, successful deployment, and custom owner-only access with one owner, no groups, no editors, and zero external visitors. Visual route QA was not requested for Phase 57G. Public access, Hostinger DNS, custom-domain attachment, package freeze, and the public GitHub remote remain unchanged.
