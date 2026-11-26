import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {translatedReaders,validateTranslatedReader,translationsForEnglish,translationHistoricalContractRoute,translationContractNavigation} from '../src/lib/translated-readers.mjs';
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
import {readerSourceReviewContexts} from '../src/lib/reader-presentation.mjs';
import {currentEvidenceLedger} from '../src/lib/current-evidence.mjs';
import {prepareReviewedReadings} from './lib/integrate-reviewed-readings.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),read=p=>readFile(join(root,p),'utf8'),json=async p=>JSON.parse(await read(p));
const hash=value=>createHash('sha256').update(value).digest('hex');
const readers=await json('app/src/data/phase-204-reader-completion.json'),contracts=(await json('app/src/data/phase-202-accessible-multilingual-low-bandwidth-editions.json')).edition_contracts,ops=await json('app/src/data/phase-207-current-operations.json');
assert.deepEqual(translatedReaders.map(r=>[r.record_id,r.locale]),[3,4,7,8,11,12,15,16,19,20,23,24,27,28,31,32,35,36,39,40,43,44,47,48,51,52,55,56,59,60,63,64,67,68].map(n=>[`202-EDITION-${String(n).padStart(3,'0')}`,n%2?'fr-CA':'es-419']));
assert.equal(contracts.filter(c=>c.is_translation).length-translatedReaders.length,0);
assert.equal(hash(await read('app/src/data/ai-reviewed-translations.json')),'73f2ee14df297b244f37ff38b6dd2df03b5681f41d85bf3cb3cf63078d4fa191','Navigation correction must preserve the entire translation inventory');
assert.equal(translationContractNavigation.length,16);
assert.throws(()=>translationHistoricalContractRoute({record_id:'unknown'}),/Missing translation contract route/);
const canonicalRoutes=(await json('app/src/data/v1-public-reference-edition.json')).canonical_html_routes;
for(const r of translatedReaders)assert(canonicalRoutes.includes(translationHistoricalContractRoute(r)));
assert.equal(hash(JSON.stringify(translatedReaders.slice(0,18))),'84c81de372e145386d133d78103d4e91b579e0011df0dece32e613bc4cc51543','All eighteen previously integrated records remain exact');
assert.deepEqual(translatedReaders.slice(18),await prepareReviewedReadings(root),'The November cohort must reproduce its reviewed manuscripts, pinned inputs and explicit project context');
assert.equal(new Set(readerCatalog.map(r=>r.id)).size,readerCatalog.length);
for(const query of ['French','fr-CA','Français canadien','Spanish','es-419','Español de América Latina'])assert.equal(searchReaders(readerCatalog,query,'Translation').length,17,`Language search: ${query}`);
for(const r of translatedReaders){
 const english=readers.records.find(e=>e.record_id===r.source_record_id),contract=contracts.find(c=>c.edition_contract_id===r.record_id);
 const reviewText=await read(r.review_artifact.path),review=JSON.parse(reviewText);
 assert.equal(hash(reviewText),r.review_artifact.sha256);
 const accepted=review.texts.find(t=>t.proposed_contract_id===r.record_id);
 assert.equal(accepted.locale,r.locale);assert.equal(accepted.path,r.text_artifact.path);assert.equal(accepted.file_sha256,r.text_artifact.sha256);
 assert.equal(r.ai_review_date,review.decision_date);assert.equal(r.reviewer,review.reviewer);
 assert.equal(readerCatalog.find(c=>c.id===r.record_id).date,r.integration_date);
 if(['202-EDITION-021','202-EDITION-025','202-EDITION-029'].includes(r.source_record_id)){assert.equal(r.integration_date,'2026-10-28');assert.equal(r.ai_review_date,'2026-09-29');assert.equal(r.evidence_cutoff,'2026-09-01');assert(r.sources.every(s=>s.language==='en'));}
 if(r.source_record_id==='202-EDITION-033'){assert.equal(r.integration_date,'2026-10-28');assert.equal(r.ai_review_date,'2026-10-28');assert.equal(r.evidence_cutoff,'2026-09-01');assert(r.sources.every(s=>s.language==='en'));}
 assert.equal(review.source_record_sha256,r.source_record_sha256);
 const novemberSource=['202-EDITION-037','202-EDITION-041','202-EDITION-045','202-EDITION-049','202-EDITION-053','202-EDITION-057','202-EDITION-061','202-EDITION-065'].includes(r.source_record_id);
 if(novemberSource){assert.equal(r.review_artifact.historical_contract_digest_kind,'canonical-content');assert.equal(accepted.historical_contract_sha256,r.historical_contract.canonical_content_digest);assert.deepEqual(review.historical_contract_source_ids,contract.source_ids);assert.equal(r.preparation_notice_is_historical,true);assert.equal(r.integration_date,'2026-11-21');assert.equal(r.ai_review_date,'2026-11-21');}
 else {assert.equal(r.review_artifact.historical_contract_digest_kind,undefined);if(accepted.historical_contract_sha256)assert.equal(accepted.historical_contract_sha256,r.historical_contract.record_sha256);}
 const text=await read(r.text_artifact.path);assert.equal(hash(text),r.text_artifact.sha256);
 const chunks=text.trim().split(/\r?\n## /),intro=chunks.shift().split(/\r?\n\r?\n/);chunks.pop();
 assert.equal(r.title,intro[0].replace(/^# /,''));assert.equal(r.review_notice,intro[1].replaceAll('**','').replaceAll('`',''));assert.equal(r.overview,intro.slice(2).join('\n\n'));
 assert.deepEqual(r.sections,chunks.map(s=>{const [heading,...paragraphs]=s.split(/\r?\n\r?\n/);return {heading,paragraphs};}));
 assert.equal(r.sections.length,6);assert(r.sections.every(s=>s.paragraphs.length&&s.paragraphs.every(p=>p.length>150)));
 for(const source of r.sources){const raw=await read(`app/src/content/sources/${source.id}.json`);assert.equal(hash(raw),source.source_file_sha256);assert.equal(JSON.parse(raw).url,source.url);assert(text.includes(source.id)&&text.includes(source.url)&&text.includes(source.label));}
 assert.deepEqual(r.sources.map(s=>s.id),english.source_ids);
 assert.notEqual(r.source_record_sha256,r.historical_contract.canonical_content_digest);
 assert.deepEqual(r.historical_contract.source_ids,contract.source_ids);assert.equal(contract.translated_content,null);assert.equal(contract.approval_receipt_id,null);
 assert(!r.route.includes('human-reviewed'));assert.equal(readerCatalog.find(c=>c.id===r.record_id).route,r.route);
 assert.equal(translationsForEnglish(r.source_record_id).length,2);assert.equal(translationsForEnglish('202-EDITION-002').length,2);
 const contexts=readerSourceReviewContexts(r,currentEvidenceLedger,ops,{route:r.route});
 if(r.source_record_id==='202-EDITION-001'){
  assert.equal(contexts.length,1,'Duplicate paired-essay source checks must collapse');
  assert.deepEqual(contexts[0].matched_source_ids,['source-56k-f15ex-ex16-portland-receipt-2026']);assert.equal(contexts[0].checked_date,'2026-09-23');assert.equal(contexts[0].next_check_date,null);assert(contexts[0].summary.includes('neither is identified as contractual acceptance'));
 }else if(r.source_record_id==='202-EDITION-005')assert.equal(contexts.length,0,'Do not invent later checks for agriculture');
 else if(r.source_record_id==='202-EDITION-009')assert.deepEqual(contexts.map(c=>c.id),['207-BACKLOG-001-2026-09-14']);
 else if(r.source_record_id==='202-EDITION-013')assert.deepEqual(contexts.map(c=>c.id),['207-BACKLOG-005-2026-09-14']);
 else if(r.source_record_id==='202-EDITION-021')assert.deepEqual(contexts,[],'No later climate source check is manufactured by translation');
 else if(r.source_record_id==='202-EDITION-025')assert.deepEqual(contexts.map(c=>[c.id,c.checked_date]),[['203-SYNTHESIS-10-source-check-1','2026-09-23']]);
 else if(r.source_record_id==='202-EDITION-029')assert.deepEqual(contexts.map(c=>[c.id,c.checked_date]),[['207-BACKLOG-014-2026-09-14','2026-09-14']]);
 else if(r.source_record_id==='202-EDITION-033')assert.deepEqual(contexts,[],'A discovery translation is not a new dataset or source validation');
 else if(r.source_record_id==='202-EDITION-037')assert.deepEqual(contexts.map(c=>[c.id,c.checked_date]),[['203-CASE-11-source-check-1','2026-09-23'],['207-BACKLOG-007-2026-09-14','2026-09-14'],['207-BACKLOG-015-2026-09-14','2026-09-14']]);
 else if(r.source_record_id==='202-EDITION-041')assert.deepEqual(contexts,[],'A general Toronto pipeline citation does not identify the separate 24 254930 project');
 else if(['202-EDITION-053','202-EDITION-057'].includes(r.source_record_id))assert.deepEqual(contexts,[],'Language review does not manufacture a later adoption or quantum-performance check');
 else if(r.source_record_id==='202-EDITION-061')assert.deepEqual(contexts.map(c=>[c.id,c.checked_date,c.next_check_date]),[['207-BACKLOG-005-2026-09-14','2026-09-14','2026-09-21']],'National activity context is not a new launch or site-authority decision');
 else if(r.source_record_id==='202-EDITION-065')assert.deepEqual(contexts.map(c=>[c.id,c.checked_date,c.next_check_date]),[['receipt-60-arizona-2026-11-21-watch-note','2026-11-21','2026-12-21'],['receipt-60-arizona-2026-09-22-no-material-change','2026-09-22','2026-10-09']],'Current Arizona context remains separate from unchanged translated text and operating admission');
 else if(['202-EDITION-045','202-EDITION-049'].includes(r.source_record_id)){
  const datedAmtrak=contexts.filter(c=>c.kind==='Dated evidence decision').map(c=>[c.id,c.checked_date,c.next_check_date]);
  assert.deepEqual(datedAmtrak,[['receipt-60-amtrak-reliability-2026-11-26-watch-note','2026-11-26','2026-12-26'],['receipt-60-pids-2026-11-21-watch-note','2026-11-21','2026-12-21'],['receipt-60-amtrak-reliability-2026-10-28-no-material-change','2026-10-28','2026-11-25'],['receipt-60-pids-2026-09-10-no-material-change','2026-09-10','2026-10-09']]);
  assert.deepEqual(readerSourceReviewContexts(r,currentEvidenceLedger,ops,{route:r.route,asOfDate:'2026-11-25'}).filter(c=>c.kind==='Dated evidence decision').map(c=>[c.id,c.checked_date,c.next_check_date]),datedAmtrak.slice(1),'November 26 reliability context must not leak into the prior appointment');
  assert.deepEqual(readerSourceReviewContexts(r,currentEvidenceLedger,ops,{route:r.route,asOfDate:'2026-11-20'}).filter(c=>c.kind==='Dated evidence decision').map(c=>[c.id,c.checked_date,c.next_check_date]),datedAmtrak.slice(2),'PIDS follow-up must not backdate or replace the separate reliability review');
  const project=contexts.filter(c=>c.kind.startsWith('Named-project follow-up'));
  if(r.source_record_id==='202-EDITION-045'){
   assert.deepEqual(project.map(c=>[c.id,c.checked_date,c.next_check_date]),[['207-TORONTO-2026-11-21-BOUNDED-BLOCKER','2026-11-21','2026-11-29'],['207-TORONTO-2026-09-28-BOUNDED-BLOCKER','2026-09-28','2026-10-05'],['207-TORONTO-2026-09-21-BOUNDED-RECHECK','2026-09-21','2026-09-28'],['207-TORONTO-2026-09-14-BOUNDED-RECHECK','2026-09-14','2026-09-21']]);
   assert.deepEqual(readerSourceReviewContexts(r,currentEvidenceLedger,ops,{route:r.route,asOfDate:'2026-11-20'}).filter(c=>c.kind.startsWith('Named-project follow-up')).map(c=>c.id),project.slice(1).map(c=>c.id));
   assert(project[0].kind.includes('blocked'));assert(project.every(c=>c.route==='/atlas/projects/toronto-24-254930/'&&c.independent_article_review===false));
   assert(project.every(c=>c.matched_source_ids.length===1&&c.matched_source_ids[0]==='source-toronto-2026-sc33-9-item-history'));
   assert(!readerSourceReviewContexts({...r,named_project_context_ids:[]},currentEvidenceLedger,ops,{route:r.route}).some(c=>c.kind.startsWith('Named-project follow-up')),'Source overlap without an explicit named-project binding must not import project operations');
  }else assert.deepEqual(project,[],'Mobility must not inherit a Toronto project decision');
 }
 else if(r.source_record_id==='202-EDITION-017'){
  assert.equal(contexts.length,5);assert(contexts.some(c=>c.id==='receipt-60-arizona-2026-09-22-no-material-change'));assert(contexts.some(c=>c.id==='receipt-60-arizona-2026-11-21-watch-note'));
  const golden=contexts.filter(c=>c.id.startsWith('203-CASE-03-source-check-'));
  assert.equal(golden.length,3);assert(golden.every(c=>c.checked_date==='2026-09-22'&&c.source_check&&c.matched_source_ids[0]==='source-virginia-scc-golden-mars-2026'));
  assert(golden.some(c=>c.summary.includes('Route 3A')));assert(golden.some(c=>c.summary.includes('Under Appeal')));
 }
 assert.equal(readerSourceReviewContexts(r,currentEvidenceLedger,ops,{route:r.route,asOfDate:'2026-09-01'}).length,0,'Later clarification must not leak into inherited cutoff');
 const before=readerSourceReviewContexts(r,currentEvidenceLedger,ops,{route:r.route,asOfDate:'2026-09-21'});assert(before.every(c=>c.checked_date<='2026-09-21'));
 assert(contexts.every(c=>c.matched_source_ids.every(id=>r.source_ids.includes(id))));
 assert(contexts.filter(c=>c.id.startsWith('207-BACKLOG')).every(c=>!c.kind.includes('pending')));
 for(const mutation of [{overview:'Changed after review'},{locale:'fr-FR'},{human_review_claimed:true},{source_retrieval_performed:true},{publication_authorized:true}]){
  const changed={...r,...mutation};assert.throws(()=>validateTranslatedReader(changed,english,contract));
 }
 assert.throws(()=>validateTranslatedReader(r,{...english,overview:'Changed English'},contract),/English source drift/);
 assert.throws(()=>validateTranslatedReader(r,english,{...contract,translated_content:'Changed history'}),/historical contract drift/);
 {const {sha256,...body}=r,changed={...body,historical_contract:{...body.historical_contract,route:'/reference/accessible-editions/wrong-contract/'}};changed.sha256=hash(JSON.stringify(changed));assert.throws(()=>validateTranslatedReader(changed,english,contract),/historical contract route drift/);}
 for(const field of ['human_review_claimed','source_retrieval_performed','publication_authorized']){
  const {sha256,...body}=r,changed={...body,[field]:true};changed.sha256=hash(JSON.stringify(changed));assert.throws(()=>validateTranslatedReader(changed,english,contract),/review boundary invalid/);
 }
 for(const mutation of [{integration_date:'2026-09-01'},{ai_review_date:'2026-02-30'},{evidence_cutoff:'2099-01-01'}]){const {sha256,...body}=r,changed={...body,...mutation};changed.sha256=hash(JSON.stringify(changed));assert.throws(()=>validateTranslatedReader(changed,english,contract),/chronology invalid/);}
}
assert.deepEqual(translationsForEnglish('202-EDITION-003'),[]);
assert.deepEqual(translationsForEnglish('unknown'),[]);
const backlogExample=ops.backlog_reviews[0],backlogContexts=readerSourceReviewContexts({record_id:'source-context-fixture',source_ids:backlogExample.source_ids},currentEvidenceLedger,ops);
assert(backlogContexts.some(c=>c.id===backlogExample.review_id&&c.kind.includes('AI decision 2026-09-25')));
assert.equal(translatedReaders.reduce((n,r)=>n+r.sections.length,0),204);
assert.equal(translatedReaders.reduce((n,r)=>n+r.sources.length,0),276);
console.log('Thirty-four translated readers verified: all seventeen topics, 204 sections and 276 source-link instances, exact prior text and historical-input pins, distinct assessment/integration dates, exact-source contexts and no inherited human approval. No translation texts remain.');
