# FTFN v0.1.1 Release QA

Date: 2026-07-21

This note records local release QA against the frozen `v0.1.1` artifact preserved in Git commit `4845597`. It verifies the static preview candidate; it is not a deployment record or public-launch approval.

## Artifact Under Test

```text
commit: 4845597
package version: 0.1.1
output mode: static
generated pages: 182
sources: 102
signals: 18
topics: 17
```

The artifact was built in a detached temporary worktree so current `0.2.0-dev` content could not alter the release under test.

## Automated Checks

All frozen-release checks passed:

```text
npm.cmd run validate:content
npm.cmd run source:health
npm.cmd run check
npm.cmd run build
```

The build generated 182 pages with no Astro diagnostics.

## Browser Matrix

Checked at desktop `1440 x 900` and mobile `390 x 844` viewports:

- `/`
- `/signals/`
- `/signals/noaa-enso-discussion-el-nino-advisory-climate-risk-clock/`
- `/signals/doe-critical-minerals-materials-accelerator-nofo/`
- `/method/`
- `/atlas/`
- `/atlas/source-monitor/`
- `/atlas/source-coverage/`

Results:

- all representative routes rendered with the expected title, primary heading, and navigation,
- no tested page produced document-level horizontal overflow,
- the Source Coverage matrix remains contained in its intentional horizontal-scroll wrapper on mobile,
- the homepage, signal index, Published detail, In Review detail, Method, Atlas, Source Monitor, and Source Coverage layouts remained readable at both widths,
- canonical URLs use `https://ftfn.io`.

## Indexing Checks

- `robots.txt` allows crawling and points to `https://ftfn.io/sitemap.xml`.
- The sitemap contains exactly three signal detail URLs, all belonging to the Published set:
  - NIST post-quantum cryptography standards,
  - NOAA ENSO discussion,
  - USGS Mineral Commodity Summaries 2026.
- The representative Published NOAA detail uses `index, follow`.
- The representative In Review DOE detail uses `noindex, follow`.
- No localhost URL appears in the generated sitemap.

## Findings

No release-blocking route, layout, canonical, robots, sitemap, or publication-state indexing defect was found.

One non-blocking accessibility polish item remains: compact header text links render with approximately 20-pixel-high visual boxes on mobile, below the common 44-by-44-pixel touch-target guideline. The links remain visible, separated, and usable at `390 x 844`, so this is assigned to Phase 54 rather than treated as a `v0.1.1` release blocker.

## Release Decision

`v0.1.1` is locally verified and ready for an optional preview deployment. Preview hosting, post-deploy checks, DNS attachment, analytics, and public launch still require separate explicit approval.
