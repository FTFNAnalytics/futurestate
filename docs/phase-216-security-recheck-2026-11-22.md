# Phase 216 dependency security recheck

**Inspection date:** November 22, 2026, America/Edmonton.\
**Status:** Dependency repair requires fresh approval. Production acceptance and Phase 216 remain open.

The requested eight October 28 French/Spanish readings remain integrated within the existing 34 translations across seventeen topics. This check concerns the build toolchain, not a change to those readings or an additional evidence-cycle decision.

## Findings and scope

The September 15 zero-vulnerability audit remains a historical result. New official advisories cover versions still installed locally.

| Component installed | Official finding | Required repair or disposition |
| --- | --- | --- |
| Vite 8.3.0 and Rolldown 1.2.8 | Critical advisory published November 10 affects Vite 8.3.0–8.3.6 when its development server is explicitly exposed to the network. | The current 8.3 line is patched in Vite 8.3.7, relying on Rolldown 1.2.17. Verify both resolved versions after repair. [Vite advisory](https://github.com/vitejs/vite/security/advisories/GHSA-p4f5-76q4-ffq7) |
| Astro 7.3.2 | November 9 low-severity advisory affects versions through 7.4.4 when untrusted input controls an element name. | Astro 7.4.5 fixes this issue. Local exploitability has not been established. [Astro dynamic-tag advisory](https://github.com/withastro/astro/security/advisories/GHSA-mh32-jxcr-mh9f) |
| @astrojs/prism 4.0.2 | October 28 moderate advisory affects versions through 4.1.1; unsupported-language code may be inserted without escaping in the affected rendering paths. | Version 4.1.2 is patched. No explicit Prism component, import or syntax-highlighting configuration matched the targeted application search. [Prism advisory](https://github.com/withastro/astro/security/advisories/GHSA-ff38-p3qj-4pmf) |
| Default Node 24.15.0 | The default executable predates the October and November security releases, including fixes for malformed Brotli input and multiple network/runtime paths. | An existing bundled Node 24.22.3 executable is available and reports the November patched version. Prefer that runtime for an approved repair; no Node installation is currently necessary. [October release](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases/), [November release](https://nodejs.org/en/blog/vulnerability/november-2026-security-releases/) |

These are version-range findings, not evidence that the public static site was compromised. The application configures static output. A targeted search of application configuration, source, scripts and deployment files found no explicit `--host`, `server.host` or `allowedHosts` setting. That search is not an inventory of running processes, external launch arguments or deployed infrastructure; no development server was started or probed.

Two previously relevant package findings have narrower dispositions: installed Sharp 0.35.4, with loaded libheif 1.23.2, meets the patch threshold in its [August advisory](https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c); Astro 7.3.2 meets the fix threshold for the separate [October script/style escaping advisory](https://github.com/withastro/astro/security/advisories/GHSA-98hj-9722-w3j8). Neither disposition clears unrelated advisories. The lockfile contains neither @astrojs/node nor @astrojs/markdoc.

## Local reconciliation

The installed-package comparison found 393 installed packages matching lockfile versions, zero version mismatches and 94 absent packages, all marked optional. This was not a fresh npm audit or a clean-room installation.

The default executable is `C:\Program Files\nodejs\node.exe` (24.15.0); npm reports 11.12.1. The already installed alternative is `C:\Users\justi\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` (24.22.3). The Astro wrapper spawns `process.execPath`, so explicitly selecting the patched runtime matters. No system PATH or runtime installation was changed.

Package files remain unchanged by this check:

- `app/package.json` SHA-256: `2ceac86cd1545e1b009d43319b14bc2a6eeb4d0eb2f0408ba4855b6b80db95d4`.
- `app/package-lock.json` SHA-256: `d5c0cf14413b5b975290875e86ea9329f0380d92ba05b32c9dc0fd9ddb53b3d8`.

The current lockfile matches the retained September repair hash. The package manifest is not claimed byte-identical to September; the hashes above identify the current inputs.

## Validation and remaining authority

The preceding source-clock run `2026-11-23T01-16-20.829Z-1iVBFu` passed six commands and finished at 01:19:44.345 UTC. Historical run `2026-11-23T01-16-33.297Z-ziSpYc` passed fourteen commands and finished at 01:16:48.475 UTC. Both timestamps fall on November 22 in Edmonton. These results remain source and regression checks, not security clearance or full production acceptance.

Independent recomputation still binds 4,019 candidate artifacts: digest `7ad5fc2501cb7e6f33e0b781bcf33b6bf8962eab129a7c0fd4d24d8b25dc22bb`, manifest `f495a670f8fbf018b33ce65683b36b8f9dbbdacf12ca90572bd7d15350757fc4`. State remains **Pending build**, with no full-validation receipt.

The production directory `app/dist/review` still inherits Everyone / Deny / DeleteSubdirectoriesAndFiles. That access blocker is independent of dependency security. It was inspected without retrying cleanup, changing permissions or selecting an alternate output to bypass the restriction.

Fresh approval is needed for a controlled dependency repair: preserve current package inputs, use the existing patched Node runtime, obtain a current registry audit with normal TLS verification, resolve compatible patched Astro/Vite/Rolldown/Prism versions, inspect the lockfile diff and rerun the applicable checks. Do not use a forced major upgrade or relax security controls. If compatibility requires a broader migration, report that scope before proceeding.

Only this report and an additive coordinator handoff are changed by this checkpoint. No package installation, application edit, live source-evidence operation, production build, stopped browser automation, commit, push, deployment or launch occurred. Full production/recovery verification still requires authorized access restoration; exact owner launch authority and thirty actual operating days remain separate Phase 216 requirements. Evidence Cycle 001 stays open and its appointments are unchanged.
