# Phase 55K Work Package: DARPA And U.S. Government Research Collection

Date: 2026-07-23

Status: locally complete and release-verified; owner-only Sites refresh pending

## Goal

Turn the recent DARPA and U.S. Government document set into a usable FTFN research surface rather than a loose reading list. Preserve the original records, summarize each document, connect the findings to the existing dependency stack, and keep stated policy or research direction separate from funded execution and operating outcomes.

## Collection

The collection contains 23 records spanning:

- DARPA's FY2027 budget justification, office-wide solicitations, Disruptioneering vehicle, and 2026 office-focus explanation;
- current White House research, security, AI, resilience, cyber, critical-materials, semiconductor, advanced-nuclear, and 6G policy;
- the 2026 National Defense Strategy and Annual Threat Assessment;
- the Department of Energy's 2026 Draft National Transmission Needs Study;
- the Congressional Research Service defense-emerging-technologies primer.

Capture result:

- 22 official local captures;
- one official-link file for the 2026 National Defense Strategy because the official host allowed review but suppressed automated export;
- one 26-file ZIP bundle containing the 23 records, `README.md`, `collection-summaries.md`, and `manifest.json`;
- SHA-256 checksums, byte sizes, official URLs, and capture status in the bundle manifest.

## Product Changes

- Added `/research/` as a primary navigation destination.
- Added a collection page with all 23 document summaries and one-click bundle download.
- Added 23 document detail pages with findings, FTFN relevance, evidence limits, official-source links, local captures, and connected records.
- Added research links to the homepage, Atlas landing, relevant topic pages, and source profiles.
- Added Published research collection and document routes to the sitemap.
- Added 23 Tier 1 source profiles and five organization profiles.
- Added five bounded `In Review` synthesis signals, one `In Review` briefing, and one `In Review` dependency map.
- Updated selected topic and technology source relationships where the documents directly strengthen the evidence layer.

## Analytical Finding

The collection repeatedly frames frontier technology as a full-stack capacity problem. AI, compute, communications, autonomy, energy, materials, manufacturing, logistics, supply chains, cyber resilience, and institutions appear as connected enabling systems rather than independent technology lanes.

This is direction-setting evidence. The documents do not by themselves establish appropriations, program awards, contracts, successful research, domestic production, facility construction, transmission delivery, adoption, or local outcomes. Those remain the next evidence-conversion stages.

## Current Contract

- 321 generated site pages, excluding the 13 captured official HTML documents copied through `public/downloads/`;
- 176 public sources;
- 50 signals: 25 `Published`, 25 `In Review`, zero `Draft Sample`;
- 17 topics;
- 15 organizations;
- 5 technologies;
- 2 local systems;
- 2 briefings in review;
- 10 evidence gaps;
- 3 dependency maps in review;
- 1 research collection with 23 research documents;
- 13 public update entries;
- 3 versioned public JSON exports;
- 150 private source candidates, all first-pass triaged and excluded from public output.

## Verification

```text
npm.cmd run build:research-archive passed
npm.cmd run validate:candidates      passed
npm.cmd run validate:content         passed
npm.cmd run source:health            passed
npm.cmd run check                    passed
npm.cmd run build                    passed
npm.cmd run verify:release           passed
```

Release assertions confirm:

- 321 generated site pages;
- 176 sources and 25 Published-signal exports;
- 51 current sources supporting Published signals;
- one research collection and 23 document records;
- complete research sitemap membership;
- the 26-file archive in generated output;
- no private candidate ID or registry-path leak.

## Next Content Step

Phase 55L should convert the strongest direction-setting records into implementation evidence. Begin with eight bounded questions across DARPA awards and program activity, appropriations and obligations, critical-material processing capacity, semiconductor equipment and packaging, transmission projects, advanced-nuclear demonstrations, AI infrastructure procurement, and 6G test or standards activity.

For each question, seek a named award, contract, appropriation, facility, field trial, interconnection or transmission action, production milestone, or standards artifact. Repair an existing signal where possible. Keep all new records `In Review` until a separate publication gate.

The dated Phase 55H Toronto Council recheck remains due after the July 29-31, 2026 meeting window.

## Guardrails

- Keep the Sites preview owner-only.
- Do not attach `ftfn.io` or change Hostinger DNS.
- Do not publish the private candidate registry.
- Do not treat a strategy, budget request, or solicitation as proof of funding or delivery.
- Do not promote the five Phase 55K synthesis signals without a separate review.
- Do not freeze `0.2.0` or authorize public launch through this work package.
