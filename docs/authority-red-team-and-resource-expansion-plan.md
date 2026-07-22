# Authority Red-Team and Resource Expansion Plan

Date: 2026-07-09

Purpose:

Run a skeptical authority review of the current FTFN site and define the next expansion path if the site's primary value is content: source depth, evidence currency, topic completeness, and self-updating reference surfaces.

This is not a launch approval. It is a plan for turning a credible static MVP into a comprehensive resource.

Phase 39, Phase 40, Phase 49, and Phase 50 update:

The source-count and self-updating findings below are a pre-Phase 39 audit snapshot. Phase 39 responded by expanding the source library from 25 to 55 records, adding watch-lane and live-access source metadata, adding `/atlas/source-coverage/`, expanding `/atlas/source-monitor/` with health and probe-readiness states, adding `npm run source:health`, and turning local system evidence sections into dossier-style tables. Phase 40 added `Cybersecurity` and `Discovery Technologies`, expanded the source library to 66 records, and added stronger Discovery Technologies and local dossier source anchors. Phase 49 expanded the source library to 102 records. Phase 50 started converting promoted source rails into bounded `In Review` records with a DOE/Grants.gov funding signal and a selected MAG local dataset signal. The remaining red-team concerns are still limited named local records, broad `In Review` records that need dated repair, no live polling, no public update log, and no automated publishing.

## Red-Team Standard

The question is not whether the site is well built. The question is whether an unfamiliar reader would treat it as authoritative.

For FTFN, "authoritative" means the site can answer:

- What happened or changed?
- Who is the original source?
- How current is the source?
- What does the evidence prove?
- What does it not prove?
- Which dependencies and constraints matter next?
- Where should a reader go for the primary record?
- What is missing before stronger conclusions are allowed?

The current site is strongest when it behaves like an evidence map. It is weakest when the ambition reads larger than the content library can yet support.

## Current Scorecard

Measured from the current workspace on 2026-07-09:

| Area | Current State | Authority Read |
| --- | --- | --- |
| Content validation | `npm.cmd run validate:content` passes | The reference graph is healthy. |
| Sources | 25 source records | Strong starting base, but still narrow for a primary resource. |
| Source tiering | 24 Tier 1, 1 Tier 3 | Source quality is a strength. |
| Source freshness | 3 Review due, 1 Watch soon, 21 Current | Freshness needs action before new claims. |
| Signals | 14 total | Too small for comprehensive coverage. |
| Published signals | 3 | Credible but very narrow public core. |
| In Review signals | 10 | Useful research shelf, not public authority. |
| Draft samples | 1 | Should not be prominent after launch. |
| Topics | 15 topic records out of 17 active pillars | `Cybersecurity` and `Discovery Technologies` are missing as public topic pages. |
| Local systems | 2 profiles | Good concept tests, not complete local intelligence products. |
| Briefings | 1 In Review briefing | Not yet a published editorial cadence. |
| Evidence gaps | 10 gaps, 6 still Open | The site is honest about gaps, but many still block stronger claims. |
| Dependency maps | 2 In Review maps | Useful for the thesis, but not yet a mature roadmap layer. |
| Self-updating | Build-generated source monitor only | Good first step; not yet automated source checking. |
| Deployment | Not deployed | Still a prelaunch product. |

## Bottom-Line Verdict

FTFN is currently a credible prelaunch evidence scaffold. It is not yet an authoritative comprehensive resource.

The strongest parts are:

- clear editorial method,
- strong source credibility tiering,
- visible publication states,
- source checked dates,
- source monitor and review queue,
- conservative treatment of local claims,
- no automated publishing or false precision.

The weakest parts are:

- only three Published signals,
- multiple broad In Review records that are source-backed frames rather than dated developments,
- unresolved local-system evidence gaps,
- no public update/correction log,
- no private source-change review queue,
- no live URL/content-change report,
- no data export or public dataset layer,
- no deployed preview and no final browser QA.

Phase 40 status note:

- The public topic-page gap is now closed.
- Watch-lane metadata and endpoint metadata now exist on source records.
- The source health script checks endpoint metadata readiness, but not live URL availability or content changes.
- Local dossiers now have stronger process anchors, but still lack named dockets, permits, provider records, servicing documents, completion records, and facility-level evidence.

The next roadmap should avoid a big technical detour. The site becomes more valuable by deepening the content library and making the evidence layer more current, complete, and reusable.

## Immediate Authority Findings

### 1. Published Surface Is Too Narrow

Severity: Critical for authority perception.

Current state:

- 3 Published signals anchor the site.
- 10 signals remain In Review.
- 1 company-claim eVTOL sample remains Draft Sample.
- No briefings are Published.
- No local system profile is a complete local intelligence product.

Risk:

A reader who lands on the site may see a serious framework but only a thin public evidence base. The product can look like a promising system rather than a primary resource.

Recommended fix:

- Keep the public launch narrow, but expand toward 8 to 12 Published signals only after source review.
- Prioritize dated official updates, filings, datasets, standards, and regulator actions.
- Do not publish broad source-anchor records unless the page clearly says it is a reference frame.

### 2. Source Freshness Already Requires Review

Severity: Critical before new claims.

Current generated freshness queue:

| Source | Current State | Why It Matters |
| --- | --- | --- |
| NOAA CPC ENSO Diagnostic Discussion | Review due | The official page still showed the 11 June 2026 discussion during the 2026-07-09 spot check and listed 9 July 2026 as the next scheduled discussion. |
| City of Toronto Application Information Centre | Review due | The page says active application data is refreshed daily, so a 2026-06-02 check is too old for fresh planning claims. |
| Arizona Corporation Commission eDocket | Review due | Ongoing utility/regulatory docket evidence can change quickly and must be checked before facility or utility claims. |
| Ontario Housing Supply Progress Tracker | Watch soon | Monthly source; near the review boundary. |

Risk:

Source freshness labels are only useful if the editorial team acts on them. If Review due sources support new records without rechecking, the source monitor becomes a decorative trust surface rather than a working control.

Recommended fix:

- Recheck all Review due sources before adding or publishing related claims.
- Update `last_checked_date` only after manual inspection.
- Add a future source-check report that verifies URL status and produces a review queue without changing records automatically.

### 3. Broad In Review Signals Are Not Yet News

Severity: High.

Current examples:

- CHIPS signal is a useful NIST program frame, but not a specific award, facility, rule, or milestone.
- FAA AAM signal is a useful certification and integration frame, but not a specific aircraft, rule, vertiport, or operational approval.
- NHTSA automated vehicle signal is a useful safety-policy frame, but not a specific reporting update, crash dataset, exemption, investigation, recall, or rule.
- NASA Artemis and USDA plant genomics records are official-source frames, not dated developments.

Risk:

If broad source-anchor records are treated like current intelligence, the site looks analytical but not current. A comprehensive resource needs both evergreen reference frames and dated signal records, with the distinction visible.

Recommended fix:

- Add a `record_role` or use clear copy to distinguish `Reference Frame`, `Signal`, `Briefing`, and `Evidence Dossier`.
- Repair broad In Review records into narrower dated records where official source evidence exists.
- Keep broad pages in the Atlas or topic reference layer instead of treating them as primary signal output.

### 4. Missing Topic Pages Break Topic Authority

Severity: High.

Current missing public topic records:

- `Cybersecurity`
- `Discovery Technologies`

Risk:

Both appear in the taxonomy and current content relationships. Without public topic pages, the Atlas looks incomplete and some active tags do not have a reference home.

Recommended fix:

- Add both topic records.
- Give each topic at least:
  - a clear summary,
  - framework layers,
  - primary constraints,
  - featured sources,
  - watch questions,
  - near-term source acquisition targets.

### 5. Local Systems Are Not Yet Evidence Dossiers

Severity: High.

Current local systems:

- Ontario Real Estate
- U.S. Southwest Chip Corridor

Current value:

They are useful constraint maps. They show how global signals meet local systems.

Current limit:

They do not yet have enough specific local evidence to support stronger conclusions about readiness, capacity, timing, project feasibility, or outcomes.

Missing evidence categories:

- utility filings,
- interconnection records,
- tariff and rate-case materials,
- municipal servicing capacity,
- planning applications and permit timelines,
- project-level financing,
- provider-level water records,
- facility-level water and power demand,
- workforce programs tied to real facilities,
- supplier-network evidence,
- local climate and hazard records.

Recommended fix:

- Convert each local system into an evidence dossier with a source inventory, evidence table, known unknowns, and next records needed.
- Keep local conclusions cautious until specific records support them.

### 6. Public Trust Layer Is Too Thin

Severity: High for public credibility.

Current strengths:

- About page explains the project.
- Method page explains source treatment and publication policy.
- Source pages show limitations and checked dates.

Missing trust surfaces:

- named editorial responsibility or contact path,
- public correction/update log,
- per-record update history,
- source review history,
- clear distinction between "generated at build time" and "actively monitored",
- launch status note if the site remains prelaunch.

Recommended fix:

- Add a compact public update log before broad launch.
- Add a contact/corrections path on Method or About.
- Add "Last materially updated" to records later if update history becomes important.

### 7. Self-Updating Is Directionally Right, Not Yet Real

Severity: Medium to high.

Current self-updating capability:

- `/atlas/source-monitor/` updates when the static site rebuilds.
- It uses `last_checked_date`, update cadence, priority, and credibility fields.

Current limit:

- It does not fetch sources.
- It does not check URL health.
- It does not detect source changes.
- It does not write review reports.
- It does not create drafts.
- It does not publish.

Recommended staged path:

1. Keep the generated source monitor.
2. Add explicit `review_cadence_days`, `watch_lanes`, and optional `rss_url` or `api_url` fields.
3. Add a local source health report script that checks URL status and page metadata but does not modify content.
4. Add feed/API checks into a private review queue where available.
5. Add draft signal suggestions only after source health and review cadence are reliable.
6. Preserve human review before any public update.

### 8. Source Library Needs Watch-Lane Depth

Severity: High for comprehensiveness.

The current 25 sources are a strong beginning, but a primary resource needs repeatable coverage across watch lanes.

Priority additions:

| Watch Lane | Needed Source Types |
| --- | --- |
| Power Watch | NERC reliability reports, FERC eLibrary and interconnection materials, DOE grid offices, RTO/ISO planning and queue data, utility integrated resource plans. |
| Compute and Chips Watch | CHIPS Program Office award pages, company filings, state/local permit records, utility and water evidence for facilities, advanced packaging program sources. |
| Water Watch | provider-level water plans, assured/adequate water records, conservation and reuse plans, drought and basin management records, facility water permits. |
| Mobility Certification Watch | FAA certification pages, Federal Register rules, AAM implementation updates, airport/vertiport planning records, NHTSA standing general order and safety records. |
| Security and Standards Watch | NIST PQC, CISA, OMB, NSA/CNSS, procurement and sector migration guidance, critical infrastructure implementation sources. |
| Climate Conversion Watch | NOAA CPC, NIDIS drought, state climate offices, water managers, grid operator seasonal preparedness, agricultural extension sources. |
| Agriculture and Bioeconomy Watch | USDA NIFA, APHIS, ERS, NASS, public genomics data, climate-resilience trial sources, regulatory status records. |
| AI for Science and Materials Watch | DOE Office of Science, national labs, NIST Materials Genome Initiative, peer-reviewed or formal technical reports tied to validation and manufacturing conversion. |
| Space Infrastructure Watch | NASA program pages, FAA commercial space licensing, FCC satellite licensing where relevant, launch-site and mission-specific official records. |
| Finance, Insurance, and Workforce Watch | BLS, Statistics Canada, CMHC, banking and insurance regulators, project-finance filings, workforce board and training-program sources. |
| Local Systems Watch | municipal planning portals, building permit dashboards, utility filings, water providers, economic development records, local infrastructure plans. |

### 9. Discovery Is Not Yet Resource-Grade

Severity: Medium.

Current site has:

- Atlas routes,
- topic/source/signal pages,
- light signal filtering,
- source monitor,
- dependency maps.

Missing:

- global search,
- watch-lane filters,
- source freshness filters,
- evidence-gap filters by local system and priority,
- public export/download for source and signal records,
- topic-level "what changed recently" modules,
- "start here" pages for new readers per watch lane.

Recommended fix:

- Add watch-lane metadata before adding complex UX.
- Then add simple static watch-lane pages generated from source and signal metadata.
- Add lightweight JSON/CSV export later once field quality is stable.

## Content Library Update Plan

### Update Sources First

Goal:

Make the source library the product's authority engine.

Near-term actions:

- Recheck all Review due and Watch soon sources.
- Add 12 to 18 high-authority source records across the priority watch lanes.
- Add missing local sources that resolve or advance high-priority evidence gaps.
- Add `review_cadence_days` if inferred cadence keeps producing blunt results.
- Add `watch_lanes` as a first-class schema field before expanding many signals.

Acceptance criteria:

- 0 Review due sources used by Published records.
- All high-priority watch lanes have at least 3 Tier 1 or Tier 2 source anchors.
- Source records state known limitations in a way that prevents overclaiming.

### Update Topics Second

Goal:

Make every active topic pillar a real public reference page.

Near-term actions:

- Add `Cybersecurity`.
- Add `Discovery Technologies`.
- Expand topic pages to show:
  - featured source coverage,
  - active signals,
  - evidence gaps,
  - watch lanes,
  - "what would make this topic more authoritative."

Acceptance criteria:

- 17 of 17 taxonomy pillars have public topic records.
- Every topic has at least one featured source and clear watch questions.
- No active tag points to a missing topic page.

### Update Signals Third

Goal:

Replace broad source-anchor signals with dated, source-specific developments.

Near-term actions:

- Repair CHIPS into a specific award, program update, facility, or rule record.
- Repair FAA AAM into a specific certification, implementation, airport, vertiport, or rule record.
- Repair NHTSA into a specific safety/reporting/exemption/investigation/rule record.
- Repair NASA into a specific mission, infrastructure, delay, contract, or launch/license record.
- Repair USDA into a specific grant, dataset, regulatory action, or field-trial evidence record.
- Keep Joby/eVTOL as Draft Sample until supported by FAA, customer, airport, local, or independent evidence.

Acceptance criteria:

- New or repaired signals have a specific date, source, event, and evidence boundary.
- No local implication is stronger than the local source trail.
- Published promotions happen only through the publication gate.

### Update Local Systems Fourth

Goal:

Turn local system pages from constraint maps into evidence dossiers.

Near-term actions:

- Build an Arizona power dossier.
- Build an Arizona water dossier.
- Build an Ontario housing conversion dossier.
- Add a table of specific records per dossier:
  - source,
  - jurisdiction,
  - record type,
  - date,
  - what it supports,
  - what it does not support,
  - related evidence gap,
  - next action.

Acceptance criteria:

- Each local system has at least 8 to 12 local or regional source records before stronger conclusions.
- High-priority evidence gaps move from Open or Source Added toward Signal Needed, Local Profile Update Needed, or Resolved only when specific records justify it.

### Update Briefings Fifth

Goal:

Make briefings the visible synthesis layer only after enough signals are publishable.

Near-term actions:

- Keep `Stack Watch 001` In Review until more underlying signals are Published.
- Create a briefing readiness checklist tied to Published signal count and source freshness.
- Add a recurring briefing format only after watch-lane source coverage is stable.

Acceptance criteria:

- A Published briefing cites only Published or clearly bounded source-backed records.
- Every briefing includes "what this does not prove."
- Briefings update evidence gaps instead of hiding uncertainty.

## Comprehensive Resource Roadmap

Status after Phase 40:

- Phase 39 completed the source metadata, first 30 source records, generated source health surface, and coverage matrix.
- Phase 40 completed the missing topic records and added Discovery Technologies plus local dossier source anchors.
- The next roadmap work should combine the private update queue, named local-record selection, and dated signal repair.

### Phase 39: Authority Foundation Sprint

Timeline: 1 to 2 days.

Goal:

Make the existing site harder to challenge before adding major volume.

Tasks:

- Recheck NOAA CPC ENSO, ACC eDocket, City of Toronto AIC, and Ontario Housing Supply Progress.
- Add `Cybersecurity` and `Discovery Technologies` topic records.
- Add a public update/correction log scaffold or documented plan.
- Decide whether In Review local systems and dependency maps should remain indexed or move to clearer research/noindex treatment before launch.
- Add initial watch-lane metadata plan to the content model.
- Add a source health report design, even if automation waits.

Exit criteria:

- 0 Review due sources in the source monitor after manual recheck, or clear notes explaining why a source remains due.
- 17 of 17 public topic pillars exist.
- The next source batch is selected by watch-lane authority, not by category filling.

### Phase 40: Watch-Lane Source Expansion

Timeline: 1 week.

Goal:

Build the source library that makes FTFN a resource instead of a small publication.

Tasks:

- Add 12 to 18 high-authority sources.
- Prioritize Power, Compute and Chips, Water, Security and Standards, Mobility Certification, and Local Systems.
- Add source records before signal records.
- Update evidence gaps when new sources partially resolve missing evidence.

Exit criteria:

- Each priority watch lane has at least 3 source anchors.
- Every new source has known limitations and a review cadence.
- Content validation passes.

### Phase 41: Signal Canon Repair

Timeline: 1 week.

Goal:

Convert broad In Review records into dated, source-specific signal records.

Tasks:

- Repair 5 to 7 broad In Review signals.
- Create only 2 to 4 new signals if official source evidence is specific.
- Promote no records automatically.
- Run final publication review only after the batch is stable.

Exit criteria:

- 20 to 25 total signals.
- 8 to 12 potential Published candidates after final review.
- No Draft Sample company claim appears as public evidence.

### Phase 42: Local Evidence Dossiers

Timeline: 1 week.

Goal:

Make local systems defensible enough to become FTFN's distinctive analytical edge.

Tasks:

- Build local evidence tables for Arizona power, Arizona water, and Ontario housing conversion.
- Add specific dockets, provider records, municipal records, permits, completion sources, and workforce/supplier sources where available.
- Update local system profiles only where evidence supports narrower claims.

Exit criteria:

- High-priority local evidence gaps have specific record trails.
- Local systems show what is supported, unsupported, and next to check.
- No local readiness conclusion appears without local evidence.

### Phase 43: Resource UX and Self-Updating Reports

Timeline: 1 to 2 weeks.

Goal:

Make the resource easier to use and maintain.

Tasks:

- Add watch-lane pages or filters.
- Add source freshness filters.
- Add simple source health reporting.
- Add update log surface.
- Consider static JSON/CSV exports for sources and signals.
- Keep all automated checks separate from publication.

Exit criteria:

- A reader can start from a watch lane and find sources, signals, evidence gaps, and local systems.
- A maintainer can run a source report and know what to review.
- The site remains static-first and human-reviewed.

## 30/60/90 Day Authority Targets

### 30 Days

Target:

FTFN becomes a credible niche resource with a visible evidence spine.

Targets:

- 40 to 60 source records.
- 20 to 30 signal records.
- 8 to 12 Published signals.
- 17 of 17 topic pages.
- 3 local evidence dossiers.
- 1 public update/correction log.
- 0 stale sources supporting Published records.

### 60 Days

Target:

FTFN becomes a repeatable editorial and research system.

Targets:

- Source health report script.
- Watch-lane pages or filters.
- 2 to 3 Published briefings or explainers.
- First source or signal data export.
- Clear update cadence for major watch lanes.
- Preview deployment and launch QA completed if public launch is still desired.

### 90 Days

Target:

FTFN begins acting like a self-updating resource while preserving human review.

Targets:

- Scheduled static builds or scheduled source reports.
- RSS/API checks for selected sources where available.
- Private draft queue for source changes.
- Public change log or per-record update history.
- Stronger data layer decision: static exports, CMS, or database only if manual content has proven the needed fields.

## Definition of "Authoritative Enough"

FTFN is authoritative enough for broader public sharing when:

- all Published records cite current checked sources,
- no Review due source supports a new public claim,
- every active topic pillar has a public page,
- every watch lane has a source inventory,
- at least the first five watch lanes have dated signal coverage,
- local systems show evidence tables rather than only prose caveats,
- source limitations are visible,
- correction/update path is visible,
- non-published material cannot be mistaken for public approval,
- build, validation, sitemap, robots, and browser QA pass,
- the public launch note honestly states what is built and what is not.

## Recommended Next Step

Run Phase 41: Private Update Queue and Dated Signal Repair.

Do not launch yet. Do not add ingestion yet. Do not add numeric 42/59 scoring yet.

The highest-value next work is:

1. Recheck the review-due and claim-critical sources.
2. Select high-priority probe-ready sources for a private source-change queue.
3. Add named local records for Arizona power/water/permitting and Ontario development/servicing/completions.
4. Repair broad In Review records into dated source-backed signals.
5. Keep local-system conclusions cautious until record-level evidence exists.

That path moves FTFN toward being the primary resource for these topics without pretending automation or volume equals authority.
