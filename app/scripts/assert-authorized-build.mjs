import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
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
assert.deepEqual(dossiers.records.map(r=>r.record_id),decisions.portfolio.next_project_batch);
assert.equal(dossiers.records.length,5);assert.equal(new Set(dossiers.records.map(r=>r.route)).size,5);
assert.equal(dossiers.deployment_source.sha256,reconciliation.source_sha256);
for(const d of dossiers.records){
 const p=baseline.projects.find(p=>p.project_id===d.record_id),s=reconciliation.records.find(s=>s.project_id===d.record_id),g=baseline.subgrantees.find(g=>g.subgrantee_id===p.subgrantee_id);
 const {sha256,...payload}=d;assert.equal(sha256,hash(payload));
 assert.equal(d.source_identity.project_record_sha256,hash(p));assert.equal(d.source_identity.reconciliation_record_sha256,hash(s));assert.equal(d.source_identity.subgrantee_record_sha256,hash(g));
 assert.equal(d.source_identity.uei,p.uei);assert.equal(d.source_identity.csv_row,s.csv_row);assert.equal(d.source_name,s.name);
 for(const key of ['bead_support_usd','subgrantee_match_usd','raw_technology_codes','intersects_tribal_land'])assert.deepEqual(d.proposal[key],p[key]);
 assert.equal(d.proposal.broadband_serviceable_location_rows,p.bsl_count);assert.equal(d.proposal.community_anchor_institution_rows,p.cai_count);
 assert.equal(d.proposal.tribal_consent_field,p.tribal_consent_name);
 for(const key of ['estimated_subaward_date','estimated_performance_start','estimated_performance_end'])assert.equal(d.proposal[key],s[key]);
 assert.deepEqual(d.operating_observations,[]);assert.equal(p.outcome_state,null);
 assert.equal(d.sections.length,3);assert(d.sections.every(s=>s.text.length>200));
 assert(d.next_artifacts[0].includes(d.record_id));assert(d.next_artifacts[1].includes(d.record_id));
 for(const id of d.related_project_ids)assert(dossiers.records.some(r=>r.record_id===id&&r.source_identity.uei===d.source_identity.uei));
}
assert.deepEqual(decisions.language.locales.map(r=>r.locale),['fr-CA','es-419']);assert.equal(decisions.language.human_approval_required,false);
console.log('Authorized build assertions passed: 103 explicit identity/counting decisions; 54 project and 25 place candidates; five source-pinned proposal dossiers; no invented operating observations.');
