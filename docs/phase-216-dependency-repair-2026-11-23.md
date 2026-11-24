# Phase 216 — approved dependency repair, November 23, 2026

## Result and scope

The user explicitly approved the dependency repair. The local installation completed successfully, the post-install npm audit reported zero known vulnerabilities at its actual execution time, and all twenty final source/regression commands exited 0. This resolves the November 22 dependency-repair approval hold for this work; it does not grant continuing installation authority or production acceptance.

No production cleanup/build, permission or security change, stopped browser automation, commit, push, deployment or launch occurred. Phase 216 and Evidence Cycle 001 remain open. The requested eight October readings remain integrated within the existing 34 translations; this repair did not rewrite them or create evidence receipts.

This report is dated November 23 in the client calendar. Machine logs use UTC on November 24. Evidence operations continue to use their explicit America/Edmonton calendar and real inspection dates.

## Dependency repair

The existing bundled Node 24.22.3 was selected explicitly; default/system Node remains 24.15.0. No runtime installation or persistent PATH change was performed. The Windows npm shim selects its sibling system Node, so the local fallback invoked the configured npm CLI through the patched bundled Node. The Sites helper itself was not modified. Normal certificate validation remained enabled, with system certificates, strict SSL, bounded timeouts and no forced major upgrade.

Before replacement, package.json, package-lock.json and astro.config.mjs were copied without overwriting any existing backup to `outputs/dependency-repair-2026-11-23/original/`. npm ci replaced the installed dependency tree; the old manifest/lock inputs are retained for recovery, not a full backup of node_modules. A scoped repair runner and terminal logs are retained under `outputs/dependency-repair-2026-11-23/`.

The manifest now requests Astro ^7.4.7, @astrojs/mdx ^8.1.6 and @astrojs/markdown-remark ^7.3.10, with supported Node floor ^22.23.5 or >=24.22.3. Existing scripts and devDependencies are preserved. The resolved, installed graph includes:

| Component | Installed version |
| --- | --- |
| Astro | 7.4.13 |
| @astrojs/mdx | 8.1.6 |
| @astrojs/markdown-remark | 7.3.10 |
| @astrojs/prism | 4.1.2 |
| Vite | 8.3.8 |
| Rolldown | 1.3.3 at root; 1.2.19 in the two inspected nested build-tool locations |
| Sharp | 0.35.5 |

The pre-install registry audit reported nine affected packages: three moderate and six high. Audit classifications alone were insufficient: the Vite/Prism version floors from the preceding security review were checked explicitly. An intermediate resolution retained Prism 4.0.2 through MDX's exact transitive dependency; the compatible MDX update removed that stale pin. No intermediate lockfile was treated as repaired.

The final install ended at 2026-11-24T02:29:34.114Z, exit 0. All 398 installed lock entries matched their locked versions, with zero missing nonoptional entries; the 114 absent entries were optional. The post-install audit ended at 02:30:08.934Z, exit 0 and zero known vulnerabilities. This is a dated local registry result, not a guarantee of absence of vulnerabilities or evidence that a deployed site changed.

Terminal records:

- `outputs/dependency-repair-2026-11-23/runs/2026-11-24T02-27-06.744Z-audit-before-wDVKw7/`
- `outputs/dependency-repair-2026-11-23/runs/2026-11-24T02-29-20.205Z-install-CNSODE/`
- `outputs/dependency-repair-2026-11-23/runs/2026-11-24T02-30-07.942Z-audit-after-8CO64j/`

## Compatibility fixes and actual validation

The first source run, `2026-11-24T02-30-09.410Z-Z50R2d`, passed generation but failed current:test. The reference-rejection fixture's read hook also intercepted the newer runtime's JSON-module loading, causing an unrelated selected-review drift failure before the intended validator. The test now preloads the independently reviewed reader catalog before installing the hook and preserves Buffer/string return types. It still requires the exact expected unresolved-reference failure.

The second run, `2026-11-24T02-32-58.010Z-WVWMlN`, passed generation but failed a stale Edmonton midnight expectation. Node 24.22.3 uses tzdata 2026e. Historical winter/summer fixtures are retained, and November 2026 fixtures now use Alberta's permanent UTC−6 rule. The live clock implementation and all source inspection dates are unchanged. This follows [Alberta's published time guidance](https://www.alberta.ca/albertas-new-time-system-abt) and the [IANA 2026c release](https://www.iana.org/time-zones/releases/2026c); it is not a new evidence inspection.

Both focused repaired tests passed. The final runs are terminal:

- `outputs/validation/2026-11-24T02-36-55.979Z-rif7Ym/results.json`: all six commands passed — current:generate, current:test, validate:candidates, validate:content, source:health and check. Finished 2026-11-24T02:40:51.065Z. Astro checked 1,268 files with zero errors, zero warnings and two existing hints.
- `outputs/validation/2026-11-24T02-36-55.183Z-fK4YuF/results.json`: all fourteen commands passed — Phase 58–67 assertions including 60C, plus test:v1rc, test:v1month and test:v1cycle. Finished 2026-11-24T02:37:10.020Z.

The failed initial runs remain on disk; they were test compatibility failures, not installation failures. Source-health checks concern metadata, not live endpoints. These twenty passing commands are not the production build, post-build/full release verification or a full-validation receipt. git diff --check passed.

## Candidate and preservation

The regenerated candidate binds 4,019 artifacts:

- Candidate: `d297bf0465e591a5298235e3999a21a14222fb328e7979bf4fdcfac8e7535ec4`.
- Manifest: `f3511285902cc2b68fb667b86e64f3adfef072799ea04da31f454b4ae78f4107`.
- State: Pending build; full local-validation receipt: null.

Independent fingerprint recomputation matches. Final package.json SHA-256 is `83451840d6f9d6cafb8f91e92c39b1d94db419038f8970df0e09cb619df6ee83`; package-lock.json is `2b6a9675179e3870470add1628b8801e938a6ea64dea33e1b237ffabb79c9113`. astro.config.mjs preserves its pre-repair hash `75b6cc1832ba37a58f7e6a945236adc2d3797223610296505ad5b686e7e6fd09`.

The complete Phase 60 current ledger, Phase 61 registry, translations and selected-article review data preserve their pre-repair hashes. Thirteen primary identities, twenty-one ledger receipts, four Toronto receipts and the separate Arizona Phase 55Q receipt remain distinct. No appointment changed: November 25 Amtrak reliability and NNSA recurring output remain independent, followed by November 29 Toronto, December 2 Loudoun policy and the separate December 21 follow-ups.

## Cleanup access still needed

Ordinary sandbox commands ran as the restricted sandbox account; the approved repair commands ran as the normal user and succeeded. The Everyone deny for DeleteSubdirectoriesAndFiles visible on app/dist/review is inherited from the OneDrive root. No ACL was changed. Successful scoped dependency replacement does not prove production cleanup already works.

The next requested authority is a command-scoped local build/validation run allowed to replace **only generated app/dist contents**, with normal validation outputs permitted. Use the supported approval mechanism first; do not ask for broad OneDrive access or manually remove inherited ACLs as the first remedy. [Codex documents sandbox scope and command approval as separate controls](https://learn.chatgpt.com/docs/agent-approvals-security).

This cleanup approval has not yet been supplied. Before any cleanup, resolve the exact generated target and inspect the normal build command. Do not delete source, .git, the repository root, unrelated files or backups. If scoped approval is denied or the operation still fails, stop and report the exact restriction; do not bypass it or change security settings.

Remaining Phase 216 work includes production/post-build/full release and recoverability checks, the exact owner launch decision, and thirty actual operating days. Passing source checks, repaired dependencies or cycle decision counts cannot substitute for those gates.
