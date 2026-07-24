# Phase 55D: Owner-Only Sites Preview

Date: 2026-07-22

## Objective

Deploy the exact verified FTFN v0.2 candidate to an access-restricted hosted URL, verify the live reader and trust surfaces, and stop before custom-domain or Hostinger DNS work.

## Hosted Checkpoint

```text
Provider: OpenAI Sites
Hosted URL: https://ftfn-analytics.jbumstead.chatgpt.site
Access: owner-only custom access policy
Allowed users: 1
Allowed groups: 0
Initial hosted application commit: bb3d92f
Package: 0.2.0-dev
Static pages: 218
Sources: 120
Signals: 35
Publication: 9 Published, 25 In Review, 1 Draft Sample
```

The Sites source repository contains the exact deployment checkpoint. The development branch remains unpushed to the public GitHub repository, and the ignored private candidate registry was not included in the hosted source or static output.

## Deployment Adaptation

FTFN remains an Astro static site. A minimal static-worker adapter packages the existing `dist/` output for Sites without changing reader-facing content, routes, canonical URLs, publication states, or export contracts.

The adapter:

- places the verified static output behind the Sites asset binding,
- preserves directory-style route handling,
- keeps `https://ftfn.io` as the eventual canonical domain,
- adds no database, account system, analytics, ingestion, or automated publishing behavior.

## Post-Deploy Verification

The hosted preview passed these checks:

- homepage renders with the FTFN brand, 42/59 framing, and current 35-signal, 120-source counts,
- Signals, Source Monitor, Method, one Published signal, and the Project Baccara `In Review` signal render successfully,
- Published signal detail uses `index, follow`,
- Project Baccara remains `noindex, follow`,
- canonical links continue to point to `https://ftfn.io`,
- hosted `robots.txt` returns 200 and references the canonical sitemap,
- hosted `sitemap.xml` returns 200, includes the sampled Published signal, and excludes the sampled `In Review` signal,
- hosted source export returns 200 with exactly 120 records.

## Boundary

This is an owner-only hosted checkpoint, not a public launch. No Hostinger record, nameserver, Google Workspace mail record, package version, analytics setting, or public access policy changed.

## Next Decision

Choose one separately approved path:

1. Keep the owner-only preview and continue bounded content work.
2. Approve public access and request the exact Sites custom-domain records for `ftfn.io` and `www.ftfn.io`.
3. Inventory the Hostinger DNS zone, preserve Google Workspace MX/SPF/DKIM/DMARC and verification records, add only the required website records, and verify both the site and email.

The custom-domain and public-access steps must not be inferred from this preview deployment.
