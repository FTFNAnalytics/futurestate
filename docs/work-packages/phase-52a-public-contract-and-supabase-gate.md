# Phase 52A: Public Contract And Supabase Gate

Date: 2026-07-22

## Goal

Complete the smallest useful pre-Supabase build slice: make material changes visible, make public metadata reusable, and lock the public/private contract before introducing a database.

## Implemented

- added the schema-backed `updates` collection,
- added three evidence-linked historical update entries,
- added `/updates/` and linked it from Method and the global footer,
- defined correction, source refresh, signal repair, publication promotion, and archive entry types,
- added versioned `/data/sources.json`, `/data/topics.json`, and `/data/signals.json` exports,
- restricted signal exports to `Published` records,
- excluded editorial notes, source notes, automation instructions, and body copy through explicit serializers,
- extended content validation to check update-log record references,
- documented the export contract and staged Supabase activation boundary.

## Boundary

This phase does not create a Supabase project, add a database client, move public records out of Git, automate ingestion, publish review records, deploy the site, or change DNS.

Phase 51 dossier deepening can continue independently and is not a Supabase activation blocker.

## Verification

```text
npm.cmd run validate:content
passed: 102 sources, 22 signals, 17 topics, 3 updates, and all reference collections

npm.cmd run check
passed: 0 errors, 0 warnings, 0 hints

npm.cmd run build
passed: 0 errors, 0 warnings, 0 hints; 187 page(s) built
```

Generated export inspection passed:

- 102 source records at schema `1.0`,
- 17 topic records at schema `1.0`,
- three Published signal records at schema `1.0`,
- no exported `editorial_notes`, source `notes`, or `automation_notes` fields,
- `/updates/` is present in the generated sitemap.

## Next

After review and merge, create a hosted Supabase development project and implement the private authority-loop tables, Auth, and RLS described in `docs/supabase-activation-plan.md`.
