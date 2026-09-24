import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

// Read-only preparation checks. No external source retrieval or human review.
const directory=dirname(fileURLToPath(import.meta.url));
const root=resolve(directory,'../../../..');
const read=path=>readFile(join(root,path));
const json=async path=>JSON.parse(await read(path));
const hash=value=>createHash('sha256').update(Buffer.isBuffer(value)||typeof value==='string'?value:JSON.stringify(value)).digest('hex');
const packet=JSON.parse(await readFile(join(directory,'manifest.json'),'utf8'));
const annual=await import(pathToFileURL(join(root,'app/src/lib/annual-case-reviews.mjs')));
const {readerCatalog}=await import(pathToFileURL(join(root,'app/src/lib/reader-catalog.mjs')));
const {computeV1refCandidateDigest,isValidV1refValidationReceipt}=await import(pathToFileURL(join(root,'app/scripts/lib/v1ref-candidate-digest.mjs')));
const originals=(await json('app/src/data/phase-204-reader-completion.json')).records;
const digest=await computeV1refCandidateDigest({appRoot:join(root,'app')});
const aggregate=await json('app/src/data/v1-public-reference-edition.json');
const ids=['203-CASE-11','203-CASE-13','203-SYNTHESIS-08','200-MONOGRAPH-08','203-SYNTHESIS-10','200-MONOGRAPH-10'];
const annualIds=['203-CASE-11','203-CASE-13','203-SYNTHESIS-08','203-SYNTHESIS-10'];
const current=new Map();
for(const id of ids){
  const original=originals.find(r=>r.record_id===id);
  const route=readerCatalog.find(r=>r.id===id).route;
  const projected=annual.applyAnnualCaseReview(original,{route});
  const reading={record_id:id,title:projected.title,overview:projected.overview,sections:projected.sections,source_ids:original.source_ids,related_paths:original.related_paths??[]};
  current.set(id,{original,route,reading,review:projected.review,contexts:annual.annualReviewContexts(projected.review)});
}
function validate(p){
  assert.equal(p.candidate_binding.candidate_digest,digest.digest,'Current candidate');
  assert.equal(p.candidate_binding.validation_receipt,aggregate.local_validation_receipt.receipt_id);
  assert.deepEqual(p.counts,{annual_records:4,paired_essay_presentations:2,reading_snapshots:6,claim_prompts:21,independent_approvals:0,external_contacts:0});
  assert.deepEqual(p.reading_snapshots.map(r=>r.id),ids,'Six exact reading snapshots');
  assert.deepEqual(p.assignments.map(r=>r.annual_id),annualIds,'Four annual assignments, not six');
  assert.deepEqual(p.assignments.map(r=>r.claims.length),[5,6,5,5],'Claim coverage');
  assert.equal(p.source_profiles.length,17);
  assert.equal(new Set(p.source_profiles.map(s=>s.id)).size,17);
  const profileIds=new Set(p.source_profiles.map(s=>s.id));
  const checkIds=new Set(p.reading_snapshots.flatMap(r=>r.review_snapshot.source_checks.map(s=>s.source_id)));
  const contextIds=new Set(p.reading_snapshots.flatMap(r=>r.retained_contexts.map(s=>s.id)));
  assert.equal(checkIds.size,6,'Six distinct sources; the two paired-reading AEMO checks reuse existing source identities');
  assert.equal(contextIds.size,1,'One retained SLF context');
  assert.equal(p.supplemental_source_checks.length,1);
  const moss=p.supplemental_source_checks[0];
  assert.equal(moss.source_id,'source-56k-moss-landing-go167-corrective-action-2025');
  assert.equal(moss.source_profile_sha256,p.source_profiles.find(s=>s.id===moss.source_id).sha256);
  assert.equal(moss.primary_checked_date,'2026-09-23');
  assert.equal(moss.captured_sha256,'483da0ba546321f01b8ed87630027fca0a7953ce971e305793c9384fb4542c6d');
  assert.deepEqual(moss.visually_checked_pages,Array.from({length:12},(_,i)=>i+1));
  assert.equal(moss.observation_ledger,'docs/release-reviews/2026-09-22/annual-moss-landing-status-observations.json');
  assert(moss.boundary.includes('not a source check embedded in the Nevada application notices'));
  checkIds.add(moss.source_id);
  assert.equal(p.retained_pdf_captures.length,4);
  assert.equal(p.supporting_reports.length,7);
  for(const pin of p.retained_pdf_captures){
    const checks=[...p.reading_snapshots.flatMap(r=>r.review_snapshot.source_checks),...p.supplemental_source_checks].filter(s=>s.source_id===pin.source_id);
    assert(checks.length>0,'PDF pin must attach to an actual source check');
    for(const check of checks){
      assert.equal(pin.sha256,check.captured_sha256,'Source-check/PDF identity');
      assert.deepEqual(pin.notice_visually_checked_pages,check.visually_checked_pages,'No expanded visual-review scope');
    }
  }
  for(const r of p.reading_snapshots){
    const actual=current.get(r.id);
    assert.equal(r.route,actual.route);
    assert.deepEqual(r.original_snapshot,actual.original,'Exact original snapshot');
    assert.deepEqual(r.current_reading,actual.reading,'Exact current snapshot');
    assert.deepEqual(r.review_snapshot,actual.review,'Complete current/preceding review');
    assert.deepEqual(r.retained_contexts,actual.contexts,'Exact retained contexts');
    assert.equal(r.original_sha256,hash(actual.original));
    assert.equal(r.current_sha256,hash(actual.reading));
    assert.equal(r.review_sha256,hash(actual.review));
    assert.deepEqual(r.source_profiles.map(s=>s.id),actual.original.source_ids);
    assert(r.source_profiles.every(s=>profileIds.has(s.id)));
    assert.equal(r.review_snapshot.independent_article_review,false);
    assert.equal(r.review_snapshot.approval_receipt_id,null);
  }
  assert.deepEqual(p.paired_readings.map(r=>[r.annual_id,r.essay_id]),[['203-SYNTHESIS-08','200-MONOGRAPH-08'],['203-SYNTHESIS-10','200-MONOGRAPH-10']]);
  for(const pair of p.paired_readings){
    assert.equal(pair.independent_acceptance,null);
    const a=p.reading_snapshots.find(r=>r.id===pair.annual_id),b=p.reading_snapshots.find(r=>r.id===pair.essay_id);
    assert.deepEqual(a.current_reading.sections,b.current_reading.sections,'Paired full sections');
    assert.equal(a.current_reading.overview,b.current_reading.overview,'Paired overview');
    assert.equal(pair.same_sections,true);assert.equal(pair.same_overview,true);
  }
  let precedingReviews=0;
  for(const id of ['203-SYNTHESIS-08','200-MONOGRAPH-08','203-SYNTHESIS-10','200-MONOGRAPH-10']){
    const r=p.reading_snapshots.find(r=>r.id===id);
    assert(r.review_snapshot.previous_review,'Earlier review is required');
    const versions=annual.annualReviewVersions(r.review_snapshot);
    assert.equal(versions.length,id.endsWith('-10')?3:2);
    precedingReviews+=versions.length-1;
    for(const prior of versions.slice(0,-1))for(const change of prior.replacements){
      const latest=r.review_snapshot.replacements.find(c=>c.section_heading===change.section_heading&&c.paragraph_index===change.paragraph_index);
      assert(latest,'Prior correction anchor remains represented');
      assert.equal(latest.original_text,change.original_text,'Original correction target retained');
      assert.equal(r.current_reading.sections.find(s=>s.heading===change.section_heading).paragraphs[change.paragraph_index],latest.replacement_text,'Latest wording supersedes the exact retained historical version');
    }
  }
  assert.equal(precedingReviews,6);
  for(const assignment of p.assignments){
    assert.equal(assignment.paired_essay_id,p.paired_readings.find(r=>r.annual_id===assignment.annual_id)?.essay_id??null);
    assert.deepEqual(assignment.reviewer,{name:null,expertise:null,conflicts:null,review_date:null,contact_authorized:false});
    assert.equal(assignment.disposition,null);assert.equal(assignment.disposition_rationale,null);
    assert.equal(new Set(assignment.claims.map(c=>c.id)).size,assignment.claims.length);
    const reading=current.get(assignment.annual_id).reading;
    for(const c of assignment.claims){
      assert.equal(c.article_id,assignment.annual_id);
      const section=reading.sections[c.section_index];assert(section);
      assert.equal(c.section_heading,section.heading);
      assert.equal(c.exact_text,section.paragraphs[c.paragraph_index],'Located complete paragraph');
      assert(c.source_ids.length>0&&c.source_ids.every(id=>reading.source_ids.includes(id)),'Claim source membership');
      assert(c.locator_refs.every(id=>checkIds.has(id)||contextIds.has(id)),'Located support reference');
      assert(c.review_question.length>30&&c.review_boundary.length>30);
      for(const key of ['finding','exact_artifact_verified','evidence_kind','rationale','proposed_wording','editor_response','revised_version_acceptance'])assert.equal(c[key],null,'Unperformed human return');
    }
  }
}
validate(packet);
const mutations=[
  p=>p.candidate_binding.candidate_digest='0'.repeat(64),
  p=>p.counts.annual_records=6,
  p=>p.reading_snapshots.pop(),
  p=>p.reading_snapshots[0].current_reading.sections[0].paragraphs[0]+=' changed',
  p=>p.reading_snapshots[0].original_sha256='0'.repeat(64),
  p=>delete p.reading_snapshots[2].review_snapshot.previous_review,
  p=>p.reading_snapshots[2].retained_contexts=[],
  p=>p.assignments[0].claims[0].exact_text='Invented observation',
  p=>p.assignments[0].claims[0].source_ids=['wrong-source'],
  p=>p.assignments[0].reviewer.name='Invented reviewer',
  p=>p.assignments[0].claims[0].finding='supported as written',
  p=>p.paired_readings[0].independent_acceptance=true,
  p=>delete p.reading_snapshots[4].review_snapshot.previous_review,
  p=>p.retained_pdf_captures[2].notice_visually_checked_pages.push(21),
  p=>p.retained_pdf_captures[2].sha256='0'.repeat(64),
  p=>p.reading_snapshots[5].review_snapshot.source_checks[0].primary_checked_date='2026-09-22',
  p=>p.supplemental_source_checks[0].primary_checked_date='2026-09-22',
  p=>p.supplemental_source_checks[0].visually_checked_pages.pop(),
  p=>delete p.reading_snapshots[4].review_snapshot.previous_review.previous_review,
  p=>p.reading_snapshots[5].review_snapshot.previous_review.previous_review.summary='lost history',
  p=>p.reading_snapshots[4].review_snapshot.source_checks[1].source_id='wrong-source',
  p=>p.reading_snapshots[5].review_snapshot.source_checks[2].primary_checked_date='2026-09-22',
];
for(const mutate of mutations){const fixture=structuredClone(packet);mutate(fixture);assert.throws(()=>validate(fixture));}
for(const profile of packet.source_profiles){
  const bytes=await read(profile.path),actual=JSON.parse(bytes);
  assert.equal(profile.sha256,hash(bytes),'Exact profile bytes');
  for(const key of ['name','url','source_type','last_checked_date'])assert.equal(profile[key],actual[key]);
  for(const r of packet.reading_snapshots)for(const pin of r.source_profiles.filter(s=>s.id===profile.id))assert.deepEqual(pin,profile);
}
for(const pin of [...packet.retained_pdf_captures,...packet.supporting_reports]){
  const bytes=await read(pin.path);assert.equal(bytes.length,pin.bytes);assert.equal(hash(bytes),pin.sha256,'Retained evidence bytes');
}
assert.equal(packet.retained_pdf_captures.length,4);assert.equal(packet.supporting_reports.length,7);
const mossLedger=await json(packet.supplemental_source_checks[0].observation_ledger);
assert.equal(mossLedger.capture_sha256,packet.supplemental_source_checks[0].captured_sha256);
assert.deepEqual(mossLedger.rows.map(r=>r.finding),Array.from({length:28},(_,i)=>i+1));
assert.deepEqual(mossLedger.counts,{C:13,P:15,total:28});
assert.equal(mossLedger.rows.filter(r=>r.label==='C').length,13);
assert.equal(mossLedger.rows.filter(r=>r.label==='P').length,15);
assert.equal(mossLedger.independent_acceptance,null);
for(const r of packet.reading_snapshots)assert.equal(hash(await read('app/dist'+r.route+'index.html')),r.rendered_sha256,'Validated rendered HTML');
for(const a of packet.assignments){
  const md=await readFile(join(directory,a.annual_id+'.md'),'utf8');
  const r=current.get(a.annual_id);
  for(const text of [packet.candidate_binding.candidate_digest,packet.candidate_binding.source_commit,packet.candidate_binding.validation_receipt,r.reading.title,r.reading.overview,...r.reading.sections.flatMap(s=>s.paragraphs),...a.claims.map(c=>c.exact_text)])assert(md.includes(text),'Worksheet current content');
  for(const snapshot of packet.reading_snapshots.filter(s=>[a.annual_id,a.paired_essay_id].includes(s.id)))
    for(const key of ['original_sha256','current_sha256','review_sha256','rendered_sha256'])assert(md.includes(snapshot[key]),'Worksheet exact version hash');
  for(const c of a.claims)assert.equal(md.split('### '+c.id+' — ').length-1,1);
  assert(md.includes('Actual reviewer return — leave blank until performed'));
  for(const match of md.matchAll(/\]\(<(C:\/[^>]+)>\)/g))await readFile(match[1]);
}
const run=await json(packet.candidate_binding.validation_results);
assert.deepEqual(run.results.map(r=>[r.script,r.exit_code]),[['current:generate',0],['current:validate',0]]);
assert.equal(run.results[1].finished_at,packet.candidate_binding.validation_finished_at);
assert(isValidV1refValidationReceipt({receipt:aggregate.local_validation_receipt,aggregate,candidateDigest:digest}));
const recovery=await json(packet.candidate_binding.recovery_report);
assert.equal(recovery.commit,packet.candidate_binding.source_commit);
assert.equal(recovery.candidate_digest,digest.digest);assert.equal(recovery.validation_receipt,packet.candidate_binding.validation_receipt);
const recoveredDigest=await computeV1refCandidateDigest({appRoot:join(recovery.recovered_directory,'app')});
assert.equal(recoveredDigest.digest,digest.digest,'Recovered application candidate');
console.log(`Annual packet verified: four annual records, two paired essays, 21 exact paragraph prompts, 17 source profiles, four retained PDF byte pins, six distinct application source identities plus one separate supplementary check, six preserved preceding reviews and terminal/recovered candidate bindings; ${mutations.length} negative fixtures rejected. Zero independent returns, contacts or approvals.`);
