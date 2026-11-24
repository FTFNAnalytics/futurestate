import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const kigaliCityHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertKigaliCityDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["place-kigali"],'Exact record_id boundary changed');
  assert.deepEqual(data.records.map(r=>r.kind),['Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,1);
  assert.equal(data.sources.length,7);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,7);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,kigaliCityHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One City of Kigali place account covering Gasabo, Kicukiro and Nyarugenge districts. External water sources and regional transport connections remain dependencies, not extensions of the city boundary. Districts, treatment facilities and mobility schemes are not additional counted identities in this account."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["The November 2026 utility account retains water shortages and a 2027 expansion target. Other inspected records distinguish approved transport investment, inaugurated waste pilots and wetland restoration approaching completion. No blanket city-service readiness or comparable outcome-series admission is made."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/places/kigali/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["Kigali","City of Kigali","Kigali city services","Gasabo Kicukiro Nyarugenge city"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2024-06-19","event":"GGGI reported inauguration of Nduba's pilot waste facilities.","source_ids":["kigali-waste-pilot"]},{"date":"2025-05","event":"WASAC dates the start of the Karenge expansion to this month.","source_ids":["kigali-water"]},{"date":"2025-05-29","event":"GGGI published the waste-study web summary; this is not its sampling date.","source_ids":["kigali-waste-study"]},{"date":"2025-06-25","event":"The World Bank announced RUMI financing approval.","source_ids":["kigali-mobility-finance"]},{"date":"2026-11-13","event":"WASAC reported Karenge construction progress and continuing service constraints.","source_ids":["kigali-water"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["kigali-boundary"],["kigali-water"],["kigali-mobility-finance","kigali-mobility-safeguards"],["kigali-waste-pilot","kigali-waste-study"],["kigali-wetlands"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Kigali identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of kigaliCityCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"kigali-boundary","title":"City boundary and service responsibilities","publisher":"City of Kigali","role":"Municipal overview","url":"https://www.kigalicity.gov.rw/about/overview","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject review claimed.","locator":"Background and responsibilities","access_mode":"HTML body","inspection":"Specified primary HTML body or segment inspected on 2026-11-22; attachments, maps, forms and live services were not tested","boundary":"City jurisdiction is not the whole utility or transport catchment. Undated headline economic figures are not imported."},{"id":"kigali-water","title":"Karenge water expansion and continuing shortages","publisher":"WASAC Group","role":"Dated utility construction and service account","url":"https://www.wasac.rw/en/public-information/news/d/karenge-water-treatment-plant-upgrade-reaches-75-promising-relief-for-water-stressed-communities-in-kigali-and-rwamagana?cHash=852a4a86fb4d83491f39f59a41ec3ac5","publication_date":"2026-11-13","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject review claimed.","locator":"November 13 progress, service-area and delivery-schedule paragraphs","access_mode":"HTML body","inspection":"Specified primary HTML body or segment inspected on 2026-11-22; attachments, maps, forms and live services were not tested","boundary":"75% is reported construction progress; 48,000 cubic metres per day is future design capacity, not delivered household supply.","construction_start_period":"2025-05","completion_forecast_period":"2027"},{"id":"kigali-mobility-finance","title":"RUMI financing approval","publisher":"World Bank","role":"Dated financing and project-scope announcement","url":"https://www.worldbank.org/en/news/press-release/2025/06/25/transforming-afe-kigali-urban-mobility-to-improve-commutes-and-create-jobs","publication_date":"2025-06-25","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject review claimed.","locator":"Approval, interventions and 2030 terminal expectation","access_mode":"HTML body","inspection":"Specified primary HTML body or segment inspected on 2026-11-22; attachments, maps, forms and live services were not tested","boundary":"Financing approval and expected passenger demand do not establish completed transport works or current patronage.","terminal_demand_forecast_period":"2030"},{"id":"kigali-mobility-safeguards","title":"RUMI delivery and safeguard responsibilities","publisher":"City of Kigali","role":"Municipal project description","url":"https://www.kigalicity.gov.rw/rwanda-urban-mobility-improvement-rumi-project","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject review claimed.","locator":"Objectives and Environmental and Social Management sections","access_mode":"HTML body","inspection":"Specified primary HTML body or segment inspected on 2026-11-22; attachments, maps, forms and live services were not tested","boundary":"Risk assessment describes potential impacts; it is not a finding that displacement occurred or was resolved."},{"id":"kigali-waste-pilot","title":"Nduba pilot waste facilities","publisher":"Global Green Growth Institute / Rwanda Ministry of Environment","role":"Dated implementer inauguration account","url":"https://gggi.org/rwanda-unveils-pilot-municipal-waste-valorization-facilities-at-nduba/","publication_date":"2024-06-19","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject review claimed.","locator":"June 19 release and equipment list","access_mode":"HTML body","inspection":"Specified primary HTML body or segment inspected on 2026-11-22; attachments, maps, forms and live services were not tested","boundary":"Rated sorting, composting and weighbridge capacities are not a measured city-wide diversion rate.","reported_inauguration_date":"2024-06-19"},{"id":"kigali-waste-study","title":"Kigali waste characterisation findings","publisher":"Global Green Growth Institute","role":"Study's HTML summary and sampling caveat","url":"https://gggi.org/report/waste-characterization-study-for-the-city-of-kigali/","publication_date":"2025-05-29","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject review claimed.","locator":"May 29 summary, sample design and moisture caveat","access_mode":"HTML body","inspection":"Specified primary HTML body or segment inspected on 2026-11-22; attachments, maps, forms and live services were not tested","boundary":"Web publication is not the sampling date. Rain-affected as-received weights are not dry-weight quantities; the linked report was not inspected."},{"id":"kigali-wetlands","title":"Wetland restoration approaching completion","publisher":"Rwanda Environment Management Authority","role":"Environmental authority's restoration account","url":"https://www.rema.gov.rw/updates/news-details/kigali-wetlands-restoration-project-nears-completion-reviving-nature-and-building-a-greener-city","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject review claimed.","locator":"Restoration status, ecosystem functions and concluding invitation","access_mode":"HTML body","inspection":"Specified primary HTML body or segment inspected on 2026-11-22; attachments, maps, forms and live services were not tested","boundary":"Undated reported benefits do not establish final acceptance, a quantified flood-protection standard or a comparable monitoring series."}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,kigaliCityHash(data.sources));assert.equal(review.edition_sha256,kigaliCityHash(data));
}
export const kigaliCityCriticalPhrases=[
  [
    0,
    0,
    "without assuming that one institution delivers everything"
  ],
  [
    0,
    0,
    "without becoming city territory"
  ],
  [
    0,
    1,
    "completion expected in 2027"
  ],
  [
    0,
    1,
    "not evidence that household taps already run continuously"
  ],
  [
    0,
    2,
    "a forecast, not current patronage"
  ],
  [
    0,
    2,
    "potential economic displacement"
  ],
  [
    0,
    2,
    "does not demonstrate completed compensation or restored livelihoods"
  ],
  [
    0,
    3,
    "not a city-wide diversion result"
  ],
  [
    0,
    3,
    "as-received weights cannot be silently compared with dry-weight quantities"
  ],
  [
    0,
    3,
    "does not establish when the samples were collected"
  ],
  [
    0,
    4,
    "approaching completion"
  ],
  [
    0,
    4,
    "undated account reports benefits but does not quantify protection"
  ],
  [
    0,
    4,
    "cannot supply a universal flood-protection guarantee"
  ]
];
