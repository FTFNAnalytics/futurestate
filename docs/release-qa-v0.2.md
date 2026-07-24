# FTFN v0.2 Release QA

Date: 2026-07-24

Status: Phase 55Q local release gate passed; owner-only Sites publication pending.

## Artifact Under Review

- Build manifest: `deployment/ftfn-v0.2-build.json`
- App package: `0.2.0-dev`
- Static output: `app/dist/`
- Expected build: 389 HTML pages
- Content baseline: 194 sources, 67 signals, 17 topics, 19 update entries, 6 Phase 55Q gap decisions, 6 reader pathways across 7 Atlas surfaces, 5 briefings, 3 dependency maps, 3 research collections, 47 research documents
- Publication baseline: 42 Published signals, 25 In Review signals, 2 Published briefings, 3 In Review briefings, 3 Published dependency maps

The package remains `0.2.0-dev`. The owner-only deployment is a private checkpoint and does not authorize public access, a custom domain, or release freeze.

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
| Private candidates | Passed: 150 records; 132 Candidate, 11 Active Source Record, 4 Watchlist Only, 2 Blocked, 1 Rejected, 0 Needs Triage |
| Content references | Passed: 194 sources, 67 signals, 17 topics, 19 organizations, 5 technologies, 2 local systems, 5 briefings, 10 evidence gaps, 3 dependency maps, 3 research collections, 47 research documents, 6 reader pathways, 19 updates |
| Source endpoint metadata | Passed: 120 Manual review, 74 Probe ready |
| Astro diagnostics | Passed: 0 errors, 0 warnings, 0 hints |
| Static build | Passed: 389 HTML pages |
| Release assertions | Passed: required outputs, 6 Phase 55Q gap decisions, 6 pathways across 7 Atlas surfaces, update log, exports, Published-source dates, robots, sitemap, canonical, and indexing boundaries |

The release assertion is preserved as `npm run verify:release`. It reads the v0.2 manifest and fails if the checked build no longer matches the release contract.

## Current-Source Gate

The 42 Published signals resolve to 70 unique source records. All 70 have a `last_checked_date` on or after `2026-07-22`.

Phase 55F retained the Phase 54 source floor and refreshed the older NASA Artemis, USDA plant-breeding, and CMHC portal support rails. The verifier now reads the expected support-source count and minimum checked date from the release manifest rather than hard-coding the earlier nine-record baseline.

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

During Phase 54, the Signals status control was changed to `Published` and returned exactly nine visible cards, all labeled Published. Phases 55F, 55J, and 55M changed content state but not the control, layout, or filtering implementation; the production build now exports 38 Published records.

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
- the sitemap contains exactly the 38 Published signal detail URLs,
- non-published signal detail URLs are absent from the sitemap,
- all 38 Published details use `index, follow`,
- representative In Review, company-claim In Review, and briefing details use `noindex, follow`,
- built canonical URLs use `https://ftfn.io`,
- no built sitemap URL uses localhost,
- `/data/signals.json` contains exactly 38 Published records,
- `/data/sources.json` contains 189 active public source records and excludes private notes,
- `/data/topics.json` contains 17 topic records,
- all three exports remain on schema version `1.0`,
- `/updates/` contains all sixteen update records.

During local development, Astro generates environment-local canonical values. The `https://ftfn.io` canonical assertion therefore runs against the production build output rather than the development server.

## Accessibility Scope

This pass includes rendered DOM, content-structure, alternative-text, link, heading, overflow, responsive-layout, interaction, and touch-target checks. It is not a substitute for a future assistive-technology session or a full automated WCAG audit.

No release-blocking accessibility issue was found in the checked scope.

## Phase 55I Content And Deployment QA Scope

Phase 55I completes the first-pass triage of all 150 private candidates, adds 22 source records and nine `In Review` signals, repairs an existing Phoenix signal and both local-system evidence trails, and adds one update entry. It does not change components, styles, layouts, navigation, or client-side behavior. The Phase 54 desktop/mobile browser matrix therefore remains the UI baseline. The 260-page artifact passed candidate validation, content validation, source health, Astro diagnostics, production build, and the release assertion.

Hosted checkpoint:

- commit: `8ce2feba82a3ade2266e2d74788c003bca28a26f`,
- Sites version: 7,
- URL: `https://ftfn-analytics.jbumstead.chatgpt.site`,
- access: custom owner-only policy with one allowed user and no groups,
- deployment status: succeeded,
- application contract: 260 pages, 152 sources, 45 signals, 16 Published, 29 In Review, and 11 updates,
- Source Monitor contract: 0 Review Due, 0 Watch Soon, 152 Current,
- custom-domain state: `ftfn.io` and `www.ftfn.io` remain pending validation and do not route to the Site.

The Phase 55I pass did not repeat the Phase 54 browser matrix because no component, style, layout, navigation, or client-side behavior changed. Export membership, private-data exclusion, robots, sitemap, canonical, update-log, and indexing assertions passed against the production build. Focused hosted checks passed on the homepage, update log, two new signal routes, a new source route, and Source Monitor with no browser-console warnings or errors. The new signal routes are `noindex, follow` and remain outside the sitemap because all nine are `In Review`.

## Phase 55J Publication QA Scope

Phase 55J changes publication metadata and copy but not components, styles, layouts, navigation, or client-side behavior. It adds one source detail route, changes all nine Phase 55I signal details to `index, follow`, adds those routes to the sitemap and Published export, and adds one public update entry.

The 261-page artifact passes the complete candidate, content, source-health, Astro, production-build, and release-assertion gate. The exact owner-only deployment receipt is recorded below.

Hosted checkpoint:

- commit: `03d8d5db755c4f6ee0761a479ef0b9b3f0ff5d37`,
- Sites version: 8,
- URL: `https://ftfn-analytics.jbumstead.chatgpt.site`,
- access: custom owner-only policy with one allowed user and no groups,
- deployment status: succeeded,
- application contract: 261 pages, 153 sources, 45 signals, 25 Published, 20 In Review, and 12 updates,
- custom-domain state: `ftfn.io` and `www.ftfn.io` remain pending validation and do not route to the Site.

## Verdict

Phase 55Q adds five named official sources, four bounded Published signals, one structured evidence-gap decision block, and one update record. It repairs both local dossiers and five reader pathways, exposes latest decisions on the evidence-gap index and details, and adds evidence-gap routes to the sitemap.

The 389-page artifact passes private-candidate validation, content references, source endpoint metadata, Astro diagnostics, static generation, the 42-route Published-signal sitemap contract, all ten evidence-gap routes, exactly six Phase 55Q decisions, two Published briefing routes, three Published dependency-map routes, six pathways across seven existing Atlas surfaces, non-published exclusion, canonical and indexing rules, the three public exports, the nineteen-entry update log, all three research archives, and private-registry exclusion.

Phase 55Q owner-only Sites publication is pending at `https://ftfn-analytics.jbumstead.chatgpt.site`. The required access policy remains custom with one allowed owner and no groups. A Phase 55Q visual/browser pass was not requested; automated page, content, canonical, sitemap, and release-contract checks passed. The build is not approved for public access or public launch. The Toronto Phase 55H task runs August 1, the DARPA Lift Phase 55R gate follows August 9, and the Arizona wastewater hold reopens September 22.
