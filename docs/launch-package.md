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

The current v0.1.1 build manifest is:

```text
deployment/ftfn-v0.1.1-build.json
```

The original `deployment/ftfn-v0.1-build.json` remains the historical Phase 40 checkpoint.

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
/atlas/
/atlas/sources/
/atlas/source-monitor/
/atlas/source-coverage/
/atlas/sources/source-noaa-cpc-enso/
/atlas/local-systems/
/atlas/dependency-maps/
/method/
/about/
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

- [ ] Confirm latest source checked dates for Published signals.
- [ ] Run `npm run validate:content` from `app/`.
- [ ] Run `npm run check` from `app/`.
- [ ] Run `npm run build` from `app/`.
- [ ] Confirm `app/dist/robots.txt` exists.
- [ ] Confirm `app/dist/sitemap.xml` exists.
- [ ] Confirm sitemap includes the three Published signal URLs.
- [ ] Confirm sitemap excludes In Review and Draft Sample signal URLs.
- [ ] Confirm non-published signal and briefing pages have `noindex, follow`.
- [ ] Confirm `/atlas/source-monitor/` renders and shows review due/watch soon/current source states.
- [ ] Confirm `/atlas/source-coverage/` renders and shows watch-lane/topic source coverage.
- [ ] Smoke test launch-critical local routes.
- [ ] Run desktop and mobile browser checks for homepage, signals, Method, and at least one Published signal.

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
6. Acknowledge what is not built yet: automation, scoring, data exports, alerts, and full local intelligence.
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
