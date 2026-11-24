import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {canonicalAnnualBindings as data,canonicalAnnualHash,validateCanonicalAnnualBindings,canonicalAnnualForProject,canonicalAnnualForArticle,canonicalAnnualContext,canonicalAnnualGateContexts,canonicalAnnualRelatedReadings} from '../src/lib/canonical-annual-reader-bindings.mjs';
import initial from '../src/data/canonical-annual-reader-bindings-initial-2026-11-22.json' with {type:'json'};
import {annualAiReviewFor,annualAiPresentation,annualAssessedReading} from '../src/lib/annual-ai-reviews.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {currentPortfolioSummary} from '../src/lib/current-named-dossiers.mjs';
import {currentEvidenceLedger,namedFileEvidenceDecisions,evidenceReceiptsForRoute} from '../src/lib/current-evidence.mjs';
import atlas from '../src/data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import readers from '../src/data/phase-204-reader-completion.json' with {type:'json'};
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const negative=[
 d=>d.records.pop(),d=>d.records.push(structuredClone(d.records[0])),d=>d.integration_date='2026-09-27',
 d=>d.new_identity_count=2,d=>d.historical_inputs_retained=[],d=>d.policy_id='unreviewed',
 ...['human_review_claimed','fresh_external_source_check','operating_outcomes_admitted','publication_authorized','launch_authorized','phase_216_complete'].map(k=>d=>{d[k]=true;}),
 ...[0,1,2,3,4].flatMap(i=>[
  ...['article_sha256','atlas_record_sha256','portfolio_decision_sha256','article_review_sha256','correction_review_sha256','presentation_sha256'].map(k=>d=>{d.records[i][k]='0'.repeat(64);}),
  d=>d.records[i].target_route='/atlas/projects/unrelated/',d=>d.records[i].article_route=d.records[i].target_route,
  d=>d.records[i].atlas_record_id='119-PROJECT-001',d=>d.records[i].article_record_id='203-CASE-01',
  d=>d.records[i].eligible_count=2,d=>d.records[i].scope='All regional assets',
  d=>d.records[i].context_cycle_id='60-CYCLE-DARPA-RESULTS',d=>d.records[i].context_role='Project approval',
  d=>d.records[i].named_file_id='61-PROJECT-UNRELATED',d=>d.records[i].original_review_date='2026-11-22',
  d=>d.records[i].correction_review_date='2026-11-22',d=>d.records[i].section_count=2,
  d=>d.records[i].paragraph_count=2,d=>d.records[i].identity_boundary='All assets counted',
  d=>d.records[i].current_status_boundary='Fresh inspection complete',d=>d.records[i].decision='Launch approved'
 ]),
 d=>d.revision=1,d=>d.prior_revision.records=5,
 ...[2,3,4].flatMap(i=>[
  d=>d.records[i].prior_review_absent=false,d=>d.records[i].correction_review_date='2026-09-22',
  d=>d.records[i].evidence_gates.pop(),d=>d.records[i].evidence_gates.push(structuredClone(d.records[i].evidence_gates[0])),
  ...['cycle_id','retained_receipt_id','retained_receipt_sha256','inspected_date','recorded_next_check','label'].map(k=>d=>{d.records[i].evidence_gates[0][k]='altered';}),
  d=>d.records[i].related_readings.push({route:'/atlas/projects/unrelated/',label:'Same program'})
 ])
];
for(const mutate of negative){const changed=structuredClone(data);mutate(changed);assert.notDeepEqual(changed,data);assert.throws(()=>validateCanonicalAnnualBindings(changed));}
for(const pin of data.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(pin.path)).digest('hex'),pin.sha256,pin.path);
for(const binding of data.records){
 const project=atlas.projects.find(p=>p.atlas_project_id===binding.atlas_record_id),article=readers.records.find(r=>r.record_id===binding.article_record_id);
 assert.equal(canonicalAnnualForProject(project).article,article);
 assert.equal(canonicalAnnualForArticle(article,{route:binding.target_route}),binding);
 assert.equal(annualAiReviewFor(article,{route:binding.target_route}),null,'Original review route must remain exact');
 const view=annualAiPresentation(article,{route:binding.article_route});
 assert.equal(canonicalAnnualHash(annualAssessedReading(article,view)),binding.presentation_sha256);
 for(const route of [binding.article_route,'/','/atlas/projects/unrelated/'])assert.equal(canonicalAnnualForArticle(article,{route}),null);
 const changed=structuredClone(article);changed.sections[0].paragraphs[0]+=' Altered.';assert.throws(()=>canonicalAnnualForArticle(changed,{route:binding.target_route}));
 const changedProject=structuredClone(project);changedProject.title+=' Altered.';assert.throws(()=>canonicalAnnualForProject(changedProject));
 assert.throws(()=>canonicalAnnualContext(structuredClone(binding)),'Context must use validated binding');
 const rows=readerCatalog.filter(r=>r.id===binding.atlas_record_id);assert.equal(rows.length,1);assert.equal(rows[0].route,binding.target_route);assert.equal(rows[0].kind,binding.eligible_count?'Project':'Context');
 const originalRows=readerCatalog.filter(r=>r.id===article.record_id);assert.equal(originalRows.length,1);assert.equal(originalRows[0].route,binding.article_route);assert.equal(originalRows[0].date,binding.original_review_date);
 const context=canonicalAnnualContext(binding),reversed={...currentEvidenceLedger,receipts:[...currentEvidenceLedger.receipts].reverse()};
 if(binding.context_cycle_id){
  assert(context);assert.equal(context.source_checked_date,'2026-11-21');
  assert.equal(canonicalAnnualContext(binding,{ledger:reversed}).receipt_id,context.receipt_id);
  const future={...context,receipt_id:'FUTURE',decision_date:'2027-01-01',source_checked_date:'2027-01-01'};
  assert.equal(canonicalAnnualContext(binding,{ledger:{...currentEvidenceLedger,receipts:[...currentEvidenceLedger.receipts,future]}}).receipt_id,context.receipt_id);
  assert.deepEqual(canonicalAnnualGateContexts(binding),[]);
 }else{
  assert.equal(context,null);assert.equal(view.review,null);assert.equal(binding.prior_review_absent,true);assert.equal(binding.correction_review_date,null);
  assert.deepEqual(project.relationships.phase_61_file_ids,[]);
  const gates=canonicalAnnualGateContexts(binding);assert.equal(gates.length,binding.evidence_gates.length);
  assert.equal(new Set(gates.map(g=>g.cycle_id)).size,gates.length);assert.equal(new Set(gates.map(g=>g.receipt.receipt_id)).size,gates.length);
  assert.deepEqual(canonicalAnnualGateContexts(binding,{ledger:reversed}),gates);
  assert.throws(()=>canonicalAnnualGateContexts(structuredClone(binding)));
  const retainedFixture={...currentEvidenceLedger,receipts:currentEvidenceLedger.receipts.filter(r=>binding.evidence_gates.some(g=>g.retained_receipt_id===r.receipt_id))};
  assert.deepEqual(canonicalAnnualGateContexts(binding,{ledger:retainedFixture}).map(g=>[g.receipt.receipt_id,g.receipt.source_checked_date,g.receipt.next_check_date]),binding.evidence_gates.map(g=>[g.retained_receipt_id,g.inspected_date,g.recorded_next_check]));
  for(const gate of gates){
   assert(gate.receipt.source_checked_date>=gate.inspected_date);assert.equal(gate.receipt.cycle_item_id,gate.cycle_id);assert.deepEqual(gate.receipt.named_file_ids,[]);
   const invalid=[{...gate.receipt,receipt_id:'FUTURE',decision_date:'2027-01-01',source_checked_date:'2027-01-01'},{...gate.receipt,receipt_id:'WRONG_ROUTE',affected_routes:[]},{...gate.receipt,receipt_id:'WRONG_ID',affected_record_ids:[]},{...gate.receipt,receipt_id:'WRONG_FILE',named_file_ids:['61-PROJECT-UNRELATED']}];
   assert.deepEqual(canonicalAnnualGateContexts(binding,{ledger:{...currentEvidenceLedger,receipts:[...currentEvidenceLedger.receipts,...invalid]}}),gates);
   const changedLedger=structuredClone(currentEvidenceLedger);changedLedger.receipts.find(r=>r.receipt_id===gate.retained_receipt_id).next_check_date='2027-01-01';assert.throws(()=>validateCanonicalAnnualBindings(data,{ledger:changedLedger}));
  }
 }
}
assert.deepEqual(data.records.slice(0,2),initial.records);
assert.equal(data.historical_inputs_retained.length,9);
assert.deepEqual(data.records.slice(2).map(r=>r.eligible_count),[1,0,1]);
assert.deepEqual(data.records.slice(2).map(r=>canonicalAnnualGateContexts(r).length),[2,1,3]);
assert.equal(data.records.slice(2).reduce((n,r)=>n+annualAiPresentation(readers.records.find(a=>a.record_id===r.article_record_id),{route:r.article_route}).aiChanges.length,0),7);
assert.deepEqual(canonicalAnnualRelatedReadings(data.records[3]),[{route:'/atlas/projects/montana-bead/',label:'The 32 separately identified proposal-stage dossiers'}]);
const [nova,space]=data.records;
assert.equal(canonicalAnnualContext(nova).receipt_id,'receipt-60-loudoun-2026-11-21-watch-note');
assert.equal(canonicalAnnualContext(nova).next_check_date,'2026-12-02');
assert.deepEqual(namedFileEvidenceDecisions(nova.named_file_id),[],'Policy cannot become a project appointment');
assert.equal(canonicalAnnualContext(space).receipt_id,'receipt-60-slf-2026-11-21-bounded-blocker');
assert.equal(namedFileEvidenceDecisions(space.named_file_id).at(-1).next_check_date,'2026-12-21');
assert.equal(evidenceReceiptsForRoute(space.target_route).filter(r=>r.receipt_id===canonicalAnnualContext(space).receipt_id).length,1);
for(const project of atlas.projects.filter(p=>!data.records.some(r=>r.atlas_record_id===p.atlas_project_id)))assert.equal(canonicalAnnualForProject(project),null);
assert.deepEqual([currentPortfolioSummary.eligible_projects,currentPortfolioSummary.eligible_places],[100,70]);
assert.equal(new Set(readerCatalog.map(r=>r.id)).size,readerCatalog.length);
const template=await read('src/pages/atlas/projects/[slug].astro'),component=await read('src/components/review/ReferenceArticle.astro');
for(const token of ['canonicalAnnualForProject(project)','refreshedArticle||annualReader','<ReferenceArticle article={annualReader.article!} embedded','namedFileEvidenceDecisions(id)','Historical Atlas appointment'])assert(template.includes(token),token);
assert(template.indexOf('<ReferenceArticle')<template.indexOf('<LegacyContainer'));
assert(!template.includes(".find(r=>'current_named_file_account' in r)"));
for(const token of ['canonicalAnnualForArticle(article,{route:Astro.url.pathname})','binding?.article_route??Astro.url.pathname','if(embedded&&!binding)','data-canonical-annual-binding','binding.current_status_boundary','binding.identity_boundary','data-related-policy-context','data-canonical-annual-return','!visibleReceiptIds.has(r.id)','data-annual-reader-section','!embedded&&'])assert(component.includes(token),token);
assert((await read('src/pages/data/build-decisions.json.ts')).includes('canonical_annual_reader_bindings:canonicalAnnualBindings'));
assert((await read('src/pages/review/casebooks/[slug].astro')).includes('data-canonical-annual-casebook'));
assert((await read('src/pages/review/casebooks/expanded/[slug].astro')).includes('data-canonical-annual-casebook'));
for(const token of ['data-annual-assessment-only','data-annual-clarification-date','data-annual-program-gate','data-annual-program-receipt','data-annual-related-dossiers','canonicalAnnualGateContexts(binding)'])assert(component.includes(token),token);
const montanaIndex=await read('src/pages/atlas/projects/montana-bead/index.astro');assert(montanaIndex.includes('data-montana-current-portfolio'));assert(montanaIndex.includes('currentPortfolioSummary.eligible_projects'));assert(!montanaIndex.includes('targets remain unfinished'));
assert((await read('src/pages/method/portfolio-decisions.astro')).includes('data-canonical-annual-summary'));
assert((await read('src/pages/sitemap.xml.ts')).includes('[r.target_route,r.article_route,r.prior_casebook_route]'));
const candidate=JSON.parse(await read('src/data/v1-public-reference-edition.json'));
for(const path of ['src/data/canonical-annual-reader-bindings.json','src/data/canonical-annual-reader-bindings-initial-2026-11-22.json','src/lib/canonical-annual-reader-bindings.mjs','scripts/assert-canonical-annual-reader-bindings.mjs','scripts/verify-canonical-annual-reader-bindings.mjs','src/content/updates/2026-11-22-canonical-annual-readers.json','src/content/updates/2026-11-22-canonical-program-readers.json'])assert(candidate.candidate_digest.artifact_paths.includes(path),path);
console.log('Canonical annual source checks passed: 5 exact-route readings, 15 full sections/paragraphs, 9 historical files unchanged; '+negative.length+' malformed bindings plus runtime/receipt mutations rejected. Initial two mappings preserved; 3 absent earlier reviews stay absent, 7 assessed wording changes and 6 independent program follow-ups retained; Montana parent adds zero to 32 unchanged children. 100/70 unchanged. Production remains unverified.');
