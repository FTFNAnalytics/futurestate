# Phase 05 Work Package: Build Validation and Scaffold Repair

This work package proves the first FTFN Astro scaffold by installing dependencies, running validation, running the production build, and repairing issues surfaced by the real toolchain.

## Objective

Move the Phase 04 scaffold from "created" to "build-verified" without expanding visual design or product scope.

## Inputs

Required context:

- [README](../../README.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Decision Log](../decision-log.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Content Scaffold Plan](../content-scaffold-plan.md)
- [Phase 04 Work Package](phase-04-app-scaffold-and-seed-content.md)
- `app/package.json`
- `app/src/content.config.ts`

## Deliverables

- [x] Phase 05 work package
- [x] App dependencies installed in `app/`
- [x] `app/package-lock.json`
- [x] Passing `npm run check`
- [x] Passing `npm run build`
- [x] Scaffold repair for Astro telemetry in sandboxed/local validation
- [x] App-level `.gitignore`
- [x] Generated page verification
- [x] Updated README
- [x] Updated master roadmap
- [x] Updated decision log

## Checklist

### Dependency Installation

- [x] Ask for approval before dependency installation.
- [x] Run dependency installation in `app/`.
- [x] Use Node's system certificate store after npm reported a local certificate verification error.
- [x] Confirm `package-lock.json` exists.

### Validation

- [x] Run `npm run check`.
- [x] Confirm Astro content sync succeeds.
- [x] Confirm Astro generated types succeed.
- [x] Confirm diagnostics return 0 errors, 0 warnings, and 0 hints.

### Build

- [x] Run `npm run build`.
- [x] Confirm production build completes.
- [x] Confirm static output is generated in `app/dist/`.
- [x] Confirm 17 pages are generated.

### Scaffold Repair

- [x] Add `app/scripts/run-astro.mjs` to disable Astro telemetry before running Astro commands.
- [x] Route npm scripts through `run-astro.mjs`.
- [x] Avoid PowerShell `npm.ps1` execution policy issues by using `npm.cmd`.
- [x] Add `app/.gitignore` for `node_modules/`, `dist/`, `.astro/`, and env files.

### Generated Pages

- [x] Homepage generated.
- [x] Signal index generated.
- [x] Signal detail pages generated.
- [x] Topic index generated.
- [x] Topic detail pages generated.
- [x] About page generated.

Representative generated pages verified:

```text
dist/index.html
dist/signals/index.html
dist/signals/enso-outlook-update-climate-risk-posture/index.html
dist/signals/evtol-flight-campaign-demonstration-deployment-gap/index.html
dist/atlas/topics/index.html
dist/atlas/topics/climate/index.html
dist/atlas/topics/aviation/index.html
dist/atlas/topics/chips-and-compute/index.html
dist/about/index.html
```

## Validation Results

`npm run check`:

```text
Result (13 files):
- 0 errors
- 0 warnings
- 0 hints
```

`npm run build`:

```text
17 page(s) built
Complete
```

Seed content counts:

```text
signals=10
sources=10
topics=3
local_systems=2
```

## Repair Notes

The first `npm install` attempt failed because PowerShell blocked `npm.ps1`. The install was rerun with `npm.cmd`.

The next install attempt reached the npm registry but failed with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. The install succeeded after setting:

```text
NODE_OPTIONS=--use-system-ca
```

The first `npm run check` attempt failed because Astro telemetry tried to create a config folder outside the workspace. The local `run-astro.mjs` wrapper now sets:

```text
ASTRO_TELEMETRY_DISABLED=1
```

Astro check/build commands needed to run outside the Codex sandbox because Astro/esbuild resolved installed dependencies in a way that attempted to read parent directories blocked by the sandbox. The app scripts themselves are local and should work in a normal developer shell.

## Acceptance Criteria

This phase is complete because:

- app dependencies are installed,
- `npm run check` passes,
- `npm run build` passes,
- scaffold repair decisions are documented,
- the next phase is identified.

## Recommended Next Phase

Phase 06 should add the next missing page skeletons before visual polish:

- source index,
- source detail,
- local system index,
- local system detail,
- briefing index,
- briefing detail,
- a light signal filtering pass if it remains small.

After those routes exist, FTFN can move into the first homepage narrative and visual design pass.

## Completion Notes

Status: complete as of 2026-05-26.

The MVP scaffold now has a passing validation/build baseline. Future changes should keep `npm run check` and `npm run build` green before larger design or content work.
