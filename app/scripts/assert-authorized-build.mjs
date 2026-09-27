import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {assertMontanaDossiers} from './lib/assert-montana-dossiers.mjs';
import {montanaContextFor,montanaConnections} from '../src/lib/montana-dossiers.mjs';
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const read=async p=>JSON.parse(await readFile(join(root,p),'utf8'));
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const [decisions,portfolio,dossiers,baseline,census,reconciliation]=await Promise.all([
 'app/src/data/owner-authorized-adjudications.json','app/src/data/portfolio-eligibility-decisions.json','app/src/data/montana-project-dossiers.json',
 'app/src/data/phase-57g-montana-project-cohort-registry.json','docs/release-reviews/2026-09-22/portfolio-census.json','docs/release-reviews/2026-09-22/evidence/montana-csv-reconciliation.json'
].map(read));
assert.equal(portfolio.policy_id,decisions.policy_id);assert.equal(dossiers.policy_id,decisions.policy_id);
for(const name of ['phase-116-coverage-architecture','phase-119-deep-project-place-atlas','phase-185-global-place-systems-atlas-i','phase-205-216-current-editorial','place-identity-reviews']){
 const pin=census.inputs.find(p=>p.path===`app/src/data/${name}.json`);assert(pin);
 assert.equal(createHash('sha256').update(await readFile(join(root,pin.path))).digest('hex'),pin.sha256,`Census input changed: ${name}; review affected identity decisions`);
}
const groups=[[portfolio.canonical,census.entities,'canonical_id'],[portfolio.named_places,census.followup.named_place_dossiers,'id'],[portfolio.new_editorial_candidates,census.additional_editorial_candidates,'record_id']];
for(const [actual,expected,id] of groups){
 assert.equal(actual.length,expected.length);
 assert.equal(new Set(actual.map(d=>d.record_id)).size,expected.length);
 for(const d of actual){const input=expected.find(r=>r[id]===d.record_id);assert(input);assert.equal(d.input_sha256,hash(input),`Identity input changed: ${d.record_id}`);assert.equal(d.route,input.route);assert([0,1].includes(d.eligible_count));assert.equal(d.operating_outcome_admitted,false);assert(d.scope&&d.rationale.length>50);}
}
assert.equal(decisions.portfolio.montana.records.length,32);assert.equal(decisions.portfolio.jurisdictions.length,18);
assert.deepEqual(decisions.portfolio.montana.records.map(r=>r.source_project_id).sort(),baseline.projects.map(r=>r.project_id).sort());
assert(decisions.portfolio.jurisdictions.every(r=>r.count===0));assert.equal(decisions.portfolio.montana.parent_additional_count,0);
assert.equal(decisions.portfolio.montana.source_sha256,reconciliation.source_sha256);
const count=kind=>portfolio.canonical.filter(r=>r.kind===kind).reduce((n,r)=>n+r.eligible_count,0)+portfolio.new_editorial_candidates.filter(r=>r.kind===kind).length+(kind==='Project'?32:portfolio.named_places.length);
assert.equal(portfolio.summary.eligible_project_candidates,count('Project'));assert.equal(portfolio.summary.eligible_place_candidates,count('Place'));
assert.equal(portfolio.summary.additional_distinct_project_candidates_needed,100-count('Project'));assert.equal(portfolio.summary.additional_distinct_place_candidates_needed,70-count('Place'));
assertMontanaDossiers(dossiers,baseline,reconciliation,decisions.portfolio.next_project_batch);
const manuscript=dossiers.completion.source_manuscript;assert.equal(createHash('sha256').update(await readFile(join(root,manuscript.path))).digest('hex'),manuscript.sha256);
for(const d of dossiers.records){
 assert.equal(readerCatalog.filter(r=>r.id===d.record_id).length,1);assert.equal(readerCatalog.find(r=>r.id===d.record_id).route,d.route);
 assert(searchReaders(readerCatalog,d.record_id,'Project').some(r=>r.id===d.record_id));assert(searchReaders(readerCatalog,d.source_identity.uei,'Project').some(r=>r.id===d.record_id));
 const siblings=montanaConnections(d,dossiers).same_operator;
 assert.deepEqual(siblings.map(r=>r.record_id),baseline.projects.filter(r=>r.uei===d.source_identity.uei&&r.project_id!==d.record_id).map(r=>r.project_id).sort((a,b)=>dossiers.records.findIndex(r=>r.record_id===a)-dossiers.records.findIndex(r=>r.record_id===b)));
 assert.equal(montanaContextFor(d,dossiers).record_id,d.record_id);
}
for(const mutate of [
 d=>{d.records.find(r=>r.record_id==='CM61-BEAD-MT-4678').proposal.broadband_serviceable_location_rows=21;},
 d=>{d.reporting_contexts.find(r=>r.record_id==='CM61-BEAD-MT-4218').reporting_contract='LEO quarterly and ten-year post-availability contract';},
 d=>{d.records.find(r=>r.record_id==='CM61-BEAD-MT-4206').related_project_ids=['CM61-BEAD-MT-4218'];},
 d=>{d.records.find(r=>r.record_id==='CM61-BEAD-MT-4644').operating_observations=[{active_subscriptions:0}];}
]){const changed=structuredClone(dossiers);mutate(changed);for(const r of changed.records){const {sha256,...payload}=r;r.sha256=hash(payload);}assert.throws(()=>assertMontanaDossiers(changed,baseline,reconciliation,decisions.portfolio.next_project_batch));}
assert.deepEqual(decisions.language.locales.map(r=>r.locale),['fr-CA','es-419']);assert.equal(decisions.language.human_approval_required,false);
console.log('Authorized build assertions passed: 103 identity/counting decisions; 54 project and 25 place candidates; all 32 source-pinned Montana proposal dossiers, with five original records unchanged; exact reporting/anchor/UEI distinctions, searchable identities and no invented operating observations.');
