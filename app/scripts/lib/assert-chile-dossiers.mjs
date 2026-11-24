import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const chileHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertChileDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),['project-cerro-pabellon','project-atacama-drinking-water-desalination','place-copiapo-municipality']);
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Project','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,13);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,13);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,chileHash(r),'Article changed after exact-version review');
  }
  const [cerro,water,city]=data.records;
  assert(cerro.scope.includes('counted once')&&cerro.scope.includes('separate local hybrid'));
  assert(cerro.stage.includes('annual net output and sustained availability not established'));
  assert(water.scope.includes('ECONSSA')&&water.scope.includes('not AguasCAP'));
  assert(water.stage.includes('expanded design capacity and sustained household outcomes remain separate'));
  assert(city.scope.includes('not the entire Copiapó province')&&city.timeline[1].date==='2024');
  assert(city.sections[4].text.includes('Shares are not litres per second'));
  assert(cerro.sections[3].text.includes('not silently repaired'));
  assert(water.sections[0].text.includes('unit conversion, not observed daily delivery'));
  const historicalIds=['191-PROJECT-032','191-PROJECT-033','192-PLACE-016'];
  const historicalRoutes=['/review/global/projects/chile-acquisition-1/','/review/global/projects/chile-acquisition-2/','/review/global/places/chile-place-acquisition/'];
  data.records.forEach((r,i)=>{assert.equal(r.historical_acquisition.record_id,historicalIds[i]);assert.equal(r.historical_acquisition.route,historicalRoutes[i]);assert(r.historical_acquisition.decision.includes('historical'));});
  const source=id=>data.sources.find(s=>s.id===id);
  assert.equal(source('atacama-sma-construction').event_date,'2019-05-29');
  assert.equal(source('atacama-sma-construction').publication_date,'2019-05-30');
  assert.equal(source('atacama-mop-visit').publication_date,null);
  assert.equal(source('atacama-inima-leaflet').publication_date,null);
  assert.equal(source('cerro-grid-comments').publication_date,null);
  assert.equal(source('copiapo-bcn-2026').publication_period,'2026');
  assert.equal(source('copiapo-mop-2012').publication_date,'2012-08-06');
  assert.equal(source('copiapo-water-rights-2026').publication_date,'2026-05-26');
  assert.equal(source('atacama-uc-coast').publication_date,'2025-08-01');
  assert.equal(review.sources_sha256,chileHash(data.sources));assert.equal(review.edition_sha256,chileHash(data));
}
