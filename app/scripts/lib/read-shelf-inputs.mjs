import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';

const fields=new Set(['id','slug','title','name','summary','record_status','primary_topic','primary_topics','captured_date','last_reviewed_date','source_ids','signal_ids','receiving_systems','evidence_gap_ids','signal_type','time_horizon','evidence_quality','geography','system_type']);
// Independent inventory parser for the repository's scalar/string-list MDX
// frontmatter. It intentionally rejects an unsupported selected field instead of
// silently producing a smaller membership list. Astro remains the renderer.
export function shelfFrontmatter(raw){
  const front=raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if(!front)throw new Error('Missing shelf input frontmatter');
  const out={};let key;
  const scalar=value=>{
    if(value.startsWith('"')||value==='[]'||value==='null'||value==='true'||value==='false'||/^-?\d+(\.\d+)?$/.test(value))return JSON.parse(value);
    if(!value||value==='|'||value==='>'||value.startsWith("'"))throw new Error(`Unsupported selected shelf value: ${key}`);
    return value;
  };
  for(const line of front.split(/\r?\n/)){
    const field=line.match(/^([a-z_]+):\s*(.*)$/);
    if(field){key=fields.has(field[1])?field[1]:undefined;if(key)out[key]=field[2]?scalar(field[2]):[];continue;}
    if(key){if(!line.trim())continue;const item=line.match(/^\s+-\s+(.+)$/);if(!item||!Array.isArray(out[key]))throw new Error(`Unsupported shelf list: ${key}`);out[key].push(scalar(item[1]));}
  }
  return out;
}
export async function readShelfInputs(appRoot){
  const folders={signals:'signals',documents:'research-documents',collections:'research-collections',sources:'sources',topics:'topics',organizations:'organizations',technologies:'technologies',localSystems:'local-systems',dependencyMaps:'dependency-maps',updates:'updates',readerPathways:'reader-pathways',briefings:'briefings',evidenceGaps:'evidence-gaps'};
  return Object.fromEntries(await Promise.all(Object.entries(folders).map(async([key,folder])=>{
    const files=(await readdir(join(appRoot,'src/content',folder))).filter(f=>/\.(mdx|json)$/.test(f)).sort();
    const rows=await Promise.all(files.map(async file=>{const raw=await readFile(join(appRoot,'src/content',folder,file),'utf8');return file.endsWith('.json')?JSON.parse(raw):shelfFrontmatter(raw);}));
    return [key,rows];
  })));
}

// Membership expectation is independent of createShelfData and its display
// mapping. A production omission must not reduce the expected inventory too.
export function expectedShelfMembership(input,ledger){
  const held=new Set(ledger.records.map(r=>r.id));
  const included=input.signals.filter(r=>!held.has(r.id));
  const result={signals:included.map(r=>r.id),documents:input.documents.map(r=>r.id),collections:input.collections.filter(r=>r.record_status==='Published').map(r=>r.id),classification:input.signals.filter(r=>held.has(r.id)).map(r=>r.id),sources:input.sources.map(r=>r.id),updates:input.updates.map(r=>r.id)};
  result.briefings=input.briefings.map(r=>r.id);
  for(const t of input.topics){
    const topicSources=new Set(input.sources.filter(r=>r.primary_topics.includes(t.name)).map(r=>r.id));
    result[`topic-${t.slug}`]=[
      ...included.filter(r=>r.primary_topic===t.name),...input.documents.filter(r=>r.primary_topics.includes(t.name)),
      ...input.sources.filter(r=>t.featured_sources.includes(r.id)),...input.organizations.filter(r=>r.primary_topics.includes(t.name)),
      ...input.technologies.filter(r=>r.primary_topics.includes(t.name)),...input.localSystems.filter(r=>r.source_ids.some(id=>topicSources.has(id))),
      ...input.dependencyMaps.filter(r=>r.primary_topic===t.name)
    ].map(r=>r.id);
  }
  for(const system of input.localSystems){
    const exact=new Set(system.source_ids),geo=system.geography.toLowerCase();
    const records=input.sources.filter(s=>{
      if(exact.has(s.id))return true;
      if(!(s.watch_lanes??[]).includes('Local Systems')&&!(s.coverage_role??[]).includes('Local Conversion Evidence'))return false;
      const region=s.country_or_region.toLowerCase();
      if(geo.includes('ontario'))return region.includes('ontario')||region.includes('canada');
      if(geo.includes('arizona')||geo.includes('southwest'))return region.includes('arizona')||region.includes('united states');
      return false;
    });
    result[`local-${system.slug}`]=[...records,...included.filter(s=>(s.receiving_systems??[]).includes(system.name)),...input.dependencyMaps.filter(d=>d.local_system_ids.includes(system.id))].map(r=>r.id);
  }
  for(const p of input.readerPathways)result[`pathway-${p.slug}`]=['signal_ids','source_ids','organization_ids','technology_ids','local_system_ids','briefing_ids','dependency_map_ids','research_collection_ids','evidence_gap_ids'].flatMap(field=>p[field]??[]);
  // Independently enumerate the source relationships; do not import the display
  // descriptor builder, so omitting a card cannot shrink its own expectation.
  const ids=rows=>[...new Set(rows.map(r=>r.id))];
  result['atlas-maps-all']=ids(input.dependencyMaps);
  for(const s of input.sources)result[`atlas-source-${s.id}`]=ids([
    ...input.signals.filter(r=>r.source_ids.includes(s.id)),
    ...input.documents.filter(r=>r.source_id===s.id||(r.supporting_source_ids??[]).includes(s.id)),
    ...[...input.organizations,...input.technologies,...input.localSystems,...input.dependencyMaps].filter(r=>r.source_ids.includes(s.id))
  ]);
  for(const o of input.organizations)result[`atlas-organization-${o.id}`]=ids([
    ...input.sources.filter(r=>o.source_ids.includes(r.id)),...input.topics.filter(r=>o.primary_topics.includes(r.name)),
    ...input.signals.filter(r=>r.source_ids.some(id=>o.source_ids.includes(id)))
  ]);
  for(const t of input.technologies)result[`atlas-technology-${t.id}`]=ids([
    ...input.sources.filter(r=>t.source_ids.includes(r.id)),...input.topics.filter(r=>t.primary_topics.includes(r.name)),
    ...input.dependencyMaps.filter(r=>r.technology_ids.includes(t.id)),
    ...input.signals.filter(r=>r.source_ids.some(id=>t.source_ids.includes(id))||t.primary_topics.includes(r.primary_topic))
  ]);
  for(const g of input.evidenceGaps)result[`atlas-gap-${g.id}`]=ids([
    ...input.sources.filter(r=>g.related_source_ids.includes(r.id)),
    ...input.signals.filter(r=>g.related_signal_ids.includes(r.id)||(r.evidence_gap_ids??[]).includes(g.id)),
    ...input.localSystems.filter(r=>g.related_local_system_ids.includes(r.id)||(r.evidence_gap_ids??[]).includes(g.id)),
    ...input.briefings.filter(r=>(r.evidence_gap_ids??[]).includes(g.id)),...input.dependencyMaps.filter(r=>r.evidence_gap_ids.includes(g.id))
  ]);
  for(const d of input.dependencyMaps)result[`atlas-map-${d.id}`]=[...new Set(['signal_ids','source_ids','technology_ids','local_system_ids','evidence_gap_ids'].flatMap(k=>d[k]))];
  for(const d of input.dependencyMaps)result[`atlas-graph-${d.id}`]=[...d.nodes.map((n,i)=>`atlas-graph-${d.id}-node-${i+1}-${n.id}`),...d.links.map((_,i)=>`atlas-graph-${d.id}-link-${i+1}`)];
  for(const s of input.signals){const maps=input.dependencyMaps.filter(d=>d.signal_ids.includes(s.id));if(maps.length)result[`signal-maps-${s.id}`]=ids(maps);}
  for(const b of input.briefings)result[`briefing-${b.id}`]=[...new Set([
    ...(b.signal_ids??[]),...(b.evidence_gap_ids??[]),
    ...input.dependencyMaps.filter(d=>d.signal_ids.some(id=>(b.signal_ids??[]).includes(id))||d.evidence_gap_ids.some(id=>(b.evidence_gap_ids??[]).includes(id))).map(d=>d.id)
  ])];
  return result;
}
