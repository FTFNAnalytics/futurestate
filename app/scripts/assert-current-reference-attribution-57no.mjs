import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import pins from './content-205-216/reference-attribution-57no-inputs.json' with {type:'json'};
import ledger from '../src/data/phase-206-reference-attribution.json' with {type:'json'};
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFile(join(root,p),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const json=async p=>JSON.parse(await read(p));
assert.equal(hash(JSON.stringify(ledger.records.slice(0,543))),pins.previous_records_hash,'An earlier attribution review changed');
assert.equal(pins.prior_input_pins.length,25);assert.equal(pins.supporting_result_pins.length,7);
for(const pin of [...pins.prior_input_pins,...pins.supporting_result_pins])assert.equal(hash(await read(pin.path)),pin.sha256,`Pinned input changed: ${pin.path}`);
const targets={
 'amtrak-pids':[15,'Code-bearing official current asset register or closeout table'],
 'amtrak-reliability':[21,'Named-asset-period reliability table'],
 'la-nextlink-adoption':[18,'Privacy-safe official completed-period adoption table'],
 'la-starlink-adoption':[18,'Privacy-safe official completed-period LEO adoption table'],
 'mt-bead-quarter':[21,'Completed public project-quarter table'],
 'hanford-mass-balance':[36,'Stable-identity transfer, receipt, and disposition evidence chain'],
 'nnsa-qualified-rate':[18,'Official site-period recurring qualified-output table'],
 'nnsa-accepted-capacity':[18,'Official site-period installed, qualified, and accepted capacity table'],
 'nnsa-gao-baseline':[15,'GAO recommendation-status record with responsive agency evidence'],
};
const row=(key,suffix)=>{const r=ledger.records.find(r=>r.id===`research-doc-${key}-${suffix}`);assert(r,`${key}/${suffix}`);return r;};
const findings=r=>r.correction.key_findings.join(' ');
for(const t of pins.tranches){
 assert.equal(hash(await read(`src/content/research-collections/${t.collection_slug}.json`)),t.collection_sha256);
 const rows=ledger.records.filter(r=>r.id.startsWith(`research-doc-${t.key}-`));assert.equal(rows.length,29);
 assert.equal(rows.filter(r=>r.content_type==='FTFN method/test note').length,20);assert.equal(rows.filter(r=>r.content_type==='Research docket').length,9);
 for(const r of rows){
  const d=await json(`src/content/${r.source_file}`);assert.equal(r.review_date,'2026-09-15');assert.equal(d.publication_date,'2026-08-09');assert.equal(d.captured_date,'2026-08-09');assert.equal(r.inherited_publisher_label,d.publisher);assert.match(r.correction.summary,/August 9/);
  const expected=[`Title: ${d.title}`,`Publisher: ${d.publisher}`,`Publication date: ${d.publication_date}`,`Official URL: ${d.official_url}`,`Capture status: ${d.capture_status}`,`Record status: ${d.record_status}`,`Captured by FTFN: ${d.captured_date}`,'',`Boundary: ${d.evidence_limits.join(' ')}`,'','Supporting public artifacts:',...d.supporting_official_urls.map(u=>'- '+u)].join('\n');
  assert.equal((await read('public'+d.local_capture_path)).replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').trimEnd(),expected);
  assert(d.evidence_limits.join(' ').includes('1 Closed / 21 Partially Closed / 2 Open'));
  if(r.content_type==='Research docket'){
   const [n,target]=targets[r.id.replace(`research-doc-${t.key}-preserved-`,'')];assert.equal(d.record_status,'In Review');assert.equal(r.prior.document_type,'Technical Report');assert(r.prior.key_findings.includes('Next action: '+target));assert(r.correction.key_findings.includes(`Historical reopening request (August 9): ${target}.`));
   assert(r.correction.summary.includes(t.key==='57n'?`${n} adapter tests, two packet executions and six receipt templates`:'47 synthetic cases: 7 authorization, 30 receipt integrity and 10 handoff'));assert(r.correction.summary.includes('does not exist'));
  }else{assert.equal(d.record_status,'Published');assert.equal(r.prior.document_type,'Data Release');}
 }
 const b=ledger.records.find(r=>r.id===`briefing-${t.briefing_slug}`);assert.equal(b.correction.claim_scope,'Internal FTFN record');assert.equal(b.correction.local_evidence_level,'Not local operating evidence');assert(b.correction.top_takeaways.some(s=>s.includes('Two Amtrak, three broadband, one Hanford and three NNSA')));
}
// Inspect stored historical results; do not invoke the historical harnesses.
const integrity=await json('src/data/phase-57o-receipt-integrity-checks.json');
const roles=await json('src/data/phase-57o-reviewer-role-authorization-matrices.json');
const handoff=await json('src/data/phase-57o-publication-handoff-state-machines.json');
const workflow=await json('src/data/phase-57o-workflow-harness-results.json');
const adapter=await json('src/data/phase-57n-adapter-conformance-tests.json');
const packets=await json('src/data/phase-57n-packet-validation-harness-results.json');
const templates=await json('src/data/phase-57n-reviewer-receipt-ledger.json');
assert.equal(integrity.cases.length,270);assert.equal(roles.test_cases.length,63);assert.equal(handoff.cases.length,90);
const caseIds=[...integrity.cases,...roles.test_cases,...handoff.cases].map(r=>r.test_id);assert.equal(new Set(caseIds).size,423);assert.deepEqual([...workflow.test_ids].sort(),caseIds.sort());
assert.equal(integrity.cases.filter(r=>['mutated_citation','mutated_decision_time'].includes(r.test_class)).length,108);
assert.equal(adapter.tests.length,180);assert.equal(packets.executions.length,18);assert.equal(templates.templates.length,54);
assert(templates.templates.every(r=>r.template_only&&r.actual_receipt===false&&r.reviewer_identity.profile_id===null&&r.cited_source.source_id===null&&r.decision_time===null));
assert(packets.executions.every(r=>r.fixture_only&&r.candidate_packet_evaluated===false&&r.evidence_ingested===false&&r.eligible_record===false&&r.actual_decision!=='accept'));
for(const[cohort,label,n,fields]of [['amtrak','Amtrak',2,12],['broadband','Broadband',3,19],['hanford','Hanford',1,12],['nnsa','NNSA',3,17]]){
 for(const key of ['57n','57o'])assert.equal(ledger.records.filter(r=>r.id.startsWith(`research-doc-${key}-${cohort}-`)).length,5);
 const i=integrity.cases.filter(r=>r.evidence_rail===label),a=roles.test_cases.filter(r=>r.evidence_rail===label),h=handoff.cases.filter(r=>r.evidence_rail===label);
 assert.equal(i.length,30*n);assert.equal(a.length,7*n);assert.equal(h.length,10*n);
 for(const klass of ['complete_synthetic_receipt','missing_required_field','incompatible_reason_code','mutated_citation','mutated_decision_time'])assert.equal(i.filter(r=>r.test_class===klass).length,6*n);
 assert.equal(a.filter(r=>r.test_class==='same_actor_separation_rejection').length,n);
 assert.equal(h.filter(r=>r.actual_state==='awaiting_separate_publication_review').length,n);assert.equal(h.filter(r=>r.actual_state==='decision_terminal_no_handoff').length,5*n);assert.equal(h.filter(r=>r.actual_state==='integrity_rejected').length,4*n);
 const role=row('57o',`${cohort}-${n}-reviewer-role-authorization-matrices`);assert(role.correction.summary.includes(`${7*n} synthetic authorization cases`));assert.match(findings(role),/Role classes are definitions, not assigned people/);
 const receipt=row('57o',`${cohort}-${30*n}-receipt-completeness-reason-code-checks`);assert(receipt.correction.summary.includes(`${12*n} citation/time-mutation cases are already included`));assert.match(findings(receipt),/Missing fields cannot be inferred or backfilled/);
 const mutation=row('57o',`${cohort}-${12*n}-citation-timestamp-mutation-rejections`);assert(mutation.correction.summary.includes(`subset of the same ${30*n}`));assert.match(findings(mutation),/integrity rejection does not determine the substantive review outcome/);
 const route=row('57o',`${cohort}-${10*n}-publication-handoff-state-routes`);assert(route.correction.summary.includes(`${n} complete accept queue routes, ${5*n} non-accept terminal routes and ${4*n} invalid accept rejections`));assert.match(findings(route),/Queue entry is not a publication decision/);
 assert(row('57o',`${cohort}-zero-actual-review-handoff-trigger-or-publication-events`).correction.summary.includes(`not ${47*n} additional cases`));
 const tests=adapter.tests.filter(r=>r.evidence_rail===label);assert.equal(tests.filter(r=>r.test_class==='accepted_label').length,2*fields);assert.equal(tests.length,3*fields);assert.equal(packets.executions.filter(r=>r.evidence_rail===label).length,2*n);
 const accepted=row('57n',`${cohort}-${2*fields}-accepted-label-conformance-tests`);assert(accepted.correction.summary.includes(`${fields} fields and ${n} contracts`));assert.match(findings(accepted),/case normalization and outer-whitespace trimming/);assert.match(findings(accepted),/Semantic aliasing and inner-whitespace transformation are disallowed/);assert.match(findings(accepted),/neither supplies nor validates its field value/);
 const ambiguous=row('57n',`${cohort}-${fields}-ambiguous-label-rejections`);assert(ambiguous.correction.summary.includes(`${fields} synthetic ambiguity tests`));assert.match(findings(ambiguous),/cannot carry a value into another field or record/);
 assert(row('57n',`${cohort}-${2*n}-packet-fixture-validations`).correction.summary.includes('No fixture reaches acceptance, trigger, closure or publication'));
 assert(row('57n',`${cohort}-${6*n}-reviewer-receipt-templates`).correction.summary.includes('Templates are definitions, not executed tests'));
 assert(row('57n',`${cohort}-zero-candidate-review-trigger-or-publication-events`).correction.summary.includes(`${3*fields} adapter tests, ${2*n} packet executions and ${6*n} receipt templates`));
}
for(const[contract,[count]]of Object.entries(targets))assert.equal(adapter.tests.filter(r=>r.contract_id===`REOPEN-${contract.toUpperCase()}`).length,count);
const evidence=await read('src/data/phase-60-current-decisions.json');if(JSON.parse(evidence).as_of_date==='2026-09-15')assert.equal(hash(evidence),pins.current_evidence_hash);
console.log('57O/N attribution passed: 58 exact documents, two briefings, 543 prior reviews pinned; seven historical registries reconcile 423 workflow cases and 180 adapter tests / 18 packet executions / 54 templates without subset double-counting. No test rerun, actual review or production acceptance.');
