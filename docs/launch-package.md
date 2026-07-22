# Launch Package

This document defines the first static launch package for FTFN on `ftfn.io`.

It is a readiness plan, not a deployment record. Do not treat this document as evidence that the site has been deployed.

## Launch Posture

FTFN is ready for a small static launch when the following are true:

- the app builds from `app/`,
- the first Published signal set remains source-current,
- non-published records are clearly labeled,
- non-published signal and briefing details are not invited into search indexes,
- source transparency and Method pages are visible,
- `robots.txt` and `sitemap.xml` generate correctly,
- launch-critical routes pass local and post-deploy checks.

The first launch should remain deliberately narrow. FTFN is introducing the method, the thesis, and a small evidence-backed core, not claiming that the whole intelligence platform is complete.

## Static Hosting Decision

Decision:

Use Cloudflare Pages as the primary static hosting path for `ftfn.io`, unless an existing domain or account setup makes another static host clearly simpler.

Why this path fits FTFN:

- FTFN is currently a static Astro site.
- The app has no server runtime, accounts, database, ingestion, or API requirement.
- A static host keeps the first launch reversible.
- Cloudflare Pages can connect to a repository, run a build command, serve a static output directory, and attach the `ftfn.io` domain.
- Cloudflare is also a natural fit if DNS for `ftfn.io` is managed there later.

Reference docs:

- Astro Cloudflare deployment guide: https://docs.astro.build/en/guides/deploy/cloudflare/
- Cloudflare Pages Astro guide: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/

Recommended deploy configuration:

```text
Project root: app
Build command: npm run build
Build output directory: dist
Production branch: main or the chosen launch branch
Node version: use the platform default unless build output says otherwise
```

The current v0.2 local release manifest is:

```text
deployment/ftfn-v0.2-build.json
```

The original `deployment/ftfn-v0.1-build.json` remains the historical Phase 40 checkpoint, and `deployment/ftfn-v0.1.1-build.json` preserves the frozen 182-page candidate.

Local v0.2 release QA passed on 2026-07-22; see `docs/release-qa-v0.2.md`. This does not authorize deployment. The package remains `0.2.0-dev` until an approved preview and release decision.

Do not deploy in this phase. The next deploy step should be explicit and user-approved.

## Generated Launch Assets

Phase 36 added:

- `https://ftfn.io/robots.txt`
- `https://ftfn.io/sitemap.xml`
- canonical URLs using `https://ftfn.io`
- Open Graph URL metadata using `https://ftfn.io`
- `noindex, follow` for non-published signal and briefing detail pages
- a generated source monitor at `https://ftfn.io/atlas/source-monitor/`
- a generated source coverage matrix at `https://ftfn.io/atlas/source-coverage/`
- a public update log at `https://ftfn.io/updates/`
- versioned static metadata exports at `/data/signals.json`, `/data/sources.json`, and `/data/topics.json`

Sitemap policy:

- Include primary public pages.
- Include Atlas reference sections and detail pages.
- Include local system profiles and dependency maps because they are part of the MVP reading experience.
- Include only `Published` signal detail pages.
- Include only `Published` briefing detail pages.
- Exclude evidence-gap detail pages for the first launch sitemap because they are a research queue, not launch editorial.

Robots policy:

```text
User-agent: *
Allow: /
Sitemap: https://ftfn.io/sitemap.xml
```

Record visibility policy:

- `Published` signals appear first on `/signals/`.
- `In Review` and `Draft Sample` signals remain visible on `/signals/` as a clearly labeled review shelf.
- Non-published signal detail pages use `noindex, follow`.
- Non-published briefing detail pages use `noindex, follow`.
- No non-published record should be described as public intelligence.

## Launch-Critical Routes

Check these before deploy and after deploy:

```text
/
/signals/
/signals/noaa-enso-discussion-el-nino-advisory-climate-risk-clock/
/signals/usgs-mineral-commodity-summaries-2026-critical-materials-baseline/
/signals/nist-pqc-standards-quantum-risk-migration-work/
/signals/doe-critical-minerals-materials-accelerator-nofo/
/signals/nsf-ai-materials-institute-award-2433348/
/signals/usgs-2026-gallium-import-supplied-semiconductor-constraint/
/signals/srp-e67-large-load-service-conditions/
/signals/srp-project-huckleberry-meta-mesa-online-service/
/signals/toronto-2025-development-pipeline-delivery-gap/
/atlas/
/atlas/sources/
/atlas/source-monitor/
/atlas/source-coverage/
/atlas/sources/source-noaa-cpc-enso/
/atlas/local-systems/
/atlas/dependency-maps/
/method/
/updates/
/about/
/data/signals.json
/data/sources.json
/data/topics.json
/robots.txt
/sitemap.xml
```

Expected results:

- HTML routes return 200.
- `robots.txt` returns text content and references `https://ftfn.io/sitemap.xml`.
- `sitemap.xml` returns XML content and includes only Published signal URLs.
- Published signal pages have `index, follow`.
- In Review signal pages have `noindex, follow`.
- Canonical URLs use `https://ftfn.io`.
- Signal index starts with Published records.
- Source monitor shows source freshness states without implying automated publishing.

## Pre-Deploy Checklist

- [x] Confirm latest source checked dates for Published signals.
- [x] Run `npm run validate:content` from `app/`.
- [x] Run `npm run check` from `app/`.
- [x] Run `npm run build` from `app/`.
- [x] Confirm `app/dist/robots.txt` exists.
- [x] Confirm `app/dist/sitemap.xml` exists.
- [x] Run `npm run source:health` from `app/`.
- [x] Run `npm run verify:release` from `app/`.
- [x] Confirm sitemap includes exactly the nine Published signal URLs.
- [x] Confirm sitemap excludes In Review and Draft Sample signal URLs.
- [x] Confirm non-published signal and briefing pages have `noindex, follow`.
- [x] Confirm `/atlas/source-monitor/` renders and shows review due/watch soon/current source states.
- [x] Confirm `/atlas/source-coverage/` renders and shows watch-lane/topic source coverage.
- [x] Confirm the seven-entry update log and all three static exports.
- [x] Smoke test ten launch-critical local routes.
- [x] Run desktop and mobile browser checks at 1440 × 900 and 390 × 844.
- [x] Confirm brand and primary-navigation targets meet a 44-pixel minimum.

Evidence: `docs/release-qa-v0.2.md` and `docs/work-packages/phase-54-v0.2-release-qa-and-preview-gate.md`.

## Deploy Checklist

Do not execute these steps until the user explicitly asks to deploy.

- [ ] Connect repository to Cloudflare Pages.
- [ ] Set project root to `app`.
- [ ] Set build command to `npm run build`.
- [ ] Set build output directory to `dist`.
- [ ] Deploy to a preview URL first.
- [ ] Run the launch-critical route checklist on the preview URL.
- [ ] Attach `ftfn.io` only after preview checks pass.
- [ ] Run the launch-critical route checklist on `https://ftfn.io`.
- [ ] Decide whether to add analytics in a later phase.

## Launch Note Outline

The current public-facing draft and limitations statement are in:

```text
docs/launch-note-v0.2.md
```

Working title:

```text
The future is not a list of inventions.
```

Purpose:

Introduce FTFN as a future-state intelligence project that tracks possibility, urgency, and the dependencies that decide whether frontier systems become real.

Outline:

1. Open with the core thesis: the future is a stack of dependencies.
2. Explain 42 as possibility and 59 as urgency.
3. State the editorial method: summarize, classify, contextualize, cite.
4. Explain why local constraints matter.
5. Name the first published records as examples of source-backed signals.
6. Acknowledge what is not built yet: automation, scoring, live API service, alerts, and full local intelligence. Static metadata exports are available.
7. Invite readers to use FTFN as a map of what could be, what it depends on, and what choices remain.

## Out Of Scope For Launch Readiness

- No deployment without approval.
- No DNS changes.
- No analytics.
- No newsletter capture.
- No automated ingestion.
- No CMS.
- No database migration.
- No accounts.
- No numeric 42/59 scoring.
- No public API.
