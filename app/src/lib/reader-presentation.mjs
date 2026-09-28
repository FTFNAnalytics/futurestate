import {applyAnnualCaseReview,annualCaseReviews,annualReviewDate} from './annual-case-reviews.mjs';
import {backlogDecisionFor} from './backlog-research.mjs';
import {goldenMarsSignalContext} from './golden-mars-signal-review.mjs';
const relatedLabels=new Map([
  ['/method/','Method and publication policy'],['/review/method/','Evidence review method'],['/review/fieldbook/method/','Fieldbook research method'],
  ['/atlas/sources/','Source profiles'],['/atlas/source-monitor/','Source review queue'],['/data/sources.json','Source registry (JSON)'],
  ['/review/corrections/','Correction review records'],['/updates/','Dated updates and corrections'],
  ['/review/v1reference/change-intelligence-correction-service/','Change and correction service contracts'],['/data/phase-201-change-intelligence-correction-service.json','Change and correction service (JSON)'],
  ['/review/accessibility/','Accessibility review records'],['/review/v1reference/accessible-multilingual-low-bandwidth-editions/','Reading and translation contracts'],
  ['/data/phase-202-accessible-multilingual-low-bandwidth-editions.json','Reading and translation contracts (JSON)'],['/review/v1reference/state-of-future-systems-2026/','State of Future Systems report contracts']
]);
/**
 * @param {{record_id:string, title:string, overview:string, sections:{heading:string, paragraphs:string[]}[], source_ids:string[], related_paths?:string[]}} article
 * @param {{id:string, name:string, url:string}[]} sources
 * @param {{edition_contract_id:string, topic_id:string, is_translation:boolean, target_language:string}[]} editionContracts
 * @param {{id:string, title:string, route:string, kind:string}[]} catalog
 * @param {{route?:string, asOfDate?:string}} options
 */
export function readerPresentation(article,sources,editionContracts,catalog,options={}){
  const bySource=new Map(sources.map(s=>[s.id,s])),byRoute=new Map(catalog.map(r=>[r.route,r.title]));
  const contract=editionContracts.find(r=>r.edition_contract_id===article.record_id);
  const alternatives=contract?editionContracts.filter(r=>r.topic_id===contract.topic_id&&r.edition_contract_id!==article.record_id&&!r.is_translation&&r.target_language==='English')
    .flatMap(r=>{const match=catalog.find(c=>c.id===r.edition_contract_id);return match?[match]:[];}):[];
  const projected=applyAnnualCaseReview(article,options);
  return {
    annualReview:projected.review,
    title:projected.title,
    overview:projected.overview,
    sections:projected.sections.map((s,i)=>({...s,anchor:`${article.record_id.toLowerCase()}-section-${i+1}`})),
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
    const decision=backlogDecisionFor(operations,r,date);
    contexts.push({id:r.review_id,kind:decision?`Research check — AI decision ${decision.decision_date}: ${decision.disposition}`:'Research check — authorized disposition pending',title:r.title,checked_date:r.checked_date,summary:r.finding,route:r.route,next_check_date:r.next_check_date,matched_source_ids:matched,independent_article_review:false});
  }
  // Carry exact-source clarifications to other readings, without importing an
  // unrelated article's overall finding or inventing a new check date. Paired
  // essays often retain the same check; render that payload only once.
  const ownReview=annualCaseReviews.records.find(r=>r.record_id===article.record_id&&annualReviewDate(r)<=date&&(!route||r.route===route));
  const seenChecks=new Set((ownReview?.source_checks??[]).map(check=>JSON.stringify(check)));
  for(const review of annualCaseReviews.records){
    if(annualReviewDate(review)>date)continue;
    for(const [index,check] of (review.source_checks??[]).entries()){
      const checked=check.primary_checked_date??check.retained_checked_date,key=JSON.stringify(check);
      if(!ids.has(check.source_id)||!checked||checked>date||seenChecks.has(key))continue;
      seenChecks.add(key);
      contexts.push({id:`${review.record_id}-source-check-${index+1}`,kind:'Retained source clarification — not a new retrieval',title:'Dated source clarification from a related reading',checked_date:checked,summary:`${check.finding} Locator: ${check.locator}. ${check.access}`,route:review.route,source_check:check,source_review_record_id:review.record_id,next_check_date:null,matched_source_ids:[check.source_id],independent_article_review:false});
    }
  }
  // These three older checks carry their date on the exact retained review,
  // not on each child check. Do not silently drop them or infer a date for
  // other undated checks. Exact source matching and payload deduplication apply.
  const golden=goldenMarsSignalContext('signal-golden-mars-transmission-conditional-approval');
  if(golden&&golden.review_date<=date)for(const [index,check]of golden.source_checks.entries()){
    const key=JSON.stringify(check);
    if(!ids.has(check.source_id)||seenChecks.has(key))continue;
    seenChecks.add(key);
    contexts.push({id:`${golden.annual_review_id}-source-check-${index+1}`,kind:'Retained source clarification — not a new retrieval',title:'Dated Golden-Mars source clarification',checked_date:golden.review_date,summary:`${check.finding} Locator: ${check.locator}. ${check.access}`,route:golden.retained_review_route,source_check:check,source_review_record_id:golden.annual_review_id,next_check_date:null,matched_source_ids:[check.source_id],independent_article_review:false});
  }
  return contexts.sort((a,b)=>b.checked_date.localeCompare(a.checked_date)||a.id.localeCompare(b.id));
}
