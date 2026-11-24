import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

const hash=value=>createHash('sha256').update(value).digest('hex');
export const reviewedReadingTopics=['energy','finance-and-risk','human-futures','mobility','policy-and-standards','quantum','space','water'];
export const readingIntegrationDate='2026-11-21';

// Read-only preparation: callers receive records/patches, never an implicit write.
export async function prepareReviewedReadings(root,topics=reviewedReadingTopics){
 const read=path=>readFile(join(root,path),'utf8');
 const json=async path=>JSON.parse(await read(path));
 const inventory=await json('app/src/data/ai-reviewed-translations.json');
 const english=(await json('app/src/data/phase-204-reader-completion.json')).records;
 const contracts=(await json('app/src/data/phase-202-accessible-multilingual-low-bandwidth-editions.json')).edition_contracts;
 const records=[];
 for(const topic of topics){
  const reviewPath=`docs/release-reviews/2026-09-22/translation-pilots/${topic}-ai-review-2026-11-21.json`;
  const reviewRaw=await read(reviewPath),review=JSON.parse(reviewRaw);
  assert.equal(review.policy_id,inventory.policy_id);assert.equal(review.human_review_claimed,false);assert.equal(review.source_retrieval_performed,false);
  const source=english.find(r=>r.record_id===review.source_record_id);
  assert(source);assert.equal(hash(JSON.stringify(source)),review.source_record_sha256);
  assert.deepEqual(review.source_artifacts.map(s=>s.id),source.source_ids);
  assert.equal(review.texts.length,2);
  for(const accepted of review.texts){
   assert(['fr-CA','es-419'].includes(accepted.locale));
   const contract=contracts.find(c=>c.edition_contract_id===accepted.proposed_contract_id);
   assert(contract?.is_translation);assert.equal(contract.topic_id,`topic-${topic}`);
   // The November preparation field binds canonical content, not JSON.stringify(contract).
   assert.equal(accepted.historical_contract_sha256,contract.canonical_content_digest);
   assert.deepEqual(review.historical_contract_source_ids,contract.source_ids);
   const text=await read(accepted.path);assert.equal(hash(text),accepted.file_sha256);
   const chunks=text.trim().split(/\r?\n## /),intro=chunks.shift().split(/\r?\n\r?\n/);chunks.pop();
   const sections=chunks.map(s=>{const [heading,...paragraphs]=s.split(/\r?\n\r?\n/);return {heading,paragraphs};});
   assert.equal(sections.length,source.sections.length);
   const sources=[];
   for(const pin of review.source_artifacts){
    const raw=await read(pin.path),record=JSON.parse(raw);assert.equal(hash(raw),pin.sha256);assert.equal(record.id,pin.id);assert.equal(record.url,pin.url);
    assert(text.includes(pin.id)&&text.includes(`](${pin.url})`)&&text.includes(pin.name));
    sources.push({id:pin.id,url:pin.url,label:pin.name,source_file_sha256:pin.sha256,language:'en'});
   }
   const record={record_id:accepted.proposed_contract_id,route:`/reference/accessible-editions/${topic}-${accepted.locale.toLowerCase()}/`,locale:accepted.locale,topic_id:contract.topic_id,title:intro[0].replace(/^# /,''),review_notice:intro[1].replaceAll('**','').replaceAll('`',''),overview:intro.slice(2).join('\n\n'),sections,source_ids:source.source_ids,sources,source_record_id:source.record_id,source_record_sha256:review.source_record_sha256,source_authored_date:source.authored_date,evidence_cutoff:source.inherited_as_of_date,english_route:`/reference/accessible-editions/${topic}-plain-language-en/`,ai_review_date:review.decision_date,integration_date:readingIntegrationDate,reviewer:review.reviewer,human_review_claimed:false,source_retrieval_performed:false,publication_authorized:false,review_state:'AI linguistic fidelity accepted; local reading edition',review_artifact:{path:reviewPath,sha256:hash(reviewRaw),historical_contract_digest_kind:'canonical-content'},text_artifact:{path:accepted.path,sha256:accepted.file_sha256},historical_contract:{route:contract.route.replace('/review/v1reference/','/reference/'),record_sha256:hash(JSON.stringify(contract)),canonical_content_digest:contract.canonical_content_digest,source_ids:contract.source_ids},preparation_notice_is_historical:true,ui:inventory.records.find(r=>r.locale===accepted.locale).ui};
   if(source.record_id==='202-EDITION-045')record.named_project_context_ids=['61-PROJECT-TORONTO-24-254930'];
   record.sha256=hash(JSON.stringify(record));records.push(record);
  }
 }
 assert.equal(new Set(records.map(r=>r.record_id)).size,records.length);
 return records;
}
