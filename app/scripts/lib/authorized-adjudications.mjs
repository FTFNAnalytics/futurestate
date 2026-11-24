import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// The new decision is bound to the retained research, not written into its history.
export function verifyAuthorizedAdjudications(policy, decisions, reviews, checks) {
  assert.equal(decisions.policy_id, policy.policy_id, 'Unknown adjudication authority');
  assert.equal(policy.human_review_required, false);
  assert.equal(decisions.human_reviewer, null, 'AI decisions must not claim a human reviewer');
  assert.equal(decisions.independent_review_claimed, false);
  assert.equal(decisions.external_sources_retrieved_this_adjudication, false);
  assert.equal(decisions.backlog.length, reviews.length, 'Incomplete backlog determinations');
  assert.equal(new Set(decisions.backlog.map(d => d.backlog_item_id)).size, reviews.length, 'Duplicate backlog determination');
  for (const decision of decisions.backlog) {
    const review = reviews.find(r => r.backlog_item_id === decision.backlog_item_id);
    assert(review, `Unknown backlog identity ${decision.backlog_item_id}`);
    assert.equal(decision.research_receipt_id, review.review_id);
    const {sha256, ...research} = review;
    assert.equal(sha256, hash(research), 'Altered retained research');
    assert.equal(decision.research_receipt_sha256, sha256, 'Research changed: re-adjudication required');
    const artifacts = review.check_ids.map(id => {
      const check = checks.find(c => c.check_id === id);
      assert(check, `Missing adjudicated artifact ${id}`);
      return check;
    });
    assert.equal(decision.artifact_checks_sha256, hash(artifacts), 'Artifact changed: re-adjudication required');
    assert(['Qualify', 'Reject inference'].includes(decision.disposition));
    assert.equal(decision.decision_date, policy.effective_date);
    assert(decision.decision_date >= review.checked_date);
    assert(decision.rationale.length > 60 && decision.reopening_condition.length > 40);
    assert(!/human|reviewer|sign.off|obtain.*disposition/i.test(decision.reopening_condition), 'Evidence requirements must not reintroduce human review');
    assert.equal(decision.series_admitted, false, 'These decisions admit no measured series');
    assert.equal(decision.external_publication_authorized, false);
  }
}
