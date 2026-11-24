import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const stockholmHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertStockholmDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),['project-stockholm-bypass','project-slussen-redevelopment','place-stockholm-municipality']);
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
    assert(r.sections.map(s=>s.text).join(' ').split(/\s+/).length>=450);
    for(const s of r.sections){assert(s.heading&&s.text.length>200);assert(s.source_ids.every(id=>ids.has(id)));if(!s.source_ids.length)assert.equal(s.claim_type,'Editorial evidence test');}
    assert(r.timeline.length>=3);let previous='';
    for(const item of r.timeline){validPeriod(item.date);assert(item.date<=data.inspected_date&&item.date>=previous);previous=item.date;assert(item.event&&item.source_ids.length&&item.source_ids.every(id=>ids.has(id)));}
    assert(r.next_artifacts.length>=3);assert(r.related.every(link=>/^\/atlas\/[a-z0-9/-]+\/$/.test(link.route)));
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,stockholmHash(r),'Article changed after exact-version review');
  }
  const [road,slussen,city]=data.records;
  assert(road.scope.includes('counted once across tunnel sections')&&road.scope.includes('not the whole E4'));
  assert(road.stage.includes('remain scheduled rather than observed'));
  assert(slussen.scope.includes('components, not separately counted projects'));
  assert(slussen.stage.includes('passenger service and full waterworks acceptance are not established'));
  assert(city.scope.includes('not Stockholm County')&&city.scope.includes('one municipal identity'));
  assert.equal(road.timeline[0].date,'2021-04-23');assert.equal(slussen.timeline[2].date,'2026-09-30');assert.equal(city.timeline[0].date,'2023-07-01');
  assert(road.sections[1].text.includes('the first opening remains future-dated'));
  assert(road.sections[2].text.includes('not a statement that the full bypass will operate as a one-lane road'));
  assert(road.sections[3].text.includes('not a public-service reliability series'));
  assert(road.sections[4].text.includes('does not establish the present court disposition'));
  assert(slussen.sections[2].text.includes('November 16 body update')&&slussen.sections[2].text.includes('October 16 footer date'));
  assert(slussen.sections[3].text.includes('still gave no fixed date for passenger traffic'));
  assert(slussen.sections[4].text.includes('without actors representing passengers')&&slussen.sections[4].text.includes('exact publication day is left unspecified'));
  assert(city.sections[3].text.includes('sampling in 2025')&&city.sections[3].text.includes('5.6 degrees dH')&&city.sections[3].text.includes('neither a maximum nor a current reading'));
  assert(city.sections[4].text.includes('does not itself establish the survey’s numerical results'));
  const historicalIds=['191-PROJECT-018','191-PROJECT-019','192-PLACE-009'];
  const historicalRoutes=['/review/global/projects/sweden-acquisition-1/','/review/global/projects/sweden-acquisition-2/','/review/global/places/sweden-place-acquisition/'];
  data.records.forEach((r,i)=>{assert.equal(r.historical_acquisition.record_id,historicalIds[i]);assert.equal(r.historical_acquisition.route,historicalRoutes[i]);assert(r.historical_acquisition.decision.includes('historical'));});
  const source=id=>data.sources.find(s=>s.id===id);
  assert.equal(source('bypass-opening-announcement').publication_date,'2026-10-07');
  assert.equal(source('bypass-exercise').publication_date,'2026-11-10');
  assert.equal(source('bypass-exercise').reference_period,'Exercise earlier in autumn 2026; exact exercise date not stated');
  assert.equal(source('bypass-groundwater-2021').document_date,'2021-04-23');assert.equal(source('bypass-groundwater-2021').publication_date,null);
  assert.equal(source('slussen-water-works').content_updated_date,'2026-11-16');assert.equal(source('slussen-water-works').footer_updated_date,'2026-10-16');
  assert.equal(source('slussen-terminal-handover').event_date,'2026-09-30');
  assert.equal(source('slussen-week47').publication_date,null);
  assert.equal(source('stockholm-areas').event_date,'2023-07-01');
  assert.equal(source('stockholm-environment').event_date,'2024-09-23');
  assert.equal(source('stockholm-northwest-water-2025').document_date,'2026-03-30');
  assert.equal(source('stockholm-northwest-water-2025').reference_period,'2025 sampling programme');
  assert.equal(source('stockholm-northwest-water-2025').publication_date,null);
  assert.equal(source('stockholm-resident-survey').updated_date,'2026-08-11');
  assert.equal(review.sources_sha256,stockholmHash(data.sources));assert.equal(review.edition_sha256,stockholmHash(data));
}
