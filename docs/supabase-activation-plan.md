# Supabase Activation Plan

Date: 2026-07-22

## Decision

Activate Supabase after the public data and update-log contracts pass the local production build. Phase 51 dossier research is valuable product work, but it is not a backend activation dependency.

The first Supabase stage is a private authority-loop backend. Git remains the public publishing source of truth until the private workflow has produced and exported several reviewed changes reliably.

## Pre-Activation Gate

- Stable record IDs and cross-record validation: complete.
- Public update-entry schema and visible log: complete in the Phase 52A branch.
- Allowlisted, versioned source/topic/Published-signal exports: complete in the Phase 52A branch.
- Documented public/private field boundary: complete in `docs/public-data-exports.md`.
- Phase 54 production and release verification: complete at 210 generated pages, including exact public-export, update-log, source-currentness, sitemap, canonical, robots, and indexing assertions. Phases 55B-55C subsequently revalidated the expanded 218-page package without changing the public/private contract.

These are not activation blockers:

- finishing every Phase 51 Arizona and Ontario dossier record,
- populating the full 150-to-250 candidate registry,
- automating source probes,
- moving public content out of Git,
- publishing more signals.

## First Backend Slice

Create only the private workflow tables needed to learn whether the system improves editorial throughput:

| Table | Purpose |
| --- | --- |
| `profiles` | Map authenticated users to an editorial role. |
| `source_candidates` | Hold unpromoted candidate sources separately from the public source registry. |
| `source_snapshots` | Store a fetched or manually captured source state and retrieval metadata. |
| `review_items` | Track candidate, recheck, repair, and publication-review work. |
| `editorial_events` | Preserve append-only review and status history. |
| `probe_configs` | Define disabled-by-default source checks without storing secrets in rows. |

## Security And Publication Boundary

- Use Supabase Auth for the private Studio.
- Enable Row Level Security on every private table before adding data.
- Browser code uses only the project URL and publishable key.
- Service-role credentials and third-party API keys stay in server-side secrets.
- No database trigger, webhook, cron job, or Edge Function may change a public record or export directly.
- Approval produces a reviewed Git change; content validation and the production build remain the publication gate.

## Activation Sequence

1. Create a hosted development project, not the production project.
2. Install or verify Docker Desktop and the Supabase CLI.
3. Initialize `supabase/`, link the development project, and create the first migration.
4. Add Auth, roles, RLS policies, and the six private tables.
5. Build the smallest private Studio surface: queue list, item detail, status transition, and event history.
6. Run two manual source probes through the review workflow.
7. Keep public content in Git while measuring whether the workflow reduces review friction.

## Credentials Needed From The Owner

- A Supabase account and organization.
- A hosted development project name and database password stored by the owner.
- Browser-based CLI login when requested.

Do not send account passwords, database passwords, service-role keys, access tokens, or recovery codes in chat. Enter them only in the Supabase or CLI authentication surface that requests them.
