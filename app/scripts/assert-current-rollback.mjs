import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createSignalProjection} from '../src/lib/signal-classification.mjs';
const root=new URL('../',import.meta.url);
const ledger=JSON.parse(await readFile(new URL('src/data/phase-206-editorial-classification.json',root),'utf8'));
const record=ledger.records.find(r=>r.id==='signal-57n-amtrak-24-accepted-label-conformance-tests');
const raw=await readFile(new URL(`src/content/signals/${record.source_file}`,root),'utf8');
const original={data:{id:record.id,title:record.prior.title,record_status:'Published',slug:record.slug}};
const before=JSON.stringify(original);
const withdrawal={...record,content_type:'Research docket',correction:{title:'FTFN record held while a classification correction is reviewed'},current_feed_eligible:false,reason:'Test-only withdrawal; never restores a disputed agency headline to the current feed.'};
const stages=[createSignalProjection([record]),createSignalProjection([withdrawal]),createSignalProjection([record])];
const titles=stages.map(p=>p.project(original).data.title);
assert.equal(titles[0],record.correction.title);assert.equal(titles[1],withdrawal.correction.title);assert.equal(titles[2],titles[0]);
for(const p of stages){assert.equal(p.eligible(original),false);assert.equal(p.project(original).data.current_feed_eligible,false);assert.equal(p.project(original).data.record_status,'Published');assert.equal(p.project(original).data.slug,record.slug);}
assert.equal(JSON.stringify(original),before);
assert.equal(createHash('sha256').update(raw).digest('hex'),record.source_sha256);
const mutations=[record];const isolated=createSignalProjection(mutations);mutations[0]={...record,correction:{title:'MUTATED'}};assert.equal(isolated.project(original).data.title,record.correction.title);
console.log('Projection-level correction → held withdrawal → reapplication passed; historical source hash, URL and publication state preserved. This is not a hosted rollback or independent review.');
