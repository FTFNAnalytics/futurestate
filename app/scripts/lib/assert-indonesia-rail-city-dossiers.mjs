import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const indonesiaRailCityHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertIndonesiaRailCityDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-jakarta-mrt-north-south","project-jakarta-bandung-whoosh","place-bandung"],'Exact record_id boundary changed');
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Project','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,17);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,17);
  const validPeriod=date=>{assert(/^\d{4}(-\d{2}){0,2}$/.test(date));const full=date.length===4?`${date}-01-01`:date.length===7?`${date}-01`:date;assert.equal(new Date(`${full}T00:00:00Z`).toISOString().slice(0,10),full);};
  for(const s of data.sources){
    assert.equal(new URL(s.url).protocol,'https:');assert(s.publisher&&s.role&&s.locator&&s.inspection&&s.boundary&&s.language&&s.interpretation_note);
    assert(Object.hasOwn(s,'publication_date'));
    for(const [key,date] of Object.entries(s).filter(([k])=>k.endsWith('_date')))if(date!==null){assert.equal(date.length,10);validPeriod(date);if(key!=='effective_date')assert(date<=data.inspected_date);}
    if(s.publication_period){validPeriod(s.publication_period);assert(s.publication_period.length<=7);assert(s.publication_period<=data.inspected_date);assert.equal(s.publication_date,null);assert(s.period_basis);}
  }
  for(const r of data.records){
    assert.equal(r.identity_decision.eligible_count,1);assert(r.identity_decision.rationale.length>150);
    assert.equal(r.sections.length,6);assert.equal(new Set(r.sections.map(s=>s.heading)).size,6);
    assert(r.sections.map(s=>s.text).join(' ').split(/\s+/).length>=500);
    for(const s of r.sections){assert(s.heading&&s.text.length>200);assert(s.source_ids.every(id=>ids.has(id)));if(!s.source_ids.length)assert.equal(s.claim_type,'Editorial evidence test');}
    assert(r.timeline.length>=3);let previous='';
    for(const item of r.timeline){validPeriod(item.date);assert(item.date<=data.inspected_date&&item.date>=previous);previous=item.date;assert(item.event&&item.source_ids.length&&item.source_ids.every(id=>ids.has(id)));}
    assert(r.next_artifacts.length>=3);assert(r.related.every(link=>/^\/atlas\/[a-z0-9/-]+\/$/.test(link.route)));
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,indonesiaRailCityHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One North–South railway across its operating first phase and defined northern extensions, not every line operated or proposed by MRT Jakarta. East–West, Jakarta LRT, Jabodebek LRT and individual station contracts are excluded from this counted identity.","One Jakarta–Bandung high-speed railway operated as Whoosh, not the whole KCIC corporate portfolio or a proposed extension to other cities. Its stations, feeder connections and shuttle services remain components or interfaces, not extra counted projects.","One Kota Bandung municipality, not Kabupaten Bandung, Bandung Barat, Cimahi or the entire metropolitan area. External treatment and transport dependencies are described without annexing their locations or counting component facilities as additional projects."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["The first phase was inaugurated in March 2019. The May 2026 government review retains northern-extension commissioning and opening forecasts for 2027 and 2029. September passenger statistics and traffic notices do not establish a new section's passenger opening.","Commercial service began October 17, 2023. The 2026 operator reports provide bounded passenger, ticketing and first-half performance observations. November's Padalarang oversight account still seeks access improvements; a new Halim shuttle does not resolve every interchange.","The 2026 water-strategy catalog, utility program descriptions and maintenance notices establish distinct policy and service arrangements. November composting plans still concern future work. No city-wide continuous-supply, wastewater-compliance or waste-diversion outcome is admitted."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/jakarta-mrt-north-south/","/atlas/projects/jakarta-bandung-whoosh/","/atlas/places/bandung/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["Jakarta MRT North South","MRT Jakarta Utara Selatan","Jakarta North–South line","Lebak Bulus Bundaran HI MRT"],["Whoosh","Kereta Cepat Jakarta Bandung","KCJB","Jakarta Bandung high speed railway"],["Bandung","Kota Bandung","Bandung municipality","Bandung city services"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2013-10","event":"The embassy's inauguration account dates groundbreaking to this month.","source_ids":["mrt-inauguration"]},{"date":"2019-03-24","event":"The North–South line inauguration ceremony was held at Bundaran HI.","source_ids":["mrt-inauguration"]},{"date":"2026-02-25","event":"The indexed operator page dates its package-progress snapshot to this day.","source_ids":["mrt-phase2"]},{"date":"2026-05-12","event":"The provincial government described construction progress and future commissioning.","source_ids":["mrt-may-review"]},{"date":"2026-09","event":"BPS's catalog reports the month's MRT passenger total.","source_ids":["mrt-bps-september"]},{"date":"2026-09-09","event":"The city published revised traffic arrangements linked to utility constraints.","source_ids":["mrt-street-access"]}],[{"date":"2015-10-16","event":"KCIC's profile dates establishment of the joint venture to this day.","source_ids":["whoosh-history"]},{"date":"2023-10-02","event":"The operator records the railway's inauguration.","source_ids":["whoosh-history"]},{"date":"2023-10-17","event":"The operator records the start of commercial operation.","source_ids":["whoosh-history"]},{"date":"2026-08-06","event":"KCIC published first-half operating indicators and described continuing government coordination.","source_ids":["whoosh-operations"]},{"date":"2026-11-13","event":"Parliamentary representatives visited Padalarang; the account was published two days later.","source_ids":["whoosh-padalarang-review"]},{"date":"2026-11-17","event":"KCIC published January–October digital-ticket figures.","source_ids":["whoosh-ticketing"]},{"date":"2026-11-18","event":"KCIC's November 20 release dates the Halim–BSD–Serpong shuttle start to this day.","source_ids":["whoosh-halim-shuttle"]}],[{"date":"1992","event":"The utility dates Bojongsoang wastewater treatment operation to this year.","source_ids":["bandung-wastewater"]},{"date":"2020","event":"The northern water-loss program reports its 45.79% baseline for this year.","source_ids":["bandung-nrw"]},{"date":"2026-02-11","event":"The municipal catalog dates adoption and promulgation of the water strategy to this day.","source_ids":["bandung-water-strategy"]},{"date":"2026-03-12","event":"The catalog lists this as publication of its water-strategy record.","source_ids":["bandung-water-strategy"]},{"date":"2026-09-21","event":"Tirtawening published a planned production interruption linked to Pakar maintenance.","source_ids":["bandung-outage"]},{"date":"2026-11-06","event":"The mayor announced proposed neighbourhood compost pits, reported November 9.","source_ids":["bandung-compost"]},{"date":"2026-11-10","event":"The utility published non-piped water and wastewater service channels.","source_ids":["bandung-nonpiped"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["mrt-inauguration"],["mrt-bps-september"],["mrt-phase2","mrt-may-review"],["mrt-may-review"],["mrt-street-access"],[]],[["whoosh-history"],["whoosh-operations"],["whoosh-ticketing"],["whoosh-padalarang-review"],["whoosh-halim-shuttle"],[]],[["bandung-water-strategy","bandung-gedebage"],["bandung-nrw"],["bandung-outage","bandung-nonpiped"],["bandung-wastewater"],["bandung-compost"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Indonesian-group identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of indonesiaRailCityCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"mrt-inauguration","title":"North–South MRT inauguration","publisher":"Embassy of Japan in Indonesia","role":"Dated ceremony and construction-history account","url":"https://www.id.emb-japan.go.jp/news19_04en.html","publication_date":"2019-03-24","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject review claimed.","locator":"March 24 release and October 2013 groundbreaking paragraph","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The ceremony date is not assigned as the start of full-fare commercial operation. Historical Japanese support does not establish current operating performance.","groundbreaking_period":"2013-10","ceremony_date":"2019-03-24"},{"id":"mrt-phase2","title":"MRT northern extension stages","publisher":"MRT Jakarta","role":"Indexed operator description of phase boundaries and packages","url":"https://www.jakartamrt.co.id/id/proyek/fase-2","publication_date":null,"language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Phase 2A/2B and package table explicitly as of February 25, 2026","access_mode":"Official indexed text","inspection":"Official indexed text inspected on 2026-11-22 after direct retrieval returned a JavaScript shell; no browser automation or linked files inspected","boundary":"Direct retrieval returned only a JavaScript shell. The official indexed account is a February snapshot, not current construction acceptance. CP201 civil progress is not integrated railway readiness.","progress_as_of_date":"2026-02-25","opening_forecast_period":"2029"},{"id":"mrt-may-review","title":"Government inspection of the MRT extension","publisher":"DKI Jakarta provincial government","role":"Dated construction and commissioning forecasts","url":"https://www.jakarta.go.id/index.php/siaran-pers/6696-SP-HMS-05-2026","publication_date":"2026-05-12","language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Main May 12 press-release paragraphs, including the different Harmoni and Monas quotations","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"About 59% is the May progress account, not November completion. Harmoni and Monas are different stated 2027 endpoints; neither establishes a final approved opening scope. East–West is separate.","inspection_event_date":"2026-05-12","commissioning_forecast_period":"2027","kota_completion_forecast_period":"2029"},{"id":"mrt-bps-september","title":"September MRT passenger count in the BPS catalog","publisher":"Statistics Indonesia (BPS)","role":"Official catalog excerpt of a monthly statistical release","url":"https://searchengine.web.bps.go.id/search?content=all&from=all&mfd=3100&page=1&q=Statistik+Transportasi+Provinsi+DKI+Jakarta+2024&sort=terbaru&title=0&to=all","publication_date":null,"language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Result titled Perkembangan Transportasi DKI Jakarta September 2026; linked release /2026/11/02/170696/","access_mode":"Official catalog HTML excerpt","inspection":"Official BPS catalog HTML excerpt inspected on 2026-11-22; underlying release access was denied (403), and its full body and attachments were not inspected","boundary":"The official catalog reports 4,279,584 MRT passengers for September. Direct retrieval of the underlying release returned 403 and was not retried. The excerpt does not expose methodology, unique-person definitions or asset reliability.","reporting_period":"2026-09"},{"id":"mrt-street-access","title":"Thamrin works and traffic arrangements","publisher":"Central Jakarta administrative city","role":"Dated utility-delay and street-work notice","url":"https://pusat.jakarta.go.id/berita/general/perekonomian-dan-pembangunan/ini-rekayasa-lalu-lintas-pekerjaan-lanjutan-mrt-fase-2","publication_date":"2026-09-09","language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"CP201 Stage 3B, pedestrian works and contractor road-user responsibilities","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The September notice schedules work through November 30; it is not an observed November route or proof of restoration. Motorized and nonmotorized safety responsibilities are not demonstrated safety outcomes.","scheduled_end_period":"2026-11"},{"id":"whoosh-history","title":"KCIC profile and Whoosh opening chronology","publisher":"KCIC","role":"Operator history and project identity","url":"https://kcic.co.id/tentang-kami/profil/","publication_date":null,"language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"2015 joint venture, October 2 inauguration and October 17 commercial-operation paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Inauguration and paid operation are distinct. The undated financing narrative is not treated as an audited current capital structure or a guarantee that public exposure never changed.","joint_venture_date":"2015-10-16","inauguration_date":"2023-10-02","commercial_operation_date":"2023-10-17"},{"id":"whoosh-operations","title":"Whoosh operations and continuing government coordination","publisher":"KCIC","role":"Operator's scoped performance and coordination account","url":"https://kcic.co.id/kcic-siaran-pers/kcic-operasional-whoosh-normal-koordinasi-dengan-pemerintah-terus-berjalan/","publication_date":"2026-08-06","language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"First-half punctuality/satisfaction, cumulative passengers and continuing government discussions","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"99.4% punctuality and 95.79% satisfaction concern the first half of 2026, not every subsequent journey or an audited financial settlement. More than 16.9 million is cumulative through July, not January–July ridership.","performance_reporting_period":"2026","performance_qualifier":"First half of 2026 only","cumulative_reporting_end_period":"2026-07"},{"id":"whoosh-ticketing","title":"Whoosh digital-ticket use and potential print savings","publisher":"KCIC","role":"Dated ticket-channel count and cost comparison","url":"https://kcic.co.id/kcic-siaran-pers/39-juta-penumpang-whoosh-gunakan-tiket-digital-kcic-catat-efisiensi-biaya-cetak-rp58-miliar/","publication_date":"2026-11-17","language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"January–October figures, per-ticket printing comparator and retained staffed service","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Rounded 3.9/5.1 million and 75.9% retain the operator's reporting basis. Potential avoided printing cost is not audited net profit or a lifecycle emissions saving. Assisted counter service remains described.","reporting_start_period":"2026-01","reporting_end_period":"2026-10"},{"id":"whoosh-padalarang-review","title":"Parliament calls for Padalarang access improvements","publisher":"DPR RI Parliamentary News Bureau","role":"Dated account of a parliamentary oversight visit","url":"https://emedia.dpr.go.id/news/2026/11/15/whoosh-makin-ramai-komisi-v-minta-akses-stasiun-padalarang-segera-dibenahi","publication_date":"2026-11-15","language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"November 13 visit, narrow access, proposed connection and feeder coordination","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Published November 15 about a November 13 visit. The account attributes congestion and coordination concerns to participants; it is not a traffic measurement series or completed improvement. Planned access is not open infrastructure.","visit_date":"2026-11-13","access_plan_agreement_period":"2025-08"},{"id":"whoosh-halim-shuttle","title":"Halim shuttle service to BSD and Serpong","publisher":"KCIC","role":"Dated connecting-service announcement","url":"https://kcic.co.id/kcic-siaran-pers/intermoda-halim-makin-lengkap-kini-tersedia-shuttle-ke-bsd-dan-serpong/","publication_date":"2026-11-20","language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"November 18 start, three trips per direction and 14 seats per departure","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Published capacity and frequency are not load factors, guaranteed connections or observed journey reliability. Promotional fares and booking services were not tested.","service_start_date":"2026-11-18"},{"id":"bandung-water-strategy","title":"Bandung drinking-water strategy metadata","publisher":"Bandung municipal legal documentation service","role":"Official legal-catalog metadata, not the full instrument","url":"https://jdih.bandung.go.id/home/produk-hukum/peraturan-perundang-undangan-daerah/30088","publication_date":"2026-03-12","language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Regulation 9/2026 title, February 11 adoption/promulgation and March 12 publication","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The HTML catalog marks the 2026–2030 strategy as in force. The attached instrument was not read; no clause-level legal interpretation, service entitlement or implementation result is inferred.","adoption_date":"2026-02-11","promulgation_date":"2026-02-11","strategy_start_period":"2026","strategy_end_period":"2030"},{"id":"bandung-gedebage","title":"Gedebage water-supply system","publisher":"Perumda Tirtawening Kota Bandung","role":"Utility's service-area and supply-chain description","url":"https://perumdatirtawening.co.id/cindex/layanan/SPAM-Gedebage","publication_date":null,"language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Cikalong intake/treatment, bounded eastern service area and five-district description","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The undated page describes completion work and a prospective service area. Its population/household counts are not active connections, continuous supply or verified water quality. Diagrams and forms were not inspected."},{"id":"bandung-nrw","title":"Northern Bandung performance-based water-loss program","publisher":"Perumda Tirtawening Kota Bandung","role":"Utility baseline, target and intervention description","url":"https://perumdatirtawening.co.id/cindex/layanan/Kontrak-Berbasis-Kinerja-Adaro-untuk-NRW-Wilayah-Utara","publication_date":null,"language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"2020 NRW baseline and eleven-year 17% target","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"45.79% belongs to 2020; 17% is an eleven-year target without a start date assigned here. Potential 83.4% coverage is not achieved service. Physical and commercial losses need separate measurement.","baseline_reporting_period":"2020"},{"id":"bandung-outage","title":"Pakar intake and Dago production maintenance notice","publisher":"Perumda Tirtawening Kota Bandung","role":"Dated planned outage and water-energy dependency","url":"https://perumdatirtawening.co.id/cposting/posting/PEMELIHARAAN-&-GANGGUAN-PRODUKSI-KTH-PAKAR-&-MINI-PLANT-DAGO-PAKAR","publication_date":"2026-09-21","language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Planned 04:00–20:00 production suspension, 400 litres/second reduction and service areas","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The notice describes expected effects, not actual outage duration or verified restoration. Listed areas are not a count of affected households. No live customer query was submitted.","scheduled_maintenance_date":"2026-09-21"},{"id":"bandung-nonpiped","title":"Non-piped water and wastewater service contacts","publisher":"Perumda Tirtawening Kota Bandung","role":"Published service channels","url":"https://perumdatirtawening.co.id/cposting/posting/Pelayanan-Non-Perpipaan","publication_date":"2026-11-10","language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Water-tanker and wastewater-removal ordering channels","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Contact availability is not confirmed dispatch capacity, response time, affordability or service quality. No call, order, personal account access or payment was made."},{"id":"bandung-wastewater","title":"Bojongsoang wastewater treatment","publisher":"Perumda Tirtawening Kota Bandung","role":"Utility's facility location, history and process description","url":"https://perumdatirtawening.co.id/cindex/layanan/Instalasi-Pengolahan-Air-Limbah","publication_date":null,"language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"1992 operation, stabilization ponds and residual-stream destinations","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The plant is in Bandung regency while serving city wastewater. General descriptions of safe effluent and reuse are not contemporaneous laboratory compliance results or city-wide sewer coverage.","operation_start_period":"1992"},{"id":"bandung-compost","title":"Proposed neighbourhood compost pits","publisher":"Bandung municipal communications office via West Java provincial portal","role":"Dated municipal waste-program proposal","url":"https://jabarprov.go.id/berita/atasi-sampah-organik-dari-tingkat-rw-farhan-siapkan-tiga-kompos-pit-per-rw-26725","publication_date":"2026-11-09","language":"Indonesian","interpretation_note":"Indonesian text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"November 6 announcement, three pits per RW and next-month start proposal","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The November account's next-month start means December 2026, still future at inspection. Three pits per neighbourhood is a proposal, not installed capacity or measured diversion; the 1,597 RW denominator is not completed coverage.","announcement_date":"2026-11-06","proposed_start_period":"2026-12"}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,indonesiaRailCityHash(data.sources));assert.equal(review.edition_sha256,indonesiaRailCityHash(data));
}
export const indonesiaRailCityCriticalPhrases=[
  [
    0,
    0,
    "not a substitute for the dates when fares"
  ],
  [
    0,
    1,
    "not a count of distinct residents"
  ],
  [
    0,
    1,
    "catalog excerpt supplies the bounded figure"
  ],
  [
    0,
    2,
    "not November completion measurements"
  ],
  [
    0,
    2,
    "high civil percentage"
  ],
  [
    0,
    3,
    "should not be silently treated as interchangeable"
  ],
  [
    0,
    3,
    "commissioning and permission to carry passengers remain separate"
  ],
  [
    0,
    4,
    "not an observed safe journey or verified restoration"
  ],
  [
    1,
    0,
    "not an audited statement of today's debt allocation"
  ],
  [
    1,
    1,
    "first half of 2026"
  ],
  [
    1,
    1,
    "rather than a January–July total"
  ],
  [
    1,
    2,
    "not audited net profit or a lifecycle emissions result"
  ],
  [
    1,
    2,
    "does not establish universal digital access"
  ],
  [
    1,
    3,
    "not a newly measured congestion series"
  ],
  [
    1,
    4,
    "not observed occupancy or a guaranteed connection"
  ],
  [
    2,
    0,
    "not an active-connection count"
  ],
  [
    2,
    1,
    "target is not a current measured result"
  ],
  [
    2,
    1,
    "does not supply an exact start date"
  ],
  [
    2,
    2,
    "not a record of actual interruption length"
  ],
  [
    2,
    3,
    "does not expand the counted municipality"
  ],
  [
    2,
    3,
    "not a current laboratory compliance record"
  ],
  [
    2,
    4,
    "not completed coverage"
  ],
  [
    2,
    4,
    "proposed December start was still future"
  ]
];
