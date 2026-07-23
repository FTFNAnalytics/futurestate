# FTFN Domain DNS Handoff

Date recorded: 2026-07-23

## Current Status

DNS work is on hold because `ftfn.io` is in the middle of a domain transfer.

No Hostinger DNS records, nameservers, Google Workspace records, Sites access settings, or public-launch settings were changed during this step.

Current hosted checkpoint:

- Provider: OpenAI Sites
- URL: `https://ftfn-analytics.jbumstead.chatgpt.site`
- Access: owner-only
- Package: `0.2.0-dev`
- Custom hostnames registered with Sites: `ftfn.io` and `www.ftfn.io`
- Custom-domain status: pending DNS verification

## Important Restart Rule

Re-confirm the required records in OpenAI Sites immediately before changing DNS. The values below are the records returned on 2026-07-23, but provider validation values or routing targets should not be assumed to remain unchanged through a domain transfer.

## DNS Records Returned By Sites

| Type | Host in Hostinger | Full hostname | Value |
| --- | --- | --- | --- |
| A | `@` | `ftfn.io` | `162.159.143.30` |
| A | `@` | `ftfn.io` | `172.66.3.26` |
| CNAME | `www` | `www.ftfn.io` | `custom-domains.chatgpt.site` |
| TXT | `_openai-site-verification` | `_openai-site-verification.ftfn.io` | `openai-site-verification=PaNix4l9dnjGp_skOojmsjoVTiP5iEIvalCZMN8aFZ8` |
| TXT | `_cf-custom-hostname` | `_cf-custom-hostname.ftfn.io` | `7e1847b0-abd7-485b-86c7-05fbf02482a8` |
| TXT | `_openai-site-verification.www` | `_openai-site-verification.www.ftfn.io` | `openai-site-verification=f3yCEOKzBDn4ev-qFaojvcJud_tn-4Fc6DzYlx_TeJA` |
| TXT | `_cf-custom-hostname.www` | `_cf-custom-hostname.www.ftfn.io` | `ee8f7ba5-f32e-416e-b199-96f13a87f88f` |

Hostinger may automatically remove the final dot from a CNAME target. That is acceptable. Use Hostinger's default TTL unless a short launch TTL is deliberately selected during the final preflight.

## Records That Must Be Preserved

Before editing the zone, export or capture the complete authoritative DNS configuration. Preserve:

- every Google Workspace MX record,
- the root SPF TXT record,
- Google DKIM records,
- the `_dmarc` TXT record,
- Google and other domain-verification TXT records,
- CAA records unless the final TLS review requires a deliberate change,
- unrelated subdomain records,
- any records required to complete or verify the domain transfer.

Do not replace the entire DNS zone or change nameservers merely to connect the site.

Only conflicting website-routing records at `@` and `www` should be removed or replaced, and only after the authoritative post-transfer zone has been reviewed.

## Resume Checklist

1. Confirm the domain transfer is complete.
2. Confirm which provider and nameservers are authoritative for `ftfn.io`.
3. Export or screenshot the complete current DNS zone.
4. Re-fetch the custom-domain requirements from OpenAI Sites and compare them with this file.
5. Identify existing `A`, `AAAA`, `ALIAS`, `ANAME`, or `CNAME` records at `@` and `www`.
6. Preserve all mail, verification, transfer, CAA, and unrelated subdomain records.
7. Replace only conflicting web-routing records.
8. Add the current Sites validation records.
9. Wait for DNS propagation and refresh both custom-domain statuses in Sites.
10. Confirm TLS is active for both `https://ftfn.io` and `https://www.ftfn.io`.
11. Confirm the apex hostname is the primary canonical URL.
12. Enable public Sites access only as part of the coordinated production release.
13. Run the full production route, indexing, robots, sitemap, export, desktop, and mobile checks.
14. Record the final DNS state and rollback values in the Phase 56 release documentation.

## Rollback

Keep the pre-change values for `@` and `www`. If routing or TLS verification fails, restore those exact web-routing records without altering the preserved mail and verification records.

## Ready-To-Paste Restart Prompt

```text
Resume the FTFN custom-domain launch from docs/ftfn-domain-dns-handoff.md.

First confirm that the ftfn.io domain transfer is complete and identify the authoritative DNS provider and nameservers. Re-fetch the current OpenAI Sites requirements for both ftfn.io and www.ftfn.io; do not assume the saved validation values are still current.

Inventory and preserve the complete DNS zone, especially Google Workspace MX, SPF, DKIM, DMARC, domain-verification, CAA, transfer, and unrelated subdomain records. Change only conflicting website-routing records at @ and www.

After DNS verification and TLS succeed, coordinate the public-access switch, run the complete production QA checklist, and update the Phase 56 release record. Do not expose credentials or replace the entire DNS zone.
```
