const relatedLabels=new Map([
  ['/method/','Method and publication policy'],['/review/method/','Evidence review method'],['/review/fieldbook/method/','Fieldbook research method'],
  ['/atlas/sources/','Source profiles'],['/atlas/source-monitor/','Source review queue'],['/data/sources.json','Source registry (JSON)'],
  ['/review/corrections/','Correction review records'],['/updates/','Dated updates and corrections'],
  ['/review/v1reference/change-intelligence-correction-service/','Change and correction service contracts'],['/data/phase-201-change-intelligence-correction-service.json','Change and correction service (JSON)'],
  ['/review/accessibility/','Accessibility review records'],['/review/v1reference/accessible-multilingual-low-bandwidth-editions/','Reading and translation contracts'],
  ['/data/phase-202-accessible-multilingual-low-bandwidth-editions.json','Reading and translation contracts (JSON)'],['/review/v1reference/state-of-future-systems-2026/','State of Future Systems report contracts']
]);
/**
 * @param {{record_id:string, sections:{heading:string, paragraphs:string[]}[], source_ids:string[], related_paths?:string[]}} article
 * @param {{id:string, name:string, url:string}[]} sources
 * @param {{edition_contract_id:string, topic_id:string, is_translation:boolean, target_language:string}[]} editionContracts
 * @param {{id:string, title:string, route:string, kind:string}[]} catalog
 */
export function readerPresentation(article,sources,editionContracts,catalog){
  const bySource=new Map(sources.map(s=>[s.id,s])),byRoute=new Map(catalog.map(r=>[r.route,r.title]));
  const contract=editionContracts.find(r=>r.edition_contract_id===article.record_id);
  const alternatives=contract?editionContracts.filter(r=>r.topic_id===contract.topic_id&&r.edition_contract_id!==article.record_id&&!r.is_translation&&r.target_language==='English')
    .flatMap(r=>{const match=catalog.find(c=>c.id===r.edition_contract_id);return match?[match]:[];}):[];
  return {
    sections:article.sections.map((s,i)=>({...s,anchor:`${article.record_id.toLowerCase()}-section-${i+1}`})),
    sources:article.source_ids.map(id=>{const source=bySource.get(id);if(!source?.name||!/^https?:\/\//.test(source.url??''))throw Error(`Missing reader source link ${article.record_id}/${id}`);return {id,name:source.name,url:source.url,profile_route:`/atlas/sources/${id}/`};}),
    alternatives:alternatives.map(r=>({id:r.id,title:r.title,route:r.route,label:r.kind==='Compact'?'Read the concise English draft':'Read the plain-English draft'})),
    related:(article.related_paths??[]).map(route=>{const title=byRoute.get(route)??relatedLabels.get(route);if(!title)throw Error(`Missing reader link label ${article.record_id}/${route}`);return {route,title};})
  };
}

// Exact source-ID joins expose already recorded checks alongside a historical
// article. They do not re-review that article or change its evidence cutoff.
export function readerSourceReviewContexts(article,evidence,operations,{asOfDate,route}={}){
  const date=asOfDate??[evidence.as_of_date,operations.as_of_date].filter(Boolean).sort().at(-1);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date??''))throw Error('Reader context requires an ISO calendar date');
  const ids=new Set(article.source_ids),contexts=[];
  for(const r of evidence.receipts??[]){
    const matched=[...new Set(r.checked_source_ids.filter(id=>ids.has(id)))];
    if(!matched.length||r.decision_date>date||r.source_checked_date>date||r.affected_routes.includes(route))continue;
    contexts.push({id:r.receipt_id,kind:'Dated evidence decision',title:r.receipt_type+' — '+r.cycle_item_id.replace(/^60-CYCLE-/,'').toLowerCase().replaceAll('-',' '),checked_date:r.source_checked_date,summary:r.bounded_finding,route:r.gate_route,next_check_date:r.next_check_date,matched_source_ids:matched,independent_article_review:false});
  }
  for(const r of operations.backlog_reviews??[]){
    const matched=[...new Set(r.source_ids.filter(id=>ids.has(id)))];
    if(!matched.length||r.checked_date>date||r.affected_routes.includes(route))continue;
    contexts.push({id:r.review_id,kind:'Research check — authorized disposition pending',title:r.title,checked_date:r.checked_date,summary:r.finding,route:r.route,next_check_date:r.next_check_date,matched_source_ids:matched,independent_article_review:false});
  }
  return contexts.sort((a,b)=>b.checked_date.localeCompare(a.checked_date)||a.id.localeCompare(b.id));
}
