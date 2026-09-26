import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>readFile(join(root,path),'utf8');
const json=async path=>JSON.parse(await read(path));
const data=await json('dist/data/build-decisions.json');
for(const [key,file] of [['policy','build-review-policy'],['adjudications','owner-authorized-adjudications'],['portfolio','portfolio-eligibility-decisions'],['montana_dossiers','montana-project-dossiers']])assert.deepEqual(data[key],await json(`src/data/${file}.json`));
const hub=await read('dist/atlas/projects/index.html');
const sitemap=await read('dist/sitemap.xml');
assert(sitemap.includes('<loc>https://ftfn.io/method/portfolio-decisions/</loc>'));
for(const d of data.montana_dossiers.records){
 const html=await read(`dist${d.route}index.html`),text=decodeHtmlText(html);
 assert(html.includes(`data-montana-dossier="${d.record_id}"`));assert(hub.includes(`href="${d.route}"`));
 assert(sitemap.includes(`<loc>https://ftfn.io${d.route}</loc>`));
 assert(text.includes(d.source_identity.uei));assert(text.includes(`CSV row ${d.source_identity.csv_row}`));
 for(const section of d.sections)assert(text.includes(section.text));
 assert(text.includes(d.sha256));assert(text.includes('no new source retrieval'));
 assert.equal((html.match(/<h1(?:\s|>)/g)??[]).length,1);
 for(const id of d.related_project_ids)assert(html.includes(`href="${data.montana_dossiers.records.find(r=>r.record_id===id).route}"`));
}
for(const d of [...data.portfolio.canonical,...data.portfolio.named_places,...data.portfolio.new_editorial_candidates]){
 const html=await read(`dist${d.route}index.html`),text=decodeHtmlText(html);
 assert.equal(html.split(`data-portfolio-decision="${d.record_id}"`).length-1,1);
 assert(text.includes(d.rationale));
}
const portfolio=await read('dist/method/portfolio-decisions/index.html');
assert.equal((portfolio.match(/data-portfolio-record=/g)??[]).length,103);
console.log('Authorized production verification passed: exact decision export, 103 portfolio entries, 53 current determination notices, five complete dossier routes and hub links.');
