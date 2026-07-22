# Phase 03 Work Package: Technical Stack and Content Scaffold

This work package chooses the FTFN MVP technical stack and defines the first content/data scaffold.

## Objective

Choose a stack that fits FTFN's current shape: an editorial, structured, content-heavy future-state intelligence platform that needs strong validation, relationship links, static performance, and a clean path toward future ingestion, search, data views, and database-backed workflows.

This phase does not build the full website.

## Inputs

Required context:

- [README](../../README.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Decision Log](../decision-log.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Source Strategy](../source-strategy.md)
- [Information Architecture](../information-architecture.md)
- [Sample Records](../sample-records.md)
- [Phase 02 Work Package](phase-02-information-architecture-and-sample-records.md)

## Deliverables

- [x] Phase 03 work package
- [x] Technical stack decision
- [x] Content scaffold plan
- [x] MVP stack comparison
- [x] MVP stack recommendation
- [x] Growth path
- [x] Content storage decision
- [x] Proposed repository structure
- [x] Seed content decision
- [x] Validation requirements
- [x] Public versus internal field guidance
- [x] Updated README
- [x] Updated master roadmap
- [x] Updated decision log

## Checklist

### Stack Decision

- [x] Compare static-first site.
- [x] Compare Next.js or similar app framework.
- [x] Compare Astro or similar content-first framework.
- [x] Compare headless CMS.
- [x] Compare local Markdown/MDX plus structured YAML/JSON.
- [x] Compare database-backed approach.
- [x] Recommend an MVP stack.
- [x] Recommend a growth path.

### Content Scaffold

- [x] Decide storage format for signals.
- [x] Decide storage format for sources.
- [x] Decide storage format for topics.
- [x] Decide storage format for organizations.
- [x] Decide storage format for technologies.
- [x] Decide storage format for local system profiles.
- [x] Decide storage format for briefings.
- [x] Propose folder structure.
- [x] Decide when sample records become seed files.

### Validation

- [x] Define first validation requirements.
- [x] Identify required collections.
- [x] Identify public fields.
- [x] Identify internal-only fields.
- [x] Identify draft versus publish validation differences.

### Existing Docs

- [x] Update README links.
- [x] Update master roadmap immediate next steps.
- [x] Add decision log entry.
- [x] Update documentation map.

## Acceptance Criteria

This phase is complete when:

- the MVP technical stack is chosen,
- tradeoffs are documented,
- the content storage plan is explicit,
- a repository scaffold is defined,
- validation requirements are written,
- sample-record conversion timing is decided,
- the roadmap points to the first implementation step.

## Open Questions

- Should Phase 04 scaffold the Astro app immediately, or first create content files only?
- Should MVP search use a static search index, client-side filtering, or both?
- Should local system profiles be public at launch or internal-only until better sourced?
- Should FTFN use Tailwind, plain CSS with design tokens, or another styling path?
- Should the first app include MDX support immediately or start with Markdown only?
- Should early seed records remain "Draft Sample" or become "Draft" records after editorial review?

## Recommended Next Work Package

After this phase, create:

```text
docs/work-packages/phase-04-app-scaffold-and-seed-content.md
```

Suggested scope:

- scaffold Astro + TypeScript project,
- configure content collections and schemas,
- create content directories,
- convert sample records into seed files,
- add basic validation,
- build homepage, signal index, signal detail, topic index, and topic detail skeletons,
- run the first local build.

## Completion Notes

Status: first pass complete as of 2026-05-26.

FTFN should use Astro with TypeScript and Astro content collections for the MVP. This preserves static performance, structured content, Zod validation, Markdown/MDX editorial writing, and a future path to remote loaders, a CMS, or a database.

