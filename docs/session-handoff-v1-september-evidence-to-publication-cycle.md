# FTFN Phase 165–172 handoff

**Effective date:** 2026-09-01  
**Current state:** Complete locally — future and owner gates held

## Read first

1. `docs/roadmap-v1-september-evidence-to-publication-cycle.md`
2. `app/src/data/v1-september-evidence-cycle.json`
3. `app/src/data/phase-165-live-evidence-operations-cycle-001.json`
4. `app/src/data/phase-172-september-state-report.json`
5. `app/src/data/phase-165-receipts/receipt-60-louisiana-starlink-2026-09-01-no-material-change.json`

## Immutable baselines

Do not regenerate or rewrite the Phase 145–164 candidate. Phase 156 remains bound to `5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a`; Phase 164 remains bound to `c306c3db8f861805be0482f82985df7de7fa1124b055f8e76023b5ba680c8a19`.

## Safe rerun sequence

Run from `app/`:

```text
npm run build:v1cycle-content
npm run validate:candidates
npm run validate:content
npm run source:health
npm run test:v1rc
npm run test:v1month
npm run test:v1cycle
npm run check
npm run build
npm run verify:v1rc
npm run verify:v1month
npm run verify:v1cycle
npm run finalize:v1cycle-validation
npm run build:v1cycle-content
npm run build
npm run verify:v1cycle
npm run update:v1cycle-manifest
npm run verify:release
```

## Do not automate or infer

- Later evidence results before their lawful dates.
- Weekly desk or edition decisions before their cutoffs.
- Authority, requirement, mission, longitudinal, zero-series, or promotion decisions without owner receipts.
- A Louisiana adoption numerator from planned locations, availability, discounts, or global subscriber totals.
- Git commit, GitHub push, hosting, DNS, or public launch without explicit authorization.
