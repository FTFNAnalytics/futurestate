import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const finlandMetroCitiesHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertFinlandMetroCitiesDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-west-metro","place-espoo","place-tampere"],'Exact record_id boundary changed');
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Place','Place']);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,finlandMetroCitiesHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One West Metro project comprising Ruoholahti–Matinkylä and Matinkylä–Kivenlahti. Stations, entrances, depot and associated parking remain components, not extra projects; Espoo and Helsinki remain separate municipalities.","One Espoo municipality. Shared transport, heating and HSY wastewater systems cross its boundary; company properties and service facilities are examples within the account, not additional places or an expansion of the municipal territory.","One Tampere municipality, not the full six-municipality wastewater catchment. Kaupinlaakso, Metsäniitty and Sulkavuori are bounded system examples rather than additional counted project or place identities in this group."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["Passenger traffic began on the first phase in November 2017 and on the second on December 3, 2022. Later owner reports describe lifecycle maintenance and station-energy work; remaining ancillary works and historical access notices do not establish current equipment availability.","The city reports a 48% regional-emissions reduction from 1990 to 2025 and the wastewater operator reports 2025 permit compliance. Housing and childcare rules establish service conditions; dated processing notices and planned fixture work do not establish universal delivered access.","Council approved the 2027 budget on November 16, 2026. Dated releases separately describe refurbished yard areas, the wastewater plant's first operating year and a housing proposal at public review; none converts future spending or planned residents into delivered outcomes."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/west-metro/","/atlas/places/espoo/","/atlas/places/tampere/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["West Metro","Länsimetro","Lansimetro","Ruoholahti–Kivenlahti metro"],["Espoo","Esbo","City of Espoo","Espoo municipality"],["Tampere","Tammerfors","City of Tampere","Tampere municipality"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2008","event":"First-phase project plan prepared.","source_ids":["west-metro-history"]},{"date":"2017-11","event":"Passenger traffic began on the first phase, as recalled in the owner's lifecycle account.","source_ids":["west-metro-lifecycle"]},{"date":"2018-03-19","event":"Espoo council approved the revised second-phase project plan.","source_ids":["west-metro-phase-two"]},{"date":"2022-12-03","event":"Passenger traffic began between Matinkylä and Kivenlahti.","source_ids":["west-metro-phase-two"]},{"date":"2025-02-14","event":"Owner described maintenance arrangements and ancillary works still tied to surrounding development.","source_ids":["west-metro-lifecycle"]},{"date":"2026-07-16","event":"Tapiola escalator notice announced staggered summer closures and lift alternatives.","source_ids":["west-metro-tapiola-access"]},{"date":"2026-10-08","event":"Owner published 2025 station-energy comparisons and described 2026 interventions.","source_ids":["west-metro-energy"]}],[{"date":"2024-04","event":"Coal-fired district heating ended, according to the city's later emissions account.","source_ids":["espoo-climate"]},{"date":"2026-02-16","event":"Climate Watch updated the housing company's water-saving action record.","source_ids":["espoo-housing-water"]},{"date":"2026-04-29","event":"HSY published its 2025 wastewater report; the English abstract covers both treatment plants.","source_ids":["espoo-hsy-treatment"]},{"date":"2026-08-01","event":"The listed childcare fee adjustment took effect.","source_ids":["espoo-childcare-fees"]},{"date":"2026-08-04","event":"City published its 2025 regional-emissions comparison with 1990.","source_ids":["espoo-climate"]},{"date":"2026-08-19","event":"City reported delays in processing childcare income statements.","source_ids":["espoo-childcare-processing"]}],[{"date":"2026-02-16","event":"City described Kaupinlaakso II's public-review proposal and distinguished the legally valid first plan.","source_ids":["tampere-kaupinlaakso"]},{"date":"2026-07-02","event":"Childcare fee page was updated ahead of the August schedule.","source_ids":["tampere-childcare-fees"]},{"date":"2026-08-01","event":"The 2026 childcare fee schedule became effective.","source_ids":["tampere-childcare-fees"]},{"date":"2026-09-18","event":"City described Metsäniitty yard improvements and continuing health monitoring.","source_ids":["tampere-playground"]},{"date":"2026-09-28","event":"Sulkavuori operator published a first-year treatment account and acknowledged odour issues.","source_ids":["tampere-sulkavuori"]},{"date":"2026-11-16","event":"Council approved the 2027 budget, as reported the following day.","source_ids":["tampere-climate-budget"]},{"date":"2026-11-17","event":"City published the climate and nature budget explanation.","source_ids":["tampere-climate-budget"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["west-metro-history","west-metro-phase-two","west-metro-lifecycle"],["west-metro-governance","west-metro-lifecycle"],["west-metro-phase-two","west-metro-lifecycle"],["west-metro-energy"],["west-metro-tapiola-access"],[]],[["espoo-climate"],["espoo-hsy-treatment"],["espoo-housing"],["espoo-childcare-fees","espoo-childcare-processing"],["espoo-housing-water"],[]],[["tampere-climate-budget"],["tampere-playground"],["tampere-sulkavuori"],["tampere-kaupinlaakso"],["tampere-childcare-fees"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Finland-group identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of finlandMetroCitiesCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"west-metro-history","title":"West Metro history","publisher":"Länsimetro Oy","role":"Two-phase construction chronology","url":"https://www.lansimetro.fi/en/information/history/","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Phase-one and phase-two milestone lists","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Year-level milestones do not supply exact days, current equipment uptime or additional project identities."},{"id":"west-metro-phase-two","title":"Matinkylä–Kivenlahti finances and opening","publisher":"Länsimetro Oy","role":"Revised project plan and passenger opening","url":"https://www.lansimetro.fi/sv/information/ekonomi/mattby-stensvik/","publication_date":null,"language":"Swedish","interpretation_note":"Swedish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Plan-revision and opening paragraphs; cost table not used","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The revised budget is not final audited expenditure. Passenger opening does not establish completion of every associated entrance or parking work.","plan_revision_date":"2018-03-19","passenger_opening_date":"2022-12-03"},{"id":"west-metro-governance","title":"Organisation and decision-making","publisher":"Länsimetro Oy","role":"Asset ownership and operating responsibilities","url":"https://www.lansimetro.fi/en/information/organisation-and-decision-making/","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Ownership, financing, maintenance and HSL responsibility paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"City-area cost allocation is not a shareholding percentage. Governance descriptions are not operating-performance measurements."},{"id":"west-metro-lifecycle","title":"Lifecycle thinking at the heart of metro infrastructure ownership","publisher":"Länsimetro Oy","role":"Dated owner account of maintenance and remaining works","url":"https://www.lansimetro.fi/uutiset/elinkaariajattelu-metroinfran-omistamisen-ytimessa/","publication_date":"2025-02-14","language":"Finnish","interpretation_note":"Finnish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Opening history, maintenance book, operator responsibilities and unfinished ancillary works","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"A century-scale planning horizon is not the life of every component. Remaining works described in February 2025 are not verified November 2026 completions.","first_opening_period":"2017-11"},{"id":"west-metro-energy","title":"Systematic reduction of metro-station energy use","publisher":"Länsimetro Oy","role":"Reported station-property energy results","url":"https://www.lansimetro.fi/uutiset/metroasemien-energiankulutusta-vahennetaan-suunnitelmallisesti/","publication_date":"2026-10-08","language":"Finnish","interpretation_note":"Finnish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"2025 station totals; Keilaniemi heat/electricity comparisons; 2026 actions","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Operator-reported station-property figures are not train traction, a transport-wide emissions inventory or independently verified weather-normalized savings.","reporting_period":"2025","intervention_period":"2024","commitment_target_period":"2035"},{"id":"west-metro-tapiola-access","title":"Tapiola short platform escalators scheduled to close in turn","publisher":"Länsimetro Oy","role":"Historical passenger-access maintenance notice","url":"https://www.lansimetro.fi/category/uutiset/ajankohtaista-tapiolassa/","publication_date":"2026-07-16","language":"Finnish","interpretation_note":"Finnish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"July 16, 2026 notice on the official Tapiola category page only","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The category copy was read; the standalone article returned a cache miss. Scheduled closures and stated lift alternatives are not completion receipts or current November route availability.","first_closure_start_date":"2026-07-20","first_closure_end_date":"2026-08-02","second_closure_start_date":"2026-08-03","second_closure_end_date":"2026-08-16"},{"id":"espoo-climate","title":"Espoo has halved its climate emissions","publisher":"City of Espoo","role":"Regional emissions inventory summary","url":"https://www.espoo.fi/en/news/2026/08/espoo-has-halved-its-climate-emissions","publication_date":"2026-08-04","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"1990 comparison, 2025 transport and regional-versus-consumption inventory paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The precise reported reduction is 48%, not an exact 50%. Regional emissions exclude much consumption elsewhere; no reduction is attributed solely to West Metro.","reporting_period":"2025","baseline_period":"1990","coal_heat_end_period":"2024-04"},{"id":"espoo-hsy-treatment","title":"Wastewater treatment in the Helsinki Metropolitan Area 2025 — abstract","publisher":"Helsinki Region Environmental Services HSY","role":"Operator annual-report abstract and publication metadata","url":"https://julkaisu.hsy.fi/jatevedenpuhdistus-paakaupunkiseudulla-2025/tiivistelmaen.html","publication_date":"2026-04-29","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"English abstract and Finnish publication metadata only","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Both-plant totals cover Viikinmäki and Blominmäki, not Espoo alone. Permit compliance is reported by HSY; underlying permit records and full technical chapters were not inspected.","reporting_period":"2025"},{"id":"espoo-housing","title":"Applying for a rental apartment","publisher":"Espoon Asunnot","role":"Published application and selection arrangements","url":"https://espoonasunnot.fi/en/applicants/applying-rental-apartment","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Application validity, priority, income/wealth distinctions and help channels","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Eligibility and an active application are not an offer, waiting-time estimate or occupancy. No application or individual eligibility assessment was submitted."},{"id":"espoo-childcare-fees","title":"Early childhood education fees","publisher":"City of Espoo","role":"Published service-fee and five-year-old provision","url":"https://www.espoo.fi/en/childcare-and-education/early-childhood-education/early-childhood-education-fees","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Fee introduction, August 2026 adjustment and free provision for five-year-olds","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Four free weekday hours for the specified age/year do not mean universal free full-day childcare. Fee rules do not measure place availability or an individual bill.","effective_date":"2026-08-01"},{"id":"espoo-childcare-processing","title":"Delay in processing early childhood education income statements","publisher":"City of Espoo","role":"Dated administrative service notice","url":"https://www.espoo.fi/en/news/2026/08/delay-processing-early-childhood-educations-income-statements","publication_date":"2026-08-19","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Processing order, revised decisions and enquiry backlog","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The August notice is not a verified November backlog or evidence that every delayed decision has been corrected."},{"id":"espoo-housing-water","title":"Water-saving fixtures in Espoon Asunnot properties","publisher":"City of Espoo Climate Watch / Espoon Asunnot","role":"Company action record in the municipal climate tracker","url":"https://ilmastovahti.espoo.fi/en/actions/a1f85","publication_date":null,"language":"Finnish","interpretation_note":"Finnish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Finnish action description, February 16 update and 2026–2028 task; English interface","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Reported property savings and a 2025 estimate are not city-wide water-loss measurements. A task update is not the date of installation; planned 7,500-apartment work is not complete.","information_updated_date":"2026-02-16","prior_intervention_period":"2022","estimated_savings_period":"2025","planned_work_period":"2026–2028"},{"id":"tampere-climate-budget","title":"Tampere's climate and nature budget","publisher":"City of Tampere","role":"Approved future budget described in a dated municipal release","url":"https://www.tampere.fi/en/current/2026/11/17/tamperes-climate-and-nature-budget-promotes-biodiversity-and","publication_date":"2026-11-17","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Article body: November 16 approval, 2027 allocations and nature measures","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Budget approval is not expenditure or achieved climate/biodiversity outcomes. City and subsidiary investments are different accounting scopes; underlying Finnish budget not inspected.","approval_date":"2026-11-16","budget_period":"2027"},{"id":"tampere-playground","title":"Revamped Metsäniitty courtyard and climate resilience","publisher":"City of Tampere","role":"Completed yard interventions and ongoing monitoring","url":"https://www.tampere.fi/en/current/2026/09/18/revamped-courtyard-metsaniitty-points-way-towards-climate-resilient","publication_date":"2026-09-18","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Article body: planting, stormwater, child participation, THL monitoring and final phase","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Reported yard works are not completed health-effect measurements. The final part waits for older-building refurbishment; the entire surrounding project is not declared complete."},{"id":"tampere-sulkavuori","title":"Sulkavuori has treated wastewater for a year","publisher":"Tampereen Seudun Keskuspuhdistamo Oy","role":"Operator first-year account","url":"https://keskuspuhdistamo.fi/ajankohtaista/sulkavuoressa-on-puhdistettu-jatevetta-jo-vuoden-ajan/","publication_date":"2026-09-28","language":"Finnish","interpretation_note":"Finnish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"First-year treated volume, six-municipality catchment, removal results and odour discussion","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Cumulative volume is not design capacity or a normalized completed calendar year. Operator claims are not an independent full-2026 permit audit; 2027 odour monitoring remains planned.","planned_monitoring_period":"2027"},{"id":"tampere-kaupinlaakso","title":"Kaupinlaakso detailed plan available for public review","publisher":"City of Tampere","role":"Dated housing and tram-oriented planning stage","url":"https://www.tampere.fi/en/current/2026/02/16/local-detailed-plan-large-residential-area-kaupinlaakso-will-be","publication_date":"2026-02-16","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Article body: Kaupinlaakso I and II, future residents, tram and service layout","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Kaupinlaakso II is a public-review proposal in this account; planned residents are not current occupancy. The legally valid first plan and construction of one tram section do not adopt or deliver the whole district."},{"id":"tampere-childcare-fees","title":"Client fees for ECEC and pre-primary education","publisher":"City of Tampere","role":"Dated fee-version and service-arrangement information","url":"https://www.tampere.fi/en/early-childhood-education-and-pre-primary-education/client-fees-ecec-and-pre-primary-education","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Municipal fee introduction; 2026 fee block; retained 2024 heading; update footer","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Do not mix the retained 2024 rates with the August 2026 schedule. Municipal fees and provider-set voucher copayments differ; no individual calculation, application or linked PDF review occurred.","information_updated_date":"2026-07-02","effective_date":"2026-08-01"}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,finlandMetroCitiesHash(data.sources));assert.equal(review.edition_sha256,finlandMetroCitiesHash(data));
}
export const finlandMetroCitiesCriticalPhrases=[
  [
    0,
    0,
    "not the completion of every adjacent development"
  ],
  [
    0,
    1,
    "not a promise that every component lasts a century"
  ],
  [
    0,
    2,
    "not final audited expenditure"
  ],
  [
    0,
    3,
    "258 MWh against a 374 MWh target"
  ],
  [
    0,
    3,
    "155 MWh against a 102 MWh target"
  ],
  [
    0,
    3,
    "not train traction or transport-wide emissions"
  ],
  [
    0,
    4,
    "historical schedule, not confirmation"
  ],
  [
    1,
    0,
    "48% below 1990 levels in 2025"
  ],
  [
    1,
    0,
    "different comparisons"
  ],
  [
    1,
    1,
    "combined volume is not Espoo's own wastewater total"
  ],
  [
    1,
    1,
    "not an independent inspection"
  ],
  [
    1,
    2,
    "an eligible application is not an offer"
  ],
  [
    1,
    3,
    "not universally free full-day care"
  ],
  [
    1,
    3,
    "does not establish a current November backlog"
  ],
  [
    1,
    4,
    "must remain planned work"
  ],
  [
    1,
    4,
    "does not date every installation"
  ],
  [
    2,
    0,
    "authorized future activity"
  ],
  [
    2,
    0,
    "different accounting scopes"
  ],
  [
    2,
    1,
    "ongoing, not a completed health-effect result"
  ],
  [
    2,
    1,
    "final part of the yard"
  ],
  [
    2,
    2,
    "cannot be assigned solely to Tampere households"
  ],
  [
    2,
    2,
    "not an independent completed calendar-2026 permit audit"
  ],
  [
    2,
    3,
    "not a population already housed"
  ],
  [
    2,
    4,
    "Mixing its thresholds with the older €311 maximum"
  ],
  [
    2,
    4,
    "July page-update date and August effective date"
  ]
];
