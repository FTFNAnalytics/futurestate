# FTFN v0.1.1 Roadmap

Date: 2026-07-21

This roadmap defines the release path for the updated static preview candidate. It preserves `v0.1` as the original checkpoint and treats `v0.1.1` as a content-authority refresh, not a public launch.

## Release Definition

`v0.1.1` proves that the current FTFN site can package a materially broader evidence library without changing its editorial or deployment boundaries.

It includes:

- Astro static build version `0.1.1`,
- 182 generated pages,
- 102 source records,
- 18 signal records,
- 17 topic records,
- generated Source Monitor and Source Coverage pages,
- Method, publication policy, robots, sitemap, and canonical metadata,
- the Phase 48 through Phase 50 content and source expansion,
- a machine-readable deployment manifest.

It does not include deployment, DNS attachment, automated publishing, ingestion, analytics, accounts, a database, a public API, or numeric 42/59 scoring.

## Current Baseline

| Measure | Current |
| --- | ---: |
| Static pages | 182 |
| Sources | 102 |
| Signals | 18 |
| Published signals | 3 |
| In Review signals | 14 |
| Draft Sample signals | 1 |
| Topics | 17 |
| Local systems | 2 |
| Evidence gaps | 10 |

The release is content-richer than `v0.1`, but public authority still rests on the three Published signals. Review shelves and local dossiers must remain visibly bounded.

## Release Track

### 1. Package Freeze

Timeline: completed in this build cycle.

- Bump package metadata to `0.1.1`.
- Preserve the old `v0.1` artifacts.
- Add `deployment/ftfn-v0.1.1-build.json`.
- Add versioned session and roadmap documents.
- Refresh canonical handoff and documentation links.

Exit: version, manifest, counts, routes, and release boundaries agree.

### 2. Build Verification

Timeline: same day.

- Run content-reference validation.
- Run source-health metadata validation.
- Run Astro checks.
- Run the production build.
- Confirm all required output files exist.
- Confirm page count remains 182.

Exit: all commands pass with no content-reference or Astro errors.

### 3. Browser And Indexing QA

Timeline: 0.5 to 1 focused day.

- Check desktop and mobile layouts for homepage, Signals, Method, Source Monitor, Source Coverage, and representative signal pages.
- Confirm Published details use `index, follow`.
- Confirm In Review and Draft Sample details use `noindex, follow`.
- Confirm the sitemap includes only the three Published signal details.
- Confirm canonical URLs use `https://ftfn.io`.
- Record any launch-critical issue in a release QA note.

Exit: no known release-blocking layout, route, metadata, or indexing defect.

### 4. Preview Deployment Decision

Timeline: 0.5 to 1 day after explicit approval.

- Keep project root at `app`.
- Use `npm run build` and output directory `dist`.
- Deploy to a preview URL first.
- Run launch-critical route checks against the preview.
- Keep `ftfn.io` and DNS unchanged.

Exit: preview URL is verified or the release is explicitly held as local-only.

### 5. Public Launch Gate

Timeline: decision gate, not automatically scheduled.

Required:

- browser QA complete,
- preview checks complete,
- Published sources rechecked,
- launch note approved,
- public positioning does not imply comprehensive coverage,
- explicit approval for domain attachment and launch.

## Parallel Authority Track

Release QA should not halt content progress. In parallel, continue Phase 50 with two to five bounded source items and named local records. Keep those additions `In Review`; run publication review separately.

Priority order:

1. One award or funded-project record from USAspending or an agency award system.
2. One named ACC, Phoenix, Toronto, or Ontario local record.
3. One research result or program record from NSF Awards or OSTI.
4. One commodity-specific production, reserve, processing, or trade record for critical minerals.
5. One dated repair for CHIPS, FAA AAM, NHTSA AV, StatCan/CMHC, or the AI-grid frame.

## Handoff To v0.2

`v0.1.1` is complete as a build when its static checks pass. It is complete as a preview release only after browser QA and an approved preview deployment.

The next product milestone is `v0.2`, the first authority-loop build. Its defining work is content operations:

- grow from 18 to 25-35 signals,
- raise the Published plus publication-ready set from 3 to 8-12,
- deepen both local dossiers with named records,
- add a public update/correction log,
- add static metadata exports,
- prove a repeatable human-reviewed update cadence.

Estimated active effort: 3 to 5 focused weeks. Preview infrastructure should remain a small release task inside that window, not the center of the build.

## Decision Boundary

Generating and verifying `v0.1.1` does not approve hosting, DNS, analytics, ingestion, public launch, or publication of the 14 In Review records.
