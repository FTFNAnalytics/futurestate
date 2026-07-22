# Phase 02 Work Package: Information Architecture and Sample Records

This work package turns the FTFN documentation architecture into a testable product structure.

## Objective

Test whether the current framework can support real product surfaces and realistic records before choosing the technical stack.

This phase does not build the website. It defines the first sitemap, page types, reader journeys, source records, sample signals, topic records, and local system profiles.

## Inputs

Required context:

- [README](../../README.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Source Strategy](../source-strategy.md)
- [Decision Log](../decision-log.md)
- [Phase 01 Work Package](phase-01-documentation-and-architecture.md)

## Deliverables

- [x] Phase 02 work package
- [x] Information architecture document
- [x] Sample records document
- [x] Sitemap
- [x] Page types and required modules
- [x] MVP navigation
- [x] Reader journeys
- [x] First 10 source records
- [x] First 10 sample signal records
- [x] First 3 topic records
- [x] First 2 local system profile records
- [x] Notes on what sample records reveal
- [x] Updated README
- [x] Updated master roadmap
- [x] Updated decision log

## Checklist

### Information Architecture

- [x] Define MVP navigation.
- [x] Define full future navigation.
- [x] Draft sitemap.
- [x] Define page types.
- [x] Define required page modules.
- [x] Define reader journeys.
- [x] Identify implementation implications for the technical stack decision.

### Sample Records

- [x] Create 10 source records.
- [x] Create 10 sample signal records.
- [x] Create 3 topic records.
- [x] Create 2 local system profile records.
- [x] Mark sample records as modeling samples, not publish-ready content.
- [x] Identify schema gaps revealed by the samples.

### Existing Docs

- [x] Update README links.
- [x] Update roadmap immediate next steps.
- [x] Add decision log entries.
- [x] Update taxonomy where Phase 02 exposed missing topic pillars.
- [x] Update content model where Phase 02 exposed draft/publish needs.

## Acceptance Criteria

This phase is complete when:

- a reader-facing sitemap exists,
- MVP navigation is distinguishable from future navigation,
- every major page type has required modules,
- reader journeys show how the site will be used,
- sample records test the signal model across multiple pillars,
- source records include credible official and company sources,
- local system profiles test the contextual transduction model,
- schema gaps are documented,
- the roadmap points to the stack decision and implementation planning.

## Open Questions

- Should FTFN launch with `Roadmaps` and `Data` visible, or hold those until there is enough content?
- Should sample records become real seed files in a `/content` or `/data` directory next?
- Should local system profiles be public at MVP, or internal analysis objects first?
- Should source records live in YAML, JSON, MDX frontmatter, or a database?
- Should signals use Markdown body content plus structured frontmatter?
- Which page type should be implemented first in the website prototype?
- How much of the 42/59 Index should appear in the MVP UI?

## Recommended Next Work Package

After this phase, create:

```text
docs/work-packages/phase-03-technical-stack-and-content-scaffold.md
```

Suggested scope:

- choose technical stack,
- choose MVP content storage format,
- create content/data directory structure,
- convert sample records into seed files,
- scaffold the website,
- implement homepage, signal index, signal detail, topic index, and topic detail pages.

## Completion Notes

Status: first pass complete as of 2026-05-26.

The next major decision is the technical stack. The sample records suggest a static-first or hybrid content approach will work well if it preserves structured records, frontmatter validation, and later migration to a database.

