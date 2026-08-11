# Phase 58 private authority-loop foundation

This directory defines the local-only database contract for a possible private candidate and review pilot. It does not represent an activated, linked, or deployed Supabase project.

## Current boundary

- `schemas/phase58_private_authority_loop.sql` is a declarative schema design. It has not been applied to a local or remote database.
- No Supabase project, organization, login, link, key, environment, exposed custom schema, or Studio user was created.
- The environment did not have the Supabase CLI or Docker. An exact project-local CLI install could not complete, so no migration file or database-reset result is claimed.
- When activation is separately approved, install and pin the current stable CLI as a project development dependency, read `npx supabase --help`, run `npx supabase init`, create the migration with `npx supabase migration new phase58_private_authority_loop`, copy the reviewed schema into that generated migration, and verify it with a local `npx supabase db reset` before linking any remote project.

## Security model

The custom `authority` schema is private by default. `anon` receives no schema or table privileges. Authenticated access requires the small `app_metadata.ftfn_role` claim (`editor`, `reviewer`, or `admin`) plus row-level policies. Authorization data must never come from user-editable metadata. Role changes require token refresh, and suspected access compromise requires session revocation rather than waiting for token expiry.

Every table enables and forces RLS. Grants are explicit because new Supabase projects no longer expose newly created public tables automatically. Update policies include both `USING` and `WITH CHECK`; append-only review receipts have no update or delete grant. The reviewed export view uses `security_invoker = true` and omits private notes.

## Publication boundary

The database can prepare an export candidate only. It cannot write to the static site, merge Git, run the release, or publish a claim. A human must export the reviewed public projection, inspect the diff, pass content and release validation, and commit the static change.

No database function, trigger, webhook, Edge Function, Realtime publication, AI workflow, or service-role browser client is part of this design.

## Activation checklist

1. Create separate development and production environments; activate development first.
2. Keep publishable client configuration separate from server-only secrets. Never commit a secret or service-role key.
3. Configure only the `authority` schema if a private Data API is genuinely required, then verify every explicit grant and RLS policy as `anon`, `authenticated editor`, `authenticated reviewer`, and `authenticated admin`.
4. Create at least two human test accounts and refresh their JWTs after assigning `app_metadata.ftfn_role`.
5. Apply the generated migration locally, run database and policy tests, then run the deterministic repository harness.
6. Export reviewed public projections to a temporary file, compare them with the static content contract, and require a human Git commit.
7. Before any remote push, record a schema dump, data-only backup for private candidate state, recovery owner, key-rotation owner, and rollback command. Never run `db reset --linked` outside a disposable environment.
8. Demonstrate several reviewed changes and one rejected candidate before considering a broader migration.

## Rollback

Application rollback is a Git revert plus a fresh static build. Database rollback is a reviewed forward migration or restoration into a new development environment from the recorded backup; do not erase a linked remote database to undo a production change. Revoking the Data API schema or authenticated grants is the emergency containment action if private-field exposure is suspected.
