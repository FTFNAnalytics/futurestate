import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {translatedReaders,validateTranslatedReader,translationsForEnglish} from '../src/lib/translated-readers.mjs';
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
import {readerSourceReviewContexts} from '../src/lib/reader-presentation.mjs';
import {currentEvidenceLedger} from '../src/lib/current-evidence.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),read=p=>readFile(join(root,p),'utf8'),json=async p=>JSON.parse(await read(p));
const hash=value=>createHash('sha256').update(value).digest('hex');
const readers=await json('app/src/data/phase-204-reader-completion.json'),contracts=(await json('app/src/data/phase-202-accessible-multilingual-low-bandwidth-editions.json')).edition_contracts,ops=await json('app/src/data/phase-207-current-operations.json');
assert.deepEqual(translatedReaders.map(r=>[r.record_id,r.locale]),[['202-EDITION-003','fr-CA'],['202-EDITION-004','es-419'],['202-EDITION-007','fr-CA'],['202-EDITION-008','es-419']]);
assert.equal(contracts.filter(c=>c.is_translation).length-translatedReaders.length,30);
assert.equal(new Set(readerCatalog.map(r=>r.id)).size,readerCatalog.length);
for(const query of ['French','fr-CA','Français canadien','Spanish','es-419','Español de América Latina'])assert.equal(searchReaders(readerCatalog,query,'Translation').length,2,`Language search: ${query}`);
for(const r of translatedReaders){
 const english=readers.records.find(e=>e.record_id===r.source_record_id),contract=contracts.find(c=>c.edition_contract_id===r.record_id);
 const reviewText=await read(r.review_artifact.path),review=JSON.parse(reviewText);
 assert.equal(hash(reviewText),r.review_artifact.sha256);
 const accepted=review.texts.find(t=>t.proposed_contract_id===r.record_id);
 assert.equal(accepted.locale,r.locale);assert.equal(accepted.path,r.text_artifact.path);assert.equal(accepted.file_sha256,r.text_artifact.sha256);
 assert.equal(r.ai_review_date,review.decision_date);assert.equal(r.reviewer,review.reviewer);
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
 }else assert.equal(contexts.length,0,'Do not invent later checks for agriculture');
 assert.equal(readerSourceReviewContexts(r,currentEvidenceLedger,ops,{route:r.route,asOfDate:'2026-09-22'}).length,0,'Later clarification must not leak into earlier cutoff');
 assert(contexts.every(c=>c.matched_source_ids.every(id=>r.source_ids.includes(id))));
 assert(contexts.filter(c=>c.id.startsWith('207-BACKLOG')).every(c=>!c.kind.includes('pending')));
 for(const mutation of [{overview:'Changed after review'},{locale:'fr-FR'},{human_review_claimed:true},{source_retrieval_performed:true},{publication_authorized:true}]){
  const changed={...r,...mutation};assert.throws(()=>validateTranslatedReader(changed,english,contract));
 }
 assert.throws(()=>validateTranslatedReader(r,{...english,overview:'Changed English'},contract),/English source drift/);
 assert.throws(()=>validateTranslatedReader(r,english,{...contract,translated_content:'Changed history'}),/historical contract drift/);
 for(const field of ['human_review_claimed','source_retrieval_performed','publication_authorized']){
  const {sha256,...body}=r,changed={...body,[field]:true};changed.sha256=hash(JSON.stringify(changed));assert.throws(()=>validateTranslatedReader(changed,english,contract),/review boundary invalid/);
 }
}
assert.deepEqual(translationsForEnglish('202-EDITION-003'),[]);
assert.deepEqual(translationsForEnglish('unknown'),[]);
const backlogExample=ops.backlog_reviews[0],backlogContexts=readerSourceReviewContexts({record_id:'source-context-fixture',source_ids:backlogExample.source_ids},currentEvidenceLedger,ops);
assert(backlogContexts.some(c=>c.id===backlogExample.review_id&&c.kind.includes('AI decision 2026-09-25')));
console.log('Four translated readers verified: exact accepted fr-CA/es-419 text for two topics, all six sections and five original source links each, English and historical-contract pins, applicable current source context, reciprocal English links, and fail-closed review boundaries. 30 texts remain to be authored/reviewed.');
