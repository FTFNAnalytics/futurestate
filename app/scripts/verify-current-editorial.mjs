import assert from'node:assert/strict';import{readFile,readdir}from'node:fs/promises';import{dirname,resolve,join}from'node:path';import{fileURLToPath}from'node:url';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
import {getStatusNote,getClaimScopeNote,getLocalEvidenceNote} from '../src/lib/editorial.ts';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');const read=path=>readFile(join(root,path),'utf8');const corpus=JSON.parse(await read('src/data/phase-205-216-current-editorial.json'));const ops=JSON.parse(await read('src/data/phase-207-current-operations.json'));
for(const a of corpus.records){const html=await read(`dist${a.route}index.html`);assert(html.includes(`data-current-research="${a.record_id}"`),`Missing reader draft ${a.record_id}`);assert(html.includes(a.title.replaceAll('&','&amp;')),`Missing current title ${a.record_id}`);assert(html.includes('independent review pending'));}
for(const a of corpus.records.filter(r=>r.kind==='Topic')){
 const html=await read(`dist${a.route}index.html`),text=decodeHtmlText(html);
 assert.equal((html.match(/data-topic-case="/g)??[]).length,2,`${a.record_id}: missing expanded cases`);
 assert(html.includes('data-topic-source-appendix'));
 for(const s of a.sections){if(s.case_id)assert(html.includes(`data-topic-case="${s.case_id}"`));for(const p of s.paragraphs??[]){assert(text.includes(p.text),`${a.record_id}: truncated case paragraph`);for(const i of p.citations)assert(html.includes(a.sources[i].url.replaceAll('&','&amp;')));}}
 for(const n of a.source_notes){assert(text.includes(n.locator));assert(text.includes(n.scope));assert(text.includes(n.access));}
}
for(const a of corpus.records.filter(r=>r.identity_evidence)){
 const html=await read(`dist${a.route}index.html`),text=decodeHtmlText(html),identity=a.identity_evidence;
 if(a.updated_date){assert(html.includes('data-editorial-updated'));assert(text.includes(`Updated ${a.updated_date}`));}
 assert.equal((html.match(/data-identity-evidence="/g)??[]).length,1,`${a.record_id}: duplicate or missing identity boundary`);
 assert(html.includes(`data-identity-evidence="${a.record_id}"`));
 assert(html.includes('data-source-appendix'));
 if(a.language_notes)assert(html.includes('data-language-notes'));
 for(const value of [identity.candidate_name,identity.scope,identity.disposition,...identity.aliases,...identity.not_equivalent])assert(text.includes(value),`${a.record_id}: missing identity text`);
 if(identity.identifier)assert(text.includes(identity.identifier));
 for(const s of a.sections){assert(text.includes(s.heading));assert(text.includes(s.text),`${a.record_id}: truncated section`);for(const p of s.paragraphs??[])assert(text.includes(p.text),`${a.record_id}: truncated interpretation`);}
 for(const source of a.sources)assert(html.includes(source.url.replaceAll('&','&amp;')),`${a.record_id}: missing exact artifact link`);
 for(const n of a.source_notes)for(const field of ['locator','scope','access'])assert(text.includes(n[field]),`${a.record_id}: missing source note`);
 for(const n of a.language_notes??[]){assert(html.includes(`lang="${n.lang}"`));for(const field of ['term','reading','review_status'])assert(text.includes(n[field]),`${a.record_id}: missing language note`);}
}
for(let page=1;page<=4;page++){const html=await read(`dist/reference/explore/${page}/index.html`);assert((html.match(/class="record-card"/g)??[]).length<=40);assert(html.includes('Reader catalog pages'));}
for(const r of ops.receipts)for(const route of r.affected_routes){if(route.endsWith('.json'))continue;const html=await read(`dist${route}index.html`);assert(html.includes(r.receipt_id),`Missing project check at ${route}`);}
for(const note of ops.pilot_research_followups??[])for(const route of note.affected_routes){
 const html=await read(`dist${route}index.html`),text=decodeHtmlText(html);
 assert.equal(html.split(`data-pilot-research="${note.review_id}"`).length-1,1,`One measurement follow-up at ${route}`);
 for(const value of [note.title,note.status,note.checked_date,note.finding,note.next_action,...note.access_limits,...note.required_artifacts])assert(text.includes(value),`Missing measurement research boundary at ${route}`);
 for(const source of note.source_checks)for(const value of [source.url,source.title,source.artifact_date,source.locator,source.finding,source.access])assert(text.includes(value),`Missing exact measurement source at ${route}`);
 assert(text.includes('No added observations, independent approval, issuer correction or series admission.'));
}
const detail=await read('dist/signals/57n-amtrak-24-accepted-label-conformance-tests/index.html');assert(detail.includes('FTFN adapter passes 24 Amtrak-label conformance tests'));assert(detail.includes('Current editorial classification'));
const measurementPage=await read('dist/method/editorial-review/index.html');
assert(measurementPage.includes('The measurement feature remains held'));
for(const pilot of ops.pilot_reviews){
 const latest=ops.pilot_research_followups.filter(r=>r.pilot_id===pilot.pilot_id&&r.checked_date<=ops.as_of_date).at(-1);
 assert(latest);assert.equal(measurementPage.split(`data-pilot-latest="${latest.review_id}"`).length-1,1);
 assert(measurementPage.includes(`href="#${latest.review_id}"`));
}
const signals=await read('dist/signals/index.html');assert(!signals.includes('href="/signals/57n-amtrak-24-accepted-label-conformance-tests/"'),'Corrected method note leaked into the default feed');
for(const [file,out]of [['phase-205-216-current-editorial.json','current-editorial.json'],['phase-206-editorial-classification.json','editorial-classification.json'],['phase-207-current-operations.json','current-operations.json']])assert.deepEqual(JSON.parse(await read(`src/data/${file}`)),JSON.parse(await read(`dist/data/${out}`)));
console.log('Current editorial production verified: 33 readers; 40-card catalog pages; correction excluded from default feed; Toronto assigned surfaces; exact JSON exports. Browser/independent review remains separate.');
assert.deepEqual(JSON.parse(await read('dist/data/reader-catalog.json')).records,readerCatalog);
const toronto=JSON.parse(await read('dist/data/project-conversion.json')).records.find(r=>r.file_id==='61-PROJECT-TORONTO-24-254930');
assert.equal(toronto.historical_next_check_date,'2026-09-09');assert.equal(toronto.next_check_date,'2026-09-28');
assert.equal(toronto.dated_project_checks[0].checked_date,'2026-09-14');assert.equal(toronto.dated_project_checks[0].next_check_date,'2026-09-21');
assert.equal(toronto.dated_project_checks[1].checked_date,'2026-09-21');assert.equal(toronto.dated_project_checks[1].next_check_date,'2026-09-28');
const ledger=JSON.parse(await read('src/data/phase-206-editorial-classification.json'));
const excluded=new Set(ledger.records.map(r=>r.id));
const sitemap=await read('dist/sitemap.xml');
for(const[kind,folder]of [['briefings','briefings'],['signals','signals'],['documents','research-documents'],['collections','research-collections'],['classification','signals']]){
  const records=JSON.parse(await read(`dist/data/shelves/${kind}.json`)).records;
  const expected=[];
  for(const file of await readdir(join(root,'src/content',folder))){
    if(!/\.(mdx|json)$/.test(file))continue;
    const raw=await read(`src/content/${folder}/${file}`);
    const r=file.endsWith('.json')?JSON.parse(raw):{id:raw.match(/^id: "([^"]+)"/m)?.[1]};
    if(kind==='signals'&&excluded.has(r.id))continue;
    if(kind==='classification'&&!excluded.has(r.id))continue;
    if(kind==='collections'&&r.record_status!=='Published')continue;
    expected.push(r.id);
  }
  assert.deepEqual(records.map(r=>r.id).sort(),expected.sort(),`${kind}: catalogue membership`);
  const seen=[];
  for(let page=1;page<=Math.ceil(records.length/40);page++){
    const route=`/browse/${kind}/${page}/`;
    const html=await read(`dist${route}index.html`);
    const ids=[...html.matchAll(/data-shelf-card="([^"]+)"/g)].map(m=>m[1]);
    assert(ids.length<=40);seen.push(...ids);assert(sitemap.includes(`https://ftfn.io${route}`));
  }
  assert.deepEqual(seen.sort(),expected.sort(),`${kind}: static pages omit or duplicate records`);
  assert.equal(searchShelf(records,{q:'missing-needle-6345892'}).length,0);
  const hit=records[0];assert(searchShelf(records,{q:hit.title,status:hit.filters.status[0]}).some(r=>r.id===hit.id));
}
for(const route of ['/briefings/','/signals/','/research/','/method/editorial-review/']){
  const html=await read(`dist${route}index.html`);assert((html.match(/data-shelf-card="/g)??[]).length<=40);assert(Buffer.byteLength(html)<200000,`${route}: initial HTML budget`);
}
const publicSignals=JSON.parse(await read('dist/data/signals.json')).records;
for(const r of ledger.records.filter(r=>r.correction)){
  const html=await read(`dist/signals/${r.slug}/index.html`),text=decodeHtmlText(html);
  const fields=['title','summary','evidence_quality','verification_status','signal_type','maturity_level','why_it_matters','claim_scope','local_evidence_level'];
  for(const key of fields)assert(text.includes(r.correction[key]),`${r.id}: detail omitted corrected ${key}`);
  for(const note of [getStatusNote(r.prior.record_status,true),getClaimScopeNote(r.correction.claim_scope),getLocalEvidenceNote(r.correction.local_evidence_level)])assert(text.includes(note),`${r.id}: missing scope/status explanation`);
  const exported=publicSignals.find(s=>s.id===r.id);
  if(r.prior.record_status==='Published'){assert(exported,`${r.id}: historical Published export omitted`);for(const key of fields)assert.equal(exported[key],r.correction[key]);}
  else assert.equal(exported,undefined,`${r.id}: review-state record leaked into Published export`);
  if(r.retained_source_reviews){
    for(const receipt of r.retained_source_reviews)assert(text.includes(receipt.receipt_id),`${r.id}: retained source receipt missing from detail`);
    assert(text.includes('not a fourteenth Evidence Cycle gate'));
    assert(text.includes('not a finding of nonexistence or zero adoption'));
    assert(text.includes('10,636')&&text.includes('10,635'),`${r.id}: planned-location discrepancy erased`);
  }
}
const archive=JSON.parse(await read('dist/data/shelves/classification.json')).records;
for(const r of ledger.records){const entry=archive.find(s=>s.id===r.id);assert(entry,`Missing deliberate archive access: ${r.id}`);assert.equal(entry.summary,r.reason);assert.equal(entry.title,r.claim_review_complete?(r.correction?.title??r.prior.title):`Under review: ${r.prior.title}`);assert.equal(entry.filters.type[0],r.content_type);}
const field=await read('dist/reference/field-report/2026-09-14/index.html');
for(const id of ['198-CASE-016','198-CASE-002','198-CASE-013','198-CASE-014'])assert(field.includes(`data-current-research="${id}"`));
assert(sitemap.includes('https://ftfn.io/reference/field-report/2026-09-14/'));
console.log('Complete shelf membership, <=40 initial cards, <200 kB Signals/Research HTML, shareable-search matcher, corrected detail/export fields and assembled field edition verified.');
