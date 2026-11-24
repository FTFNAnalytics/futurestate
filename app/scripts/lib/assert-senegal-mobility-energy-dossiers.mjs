import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const senegalMobilityEnergyHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertSenegalMobilityEnergyDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-dakar-brt","project-taiba-ndiaye-wind","place-dakar-region"],'Exact record_id boundary changed');
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Project','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,15);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,15);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,senegalMobilityEnergyHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One Dakar–Guédiawaye BRT corridor, including its stations and service patterns. The proposed second BRT line, TER railway and wider PAMUS program are not additional components counted as this project.","One named wind farm in the Thiès region. Turbines are components, not separate projects. Proposed wind expansion and battery storage remain related development context; the farm is outside the counted Dakar administrative region.","One administrative region comprising Dakar, Pikine, Guédiawaye, Rufisque and Keur Massar departments. Dakar city is not used as a synonym for the whole region. External dependencies and national programs are described without annexing Thiès, Mbour or Saint-Louis."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["Progressive operation began in May 2024. The inspected 2025 implementation report and 2026 access-works notice do not establish full corridor closeout or a current reliability series.","The developer records full commercial operation in 2021. The current owner inventory separates the operating wind farm from development entries. No current comparable generation series, storage commissioning or dedicated BRT power supply is admitted.","The inspected records establish regional boundaries and distinct service programs, including targeted October 2026 water interventions. They do not establish region-wide continuous supply, completed sanitation coverage or universal protection against flooding."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/dakar-brt/","/atlas/projects/taiba-ndiaye-wind/","/atlas/places/dakar-region/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["Dakar BRT","SunuBRT","Dakar Guediawaye bus rapid transit","Dakar Mobilite BRT"],["Taiba Ndiaye wind farm","Parc Eolien Taiba Ndiaye","PETN wind farm","Taïba N’Diaye"],["Dakar region","Region de Dakar","Dakar regional services","Région de Dakar"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2022-03-21","event":"CETUD dates the public-service concession signature to this day.","source_ids":["brt-contract"]},{"date":"2024-05","event":"The implementation report dates progressive passenger operation to this month.","source_ids":["brt-isr"]},{"date":"2025-06-17","event":"The World Bank announced finance for the separate mobility-integration project.","source_ids":["brt-integration"]},{"date":"2025-10-01","event":"The implementation report retained outstanding integration and handover work.","source_ids":["brt-isr"]}],[{"date":"2018-07","event":"Mainstream dates financial close to this month.","source_ids":["wind-history"]},{"date":"2018-09-03","event":"Vestas announced the EPC and maintenance order.","source_ids":["wind-epc"]},{"date":"2020-02","event":"Mainstream dates the first-phase inauguration to this month.","source_ids":["wind-history"]},{"date":"2021","event":"The developer records full commercial operation in this year.","source_ids":["wind-history"]},{"date":"2023-10-20","event":"The production-dynamics paper was published using 2021 observations.","source_ids":["wind-study"]}],[{"date":"2021-05-28","event":"The indexed census excerpt dates the decree creating Keur Massar department.","source_ids":["dakar-boundary"]},{"date":"2025-03-01","event":"ONAS lists this start date for PAAD.","source_ids":["dakar-sanitation"]},{"date":"2025-08-19","event":"The ministry held the PROGEP II steering review.","source_ids":["dakar-flood"]},{"date":"2025-08-20","event":"The ministry published its account of the preceding day's meeting.","source_ids":["dakar-flood"]},{"date":"2026-10-23","event":"SEN’EAU dates the start of the cited reservoir interventions.","source_ids":["dakar-water"]},{"date":"2026-10-24","event":"SEN’EAU records follow-up checks at the selected sites.","source_ids":["dakar-water"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["brt-contract"],["brt-services"],["brt-isr"],["brt-integration"],["brt-market"],[]],[["wind-history"],["wind-epc"],["wind-study"],["wind-pipeline"],["wind-community"],[]],[["dakar-boundary"],["dakar-mobility"],["dakar-sanitation"],["dakar-water"],["dakar-flood"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Senegal-group identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of senegalMobilityEnergyCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"brt-contract","title":"BRT concession and corridor","publisher":"CETUD","role":"Transport authority's network description","url":"https://cetud.sn/reseaux-de-transport/bus-regional-transit-brt/","publication_date":null,"language":"French","interpretation_note":"French source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"Concession paragraph and corridor figures","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"Undated service description, not a daily availability or emissions measurement.","contract_date":"2022-03-21"},{"id":"brt-services","title":"SunuBRT service patterns","publisher":"Dakar Mobilité / SunuBRT","role":"Official indexed passenger information","url":"https://www.sunubrt.sn/","publication_date":null,"language":"French","interpretation_note":"French source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"B1–B4 and introductory energy description","access_mode":"Official indexed text","inspection":"Official indexed text inspected on 2026-11-22; direct homepage retrieval returned 503 and no live journey was tested","boundary":"B4 is marked forthcoming; eventual solar supply is not present traction-energy proof."},{"id":"brt-isr","title":"BRT implementation status, October 2025","publisher":"World Bank","role":"Dated project implementation report","url":"https://documents1.worldbank.org/curated/en/099100125171039446/pdf/P156186-09845e2c-8f26-4aeb-8553-d832bcfa7258.pdf","publication_date":"2025-10-01","language":"English","interpretation_note":"English source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"PDF page 2, implementation status narrative","access_mode":"PDF extracted text","inspection":"PDF narrative text inspected on 2026-11-22; screenshot calls returned no viewable image, so tables and layout were not visually verified","boundary":"June 2025 construction observations and a closing-date extension are historical, not November 2026 acceptance.","reporting_period":"2025-06","progressive_operation_period":"2024-05","scheduled_closing_date":"2026-06-30"},{"id":"brt-integration","title":"Financing transport integration","publisher":"World Bank","role":"Approval announcement for a separate mobility program","url":"https://www.worldbank.org/en/news/press-release/2025/06/17/world-bank-supports-senegal-with-100-million-to-transform-urban-mobility-in-dakar-and-secondarary-cities","publication_date":"2025-06-17","language":"English","interpretation_note":"English source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"Approval and network-restructuring paragraphs","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"Approved finance and proposed integration are not completed feeder services."},{"id":"brt-market","title":"Early market consultation for BRT access works","publisher":"World Bank / CETUD / AGEROUTE","role":"Procurement preparation notice","url":"https://www.worldbank.org/en/events/2026/10/06/senegal-avis-d-engagement-pr-coce-de-march","publication_date":null,"language":"English","interpretation_note":"English source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"Overview and four consultation objectives","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"URL carries October 6, 2026; body does not independently establish publication or event date. Consultation is not award.","url_date":"2026-10-06"},{"id":"wind-history","title":"Taïba N’Diaye development history","publisher":"Mainstream Renewable Holdings","role":"Developer's historical project account","url":"https://www.mainstreamrp.com/markets-projects/africa__trashed/senegal/taiba-ndiaye-wind-farm/","publication_date":null,"language":"English","interpretation_note":"English source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"Project profile and commercial-operation history","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"Historical ownership and annual headline figures are not a current audited operating series.","financial_close_period":"2018-07","first_phase_inauguration_period":"2020-02","commercial_operation_period":"2021"},{"id":"wind-epc","title":"Vestas Senegal EPC order","publisher":"Vestas","role":"Equipment and maintenance contract announcement","url":"https://www.vestas.com/en/media/company-news/2018/vestas-enters-new-market-with-159-mw-epc-order-for-the--c2963339","publication_date":"2018-09-03","language":"English","interpretation_note":"English source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"September 3 order and service-agreement paragraphs","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"The 2018 delivery schedule is a forecast in that announcement, not actual commissioning."},{"id":"wind-study","title":"Temporal dynamics of Taïba Ndiaye production","publisher":"Niang and colleagues, Discover Energy","role":"Original research using operator-provided observations","url":"https://link.springer.com/article/10.1007/s43937-023-00018-0","publication_date":"2023-10-20","language":"English","interpretation_note":"English source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"Sections 2.1–2.2 and qualitative seasonal discussion","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"2021 production and ERA5 reanalysis are not current availability or on-site mast measurements.","reporting_period":"2021"},{"id":"wind-pipeline","title":"Operating wind and development inventory","publisher":"Infinity Power","role":"Owner's project inventory","url":"https://weareinfinitypower.com/projects","publication_date":null,"language":"English","interpretation_note":"English source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"Taiba operation, wind development and storage listings","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"Wind expansion and storage remain development entries; no commissioning inferred. MW and MWh differ."},{"id":"wind-community","title":"Taïba community activities","publisher":"Vestas","role":"Supplier's community-program account","url":"https://www.vestas.com/en/sustainability/social/csr","publication_date":null,"language":"English","interpretation_note":"English source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"Senegal skills and community-infrastructure sections","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"Reported activities do not establish independently measured income, health or consent outcomes.","training_period":"2025","market_work_period":"2026"},{"id":"dakar-boundary","title":"Dakar census regional geography","publisher":"ANSD","role":"Official indexed regional census report","url":"https://www.ansd.sn/sites/default/files/recensements/rapport/RGPH-5_DAKAR_Avril%202026.pdf","publication_date":null,"language":"French","interpretation_note":"French source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"Administrative-organization excerpt identifying five departments","access_mode":"Official indexed PDF text","inspection":"Official indexed excerpt inspected on 2026-11-22; direct PDF retrieval timed out, with no visual inspection","boundary":"Only the indexed administrative excerpt was inspected; population tables and maps were not verified.","census_reporting_period":"2023","administrative_decree_date":"2021-05-28"},{"id":"dakar-sanitation","title":"Dakar on-site sanitation program","publisher":"ONAS","role":"Program scope and implementation arrangements","url":"https://onas.sn/projets/projet-d-assainissement-autonome-de-la-region-de-dakar-paad","publication_date":null,"language":"French","interpretation_note":"French source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"PAAD status, scope and technical-verification roles","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"Project-area toilet access is not region-wide safely managed sanitation or completed works.","listed_start_date":"2025-03-01"},{"id":"dakar-mobility","title":"PAMUS Dakar program","publisher":"CETUD","role":"Regional mobility program scope","url":"https://cetud.sn/projet/pamus-dakar/","publication_date":null,"language":"French","interpretation_note":"French source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"Program phases and five components","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"Program estimates and studies do not establish spending, delivered routes or accepted assets.","phase_start_period":"2025","phase_end_period":"2029"},{"id":"dakar-water","title":"Water preparation for Dakar 2026 sites","publisher":"SEN’EAU","role":"Operator account of targeted network and reservoir work","url":"https://www.seneau.sn/joj-dakar-2026-seneau-renforce-son-dispositif-pour-securiser-lalimentation-en-eau-des-sites/","publication_date":null,"language":"French","interpretation_note":"French source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"Network reinforcement and October reservoir interventions","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"Pre-event account is not a post-event review; selected Mamelles conduits do not establish full desalination-plant acceptance.","reservoir_work_start_date":"2026-10-23","reservoir_work_end_date":"2026-10-24"},{"id":"dakar-flood","title":"PROGEP II steering review","publisher":"Ministry of Hydraulics and Sanitation, Senegal","role":"Ministry's dated program review","url":"https://mha.gouv.sn/13712-2/","publication_date":"2025-08-20","language":"French","interpretation_note":"French source interpreted and self-reviewed by Codex; no independent language or subject review claimed.","locator":"August 19 meeting and cumulative works paragraph","access_mode":"HTML body","inspection":"Specified source body or segment inspected on 2026-11-22; linked files, forms and live services were not tested","boundary":"Reported totals span Dakar and other regions; not a Dakar-only count or storm-protection guarantee.","meeting_date":"2025-08-19"}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,senegalMobilityEnergyHash(data.sources));assert.equal(review.edition_sha256,senegalMobilityEnergyHash(data));
}
export const senegalMobilityEnergyCriticalPhrases=[
  [
    0,
    0,
    "not proof of the electricity used for every vehicle charge"
  ],
  [
    0,
    1,
    "marks B4 as forthcoming"
  ],
  [
    0,
    1,
    "not a tested live timetable"
  ],
  [
    0,
    2,
    "not the state of those items in November 2026"
  ],
  [
    0,
    2,
    "not evidence that every handover occurred"
  ],
  [
    0,
    3,
    "not evidence of an operating second corridor"
  ],
  [
    0,
    4,
    "not a contract award or an accepted road"
  ],
  [
    0,
    4,
    "only as URL metadata"
  ],
  [
    1,
    0,
    "not entered here as measured 2026 output"
  ],
  [
    1,
    1,
    "Power capacity is not an annual energy total"
  ],
  [
    1,
    2,
    "not an on-site mast measurement"
  ],
  [
    1,
    2,
    "bounded historical analysis"
  ],
  [
    1,
    3,
    "different characteristics, not interchangeable capacities"
  ],
  [
    1,
    3,
    "No commissioning date or acceptance instrument"
  ],
  [
    1,
    3,
    "retained as a source-label issue"
  ],
  [
    1,
    4,
    "not independent measurements of household income"
  ],
  [
    1,
    4,
    "not an accepted, fully occupied facility"
  ],
  [
    2,
    0,
    "no population denominator is imported here"
  ],
  [
    2,
    1,
    "not proof of expenditure or completed facilities"
  ],
  [
    2,
    2,
    "not a completed connection count"
  ],
  [
    2,
    2,
    "not actual inspection results"
  ],
  [
    2,
    3,
    "not a post-event assessment"
  ],
  [
    2,
    3,
    "does not establish acceptance of the whole desalination plant"
  ],
  [
    2,
    4,
    "cannot be reassigned wholesale to Dakar"
  ]
];
