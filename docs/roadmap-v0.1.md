# FTFN v0.1 Roadmap

Date: 2026-07-20

This roadmap updates the next path from the Phase 40 state. It treats v0.1 as a deployable preview candidate, not a full public launch or finished intelligence platform.

## v0.1 Definition

v0.1 should prove that FTFN can be a serious, source-backed public reference surface.

v0.1 includes:

- a static Astro site,
- a small Published signal core,
- public source transparency,
- generated source monitor,
- generated source coverage matrix,
- public topic coverage for all 17 active pillars,
- local system profiles with dossier-style evidence tables,
- Method and publication-policy surfaces,
- sitemap, robots, canonical metadata, and search-index boundaries.

v0.1 does not include:

- automated ingestion,
- automated publishing,
- public launch without approval,
- DNS attachment,
- analytics,
- newsletter capture,
- database migration,
- account system,
- public API,
- numeric 42/59 scoring.

## Current State

Completed through Phase 40:

- 142 static pages generated in the latest verified build,
- 14 signals,
- 66 sources,
- 17 topics,
- 2 local system profiles,
- 10 organizations,
- 5 technologies,
- 10 evidence gaps,
- 2 dependency maps,
- 1 in-review briefing.

The most important recent shift is that the source library is now the authority layer. Future expansion should begin with source coverage, source freshness, and record-level evidence, not with broad prose or feature sprawl.

## Roadmap Principles

1. Content value first.
2. Source records before signal records.
3. Dated evidence before publication.
4. Local conclusions require local records.
5. Generated review surfaces before ingestion.
6. Preview deploy before public launch.
7. No scoring until the evidence graph is mature enough to support it.

## Phase 41: Private Update Queue And Dated Signal Repair

Timeline: 1 to 3 days.

Goal:

Convert the generated source monitor from a public transparency surface into an internal work queue for human-reviewed updates.

Tasks:

- Define a private source-change candidate schema or document.
- Select the first 10 to 15 high-priority probe-ready sources.
- Recheck NOAA CPC ENSO, ACC eDocket, City of Toronto AIC, and Ontario Housing Supply Progress.
- Identify which broad `In Review` records can become dated source-backed signals.
- Repair 2 to 4 records only where the source evidence is specific.
- Keep all repaired records `In Review` until final publication review.

Exit criteria:

- Private update queue exists.
- Review-critical sources are checked or clearly marked as needing manual review.
- At least two broad signal records have a narrower dated repair path.
- Validation and build pass.

## Phase 42: Local Evidence Dossier Deepening

Timeline: 2 to 5 days.

Goal:

Move the two local systems from source inventories toward defensible local intelligence products.

Tasks:

- Select named Arizona utility dockets and transmission/resource-planning records.
- Select Phoenix permit, zoning, planning, or inspection records tied to relevant industrial growth questions.
- Select Arizona water-provider records tied to supply, reuse, service territory, or demand constraints.
- Select Toronto application, permit-status, servicing, completion, and infrastructure records.
- Update evidence gaps to show which named records partially resolve which local questions.

Exit criteria:

- U.S. Southwest Chip Corridor has named power, water, and permitting evidence candidates.
- Ontario Real Estate has named planning, permit, servicing, and completion evidence candidates.
- Local profiles still avoid unsupported service-readiness or housing-delivery conclusions.

## Phase 43: v0.1 Browser QA And Preview Deploy Decision

Timeline: 1 to 2 days.

Goal:

Confirm that the generated site is usable and launch-safe before any preview deployment.

Tasks:

- Run local desktop and mobile QA on launch-critical routes.
- Confirm `robots.txt` and `sitemap.xml` output.
- Confirm Published signal pages are indexable.
- Confirm non-published signal and briefing detail pages use `noindex, follow`.
- Confirm source monitor and source coverage pages render clearly.
- Decide whether to execute a Cloudflare Pages preview deploy.

Exit criteria:

- Build and content checks pass.
- Launch-critical local routes pass.
- Browser QA notes are documented.
- User explicitly approves preview deployment before any deploy command is run.

## Phase 44: Preview Deployment

Timeline: 1 day, only after approval.

Goal:

Deploy v0.1 to a preview URL and verify it without attaching `ftfn.io`.

Tasks:

- Connect the repository to Cloudflare Pages or the selected static host.
- Use project root `app`.
- Use build command `npm run build`.
- Use output directory `dist`.
- Deploy to a preview URL first.
- Run launch-critical route checks on the preview URL.
- Document any broken links, metadata issues, rendering issues, or indexing mistakes.

Exit criteria:

- Preview URL works.
- Launch-critical routes return expected content.
- No DNS change has been made.
- Public launch decision remains separate.

## Phase 45: Public Launch Gate

Timeline: decision gate.

Goal:

Decide whether v0.1 is ready to attach `ftfn.io`.

Required before launch:

- Published sources rechecked.
- Browser QA complete.
- Preview deployment verified.
- Launch note ready.
- Non-published material cannot be mistaken for public approval.
- User explicitly approves DNS/domain attachment.

## 30-Day Direction

After v0.1 preview readiness:

- expand from 3 Published signals toward 8 to 12 only after source review,
- move source-change candidates into a repeatable manual cadence,
- deepen Arizona and Ontario local dossiers with named records,
- add one public update/correction log surface,
- decide whether local systems and dependency maps remain indexed before public launch.

## 60-Day Direction

Once the manual update workflow proves useful:

- add a private ingestion prototype for a few low-risk API/feed sources,
- add exportable source and signal data only if static records stay stable,
- add richer filtering/search if the public corpus justifies it,
- add one more high-value briefing only from reviewed signals,
- avoid numeric 42/59 scoring until relationship quality is strong.

## 90-Day Direction

Move toward a genuinely comprehensive analytical tool:

- 100+ source records across all watch lanes,
- 25 to 40 signal records,
- 8 to 12 publishable signals,
- 3 to 5 local evidence dossiers,
- repeatable update queue,
- public correction/update log,
- clearer data-export path,
- first experiments with qualitative 42/59 labels, not numeric scores.

## Open Decisions

- Whether to run a Cloudflare Pages preview deploy now or after Phase 41.
- Whether local systems and dependency maps should stay indexable prelaunch.
- Whether to create a public update/correction log before attaching `ftfn.io`.
- Whether v0.1 should launch with only three Published signals or wait for a larger launch set.
- Whether the first private update queue should be Markdown, JSON, or a generated internal page.
