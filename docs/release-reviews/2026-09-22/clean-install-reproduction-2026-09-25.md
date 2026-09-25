# Current-candidate clean-install reproduction — September 25, 2026

Status: **passed for the identical normalized application candidate**, verified September 25 at 17:47:12.484 UTC. Fresh locked installation and complete isolated generation/validation passed. The actual-date receipt and its exact projections differ as expected; this is not byte-identical whole-source/whole-output reproduction or final-release approval. See the [verification record](../../../outputs/release-checkpoints/2026-09-24T18-30-59.438Z-6pNtWQ/reproduction/direct-cli-retry/verification.json).

## Exact inputs

The [September 24 source recovery](../../../outputs/release-checkpoints/2026-09-24T18-30-59.438Z-6pNtWQ/git-recovery-verification.json) identifies commit `3d1d0c2765137db77a2e7a01fb05f89e9a7c54fd`: 9,589 files and 220,990,711 source bytes. Before installation, every recovered file was checked against its manifest, and the source archive, candidate and lockfile hashes matched.

- Application candidate: `28e5ec8b4c6d68b8b7d2ec6666088e8602a6f9cbfac384143aed4b8001c88659`.
- Existing validation receipt: `204-FULL-LOCAL-VALIDATION-2026-09-24-a81c908440f5`.
- Lockfile SHA-256: `d5c0cf14413b5b975290875e86ea9329f0380d92ba05b32c9dc0fd9ddb53b3d8`.
- Runtime: Node v24.15.0 / npm 11.12.1.
- Isolated directory: `C:/Users/justi/AppData/Local/Temp/ftfn-export-place-recovery-2qYp3N`.

No dependencies, Astro cache, generated build output, validation output or npm cache existed there before the attempted installation. The live application is not used as a build-output or dependency source.

## Installation and retained attempt

The Sites workflow's installer selected the existing npm lockfile, but its Windows npm shim failed before installing dependencies: the shim looked for npm's own entry points under the recovered application's absent `node_modules`. The [failed attempt](../../../outputs/release-checkpoints/2026-09-24T18-30-59.438Z-6pNtWQ/reproduction/install-result.json) and log are retained, not replaced by a successful result.

The [fallback preflight](../../../outputs/release-checkpoints/2026-09-24T18-30-59.438Z-6pNtWQ/reproduction/direct-cli-retry/preflight.json) repeated exact source and clean-directory checks. Direct invocation of the installed npm CLI with `ci` installed **393 packages**, exit 0, with a fresh isolated cache, system CA support and strict TLS verification. Audit and funding queries were disabled; this is not a new vulnerability audit. The lockfile remained unchanged. See the [installation result](../../../outputs/release-checkpoints/2026-09-24T18-30-59.438Z-6pNtWQ/reproduction/direct-cli-retry/install-result.json).

## Separate private prerequisite

Full validation requires the existing local-only editorial registry, intentionally excluded from source archives and the public candidate digest. Its 157,083 bytes were checked against SHA-256 `7a12f6e119e1872f7d99acf92deb399de60872557ca628358917adbec8ac7009` and copied exclusively into the isolated directory before validation. [The prerequisite record](../../../outputs/release-checkpoints/2026-09-24T18-30-59.438Z-6pNtWQ/reproduction/direct-cli-retry/private-prerequisite.json) stores metadata only. Nothing was uploaded or published. This is reproducibility with a declared private input, not public-source-only validation.

## Full validation

The unchanged application command completed in the isolated recovered source:

```text
npm run validation:logged -- current:generate current:validate
```

[Terminal results](../../../outputs/release-checkpoints/2026-09-24T18-30-59.438Z-6pNtWQ/reproduction/direct-cli-retry/results.json): generation exited 0 at 17:29:13.122 UTC; full validation exited 0 at **17:46:43.256 UTC**, including the final receipt-bearing rebuild and release assertions. Output has 16,641 application pages, 159 top-level JSON exports, 341 updates and 833 sources. All **714,060 local-reference checks passed with zero missing targets**. Type checking reported zero errors, zero warnings and two existing hints. Private-registry exclusion and public-export boundaries passed.

The normalized candidate remains `28e5ec8b` across all 3,430 candidate artifacts. The rerun correctly issued `204-FULL-LOCAL-VALIDATION-2026-09-25-a81c908440f5`; the live workspace and review assignments retain the September 24 receipt. Both refer to the same application candidate, with distinct actual validation dates.

The initial reproduction wrapper required the historical receipt ID and therefore failed its final assertion **after successful application validation**. Its [failure record](../../../outputs/release-checkpoints/2026-09-24T18-30-59.438Z-6pNtWQ/reproduction/direct-cli-retry/failure.json) is retained. A separate strict, read-only verification of the completed run resolved that comparison error without rerunning validation, changing application code or backdating a receipt.

The [field-level source comparison](../../../outputs/release-checkpoints/2026-09-24T18-30-59.438Z-6pNtWQ/reproduction/direct-cli-retry/source-comparison.json) checks all 9,589 original files: **9,587 are byte-identical**. The other two are the aggregate's three receipt identity/date/time fields and five receipt/date projections in the deployment manifest. Exactly one source file was added: today's immutable validation receipt. Its content is identical to the prior receipt except for ID and actual validation date/time. No other source additions, deletions or changes were accepted. Lockfile and both live/isolated private-prerequisite hashes remain unchanged.

## Scope

This checks the exact September 24 application candidate. Subsequent coordinator/documentation edits are outside the recovered snapshot and do not change the application inputs. Any later application or dependency change requires its own applicable verification; this cannot pre-approve an unknown final release.

Independent content and language review, accepted portfolio counts, authorized backlog decisions, real reader/accessibility sessions, measurement requirements, exact hosted verification, launch authority and any actual operating month remain open. Coordination has been confirmed separately in the [handoff](../../coordinator-handoff-2026-09-25.md); it is not independent acceptance.
