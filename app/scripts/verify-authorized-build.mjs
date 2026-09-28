import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
import {montanaContextFor,montanaConnections} from '../src/lib/montana-dossiers.mjs';
import './verify-locality-dossiers.mjs';
import './verify-annual-ai-reviews.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>readFile(join(root,path),'utf8');
const json=async path=>JSON.parse(await read(path));
const data=await json('dist/data/build-decisions.json');
for(const [key,file] of [['policy','build-review-policy'],['adjudications','owner-authorized-adjudications'],['portfolio','portfolio-eligibility-decisions'],['montana_dossiers','montana-project-dossiers']])assert.deepEqual(data[key],await json(`src/data/${file}.json`));
const hub=await read('dist/atlas/projects/index.html');
const montanaHub=await read('dist/atlas/projects/montana-bead/index.html');
const catalog=await json('dist/data/reader-catalog.json');
const sitemap=await read('dist/sitemap.xml');
assert(sitemap.includes('<loc>https://ftfn.io/method/portfolio-decisions/</loc>'));
assert(sitemap.includes('<loc>https://ftfn.io/atlas/projects/montana-bead/</loc>'));assert(hub.includes('href="/atlas/projects/montana-bead/"'));
assert.equal((montanaHub.match(/data-montana-index=/g)??[]).length,32);
assert((hub.match(/class="record-card"/g)??[]).length<=50);assert(Buffer.byteLength(hub)<200000);assert(Buffer.byteLength(montanaHub)<200000);
for(const d of data.montana_dossiers.records){
 const html=await read(`dist${d.route}index.html`),text=decodeHtmlText(html);
 assert(html.includes(`data-montana-dossier="${d.record_id}"`));assert(montanaHub.includes(`href="${d.route}"`));
 assert(sitemap.includes(`<loc>https://ftfn.io${d.route}</loc>`));
 assert(text.includes(d.source_identity.uei));assert(text.includes(`CSV row ${d.source_identity.csv_row}`));
 for(const section of d.sections)assert(text.includes(section.text));
 assert(text.includes(d.sha256));assert(text.includes('no new source retrieval'));
 assert.equal((html.match(/<h1(?:\s|>)/g)??[]).length,1);
 const context=montanaContextFor(d,data.montana_dossiers),connections=montanaConnections(d,data.montana_dossiers);
 assert(text.includes(context.reporting_contract));assert(text.includes(context.cohort_kind));
 for(const r of connections.same_operator)assert(html.includes(`href="${r.route}"`));
 for(const link of connections.distinct_entity){assert(html.includes(`href="${link.record.route}"`));assert(text.includes(link.relation));}
 assert.equal(html.includes('data-montana-same-operator'),connections.same_operator.length>0);assert.equal(html.includes('data-montana-distinct-entity'),connections.distinct_entity.length>0);
 assert.equal(catalog.records.filter(r=>r.id===d.record_id).length,1);assert.equal(catalog.records.find(r=>r.id===d.record_id).route,d.route);
 const page=Math.floor(catalog.records.findIndex(r=>r.id===d.record_id)/40)+1;assert((await read(`dist/reference/explore/${page}/index.html`)).includes(`href="${d.route}"`));
 for(const artifact of d.next_artifacts)assert(text.includes(artifact));
 if(d.record_id==='CM61-BEAD-MT-4678')assert(text.includes('None recorded in the retained baseline')&&text.includes('21-anchor cohort')&&text.includes('zero-location denominator'));
 assert(Buffer.byteLength(html)<64000);assert(!/<script\b/i.test(html));
}
for(const d of [...data.portfolio.canonical,...data.portfolio.named_places,...data.portfolio.new_editorial_candidates]){
 const html=await read(`dist${d.route}index.html`),text=decodeHtmlText(html);
 assert.equal(html.split(`data-portfolio-decision="${d.record_id}"`).length-1,1);
 assert(text.includes(d.rationale));
}
const portfolio=await read('dist/method/portfolio-decisions/index.html');
assert.equal((portfolio.match(/data-portfolio-record=/g)??[]).length,103);
assert(!portfolio.includes('Dossier content remains to build.'));
console.log('Authorized production verification passed: exact decision export, 103 portfolio entries, 53 current determination notices, all 32 complete Montana dossier routes, dedicated index, catalog/sitemap links, 30 terrestrial/two LEO designations, anchor-only handling and distinct-entity/operator relationships.');
import './verify-selected-article-reviews.mjs';
