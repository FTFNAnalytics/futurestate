# Current candidate: isolated clean-install reproduction

September 23, 2026 local-date continuation. **Fresh dependency installation and complete isolated validation passed.** Terminal verification was recorded at September 24 00:43:54.568 UTC (September 23 18:43 America/Edmonton). This proves reproduction of candidate `4178277f` from recovered commit `be59f801` with the separately supplied private editorial prerequisite; it does not advance independent content, reader, measurement or release approval.

## Inputs and installation

- Recovered commit: `be59f8010da88e25033a3641f2d0a2c82523a71c`.
- Application candidate: `4178277fc3eb2578937a36f9d27ba13974631e1a69e036ff8c0a5fc17da4c38f`.
- Existing validation receipt: `204-FULL-LOCAL-VALIDATION-2026-09-23-1727e048e74c`.
- Isolated directory: `C:/Users/justi/AppData/Local/Temp/ftfn-export-place-recovery-n7r79X`.
- Fresh preflight at 21:58:20 UTC compared all 9,569 recovered source files and 220,362,228 bytes to the saved manifest, rechecked the archive and lockfile, and confirmed no prior dependencies, build output, Astro cache, validation output or npm cache in that directory.
- Node 24.15.0 and npm 11.12.1 installed **393 packages**, exit 0 at **21:58:37.417 UTC**, using the existing lockfile, system certificate trust, enabled strict TLS and a new isolated npm cache. No dependency version or lockfile changed. No new vulnerability audit was requested or claimed.

Evidence: [preflight](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/release-checkpoints/2026-09-23T21-46-37.252Z-jEMZwN/reproduction/preflight.json>), [installation result](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/release-checkpoints/2026-09-23T21-46-37.252Z-jEMZwN/reproduction/install-result.json>).

## Retained first failure and corrected prerequisite

The first logged sequence terminated: generation passed, but full validation failed because the source archive excludes `private-data/source-candidates.json`. The validator deliberately requires that separate local editorial input. This prerequisite is already documented in the September 22 baseline report; no application change or validation bypass was needed.

The existing local-only registry was copied into the isolated directory, with exact SHA-256 `7a12f6e119e1872f7d99acf92deb399de60872557ca628358917adbec8ac7009` and 157,083 bytes. It remains outside Git/archive/public-package scope. The copy does not change the main registry. No registry contents appear in the reproduction diagnostic.

The retry reuses the freshly installed dependencies and reruns the complete logged generation/validation sequence. It did not reinstall, copy dependencies or discard the failed attempt. Both attempts and the separate prerequisite declaration are retained under [reproduction evidence](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/release-checkpoints/2026-09-23T21-46-37.252Z-jEMZwN/reproduction/with-local-registry/private-prerequisite.json>).

## Retained interruption and completed reproduction

The second attempt, logged as `2026-09-23T22-01-18.708Z-3H8GVg`, lost its tool session before returning a terminal validation result. At the next inspection, session **18332** was missing and elevated read-only process inspection found no matching Node validation/reproduction process. Its result file contains only successful generation; later partial build checks do not establish complete validation. All logs are retained, including [the interruption record](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/release-checkpoints/2026-09-23T21-46-37.252Z-jEMZwN/reproduction/after-session-loss/interruption.json>).

Only after confirming the process was absent, the complete logged sequence was restarted with unchanged installed dependencies, source candidate and separately verified private prerequisite. Tool session **42116** completed with exit 0. The initial session **30024** is terminal with exit 1; **18332** was missing without a complete result. None should now be polled or restarted.

The [terminal verification](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/release-checkpoints/2026-09-23T21-46-37.252Z-jEMZwN/reproduction/after-session-loss/verification.json>) and retained command logs were inspected after completion:

- Generation: September 24 00:24:02.283–00:24:40.046 UTC, exit 0.
- Full validation, including the final receipt-bearing rebuild and release verification: 00:24:40.047–00:43:51.202 UTC, exit 0.
- Candidate and receipt match the recovered baseline exactly; **no archived source paths changed through generation/validation**.
- Lockfile SHA-256 remains `d5c0cf14413b5b975290875e86ea9329f0380d92ba05b32c9dc0fd9ddb53b3d8`; both private-input copies retain the declared hash.
- Terminal validation log SHA-256: `72f962fbbc0fa37fb66724c7a361e56f051b8c0050c30a4e42f9d7cba449bcf1`.

The evidence keeps four distinct claims separate:

1. Recovery of public/source files from the archive.
2. Clean dependency installation from the unchanged lockfile.
3. Full local validation with the separately supplied private editorial prerequisite.
4. Independent acceptance and owner authority, neither of which these checks provide.

The main application remained unchanged until this run finished. Later planning edits and the [Nevada source inspection](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/annual-nevada-permit-source-review-2026-09-23.md>) are not part of the recovered archive. The subsequent [two-reading Nevada implementation](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/annual-nevada-followthrough-2026-09-23.md>) changes the application candidate and requires its own validation and recovery; this baseline proof does not pre-validate that change. UI automation remains stopped; no hosting, push, access/DNS change, review contact or launch occurred.
