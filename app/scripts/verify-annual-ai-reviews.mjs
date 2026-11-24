import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import {createHash} from 'node:crypto';
import {retainedTranslationInput} from '../src/lib/annual-ai-review-inputs.mjs';
import {annualAiReviewData as data,annualAiReadings,annualAiPresentation,annualAiReviewStatus,annualAiAvailableDate} from '../src/lib/annual-ai-reviews.mjs';
import originals from '../src/data/phase-204-reader-completion.json' with {type:'json'};
import translations from '../src/data/ai-reviewed-translations.json' with {type:'json'};
import {canonicalAnnualBindings} from '../src/lib/canonical-annual-reader-bindings.mjs';
const read=path=>readFile(new URL('../dist/'+path.replace(/^\//,''),import.meta.url),'utf8');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,test)=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const exports=JSON.parse(await read('data/build-decisions.json')),catalog=JSON.parse(await read('data/reader-catalog.json'));
const retainedRaw=await read(retainedTranslationInput.route);
assert.equal(createHash('sha256').update(retainedRaw).digest('hex'),retainedTranslationInput.whole_file_sha256,'Published retained input must be byte-exact');
assert.equal(JSON.parse(retainedRaw).records.length,10);assert.deepEqual(exports.translations,translations);
assert.deepEqual(exports.annual_ai_reviews,data);assert.deepEqual(JSON.parse(await read('data/phase-204-reader-completion.json')),originals);
const method=parse(await read('method/editorial-review/index.html')),sitemap=await read('sitemap.xml');
assert(text(method).includes('58 of 58 annual records assessed by AI'));
let sections=0,paragraphs=0,changes=0,additional=0,local=0,absent=0,accessLimits=0,requiredArtifacts=0,exactArtifacts=0,receiptFragments=0;
for(const {decision,reading} of annualAiReadings){
  const original=originals.records.find(r=>r.record_id===reading.record_id),view=annualAiPresentation(original,{route:reading.route});
  const html=await read(reading.route+'index.html'),dom=parse(html);
  const notices=all(dom,n=>attr(n,'data-annual-ai-review')!==undefined);assert.equal(notices.length,1);assert.equal(attr(notices[0],'data-annual-ai-review'),reading.record_id);
  assert(text(notices[0]).includes(decision.rationale));assert(text(notices[0]).includes(annualAiReviewStatus));assert(text(notices[0]).includes(decision.review_date));
  const availableDate=annualAiAvailableDate(decision.record_id),applied=all(notices[0],n=>attr(n,'data-annual-ai-integration-date')!==undefined);
  assert.equal(applied.length,availableDate!==decision.review_date?1:0);if(applied.length)assert(text(applied[0]).includes(availableDate));
  for(const finding of decision.claim_findings)assert(text(notices[0]).includes(finding.rationale));
  const history=all(dom,n=>attr(n,'data-annual-ai-history')===reading.record_id);assert.equal(history.length,1);assert.equal(history[0].tagName,'details');assert(text(history[0]).includes(original.review_status));
  const priorClarifications=all(dom,n=>attr(n,'data-annual-ai-prior-clarification')===reading.record_id);assert.equal(priorClarifications.length,view.review?1:0);
  if(view.review){assert.equal(priorClarifications[0].tagName,'details');assert.equal(all(priorClarifications[0],n=>attr(n,'data-annual-case-review')===reading.record_id).length,1);}else {absent++;assert.equal(all(dom,n=>attr(n,'data-annual-case-review')===reading.record_id).length,0);}
  for(const change of view.aiChanges){const old=all(history[0],n=>attr(n,'data-annual-ai-prior')===change.path.join('.'));assert.equal(old.length,1);assert.equal(text(old[0]),change.prior);changes++;}
  for(const [i,section] of view.sections.entries()){
    const heading=all(dom,n=>attr(n,'id')===`${reading.record_id.toLowerCase()}-section-${i+1}`);assert.equal(heading.length,1);assert.equal(text(heading[0]),section.heading);
    assert.deepEqual(heading[0].parentNode.childNodes.filter(n=>n.tagName==='p').map(text),section.paragraphs);sections++;paragraphs+=section.paragraphs.length;
  }
  const checks=all(notices[0],n=>attr(n,'data-annual-ai-source-check')!==undefined);assert.equal(checks.length,view.aiSourceChecks.length);
  for(const check of view.aiSourceChecks){const entry=checks.find(n=>attr(n,'data-annual-ai-source-check')===check.id);for(const value of [check.finding,check.locator,check.access,check.checked_date])assert(text(entry).includes(value));assert(all(entry,n=>n.tagName==='a').some(n=>attr(n,'href')===check.url));}
  assert(all(notices[0],n=>n.tagName==='a').some(n=>attr(n,'href')===view.aiUpdateRoute));
  const receiptLinks=all(notices[0],n=>attr(n,'data-annual-ai-additional-input')!==undefined);assert.equal(receiptLinks.length,view.aiAdditionalInputs.length);
  for(const input of view.aiAdditionalInputs){
    const entry=receiptLinks.find(n=>attr(n,'data-annual-ai-additional-input')===input.id);
    for(const value of [input.relation,input.summary,input.checked_date,input.boundary,input.exact_next_artifact,input.next_action,input.next_check_date].filter(Boolean))assert(text(entry).includes(value));
    const limits=all(entry,n=>attr(n,'data-annual-ai-access-limits')!==undefined);assert.equal(limits.length,input.access_limits.length?1:0);
    if(limits.length)assert.deepEqual(all(limits[0],n=>n.tagName==='li').map(text),input.access_limits);
    const required=all(entry,n=>attr(n,'data-annual-ai-required-artifacts')!==undefined);assert.equal(required.length,input.required_artifacts.length?1:0);
    if(required.length){assert.equal(required[0].tagName,'details');assert.deepEqual(all(required[0],n=>n.tagName==='li').map(text),input.required_artifacts);}
    assert.equal(all(entry,n=>attr(n,'data-annual-ai-next-artifact')!==undefined).length,input.exact_next_artifact?1:0);
    accessLimits+=input.access_limits.length;requiredArtifacts+=input.required_artifacts.length;exactArtifacts+=Number(!!input.exact_next_artifact);
    assert(all(entry,n=>n.tagName==='a').some(n=>attr(n,'href')===input.route));
    const url=new URL(input.route,'https://ftfn.io'),target=await read(url.pathname+'index.html');assert(target.includes(input.id));
    if(url.hash){assert.equal(all(parse(target),n=>attr(n,'id')===decodeURIComponent(url.hash.slice(1))).length,1);receiptFragments++;}
    additional++;
  }
  const localLinks=all(notices[0],n=>attr(n,'data-annual-ai-local-input')!==undefined);assert.equal(localLinks.length,view.aiLocalInputs.length);
  for(const input of view.aiLocalInputs){const entry=localLinks.find(n=>attr(n,'data-annual-ai-local-input')===input.path);assert(text(entry).includes(input.relation));assert(all(entry,n=>n.tagName==='a').some(n=>attr(n,'href')===input.route));if(input.retained_as_of){assert(text(entry).includes(input.retained_as_of));assert.equal(all(entry,n=>attr(n,'data-retained-annual-input')!==undefined).length,1);}local++;}
  for(const id of original.source_ids)assert.equal(all(dom,n=>attr(n,'data-reader-source')===id).length,1);
  const ids=all(dom,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(ids.length,new Set(ids).size);assert.equal(all(dom,n=>n.tagName==='h1').length,1);
  for(const a of all(dom,n=>n.tagName==='a'&&attr(n,'href')?.startsWith('#')))assert(ids.includes(attr(a,'href').slice(1)));
  const index=catalog.records.findIndex(r=>r.id===reading.record_id),card=catalog.records[index];assert.equal(card.status,annualAiReviewStatus);assert.equal(card.date,availableDate);
  const browse=parse(await read(`reference/explore/${Math.floor(index/40)+1}/index.html`));assert(all(browse,n=>n.tagName==='article').some(n=>text(n).includes(card.title)&&text(n).includes(annualAiReviewStatus)&&text(n).includes(availableDate)));
  assert(all(method,n=>attr(n,'id')===`${decision.record_id}-annual-decision`).length===1);
  assert(all(method,n=>n.tagName==='a'&&attr(n,'href')===reading.route+'#'+reading.record_id+'-ai-review').length===1);
  const pageModifiedDate=canonicalAnnualBindings.records.some(r=>r.article_route===reading.route)?canonicalAnnualBindings.integration_date:availableDate;
  const sitemapEntry=sitemap.match(new RegExp('<url>\\s*<loc>https://ftfn\\.io'+reading.route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'</loc>[\\s\\S]*?</url>'))?.[0];assert(sitemapEntry?.includes(`<lastmod>${pageModifiedDate}</lastmod>`));
  assert(Buffer.byteLength(html)<160000,'Annual reading must remain within the reader budget');
}
for(const record of originals.records.filter(r=>!annualAiReadings.some(x=>x.reading.record_id===r.record_id))){const route=catalog.records.find(c=>c.id===record.record_id).route;assert(!all(parse(await read(route+'index.html')),n=>attr(n,'data-annual-ai-review')!==undefined).length,'Other readings inherit no AI decision');}
assert.deepEqual({sections,paragraphs,changes,additional,local,absent,accessLimits,requiredArtifacts,exactArtifacts,receiptFragments},{sections:326,paragraphs:470,changes:66,additional:20,local:7,absent:42,accessLimits:9,requiredArtifacts:9,exactArtifacts:17,receiptFragments:3});
console.log('Annual AI production verified: all 58 decisions on 70 exact readers; 326 sections/470 paragraphs and 66 current/prior corrections; 42 absent prior reviews, 20 additional receipt bindings, separate assessment/integration dates, complete original exports and exact catalog/method/sitemap. Other 34 readings inherit no annual acceptance. No browser/human observations claimed.');
