# FTFN v0.1 Session Brief

Date: 2026-07-20

Use this brief to restart work without replaying the full project history.

## Project Identity

FTFN is a future-state intelligence platform planned for `ftfn.io`.

Core framing:

```text
42 is possibility.
59 is urgency.
Civilization is a choice.

The future is not a list of inventions.
It is a stack of dependencies.
```

The product goal is to become the most comprehensive analytical resource for frontier systems: what is emerging, what it depends on, what could block it, and where authoritative evidence supports or limits claims.

## Current Build State

The app is an Astro + TypeScript static site in `app/`.

Current baseline:

```text
package version: 0.1.0
site: https://ftfn.io
output mode: static
app root: app
build command: npm run build
build output: app/dist
static pages generated: 144
v0.1 checkpoint pages on 2026-07-20: 142
```

Use `npm.cmd` on Windows if PowerShell blocks `npm.ps1`.

Required checks from `app/`:

```text
npm.cmd run validate:content
npm.cmd run source:health
npm.cmd run check
npm.cmd run build
```

## Current Content State

Seed content now includes:

- 16 signal records,
- 66 source records,
- 17 topic records,
- 2 local system profiles,
- 10 organization records,
- 5 technology records,
- 1 briefing in review,
- 10 evidence gap records,
- 2 dependency maps in review.

Three bounded official-source signals are `Published`:

- NOAA ENSO outlook signal,
- USGS Mineral Commodity Summaries 2026 signal,
- NIST post-quantum cryptography signal.

Twelve signals remain `In Review`; the Joby/eVTOL company-claim sample remains `Draft Sample`. No local system, briefing, dependency map, or company-claim record should be treated as published public intelligence.

## What Has Been Built

FTFN now has:

- homepage and primary navigation,
- signal index and signal detail pages,
- Atlas landing page,
- topic index and detail pages,
- source index and detail pages,
- organization index and detail pages,
- technology index and detail pages,
- local system index and detail pages,
- evidence gap index and detail pages,
- dependency map index and detail pages,
- briefing index and detail pages,
- Method page and publication policy,
- generated source monitor,
- generated source coverage matrix,
- generated `robots.txt`,
- generated `sitemap.xml`,
- canonical metadata for `https://ftfn.io`,
- publication-state handling where non-published signal and briefing detail pages use `noindex, follow`.

## Latest Completed Phase

Latest completed phase:

```text
Phase 48: First Signal Repair Batch
```

Phase 40 completed:

- public topic records for `Cybersecurity` and `Discovery Technologies`,
- source-library expansion from 55 to 66 records,
- Discovery Technologies anchors for USGS 3DEP, NASA Earthdata CMR, USGS Landsat, and NOAA Ocean Exploration,
- Arizona local dossier anchors for ACC integrated resource planning, ACC transmission assessment, Phoenix planning/development, SHAPE PHX, and Phoenix water/sewer,
- Ontario local dossier anchors for Toronto development review and Toronto building permits,
- dossier notes on the U.S. Southwest Chip Corridor and Ontario Real Estate profiles.

Phase 48 completed:

- repaired the published NOAA ENSO signal against the 9 July 2026 CPC discussion,
- added the CISA KEV cybersecurity operating-rail signal,
- added the Federal Register/Regulations.gov regulatory watch-rail signal,
- validated 16 signals and 144 built pages,
- kept the new operating-rail signals in `In Review` until specific source events are selected.

## Authority Posture

The site is a credible v0.1 preview candidate, not yet a fully comprehensive public authority.

Strengths:

- strong source transparency,
- mostly Tier 1 source records,
- generated source monitor,
- generated source coverage matrix,
- visible publication states,
- conservative treatment of local claims,
- reference validation across content records,
- clear launch and publication gates.

Still incomplete:

- only three Published signals,
- no automated ingestion,
- no private source-change queue yet,
- no database or public dataset export,
- no analytics,
- no newsletter capture,
- no deployed preview,
- no final browser QA pass after Phase 40,
- local dossiers still need named dockets, permits, water-provider records, servicing records, completion data, and project-level evidence.

## Deployment Posture

The recommended v0.1 host remains Cloudflare Pages.

Deployment configuration:

```text
Project root: app
Build command: npm run build
Build output directory: dist
Production branch: main or chosen launch branch
Canonical site: https://ftfn.io
```

The v0.1 build manifest is:

```text
deployment/ftfn-v0.1-build.json
```

Do not attach `ftfn.io`, change DNS, add analytics, or publicly launch without explicit approval. The next deployment action should be a preview deployment and route QA.

## v0.2 Authority-Loop Update

After the v0.1 deployment-candidate handoff, Phase 47 added the first v0.2 authority-loop artifacts:

- `docs/private-update-queue.md`
- `docs/signal-repair-workflow.md`
- `docs/v0.2-next-signal-set.md`
- `docs/work-packages/phase-47-private-update-queue-and-signal-repair-workflow.md`

Phase 48 then repaired the NOAA ENSO published record against the 9 July 2026 CPC discussion and added two new `In Review` operating-rail signals:

- `signal-cisa-kev-catalog-operational-remediation-clock`
- `signal-federal-register-regulations-gov-regulatory-watch-rail`
- `docs/work-packages/phase-48-first-signal-repair-batch.md`

The next content implementation should select a named local dossier record from ACC eDocket, Toronto AIC, Phoenix permitting/water, or Ontario housing evidence before writing the next local `In Review` signal.

## Next Phase

Next roadmap phase:

```text
Local Dossier Selection And Second Signal Repair Batch
```

Expected focus:

- work through the private update queue,
- apply the signal repair workflow,
- select one ACC eDocket, Toronto AIC, Phoenix permitting/water, or Ontario housing local dossier item,
- create one local `In Review` signal from a named record,
- select one additional dated source repair for CHIPS, FAA AAM, NHTSA AV, StatCan/CMHC, or AI-grid,
- run final desktop/mobile browser QA before preview deployment.

## Restart Prompt

```text
Continue FTFN from the v0.1 state.

Read:
- docs/session-brief-v0.1.md
- docs/roadmap-v0.1.md
- deployment/ftfn-v0.1-build.json
- docs/session-brief.md
- docs/master-roadmap.md
- docs/launch-package.md
- docs/source-monitoring-plan.md
- docs/authoritative-live-source-plan.md

Preserve:
- FTFN public brand,
- ftfn.io domain direction,
- 42/59 framing,
- "Civilization is a choice,"
- "The future is not a list of inventions. It is a stack of dependencies."

Current completed phase:
Phase 48: First Signal Repair Batch.

Next phase:
Local Dossier Selection And Second Signal Repair Batch after Phase 48.

Confirm current build status, then proceed from the v0.1 roadmap without starting public deployment unless explicitly approved.
```
