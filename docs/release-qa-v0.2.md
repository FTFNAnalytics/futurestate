# FTFN v0.2 Release QA

Date: 2026-07-22

Status: local release gate passed; preview deployment deferred pending explicit approval.

## Artifact Under Review

- Build manifest: `deployment/ftfn-v0.2-build.json`
- App package: `0.2.0-dev`
- Static output: `app/dist/`
- Expected build: 210 HTML pages
- Content baseline: 114 sources, 33 signals, 17 topics, 7 update entries
- Publication baseline: 9 Published, 23 In Review, 1 Draft Sample

The package remains `0.2.0-dev` because no preview deployment or release decision has been approved. The Phase 54 result is a locally verified v0.2 candidate, not a deployment record.

## Automated Gate

Run from `app/`:

```text
npm run validate:content
npm run source:health
npm run check
npm run build
npm run verify:release
```

Result:

| Check | Result |
| --- | --- |
| Content references | Passed: 114 sources, 33 signals, 17 topics, 10 organizations, 5 technologies, 2 local systems, 1 briefing, 10 evidence gaps, 2 dependency maps, 7 updates |
| Source endpoint metadata | Passed: 56 Manual review, 58 Probe ready |
| Astro diagnostics | Passed: 0 errors, 0 warnings, 0 hints |
| Static build | Passed: 210 HTML pages |
| Release assertions | Passed: required outputs, update log, exports, Published-source dates, robots, sitemap, canonical, and indexing boundaries |

The release assertion is preserved as `npm run verify:release`. It reads the v0.2 manifest and fails if the checked build no longer matches the release contract.

## Current-Source Gate

The nine Published signals resolve to 12 unique source records. All 12 have a `last_checked_date` of `2026-07-22`.

Phase 54 rechecked the one remaining older supporting source, the official CMHC housing-construction table directory, and refreshed its check metadata after confirming that the starts, completions, and units-under-construction tables remain available.

## Browser Matrix

The local Astro server was checked in the in-app browser at:

- desktop: 1440 × 900,
- mobile: 390 × 844.

Routes checked at both sizes:

```text
/
/signals/
/signals/doe-critical-minerals-materials-accelerator-nofo/
/signals/phoenix-tsmc-wastewater-infrastructure-reclaimed-water-milestones/
/method/
/updates/
/atlas/
/atlas/source-monitor/
/atlas/source-coverage/
/about/
```

Results across all 20 route/viewport combinations:

- one main region and one primary navigation region,
- a visible page title and one H1,
- no empty links,
- no duplicate IDs,
- no missing image alt attributes,
- no skipped heading levels in the rendered page outline,
- no document-level horizontal overflow,
- no browser warnings or errors,
- Published sample rendered `index, follow`,
- In Review sample rendered `noindex, follow`.

The mobile Source Coverage table remains intentionally horizontally scrollable inside its own table container; the document itself does not overflow.

## Interaction And Touch Targets

The Signals status control was changed to `Published` and returned exactly nine visible cards, all labeled Published. The filter was then restored.

Phase 54 enlarged the brand and primary-navigation links to a minimum 44 × 44 CSS-pixel target. Final desktop and mobile measurements were:

- brand: 44 × 44,
- Signals: 55 × 44,
- Atlas: 44 × 44,
- Briefings: 66 × 44,
- Method: 61 × 44,
- About: 49 × 44.

The mobile header remains compact by reducing only the surrounding vertical gap and padding.

## Indexing And Export Assertions

The built artifact passed these checks:

- `robots.txt` allows public crawling and references `https://ftfn.io/sitemap.xml`,
- the sitemap contains exactly the nine Published signal detail URLs,
- non-published signal detail URLs are absent from the sitemap,
- all nine Published details use `index, follow`,
- representative In Review, Draft Sample, and briefing details use `noindex, follow`,
- built canonical URLs use `https://ftfn.io`,
- no built sitemap URL uses localhost,
- `/data/signals.json` contains exactly nine Published records,
- `/data/sources.json` contains 114 active public source records and excludes private notes,
- `/data/topics.json` contains 17 topic records,
- all three exports remain on schema version `1.0`,
- `/updates/` contains all seven update records.

During local development, Astro generates environment-local canonical values. The `https://ftfn.io` canonical assertion therefore runs against the production build output rather than the development server.

## Accessibility Scope

This pass includes rendered DOM, content-structure, alternative-text, link, heading, overflow, responsive-layout, interaction, and touch-target checks. It is not a substitute for a future assistive-technology session or a full automated WCAG audit.

No release-blocking accessibility issue was found in the checked scope.

## Preview Decision

Preview deployment was not authorized and was not created. Post-deploy route, asset, caching, and platform-header checks are therefore deferred.

The next external action is a deliberate approval decision:

1. approve a private preview deployment,
2. deploy the exact candidate,
3. repeat the launch-critical route and metadata checks on the preview URL,
4. decide separately whether to finalize version `0.2.0`, attach `ftfn.io`, or launch publicly.

## Verdict

Phase 54 passes locally. No release blocker remains in content validation, source currency, Astro diagnostics, static generation, core desktop/mobile journeys, the tested accessibility surface, metadata, indexing, update-log rendering, or public exports.

The candidate is ready for a user-approved private preview. It is not yet preview-deployed or approved for public launch.
