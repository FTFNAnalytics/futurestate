import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import {canonicalAnnualBindings as data,canonicalAnnualContext,canonicalAnnualGateContexts,canonicalAnnualRelatedReadings} from '../src/lib/canonical-annual-reader-bindings.mjs';
import {currentPortfolioSummary} from '../src/lib/current-named-dossiers.mjs';
import montanaDossiers from '../src/data/montana-project-dossiers.json' with {type:'json'};
import {annualAiPresentation} from '../src/lib/annual-ai-reviews.mjs';
import {evidenceReceiptsForRoute,namedFileEvidenceDecisions} from '../src/lib/current-evidence.mjs';
import readers from '../src/data/phase-204-reader-completion.json' with {type:'json'};
const read=route=>readFile(new URL('../dist'+route,import.meta.url),'utf8');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,test)=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
assert.deepEqual(JSON.parse(await read('/data/build-decisions.json')).canonical_annual_reader_bindings,data);
const sitemap=await read('/sitemap.xml'),method=await read('/method/portfolio-decisions/index.html');
for(const binding of data.records){
 const article=readers.records.find(r=>r.record_id===binding.article_record_id),view=annualAiPresentation(article,{route:binding.article_route});
 const html=await read(binding.target_route+'index.html'),dom=parse(html);
 assert.equal(all(dom,n=>n.tagName==='h1').length,1);
 const ids=all(dom,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(ids.length,new Set(ids).size);
 const notices=all(dom,n=>attr(n,'data-canonical-annual-binding')===binding.binding_id);assert.equal(notices.length,1);
 for(const value of [data.integration_date,binding.original_review_date,binding.correction_review_date,binding.identity_boundary,binding.current_status_boundary].filter(Boolean))assert(text(notices[0]).includes(value));
 assert.equal(all(notices[0],n=>attr(n,'data-annual-clarification-date')!==undefined).length,binding.correction_review_date?1:0);
 assert.equal(all(notices[0],n=>attr(n,'data-annual-assessment-only')!==undefined).length,binding.correction_review_date?0:1);
 const articles=all(dom,n=>attr(n,'data-reader-article')===article.record_id);assert.equal(articles.length,1);
 assert.equal(all(articles[0],n=>attr(n,'data-annual-ai-review')===article.record_id).length,1);
 assert(text(articles[0]).includes(view.aiReview.rationale));
 if(binding.prior_review_absent){assert.equal(all(articles[0],n=>attr(n,'data-annual-case-review')!==undefined).length,0);assert.equal(all(articles[0],n=>attr(n,'data-annual-ai-prior-clarification')!==undefined).length,0);}
 const sections=all(articles[0],n=>attr(n,'data-annual-reader-section')!==undefined);assert.equal(sections.length,3);
 for(const [i,section] of view.sections.entries()){
  assert.equal(text(all(sections[i],n=>n.tagName==='h2')[0]),section.heading);
  assert.deepEqual(sections[i].childNodes.filter(n=>n.tagName==='p').map(text),section.paragraphs);
 }
 for(const source of article.source_ids)assert.equal(all(articles[0],n=>attr(n,'data-reader-source')===source).length,1);
 const history=all(dom,n=>attr(n,'data-prior-atlas-account')===binding.atlas_record_id);assert.equal(history.length,1);assert.equal(history[0].tagName,'details');assert.equal(attr(history[0],'open'),undefined);
 assert.equal(all(history[0],n=>attr(n,'data-reader-article')!==undefined).length,0);
 assert.equal(all(dom,n=>attr(n,'data-recorded-conversion-stage')===binding.atlas_record_id).length,1);
 for(const receipt of evidenceReceiptsForRoute(binding.target_route)){
  assert.equal(all(dom,n=>attr(n,'data-evidence-receipt')===receipt.receipt_id).length,1);
  assert.equal(all(articles[0],n=>attr(n,'data-reader-source-review')===receipt.receipt_id).length,0);
 }
 const context=canonicalAnnualContext(binding),policy=all(dom,n=>attr(n,'data-related-policy-context')!==undefined);
 if(binding.context_role==='Related policy only'){
  assert.equal(policy.length,1);assert(text(policy[0]).includes(context.bounded_finding));assert(text(policy[0]).includes(context.evidence_boundary));assert(text(policy[0]).includes('Next policy check '+context.next_check_date));
  assert(!text(history[0]).includes('Next independent file check '+context.next_check_date));
 }else if(binding.context_role==='Independent site-licence follow-up'){
  assert.equal(policy.length,0);const latest=namedFileEvidenceDecisions(binding.named_file_id).at(-1);assert(text(history[0]).includes('Next independent file check '+latest.next_check_date));
  assert(!text(history[0]).includes('Next independent file check 2026-10-09'));
 }else{
  assert.equal(context,null);assert.equal(policy.length,0);assert(!text(history[0]).includes('Next independent file check'));
  const gates=canonicalAnnualGateContexts(binding),rows=all(notices[0],n=>attr(n,'data-annual-program-gate')!==undefined);assert.equal(rows.length,gates.length);
  assert.equal(all(notices[0],n=>attr(n,'data-annual-program-context')!==undefined).length,1);
  for(const gate of gates){const row=rows.find(n=>attr(n,'data-annual-program-gate')===gate.cycle_id);assert(row);assert.equal(attr(row,'data-annual-program-receipt'),gate.receipt.receipt_id);for(const value of [gate.label,gate.receipt.source_checked_date,gate.receipt.next_check_date,gate.receipt.decision_status.replaceAll('_',' ')])assert(text(row).includes(value));assert(all(row,n=>n.tagName==='a').some(n=>attr(n,'href')===gate.receipt.gate_route));}
  const related=canonicalAnnualRelatedReadings(binding);assert.equal(all(notices[0],n=>attr(n,'data-annual-related-dossiers')!==undefined).length,related.length?1:0);
  for(const link of related)assert(all(notices[0],n=>n.tagName==='a'&&attr(n,'href')===link.route).some(n=>text(n)===link.label));
 }
 const original=parse(await read(binding.article_route+'index.html'));
 assert.equal(all(original,n=>attr(n,'data-canonical-annual-return')===binding.binding_id).length,1);
 assert.equal(all(original,n=>attr(n,'data-annual-ai-review')===article.record_id).length,1);
 assert.equal(all(original,n=>attr(n,'data-canonical-annual-binding')!==undefined).length,0);
 const casebook=parse(await read(binding.prior_casebook_route+'index.html'));
 assert.equal(all(casebook,n=>attr(n,'data-canonical-annual-casebook')===binding.binding_id).length,1);
 for(const route of [binding.target_route,binding.article_route,binding.prior_casebook_route])assert(sitemap.includes('<loc>https://ftfn.io'+route+'</loc>\n    <lastmod>'+data.integration_date+'</lastmod>'));
 assert(method.includes('href="'+binding.target_route+'"'));
}
const montana=parse(await read('/atlas/projects/montana-bead/index.html')),inventory=all(montana,n=>attr(n,'data-montana-current-portfolio')!==undefined);assert.equal(inventory.length,1);
assert(text(inventory[0]).includes(currentPortfolioSummary.eligible_projects+' projects and '+currentPortfolioSummary.eligible_places+' places'));assert(!text(montana).includes('targets remain unfinished'));
assert.equal(all(montana,n=>attr(n,'data-montana-index')!==undefined).length,32);for(const record of montanaDossiers.records)assert(all(montana,n=>n.tagName==='a').some(n=>attr(n,'href')===record.route));
assert(sitemap.includes('<loc>https://ftfn.io/atlas/projects/montana-bead/</loc>\n    <lastmod>'+data.integration_date+'</lastmod>'));
console.log('Canonical annual production verified: five complete assessed readings, fifteen sections, original review dates and absent earlier clarifications, seven wording corrections, reciprocal links, six independent program follow-ups and separate policy/site appointments. Montana parent/32-child scopes and current 100/70 inventory retained without outcome or release admission.');
