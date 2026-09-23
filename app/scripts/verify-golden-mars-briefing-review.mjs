import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'parse5';
import {createMarkdownProcessor,parseFrontmatter} from '@astrojs/markdown-remark';
import {goldenMarsBriefingReview as review,goldenMarsBriefingContext as context,projectGoldenMarsBriefingData as project,projectGoldenMarsBriefingBody as body} from '../src/lib/golden-mars-briefing-review.mjs';
const app=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(app,p),'utf8');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,p)=>[...(p(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,p))];
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const norm=s=>s.replace(/\s+/g,' ').trim();
const currentText=n=>attr(n,'data-golden-briefing-prior-fields')||attr(n,'data-golden-briefing-original-body')?'':n.nodeName==='#text'?n.value:(n.childNodes??[]).map(currentText).join('');
const links=n=>all(n,c=>c.tagName==='a').map(n=>attr(n,'href'));
const processor=await createMarkdownProcessor({gfm:true,smartypants:false});
let notices=0,fields=0,bodies=0,methods=0;
for(const record of review.records){
  const raw=await read(record.source_file),original=parseFrontmatter(raw).frontmatter,current=project(original);
  const dom=parse(await read('dist'+record.route+'index.html'));
  const visible=norm(currentText(dom)),notes=all(dom,n=>attr(n,'data-golden-briefing-review')===record.id);
  assert.equal(notes.length,1);notices++;
  const note=notes[0],noteText=norm(text(note)),noteLinks=links(note);
  assert.equal(all(note,n=>n.tagName==='h2').map(text).join(''),'Golden-Mars clarification · '+review.review_date);
  assert(noteText.includes(norm(review.boundary)));
  assert(noteLinks.includes(review.retained_review_route));assert(noteLinks.includes('/updates/'+review.update_id+'/'));
  const [description]=all(dom,n=>n.tagName==='meta'&&attr(n,'name')==='description');
  assert.equal(attr(description,'content'),current.summary);
  assert.equal(text(all(dom,n=>n.tagName==='h1')[0]),original.title);
  const date=value=>value instanceof Date?value.toISOString().slice(0,10):value;
  assert(visible.includes(date(original.published_date)));
  assert(visible.includes('Last reviewed: '+date(original.last_reviewed_date)));
  const prior=all(note,n=>attr(n,'data-golden-briefing-prior-fields')===record.id);
  assert.equal(prior.length,record.changes.length?1:0);
  for(const change of record.changes){fields++;assert(visible.includes(norm(change.current)));assert(norm(text(prior[0])).includes(norm(change.prior)));assert(!visible.includes(norm(change.prior)),'Earlier field still presented as current');}
  const [sources]=all(note,n=>attr(n,'data-golden-briefing-sources')===record.id);assert(sources);
  for(const source of context(record.id).source_checks){assert(links(sources).includes(source.url));for(const k of ['locator','finding','access'])assert(norm(text(sources)).includes(norm(source[k])));}
  const revised=body(record.id,raw),currentBodies=all(dom,n=>attr(n,'data-golden-briefing-current-body')===record.id),originalBodies=all(dom,n=>attr(n,'data-golden-briefing-original-body')===record.id);
  if(revised){
    bodies++;assert.equal(currentBodies.length,1);assert.equal(originalBodies.length,1);assert.equal(originalBodies[0].tagName,'details');
    const expected=parse((await processor.render(revised.current)).code),expectedOriginal=parse((await processor.render(revised.original)).code);
    const oldDiv=originalBodies[0].childNodes.find(n=>n.tagName==='div');assert(oldDiv);
    assert.equal(norm(text(currentBodies[0])),norm(text(expected)),'Current body is incomplete');
    assert.equal(norm(text(oldDiv)),norm(text(expectedOriginal)),'Original body is incomplete');
    assert.deepEqual(links(currentBodies[0]),links(expected));
    const ids=n=>all(n,c=>attr(c,'id')).map(c=>attr(c,'id'));
    assert.deepEqual(ids(currentBodies[0]),ids(expectedOriginal),'Existing body anchors changed');
    assert.deepEqual(ids(oldDiv),ids(expectedOriginal).map(id=>'retained-golden-'+id));
    const allIds=ids(dom);assert.equal(new Set(allIds).size,allIds.length,'Duplicate briefing anchors');
    if(record.id.includes('project-conversion-003'))for(const value of ['2026-04-09','62-EVENT-NOVA-GOLDEN-MARS-CONDITIONAL','backfilled evidence events'])assert(norm(text(currentBodies[0])).includes(value));
    if(record.id.includes('acceptance-dossier-003')||record.id.includes('qualification-playbook-003'))assert(norm(text(currentBodies[0])).includes('2026-10-01'));
  }else{
    methods++;assert.equal(currentBodies.length,0);assert.equal(originalBodies.length,0);
    assert(noteText.includes(norm(record.context_note)));assert(visible.includes(record.packet_id));
    assert(visible.includes('Not Established / Awaiting Qualifying Artifact'));
  }
}
assert.equal(notices,8);assert.equal(fields,6);assert.equal(bodies,4);assert.equal(methods,4);
const ids=new Set(review.records.map(r=>r.id));let unaffected=0,cards=0;
for(const file of await readdir(join(app,'src/content/briefings'))){
  if(!file.endsWith('.mdx'))continue;
  const data=parseFrontmatter(await read('src/content/briefings/'+file)).frontmatter;
  if(ids.has(data.id))continue;
  const dom=parse(await read('dist/briefings/'+data.slug+'/index.html'));
  assert.equal(all(dom,n=>attr(n,'data-golden-briefing-review')!==undefined||attr(n,'data-golden-briefing-current-body')!==undefined).length,0,'Clarification leaked to another briefing');unaffected++;
}
for(const file of await readdir(join(app,'dist/data/shelves'))){
  if(!file.endsWith('.json'))continue;
  for(const card of JSON.parse(await read('dist/data/shelves/'+file)).records){
    const record=review.records.find(r=>r.id===card.id),change=record?.changes.find(c=>c.path[0]==='summary');
    if(change){assert.equal(card.summary,change.current);cards++;}
  }
}
assert(cards>0);
const update=parse(await read('dist/updates/'+review.update_id+'/index.html'));
for(const record of review.records)assert(links(update).includes(record.route));
assert(links(update).includes(review.retained_review_route));
console.log('Golden-Mars briefing output verified: eight dated notices, six current fields, four full current/original narratives with stable anchors, four unchanged method bodies, '+cards+' summary cards and '+unaffected+' unaffected briefing routes. Original dates, source limits and evidence holds retained; no browser or independent acceptance.');
