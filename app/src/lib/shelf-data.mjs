import {createSignalProjection} from './signal-classification.mjs';
import {projectResearchDocument,projectBriefing} from './reference-attribution.mjs';
import {getSourceFreshness,getSourceHealth,getFreshnessRank,sourceReviewAsOfDate} from './sourceFreshness.ts';
import {backlogReviewFacts} from './backlog-research.mjs';
import {atlasShelfRelations,atlasGraphShelf,atlasShelfKey} from './atlas-shelf-relations.mjs';
import {readingShelfRelations} from './reading-shelf-relations.mjs';
import {projectGoldenMarsRecordData} from './golden-mars-wider-review.mjs';
import {projectGapReviewData} from './current-gap-reviews.mjs';

export const shelfPageSize=40;
export const shelfDate=value=>value instanceof Date?value.toISOString().slice(0,10):String(value??'');
const unique=values=>[...new Set(values)];
const sort=records=>records.sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
const facets=(record,extra)=>({...record,filters:{...record.filters,...extra}});

// A pure projection: both Astro and the local tests supply real, separately loaded
// records. No network requests, source-date mutations or evidence admissions occur.
/** @param {import('./backlog-research.mjs').BacklogOperations} operations */
export function createShelfData(input,ledger,operations={as_of_date:ledger.as_of_date,backlog_reviews:[]},asOfDate=sourceReviewAsOfDate) {
  input={...input,...Object.fromEntries(['sources','evidenceGaps','readerPathways'].map(key=>[key,(input[key]??[]).map(data=>key==='evidenceGaps'?projectGapReviewData(projectGoldenMarsRecordData(data)):projectGoldenMarsRecordData(data))]))};
  const {signals=[],documents:rawDocuments=[],collections=[],sources=[],topics=[],organizations=[],technologies=[],localSystems=[],dependencyMaps=[],updates=[],readerPathways=[],briefings:rawBriefings=[],evidenceGaps=[]}=input;
  const documents=rawDocuments.map(data=>projectResearchDocument({data}).data);
  const briefings=rawBriefings.map(data=>projectBriefing({data}).data);
  const projection=createSignalProjection(ledger.records);
  const projected=signals.map(data=>projection.project({data}).data);
  const bySource=new Map(sources.map(s=>[s.id,s]));
  const allSignalCounts=new Map(),eligibleSignalCounts=new Map();
  for(const s of signals)for(const id of s.source_ids??[]){
    allSignalCounts.set(id,(allSignalCounts.get(id)??0)+1);
    if(projection.eligible({data:s}))eligibleSignalCounts.set(id,(eligibleSignalCounts.get(id)??0)+1);
  }
  const sourceRows=sources.map(s=>{
    const freshness=getSourceFreshness(s.last_checked_date,s.update_frequency,s.capture_priority,asOfDate,s.review_cadence_days);
    const health=getSourceHealth(s);
    const declared=Number.isSafeInteger(s.review_cadence_days)&&s.review_cadence_days>0&&s.review_cadence_days<=3650;
    const nextAction=['Blocked','Paused'].includes(s.monitoring_status)?`Resolve the ${s.monitoring_status.toLowerCase()} monitoring state before reuse.`:
      freshness.ageDays===null?freshness.note:
      freshness.status==='Review due'?'Reconcile later scoped receipts and independent appointments, then check only the genuinely due exact artifact.':
      !declared||!s.source_owner?'Confirm the review cadence and responsible source owner; the displayed fallback window is not editorial approval.':
      freshness.status==='Watch soon'?'Include this source in the next manual review pass.':
      health.status==='Needs endpoint'?'Record a stable endpoint or confirm manual-only review.':
      !(s.watch_lanes??[]).length?'Assign a watch lane before using this source in the review queue.':
      health.status==='Probe ready'?'Use the documented endpoint for a bounded check when this lane is due; metadata does not show that a probe ran.':'Maintain the documented manual-review cadence.';
    return {source:s,freshness,health,declared,nextAction,historicalSignalCount:allSignalCounts.get(s.id)??0,currentSignalCount:eligibleSignalCounts.get(s.id)??0};
  }).sort((a,b)=>getFreshnessRank(a.freshness.status)-getFreshnessRank(b.freshness.status)||Number(b.source.capture_priority==='High')-Number(a.source.capture_priority==='High')||shelfDate(a.source.last_checked_date).localeCompare(shelfDate(b.source.last_checked_date))||a.source.id.localeCompare(b.source.id));
  const sourceCards=sourceRows.map(({source:s,freshness,health,declared,nextAction,historicalSignalCount,currentSignalCount})=>({
    id:s.id,title:s.name,summary:s.known_limitations,route:`/atlas/sources/${s.id}/`,date:shelfDate(s.last_checked_date),
    filters:{status:[s.monitoring_status??'Active'],kind:['Source'],topic:s.primary_topics,type:[s.source_type],freshness:[freshness.status],health:[health.status],priority:[s.capture_priority],watchLane:s.watch_lanes??[],access:[s.live_access_type??'Manual Page Check'],cadence:[declared?'Declared cadence':'Fallback cadence — review required']},
    facts:[{label:'Next action',value:nextAction},{label:'Checked-date age',value:freshness.ageDays===null?`Unresolved metadata as of ${asOfDate}`:`${freshness.ageDays} days as of ${asOfDate}`},{label:'Review window',value:`${freshness.reviewAfterDays} days (${declared?'declared':'inferred fallback'})`},{label:'Source owner',value:s.source_owner||'Not recorded'},{label:'Linked records',value:`${historicalSignalCount} historical signals; ${currentSignalCount} currently feed-eligible Published signals`}]
  }));
  const shelves={
    briefings:sort(briefings.map(b=>({id:b.id,title:b.title,summary:b.summary,route:`/briefings/${b.slug}/`,date:shelfDate(b.captured_date),filters:{status:[b.record_status],kind:['Briefing'],type:[b.editorial_attribution?.content_type??'FTFN synthesis']}}))),
    signals:sort(projected.filter(s=>!projection.classification(s.id)).map(s=>({id:s.id,title:s.title,summary:s.summary,route:`/signals/${s.slug}/`,date:shelfDate(s.captured_date),filters:{status:[s.record_status],kind:['Signal'],topic:[s.primary_topic],type:[s.signal_type],horizon:[s.time_horizon],evidence:[s.evidence_quality],sourceType:unique((s.source_ids??[]).flatMap(id=>bySource.get(id)?.source_type??[])),watchLane:unique((s.source_ids??[]).flatMap(id=>bySource.get(id)?.watch_lanes??[]))}}))),
    documents:sort(documents.map(d=>({id:d.id,title:d.title,summary:d.summary,route:`/research/documents/${d.slug}/`,date:shelfDate(d.publication_date??d.captured_date),filters:{status:[d.record_status],kind:['Research document'],topic:d.primary_topics,documentType:[d.document_type],publisher:[d.publisher],capture:[d.capture_status],collection:[d.collection_id]}}))),
    collections:sort(collections.filter(c=>c.record_status==='Published').map(c=>({id:c.id,title:c.title,summary:c.summary,route:`/research/${c.slug}/`,date:shelfDate(c.captured_date),filters:{status:[c.record_status],kind:['Research collection']}}))),
    classification:sort(projected.filter(s=>projection.classification(s.id)).map(s=>{const review=projection.classification(s.id);return {id:s.id,title:review.claim_review_complete?s.title:`Under review: ${s.title}`,summary:review.reason,route:`/signals/${s.slug}/`,date:review.action_date,filters:{status:[s.record_status],kind:['Classification archive'],review:[review.claim_review_complete?'Classified — feed hold retained':'Individual review pending'],topic:[s.primary_topic],type:[review.content_type]}};})),
    sources:sourceCards,
    updates:sort(updates.map(u=>({id:u.id,title:u.title,summary:u.summary,route:`/updates/${u.id}/`,date:shelfDate(u.effective_date),searchText:[u.receipt_id,...u.affected_record_ids,u.evidence_note].filter(Boolean).join(' '),facts:u.receipt_id?[{label:'Receipt',value:u.receipt_id}]:[],filters:{status:[u.entry_type],kind:['Update receipt'],entryType:[u.entry_type],receipt:[u.receipt_type??'No receipt type recorded'],materiality:[u.materiality??'Not specified']}})))
  };
  const labels={briefings:'Briefings',signals:'Signals',documents:'Research documents',collections:'Research collections',classification:'Classification archive',sources:'Source review queue',updates:'Updates and corrections'};
  const sourceById=new Map(sourceCards.map(r=>[r.id,r]));
  const signalById=new Map(shelves.signals.map(r=>[r.id,r]));
  const mapCard=d=>({id:d.id,title:d.title,summary:d.summary,route:`/atlas/dependency-maps/${d.slug}/`,date:shelfDate(d.last_reviewed_date??d.captured_date),filters:{status:[d.record_status],kind:['Dependency map'],topic:[d.primary_topic],type:[d.map_type]}});
  const orgCard=o=>({id:o.id,title:o.name,summary:o.summary,route:`/atlas/organizations/${o.slug}/`,date:shelfDate(o.last_reviewed_date),filters:{status:['Reference profile'],kind:['Organization'],topic:o.primary_topics,type:[o.organization_type]}});
  const techCard=t=>({id:t.id,title:t.name,summary:t.summary,route:`/atlas/technologies/${t.slug}/`,date:shelfDate(t.last_reviewed_date),filters:{status:['Reference profile'],kind:['Technology'],topic:t.primary_topics,type:[t.maturity_level]}});
  const localCard=s=>({id:s.id,title:s.name,summary:s.summary,route:`/atlas/local-systems/${s.slug}/`,date:shelfDate(s.last_reviewed_date),filters:{status:['Reference profile'],kind:['Local system'],type:[s.system_type],geography:[s.geography]}});
  for(const t of topics){
    const key=`topic-${t.slug}`;labels[key]=t.name;
    shelves[key]=sort([
      ...shelves.signals.filter(r=>r.filters.topic.includes(t.name)),
      ...shelves.documents.filter(r=>r.filters.topic.includes(t.name)),
      ...sources.filter(s=>t.featured_sources.includes(s.id)).map(s=>sourceById.get(s.id)),
      ...organizations.filter(o=>o.primary_topics.includes(t.name)).map(orgCard),
      ...technologies.filter(c=>c.primary_topics.includes(t.name)).map(techCard),
      ...localSystems.filter(s=>s.source_ids.some(id=>bySource.get(id)?.primary_topics.includes(t.name))).map(localCard),
      ...dependencyMaps.filter(d=>d.primary_topic===t.name).map(mapCard)
    ]);
  }
  for(const system of localSystems){
    const key=`local-${system.slug}`,ids=new Set(system.source_ids),geography=system.geography.toLowerCase();labels[key]=`${system.name}: linked records`;
    const candidates=sources.filter(s=>{
      if(ids.has(s.id)||!((s.watch_lanes??[]).includes('Local Systems')||(s.coverage_role??[]).includes('Local Conversion Evidence')))return false;
      const region=s.country_or_region.toLowerCase();
      return geography.includes('ontario')?(region.includes('ontario')||region.includes('canada')):(geography.includes('arizona')||geography.includes('southwest'))?(region.includes('arizona')||region.includes('united states')):false;
    });
    shelves[key]=sort([
      ...system.source_ids.map(id=>sourceById.get(id)).filter(Boolean).map(r=>facets(r,{relationship:['Cited by local profile']})),
      ...candidates.map(s=>facets(sourceById.get(s.id),{relationship:['Geography/role candidate — not cited by this profile']})),
      ...signals.filter(s=>(s.receiving_systems??[]).includes(system.name)&&signalById.has(s.id)).map(s=>facets(signalById.get(s.id),{relationship:['Named receiving-system match']})),
      ...dependencyMaps.filter(d=>d.local_system_ids.includes(system.id)).map(d=>facets(mapCard(d),{relationship:['Explicit local-system ID']}))
    ]);
  }
  const pathwayUniverse=[
    ...shelves.signals,...shelves.classification,...sourceCards,...organizations.map(orgCard),...technologies.map(techCard),...localSystems.map(localCard),...dependencyMaps.map(mapCard),
    ...collections.map(c=>({id:c.id,title:c.title,summary:c.summary,route:`/research/${c.slug}/`,date:shelfDate(c.captured_date),filters:{status:[c.record_status],kind:['Research collection']}})),
    ...briefings.map(b=>({id:b.id,title:b.title,summary:b.summary,route:`/briefings/${b.slug}/`,date:shelfDate(b.captured_date),filters:{status:[b.record_status],kind:['Briefing']}})),
    ...evidenceGaps.map(g=>({id:g.id,title:g.title,summary:g.next_action,route:`/atlas/evidence-gaps/${g.slug}/`,date:shelfDate(g.last_reviewed_date),filters:{status:[g.status],kind:['Evidence gap'],priority:[g.priority]}}))
  ];
  const byPathwayId=new Map(pathwayUniverse.map(r=>[r.id,r]));
  for(const p of readerPathways){
    const key=`pathway-${p.slug}`;labels[key]=`${p.title}: relationship archive`;
    const ids=['signal_ids','source_ids','organization_ids','technology_ids','local_system_ids','briefing_ids','dependency_map_ids','research_collection_ids','evidence_gap_ids'].flatMap(field=>p[field]??[]);
    shelves[key]=sort(ids.map(id=>{const record=byPathwayId.get(id);if(!record)throw new Error(`Unresolved pathway membership ${p.id}/${id}`);return record;}));
  }
  const atlasUniverse=new Map([...pathwayUniverse,...shelves.documents,...topics.map(t=>({id:t.id,title:t.name,summary:t.summary,route:`/atlas/topics/${t.slug}/`,date:'',filters:{kind:['Topic'],topic:[t.name]}}))].map(r=>[r.id,r]));
  for(const archive of atlasShelfRelations(input)){
    labels[archive.key]=archive.label;
    shelves[archive.key]=sort(archive.members.map(member=>{
      const record=atlasUniverse.get(member.id);if(!record)throw new Error(`Unresolved Atlas membership ${archive.key}/${member.id}`);
      return facets(record,{relationship:member.relationships});
    }));
  }
  for(const d of dependencyMaps){const key=atlasShelfKey('graph',d.id);labels[key]=`${d.title}: graph nodes and links`;shelves[key]=atlasGraphShelf(d,atlasUniverse);}
  for(const archive of readingShelfRelations({...input,signals:projected,briefings})){
    labels[archive.key]=archive.label;
    const cards=sort(archive.members.map(member=>{
      const record=atlasUniverse.get(member.id);if(!record)throw new Error(`Unresolved reading membership ${archive.key}/${member.id}`);
      return {...facets(record,{relationship:member.relationships}),facts:[...(record.facts??[]),...member.facts]};
    }));
    // A long list of shared-gap maps must not displace the briefing's direct
    // citations from its first preview or the beginning of its static archive.
    shelves[archive.key]=archive.key.startsWith('briefing-')
      ? [...cards.filter(r=>!r.filters.kind.includes('Dependency map')),...cards.filter(r=>r.filters.kind.includes('Dependency map'))]
      : cards;
  }
  // The same card can occur in several shelves; decorate each shared object once.
  const decorated=new Set();
  for(const records of Object.values(shelves))for(const record of records){
    if(decorated.has(record))continue;
    decorated.add(record);
    const facts=backlogReviewFacts(operations,record.id);
    if(facts.length){record.facts=[...(record.facts??[]),...facts];record.filters.backlogReview=['Research checked — authorized disposition pending'];}
  }
  for(const [kind,records]of Object.entries(shelves)){
    if(new Set(records.map(r=>r.id)).size!==records.length)throw new Error(`Duplicate shelf identity: ${kind}`);
    for(const r of records)for(const[key,values]of Object.entries(r.filters)){
      if(!Array.isArray(values))throw new Error(`Missing shelf filter ${kind}/${r.id}/${key}`);
      r.filters[key]=unique(values.filter(v=>typeof v==='string'&&v.length));
    }
  }
  return {shelves,labels,sourceRows,asOfDate};
}
