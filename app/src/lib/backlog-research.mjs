// Read-only projection. A dated assisted research check is not an admission or
// a rewrite of historical source freshness, publication or Phase 60 decisions.
/**
 * @typedef {Pick<typeof import('../data/phase-207-current-operations.json'), 'as_of_date' | 'backlog_reviews' | 'backlog_adjudications'>} BacklogOperations
 */
/**
 * @param {BacklogOperations} operations
 * @param {{recordId?:string, route?:string, asOfDate?:string}} options
 */
export function backlogReviewsFor(operations, {recordId, route, asOfDate = operations.as_of_date} = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate ?? '')) throw new Error('Expected ISO backlog review cutoff');
  return (operations.backlog_reviews ?? []).filter(r => r.checked_date <= asOfDate &&
    (recordId ? r.affected_record_ids.includes(recordId) : route ? r.affected_routes.includes(route) : true));
}

export function backlogReviewFacts(operations, id) {
  return backlogReviewsFor(operations, {recordId: id}).map(r => {
    const decision = backlogDecisionFor(operations, r);
    return {
    label: `Bounded research check ${r.checked_date}`,
    value: `${r.review_id}: ${r.finding} ${decision ? `AI decision ${decision.decision_date}: ${decision.disposition}. ${decision.rationale} Reopen: ${decision.reopening_condition}` : `Authorized disposition pending. Next: ${r.next_action}`}`
  };});
}

/** @param {BacklogOperations} operations */
export function backlogDecisionFor(operations, review, asOfDate = operations.as_of_date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate ?? '')) throw new Error('Expected ISO decision cutoff');
  return (operations.backlog_adjudications ?? []).find(d => d.backlog_item_id === review.backlog_item_id &&
    d.research_receipt_sha256 === review.sha256 && d.decision_date <= asOfDate);
}
