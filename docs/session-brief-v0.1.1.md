# FTFN v0.1.1 Session Brief

Date: 2026-07-21

Use this brief to restart from the current deployment-candidate and authority-expansion checkpoint.

## Project Identity

FTFN is a future-state intelligence platform planned for `ftfn.io`.

```text
42 is possibility.
59 is urgency.
Civilization is a choice.

The future is not a list of inventions.
It is a stack of dependencies.
```

The product goal is to become a comprehensive analytical resource for frontier systems: what is changing, what it depends on, what could block it, and what authoritative evidence proves or does not prove.

## v0.1.1 Build State

The app is an Astro + TypeScript static site in `app/`.

```text
package version: 0.1.1
site: https://ftfn.io
output mode: static
app root: app
build command: npm run build
build output: app/dist
static pages generated: 182
deployment manifest: deployment/ftfn-v0.1.1-build.json
deployment state: preview candidate, not deployed
```

Required checks from `app/`:

```text
npm.cmd run validate:content
npm.cmd run source:health
npm.cmd run check
npm.cmd run build
```

## Release Delta

Compared with the original `v0.1` deployment manifest, `v0.1.1` adds:

| Measure | v0.1 | v0.1.1 | Change |
| --- | ---: | ---: | ---: |
| Static pages | 142 | 182 | +40 |
| Signals | 14 | 18 | +4 |
| Sources | 66 | 102 | +36 |
| Topics | 17 | 17 | 0 |

The delta is primarily authority-layer expansion, not feature expansion.

- Phase 48 repaired the NOAA ENSO record and added CISA KEV and federal regulatory operating rails.
- Phase 49 added 36 official source records and an 18-item private review batch.
- Phase 50 converted two broad rails into bounded `In Review` signals: a DOE/Grants.gov critical-minerals funding opportunity and a MAG regional projections dataset.

## Current Content State

The app contains:

- 18 signals: 3 `Published`, 14 `In Review`, and 1 `Draft Sample`,
- 102 source records,
- 17 topic records,
- 10 organization records,
- 5 technology records,
- 2 local system profiles,
- 1 briefing in review,
- 10 evidence gap records,
- 2 dependency maps in review.

Published signals:

- NOAA ENSO outlook,
- USGS Mineral Commodity Summaries 2026,
- NIST post-quantum cryptography standards.

The source layer is now broad enough to support v0.2. The signal layer is not yet broad or current enough to support the claim that FTFN is comprehensive.

## Authority Posture

What is credible now:

- source-first records with visible URLs, checked dates, limitations, credibility tiers, and review cadence,
- generated Source Monitor and Source Coverage surfaces,
- all 17 topic pages,
- a small published evidence core,
- explicit publication, correction, and indexing rules,
- local-system profiles that distinguish evidence from unanswered questions,
- a private update queue and signal repair workflow.

What remains incomplete:

- 25 to 35 total signals and 8 to 12 published or publication-ready candidates,
- named Arizona power, water, permitting, workforce, and supplier records,
- named Toronto/Ontario application, permitting, servicing, and completion records,
- a public update/correction log,
- static public data exports,
- desktop and mobile release QA,
- preview deployment and post-deploy checks.

The local profiles remain constraint maps. The MAG projections record improves regional context, but it does not prove chip-corridor workforce, utility, water, permitting, supplier, or facility readiness.

The DOE funding opportunity proves program availability and scope. It does not prove awards, recipient performance, facilities, production, offtake, or supply-chain resilience.

## Deployment Posture

`v0.1.1` is a static preview candidate. It does not authorize deployment, DNS attachment, analytics, automated ingestion, automated publishing, a CMS, database migration, public API, user accounts, or numeric 42/59 scoring.

Before preview deployment:

1. Complete desktop and mobile browser QA.
2. Confirm `robots.txt`, `sitemap.xml`, canonical URLs, and `noindex, follow` boundaries.
3. Confirm the sitemap includes only the three Published signal detail pages.
4. Review the Source Monitor and Source Coverage pages at release widths.
5. Obtain explicit approval before creating a preview deployment.

Before public launch:

1. Verify the preview URL.
2. Recheck every Published source.
3. Resolve any launch-critical route, accessibility, metadata, or indexing issue.
4. Approve the launch note and public positioning.
5. Obtain explicit approval before attaching `ftfn.io` or changing DNS.

## v0.2 Direction

v0.2 is the first authority-loop build. Its target is:

- 25 to 35 signals,
- 8 to 12 Published or publication-ready candidates,
- 110 to 125 curated active sources, with additions driven by evidence gaps rather than volume,
- named record trails for both existing local systems,
- a public update/correction log,
- static JSON exports for public source, topic, and signal metadata,
- repeatable private source rechecks and human publication review.

At the current pace, the content-first v0.2 path is approximately 3 to 5 focused weeks. A narrower preview-ready v0.2 candidate can be assembled in 2 to 3 weeks if local dossier depth is limited to the strongest named records and no new automation is introduced.

## Immediate Next Step

Continue Phase 50 with two to five bounded records from:

- USAspending award records,
- NSF Awards,
- OSTI research records,
- ACC/Phoenix/Toronto local records,
- commodity-specific critical-minerals production or trade evidence.

Prefer records with an ID, date, source owner, stable URL, clear claim boundary, and direct relevance to an open evidence gap.

## Restart Prompt

```text
Continue FTFN from the v0.1.1 checkpoint.

Read:
- docs/session-brief-v0.1.1.md
- docs/roadmap-v0.1.1.md
- deployment/ftfn-v0.1.1-build.json
- docs/roadmap-v0.2.md
- docs/private-update-queue.md
- docs/signal-repair-workflow.md
- docs/v0.2-next-signal-set.md
- docs/master-roadmap.md
- the latest work package in docs/work-packages/

Preserve the FTFN brand, ftfn.io direction, 42/59 framing, evidence-first method, and strict local-claim boundaries.

Current baseline: 102 sources, 18 signals, 17 topics, and 182 static pages. Three signals are Published, fourteen are In Review, and one is a Draft Sample.

Next action: continue Phase 50 with two to five bounded source-item signals or local dossier inputs. Keep new records In Review, update related evidence gaps, and run all content, source-health, Astro, and build checks.
```
