# FTFN v0.2 Release QA

Date: 2026-07-24

Status: Phase 55W local release gates passed; owner-only deployment refresh pending.

## Artifact Under Review

- Build manifest: `deployment/ftfn-v0.2-build.json`
- App package: `0.2.0-dev`
- Static output: `app/dist/`
- Expected build: 591 HTML pages
- Content baseline: 298 sources, 112 signals, 17 topics, 25 update entries, 13 evidence gaps, 15 reader pathways across 19 Atlas surfaces, 5 local systems, 9 briefings, 6 dependency maps, 6 research collections, 83 research documents
- Publication baseline: 85 Published signals, 27 In Review signals, 3 Published briefings, 6 In Review briefings, 4 Published dependency maps, 2 In Review dependency maps

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
| Private candidates | Passed: 150 records; 72 Candidate, 71 Active Source Record, 4 Watchlist Only, 2 Blocked, 1 Rejected, 0 Needs Triage |
| Content references | Passed: 298 sources, 112 signals, 17 topics, 19 organizations, 5 technologies, 5 local systems, 9 briefings, 13 evidence gaps, 6 dependency maps, 6 research collections, 83 research documents, 15 reader pathways, 25 updates |
| Source endpoint metadata | Passed: 192 Manual Review, 106 Probe Ready |
| Astro diagnostics | Passed: 0 errors, 0 warnings, 0 hints |
| Static build | Passed: 591 HTML pages |
| Release assertions | Passed: required outputs, 45 Phase 55W signal decisions, 5 local systems, 6 Phase 55Q gap decisions, 15 pathways across 19 Atlas surfaces, 6 research collections / 83 documents, update log, five exports, Published-source dates, robots, sitemap, canonical, and indexing boundaries |

The release assertion is preserved as `npm run verify:release`. It reads the v0.2 manifest and fails if the checked build no longer matches the release contract.

## Current-Source Gate

The 85 Published signals resolve to 134 unique source records. All 134 have a `last_checked_date` on or after `2026-07-22`.

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

Phase 55S batch one promotes 30 High-priority candidates into separately authored public authority records and adds one specific NIST roadmap source, five bounded signals, eight research summaries, a fourth research collection, an 11-file archive, and one update record. Three signals pass the publication gate and two remain In Review.

The 434-page artifact passes private-candidate validation, content references, source endpoint metadata, Astro diagnostics, static generation, the 45-route Published-signal sitemap contract, all ten evidence-gap routes, exactly six Phase 55Q decisions, two Published briefing routes, three Published dependency-map routes, six pathways across seven existing Atlas surfaces, non-published exclusion, canonical and indexing rules, the three public exports, the twenty-entry update log, all four research archives, and private-registry exclusion.

Exact Phase 55S batch-one source commit `9e393f0731d996662d95d912e9737bafdaa1ad67` is deployed as owner-only Sites version 16 at `https://ftfn-analytics.jbumstead.chatgpt.site`. The access policy remains custom with one allowed owner and no groups. A Phase 55S visual/browser pass was not requested; automated page, content, canonical, sitemap, archive, deployment-status, and release-contract checks passed. The build is not approved for public access or public launch. The Toronto Phase 55H task runs August 1, the DARPA Lift Phase 55R gate follows August 9, and the Arizona wastewater hold reopens September 22.

## Phase 55S Batch-Two QA Scope

Batch two adds content and evidence relationships without changing components, styles, layouts, navigation, or client-side behavior. It promotes 30 private candidates into separately authored public sources, adds ten research-document routes, one collection route, seven signal routes, one briefing route, one update entry, and a 13-file archive.

The 483-page artifact passes:

- private-candidate validation for 150 records, including the 71 Active Source Record and 72 Candidate states;
- active-source duplicate validation against 255 public sources;
- content-reference validation across 79 signals, five collections, 65 research documents, six briefings, three maps, two local systems, and six pathways;
- source endpoint metadata review for 156 Manual Review and 99 Probe Ready sources;
- Astro diagnostics with zero errors, warnings, or hints;
- production generation of 483 pages;
- all 51 Published signal routes and all five Published research collections in the sitemap;
- all non-published signals and four In Review briefings outside the sitemap with `noindex, follow`;
- exactly 82 current Published-support sources;
- the 21-entry update log, three public exports, required routes and downloads, canonicals, robots, and private-registry exclusion;
- the new ten-record, 13-file research archive with SHA-256 `58736A52A803181D21EA1CB395132C4787AF4C1164EC846CDA8DC324AF79C864`.

A repeat visual/browser pass was not requested because the batch changes content only. Exact source commit `3e2310de99382612be7c5221d0070184188f85d4` is deployed successfully as owner-only Sites version 17 at `https://ftfn-analytics.jbumstead.chatgpt.site`. Public access, package freeze, custom-domain attachment, Hostinger DNS, and public launch remain outside this QA scope.

## Phase 55T Thin-Topic Corpus QA Scope

Phase 55T adds content records and evidence relationships without changing components, styles, layouts, navigation, or client-side behavior. It adds 17 source routes, 18 signal routes, one briefing route, two dependency-map routes, two pathway records on existing topic surfaces, and one update.

The 521-page artifact passes:

- private-candidate validation for the unchanged 150-record local-only registry;
- content-reference validation across 272 sources, 97 signals, 17 topics, seven briefings, five dependency maps, eight pathways, five research collections, and 65 research documents;
- source endpoint metadata review for 172 Manual Review and 100 Probe Ready sources;
- the Phase 55T floor of at least four signals and two Published records in every topic;
- Astro diagnostics with zero errors, warnings, or hints;
- production generation of 521 pages;
- all 61 Published signal routes in the sitemap and all 36 In Review signal routes outside it;
- exactly 96 current Published-support sources;
- both Published briefings in the sitemap and all five In Review briefings outside it;
- all three Published dependency maps in the sitemap and both In Review maps outside it;
- eight pathways across 12 existing Atlas topic and local-system surfaces;
- the 22-entry update log, three public exports, required routes and downloads, canonicals, robots, and private-registry exclusion;
- all five Published research collections, 65 document routes, and the five existing download archives.

A repeat visual/browser pass was not requested because the phase changes content only. Exact source commit `b0527aa7795fef7cb15273aad923904f69c4133e` is deployed successfully as owner-only Sites version 18 at `https://ftfn-analytics.jbumstead.chatgpt.site`. The access policy remains custom with one allowed owner and no groups. The public GitHub boundary, package version, Hostinger DNS, and custom-domain state remain unchanged.

## Phase 55U Local-Systems Network QA Scope

Phase 55U adds content records, topic integrations, and release assertions without changing components, styles, layouts, navigation, or client-side behavior. It adds 26 source routes, 15 signal routes, three local-system routes, three evidence-gap routes, one briefing route, one dependency-map route, three pathway records, and one update.

The 570-page artifact passes:

- private-candidate validation for the unchanged 150-record local-only registry;
- content-reference validation across 298 sources, 112 signals, 17 topics, five local systems, eight briefings, thirteen evidence gaps, six dependency maps, eleven pathways, five research collections, and 65 research documents;
- source endpoint metadata review for 192 Manual Review and 106 Probe Ready sources;
- Astro diagnostics with zero errors, warnings, or hints;
- production generation of 570 pages;
- all 73 Published signal routes in the sitemap and all 39 In Review signal routes outside it;
- exactly 112 current Published-support sources;
- both Published briefings in the sitemap and all six In Review briefings outside it;
- all three Published dependency maps in the sitemap and all three In Review maps outside it;
- eleven pathways across thirteen topic and five local-system surfaces;
- the 23-entry update log, three public exports, required routes and downloads, canonicals, robots, and private-registry exclusion;
- all five Published research collections, 65 document routes, and the five existing download archives.

Three one-time Codex tasks were created for the dated Phase 55U checks: August 15, 2026 for the Shuttle Landing Facility license; October 1, 2026 for Loudoun Phase 2 standards; and January 15, 2027 for Nevada lithium project delivery.

A repeat visual/browser pass was not requested because the phase changes content only. Phase 55U app content commit `8d53ebe35904c719145b5f0ad1d2b2388cc1a2be` is deployed successfully as owner-only Sites version 20 from receipt source commit `17253c9355f4f8ea809e3a5d49dcf328bc8c8254` at `https://ftfn-analytics.jbumstead.chatgpt.site`. The access policy remains custom with one allowed owner and no groups. The public GitHub boundary, package version, Hostinger DNS, and custom-domain state remain unchanged.

## Phase 55V Cross-Corridor Research QA Scope

Phase 55V adds eighteen research-document routes, one collection route, one `In Review` briefing route, one public update, a four-capture and fourteen-link evidence bundle, and integrated content repairs without changing components, styles, layouts, navigation, or client-side behavior.

The 590-page artifact passes:

- private-candidate validation for the unchanged 150-record local-only registry;
- content-reference validation across 298 sources, 112 signals, 17 topics, five local systems, nine briefings, thirteen evidence gaps, six dependency maps, eleven pathways, six research collections, and 83 research documents;
- source endpoint metadata review for 192 Manual Review and 106 Probe Ready sources;
- Astro diagnostics with zero errors, warnings, or hints;
- production generation of 590 pages;
- the unchanged 73 Published and 39 In Review signal indexing contract;
- both Published briefings in the sitemap and all seven In Review briefings outside it;
- all six Published research collections and all 83 document routes in the sitemap;
- a verified 21-file Phase 55V ZIP with four valid official PDFs, fourteen official-link records, summaries, README, and checksum manifest;
- explicit release assertions for the 18-document, four-capture, fourteen-link Phase 55V contract;
- the 24-entry update log, three public exports, required routes and downloads, canonicals, robots, and private-registry exclusion.

A repeat visual browser pass was not required because Phase 55V changes content only. App content commit `3bdb52a9348e5cf963ec6569838f880611d2491c` matches exact private Sites source commit `b2db5978f0c4a37c35998f849fcd75158c115cec`, which is deployed successfully as owner-only Sites version 21 at `https://ftfn-analytics.jbumstead.chatgpt.site`. The site reports one allowed owner and no groups; a direct request for the new collection reached the protected `Continue with ChatGPT` gate. The locally verified 590-page build remains the route-level content check behind that owner-only gate. The public GitHub boundary, package version, Hostinger DNS, custom-domain state, and public access remain unchanged.

## Phase 55W Publication And Discovery QA Scope

Phase 55W changes publication membership, discovery behavior, pathway content, topic shelves, and the public-data contract. The 591-page artifact passes:

- private-candidate validation for the unchanged 150-record local-only registry;
- content-reference validation across 298 sources, 112 signals, 17 topics, five local systems, nine briefings, thirteen evidence gaps, six dependency maps, fifteen pathways, six research collections, and 83 research documents;
- Astro diagnostics with zero errors, warnings, or hints;
- production generation of 591 pages;
- 85 Published signal routes in the sitemap and all 27 In Review routes outside it;
- 134 current Published-support sources;
- three Published briefing routes in the sitemap and six In Review routes outside it;
- four Published dependency-map routes in the sitemap and two In Review routes outside it;
- a 45-record decision ledger with 12 promotions, 27 holds, and six Published controls;
- ten Published pathway records in the public export and five In Review pathways excluded;
- all fifteen pathways rendered across fourteen topic and five local-system surfaces;
- the 25-entry update log and five versioned public-data exports;
- required discovery markers for signal filters, research shelves, Source Monitor controls, topic-level latest evidence, and the `/data/` landing page;
- canonicals, robots, sitemap, required outputs, and private-registry exclusion.

A repeat visual-browser pass was not requested. Structural discovery assertions, Astro diagnostics, the full static build, and route/export checks pass. The Phase 55W owner-only deployment receipt is recorded after hosting completes; no public-access, public-GitHub, package, Hostinger DNS, or custom-domain change is authorized.
