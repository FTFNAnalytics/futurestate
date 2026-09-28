import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import data from '../src/data/locality-dossiers.json' with {type:'json'};
import history from '../src/data/phase-178-systems-atlas-and-compendium-depth-expansion.json' with {type:'json'};
import reviews from '../src/data/place-identity-reviews.json' with {type:'json'};
import decisions from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {localityDossierFor,localityConnections} from '../src/lib/locality-dossiers.mjs';
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const hash=value=>createHash('sha256').update(Buffer.isBuffer(value)?value:JSON.stringify(value)).digest('hex');
const required={
 '178-DOSSIER-001':['expected commercial production in 2026','not a milestone completed merely because the calendar has advanced'],
 '178-DOSSIER-002':['county name is not a facility polygon','not an independently measured national supply deficit'],
 '178-DOSSIER-003':['does not present that amount as a newly reconciled','not three additional places'],
 '178-DOSSIER-004':['parcel 2002008000','parcel 1002008000','does not silently select a map heading','not proof of present compliance'],
 '178-DOSSIER-005':['without choosing between those municipal identities','one material\'s qualification should not be transferred to the other'],
 '178-DOSSIER-006':['non-binding preliminary terms','neither upgrades the proposal to a final award'],
 '178-DOSSIER-007':['does not itself supply a validated protocol','neither the ceiling nor the intended capacity establishes'],
 '178-DOSSIER-008':['not three US$105 million awards','Dividing it equally would also invent an allocation'],
 '178-DOSSIER-009':['must not create a separate Camas award','does not claim a current final agreement'],
 '178-DOSSIER-010':['not final delivered volumes','August 6 publication date is also distinct from the August 1 observation date']
};
export function assertLocalityDossiers(candidate){
 assert.equal(candidate.policy_id,decisions.policy_id);assert.equal(candidate.records.length,10);assert.equal(candidate.completed_locality_accounts,10);assert.equal(candidate.additional_place_identities,0);
 for(const key of ['human_review_required','human_review_claimed','source_retrieval_performed'])assert.equal(candidate[key],false);assert.equal(candidate.operating_outcomes_admitted,0);
 assert.deepEqual(candidate.records.map(r=>r.record_id),history.place_system_dossiers.map(r=>r.place_system_dossier_id));assert.equal(new Set(candidate.records.map(r=>r.route)).size,10);
 for(const r of candidate.records){
  const original=history.place_system_dossiers.find(o=>o.place_system_dossier_id===r.record_id),note=reviews.records.find(n=>n.record_id===r.record_id),decision=decisions.named_places.find(d=>d.record_id===r.record_id),followups=reviews.followups.filter(f=>f.record_id===r.record_id);
  const sources=[...note.source_keys.map(key=>({...reviews.sources.find(s=>s.key===key),recorded_check_date:reviews.checked_date})),...followups.flatMap(f=>f.sources.map(s=>({...s,recorded_check_date:f.checked_date})))];
  assert.equal(r.route,original.route);assert.equal(r.scope,decision.scope);assert.equal(r.identity_count,1);assert.equal(r.additional_identity_count,0);assert.equal(r.municipal_boundary_verified,false);assert.deepEqual(r.operating_observations,[]);
  assert.equal(r.authored_date,candidate.authored_date);assert.equal(r.ai_review_date,candidate.authored_date);assert(r.reviewer.includes('Codex'));assert(r.review_state.startsWith('AI-reviewed'));
  assert.deepEqual(r.input_sha256,{historical_dossier:hash(original),geographic_check:hash(note),eligibility_decision:hash(decision),followups:hash(followups),source_checks:hash(sources)});
  assert.deepEqual(r.source_checks,sources);assert.deepEqual(r.source_ids,original.source_ids);
  const {sha256,...unsigned}=r;assert.equal(sha256,hash(unsigned));assert(r.sections.length>=3&&r.sections.every(s=>s.heading&&s.text.length>200));assert.equal(new Set(r.sections.map(s=>s.heading)).size,r.sections.length);
  assert(r.next_artifact.length>100);assert(r.timeline.some(t=>t.kind==='AI identity decision'&&t.date===decisions.decision_date&&t.text===decision.rationale));assert(r.timeline.some(t=>t.date===candidate.authored_date&&t.kind==='AI editorial review'));
  assert.equal(r.timeline[0].date,['178-DOSSIER-006','178-DOSSIER-007','178-DOSSIER-008','178-DOSSIER-009'].includes(r.record_id)?'2025-01-16':r.record_id==='178-DOSSIER-001'?'2026-07-13':'2026-08-06');
  for(const text of required[r.record_id])assert([r.answer,...r.sections.map(s=>s.text)].join(' ').toLowerCase().includes(text.toLowerCase()),`${r.record_id}: lost reviewed distinction ${text}`);
  assert.deepEqual(r.related_record_ids,r.record_id==='178-DOSSIER-008'?['178-DOSSIER-009']:r.record_id==='178-DOSSIER-009'?['178-DOSSIER-008']:[]);
 }
}
assertLocalityDossiers(data);
const manuscript=await readFile(new URL(`../../${data.source_manuscript.path}`,import.meta.url));assert.equal(hash(manuscript),data.source_manuscript.sha256);
assert.deepEqual(data.source_manuscript.record_ids,['178-DOSSIER-001','178-DOSSIER-002','178-DOSSIER-003','178-DOSSIER-005','178-DOSSIER-010']);
for(const original of history.place_system_dossiers){
 const r=localityDossierFor(original);assert(r);assert.equal(r.record_id,original.place_system_dossier_id);assert.equal(localityDossierFor({...original,route:'/unrelated/'}),null);assert.equal(localityDossierFor({...original,title:'Changed record'}),null);assert.equal(localityDossierFor({route:original.route,title:original.title}),null);
 assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);const catalog=readerCatalog.find(c=>c.id===r.record_id);assert.equal(catalog.title,r.title);assert.equal(catalog.summary,r.answer);assert.equal(catalog.kind,'Place');assert.equal(catalog.date,r.ai_review_date);
 assert(searchReaders(readerCatalog,original.place_identity,'Place').some(c=>c.id===r.record_id));assert(searchReaders(readerCatalog,r.record_id,'Place').some(c=>c.id===r.record_id));assert.deepEqual(localityConnections(r).map(c=>c.record_id),r.related_record_ids);
}
for(const r of [...history.comparison_overlays,...history.interpretive_essays])assert.equal(localityDossierFor(r),null);
for(const mutate of [
 c=>{c.records[0].input_sha256.geographic_check='0'.repeat(64);},
 c=>{c.records[1].scope='City of Genesee';},
 c=>{c.records[2].sections[1].text=c.records[2].sections[1].text.replace('does not present that amount as a newly reconciled','now confirms a reconciled');},
 c=>{c.records[3].identity_count=3;},
 c=>{c.records[7].sections[1].text=c.records[7].sections[1].text.replace('not three US$105 million awards','three US$105 million awards');},
 c=>{c.records[9].sections[1].text=c.records[9].sections[1].text.replace('not final delivered volumes','final delivered volumes');},
 c=>{c.records[9].operating_observations=[{water_delivery:0}];}
]){const changed=structuredClone(data);mutate(changed);for(const r of changed.records){const {sha256,...unsigned}=r;r.sha256=hash(unsigned);}assert.throws(()=>assertLocalityDossiers(changed));}
console.log('Locality assertions passed: ten substantive AI-reviewed articles, exact historical/geographic/eligibility/source inputs, unchanged place count, exact-route projection, searchable aliases, and rejected stale-input, municipal, funding, double-count and delivery promotions.');
