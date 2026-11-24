import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const brazilHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertBrazilDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),['project-norte-sul-central','project-porto-do-acu','place-sao-joao-da-barra']);
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Project','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,12);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,12);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,brazilHash(r),'Article changed after exact-version review');
  }
  const [rail,port,city]=data.records;
  assert(rail.scope.includes('central Norte–Sul subconcession')&&rail.scope.includes('does not assert a direct rail link'));
  assert(rail.stage.includes('exact Alvorada authorization remain separate'));
  assert(port.scope.includes('counted once')&&port.scope.includes('not extra counted projects'));
  assert(port.stage.includes('future hydrogen facilities')||port.stage.includes('future hydrogen')||port.stage.includes('Future hydrogen'));
  assert(city.scope.includes('not Campos dos Goytacazes')&&city.timeline[0].date==='2022');
  assert(rail.sections[2].text.includes('should not invent a first-service date'));
  assert(rail.sections[3].text.includes('June 2026 appearance')&&rail.sections[3].text.includes('not a new issuance'));
  assert(port.sections[1].text.includes('cannot be added directly to tonnes'));
  assert(port.sections[3].text.includes('Capability is not a report of the fuel actually used'));
  assert(city.sections[2].text.includes('published on November 18, not held that day'));
  const historicalIds=['191-PROJECT-030','191-PROJECT-031','192-PLACE-015'];
  const historicalRoutes=['/review/global/projects/brazil-acquisition-1/','/review/global/projects/brazil-acquisition-2/','/review/global/places/brazil-place-acquisition/'];
  data.records.forEach((r,i)=>{assert.equal(r.historical_acquisition.record_id,historicalIds[i]);assert.equal(r.historical_acquisition.route,historicalRoutes[i]);assert(r.historical_acquisition.decision.includes('historical'));});
  const source=id=>data.sources.find(s=>s.id===id);
  assert.equal(source('rmc-fourth-amendment').document_date,'2024-05-10');
  assert.equal(source('rmc-fourth-amendment').effective_date,null);
  assert.equal(source('rmc-fourth-amendment').publication_date,null);
  assert.equal(source('rmc-fourth-amendment').index_publication_date,'2026-06-26');
  assert.equal(source('rmc-tariff-125').document_date,'2025-07-02');
  assert.equal(source('rmc-tariff-125').publication_date,'2025-07-18');
  assert.equal(source('rmc-tariff-125').effective_date,'2025-07-18');
  assert.equal(source('rmc-tariff-125').application_date,'2025-07-31');
  assert.equal(source('acu-financial-2025').publication_date,null);
  assert.equal(source('acu-bndes-gna2').reference_period,'Reported commercial operation begins May 2025');
  assert.equal(source('sjb-environment-minutes').event_date,'2026-09-24');
  assert.equal(source('sjb-environment-minutes').publication_date,'2026-11-18');
  assert.equal(source('sjb-education-plan').reference_period,'2022 census population; 2023 municipal school network');
  assert.equal(review.sources_sha256,brazilHash(data.sources));assert.equal(review.edition_sha256,brazilHash(data));
}
