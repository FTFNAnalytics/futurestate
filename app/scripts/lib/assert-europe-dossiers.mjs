import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const europeHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertEuropeDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-21');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),['project-hinkley-point-c','project-olkiluoto-3','place-somerset-council-area']);
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Project','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,11);const sourceIds=new Set(data.sources.map(s=>s.id));assert.equal(sourceIds.size,11);
  for(const s of data.sources){
    assert.equal(new URL(s.url).protocol,'https:');assert(s.publisher&&s.role&&s.locator&&s.inspection&&s.boundary);
    assert(Object.hasOwn(s,'publication_date'));
    for(const [,date] of Object.entries(s).filter(([k])=>k.endsWith('_date')||k==='period_end'))if(date!==null){assert(/^\d{4}-\d{2}-\d{2}$/.test(date));assert(date<=data.inspected_date);}
  }
  for(const r of data.records){
    assert.equal(r.identity_decision.eligible_count,1);assert(r.identity_decision.rationale.length>150);
    assert.equal(r.sections.length,6);assert.equal(new Set(r.sections.map(s=>s.heading)).size,6);
    assert(r.sections.map(s=>s.text).join(' ').split(/\s+/).length>=450);
    for(const s of r.sections){assert(s.heading&&s.text.length>200);assert(s.source_ids.every(id=>sourceIds.has(id)));if(!s.source_ids.length)assert.equal(s.claim_type,'Editorial evidence test');}
    assert(r.timeline.length>=3);let previous='';
    for(const item of r.timeline){assert(/^\d{4}-\d{2}(-\d{2})?$/.test(item.date));assert(item.date<=data.inspected_date&&item.date>=previous);previous=item.date;assert(item.event&&item.source_ids.length&&item.source_ids.every(id=>sourceIds.has(id)));}
    assert(r.next_artifacts.length>=3);assert(r.related.every(link=>/^\/atlas\/[a-z0-9/-]+\/$/.test(link.route)));
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,europeHash(r),'Article changed after exact-version review');
  }
  const [hpc,ol3,place]=data.records;
  assert(hpc.scope.includes('counted once')&&hpc.stage.startsWith('Under construction'));
  assert(ol3.scope.includes('Olkiluoto 1')&&ol3.scope.includes('Posiva')&&ol3.stage.startsWith('Operating unit'));
  assert(place.scope.includes('E06000066')&&place.scope.includes('not the wider ceremonial county'));
  assert.equal(data.sources.find(s=>s.id==='tvo-outage-nov17').event_date,'2026-11-17');
  assert.equal(data.sources.find(s=>s.id==='somerset-lhna').publication_date,null);
  assert.equal(data.sources.find(s=>s.id==='somerset-lhna').publication_period,'2026-04');
  assert.equal(review.sources_sha256,europeHash(data.sources));assert.equal(review.edition_sha256,europeHash(data));
}
