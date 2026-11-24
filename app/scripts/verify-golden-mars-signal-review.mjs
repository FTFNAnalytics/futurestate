import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {parse} from 'parse5';
import {goldenMarsSignalReview as review,goldenMarsSignalContext} from '../src/lib/golden-mars-signal-review.mjs';
const root=fileURLToPath(new URL('../dist/',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const attr=(node,key)=>node.attrs?.find(a=>a.name===key)?.value;
const all=(node,predicate)=>[...(predicate(node)?[node]:[]),...(node.childNodes??[]).flatMap(n=>all(n,predicate))];
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
const route=`/signals/${review.slug}/`,dom=parse(await read(`${route}index.html`));
assert.equal(text(all(dom,n=>n.tagName==='h1')[0]),review.current.title);
assert.equal(attr(all(dom,n=>n.tagName==='meta'&&attr(n,'name')==='description')[0],'content'),review.current.summary);
assert.equal(all(dom,n=>attr(n,'data-dated-signal-review')===review.review_id).length,1);
assert(text(dom).includes('Retained Profile Dates'));assert(text(dom).includes('Retained source profiles'));
const current=all(dom,n=>attr(n,'data-current-signal-body')===review.signal_id);
assert.equal(current.length,1);
for(const section of review.sections)for(const value of [section.heading,...section.paragraphs])assert(text(current[0]).includes(value));
const original=all(dom,n=>attr(n,'data-original-signal')===review.signal_id);
assert.equal(original.length,1);assert.equal(original[0].tagName,'details');
for(const value of [review.prior.title,review.prior.summary,...review.prior.dependencies,...review.prior.local_implications,'The named project has a state decision and a conditional route trail.'])assert(text(original[0]).includes(value));
assert(!text(current[0]).includes('Follow school-board action'));
for(const field of ['dependencies','local_implications'])for(const value of review.current[field]){
  if(field==='dependencies')assert(text(dom).includes(value));
}
const sources=all(dom,n=>attr(n,'data-signal-exact-sources')===review.signal_id);
assert.equal(sources.length,1);
const links=all(sources[0],n=>n.tagName==='a').map(n=>attr(n,'href'));
for(const source of goldenMarsSignalContext(review.signal_id).source_checks){assert(links.includes(source.url));for(const value of [source.locator,source.relation,source.finding,source.access])assert(text(sources[0]).includes(value));}
const exported=JSON.parse(await read('data/signals.json')).records.find(r=>r.id===review.signal_id);
for(const [key,value] of Object.entries(review.current))assert.deepEqual(exported[key],value,`Stale public signal ${key}`);
assert.deepEqual(exported.dated_signal_review,goldenMarsSignalContext(review.signal_id));
assert.equal(exported.editorial_classification,null);assert.equal(exported.published_date,'2026-04-09');assert.equal(exported.captured_date,'2026-07-24');assert.equal(exported.record_status,'Published');
let correctedShelfCards=0,linkedPages=0;
for(const file of await readdir(join(root,'data/shelves'))){if(!file.endsWith('.json'))continue;const rows=JSON.parse(await read(`data/shelves/${file}`)).records;for(const row of rows.filter(r=>r.id===review.signal_id)){correctedShelfCards++;assert.equal(row.title,review.current.title);assert.equal(row.summary,review.current.summary);}}
assert(correctedShelfCards>3);
async function inspect(directory){for(const entry of await readdir(directory,{withFileTypes:true})){
  const path=join(directory,entry.name);if(entry.isDirectory()){if(entry.name!=='downloads')await inspect(path);continue;}
  if(!entry.name.endsWith('.html'))continue;const html=await readFile(path,'utf8');if(!html.includes(`href="${route}"`))continue;
  linkedPages++;const linked=all(parse(html),n=>n.tagName==='a'&&attr(n,'href')===route);
  for(const link of linked)assert(!text(link).includes(review.prior.title),`Stale Golden-Mars link headline in ${path}`);
}}
await inspect(root);
assert(linkedPages>3);
console.log(`Golden-Mars production verified: corrected detail/metadata/body/export, exact source links, inspectable original, ${correctedShelfCards} shelf cards and no superseded signal headline in ${linkedPages} linking application pages. Wider independent narratives are not cleared by this test.`);
