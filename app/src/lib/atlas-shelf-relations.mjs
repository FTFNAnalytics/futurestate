// Explicit relationship archives, not new evidence or external-development feeds.
// The descriptor retains why an ID was selected, including multiple independent
// links to the same record. Cards are projected separately by shelf-data.
export const atlasShelfKey=(kind,id)=>`atlas-${kind}-${id}`;
export function atlasGraphShelf(map,recordById){
 const route=`/atlas/dependency-maps/${map.slug}/`,nodes=new Map(),date=map.captured_date instanceof Date?map.captured_date.toISOString().slice(0,10):String(map.captured_date??'');
 for(const n of map.nodes)nodes.set(n.id,[...(nodes.get(n.id)??[]),n]);
 const endpoint=id=>{const rows=nodes.get(id);if(!rows)throw Error(`Unresolved Atlas graph endpoint ${map.id}/${id}`);const labels=[...new Set(rows.map(n=>n.label))];return {label:labels.join(' / '),rows:rows.length,note:rows.length===1?'Unique node row':new Set(rows.map(n=>JSON.stringify(n))).size===1?`${rows.length} repeated identical node rows — not additional entities`:`Ambiguous ID: ${rows.length} different node rows — no endpoint selected`};};
 const records=map.nodes.map((n,i)=>{
  const linked=n.record_id?recordById.get(n.record_id):null;
  if(n.record_id&&!linked)throw Error(`Unresolved Atlas node ${map.id}/${n.record_id}`);
  return {id:`atlas-graph-${map.id}-node-${i+1}-${n.id}`,title:linked?.title??n.label,summary:n.note,route:linked?.route??route,date,filters:{kind:['Map node'],type:[n.node_type],status:[map.record_status]},facts:[{label:'Historical map node',value:`${n.id}: ${n.label}`},{label:'Node-ID integrity',value:endpoint(n.id).note},{label:'Linked record',value:n.record_id??'Concept only — no record ID'},{label:'Interpretation',value:'The preserved map label and note are historical framing, not new verification of the linked record.'}]};
 });
 map.links.forEach((l,i)=>{
  const from=endpoint(l.from),to=endpoint(l.to),repeated=map.links.filter(r=>JSON.stringify(r)===JSON.stringify(l)).length;
  records.push({id:`atlas-graph-${map.id}-link-${i+1}`,title:`${from.label} → ${to.label}`,summary:l.note,route,date,filters:{kind:['Map relationship'],type:[l.relationship],confidence:[l.confidence],status:[map.record_status]},facts:[{label:'From node',value:`${l.from}: ${from.note}`},{label:'To node',value:`${l.to}: ${to.note}`},{label:'Link-row integrity',value:repeated===1?'Unique complete link row':`${repeated} repeated identical link rows — not additional evidence`},{label:'Interpretation',value:'Historical qualitative link and confidence label; not an inferred causal effect or newly verified result.'}]});
 });
 return records;
}
export function atlasShelfRelations(input){
 const {sources=[],signals=[],documents=[],organizations=[],technologies=[],topics=[],localSystems=[],dependencyMaps=[],evidenceGaps=[],briefings=[]}=input;
 const result=[];
 function archive(kind,id,label,route,select){
  const members=new Map();
  const add=(record,relationship)=>{if(!record?.id)throw Error(`Invalid Atlas relationship ${kind}/${id}`);const r=members.get(record.id)??{id:record.id,relationships:[]};if(!r.relationships.includes(relationship))r.relationships.push(relationship);members.set(r.id,r);};
  select(add);result.push({key:atlasShelfKey(kind,id),label,route,members:[...members.values()]});
 }
 archive('maps','all','Dependency maps','/atlas/dependency-maps/',add=>dependencyMaps.forEach(d=>add(d,'Dependency-map inventory')));
 for(const s of sources)archive('source',s.id,`${s.name}: relationship archive`,`/atlas/sources/${s.id}/`,add=>{
  for(const r of signals)if(r.source_ids.includes(s.id))add(r,'Signal cites source ID');
  for(const r of documents){if(r.source_id===s.id)add(r,'Primary source reference');if((r.supporting_source_ids??[]).includes(s.id))add(r,'Supporting source reference');}
  for(const [rows,label]of [[organizations,'Organization cites source ID'],[technologies,'Technology cites source ID'],[localSystems,'Local profile cites source ID'],[dependencyMaps,'Map cites source ID']])for(const r of rows)if(r.source_ids.includes(s.id))add(r,label);
 });
 for(const o of organizations)archive('organization',o.id,`${o.name}: relationship archive`,`/atlas/organizations/${o.slug}/`,add=>{
  for(const r of sources)if(o.source_ids.includes(r.id))add(r,'Cited by organization profile');
  for(const r of topics)if(o.primary_topics.includes(r.name))add(r,'Controlled topic match');
  for(const r of signals)if(r.source_ids.some(id=>o.source_ids.includes(id)))add(r,'Shared source — not proof of organization involvement');
 });
 for(const t of technologies)archive('technology',t.id,`${t.name}: relationship archive`,`/atlas/technologies/${t.slug}/`,add=>{
  for(const r of sources)if(t.source_ids.includes(r.id))add(r,'Cited by technology profile');
  for(const r of topics)if(t.primary_topics.includes(r.name))add(r,'Controlled topic match');
  for(const r of dependencyMaps)if(r.technology_ids.includes(t.id))add(r,'Map cites technology ID');
  for(const r of signals){const shared=r.source_ids.some(id=>t.source_ids.includes(id));if(shared)add(r,'Shared source — not proof of deployment');else if(t.primary_topics.includes(r.primary_topic))add(r,'Topic match only — not an explicit technology citation');}
 });
 for(const g of evidenceGaps)archive('gap',g.id,`${g.title}: relationship archive`,`/atlas/evidence-gaps/${g.slug}/`,add=>{
  for(const r of sources)if(g.related_source_ids.includes(r.id))add(r,'Cited by evidence-gap record');
  for(const r of signals){if(g.related_signal_ids.includes(r.id))add(r,'Signal named by evidence-gap record');if((r.evidence_gap_ids??[]).includes(g.id))add(r,'Signal cites evidence-gap ID');}
  for(const r of localSystems){if(g.related_local_system_ids.includes(r.id))add(r,'Local profile named by evidence-gap record');if((r.evidence_gap_ids??[]).includes(g.id))add(r,'Local profile cites evidence-gap ID');}
  for(const r of briefings)if((r.evidence_gap_ids??[]).includes(g.id))add(r,'Briefing cites evidence-gap ID');
  for(const r of dependencyMaps)if(r.evidence_gap_ids.includes(g.id))add(r,'Map cites evidence-gap ID — not resolution');
 });
 for(const d of dependencyMaps)archive('map',d.id,`${d.title}: evidence archive`,`/atlas/dependency-maps/${d.slug}/`,add=>{
  const ids=['signal_ids','source_ids','technology_ids','local_system_ids','evidence_gap_ids'].flatMap(k=>d[k]);
  for(const id of ids)add({id},'Explicit dependency-map record ID');
 });
 if(new Set(result.map(r=>r.key)).size!==result.length)throw Error('Duplicate Atlas archive key');
 return result;
}
