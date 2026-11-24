# Approved build repair and source-review continuation — September 15, 2026

The user explicitly approved the dependency/build repair, npm audit and blocked PDF retry. This approval does not grant independent editorial acceptance, measurement admission, Git publication, deployment or launch.

## Repair

The original Astro 5 check failed inside the sandbox while resolving existing dependency files. The same check outside the sandbox passed resolution and exposed 32 real type errors. No files were fabricated and no filesystem ACLs were relaxed. The original package, lockfile and Astro configuration were backed up under `outputs/dependency-repair-2026-09-15/original/` before changes.

The first npm audit encountered a certificate-chain error. Node's supported `--use-system-ca` option allowed the installed Windows trust store to be used with `--strict-ssl=true`; TLS verification was never disabled and no global npm settings were changed. See the [Node enterprise-network guidance](https://github.com/nodejs/learn/blob/main/pages/http/enterprise-network-configuration.md).

The [before audit](audits/2026-09-15-npm-audit-before.json) reported 15 vulnerable packages: one critical, eight high, four moderate and two low. Astro's [AVIF advisory](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2) concerns processing an attacker-controlled AVIF, including an image processed during a build; a static deployment is not itself proof that the build dependency is safe. No exploitation is claimed.

Installed repair:

| Component | Verified version |
| --- | --- |
| Astro | 7.3.2 |
| MDX integration | 8.0.1 |
| Markdown/remark processor | 7.3.1 |
| Sharp | 0.35.4 |
| Vite | 8.3.0 |
| Astro check / TypeScript | 0.9.9 / 5.9.3 |
| Local Node / npm | 24.15.0 / 11.12.1 |

Compatible transitive fixes used `npm audit fix` without `--force`. One transient OneDrive lockfile I/O failure was retried successfully. The [after audit](audits/2026-09-15-npm-audit-after.json) reports zero known vulnerabilities at the actual check time, not a guarantee against future advisories.

Following the official [Astro 6](https://docs.astro.build/en/guides/upgrade-to/v6/) and [Astro 7](https://docs.astro.build/en/guides/upgrade-to/v7/) migration guides, the build explicitly retains the remark processor and HTML-aware whitespace compression. Schemas now import Zod through `astro/zod`. The CLI wrapper resolves the package's declared executable instead of assuming the removed `astro.js` path. The package declares Node >=22.12.0 and npm >=9.6.5; a future deployment must meet those requirements.

Typed generic projections preserve collection fields while declaring their optional editorial metadata. Reader-presentation and backlog inputs now have explicit contracts; optional formal evidence is narrowed before use. Strict checking remains enabled. The full-suite type check passed across 878 files with zero errors, zero warnings and two pre-existing unused-code hints.

Package SHA-256: `977cad7785bbb7ba6a9e912e8e56f956967c05cb7c7002b83aa98f237c23a520`.

Lockfile SHA-256: `d5c0cf14413b5b975290875e86ea9329f0380d92ba05b32c9dc0fd9ddb53b3d8`.

## Dalrymple continuation

Receipt `211-DALRYMPLE-VISUAL-2026-09-15` records four official PDF downloads and assisted visual inspection of nine named pages. It preserves the earlier text-only/access-failure receipt byte-for-byte and links the later success on all five assigned reader routes. PDF byte counts, hashes and page locators are in `app/src/data/phase-207-current-operations.json`; local source copies are under `output/pdf/dalrymple-review-2026-09-15/`.

The review corroborates the existing report-4 period interpretation while retaining the conflicting final-report heading. It does not add observations, change the original extraction, claim an issuer correction, reconstruct an interval denominator or admit a series. The contractual method, interval ledger and independent acceptance remain required. Visual checking was scoped to the nine named pages, not the entire reports.

## Production defects found and corrected

- The content schema was stripping research-document supporting-source IDs. Restoring that explicit field recovered 124 missing relationship-archive pages; the expected membership remains independently derived from source records.
- In-review pathways now retain `noindex, follow` and stay out of the Published-only sitemap/data export. They remain accessible in historical relationship archives with their holds visible.
- An existing `/classification/` link now resolves through an additive canonical-path repair to `/browse/classification/1/`; historical source files were not rewritten.
- Briefings now have a 40-card, 12-page static archive instead of placing all 458 entries on the index. Searchable exports retain the full collection.
- Repeated overview research notices retain the dated finding and next action and link to the complete, anchored artifact checks on the assigned full-receipt page. The checks verify both the exact link and complete destination content.
- Historical update checks follow and validate the entire eight-page, 316-receipt archive. Briefing-attribution checks use canonical frontmatter slugs and check every static briefing page. Neither change reduces the expected inventory.
- Release pathway checks now validate exact overview summaries and their complete linked narratives, dependency stages, evidence limits and record archives, rather than requiring obsolete duplicated section headings.
- The release-wide private-data scan exceeded V8's maximum string length by concatenating the entire site. It now scans the same complete file set with bounded concurrency and keeps only per-file match results; neither forbidden marker nor file coverage was removed.

The diagnostic rebuild produced the expected 16,615 HTML pages. Reader output checks passed for all 104 original articles, 34 paired English editions and 17 compact HTML/CSS budgets. Final whole-suite results follow below; diagnostic passes alone do not issue the immutable validation receipt.

## Local browser checks

The rebuilt output was served only on `127.0.0.1:4329`. Assisted browser checks on September 15 confirmed:

- A first Tab focuses the skip link; Enter moves focus to `main-content` on the manufacturing concise edition.
- The concise-to-plain English link opens the intended edition; the return-format link and section targets are present. A section link reaches the named evidence section.
- A temporary 390-by-844 narrow-screen check showed a 375px content viewport and 375px document scroll width, with no horizontal overflow on that selected reading page. Body text was 16.32px. The override was reset.
- Briefings initially show 40 of 458 records. Searching `Dalrymple` gives four matches; the `shelf=briefings&q=Dalrymple` query survives reload. Clearing filters restores the archive, and static page 12 displays the final 18 records.
- No browser console errors were recorded during these selected checks. The local server logged the browser's automatic `/favicon.ico` probe as 404; no favicon link is declared in the current layout. This non-blocking branding omission is not hidden by the internal-link audit.

These are local assisted smoke checks, not the five-reader study, a screen-reader-user trial, complete mobile coverage, 200% zoom certification or hosted acceptance. The PDF skill's temporary-file cleanup removed nine reproducible PNG renderings and four duplicate working PDFs only after verifying retained source-copy hashes; the four original downloaded PDFs remain in `output/pdf/dalrymple-review-2026-09-15/`.

## Reproduction and validation

Run from `app/` with the supported Node/npm versions:

```powershell
npm run validation:logged -- current:generate current:validate
```

The wrapper saves timestamped command logs and actual exit codes under `outputs/validation/`. It stops on failure. The complete validation includes content/candidate checks, source metadata health, historical regressions, Phase 58–61 and 67 assertions, current semantic tests, strict type checking, a fresh build, output verification and release-manifest checks. Source metadata health is not a live-source currency audit. The immutable validation digest now includes the package, lockfile, build configuration, CLI wrapper and new source-review update.

The first complete pass created receipt `204-FULL-LOCAL-VALIDATION-2026-09-15-29b5a7b8ab48` at `2026-09-15T23:03:41.998Z`, binding 3,330 candidate artifacts to SHA-256 `b6cfd4c3501183ef5ea37eed6ad9ddb0403b07776b9f72af54d1207ac0f0e7ba`. Its exact scope is local Phase 181–204 reference validation plus current integration checks, not Phase 216 acceptance. The receipt's whole-site snapshot has 16,615 HTML pages, 157 top-level data exports, 316 update entries and 833 canonical source records. The whole-output scan checked 692,065 local references with zero missing targets.

Preservation checks independently confirmed unchanged SHA-256 values for the current Phase 60 decisions (`a499d9fd1d00e9516adf247683e2540ba13f53aa7cd91f7606be5599601d0685`), all 104 original reader articles (`38ffd8b3e44dc671dd6590f80658240b6e533c645e5cf5fc3e84f345009d9125`) and the accessible-edition contracts (`3f2d0494cc16dfb192f0ab909a0c035411c6884b0a4563528019ce8917416f26`). Original pilot-review JSON and the earlier Dalrymple follow-up also match their pinned hashes. No scheduled evidence gate was rerun as part of this repair.

**Final result: passed.** `current:generate` and `current:validate` both exited 0 in the complete logged run. The latter finished the receipt-bearing rebuild, `verify:v1ref`, all current production checks, manifest refresh and final `verify:release`. The repeated whole-output scan again reported zero missing targets. The validated receipt is embedded and the deployment manifest now records 16,615 pages / 157 exports / 316 updates, with v0.9 controlling and v1 Held.

Execution evidence: [actual command results](../outputs/validation/2026-09-15T22-53-12.786Z-dLxcur/results.json), [complete validation log](../outputs/validation/2026-09-15T22-53-12.786Z-dLxcur/2-current-validate.log), and [immutable local receipt](../app/src/data/phase-204-receipts/204-FULL-LOCAL-VALIDATION-2026-09-15-29b5a7b8ab48.json). `git diff --check` passed, with existing LF/CRLF conversion notices but no whitespace errors. Earlier failed diagnostic logs remain as history; one attempted diagnostic overlapped output replacement and therefore was not a valid acceptance run.

## Remaining phase boundaries

Phases 205–216 are not collectively complete. Independent reviews, 25 authorized backlog dispositions, measurement admission, future evidence dates, exact release-scope approval, source-to-Git/deployment binding and a real thirty-day post-launch operating month remain separate. No Git push, deployment or reviewer contact was performed by this repair.

The existing working branch is `codex/phase51-content`, based at `44dacef1ff824b2a637656c1b4886dd4a09333f3`, with origin `https://github.com/FTFNAnalytics/futurestate.git`. The pre-existing dirty worktree was preserved; this repair does not establish a new source commit or hosted version. The temporary local preview and browser QA tab were closed. Installed-tree verification is not a clean-room `npm ci` reproduction; optional extraneous WASM packages remain in the local installation, with no missing/invalid peers reported by `npm ls`.
