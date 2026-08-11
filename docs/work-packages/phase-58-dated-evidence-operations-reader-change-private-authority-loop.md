# Phase 58 Work Package: Dated Evidence Operations, Reader Change Products, and Private Authority Loop

Status: operating slice complete and locally release-validated in content commit `26da2fbfeb6c7da5a6c75338ea907663c0fe1301`; external Supabase activation and owner-only deployment pending

Captured: 2026-08-11

## Goal

Operate the evidence system as a repeatable editorial product. Put the ten held result and outcome signals on exact dated rails, make evidence decisions visible even when a record does not change, measure the operating loop without creating a score, and define a private review backend that cannot bypass Git or human publication review.

## Delivered operating slice

- one bounded queue covering exactly the ten result and outcome signals held by Phase 57Z;
- ten exact next artifacts, ten stop rules, ten review cadences, and ten next-check dates;
- Change Note, Watch Note, Correction, and No Material Change receipt contracts;
- one August 11 DARPA canonical-page check and reader-visible No Material Change receipt;
- one Published Research Watch 057 briefing and one public update;
- one sixth static public-data contract at `/data/evidence-queue.json` with ten public records;
- optional receipt fields rendered on the existing Updates route;
- source-check latency, decision latency, stale exposure, reversibility, and qualitative reader-usefulness observations without a readiness score;
- one local Supabase declarative authority schema with five forced-RLS tables, explicit authenticated grants, append-only review receipts, dual-control export, and a security-invoker public projection;
- one deterministic authority-loop harness covering role denial, ownership, assigned review, self-review rejection, dual control, private-field exclusion, and zero direct publication.

## Ten-item queue

| Gate | Exact next artifact | Next check |
|---|---|---|
| DARPA Lift Challenge results | dated DARPA measured results, winners, and prize decisions | 2026-08-14 |
| Amtrak PIDS closeout | final FRA-accepted closeout tied to scope and deployment denominator | 2026-09-10 |
| Amtrak named-asset reliability | repeated stable-identity reliability series | 2026-10-09 |
| Louisiana Nextlink adoption | observed subscription or take rate for a fixed eligible cohort | 2026-09-09 |
| Louisiana Starlink adoption | observed installations or subscriptions for a fixed eligible cohort | 2026-09-01 |
| Montana BEAD completed quarter | complete public quarterly project outcome with stable denominator | 2026-09-15 |
| Hanford material balance | compatible feed-to-output material balance with reconciliation | 2026-09-10 |
| NNSA recurring qualified rate | repeated accepted qualified-output series | 2026-10-09 |
| NNSA accepted capacity | final accepted capacity tied to configuration, criteria, and observed output | 2026-09-24 |
| NNSA GAO enterprise baseline | final integrated baseline and GAO closure for GAO-23-104661 | 2026-09-10 |

## First dated receipt

The canonical DARPA Lift Challenge page was reviewed on August 11, 2026. It links an event guide and scoreboard surface, but the reviewed DARPA page does not publish a final results table, winner, measured scores, or prize decisions. The source profile advances to August 11, the next check is August 14, and the underlying signal remains In Review.

The decision is a No Material Change receipt. It is limited to the canonical DARPA page and official surfaces reviewed on the captured date. It does not establish that results do not exist, were not announced elsewhere, or will not be published.

## Receipt contract

- **Change Note:** evidence materially changes a reviewed public record.
- **Watch Note:** the watch posture or next artifact changes without changing a public record.
- **Correction:** a reviewed public claim, identity, date, denominator, or interpretation was inaccurate.
- **No Material Change:** a bounded check did not satisfy the exact record gate.

Every receipt carries a source-check date, decision date, prior state, current state, bounded finding, evidence boundary, publication effect, affected records, and next check date. A receipt cannot publish until a human-reviewed static diff passes the existing serializers and release checks and is committed to Git.

## Operating measures

- source-check latency: one day for the first scheduled DARPA operating check;
- decision latency: same-day bounded decision;
- stale-source exposure: zero of ten queue items at the August 11 checkpoint;
- publication reversibility: static Git change plus rebuild, with no live public-database mutation;
- reader usefulness: exact artifact, checked date, next date, and stop rule are public for every gate;
- composite readiness, confidence, or performance score: none.

## Private authority foundation

The local declarative schema defines `source_candidates`, `review_queue`, `update_candidates`, `review_receipts`, and `export_batches` in a private `authority` schema. All five tables enable and force RLS. `anon` receives no authority grant. Authenticated policies require an `app_metadata.ftfn_role` claim plus ownership or assigned-review conditions. Update policies use both `USING` and `WITH CHECK`; review receipts are append-only; export batches require two distinct reviewers; and the reviewed projection uses `security_invoker = true` while excluding private notes.

No database function, trigger, webhook, Edge Function, Realtime publication, AI publication workflow, or service-role browser client exists. The database design can prepare a reviewed public payload only; it cannot write static content or publish a claim.

## Supabase activation boundary

No Supabase project, organization, login, link, API schema exposure, Auth user, key, migration application, Studio connection, local Docker stack, or remote command was created. The workspace did not have the Supabase CLI or Docker, and an exact project-local CLI install did not complete. The repository therefore includes a declarative design and deterministic harness, not a fabricated migration or runtime RLS result.

External activation requires a separate approval. When approved, create the migration with the then-current pinned CLI, apply it to a local stack, test anon/editor/reviewer/admin behavior, back up the environment, demonstrate several reviewed changes, and only then consider a remote development project.

## Validation checkpoint

The Phase 58 authority harness, Phase 58 assertions, Phase 57Y and Phase 57Z regressions, private-candidate validation, content-reference validation, source health, Astro diagnostics, the 3,867-page production build, public export boundaries, sitemap, canonical, robots, required outputs, and full v0.2 release assertions pass.

The verified candidate contains 715 sources, 1,406 signals, 1,120 Published signals, 286 In Review signals, 61 research collections, 1,533 research documents, 65 briefings, 81 updates, six JSON exports, ten evidence-queue records, 1,326 research export records, and 501 Published-support sources.

## Next gate

Operate the DARPA check on August 14 and the remaining queue dates without treating a negative check as nonexistence. If desired, separately authorize the private Supabase development pilot. Owner-only deployment, v0.2 freeze, public GitHub synchronization, DNS, custom-domain attachment, public access, and launch remain distinct approvals.
