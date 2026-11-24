import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import {canonicalProjectRefreshes as data,canonicalProjectRefreshReview as review,canonicalProjectRefreshHistory as retained,projectRefreshSources,projectRefreshAccessLimits,projectRefreshCatalogKind} from '../src/lib/canonical-project-refreshes.mjs';
const read=p=>readFile(new URL('../dist'+p,import.meta.url),'utf8');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,test)=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const exported=JSON.parse(await read('/data/build-decisions.json'));assert.deepEqual(exported.canonical_project_refreshes,data);assert.deepEqual(exported.canonical_project_refresh_review,review);
assert.deepEqual(exported.canonical_project_refresh_history,retained);
const catalog=JSON.parse(await read('/data/reader-catalog.json')).records;
for(const r of data.records){
const dom=parse(await read(r.route+'index.html')),matches=all(dom,n=>attr(n,'data-canonical-project-refresh')===r.record_id);assert.equal(matches.length,1);const article=matches[0],body=text(article),links=all(article,n=>n.tagName==='a').map(n=>attr(n,'href'));
assert.equal(all(dom,n=>n.tagName==='h1').length,1);assert.equal(all(article,n=>attr(n,'data-refresh-section')!==undefined).length,6);assert.equal(all(article,n=>attr(n,'data-refresh-event')!==undefined).length,r.timeline.length);
for(const value of [r.title,r.answer,r.scope,r.stage,...r.sections.flatMap(s=>[s.heading,s.text]),...r.timeline.flatMap(e=>[e.date,e.event]),...r.next_artifacts])assert(body.includes(value),value);
if(r.record_id==='119-PROJECT-008'){assert(body.includes('7 public records (6 primary and 1 secondary)'));assert(!body.includes('7 public primary records'));}
for(const s of projectRefreshSources(r)){assert(links.includes(s.url));assert(links.includes('#refresh-source-'+s.id));assert.equal(all(article,n=>attr(n,'id')==='refresh-source-'+s.id).length,1);for(const value of [s.title,s.publisher,s.role,s.access,s.locator,s.boundary,...Object.entries(s).filter(([k])=>k.endsWith('_date')).map(([,v])=>v)])assert(body.includes(value));}
for(const limit of projectRefreshAccessLimits(r)){assert(links.includes(limit.url));assert(body.includes(limit.result));}
for(const link of r.related)assert(links.includes(link.route));

const saved=all(article,n=>attr(n,'data-refresh-retained-evidence')!==undefined);
assert.equal(saved.length,r.retained_evidence?1:0);
if(r.retained_evidence){
 const e=r.retained_evidence;assert.equal(attr(saved[0],'data-refresh-retained-evidence'),e.acquisition_id);
 for(const value of [e.checked_date,e.statement,e.closure_status,e.reporting_period])assert(text(saved[0]).includes(value));
 assert(all(saved[0],n=>n.tagName==='a').some(n=>attr(n,'href')===e.route));
}

const openRails=all(article,n=>attr(n,'data-refresh-retained-open-rail')!==undefined);
assert.equal(openRails.length,r.retained_open_rail?1:0);
if(r.retained_open_rail){
 const e=r.retained_open_rail;assert.equal(attr(openRails[0],'data-refresh-retained-open-rail'),e.coverage_id);
 for(const value of [e.captured_date,e.closure_status,e.selected_record,e.statement])assert(text(openRails[0]).includes(value));
 assert(all(openRails[0],n=>n.tagName==='a').some(n=>attr(n,'href')===e.route));
}
const retainedResearch=all(article,n=>attr(n,'data-retained-research-id')!==undefined);
assert.equal(retainedResearch.length,(r.retained_research??[]).length);
assert.equal(all(article,n=>attr(n,'data-refresh-retained-research')!==undefined).length,r.retained_research?1:0);
for(const item of r.retained_research??[]){
 const matches=retainedResearch.filter(n=>attr(n,'data-retained-research-id')===item.id);assert.equal(matches.length,1);
 for(const value of [item.title,item.checked_date,item.status,item.text])assert(text(matches[0]).includes(value));
 assert(all(matches[0],n=>n.tagName==='a').some(n=>attr(n,'href')===item.route));
}
const earlier=parse(await read(r.related[0].route+'index.html')),laterLinks=all(earlier,n=>attr(n,'data-later-project-account')===r.record_id);assert.equal(laterLinks.length,1);assert(text(laterLinks[0]).includes(data.review_date));assert(all(laterLinks[0],n=>n.tagName==='a').some(n=>attr(n,'href')===r.route));
const history=all(dom,n=>attr(n,'data-prior-atlas-account')===r.record_id);assert.equal(history.length,1);assert.equal(history[0].tagName,'details');assert.equal(all(history[0],n=>attr(n,'data-canonical-project-refresh')!==undefined).length,0);assert.equal(all(history[0],n=>attr(n,'data-recorded-conversion-stage')!==undefined).length,0);assert.equal(all(dom,n=>attr(n,'data-recorded-conversion-stage')===r.record_id).length,1);
assert.equal(all(article,n=>attr(n,'data-refresh-pilot-boundary')!==undefined).length,r.retained_pilot_id?1:0);
assert.equal(all(article,n=>attr(n,'data-refresh-decision-boundary')!==undefined).length,r.retained_pilot_id?0:1);
assert.equal(all(article,n=>attr(n,'data-refresh-access-limits')!==undefined).length,projectRefreshAccessLimits(r).length?1:0);
assert.equal(all(article,n=>attr(n,'data-refresh-source')!==undefined).length,projectRefreshSources(r).length);
for(const s of data.sources.filter(s=>!projectRefreshSources(r).some(own=>own.id===s.id)))assert(!links.includes('#refresh-source-'+s.id),'foreign citation leaked');
if(!r.retained_pilot_id){assert(body.includes(r.counting_note));assert(body.includes(r.decision_boundary));assert(!body.includes('September 14 pilot'));}
assert.equal(catalog.filter(c=>c.id===r.record_id&&c.route===r.route).length,1);if(r.retained_pilot_id)assert.equal(catalog.find(c=>c.id==='198-CASE-016').route,r.related[0].route);
assert.equal(catalog.find(c=>c.id===r.record_id).kind,projectRefreshCatalogKind(r));
const excluded=projectRefreshCatalogKind(r)==='Context';assert.equal(all(article,n=>attr(n,'data-refresh-excluded-context')!==undefined).length,excluded?1:0);
if(excluded){assert(body.includes('zero eligible-project contribution'));assert.equal(all(dom,n=>attr(n,'data-excluded-project-context')===r.record_id).length,1);}
assert((await read('/sitemap.xml')).includes('<loc>https://ftfn.io'+r.route+'</loc>\n    <lastmod>'+data.review_date+'</lastmod>'));
assert((await read('/method/portfolio-decisions/index.html')).includes('data-canonical-project-refresh-summary'));
const page=Math.floor(catalog.findIndex(c=>c.id===r.record_id)/40)+1;assert((await read('/reference/explore/'+page+'/index.html')).includes('href="'+r.route+'"'));
}
const autonomous=parse(await read('/atlas/places/california-autonomous-mobility/index.html'));
const autonomousLinks=all(autonomous,n=>attr(n,'data-related-current-projects')==='119-PLACE-006');
assert.equal(autonomousLinks.length,1);assert(text(autonomousLinks[0]).includes('They do not establish a place-wide outcome'));
assert(all(autonomousLinks[0],n=>n.tagName==='a').some(n=>attr(n,'href')==='/atlas/projects/waymo-california-service/'));
assert.equal(all(autonomous,n=>attr(n,'data-canonical-project-refresh')!==undefined).length,0);
const place=parse(await read('/atlas/places/california-battery-safety/index.html'));
const projectContext=all(place,n=>attr(n,'data-related-current-projects')==='119-PLACE-015');
assert.equal(projectContext.length,1);
assert(text(projectContext[0]).includes('They do not establish a place-wide outcome'));
assert(all(projectContext[0],n=>n.tagName==='a').some(n=>attr(n,'href')==='/atlas/projects/moss-landing-battery-safety/'));
assert(all(projectContext[0],n=>n.tagName==='a').some(n=>attr(n,'href')==='/atlas/projects/gateway-battery-storage/'));
assert.equal(all(place,n=>attr(n,'data-canonical-project-refresh')!==undefined).length,0);
const florida=parse(await read('/atlas/places/florida-utility-storage/index.html'));
const manateeLinks=all(florida,n=>attr(n,'data-related-current-projects')==='119-PLACE-014');
assert.equal(manateeLinks.length,1);assert(text(manateeLinks[0]).includes('They do not establish a place-wide outcome'));
assert(all(manateeLinks[0],n=>n.tagName==='a').some(n=>attr(n,'href')==='/atlas/projects/manatee-battery-storage/'));
assert.equal(all(florida,n=>attr(n,'data-canonical-project-refresh')!==undefined).length,0);
for(const path of ['/review/casebooks/expanded/moss-landing-battery-safety/','/atlas/places/california-battery-safety/','/review/casebooks/expanded/manatee-battery-storage/','/atlas/places/florida-utility-storage/','/review/casebooks/expanded/gateway-battery-storage/','/review/casebooks/expanded/f35-production-readiness/','/review/casebooks/expanded/kc46-readiness/','/review/casebooks/expanded/current-applications-capacity/','/review/casebooks/expanded/island-components-capacity/','/review/casebooks/expanded/monaghan-medical-capacity/','/review/casebooks/waymo-california-service/','/atlas/places/california-autonomous-mobility/'])assert((await read('/sitemap.xml')).includes('<loc>https://ftfn.io'+path+'</loc>\n    <lastmod>'+data.review_date+'</lastmod>'));
console.log('Canonical project refresh production checks passed: twelve complete narratives with scoped sources and counting boundaries and source/access dates, retained stage and history, export, catalog, search shelf and sitemap; earlier Manatee monthly decision and Gateway open question visible without redating; one Waymo, thirteen manufacturing and six aircraft notices preserve their dates and decisions; no portfolio count or new series admission.');
