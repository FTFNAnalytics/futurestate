import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {collectPrimaryRecords,recordId} from './lib/v1ref-records.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=async name=>JSON.parse(await readFile(join(root,'src/data',name),'utf8'));
const pack=await read('phase-204-reader-completion.json');
const files=['phase-200-cross-system-constraint-monographs.json','phase-202-accessible-multilingual-low-bandwidth-editions.json','phase-203-state-of-future-systems-2026.json'];
const originals=(await Promise.all(files.map(read))).flatMap(collectPrimaryRecords);
const byId=new Map(originals.map(record=>[recordId(record),record]));
const sourceIds=new Set((await readdir(join(root,'src/content/sources'))).filter(name=>name.endsWith('.json')).map(name=>name.slice(0,-5)));
const {artifact_digest,...payload}=pack;
assert.equal(createHash('sha256').update(JSON.stringify(payload)).digest('hex'),artifact_digest);
assert.equal(pack.records.length,104); assert.equal(new Set(pack.records.map(r=>r.record_id)).size,104);
assert.equal(pack.records.filter(r=>r.record_id.startsWith('200-')).length,12);
assert.equal(pack.records.filter(r=>r.record_id.startsWith('202-')).length,34);
assert.equal(pack.records.filter(r=>r.record_id.startsWith('203-')).length,58);
let words=0;
for(const article of pack.records){
 const original=byId.get(article.record_id); assert(original,`Unknown reader binding ${article.record_id}`);
 assert.equal(article.authored_date,'2026-09-10'); assert.equal(article.inherited_as_of_date,'2026-09-01');
 assert(article.review_status.includes('pending'),`Unreviewed text cannot claim approval: ${article.record_id}`);
 assert(Array.isArray(article.sections)&&article.sections.length>=3);
 assert(article.sections.every(section=>section.heading&&Array.isArray(section.paragraphs)&&section.paragraphs.every(p=>typeof p==='string'&&p.length>20)));
 assert(Array.isArray(article.source_ids)&&article.source_ids.every(id=>sourceIds.has(id)),`Unknown source ${article.record_id}`);
 const text=[article.overview,...article.sections.flatMap(section=>section.paragraphs)].join(' ');
 assert(!/\b(?:TODO|Lorem ipsum)\b|\[insert|\[placeholder/i.test(text));
 const count=text.split(/\s+/).length; words+=count;
 const minimum=article.record_id.startsWith('200-')||article.record_id.startsWith('203-SYNTHESIS')?500:article.record_id.startsWith('203-TOPIC')?400:article.record_id.startsWith('203-CASE')?200:article.record_id.startsWith('203-METHOD')?300:article.mode==='low-bandwidth'||/low.bandwidth/i.test(article.title)?150:300;
 assert(count>=minimum,`${article.record_id}: ${count} words, requires ${minimum}`);
}
for(const registry of await Promise.all(files.map(read))) {
 if(registry.phase===202) assert(collectPrimaryRecords(registry).every(r=>r.rendered_content===null&&r.translated_content===null),'Historical edition contracts changed');
}
assert.equal(pack.records.filter(r=>r.adapted_from_record_id).length,12);
assert.equal(pack.counts.distinct_authored_texts,92);
console.log(`Phase 204 reader completion passed: 104 exact bindings /92 distinct texts; ${words} words including reused syntheses; historical contracts, translation holds and editorial review boundaries intact.`);
