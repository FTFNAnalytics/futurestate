# Phase 36 Work Package: Launch Package and Static Deployment Readiness

## Objective

Prepare FTFN for a small static launch on `ftfn.io` without deploying yet.

This phase should make the app and docs launch-aware: canonical domain metadata, sitemap, robots, visibility rules, deployment decision, launch checklist, and launch note outline.

## Generated Prompt

```text
Start Phase 36 for FTFN.

Use the current roadmap, session brief, launch candidate review, publication policy, and latest work package as the source of truth.

Goal:
Prepare FTFN for a small static launch on ftfn.io without deploying yet.

Implementation scope:
1. Create a launch package and deployment-readiness checklist.
2. Decide the static hosting path for ftfn.io.
3. Add sitemap and robots support if it stays small and dependency-free.
4. Set canonical/domain metadata for ftfn.io where appropriate.
5. Decide how Published, In Review, and Draft Sample records should appear on public indexes after launch.
6. Keep non-published signal and briefing records reachable but clearly labeled and excluded from search indexing if practical.
7. Outline the first launch note or launch essay.
8. Do not deploy, change DNS, add analytics, start automation, add ingestion, add scoring, add a CMS, add accounts, or migrate to a database.
9. Run npm run validate:content, npm run check, and npm run build.
10. Smoke test launch-critical routes.
11. Update README.md, docs/master-roadmap.md, docs/decision-log.md, docs/session-brief.md, docs/documentation-map.md, docs/publication-policy.md, and this work package.

Preserve:
- FTFN public brand,
- ftfn.io domain direction,
- 42/59 framing,
- "Civilization is a choice,"
- the thesis: "The future is not a list of inventions. It is a stack of dependencies."
```

## Deliverables

- `docs/launch-package.md`
- `docs/work-packages/phase-36-launch-package-and-static-deployment-readiness.md`
- Astro `site` configured as `https://ftfn.io`
- Generated `robots.txt`
- Generated `sitemap.xml`
- Canonical and Open Graph URL metadata
- `noindex, follow` for non-published signal and briefing detail pages
- Published-first signal index structure
- Updated roadmap and handoff docs

## Checklist

- [x] Confirm Phase 35 as latest completed phase.
- [x] Identify Phase 36 as launch package and static deployment readiness.
- [x] Create launch package documentation.
- [x] Decide primary static hosting path.
- [x] Add `site: "https://ftfn.io"` to Astro config.
- [x] Add canonical and `og:url` metadata.
- [x] Add `robots.txt`.
- [x] Add conservative `sitemap.xml`.
- [x] Make Published signals the first section on `/signals/`.
- [x] Keep In Review and Draft Sample signals visible but separated.
- [x] Add `noindex, follow` to non-published signal detail pages.
- [x] Add `noindex, follow` to non-published briefing detail pages.
- [x] Outline the first launch note.
- [x] Keep deploy, DNS, analytics, ingestion, automation, scoring, CMS, accounts, and database work out of scope.
- [x] Run `npm run validate:content`.
- [x] Run `npm run check`.
- [x] Run `npm run build`.
- [x] Inspect generated `robots.txt`, `sitemap.xml`, and metadata.
- [x] Smoke test launch-critical routes locally.
- [x] Use the in-app browser to verify the Published-first signal index and representative robots behavior.

## Decisions

### Hosting

Cloudflare Pages is the recommended first static hosting path for `ftfn.io`.

Configuration:

```text
Project root: app
Build command: npm run build
Build output directory: dist
```

No deployment or DNS work was done.

### Public Index Visibility

Published records should be the public default after launch.

Implementation:

- `/signals/` renders Published records first.
- Review records remain visible in a labeled review shelf.
- Non-published signal and briefing detail pages use `noindex, follow`.
- The sitemap includes only Published signals and Published briefings.

Rationale:

This keeps the reader journey transparent during the MVP while preventing review material from being presented as finished public intelligence.

### Sitemap Scope

The launch sitemap is conservative. It includes primary public pages, Atlas reference pages, local systems, dependency maps, and Published signals. It excludes evidence-gap detail pages and non-published signal/briefing pages.

## Validation Results

Commands run from `app/`:

```text
npm.cmd run validate:content
npm.cmd run check
npm.cmd run build
```

Results:

```text
validate:content: passed
check: 0 errors, 0 warnings, 0 hints
build: passed, 97 pages generated
```

Build output checks:

```text
app/dist/robots.txt exists
app/dist/sitemap.xml exists
Published signal pages: index, follow
In Review signal page: noindex, follow
In Review briefing page: noindex, follow
Published signals appear in sitemap
Held In Review signals do not appear in sitemap
```

Local route smoke test:

```text
/ -> 200 text/html
/signals/ -> 200 text/html
/method/ -> 200 text/html
/about/ -> 200 text/html
/atlas/ -> 200 text/html
/robots.txt -> 200 text/plain
/sitemap.xml -> 200 application/xml
```

Browser QA:

```text
/signals/: Published section visible
/signals/: Review Shelf section visible
/signals/: launch policy copy visible
Published NOAA signal detail: index, follow
In Review Arizona water signal detail: noindex, follow
/method/: index, follow
```

Note:

Local dev canonical URLs use the localhost origin. The generated static files in `app/dist/` use `https://ftfn.io` because Astro `site` is configured for the production domain.

## Acceptance Criteria

- Phase 36 work package exists.
- Launch package exists.
- Static hosting path is chosen but not executed.
- Sitemap and robots are generated without new dependencies.
- Canonical URLs use `https://ftfn.io`.
- Published records are the first signal-index surface.
- Non-published signal and briefing pages are reachable but not invited into search indexing.
- Launch note outline exists.
- Validation, check, and build pass.
- Launch-critical local routes return 200.
- Browser QA confirms the Published-first signal index.
- Roadmap identifies the next phase.

## Open Questions

- Should Phase 37 execute a Cloudflare Pages preview deploy, or should it first do a deeper visual/accessibility pass?
- Should `In Review` records remain linked from `/signals/` after the first public launch, or move behind a clearer research/prelaunch route?
- Should evidence-gap routes get `noindex, follow` before launch?
- Should the launch note become a public route before deployment?
- Should analytics wait until after first external readers, or be added before launch?

## Next Phase

Phase 37 should run final browser QA and deployment dry-run preparation. It should not attach `ftfn.io` or change DNS until explicitly approved.
