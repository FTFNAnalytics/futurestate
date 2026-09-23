import reviews from '../data/annual-case-reviews.json' with {type:'json'};
import originalReaders from '../data/phase-204-reader-completion.json' with {type:'json'};
import operations from '../data/phase-207-current-operations.json' with {type:'json'};

export const annualCaseReviews = reviews;
/** @param {string} id */
export function annualCaseReviewForId(id) { return reviews.records.find(r => r.record_id === id) ?? null; }
/**
 * @param {{record_id:string, sections:{heading:string, paragraphs:string[]}[]}} article
 * @param {{route?:string, asOfDate?:string}} options
 */
export function annualCaseReview(article, {route, asOfDate = reviews.review_date} = {}) {
  const date = new Date(`${asOfDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate) || !Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== asOfDate) throw Error('Annual review requires an ISO calendar date');
  const review = annualCaseReviewForId(article.record_id);
  if (!review || asOfDate < reviews.review_date || (route && route !== review.route)) return null;
  const original = originalReaders.records.find(r => r.record_id === article.record_id);
  if (JSON.stringify(article) !== JSON.stringify(original)) throw Error(`Annual reader source drift: ${article.record_id}`);
  return review;
}
/**
 * @param {{record_id:string, sections:{heading:string, paragraphs:string[]}[]}} article
 * @param {{route?:string, asOfDate?:string}} options
 */
export function applyAnnualCaseReview(article, options = {}) {
  const review = annualCaseReview(article, options);
  const sections = article.sections.map(section => ({...section, paragraphs:[...section.paragraphs]}));
  for (const change of review?.replacements ?? []) {
    const targets = sections.filter(s => s.heading === change.section_heading);
    if (targets.length !== 1 || targets[0].paragraphs[change.paragraph_index] !== change.original_text) throw Error(`Annual replacement target drift: ${article.record_id}`);
    targets[0].paragraphs[change.paragraph_index] = change.replacement_text;
  }
  return {review, sections};
}
/** @param {typeof reviews.records[number] | null} review */
export function annualReviewContexts(review) {
  return (review?.retained_contexts ?? []).map(binding => {
    const receipt = operations[binding.collection]?.find(r => (r.receipt_id ?? r.review_id) === binding.id);
    if (!receipt || receipt.checked_date > reviews.review_date) throw Error(`Invalid retained annual context: ${binding.id}`);
    return {...binding, checked_date:receipt.checked_date, summary:receipt.bounded_finding ?? receipt.finding,
      next_action:receipt.next_action, next_check_date:receipt.next_check_date ?? null};
  });
}
