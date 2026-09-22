import assert from 'node:assert/strict';
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname,join,resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'parse5';
import {computeV1refCandidateDigest,isValidV1refValidationReceipt} from './lib/v1ref-candidate-digest.mjs';
import {historicalPathRepairs} from '../src/lib/canonical-content-paths.mjs';

// Read-only static route inventory; generated review artifacts are not clearance.
// No browser actions, source fetching, release-scope changes or approvals.
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const app=join(root,'app'),dist=join(app,'dist');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const json=async path=>JSON.parse(await readFile(join(app,path),'utf8'));
const aggregate=await json('src/data/v1-public-reference-edition.json');
const resultsPath=process.argv[2];
assert(resultsPath,'Pass the terminal validation results.json for this candidate.');
const run=JSON.parse(await readFile(resolve(resultsPath),'utf8'));
for(const script of ['current:generate','current:validate']){
 const result=run.results?.find(r=>r.script===script);
 assert(result&&result.exit_code===0&&result.finished_at,`Missing successful terminal result for ${script}`);
}
const candidate=await computeV1refCandidateDigest({appRoot:app});
assert.equal(candidate.digest,aggregate.local_validation_receipt?.artifact_digest,'Run full candidate validation before inventorying its final output.');
assert(isValidV1refValidationReceipt({receipt:aggregate.local_validation_receipt,aggregate,candidateDigest:candidate}),'Invalid current candidate receipt.');
const validationLog=await readFile(run.results.find(r=>r.script==='current:validate').log,'utf8');
assert(validationLog.includes(candidate.digest)&&validationLog.includes(aggregate.local_validation_receipt.receipt_id),'Terminal validation log does not bind this candidate and receipt.');
const corpus=await json('src/data/phase-205-216-current-editorial.json');
assert.deepEqual(await json('dist/data/current-editorial.json'),corpus,'Built reader data differs from current source.');
assert.deepEqual(await json('dist/data/current-operations.json'),await json('src/data/phase-207-current-operations.json'),'Built operations differ from source.');
const ledger=await json('src/data/phase-206-editorial-classification.json');
const classifications=new Map(ledger.records.map(r=>[`/signals/${r.slug}/`,r]));
const files=[];
async function walk(path){for(const entry of await readdir(path,{withFileTypes:true})){const full=join(path,entry.name);if(entry.isDirectory())await walk(full);else if(entry.isFile())files.push(full);}}
await walk(dist);
const routeOf=path=>{const route='/'+relative(dist,path).replaceAll('\\','/');return route.endsWith('/index.html')?route.slice(0,-10):route;};
const html=new Map(files.filter(p=>p.endsWith('.html')).map(p=>[routeOf(p),p]));
const localFiles=new Set(files.map(p=>'/'+relative(dist,p).replaceAll('\\','/')));
const origin='https://ftfn.io';
const originalAudit=JSON.parse(await readFile(join(root,'docs/audits/2026-09-09-audit-evidence.json'),'utf8'));
const originalBroken=originalAudit.output_audit.brokenTargets.map(r=>r.target).sort();
assert.equal(originalBroken.length,16);
assert.deepEqual(Object.keys(historicalPathRepairs).sort(),originalBroken,'Repairs differ from the exact original independent audit cohort.');
const historicalLinks=[];
for(const original of originalBroken){
 const repaired=historicalPathRepairs[original],url=new URL(repaired,origin),target=html.get(url.pathname);
 assert(target,`Original audit repair is missing: ${original} -> ${repaired}`);
 const raw=await readFile(target,'utf8');
 if(url.hash)assert(raw.includes(`id="${url.hash.slice(1)}"`),`Missing repaired anchor: ${repaired}`);
 historicalLinks.push({original,repaired,rendered_sha256:hash(raw),result:'Target and required anchor exist'});
}
function inspect(raw,base){
 const internal=new Set(),downloads=new Set(),external=new Set(),terminal=new Set(),missing=new Set();let title='';
 const document=parse(raw);let effectiveBase=origin+base,baseFound=false;
 function findBase(node){
  if(!baseFound&&node.tagName==='base'){
   const href=node.attrs.find(a=>a.name==='href')?.value;
   if(href){try{const resolved=new URL(href,effectiveBase);if(['https:','http:'].includes(resolved.protocol)){effectiveBase=resolved.href;baseFound=true;}}catch{}}
  }
  for(const child of node.childNodes??[])findBase(child);
 }
 findBase(document);
 const text=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
 function visit(node){
  if(node.tagName==='title')title=text(node).trim();
  if(node.tagName==='a'){
   const href=node.attrs.find(a=>a.name==='href')?.value;
   if(href){
    let url;try{url=new URL(href,effectiveBase);}catch{missing.add(href);}
    if(url&&['https:','http:'].includes(url.protocol)){
     if(url.origin!==origin)external.add(url.href);
     else{
      let path;try{path=decodeURIComponent(url.pathname);}catch{missing.add(href);}
      if(path){const normalized=path.endsWith('/index.html')?path.slice(0,-10):path;const resolved=html.has(normalized)?normalized:html.has(normalized+'/')?normalized+'/':null;
       if(resolved){if(node.attrs.some(a=>a.name==='download'))downloads.add(resolved);else internal.add(resolved);}else if(localFiles.has(path))terminal.add(path);else missing.add(path);
      }
     }
    }
   }
  }
  for(const child of node.childNodes??[])visit(child);
 }
 visit(document);return {title,effective_base:effectiveBase,internal:[...internal].sort(),downloads:[...downloads].sort(),external:[...external].sort(),terminal:[...terminal].sort(),missing:[...missing].sort()};
}
// Actual parser fixtures cover entity decoding, relative paths, fragments and
// external links. Query strings and anchors do not create fictitious new pages.
const fixture=inspect('<title>A &amp; B</title><a href="/reference/explore/1/?q=x#main">x</a><a href="https://example.org/?a=1&amp;b=2">e</a>','/');
assert.equal(fixture.title,'A & B');assert(fixture.internal.includes('/reference/explore/1/'));assert.deepEqual(fixture.external,['https://example.org/?a=1&b=2']);
assert.deepEqual(inspect('<base href="https://example.org/archive/"><a href="../source">source</a>','/').external,['https://example.org/source']);
const downloadFixture=inspect('<a href="/reference/explore/1/" download>download</a>','/');
assert.deepEqual(downloadFixture.internal,[]);assert.deepEqual(downloadFixture.downloads,['/reference/explore/1/']);
const reached=new Map(),queue=[];
for(const article of corpus.records){assert(html.has(article.route),`Missing selected route ${article.route}`);if(!reached.has(article.route)){reached.set(article.route,{depth:0,parent:null,selected_record_id:article.record_id});queue.push(article.route);}}
const records=[],downloadLinks=new Map();let edges=0;
for(let i=0;i<queue.length;i++){
 const route=queue[i],bytes=await readFile(html.get(route)),page=inspect(bytes.toString('utf8'),route),arrival=reached.get(route);
 const retainedArtifact=route.startsWith('/downloads/');
 if(!retainedArtifact)assert.equal(page.missing.length,0,`Unresolved application anchor at ${route}: ${page.missing.join(', ')}`);
 for(const target of page.internal)if(!reached.has(target)){reached.set(target,{depth:arrival.depth+1,parent:route,selected_record_id:null});queue.push(target);}
 for(const target of page.downloads){if(!downloadLinks.has(target))downloadLinks.set(target,[]);downloadLinks.get(target).push(route);}
 const classification=classifications.get(route);
 records.push({route,title:page.title,html_sha256:hash(bytes),bytes:bytes.length,...arrival,page_kind:retainedArtifact?'Retained HTML reached by an ordinary anchor':'Application HTML page',effective_base:page.effective_base,local_html_targets:page.internal,html_download_targets:page.downloads,external_targets:page.external,terminal_local_files:page.terminal,unresolved_local_anchors:page.missing,signal_classification_id:classification?.id??null,signal_has_dated_correction:classification?Boolean(classification.correction):null,current_feed_excluded:classifications.has(route),claim_review:'Pending; static reachability does not establish factual clearance',independent_reviewer:null,release_scope_decision:null});
 edges+=page.internal.length;
 if((i+1)%2000===0)console.log(`Inventoried ${i+1} reachable HTML pages; ${queue.length} discovered.`);
}
records.sort((a,b)=>a.depth-b.depth||a.route.localeCompare(b.route));
const downloadedArtifacts=[];
for(const [route,parents]of [...downloadLinks].sort(([a],[b])=>a.localeCompare(b))){
 const bytes=await readFile(html.get(route)),page=inspect(bytes.toString('utf8'),route);
 downloadedArtifacts.push({route,title:page.title,html_sha256:hash(bytes),bytes:bytes.length,download_from_pages:parents.sort(),also_reached_by_ordinary_navigation:reached.has(route),unresolved_if_served_as_site_html:page.missing,interpretation:'The incoming same-origin anchor requests download. Internal links are a conditional saved-document inspection, not traversed site navigation or a demonstrated reader-interface failure.',claim_review:'Pending',independent_reviewer:null,release_scope_decision:null});
}
const unreachable=[...html.keys()].filter(route=>!reached.has(route)&&!downloadLinks.has(route)).sort();
const summary={candidate_digest:candidate.digest,validation_receipt:aggregate.local_validation_receipt.receipt_id,selected_records:corpus.records.length,selected_unique_routes:records.filter(r=>r.depth===0).length,reachable_html_pages:records.length,discovered_html_pages:html.size,static_html_edges:edges,reachable_classified_signals:records.filter(r=>r.current_feed_excluded).length,reachable_corrected_signals:records.filter(r=>r.signal_has_dated_correction).length,reachable_research_documents:records.filter(r=>r.route.startsWith('/research/documents/')).length,reachable_briefings:records.filter(r=>r.route.startsWith('/briefings/')&&r.route!=='/briefings/').length,max_depth:Math.max(...records.map(r=>r.depth)),unreachable_html_pages:unreachable.length,independent_approvals:0,scope_approved:false};
summary.reachable_application_html_pages=records.filter(r=>!r.route.startsWith('/downloads/')).length;
summary.navigable_retained_html_artifacts=records.filter(r=>r.route.startsWith('/downloads/')).length;
summary.linked_html_downloads=downloadedArtifacts.length;
summary.unresolved_application_anchor_targets=0;
summary.conditional_artifact_targets_if_served_as_site_html=new Set(downloadedArtifacts.flatMap(r=>r.unresolved_if_served_as_site_html)).size;
const output=join(root,'docs/release-reviews/2026-09-22');await mkdir(output,{recursive:true});
const diagnosticDir=join(root,'outputs/release-reviews/2026-09-22',candidate.digest);await mkdir(diagnosticDir,{recursive:true});
const diagnosticPath=join(diagnosticDir,'reachability-download-aware.json');
const preparedAt=new Date().toISOString();
const diagnostic=JSON.stringify({prepared_at:preparedAt,...summary,validation_results:resolve(resultsPath),method:'Breadth-first traversal of ordinary static HTML anchors from the 33 selected articles, including navigation, collapsed material and pagination. Same-origin download anchors are terminal, including HTML files; downloaded artifact interiors are inspected separately and never traversed as application navigation. External URLs and non-HTML files are terminal. Actual base elements are honored. Dynamic-only interactions, JSON-contained routes and file-local navigation are not inferred. Every ordinary route records its shortest parent path and rendered hash.',supersedes_diagnostic:'The earlier reachability.json treated download anchors as normal navigation. Its bytes are preserved; this diagnostic corrects the interpretation without changing site source or archived artifacts.',records,downloaded_html_artifacts:downloadedArtifacts,unreachable_routes:unreachable},null,2)+'\n';
await writeFile(diagnosticPath,diagnostic);
await writeFile(join(output,'reachability-summary.json'),JSON.stringify({prepared_at:preparedAt,...summary,validation_results:resolve(resultsPath),diagnostic_path:diagnosticPath,diagnostic_sha256:hash(diagnostic),diagnostic_bytes:Buffer.byteLength(diagnostic),historical_link_regression:historicalLinks},null,2)+'\n');
const direct=records.filter(r=>r.depth===1);
const escape=value=>String(value).replaceAll('|','\\|').replaceAll('\n',' ');
await writeFile(join(output,'reachability.md'),`# Reachable release material — September 22, 2026

Candidate \`${candidate.digest}\`; receipt \`${summary.validation_receipt}\`. This is a static-link inventory, not independent claim review or an approved release scope.

The 33 selected articles lead to **${records.length} HTML pages** through ordinary static navigation (${edges} page-to-page links). This includes ${summary.reachable_research_documents} research-document routes and ${summary.reachable_briefings} briefing routes. ${summary.reachable_classified_signals} reached signal pages retain feed exclusions, including ${summary.reachable_corrected_signals} with dated corrected presentations; an exclusion from the feed does not make the detail URL unreachable.

Selecting 33 articles does not isolate the hosted site to those articles. Review the reached historical claims or obtain an explicit scope decision before release; this inventory does neither and does not waive full-v1 requirements.

[Exact route hashes, parent paths and links](<${diagnosticPath.replaceAll('\\','/')}>). The full diagnostic is retained in local outputs rather than inflating the source repository. Its SHA-256 is \`${hash(diagnostic)}\`; [the compact tracked summary](<${join(output,'reachability-summary.json').replaceAll('\\','/')}>) binds its size and validation run. Reproduce with \`node app/scripts/build-release-reachability.mjs <terminal-results.json>\` after successful validation. Each parent chain leads back to a selected article. ${unreachable.length} other generated HTML pages were not reached by this static traversal; that is not proof of inaccessibility.

## Scope and limits

Ordinary anchor links in the parsed HTML were included, even in navigation and collapsed details. Same-origin anchors with the download attribute are recorded as terminal downloads, including HTML files; their interiors are not traversed as site navigation. Query strings and fragments do not create separate pages. External URLs and non-HTML local files are terminal; their content and JSON-contained routes need separate review. Dynamic-only links, actual browser download completion and assistive-technology behavior were not tested. No reviewer or disposition was invented.

The ordinary-navigation set includes ${summary.reachable_application_html_pages} application pages and ${summary.navigable_retained_html_artifacts} retained HTML artifacts. A separate ${summary.linked_html_downloads} HTML files are linked with download markup. Their saved source menus would have ${summary.conditional_artifact_targets_if_served_as_site_html} distinct unresolved targets if served as site HTML, but the reader document template already requests a download and offers a separate original-source link. This is not an established application-navigation defect and does not require rewriting preserved source bytes. Source-content review remains pending. The earlier diagnostic counted these download links as ordinary navigation; its bytes remain saved and this report corrects that interpretation. Actual HTML base elements are honored. Edge counts are distinct source/target pairs, not repeated anchors.

All 16 repaired targets were compared against the exact broken-path list in the independent September 9 audit, not merely a count. Every current canonical target and required anchor exists; the summary pins its rendered hash. This is a local regression of that historical audit, not a new independent review or hosted rewrite test. The full validation separately checks generated application-local href/src targets, excluding downloaded third-party HTML interiors.

## Directly linked HTML outside the selected 33

${direct.length} one-hop routes are listed to start the review; the JSON retains the entire transitive set.

| Route | Page title | Feed exclusion |
| --- | --- | --- |
${direct.map(r=>`| \`${r.route}\` | ${escape(r.title)} | ${r.current_feed_excluded?'Yes; still reachable':'Not an exclusion determination'} |`).join('\n')}
`);
console.log(JSON.stringify(summary,null,2));
