# Public Data Exports

Date: 2026-07-22

## Purpose

FTFN publishes a small, versioned metadata contract that readers can inspect and a later backend must preserve. The exports are generated from the same validated content collections as the public site.

## Endpoints

| Dataset | Route | Scope |
| --- | --- | --- |
| Sources | `/data/sources.json` | Active public source metadata; internal notes and automation instructions are excluded. |
| Topics | `/data/topics.json` | Public taxonomy, constraints, featured-source IDs, and watch questions. |
| Signals | `/data/signals.json` | `Published` signal metadata only; drafts, review records, body copy, and editorial notes are excluded. |

Every response includes:

- `schema_version`, currently `1.0`,
- `dataset`,
- `record_scope`,
- `count`,
- `records`, sorted deterministically.

## Field Policy

The serializers in `app/src/lib/public-data.ts` are the allowlist. New content fields are private by default and do not enter an export until the serializer and this document are intentionally updated.

Source exports include identity, public routes and URLs, classification, coverage, limitations, checked dates, review cadence, monitoring status, and public endpoint metadata. They exclude `notes` and `automation_notes`.

Topic exports include the complete public topic record.

Signal exports include public metadata and relationship IDs for `Published` records. They exclude MDX body copy and `editorial_notes`.

## Cadence And Versioning

The files regenerate with every accepted static build. Content-only changes that preserve field meaning remain within schema `1.0`. Removing or renaming a field, changing its meaning, or broadening the signal scope beyond `Published` records requires a schema-version decision and a public update-log entry.

The exports do not fetch sources, update content, promote records, or publish claims automatically.

## Supabase Contract

During the first Supabase stage, Git content remains the public source of truth. Supabase may hold private candidates, snapshots, review items, and editorial events, but it must not write directly to these exports. An approved editorial change must still pass content validation and the static build before the public datasets change.
