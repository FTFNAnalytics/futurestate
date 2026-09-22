import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readShelfInputs,expectedShelfMembership} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {verifyUpdateArchive,decodeHtmlText} from './lib/verify-update-archive.mjs';
import {atlasShelfRelations,atlasShelfKey} from '../src/lib/atlas-shelf-relations.mjs';
import {readingShelfRelations} from '../src/lib/reading-shelf-relations.mjs';
import {countInitialResultCards} from './lib/count-initial-result-cards.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=path=>readFile(join(root,path),'utf8');
const input=await readShelfInputs(root),ledger=JSON.parse(await read('src/data/phase-206-editorial-classification.json'));
const operations=JSON.parse(await read('src/data/phase-207-current-operations.json'));
const expected=expectedShelfMembership(input,ledger),data=createShelfData(input,ledger,operations),sitemap=await read('dist/sitemap.xml');
const budget=(html,route)=>{assert(countInitialResultCards(html)<=50,`${route}: initial results exceed 50`);assert(Buffer.byteLength(html)<200000,`${route}: HTML exceeds 200 kB`);};
const stagedRoutes=new Map([
 ...input.signals.map(r=>[`/signals/${r.slug}/`,r]),...input.briefings.map(r=>[`/briefings/${r.slug}/`,r]),...input.dependencyMaps.map(r=>[`/atlas/dependency-maps/${r.slug}/`,r]),...input.readerPathways.map(r=>[`/pathways/${r.slug}/`,r])
]);
const indexing=(html,route)=>{
 const record=stagedRoutes.get(route),indexed=!record||record.record_status==='Published';
 assert.equal(sitemap.includes(`<loc>https://ftfn.io${route}</loc>`),indexed,`${route}: publication-scoped sitemap membership`);
 if(record)assert(html.includes(`<meta name="robots" content="${indexed?'index':'noindex'}, follow"`),`${route}: retained indexing boundary`);
};
for(const[kind,ids]of Object.entries(expected)){
  const exported=JSON.parse(await read(`dist/data/shelves/${kind}.json`)).records;
  const expectedRows=data.shelves[kind];
  assert.equal(exported.length,expectedRows.length,`${kind}: rendered membership count`);
  for(const [index,row] of expectedRows.entries())assert.deepEqual(exported[index],row,`${kind}/${row.id}: rendered search metadata and ordering`);
  const seen=[];
  for(let page=1;page<=Math.max(1,Math.ceil(ids.length/40));page++){
    const route=`/browse/${kind}/${page}/`,html=await read(`dist${route}index.html`);
    const found=[...html.matchAll(/data-shelf-card="([^"]+)"/g)].map(m=>m[1]);assert(found.length<=40);seen.push(...found);budget(html,route);
    assert(sitemap.includes(`https://ftfn.io${route}`));assert(html.includes(`data-paged-shelf="${kind}"`));
  }
  assert.deepEqual(seen.sort(),[...ids].sort(),`${kind}: every member exactly once across static pages`);
}
for(const route of ['/briefings/','/updates/','/atlas/source-monitor/',...input.topics.map(t=>`/atlas/topics/${t.slug}/`),...input.localSystems.map(s=>`/atlas/local-systems/${s.slug}/`),...input.readerPathways.map(p=>`/pathways/${p.slug}/`)]){const html=await read(`dist${route}index.html`);budget(html,route);if(route.startsWith('/pathways/'))indexing(html,route);}
for(const route of ['/atlas/','/atlas/sources/','/atlas/source-coverage/'])budget(await read(`dist${route}index.html`),route);
for(const archive of atlasShelfRelations(input)){
 const html=await read(`dist${archive.route}index.html`);budget(html,archive.route);assert(html.includes(`data-paged-shelf="${archive.key}"`));indexing(html,archive.route);
 if(!archive.key.startsWith('atlas-maps-'))assert(html.includes(`data-atlas-relationships="${archive.key}"`));
}
for(const archive of readingShelfRelations(input)){
 const html=await read(`dist${archive.route}index.html`);budget(html,archive.route);
 if(archive.members.length){assert(html.includes(`data-reading-relationships="${archive.key}"`));assert(html.includes(`data-paged-shelf="${archive.key}"`));}
 indexing(html,archive.route);
}
for(const s of input.signals){const route=`/signals/${s.slug}/`,html=await read(`dist${route}index.html`);budget(html,route);indexing(html,route);}
for(const d of input.dependencyMaps){
 const raw=await read(`dist/atlas/dependency-maps/${d.slug}/index.html`),html=decodeHtmlText(raw);assert(raw.includes(`data-atlas-graph="${atlasShelfKey('graph',d.id)}"`));
 for(const value of [d.map_question,d.interpretation_boundary,...d.what_this_map_supports,...d.what_this_map_does_not_prove,...d.next_records_needed])assert(html.includes(value),`Missing complete map boundary ${d.id}`);
}
const mapIndex=await read('dist/atlas/dependency-maps/index.html'),anchor=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
for(const d of input.dependencyMaps){assert(mapIndex.includes(`id="type-${anchor(d.map_type)}"`));assert(mapIndex.includes(`id="topic-${anchor(d.primary_topic)}"`));}
for(const p of input.readerPathways){
  const route=`/pathways/${p.slug}/`,html=decodeHtmlText(await read(`dist${route}index.html`));
  for(const text of [p.title,p.summary,p.current_state_summary,...p.current_state,...p.evidence_limits,...p.next_records])assert(html.includes(text),`Missing preserved pathway field ${p.id}`);
  for(const stage of p.dependency_stack)for(const text of [stage.stage,stage.current_state,stage.boundary])assert(html.includes(text),`Missing dependency-stage field ${p.id}`);
  indexing(html,route);
}
for(const s of input.localSystems){
  const html=await read(`dist/atlas/local-systems/${s.slug}/index.html`);
  for(const p of input.readerPathways.filter(p=>p.local_system_ids.includes(s.id)))assert(html.includes(`/pathways/${p.slug}/`),`Missing compact pathway ${s.id}/${p.id}`);
  const raw=await read(`src/content/local-systems/${s.id}.mdx`);
  for(const heading of [...raw.matchAll(/^## (.+)$/gm)].map(m=>m[1].trim()))assert(decodeHtmlText(html).includes(heading),`Preserved local narrative heading ${s.id}: ${heading}`);
}
for(const t of input.topics){const html=await read(`dist/atlas/topics/${t.slug}/index.html`);for(const p of input.readerPathways.filter(p=>p.topic_ids.includes(t.id)))assert(html.includes(`/pathways/${p.slug}/`));}
const updateCount=await verifyUpdateArchive({appRoot:root});
for(const u of input.updates)assert(sitemap.includes(`https://ftfn.io/updates/${u.id}/`));
console.log(`Production navigation verified: ${Object.keys(expected).length} complete shelves; complete Atlas, briefing and signal relationship archives; 17 topic and 5 local overviews; 15 complete pathways; ${updateCount} full update receipts; publication-scoped sitemap membership, <=50 initial results and <200 kB page budgets. Actual reader/assistive-technology trials remain separate.`);
