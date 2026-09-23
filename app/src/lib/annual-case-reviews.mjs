import reviews from '../data/annual-case-reviews.json' with {type:'json'};
import originalReaders from '../data/phase-204-reader-completion.json' with {type:'json'};
import operations from '../data/phase-207-current-operations.json' with {type:'json'};
import evidence from '../data/phase-60-current-decisions.json' with {type:'json'};

export const annualCaseReviews = reviews;
/** @param {string} id */
export function annualCaseReviewForId(id) { return reviews.records.find(r => r.record_id === id) ?? null; }
/**
 * @param {{record_id:string, overview:string, sections:{heading:string, paragraphs:string[]}[]}} article
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
 * @param {{record_id:string, overview:string, sections:{heading:string, paragraphs:string[]}[]}} article
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
  for (const change of review?.heading_replacements ?? []) {
    const targets = sections.filter(s => s.heading === change.original_text);
    if (targets.length !== 1 || !change.replacement_text) throw Error(`Annual heading target drift: ${article.record_id}`);
    targets[0].heading = change.replacement_text;
  }
  return {review, sections, overview:annualCaseOverview(article, options)};
}
/**
 * @param {{record_id:string, overview:string, sections:{heading:string, paragraphs:string[]}[]}} article
 * @param {{route?:string, asOfDate?:string}} options
 */
export function annualCaseOverview(article, options = {}) {
  const change = annualCaseReview(article, options)?.overview_replacement;
  if (!change) return article.overview;
  if (article.overview !== change.original_text) throw Error(`Annual overview target drift: ${article.record_id}`);
  return change.replacement_text;
}
/** @param {typeof reviews.records[number] | null} review */
export function annualReviewContexts(review) {
  return (review?.retained_contexts ?? []).map(binding => {
    if (binding.collection === 'evidence_receipts') {
      const receipt = evidence.receipts.find(r => r.receipt_id === binding.id);
      if (!receipt || receipt.source_checked_date > reviews.review_date || receipt.decision_date > reviews.review_date) throw Error(`Invalid retained annual context: ${binding.id}`);
      return {...binding, checked_date:receipt.source_checked_date, summary:receipt.bounded_finding,
        next_action:receipt.next_action, next_check_date:receipt.next_check_date};
    }
    if (!['receipts', 'pilot_research_followups'].includes(binding.collection)) throw Error(`Invalid retained annual collection: ${binding.collection}`);
    const receipt = operations[binding.collection]?.find(r => (r.receipt_id ?? r.review_id) === binding.id);
    if (!receipt || receipt.checked_date > reviews.review_date) throw Error(`Invalid retained annual context: ${binding.id}`);
    return {...binding, checked_date:receipt.checked_date, summary:receipt.bounded_finding ?? receipt.finding,
      next_action:receipt.next_action, next_check_date:receipt.next_check_date ?? null};
  });
}
