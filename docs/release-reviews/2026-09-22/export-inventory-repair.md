# Export inventory repair and content-review continuation

September 22, 2026 (America/Edmonton). Local implementation and review preparation only; no independent approval, source admission, hosted replacement or launch.

## Failure and repair

The [01:47 UTC run](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-23T01-47-00.547Z-G9SyAe/results.json>) exited 1 at 01:58:33 UTC: release verification expected 157 top-level public JSON exports but found 158. Candidate preparation still used the historical arithmetic `153 + 4`. The new place-identity export was real source-defined output, not a stray generated file.

A read-only reconciliation found **75 literal source endpoints plus 83 declared dynamic program exports**, all distinct, matching all 158 built top-level JSON paths with no missing or unexpected identities. The inherited required-output list covered only 151; it omitted six earlier current-reader exports as well as the new place export.

The [source-inventory helper](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/app/scripts/lib/public-json-inventory.mjs>) derives expectations from literal source endpoints and the eight existing program declarations, not from output. Candidate preparation records the exact routes, count and required output paths. Release verification compares the source, manifest, required-output and built identities. The final manifest updater performs the same comparison before retaining the count. Historical phase export counts and approval states are unchanged.

The [regressions](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/app/scripts/assert-public-json-inventory.mjs>) cover missing/stale paths, same-count substitution, duplicates, invalid/nested routes, idempotence and historical verification metadata. The helper and tests are included in the candidate digest. Source tests and the actual source/manifest/output comparison passed before the replacement full run; they do not substitute for that run.

## Logged execution

- The [02:05:12 UTC attempt](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-23T02-05-12.080Z-AJsf3h/results.json>) stopped during generation with an `UNKNOWN` file-open error while writing the reference-attribution JSON. The file remained parseable, not read-only by attributes and unchanged from Git. No permission or lock-file change was made; the failed log is retained.
- The [02:05:32 UTC replacement sequence](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-23T02-05-32.361Z-szlfEN/results.json>) generated with exit 0 at 02:06:04.236 UTC and completed full validation with exit 0 at **02:25:34.652 UTC**. Both builds, final manifest/release checks and place-note output assertions passed. Type checking reported zero errors/warnings and two existing hints. Output: **16,627 application HTML pages, 158 top-level JSON exports, 327 updates and 833 sources; 711,531 local references with zero missing targets**.

Receipt `204-FULL-LOCAL-VALIDATION-2026-09-22-c6b4baa97dd0` binds candidate `ad0869ee8f974aba25febbf9ae69bff056d3b1bcd3e2e0919a0e54e51ed8e6c0`, 3,376 candidate artifacts and artifact-manifest digest `13e5b3d0211b757d939d2ea98faecc202987d012caa390a029d58d1f261584b0`. The full terminal result is distinct from the first receipt-bearing substep. The subsequent source-checkpoint diagnostic supplies the exact local commit and archive-recovery proof; this report does not fabricate that later identity.

Candidate inputs were left unchanged during the replacement run. Original Phase 178 SHA-256 remains `dc1790751b66dcf48a7829738826e5051ebbaad66eed1169cc628af26b8cf4f4`, the 33-article JSON remains `e2fd76e4b53e638523696fb47ed4ae04bc5d073d3b22e6731e02603078d1f230`, and the dependency lockfile remains `d5c0cf14413b5b975290875e86ea9329f0380d92ba05b32c9dc0fd9ddb53b3d8`. The translation and annual-review documents below are local review material outside that public candidate digest. No new browser/UI automation was performed.

## Translation pilot delivered for review

The [pilot guide](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/translation-pilots/review-guide.md>) accompanies complete French and Spanish draft translations of the existing Advanced Manufacturing plain-English overview and six sections. The manifest pins the English payload, original contracts, source-profile files, URLs and draft files. It distinguishes the later reader draft from the canonical translation contract; that mapping still needs human editorial agreement.

`node app/scripts/assert-translation-pilots.mjs` passes structural/version checks and rejects invented approval fields. This is not language-quality or factual certification. Two local samples exist, zero human-approved translations exist, and all 34 original translation contracts remain held. No public translated-content field was populated.

## Annual sample reviewed against retained records

The [six-case desk review](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/annual-six-case-desk-review.md>) covers TSMC, Toronto, Hornsdale, Dalrymple, Montana and NNSA. It binds exact article/receipt hashes, records two wording/attribution proposals and identifies source-context gaps. These are assisted local comparisons, not fresh primary-source checks or independent approvals.

After the candidate has a terminal result and recovery checkpoint, the next bounded edit is Toronto's adoption/permission clarification and exact later-receipt context. Hornsdale/Dalrymple need explicit artifact-scoped associations; Montana's different source identity must not be joined automatically. No historical receipt route list or measurement observation was rewritten in this pass.

## Remaining requirements

The full six-stage goal remains open: finish changed-candidate validation/recovery; implement and verify the content corrections; obtain actual claim, identity/eligibility, translation and backlog decisions; test real readers and assistive technology; resolve measurement evidence; obtain scope/deployment/launch authority; and collect an actual operating month if launched. These review artifacts do not replace those outcomes.
