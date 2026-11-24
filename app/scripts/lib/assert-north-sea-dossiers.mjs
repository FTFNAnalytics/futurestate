import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const northSeaHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertNorthSeaDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),['project-northern-lights','place-oygarden-municipality','place-rotterdam-municipality']);
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Place','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,16);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,16);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,northSeaHash(r),'Article changed after exact-version review');
  }
  const [project,islands,city]=data.records;
  assert(project.scope.includes('counted once across development phases')&&project.scope.includes('add no project counts'));
  assert(project.stage.includes('sustained full-chain performance retain separate'));
  assert(islands.scope.includes('former smaller Øygarden')&&islands.scope.includes('not Bergen'));
  assert(city.scope.includes('not the Rotterdam–The Hague metropolitan region'));
  assert.equal(project.timeline[0].date,'2025-08');assert.equal(islands.timeline[0].date,'2020-01-01');
  assert(project.sections[1].text.includes('99.81 mole percent')&&project.sections[1].text.includes('30 ppm-mol')&&project.sections[1].text.includes('not a mass percentage'));
  assert(project.sections[2].text.includes('not a reported annual quantity stored'));
  assert(project.sections[3].text.includes('2028–2029'));
  assert(project.sections[4].text.includes('already-liquefied cargo')&&project.sections[4].text.includes('not a capture-inclusive removal rate'));
  assert(islands.sections[2].text.includes('still supplied no replacement date and expected opening after 2027'));
  assert(islands.sections[3].text.includes('not a substitute for dated interruption'));
  assert(city.sections[2].text.includes('not a measured citywide reduction in flood damage'));
  assert(city.sections[4].text.includes('cannot become a score for Rotterdam households'));
  assert(city.sections[5].text.includes('not evidence that the two municipalities share the same hazards or a proven Northern Lights cargo route'));
  const historicalIds=['191-PROJECT-016','192-PLACE-008','192-PLACE-007'];
  const historicalRoutes=['/review/global/projects/norway-acquisition-1/','/review/global/places/norway-place-acquisition/','/review/global/places/netherlands-place-acquisition/'];
  data.records.forEach((r,i)=>{assert.equal(r.historical_acquisition.record_id,historicalIds[i]);assert.equal(r.historical_acquisition.route,historicalRoutes[i]);assert(r.historical_acquisition.decision.includes('historical'));});
  const source=id=>data.sources.find(s=>s.id===id);
  assert.equal(source('nl-first-injection').publication_date,'2025-08-25');
  assert.equal(source('nl-completion').event_date,'2025-10-01');assert.equal(source('nl-completion').publication_date,'2025-10-29');
  assert.equal(source('nl-cargo-specification').publication_date,null);
  assert.equal(source('nl-wastewater-pilot').reference_period,'Truck deliveries since February 2026');
  assert.equal(source('nl-footprint-model').publication_date,null);
  assert.equal(source('nl-footprint-model').reference_period,'March 2023 development assumptions; lifetime model');
  assert.equal(source('oygarden-merger').event_date,'2020-01-01');
  assert.equal(source('oygarden-risk').document_date,'2025-10-21');
  assert.equal(source('sotra-november-local').event_date,'2026-11-12');
  assert.equal(source('sotra-november-local').publication_date,'2026-11-12');
  assert.equal(source('sotra-november-local').updated_date,'2026-11-20');
  assert.equal(source('rotterdam-benthemplein').event_date,'2013-12-04');
  assert.equal(source('rotterdam-benthemplein').publication_date,null);
  assert.equal(source('rotterdam-grp').reference_period,'GRP 2021–2025 extended through 2026');
  assert.equal(review.sources_sha256,northSeaHash(data.sources));assert.equal(review.edition_sha256,northSeaHash(data));
}
