import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {parse} from 'parse5';
import {createMarkdownProcessor} from '@astrojs/markdown-remark';
import {goldenMarsWiderReview as review,goldenMarsWiderContext,goldenMarsSourceExportContext,projectGoldenMarsSystemBody} from '../src/lib/golden-mars-wider-review.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const attr=(node,key)=>node.attrs?.find(a=>a.name===key)?.value;
const all=(node,predicate)=>[...(predicate(node)?[node]:[]),...(node.childNodes??[]).flatMap(n=>all(n,predicate))];
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
const norm=s=>s.replace(/\s+/g,' ').trim(),at=(x,path)=>path.reduce((v,k)=>v[k],x);
const currentText=node=>attr(node,'data-golden-mars-prior-fields')||attr(node,'data-golden-mars-original-system')?'':node.nodeName==='#text'?node.value:(node.childNodes??[]).map(currentText).join('');
const processor=await createMarkdownProcessor({gfm:true,smartypants:false});
const originals=new Map();let checkedFields=0;
for(const r of review.records){
  const dom=parse(await read('dist'+r.route+'index.html')),current=norm(currentText(dom));
  assert.equal(all(dom,n=>attr(n,'data-golden-mars-followthrough')===r.id).length,1,r.id);
  const prior=all(dom,n=>attr(n,'data-golden-mars-prior-fields')===r.id);
  if(r.changes.length){assert.equal(prior.length,1);assert.equal(prior[0].tagName,'details');}
  for(const c of r.changes){checkedFields++;assert(current.includes(norm(c.current)),`Missing current field ${r.id}/${c.path}`);assert(norm(text(prior[0])).includes(norm(c.prior)),`Missing prior ${r.id}/${c.path}`);assert(!current.includes(norm(c.prior)),`Prior presented as current: ${r.id}/${c.path}`);}
  const exact=all(dom,n=>attr(n,'data-golden-mars-exact-sources')===r.id);assert.equal(exact.length,1);
  const links=all(exact[0],n=>n.tagName==='a').map(n=>attr(n,'href'));
  for(const source of goldenMarsWiderContext(r.id).source_checks){assert(links.includes(source.url));for(const field of ['locator','finding','access'])assert(norm(text(exact[0])).includes(norm(source[field])));}
  const raw=await read(r.source_file);
  if(r.body_replacements){
    const body=all(dom,n=>attr(n,'data-golden-mars-current-system')===r.id),old=all(dom,n=>attr(n,'data-golden-mars-original-system')===r.id);
    assert.equal(body.length,1);assert.equal(old.length,1);assert.equal(old[0].tagName,'details');
    const bodies=projectGoldenMarsSystemBody(r.id,raw);
    const expected=parse((await processor.render(bodies.current)).code),original=parse((await processor.render(bodies.original)).code);
    assert.equal(norm(text(body[0])),norm(text(expected)),'Incomplete current system body');
    const oldDiv=old[0].childNodes.find(n=>n.tagName==='div');assert.equal(norm(text(oldDiv)),norm(text(original)),'Incomplete original system body');
    const currentIds=all(body[0],n=>attr(n,'id')).map(n=>attr(n,'id'));
    assert(currentIds.length>20);assert.deepEqual(all(oldDiv,n=>attr(n,'id')).map(n=>attr(n,'id')),currentIds.map(id=>'retained-'+id));
    const ids=all(dom,n=>attr(n,'id')).map(n=>attr(n,'id'));assert.equal(new Set(ids).size,ids.length,'Duplicate system anchors');
  }else originals.set(r.id,JSON.parse(raw));
}
assert.equal(checkedFields,18);
const sources=JSON.parse(await read('dist/data/sources.json')).records,research=JSON.parse(await read('dist/data/research.json')).records,pathways=JSON.parse(await read('dist/data/pathways.json')).records;
for(const r of review.records.filter(r=>r.source_file.includes('/sources/')||r.source_file.includes('/research-documents/')||r.source_file.includes('/reader-pathways/'))){
  const original=originals.get(r.id),exported=[...sources,...research,...pathways].find(x=>x.id===r.id);
  if(original.record_status==='In Review'){assert.equal(exported,undefined,'In Review pathway leaked into Published-only export');continue;}
  assert(exported);assert.deepEqual(exported.dated_golden_mars_review,r.source_file.includes('/sources/')?goldenMarsSourceExportContext(r.id):goldenMarsWiderContext(r.id));
  for(const c of r.changes.filter(c=>Object.hasOwn(exported,c.path[0])))assert.equal(at(exported,c.path),c.current);
  for(const key of ['url','official_url','publication_date','captured_date','last_checked_date','record_status','local_capture_path'])if(Object.hasOwn(original,key))assert.equal(exported[key],original[key],`Changed export provenance ${r.id}/${key}`);
}
const serializedSources=JSON.stringify(sources);
assert(!serializedSources.includes('"automation_notes"')&&!serializedSources.includes('"notes"'),'Source review leaked non-export fields');
for(const change of review.records.find(r=>r.id==='source-virginia-scc-golden-mars-2026').changes.filter(c=>c.path[0]==='automation_notes')){
  assert(!serializedSources.includes(change.prior)&&!serializedSources.includes(change.current),'Monitoring guidance leaked through review history');
}
const gapHtml=await read('dist/atlas/evidence-gaps/gap-011-northern-virginia-large-load-delivery/index.html');
const retainedDecision=originals.get('gap-011').latest_review;
assert.equal(retainedDecision.next_check_date,'2026-10-01');
function assertRetainedGapDecision(dom){
  const decisions=all(dom,n=>attr(n,'data-evidence-decision')===retainedDecision.phase);
  assert.equal(decisions.length,1,'Missing retained Phase 55X decision');
  const visible=norm(text(decisions[0]));
  // The existing shared date formatter renders ISO dates. Check the appointment
  // in its decision section, not an assumed locale format or unrelated prose.
  for(const value of ['Retained Evidence Decision',`${retainedDecision.phase} Review`,retainedDecision.decision,
    retainedDecision.review_date,`Next check ${retainedDecision.next_check_date}`,retainedDecision.stage_result,
    retainedDecision.stop_rule,...retainedDecision.named_records])assert(visible.includes(norm(value)),`Changed retained decision: ${value}`);
}
assertRetainedGapDecision(parse(gapHtml));
assert.throws(()=>assertRetainedGapDecision(parse(gapHtml.replace('Next check 2026-10-01','Next check 2026-10-02'))));
const nova=parse(await read('dist/pathways/northern-virginia-compute-to-service/index.html'));
assert.equal(attr(all(nova,n=>n.tagName==='meta'&&attr(n,'name')==='robots')[0],'content'),'noindex, follow');
for(const pin of review.historical_downloads){const bytes=await readFile(join(root,'dist'+pin.path));assert.equal(createHash('sha256').update(bytes).digest('hex'),pin.sha256,'Historical download changed');}
let cards=0;
for(const file of await readdir(join(root,'dist/data/shelves'))){if(!file.endsWith('.json'))continue;for(const card of JSON.parse(await read('dist/data/shelves/'+file)).records){
  const r=review.records.find(r=>r.id===card.id);if(!r)continue;const c=r.changes.find(c=>['summary','known_limitations','next_action'].includes(c.path[0]));if(c){cards++;assert.equal(card.summary,c.current);}
}}
assert(cards>10);
console.log(`Golden-Mars wider production verified: 7 exact routes, ${checkedFields} current fields and retained prior wording, 5 system body changes with complete original and unique anchors, ${cards} shelf cards, exact artifacts/exports/downloads and unchanged In Review/October 1 boundaries. Other narratives and independent acceptance remain open.`);
