# FTFN v0.2 Roadmap

Date: 2026-07-22

v0.2 is the first authority-loop build: a release that proves FTFN can maintain a current, source-led analytical resource through repeatable human review.

Use these execution artifacts with this roadmap:

- `docs/private-update-queue.md`
- `docs/signal-repair-workflow.md`
- `docs/v0.2-next-signal-set.md`
- `docs/signal-scale-scenarios.md`
- `docs/source-broadening-and-intake-plan.md`
- the latest work package in `docs/work-packages/`

## North Star

```text
Authoritative, current, source-led, and analytically useful before it is automated.
```

The value of v0.2 is not a larger site by itself. The value is that a reader can see the strongest evidence, understand its limits, follow dependency and local-constraint trails, and tell how recently the underlying records were checked.

## Starting Baseline

The `v0.1.1` checkpoint provides:

| Measure | Current State |
| --- | ---: |
| Static pages | 182 |
| Active sources | 102 |
| Signals | 18 |
| Published signals | 3 |
| In Review signals | 14 |
| Draft Sample signals | 1 |
| Topics | 17 |
| Local systems | 2 |
| Evidence gaps | 10 |

Current `0.2.0-dev` state after Phase 51A:

| Measure | Current Development State |
| --- | ---: |
| Static pages | 193 |
| Active sources | 105 |
| Signals | 25 |
| Published signals | 3 |
| In Review signals | 21 |
| Draft Sample signals | 1 |
| Named local inputs selected in Phases 50-51A | 5 |

Existing operating assets:

- generated Source Monitor and Source Coverage pages,
- private source-update queue,
- documented signal repair workflow,
- 18-item Phase 49 promoted-source queue batch,
- publication policy and Method page,
- two local-system constraint maps,
- two qualitative dependency maps,
- a schema-backed public update log,
- versioned static source, topic, and Published-signal exports,
- robots, sitemap, canonical, and indexing boundaries.

The source-count floor for v0.2 has been reached. The bottleneck is now bounded evidence conversion, dated signal depth, named local records, and publication review.

## v0.2 Product Promise

By v0.2, a reader should be able to answer:

- What changed, when, and according to which primary source?
- Which frontier systems or local constraints does that change affect?
- What does the evidence prove, and what remains uncertain?
- Which sources are current, due for review, manual-only, or blocked?
- Which records are Published, publication-ready, In Review, stale, or archived?
- What named records support Arizona and Ontario local-system analysis?
- How can the public source, topic, and signal metadata be reused?

## Release Targets

| Area | v0.2 Target | Current | Remaining |
| --- | ---: | ---: | ---: |
| Total signals | 25-35 | 22 | +3 to +13 |
| Published plus publication-ready | 8-12 | 3 | +5 to +9 reviewed candidates |
| Active sources | 110-125 | 102 | +8 to +23 targeted additions |
| Private source candidates | 150-250 | not yet scaffolded | create registry and triage first batch |
| Named local evidence trails | 2 complete dossier trails | MAG regional dataset plus Toronto application selected | power, water, permitting, workforce, servicing, completion records |
| Public trust surfaces | update log plus Method links | Method only | add update/correction log |
| Public data products | 3 static exports | none | sources, topics, signals JSON |

These are quality-constrained targets. A source or signal counts only when it has a clear role, stable identity, evidence boundary, and review path.

## Scope

v0.2 includes:

- a verified `v0.1.1` static base,
- repeatable private source rechecks,
- dated repairs of broad signal frames,
- 25 to 35 total signals,
- 8 to 12 Published or publication-ready candidates,
- named local evidence trails for both existing local systems,
- targeted source expansion driven by evidence gaps,
- private broad-source candidate registry,
- public update/correction log,
- static JSON exports for public source, topic, and signal metadata,
- improved Source Monitor and Source Coverage usability,
- release browser QA and preview verification.

v0.2 does not include:

- automated publishing,
- unreviewed AI-generated claims,
- numeric 42/59 scoring,
- accounts or paid features,
- full CMS or database migration,
- a public API with uptime guarantees,
- strong local readiness claims from general or regional evidence,
- public launch or DNS changes without explicit approval.

## Build Plan

### Phase 50B: Bounded Evidence Conversion — Complete

Timeline: 4 to 6 focused days.

Goal: move the strongest Phase 49 queue rails into source-specific content.

Deliverables:

- add 4 to 6 bounded `In Review` signals,
- select at least one actual award, contract, funded project, or agency decision,
- select one NSF Awards or OSTI research record,
- select one commodity-specific production, reserve, processing, or trade record,
- select one named ACC, Phoenix, Toronto, or Ontario local record,
- repair one broad CHIPS, FAA AAM, NHTSA AV, StatCan/CMHC, or AI-grid frame,
- update linked evidence gaps and local profiles.

Preferred source order:

1. USAspending and agency award records.
2. ACC eDocket, Phoenix permitting/water, Toronto AIC, and Ontario housing records.
3. NSF Awards and OSTI.
4. USGS, Census trade, and other commodity-specific critical-minerals records.
5. FAA, NHTSA, NERC, EIA, and CHIPS program records.

Exit criteria:

- every new signal has a source item ID or equivalent stable record identity,
- every new claim is dated and bounded,
- funding opportunities are not presented as awards,
- regional data is not presented as facility readiness,
- validation, source health, Astro checks, and build pass.

Completed result:

- six bounded additions across the two Phase 50 batches,
- one Grants.gov/DOE funding opportunity,
- one named MAG regional dataset,
- one USAspending award trail,
- one NSF research-funding award,
- one commodity-specific USGS gallium record,
- one named Toronto planning application,
- 22 total signals and 186 built pages,
- all additions held `In Review` with explicit evidence boundaries.

### Phase 51: Local Evidence Dossier Deepening

Timeline: 5 to 8 focused days.

Goal: make local-system analysis a distinctive, defensible product layer.

U.S. Southwest Chip Corridor deliverables:

- [x] one named utility docket or resource-planning filing,
- [x] one water-provider, service-area, allocation, conservation, or infrastructure record,
- one Phoenix-area permit, zoning, planning, or inspection record,
- one workforce or training pipeline record,
- one supplier, construction-labor, facility, or industrial-development record.

Ontario Real Estate deliverables:

- [x] one named Toronto application or development record,
- one permit-status or building-permit record,
- [x] one servicing or infrastructure-capacity record,
- one starts, completions, or units-under-construction record,
- one financing, labor, or delivery-constraint record.

Phase 51A status:

- selected SRP's 2025 ISP Actions Progress Report as a named utility implementation record,
- selected Phoenix Water Services' April 2026 council update as a provider-level water record,
- selected Toronto's June 2026 decision report for application 24 254930 as a staff-recommendation and servicing-review record,
- added three `In Review` signals and strengthened `gap-001`, `gap-002`, `gap-004`, and `gap-005`,
- reached 105 sources, 25 signals, and 193 built pages without claiming site-level service or completed outcomes.

Exit criteria:

- each local profile has named record trails across at least four constraint types,
- at least four evidence gaps move to a stronger named-record posture,
- evidence limits remain explicit,
- no profile claims project delivery or service readiness without project-level proof.

### Phase 52: Trust Surface And Reusable Data

Timeline: 4 to 6 focused days.

Goal: make FTFN visibly maintainable and useful beyond individual articles.

Deliverables:

- [x] add a public update/correction log,
- [x] link it from Method and the global footer,
- [x] define correction, source refresh, signal repair, publication promotion, and archive entries,
- [x] add static JSON exports for public sources, topics, and Published signals,
- [x] document export fields and update cadence,
- improve Source Monitor grouping around watch lane, review state, and next action,
- improve Source Coverage summaries for strong and weak lanes,
- create the private 150-to-250 source-candidate registry without promoting all candidates publicly.

Phase 52A pre-Supabase contract status:

- the public trust and data contract is implemented on `codex/pre-supabase-contracts`,
- update-log record references now pass the content validation gate,
- the public/private export boundary is explicit and versioned,
- Phase 51 research is no longer treated as a backend activation dependency,
- remaining Phase 52 monitor, coverage, and registry work can be implemented through the private backend slice.

Exit criteria:

- readers can see how the resource changes,
- public metadata can be downloaded or inspected,
- private candidates remain separate from active source records,
- no export or monitor action publishes claims automatically.

### Phase 53: Publication Candidate Review

Timeline: 3 to 5 focused days.

Goal: produce a balanced set of 8 to 12 Published or publication-ready records.

Candidate mix:

- 3 to 4 official periodic updates,
- 2 to 3 regulatory, standards, or safety actions,
- 1 to 2 award or program milestones,
- 1 to 2 named local conversion records,
- 1 research or discovery-data record.

Review gates:

- source currency,
- claim specificity,
- citation integrity,
- visible evidence limits,
- local-record sufficiency,
- title and summary accuracy,
- publication and index status,
- correction/update path.

Exit criteria:

- 8 to 12 records are Published or documented as publication-ready,
- no broad source frame is promoted as a current event,
- stale or weak records move to `Needs Update`, `Archived`, or remain clearly in review.

### Phase 54: v0.2 Release QA And Preview Gate

Timeline: 2 to 4 focused days.

Goal: verify the full authority-loop build before wider sharing.

Deliverables:

- run all content, source health, Astro, and production build checks,
- run desktop and mobile QA on core reader journeys,
- enlarge compact mobile-header touch targets during the v0.2 polish pass,
- verify robots, sitemap, canonical, and noindex boundaries,
- verify update log and static exports,
- verify launch-critical routes on a preview deployment if approved,
- prepare a concise v0.2 launch note and limitations statement.

Exit criteria:

- build and browser QA pass,
- preview route checks pass or deployment is explicitly deferred,
- every Published record has a current source check,
- user explicitly approves any public launch or DNS action.

## Timeline

Recommended active schedule:

| Window | Focus | Expected Result |
| --- | --- | --- |
| Completed | Phase 50B | six bounded additions; award, research, commodity, and local selections |
| Week 2 | Phase 51 | named Arizona and Ontario evidence trails; 25+ total signals |
| Week 3 | Phase 52 | update log, static exports, source candidate registry |
| Week 4 | Phase 53 | 8-12 Published or publication-ready candidates |
| Week 5 | Phase 54 and buffer | browser QA, preview verification, repairs, release decision |

Expected remaining duration after Phase 50B: about 3 to 4 focused weeks.

A 2-to-3-week narrower candidate is possible by holding the active source library near 110, limiting local work to the strongest named records, and deferring nonessential Source Monitor UX refinements. The publication and evidence gates should not be shortened.

## Source Update Operating Loop

The self-updating goal should be implemented as a controlled loop:

```text
Source registry
-> scheduled or manual recheck
-> private update candidate
-> bounded evidence selection
-> signal repair or new draft
-> human publication review
-> public update log
```

In v0.2, only source discovery and change detection may become semi-automated. Claim writing, evidence interpretation, local conclusions, and publication remain human-reviewed.

## Success Criteria

v0.2 is successful when:

- the library has 25 to 35 useful signals rather than filler,
- 8 to 12 signals are Published or publication-ready,
- both local systems have named, multi-constraint evidence trails,
- source updates have a repeatable private workflow,
- the public can see corrections and material updates,
- core metadata is available as static exports,
- Source Monitor and Source Coverage make gaps and freshness legible,
- release QA is repeatable,
- no automated process publishes claims without review.

## Immediate Next Step

Continue Phase 51B while Supabase access is pending. Select one project- or customer-specific Arizona power service record, one industrial water service/demand/reuse record, one Phoenix permit or zoning record, Toronto Council/by-law or building-permit follow-through, and one workforce or delivery-capacity record for each dossier. Keep Git as the public publishing source of truth and keep all new records `In Review` until Phase 53.
