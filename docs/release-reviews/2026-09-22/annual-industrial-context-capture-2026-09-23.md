# Safety reading: industrial-context artifacts recovered

September 23, 2026 (America/Edmonton). This supplements, rather than rewrites, the earlier [metadata/access follow-up](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/annual-industrial-context-source-check-2026-09-23.md>). It supplies assisted source locators for `RESTART-03` in `203-SYNTHESIS-10` and paired presentation `200-MONOGRAPH-10`. No article, source-profile date, application notice, reviewer return or admission changed.

## Acquisition and identity

The official [USGS metadata page](https://www.usgs.gov/publications/mineral-commodity-summaries-2026) identifies the publication and links its report and revision history. Earlier web-reader requests returned HTTP 403. A new direct-download method initially failed at the sandbox network boundary (HTTP 000, zero bytes), then succeeded through an approved network request with TLS verification retained. Both report and revision history returned HTTP 200 from their exact official URLs. Those earlier failures remain valid history, not a claim that the successful artifact was previously inspected.

| Artifact | Exact retained identity |
| --- | --- |
| [USGS report](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026.pdf) | 17,646,709 bytes; SHA-256 `595e6e66674236dea40125a03eb1ea6b347f331c0bcf3411a1e77eba53c0d391`; 226 physical PDF pages |
| [USGS revision history](https://pubs.usgs.gov/periodicals/mcs2026/versionHist.txt) | 1,914 bytes; SHA-256 `276d675d1d753697f611c385d0692c865f2c00b8a417c282ff2e8e1f84932e2e` |
| [DOE Thacker Pass HTML](https://www.energy.gov/edf/thacker-pass) | 117,007 bytes; SHA-256 `c395b0449580e1baad09df5c66a93dbf7bcdb3c9c65863e7487cb2b96b6ee9a6` |

The PDF cover and publication-information page identify version 1.3, May 2026. The complete revision-history text identifies initial posting on February 6, followed by versions 1.1 on March 5, 1.2 on April 15 and 1.3 on May 27. The report's own citation says 222 pages; the file has four additional physical front-matter pages. This is not a discrepancy to fix by renumbering citations. Historical versions were not downloaded or compared; the revision descriptions were read, not independently reconstructed.

## Exact visual scope and findings

Nine complete PDF pages were rendered with Poppler and visually inspected, including all continuation pages and footnotes for the selected table and lithium chapter. Text extraction was used for navigation only; an unavailable `pdftotext` executable was replaced by bundled `pypdf`. No browser or desktop automation was used.

| Physical PDF page | Printed locator | Observation and boundary |
| --- | --- | --- |
| 1, 4 | Cover; publication information | Version 1.3 / May 2026, DOI `10.3133/mcs2026`, release/revision statements and the separate associated-data DOI. The associated dataset was not retrieved. |
| 9 | 5, Introduction | Describes report coverage and 2025 production data. Publication year 2026 is not the observation year for those estimates. |
| 15 | 11, Figure 2 and all four footnotes | Net import reliance is presented as a share of apparent consumption in 2025; leading import sources use 2021-24. Coverage exclusions, insufficient-information cases and inequality labels must remain visible. This is not a universal exact-percentage series. |
| 18-19 | 14-15, complete Table 3 and footnotes | Preliminary 2025 production values, in millions of dollars; not production tonnage. Footnotes identify data through December 17, 2025, rounding and withheld values included in the undistributed total. No state value is assigned to an individual project. |
| 122-123 | 118-119, complete Lithium chapter and footnotes | The default unit is metric tons of lithium content unless otherwise specified. U.S. production and apparent consumption are withheld; `W` is not zero. The net-import-reliance entry is a lower-bound category, not an exact percentage. Footnotes define apparent consumption and net imports, identify estimates and exclude U.S. production from the cited world total. These are not interchangeable with DOE's projected lithium-carbonate output. |
| 220 | 216, Appendices A and B | Unit definitions and the limited listed term definitions were inspected. This is not inspection of the separate reserves/resources Appendix C. |

The visible locators support the current paragraph's bounded statement that the report describes national mineral production and import reliance. They do not supply a Thacker Pass incident chronology, corrective-action assessment, restart approval or facility output ledger. No values were extracted into an admitted series or independently reproduced.

## DOE check

The captured DOE page was checked at Project Summary, Project Statistics / Financial Summary, and both closing-related footnotes. It retains October 2024 financing context and expected output once fully operational. Issuance/closing wording is not evidence of later disbursements, construction completion, accepted production or safety performance. No signed loan, amendment, repayment record or current-status investigation was obtained.

## Review integration and remaining proof

The [observation record](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/annual-industrial-context-observations.json>) pins the three captures, nine rendered pages, exact locators and unperformed independent acceptance. The existing annual packet now references separate USGS and DOE supplementary checks for `RESTART-03`; the prior Moss Landing check and all application-bound snapshots remain unchanged. Its previous access-limit report remains pinned alongside this successful continuation. Original source profiles and their historical inspection dates are preserved.

Application candidate remains `4bfbd73ff51f831ec49e5844c6a5923f7b85ee47315a5efeca6305d19a814a0a`, with the existing terminal full-validation receipt `204-FULL-LOCAL-VALIDATION-2026-09-23-e86a599abbc0` and application-source recovery `50520aa5d89713d24c7f9c48c4f8e2d13f0b0fe1`. This is a documentation/evidence continuation, not another application build or a final-candidate fresh installation. Later packet source recovery is recorded separately.

Independent reviewers must still assess the complete paragraph and both presentations, including the negative incident boundary and whether the located issuer evidence is sufficient. All reviewer identity, expertise/conflict, findings and disposition fields remain unperformed. The full selected/annual content, portfolio, backlog, language, actual reader/accessibility, measurement, owner release and operating-month requirements remain open. Nothing was sent or deployed.
