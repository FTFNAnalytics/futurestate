# FTFN v1 September operating-program handoff

**Effective date:** 2026-08-31  
**Current state:** Complete locally — validated; v1 promotion held

## Read first

1. `docs/roadmap-v1-september-operating-program.md`
2. `app/src/data/v1-monthly-operating-program.json`
3. `app/src/data/phase-158-september-evidence-operations-desk.json`
4. `app/src/data/phase-159-owner-decision-sprint.json`
5. `app/src/data/phase-161-stack-watch.json`
6. `app/src/data/phase-164-monthly-candidate-decision.json`

## Immutable baseline

Do not modify or re-finalize Phase 156 merely because this overlay increases whole-site page, export, source, or update counts. The Phase 156 receipt remains bound to digest `5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a`.

## Do not automate

- Future-dated September or October evidence decisions.
- Authority, requirement, mission, longitudinal-boundary, or owner adjudication.
- GitHub publication, hosting, custom domain, DNS, or public launch.

## Validation sequence

Run from `app/`:

```text
npm run build:v1month-content
npm run validate:candidates
npm run validate:content
npm run source:health
npm run test:v1rc
npm run test:v1month
npm run check
npm run build
npm run verify:v1rc
npm run verify:v1month
npm run finalize:v1month-validation
npm run build:v1month-content
npm run build
npm run verify:v1month
npm run update:v1month-manifest
npm run verify:release
```

## Current truth

- Stack Watch, local-system, dependency, guide, comparison, runbook, route, export, and local audit surfaces are complete.
- 36 Phase 159 owner actions remain pending.
- The Phase 160 zero-series boundary remains owner-gated and zero observations were transferred.
- Future operation and editorial fields remain unpredated.
- v1 promotion remains Held.
