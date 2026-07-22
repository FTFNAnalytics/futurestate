# Phase 52B Work Package: Private Candidate Registry And Authority Surfaces

Date: 2026-07-22

## Objective

Finish the three deferred Phase 52 items without changing public visibility:

1. create a private source-candidate registry with a fixed 150-record target,
2. improve Source Monitor grouping around review state and next action,
3. improve Source Coverage summaries for strong and weak lanes.

## Completed Result

- Created a local-only registry with 150 candidates across 15 evidence profiles.
- Completed a first triage pass on 30 candidates and retained 120 as `Needs Triage`.
- Added schema validation, exact-count and profile-balance checks, active-source duplicate checks, and an optional link-audit command.
- Kept the registry outside Git and the public build because the project repository is public.
- Added a release assertion that scans generated output for private candidate IDs and registry-path leakage.
- Grouped Source Monitor into Review Due, Watch Soon, Current / High Priority, and Current / Maintenance lanes.
- Added a specific next action to each source queue row and a watch-lane review map.
- Classified Source Coverage lanes as Strong, Developing, or Weak using source depth, Tier 1 support, probe readiness, and overdue review state.
- Added explicit strong- and weak-lane summaries plus a gap-led next action for every lane.

## Registry Shape

| Measure | Result |
| --- | ---: |
| Candidates | 150 |
| Profiles | 15 |
| Candidates per profile | 10 |
| First-pass triaged | 30 |
| Needs triage | 120 |
| Added to public source library | 0 |

The profiles cover official cross-cutting rails and the project’s primary domain, discovery, and local-system evidence needs. Each candidate includes identity, ownership, jurisdiction, access, credibility, evidence-use, and human-next-action metadata.

## Privacy And Publication Boundary

The live registry is `private-data/source-candidates.json`, excluded through `.gitignore`. The tracked workflow is documented in `docs/private-source-candidate-registry.md`.

Candidate presence never establishes authority or permits publication. Promotion still requires a bounded record, explicit evidence limits, schema-valid public source metadata, human review, and the existing Git publication gate.

## Verification

Required local checks:

```powershell
npm.cmd run validate:candidates
npm.cmd run validate:content
npm.cmd run source:health
npm.cmd run check
npm.cmd run build
npm.cmd run verify:release
```

The candidate validator confirms count, profile balance, required fields, controlled values, uniqueness, and separation from the 114 active public sources. The release verifier confirms that the static output does not contain private candidate IDs or the private registry path.

The optional live-link audit could not produce meaningful results in the current execution environment because all outbound Node fetches failed at the network layer. Official-source browser/search spot checks were used for representative rails; remaining links must be confirmed during their human triage or from a network environment that permits the audit.

Focused browser checks also passed on Source Monitor and Source Coverage. The coverage page rendered its 9 Strong, 4 Developing, and 1 Weak lane summary at desktop and mobile widths. The monitor exposed Review Due, Watch Soon, Current / High Priority, and Current / Maintenance groups at mobile width with no document overflow. Neither page emitted a browser warning or error.

## Boundaries Preserved

- No candidate was promoted publicly.
- No signal publication state changed.
- Public source, signal, topic, update, and page counts remain unchanged.
- No Supabase project or database was required.
- No deployment, hosting connection, DNS change, or public launch occurred.
- Git and human review remain the publication gate.

## Next Use

Use the registry in small evidence-gap-led review batches after the v0.2 release candidate is preserved. Start with the remaining 120 untriaged records, but prioritize current weak coverage lanes and unresolved Arizona/Ontario dossier questions rather than working numerically from candidate 031 onward.
