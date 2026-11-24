import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import pins from './content-205-216/reference-attribution-57m-inputs.json' with {type:'json'};
import ledger from '../src/data/phase-206-reference-attribution.json' with {type:'json'};
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex'),json=async p=>JSON.parse(await read(p));
assert.equal(hash(JSON.stringify(ledger.records.slice(0,603))),pins.previous_records_hash,'An earlier attribution review changed');
assert.equal(pins.prior_input_pins.length,29);assert.equal(pins.supporting_definition_pins.length,3);
for(const pin of [...pins.prior_input_pins,...pins.supporting_definition_pins])assert.equal(hash(await read(pin.path)),pin.sha256,`Pinned input changed: ${pin.path}`);
assert.equal(hash(await read(`src/content/research-collections/${pins.collection_slug}.json`)),pins.collection_sha256);
const documents=ledger.records.filter(r=>r.id.startsWith('research-doc-57m-'));
assert.equal(documents.length,29);assert.equal(documents.filter(r=>r.content_type==='FTFN method/test note').length,20);assert.equal(documents.filter(r=>r.content_type==='Research docket').length,9);
const bySuffix=suffix=>{const r=documents.find(r=>r.id===`research-doc-57m-${suffix}`);assert(r,suffix);return r;};
const targets={
 'amtrak-pids':[5,'return for clarification','Code-bearing official current asset register or closeout table'],
 'amtrak-reliability':[7,'reject','Named-asset-period reliability table'],
 'la-nextlink-adoption':[6,'privacy hold','Privacy-safe official completed-period adoption table'],
 'la-starlink-adoption':[6,'privacy hold','Privacy-safe official completed-period LEO adoption table'],
 'mt-bead-quarter':[7,'period hold','Completed public project-quarter table'],
 'hanford-mass-balance':[12,'return for clarification','Stable-identity transfer, receipt, and disposition evidence chain'],
 'nnsa-qualified-rate':[6,'authority hold','Official site-period recurring qualified-output table'],
 'nnsa-accepted-capacity':[6,'authority hold','Official site-period installed, qualified, and accepted capacity table'],
 'nnsa-gao-baseline':[5,'period hold','GAO recommendation-status record with responsive agency evidence'],
};
for(const r of documents){
 const d=await json(`src/content/${r.source_file}`);assert.equal(r.review_date,'2026-09-15');assert.equal(d.publication_date,'2026-08-08');assert.equal(d.captured_date,'2026-08-08');assert.equal(r.inherited_publisher_label,d.publisher);assert.match(r.correction.summary,/August 8/);
 const expected=[`Title: ${d.title}`,`Publisher: ${d.publisher}`,`Publication date: ${d.publication_date}`,`Official URL: ${d.official_url}`,`Capture status: ${d.capture_status}`,`Record status: ${d.record_status}`,`Captured by FTFN: ${d.captured_date}`,'',`Boundary: ${d.evidence_limits.join(' ')}`,'','Supporting public artifacts:',...d.supporting_official_urls.map(u=>'- '+u)].join('\n');
 assert.equal((await read('public'+d.local_capture_path)).replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').trimEnd(),expected);assert(d.evidence_limits.join(' ').includes('1 Closed / 21 Partially Closed / 2 Open'));
 if(r.content_type==='Research docket'){
  const[fields,route,target]=targets[r.id.replace('research-doc-57m-preserved-','')];assert.equal(d.record_status,'In Review');assert.equal(r.prior.document_type,'Technical Report');assert(r.prior.key_findings.includes('Next action: '+target));assert(r.correction.key_findings.includes(`Historical reopening request (August 8): ${target}.`));assert(r.correction.summary.includes(`${fields} required field mappings`));assert(r.correction.key_findings.includes(`Historical incomplete-fixture route: ${route}. This is not an actual reviewer finding or source outcome.`));assert(r.correction.summary.includes('does not exist'));
 }else{assert.equal(d.record_status,'Published');assert.equal(r.prior.document_type,'Data Release');}
 assert(r.correction.key_findings.some(s=>s.includes('not an additive count of executed tests')));
}
// These are stored definition registries, not a new invocation of a harness.
const mappings=await json('src/data/phase-57m-source-schema-adapters.json');
const packets=await json('src/data/phase-57m-candidate-evidence-packet-templates.json');
const decisions=await json('src/data/phase-57m-human-review-decision-tables.json');
assert.equal(mappings.adapters.length,60);assert.equal(mappings.accepted_label_count,120);
assert(mappings.adapters.every(a=>a.accepted_source_labels.length===2&&a.source_value===null&&a.adapter_is_evidence===false&&a.accepted_labels_are_observed_source_evidence===false&&a.carry_value_from_other_record===false&&a.value_transformations_allowed.length===0));
assert.equal(packets.templates.length,9);assert.equal(packets.total_fixture_count,18);assert.equal(packets.candidate_records_evaluated,0);
assert.equal(decisions.tables.length,9);assert.equal(decisions.decision_row_count,54);assert.equal(decisions.actual_candidate_packets_evaluated,0);assert.equal(decisions.actual_accept_decisions,0);
assert.deepEqual(decisions.decision_types,['accept','reject','return_for_clarification','privacy_hold','authority_hold','period_hold']);
for(const[contract,[fields,route,target]]of Object.entries(targets)){
 const id=`REOPEN-${contract.toUpperCase()}`,adapters=mappings.adapters.filter(a=>a.contract_id===id),packet=packets.templates.find(p=>p.contract_id===id),table=decisions.tables.find(t=>t.contract_id===id);
 assert.equal(adapters.length,fields);assert.equal(packet.required_field_count,fields);assert.equal(packet.candidate_record_type,target);assert.deepEqual(adapters.map(a=>a.field_name).sort(),[...packet.required_fields].sort());
 assert.equal(packet.incomplete_packet.expected_review_decision,route.replaceAll(' ','_'));assert.equal(packet.empty_packet.populated_field_count,0);assert(Object.values(packet.empty_packet.fields).every(v=>v===null));assert.equal(packet.incomplete_packet.populated_field_count,1);assert.equal(packet.cross_record_assembly_allowed,false);
 for(const fixture of [packet.empty_packet,packet.incomplete_packet]){assert.equal(fixture.fixture_only,true);assert.equal(fixture.eligible_record,false);assert.equal(fixture.fires_trigger,false);assert.equal(fixture.automated_publication_allowed,false);assert.equal(fixture.source_metadata.official_url,null);}
 assert.equal(table.rows.length,6);assert(table.rows.every(r=>r.rehearsal_only&&r.actual_candidate_evaluated===false&&r.fires_trigger===false&&r.closes_hold_automatically===false&&r.automated_publication_allowed===false));assert.equal(table.rows.find(r=>r.decision_type==='accept').resulting_state,'ready_for_separate_publication_review');
}
for(const[cohort,label,n,fields]of [['amtrak','Amtrak',2,12],['broadband','Broadband',3,19],['hanford','Hanford',1,12],['nnsa','NNSA',3,17]]){
 assert.equal(documents.filter(r=>r.id.startsWith(`research-doc-57m-${cohort}-`)).length,5);assert.equal(mappings.adapters.filter(a=>a.evidence_rail===label).length,fields);assert.equal(packets.templates.filter(p=>p.evidence_rail===label).length,n);
 const adapter=bySuffix(`${cohort}-${fields}-non-coercive-field-adapters`);assert(adapter.correction.summary.includes(`${fields} field mappings across ${n} contracts`));assert.match(adapter.correction.key_findings.join(' '),/carrying values across records are disallowed/);
 const vocabulary=bySuffix(`${cohort}-${2*fields}-accepted-input-labels`);assert(vocabulary.correction.summary.includes(`${2*fields} vocabulary labels across ${fields} fields`));assert.match(vocabulary.correction.key_findings.join(' '),/outer-whitespace trimming only/);assert(vocabulary.correction.summary.includes('not observed agency source labels, executed conformance tests or evidence acceptance'));
 const fixtures=bySuffix(`${cohort}-${n}-empty-${n}-incomplete-packet-fixtures`);assert(fixtures.correction.summary.includes(`${n} empty and ${n} deliberately incomplete`));assert.match(fixtures.correction.key_findings.join(' '),/Empty fields remain null/);
 const rows=bySuffix(`${cohort}-${6*n}-human-review-decision-rows`);assert(rows.correction.summary.includes(`${6*n} rehearsal rows in ${n} six-outcome decision tables`));assert.match(rows.correction.key_findings.join(' '),/accept path leads only to separate human publication review/);
 assert(bySuffix(`${cohort}-zero-evidence-packets-accepted-or-triggers-fired`).correction.summary.includes('not extra tests'));
}
const briefing=ledger.records.find(r=>r.id===`briefing-${pins.briefing_slug}`);assert(briefing.correction.summary.includes('August 8'));assert(briefing.correction.summary.includes('60 field mappings, 120 vocabulary labels, 18 non-evidence fixtures and 54 decision-table rows'));assert(briefing.correction.summary.includes('not an executed-test total'));assert.equal(briefing.correction.claim_scope,'Internal FTFN record');
const rawBriefing=await read(`src/content/${pins.briefing.source_file}`);assert(rawBriefing.includes('## What Phase 57M adds'));assert(rawBriefing.includes('captured_date: 2026-08-08'));
const evidence=await read('src/data/phase-60-current-decisions.json');if(JSON.parse(evidence).as_of_date==='2026-09-15')assert.equal(hash(evidence),pins.current_evidence_hash);
console.log('57M attribution passed: 29 documents and one briefing; 603 earlier reviews unchanged; August 8 dates, 60 field mappings / 120 labels / 18 fixture definitions / 54 rehearsal rows, nine contract-specific fixture routes and reopening requests preserved. No workflow execution, source refresh or actual approval.');
