// Bounded research performed September 14, 2026, America/Edmonton.
// Direct reads, failed retrievals and indexed excerpts are distinct checks.
const mossAudit='https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/safety-and-enforcement-division/esrb/generation/audits/gao-167-audits/2025-gao-audits/moss-landing-audit-report.pdf';
const gatewayAudit='https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/safety-and-enforcement-division/esrb/generation/audits/gao-167-audits/2025-gao-audits/cpuc-audit-findings-of-gateway-energy-storage-june-2--5-2025.pdf';
const requestUpper='https://www.psc.state.fl.us/library/FILINGS/2025/03321-2025/03321-2025.pdf';
const requestLower='https://www.psc.state.fl.us/library/filings/2025/03321-2025/03321-2025.pdf';
const sitePlan='https://www.psc.state.fl.us/library/filings/2025/02502-2025/02502-2025.pdf';
export const batteryArtifactChecks = [
  {
    check_id:'207-CHECK-MOSS-AUDIT-2025-BOUND', source_ids:['source-56c-moss-landing-audit-2025'],
    url:mossAudit, issuer:'California Public Utilities Commission, Electric Safety and Reliability Branch',
    artifact_date:'Not verified from a direct PDF read; indexed cover is recorded separately',
    observation_period:'Intended 2025 generation-audit report; full findings unread',
    locator:'Exact bound Moss Landing generation-audit PDF', access:'Direct retrieval failed: content length too large, 17,058,600 bytes reported by tool',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The full report could not be inspected through this retrieval.',
    limitation:'A size limit is not evidence of nonexistence or withdrawal. Operator responses and indexed cover text cannot replace the complete audit findings or establish battery-specific operating effects.'
  },
  {
    check_id:'207-CHECK-MOSS-AUDIT-2025-INDEXED', source_ids:['source-56c-moss-landing-audit-2025'],
    url:mossAudit, issuer:'California Public Utilities Commission, indexed official PDF excerpt',
    artifact_date:'2025-06-19, indexed cover-letter date', observation_period:'Cover describes audit work March 3-7, 2025; response requested by July 18, 2025',
    locator:'Indexed opening letter identifying GA2025-06ML and its corrective-action request',
    access:'Official-PDF search excerpt inspected; no complete PDF or image verification',
    evidence_role:'Indexed official excerpt, not full report', access_result:'Indexed excerpt only',
    finding:'The cover identifies a generation audit of Moss Landing Power Plant and requests completed or planned corrective actions, with projected dates for unresolved items.',
    limitation:'The excerpt does not supply all findings, a verified response-extension history or battery-generator mapping. Its response deadline cannot by itself establish that the later operator response violated an unextended deadline.'
  },
  {
    check_id:'207-CHECK-MOSS-AUDIT-2025-RESPONSE', source_ids:['source-56c-moss-landing-audit-response-2025'],
    url:'https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/safety-and-enforcement-division/esrb/generation/audits/gao-167-audits/2025-gao-audits/20250818-ga202506-cpuc-mlpp-audit--vistra-responses-confidential--finalredacted.pdf',
    issuer:'Moss Landing Power Company / Vistra response hosted by CPUC',
    artifact_date:'2025-08-18, signed response date', observation_period:'Response to March 3-7 audit and June 19 findings; company information as of response date',
    locator:'Cover and reservations; complete PDF pages 3-4, especially Findings 4 and 6',
    access:'Relevant text in the 12-page public/redacted response inspected; index 3 screenshot returned Internal Error',
    evidence_role:'Exact bound source', access_result:'Text inspected; visual check unavailable',
    finding:'Findings 4 and 6 retain In progress status even while their response text says the identified repairs or cleanup were completed. The company reserves the ability to supplement its account.',
    limitation:'Preserve the status/prose mismatch instead of choosing a closure. These are operator statements, not CPUC acceptance or battery availability. Referenced evidence folders and confidential material were not independently inspected.'
  },
  {
    check_id:'207-CHECK-MANATEE-REQUEST-2025-UPPER-BOUND', source_ids:['source-56c-manatee-psc-operating-data-2025'],
    url:requestUpper, issuer:'Florida Public Service Commission filing repository',
    artifact_date:'Not verified from direct PDF text; indexed cover separately identifies May 1, 2025',
    observation_period:'Intended FPL 2025 ten-year-site-plan data-request response',
    locator:'Exact upper-case FILINGS path for 03321-2025', access:'Direct retrieval returned Internal Error',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The exact upper-case bound URL did not return a readable PDF.',
    limitation:'This is not proof that the filing is absent. The separately inspected indexed excerpts are partial; byte identity with the lower-case URL has not been verified.'
  },
  {
    check_id:'207-CHECK-MANATEE-REQUEST-2025-LOWER-BOUND', source_ids:['source-56d-manatee-fpl-data-request-2025'],
    url:requestLower, issuer:'Florida Public Service Commission filing repository',
    artifact_date:'Not verified from direct PDF text; indexed cover separately identifies May 1, 2025',
    observation_period:'Intended FPL 2025 ten-year-site-plan data-request response',
    locator:'Exact lower-case filings path for 03321-2025', access:'Initial direct retrieval timed out; bounded retry returned Internal Error',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The exact lower-case bound URL did not return a readable full PDF.',
    limitation:'Do not substitute a similarly numbered Tampa Electric filing or thermal Manatee units for the FPL battery. Indexed excerpts supply only the separately recorded limited context.'
  },
  {
    check_id:'207-CHECK-MANATEE-REQUEST-2025-INDEXED', source_ids:['source-56c-manatee-psc-operating-data-2025','source-56d-manatee-fpl-data-request-2025'],
    url:requestLower, issuer:'Florida Power & Light responses hosted by Florida PSC, indexed official excerpts',
    artifact_date:'Indexed cover: filed 2025-05-01, document 03321-2025, docket 20250000-OT',
    observation_period:'2025 site-plan response; not independently observed interval battery performance',
    locator:'Indexed cover at upper-case bound path; Request 53, page 1 of 1; Request 35 attachment, unit-performance table and notes at lower-case path',
    access:'Official indexed excerpts inspected; full PDF and visual page verification unavailable at both bound paths',
    evidence_role:'Indexed official excerpt, not full report', access_result:'Indexed excerpt only',
    finding:'Request 53 attributes the approximately 409 MW battery siting to winter capacity needs and existing transmission near solar. Request 35 labels its Manatee 1/2 rows ST/NG and Manatee 3 CC/NG: these thermal-unit availability rows are not the battery.',
    limitation:'The source is an FPL response, not a PSC performance determination. No battery availability value is extracted from the thermal rows. Indexed questions do not establish complete-file absence of battery measurements or byte identity between URL-case variants.'
  },
  {
    check_id:'207-CHECK-MANATEE-RATE-TESTIMONY-2025', source_ids:['source-56c-manatee-psc-rate-testimony-2025'],
    url:'https://www.psc.state.fl.us/library/filings/2025/01178-2025/01178-2025.pdf',
    issuer:'Florida Power & Light, Tim Oliver direct testimony hosted by Florida PSC',
    artifact_date:'Filed 2025-02-28, document 01178-2025, docket 20250011-EI',
    observation_period:'Historical 2021 commissioning statements and January 2025 context, alongside future construction claims',
    locator:'Filing cover and witness identity; printed pages 7-9, including Manatee description continued onto page 9',
    access:'Relevant sections of the 55-page PDF inspected; index 9 screenshot returned Internal Error',
    evidence_role:'Exact bound source', access_result:'Text inspected; visual check unavailable',
    finding:'The witness describes Manatee as 409 MW with 2.2-hour duration, within 469 MW commissioned at three sites in 2021. The remaining 60 MW belongs to two other facilities. Solar-panel storm-replacement statistics describe solar assets, not battery reliability.',
    limitation:'Party testimony is not regulatory acceptance or an independently reproduced operating series. Do not assign the full 469 MW fleet to Manatee, transfer solar resilience to the battery, or treat planned construction and claimed customer benefits as observed outcomes.'
  },
  {
    check_id:'207-CHECK-GATEWAY-AUDIT-2025-BOUND', source_ids:['source-56c-gateway-cpuc-audit-2025'],
    url:gatewayAudit, issuer:'California Public Utilities Commission',
    artifact_date:'Full report date not directly verified; audit period visible in indexed page',
    observation_period:'Intended June 2-5, 2025 audit findings', locator:'Exact bound Gateway audit PDF',
    access:'Direct request and later indexed-result open both timed out; no full PDF read',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The full audit remained unreadable in the bounded attempts.',
    limitation:'The search excerpt and operator response are distinct evidence, not a replacement for the complete audit. No conclusion about all findings, present closure, nonexistence or removal follows from timeout.'
  },
  {
    check_id:'207-CHECK-GATEWAY-AUDIT-2025-INDEXED', source_ids:['source-56c-gateway-cpuc-audit-2025'],
    url:gatewayAudit, issuer:'California Public Utilities Commission, indexed official PDF excerpt',
    artifact_date:'No issuance date verified in excerpt; heading identifies June 2-5, 2025 audit',
    observation_period:'Historical audit observation concerning Gateway 1 and substation',
    locator:'Indexed page 1 of 18: Findings Requiring Corrective Actions, Finding 1',
    access:'Indexed first-page text inspected; no complete document or image verification',
    evidence_role:'Indexed official excerpt, not full report', access_result:'Indexed excerpt only',
    finding:'Finding 1 describes the 2020 arc-flash study and calls for updated analysis, a recurring review process and submission to ESRB for verification.',
    limitation:'The requirement to submit evidence is not evidence that it was submitted or accepted. An indexed first page cannot validate every finding or a comparative safety score.'
  },
  {
    check_id:'207-CHECK-GATEWAY-AUDIT-2025-RESPONSE', source_ids:['source-56c-gateway-cpuc-audit-response-2025'],
    url:'https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/safety-and-enforcement-division/esrb/generation/audits/gao-167-audits/2025-gao-audits/redacted--gateway-audit-response-revfinal.pdf',
    issuer:'Gateway Energy Storage LLC response hosted by CPUC',
    artifact_date:'No filing date established; public response includes September 2025 dated entries',
    observation_period:'Response to June 2-5, 2025 audit ESS2025-01GW; historical claimed closures and future targets',
    locator:'Cover, introduction and footnote; complete Findings 1-3; complete Appendix A at PDF index 20',
    access:'Relevant text in the 50-page public response inspected; index 20 screenshot returned Internal Error',
    evidence_role:'Exact bound source', access_result:'Text inspected; visual check unavailable',
    finding:'Gateway claims 14 of 16 findings closed. Finding 3 is marked Closed on September 22 despite expressly declining the insurer-recommended modification. The introduction targets remaining closure by October, but Finding 1 targets December 31, 2025; Appendix A retains 1 and 7 In-Progress.',
    limitation:'Operator closure and its safety characterization are not CPUC acceptance. Retain the conflicting target dates and closure-without-modification distinction. Neither historical targets nor current retrieval prove later completion; redacted/visual attachments were not verified.'
  },
  {
    check_id:'207-CHECK-MOSS-EPA-TIMELINE-2026', source_ids:['source-56d-moss-landing-epa-response-timeline-2026'],
    url:'https://www.epa.gov/ca/moss-landing-vistra-battery-fire-updates', issuer:'U.S. Environmental Protection Agency',
    artifact_date:'Latest entry on inspected page: 2026-06-24; page updated 2026-07-16',
    observation_period:'June 24 cleanup snapshot for fire-impacted ML300; earlier February/April entries separately dated',
    locator:'June 24 entry, intact-battery footnote and Upcoming Phase 2; April and February context',
    access:'Exact bound page text inspected', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The June entry reports 33,943 intact batteries de-energized and over 33,000 sent off-site, with about 5,000 remaining in difficult-access areas. It projects further cleanup and demolition rather than reporting full restoration.',
    limitation:'De-energized, shipped and remaining counts have different boundaries; do not sum them into a completion percentage. June forecasts are not September outcomes, and ML300 cleanup does not establish whole-site availability, return to service or absence of later incidents.'
  },
  {
    check_id:'207-CHECK-MOSS-EPA-AGREEMENT-2025', source_ids:['source-56d-moss-landing-epa-agreement-2025'],
    url:'https://www.epa.gov/newsreleases/epa-reaches-agreement-vistra-corp-urgent-battery-cleanup-moss-landing-launches-website', issuer:'U.S. Environmental Protection Agency',
    artifact_date:'News release 2025-07-23; page updated 2025-09-25',
    observation_period:'Announcement responding to January 16, 2025 fire at the 300 MW Moss Landing facility',
    locator:'Announcement, work/monitoring obligations and Background',
    access:'Complete news-release text inspected; underlying agreement text not inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'EPA announces that Vistra will conduct and pay for damaged-battery removal under EPA oversight, with work plans, monitoring and community involvement obligations.',
    limitation:'The announcement is not proof that all required work was completed, a root-cause determination or an operational restart. Do not confuse this Moss Landing release with the separate Gateway agreement cited by CPUC.'
  },
  {
    check_id:'207-CHECK-MANATEE-SITE-PLAN-2025-BOUND', source_ids:['source-56d-manatee-fpl-site-plan-2025'],
    url:sitePlan, issuer:'Florida Public Service Commission filing repository',
    artifact_date:'Not verified by direct read; indexed filing header separately dated',
    observation_period:'Intended FPL 2025 ten-year site plan', locator:'Exact bound 02502-2025 PDF',
    access:'Direct retrieval failed: content length too large, 10,755,221 bytes reported by tool',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The full planning filing could not be inspected in this retrieval.',
    limitation:'No full-file claim or absence of battery operating data is inferred. A rolling utility URL that now exposes a 2026 plan is not a verified copy of the inaccessible 2025 filing and was not substituted.'
  },
  {
    check_id:'207-CHECK-MANATEE-SITE-PLAN-2025-INDEXED', source_ids:['source-56d-manatee-fpl-site-plan-2025'],
    url:sitePlan, issuer:'Florida Power & Light filing hosted by Florida PSC, indexed official excerpt',
    artifact_date:'Indexed filing header: 2025-04-01', observation_period:'Table I.A.3.1 purchased-power inventory as of December 31, 2024, and 2024 energy purchases',
    locator:'Indexed printed page 28, Table I.A.3.1 and its renewable-purchase footnote',
    access:'Official indexed table text inspected; full report and table image unavailable',
    evidence_role:'Indexed official excerpt, not full report', access_result:'Indexed excerpt only',
    finding:'The retrieved table concerns purchased-power contracts and energy, including a Manatee County location; it is not an observed Manatee battery availability table.',
    limitation:'A county-name match does not identify the battery. Do not assign purchased-power MWh or contract MW to battery performance or infer that no other relevant table exists in the unread full filing.'
  },
  {
    check_id:'207-CHECK-GATEWAY-RESOLUTION-E5428', source_ids:['source-56d-gateway-cpuc-resolution-e5428-2025'],
    url:'https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M588/K329/588329444.PDF', issuer:'California Public Utilities Commission, Energy Division',
    artifact_date:'Adopted/effective 2025-11-20; issued 2025-11-24',
    observation_period:'Historical resolution snapshot; expected initial delivery 2027-06-01 with 2027-08-01 deadline',
    locator:'Printed pages 1-4: summary, Gateway row and thermal-event discussion; pages 21-22: order and adoption',
    access:'Relevant text in 24-page redacted PDF inspected; image requests at index 3 returned a reference but no inspectable image, so no visual verification',
    evidence_role:'Exact bound source', access_result:'Text inspected; visual check unavailable',
    finding:'The resolution approves an amended 75 MW contract, with 55.5 MW MTR compliance value in the table. It describes partial return while the fire-affected building remains offline and reuse of other installed capacity for earlier obligations.',
    limitation:'Contract approval is not 75 MW restored or full-facility availability. Nameplate and compliance values differ; the 2027 dates are future commitments, not delivery. The historical investigation statement is not a September 2026 status check. Confidential appendices were not sought.'
  },
  {
    check_id:'207-CHECK-EPA-BESS-CONSIDERATIONS-2026', source_ids:['source-56d-gateway-epa-bess-safety-2025'],
    url:'https://www.epa.gov/electronics-batteries-management/battery-energy-storage-systems-main-considerations-safe', issuer:'U.S. Environmental Protection Agency',
    artifact_date:'Displayed page update 2026-07-31; no original publication date established',
    observation_period:'General planning/response guidance with historical Gateway and Moss Landing examples',
    locator:'Overview, Facts about Recent Fires, guidance scope and resource/standards list',
    access:'Complete page text inspected; linked technical standards and incident files not independently reviewed',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'EPA presents a non-comprehensive collection of guidance and describes Gateway monitoring/work-plan requirements after the May 2024 incident. Its global failure-rate discussion cites EPRI rather than presenting a Gateway availability series.',
    limitation:'General guidance and an industry-wide denominator do not establish site-specific compliance, present safety, root cause or customer value. The source profile has a 2025 identifier; preserve it while recording the actual 2026 page update. No current standards-edition determination is made.'
  }
];

export const batteryResearchReviews = [
  {
    backlog_item_id:'182-BACKLOG-011', review_id:'207-BACKLOG-011-2026-09-14',
    check_ids:['207-CHECK-MOSS-AUDIT-2025-BOUND','207-CHECK-MOSS-AUDIT-2025-INDEXED','207-CHECK-MOSS-AUDIT-2025-RESPONSE','207-CHECK-MANATEE-REQUEST-2025-UPPER-BOUND','207-CHECK-MANATEE-REQUEST-2025-INDEXED','207-CHECK-MANATEE-RATE-TESTIMONY-2025','207-CHECK-GATEWAY-AUDIT-2025-BOUND','207-CHECK-GATEWAY-AUDIT-2025-INDEXED','207-CHECK-GATEWAY-AUDIT-2025-RESPONSE'],
    finding:'Operator responses expose status/prose and target-date conflicts rather than independently verified closure. FPL testimony identifies asset characteristics, while the indexed thermal-unit table must not be assigned to the Manatee battery. Full-audit and filing access remains incomplete.',
    recommendation:'Retain the causal-inference hold pending authorized disposition. Capacity, corrective-action claims, regulatory acceptance and measured outcomes remain separate.',
    next_action:'Obtain readable exact audit and data-request files through supported access, resolve the operator status/target discrepancies with later regulator evidence, and verify exact battery identities before extracting repeated observations. Seek a compatible operating denominator and independent validation, then obtain the evidence editor disposition.',
    next_check_date:'2026-09-21'
  },
  {
    backlog_item_id:'182-BACKLOG-015', review_id:'207-BACKLOG-015-2026-09-14',
    check_ids:['207-CHECK-MOSS-EPA-TIMELINE-2026','207-CHECK-MOSS-EPA-AGREEMENT-2025','207-CHECK-MANATEE-REQUEST-2025-LOWER-BOUND','207-CHECK-MANATEE-REQUEST-2025-INDEXED','207-CHECK-MANATEE-SITE-PLAN-2025-BOUND','207-CHECK-MANATEE-SITE-PLAN-2025-INDEXED','207-CHECK-GATEWAY-RESOLUTION-E5428','207-CHECK-EPA-BESS-CONSIDERATIONS-2026'],
    finding:'Cleanup progress, planned removal, partial restart and contract amendment are different observations with distinct dates and asset boundaries. Indexed Manatee County and thermal-unit matches are not battery performance, and the full utility filings remain unreadable.',
    recommendation:'Retain the alternative-explanation and comparative-performance holds pending authorized disposition. Do not turn an obligation, historical snapshot or projected delivery into a current operating outcome.',
    next_action:'Recheck current asset-specific cleanup, restart and acceptance evidence; recover the exact 2025 utility filings through supported access. Preserve capacity/compliance/energy distinctions and reconcile intervention, exposure and denominator before proposing an outcome comparison; obtain the evidence editor disposition.',
    next_check_date:'2026-09-21'
  }
];
