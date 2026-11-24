import ledger from '../data/phase-55q-current-gap-reviews.json' with {type:'json'};
export const currentGapReviewLedger=ledger;
const active=(asOfDate)=>{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate)||new Date(asOfDate+'T00:00:00Z').toISOString().slice(0,10)!==asOfDate)throw new Error('ISO calendar date required');
  return ledger.records.filter(r=>r.decision_date<=asOfDate).sort((a,b)=>b.decision_date.localeCompare(a.decision_date));
};
export const gapReviewsForRecord=(id,asOfDate=ledger.as_of_date)=>id?active(asOfDate).filter(r=>r.affected_record_ids.includes(id)):[];
export const gapReviewsForRoute=(route,asOfDate=ledger.as_of_date)=>route?active(asOfDate).filter(r=>r.affected_routes.includes(route)):[];
export const latestGapReviewFor=(id,asOfDate=ledger.as_of_date)=>active(asOfDate).find(r=>r.gap_id===id)??null;
// Additive reader projection; original gap/source bytes and historical review stay intact.
export function projectGapReviewData(data,asOfDate=ledger.as_of_date){
  const review=latestGapReviewFor(data.id,asOfDate);if(!review)return data;
  return {...data,historical_next_action:data.historical_next_action??data.next_action,next_action:review.next_action,current_gap_review:review};
}
