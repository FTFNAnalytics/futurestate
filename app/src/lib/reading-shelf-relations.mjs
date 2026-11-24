// Related reading is an archive of explicit references and shared IDs, not a
// claim that a map cites a briefing or verifies its conclusions.
export const readingShelfKey=(kind,id)=>`${kind}-${id}`;
export function readingShelfRelations({signals=[],briefings=[],dependencyMaps=[]}){
  const archives=[];
  const graphFacts=map=>[
    {label:'Historical graph rows',value:`${map.nodes.length} node rows (${new Set(map.nodes.map(n=>n.id)).size} distinct IDs); ${map.links.length} link rows (${new Set(map.links.map(l=>JSON.stringify(l))).size} distinct complete rows)`},
    {label:'Linked evidence gaps',value:String(new Set(map.evidence_gap_ids).size)}
  ];
  for(const signal of signals){
    const maps=dependencyMaps.filter(map=>map.signal_ids.includes(signal.id));
    if(maps.length)archives.push({key:readingShelfKey('signal-maps',signal.id),label:`${signal.title}: maps citing this record`,route:`/signals/${signal.slug}/`,members:maps.map(map=>({id:map.id,relationships:['Map explicitly cites this signal ID'],facts:graphFacts(map)}))});
  }
  for(const briefing of briefings){
    const signalIds=new Set(briefing.signal_ids??[]),gapIds=new Set(briefing.evidence_gap_ids??[]),members=new Map();
    const add=(id,relationship,facts=[])=>{const member=members.get(id)??{id,relationships:[],facts:[]};if(!member.relationships.includes(relationship))member.relationships.push(relationship);member.facts.push(...facts);members.set(id,member);};
    for(const id of signalIds)add(id,'Signal explicitly referenced by briefing');
    for(const id of gapIds)add(id,'Evidence gap explicitly referenced by briefing');
    for(const map of dependencyMaps){
      const sharedSignals=[...new Set(map.signal_ids.filter(id=>signalIds.has(id)))],sharedGaps=[...new Set(map.evidence_gap_ids.filter(id=>gapIds.has(id)))];
      if(!sharedSignals.length&&!sharedGaps.length)continue;
      const facts=[...graphFacts(map),{label:'Connection boundary',value:'Shared record IDs, not a direct map citation of this briefing or independent corroboration.'}];
      if(sharedSignals.length)facts.push({label:'Shared signal IDs',value:sharedSignals.join(', ')});
      if(sharedGaps.length)facts.push({label:'Shared evidence-gap IDs',value:sharedGaps.join(', ')});
      add(map.id,`Shared IDs: ${sharedSignals.length} signals; ${sharedGaps.length} evidence gaps`,facts);
    }
    archives.push({key:readingShelfKey('briefing',briefing.id),label:`${briefing.title}: referenced records and related maps`,route:`/briefings/${briefing.slug}/`,members:[...members.values()]});
  }
  if(new Set(archives.map(a=>a.key)).size!==archives.length)throw Error('Duplicate reading archive key');
  return archives;
}
