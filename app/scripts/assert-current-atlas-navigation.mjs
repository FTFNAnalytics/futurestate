import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {readShelfInputs,expectedShelfMembership} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {atlasGraphShelf,atlasShelfRelations} from '../src/lib/atlas-shelf-relations.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const input=await readShelfInputs(root),ledger=JSON.parse(await read('src/data/phase-206-editorial-classification.json')),operations=JSON.parse(await read('src/data/phase-207-current-operations.json'));
const before=JSON.stringify(input),{shelves}=createShelfData(input,ledger,operations),expected=expectedShelfMembership(input,ledger),archives=atlasShelfRelations(input);
assert.equal(JSON.stringify(input),before);
assert.equal(archives.length,1052);assert.equal(Object.keys(shelves).filter(k=>k.startsWith('atlas-')).length,1230);
for(const [key,rows]of Object.entries(shelves).filter(([key])=>key.startsWith('atlas-'))){assert.deepEqual(rows.map(r=>r.id).sort(),[...expected[key]].sort());assert.equal(rows.length,new Set(rows.map(r=>r.id)).size);}
const held=new Map(ledger.records.map(r=>[r.id,r]));
for(const a of archives){
 const byId=new Map(a.members.map(r=>[r.id,r]));
 for(const card of shelves[a.key]){
  const member=byId.get(card.id);assert.deepEqual(card.filters.relationship,member.relationships);
  if(held.has(card.id)){const review=held.get(card.id);assert(card.filters.kind.includes('Classification archive'));assert.equal(card.title,review.claim_review_complete?(review.correction?.title??review.prior.title):`Under review: ${review.prior.title}`);assert.equal(review.current_feed_eligible,false);}
 }
 const rows=shelves[a.key];for(const i of new Set([0,Math.floor(rows.length/2),rows.length-1]))if(rows[i])assert(searchShelf(rows,{q:rows[i].title}).some(r=>r.id===rows[i].id));
}
for(const s of input.sources){const rows=shelves[`atlas-source-${s.id}`];for(const d of input.documents){const card=rows.find(r=>r.id===d.id);if(d.source_id===s.id)assert(card.filters.relationship.includes('Primary source reference'));if((d.supporting_source_ids??[]).includes(s.id))assert(card.filters.relationship.includes('Supporting source reference'));}}
for(const t of input.technologies){const rows=shelves[`atlas-technology-${t.id}`];for(const s of input.signals){const card=rows.find(r=>r.id===s.id),shared=s.source_ids.some(id=>t.source_ids.includes(id)),topic=t.primary_topics.includes(s.primary_topic);if(shared)assert.deepEqual(card.filters.relationship,['Shared source — not proof of deployment']);else if(topic)assert.deepEqual(card.filters.relationship,['Topic match only — not an explicit technology citation']);else assert(!card);}}
for(const g of input.evidenceGaps){const rows=shelves[`atlas-gap-${g.id}`];for(const s of input.signals){const card=rows.find(r=>r.id===s.id);if(g.related_signal_ids.includes(s.id))assert(card.filters.relationship.includes('Signal named by evidence-gap record'));if((s.evidence_gap_ids??[]).includes(g.id))assert(card.filters.relationship.includes('Signal cites evidence-gap ID'));}}
let nodeRows=0,linkRows=0;
for(const d of input.dependencyMaps){
 const rows=shelves[`atlas-graph-${d.id}`];assert.equal(rows.length,d.nodes.length+d.links.length);nodeRows+=d.nodes.length;linkRows+=d.links.length;
 d.nodes.forEach((n,i)=>{const r=rows[i];assert.equal(r.id,`atlas-graph-${d.id}-node-${i+1}-${n.id}`);assert.equal(r.summary,n.note);assert.deepEqual(r.filters.type,[n.node_type]);assert(r.facts.some(f=>f.value===`${n.id}: ${n.label}`));assert(r.facts.some(f=>f.label==='Linked record'&&f.value===(n.record_id??'Concept only — no record ID')));});
 d.links.forEach((l,i)=>{const r=rows[d.nodes.length+i];assert.equal(r.summary,l.note);assert.deepEqual(r.filters.type,[l.relationship]);assert.deepEqual(r.filters.confidence,[l.confidence]);assert(r.facts.some(f=>f.label==='From node'&&f.value.startsWith(l.from+':')));assert(r.facts.some(f=>f.label==='To node'&&f.value.startsWith(l.to+':')));});
}
const repeated=input.dependencyMaps.find(d=>d.id==='dependency-map-autonomy-rules-are-not-service');assert.equal(repeated.nodes.length,14);assert.equal(new Set(repeated.nodes.map(n=>n.id)).size,10);assert.equal(repeated.links.length,16);assert.equal(new Set(repeated.links.map(l=>JSON.stringify(l))).size,10);
const duplicateRows=shelves[`atlas-graph-${repeated.id}`];assert.equal(duplicateRows.filter(r=>r.filters.kind.includes('Map node')&&r.facts.some(f=>f.value.startsWith('3 repeated identical node rows'))).length,6);assert.equal(duplicateRows.filter(r=>r.filters.kind.includes('Map relationship')&&r.facts.some(f=>f.value.startsWith('3 repeated identical link rows'))).length,9);
const synthetic={id:'test',slug:'test',captured_date:new Date('2026-09-15'),record_status:'In Review',nodes:[{id:'duplicate',label:'First',note:'Original first',node_type:'Concept'},{id:'duplicate',label:'Second',note:'Original second',node_type:'Concept'}],links:[{from:'duplicate',to:'duplicate',relationship:'Depends On',confidence:'Watch',note:'No selection'}]};
const tested=atlasGraphShelf(synthetic,new Map());assert.equal(tested[0].date,'2026-09-15');assert.equal(tested[2].title,'First / Second → First / Second');assert(tested[2].facts.filter(f=>f.label.endsWith('node')).every(f=>f.value.includes('Ambiguous ID: 2 different node rows')));
assert.throws(()=>atlasGraphShelf({...synthetic,links:[{...synthetic.links[0],to:'missing'}]},new Map()),/Unresolved Atlas graph endpoint/);
assert.throws(()=>atlasGraphShelf({...synthetic,nodes:[{...synthetic.nodes[0],record_id:'unknown'}]},new Map()),/Unresolved Atlas node/);
assert.throws(()=>createShelfData({...input,dependencyMaps:[...input.dependencyMaps,{...input.dependencyMaps[0],id:'test-only-map',slug:'test-only-map',source_ids:['missing-source']}]},ledger),/Unresolved Atlas membership/);
for(const [file,kind,variable]of [['sources/[id].astro','source','source'],['organizations/[slug].astro','organization','organization'],['technologies/[slug].astro','technology','technology'],['evidence-gaps/[slug].astro','gap','gap'],['dependency-maps/[slug].astro','map','dependencyMap']]){
 const raw=await read('src/pages/atlas/'+file);assert(raw.includes(`<AtlasRelationshipShelf kind="${kind}" id={${variable}.data.id}/>`));assert(!/\{(?:relatedSources|relatedSignals|relatedBriefings|researchDocuments)\.map\(/.test(raw));
}
const graphTemplate=await read('src/pages/atlas/dependency-maps/[slug].astro');assert(graphTemplate.includes('kind={graphKind} limit={20}'));assert(!/dependencyMap\.data\.(nodes|links)\.map\(/.test(graphTemplate.split('---')[2]));
const shelf=await read('src/components/atlas/AtlasRelationshipShelf.astro');assert(shelf.includes('limit={20}'));assert(shelf.includes('Historical methods and research dockets'));
const sourceIndex=await read('src/pages/atlas/sources/index.astro');assert(sourceIndex.includes('<PagedShelf records={shelves.sources}'));assert(!sourceIndex.includes('sourceRows.map('));
const mapIndex=await read('src/pages/atlas/dependency-maps/index.astro');assert(mapIndex.includes('kind="atlas-maps-all"'));assert(mapIndex.includes('id={`type-${anchor(g.label)}`}'));assert(mapIndex.includes('id={`topic-${anchor(g.label)}`}'));
const atlas=await read('src/pages/atlas/index.astro');assert(atlas.includes('dependencyMaps.slice(0,6)'));assert(atlas.includes('organizations.slice(0,3)'));assert(atlas.includes('technologies.slice(0,3)'));assert(!atlas.includes('signal_ids.length} Published signals'));
const paged=await read('src/components/review/PagedShelf.astro');assert.equal(paged.split("'kind','status','type','confidence'").length-1,2);assert(paged.includes('complete first page'));assert(paged.includes("limit>=40&&page===i+1?'page':undefined"));
console.log(`Atlas source checks passed: 1,230 complete relationship/graph archives; ${nodeRows} original node rows and ${linkRows} original link rows; exact forward/reverse/candidate boundaries, duplicate-row notices, classifications and no-JavaScript memberships preserved. Rendering, byte budgets and reader acceptance remain unverified.`);
