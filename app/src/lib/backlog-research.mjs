// Read-only projection. A dated assisted research check is not an admission or
// a rewrite of historical source freshness, publication or Phase 60 decisions.
/**
 * @typedef {Pick<typeof import('../data/phase-207-current-operations.json'), 'as_of_date' | 'backlog_reviews'>} BacklogOperations
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
  return backlogReviewsFor(operations, {recordId: id}).map(r => ({
    label: `Bounded research check ${r.checked_date}`,
    value: `${r.review_id}: ${r.finding} Authorized disposition pending. Next: ${r.next_action}`
  }));
}
