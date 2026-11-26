# Phase 216 VPS production preparation

Recorded November 25, 2026, following the owner's request to proceed with the next steps and advise when DNS can move.

**DNS cutover is not ready.** FTFN's inactive HTTP configuration passes a combined Nginx configuration test, and an HTTPS configuration template is prepared. The VPS has no FTFN certificate yet. The authoritative DNS zone backup, certificate validation and remaining release checks must be completed before activation.

## Completed preparation

The existing VPS at `168.231.74.70` still has the public Nginx configuration digest `1399bc2f8b407165d63314285362d0011d1993358d7544a195c448a4492394dc` and master PID `3560039`. Its service is active. No public reload or restart occurred, and there is still no active FTFN virtual host. The approved staged candidate and all existing websites were left unchanged.

New files are confined to `/srv/ftfn-staging/20261125T231220Z/production-prep`:

- `http.conf`: an inactive port-80 host for `ftfn.io` and `www.ftfn.io`, with an ACME challenge webroot and a 503 hold for other requests.
- `https.conf.template`: proposed HTTP-to-HTTPS and www-to-apex redirects, static delivery from the verified release, hidden-file exclusion and candidate headers. Actual certificate paths are deliberately unresolved. It is not enabled or certified as TLS-ready.
- `control/combined-http-test.conf`: a copy of the existing top-level configuration plus the new HTTP host, used only with `nginx -t`.
- `control/before.json` and `control/prepared.json`: before/after checks and terminal test results.

The first isolated syntax test failed at 23:53:50 UTC because existing relative `fastcgi_params` includes resolved relative to the relocated test configuration. The test harness was corrected with scoped include links inside its private control directory; the live configuration was not edited. The combined test then exited 0 at 23:54:42.178 UTC. It reported server-name hash optimization warnings; no global tuning was performed. HTTPS validation remains pending a real certificate, and a later production activation needs a fresh full configuration test.

Certbot 2.9.0 is already installed, its renewal timer is active, and one existing production ACME account was found. Public certificate metadata showed no certificate covering FTFN. No certificate request, account registration, private-key export, dependency installation, firewall change or security weakening occurred. An active general renewal timer is not proof of a configured FTFN renewal.

## DNS observations and owner action

Bounded queries to `solar.dns-parking.com` returned:

| Record | Observed value |
| --- | --- |
| Nameservers | `solar.dns-parking.com`, `lunar.dns-parking.com` |
| Apex A | `198.49.23.145`, TTL 14,400 |
| www CNAME | `ghs.googlehosted.com`, TTL 14,400 |
| MX | Google: `aspmx.l.google.com` and `alt1` through `alt4.aspmx.l.google.com` |
| Apex TXT | `v=spf1 include:_spf.google.com ~all` |
| Apex AAAA / CAA and `_dmarc` TXT | No matching answer in these bounded queries; SOA responses retained in the inspection log |

These are selected authoritative answers, not a full zone export. They do not enumerate DKIM selectors, service subdomains or all verification records. The owner has been asked to supply a Hostinger DNS-zone export or screenshots showing every record. No A, CNAME, TXT, MX, nameserver or other DNS record was changed.

The intended eventual web-routing targets are apex A `168.231.74.70` and www CNAME `ftfn.io`, after checking the complete zone for conflicting web records. This is a proposed target, **not an instruction to apply the change now**. Preserve Google MX/SPF, every existing DKIM/verification/service record and the nameservers. Preserve the actual prior web records and TTLs for restoration.

For pre-cutover HTTPS, DNS-01 validation can prove control using temporary `_acme-challenge` TXT values without moving the website's A/CNAME records. Those values must come from an actual ACME request; none have been generated. Manual DNS issuance also requires an explicit renewal plan, such as switching to tested webroot renewal after cutover; it is not automatically renewable merely because Certbot's timer exists. See [Let's Encrypt challenge types](https://letsencrypt.org/docs/challenge-types/) and [Certbot manual validation](https://eff-certbot.readthedocs.io/en/stable/using.html#manual).

## Remaining acceptance checks

| Check | Current state |
| --- | --- |
| Exact staged candidate and static-file verification | Passed in the earlier [staging report](phase-216-vps-staging-2026-11-25.md); bytes unchanged |
| Inactive HTTP host with existing Nginx configuration | Passed; not activated |
| Certificate and apex/www HTTPS validation | Pending |
| Full DNS-zone preservation and cutover/restore plan | Awaiting owner export or screenshots |
| Browser-managed ZIP save | Still unverified; browser control returned `service_info` timeouts twice after session reinitialization. No browser navigation, download or input succeeded this turn. Earlier exact ZIP HTTP checks remain valid but do not establish a browser save. |
| November 25 Amtrak named-asset reliability and NNSA recurring-rate follow-ups | Still independently due in saved receipts; latest decisions remain October 28. This preparation turn performed no new evidence inspection or propagation. |
| VPS production activation and withdrawal/rollback | Not executed; private restart from the earlier stage is not public rollback acceptance |
| Public launch and thirty-day stewardship | Not started |

Before release, reconcile both due evidence operations using their actual inspection dates and required propagation. If candidate inputs change, complete fresh applicable validation and restage the exact accepted artifact. Do not attach the old validation receipt to changed bytes. Browser-service recovery and DNS access are separate from source-evidence completion.

## Activation and recovery sequence

1. Capture the full DNS zone and confirm the website-only records to replace. Keep the current public routes untouched during preparation.
2. Obtain a certificate covering both names through a verified control-validation path; validate its names, validity, key match and chain without disabling TLS verification. Set and test the renewal method.
3. Complete the pending browser, source-evidence and release checks. Recheck artifact identity, disk availability and the current Nginx baseline immediately before activation.
4. Finalize the dedicated FTFN configuration with actual certificate paths, test it alongside all existing hosts, and exercise the scoped holding/withdrawal response before approved activation. Do not overwrite or restore the entire shared Nginx configuration.
5. Only then tell the owner that the web-routing records can move. Coordinate the cutover, verify both names and HTTPS/redirects from the public side, and compare email/verification records against the captured zone. Retain the former website routes throughout propagation.
6. If a check fails, keep or return FTFN to its holding state, restore only the captured website-routing records when required, and leave every unrelated host unchanged. DNS restoration is not instantaneous; clients may retain cached answers. The retained Sites version 80 remains owner-only and is not represented as a tested VPS rollback target.

No new public authority is inferred from a successful syntax check. The earlier conditional Reference Beta approval remains subject to its checks. Phase 60 and Phase 216 stay open.

Machine receipt: [production preparation](../deployment/phase-216-vps-production-preparation-2026-11-25.json). Local command logs and helpers: `outputs/phase216-vps-production-prep-2026-11-25/`. The previous stage's private preview and tunnel remain stopped. No commit, push or deployment activation occurred in this turn.
