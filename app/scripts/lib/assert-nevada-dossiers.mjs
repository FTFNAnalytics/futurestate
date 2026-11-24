import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const nevadaHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertNevadaDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-21');
  assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(data.independent_review,false);assert.equal(data.operating_outcome_admitted,false);
  assert.equal(review.review_date,data.inspected_date);assert.equal(review.independent_review,false);
  for(const key of ['publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),['project-thacker-pass-nevada','project-rhyolite-ridge-nevada','place-humboldt-county-nevada']);
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Project','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3,'Distinct routes required');
  assert.equal(data.sources.length,11);assert.equal(new Set(data.sources.map(s=>s.id)).size,11);
  const sourceIds=new Set(data.sources.map(s=>s.id));
  for(const s of data.sources){
    assert.equal(new URL(s.url).protocol,'https:');assert(s.publisher&&s.role&&s.locator&&s.inspection&&s.boundary);
    assert(Object.hasOwn(s,'publication_date'),'Unknown publication dates must be explicit null');
    for(const [,date] of Object.entries(s).filter(([k])=>k.endsWith('_date')||k==='period_end'))if(date!==null){assert(/^\d{4}-\d{2}-\d{2}$/.test(date));assert(date<=data.inspected_date,`${s.id}: source date after inspection`);}
  }
  for(const r of data.records){
    assert.equal(r.identity_decision.eligible_count,1);assert(r.identity_decision.rationale.length>150);
    assert.equal(r.sections.length,6);assert.equal(new Set(r.sections.map(s=>s.heading)).size,6);
    assert(r.sections.map(s=>s.text).join(' ').split(/\s+/).length>=450,'Substantive article required');
    for(const s of r.sections){assert(s.heading&&s.text.length>200);assert(s.source_ids.every(id=>sourceIds.has(id)),'Unresolved source');if(!s.source_ids.length)assert.equal(s.claim_type,'Editorial evidence test');}
    assert(r.next_artifacts.length>=3);assert(r.related.every(link=>/^\/atlas\/[a-z0-9/-]+\/$/.test(link.route)));
    const decision=review.records.find(d=>d.record_id===r.record_id);assert(decision);assert.equal(decision.sha256,nevadaHash(r),`Article changed after review: ${r.record_id}`);
  }
  const [thacker,rhyolite,county]=data.records;
  assert(thacker.scope.includes('Humboldt County'));assert(rhyolite.scope.includes('Esmeralda County')&&rhyolite.scope.includes('Tooele'));
  assert(county.scope.includes('FIPS 32013')&&county.scope.includes('not Humboldt County California'));
  assert(thacker.stage.includes('future'));assert(rhyolite.stage.includes('pending'));assert(county.stage.includes('not established'));
  const rule=data.sources.find(s=>s.id==='fws-tiehms-rule');assert.equal(rule.publication_date,'2022-12-16');assert.equal(rule.effective_date,'2023-01-17');
  const rod=data.sources.find(s=>s.id==='blm-rhyolite-rod');assert.equal(rod.publication_date,'2024-10-29');assert.equal(rod.event_date,'2024-10-24');
  assert.equal(review.sources_sha256,nevadaHash(data.sources),'Source provenance changed after review');
  assert.equal(review.edition_sha256,nevadaHash(data),'Edition changed after review');
}
