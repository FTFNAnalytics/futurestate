import reviews from '../data/annual-case-reviews.json' with {type:'json'};
import originalReaders from '../data/phase-204-reader-completion.json' with {type:'json'};
import operations from '../data/phase-207-current-operations.json' with {type:'json'};
import evidence from '../data/phase-60-current-decisions.json' with {type:'json'};

export const annualCaseReviews = reviews;
/** @param {{review_date?:string} | null | undefined} review */
export const annualReviewDate = review => review?.review_date ?? reviews.review_date;
/**
 * @typedef {{record_id:string, route:string, source_record_sha256:string, review_date?:string, update_id?:string, summary:string, previous_review?:AnnualReviewVersion}} AnnualReviewVersion
 */
/** Return every retained version, oldest first, without changing the records.
 * @param {AnnualReviewVersion | null | undefined} review
 * @returns {AnnualReviewVersion[]}
 */
export function annualReviewVersions(review) {
  if (!review) return [];
  const versions = [], seen = new Set(), updates = new Set();
  let current = review, laterDate = null;
  while (current) {
    const update = current.update_id ?? reviews.update_id;
    if (seen.has(current) || updates.has(update)) throw Error('Repeated annual review history');
    if (current.record_id !== review.record_id || current.route !== review.route || current.source_record_sha256 !== review.source_record_sha256) throw Error('Annual review history identity drift');
    const date = annualReviewDate(current), parsed = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date || (laterDate && date > laterDate)) throw Error('Invalid annual review history date');
    seen.add(current); updates.add(update); versions.unshift(current);
    laterDate = date; current = current.previous_review;
  }
  return versions;
}
/** @param {string} id */
export function annualCaseReviewForId(id) { return reviews.records.find(r => r.record_id === id) ?? null; }
/**
 * @param {{record_id:string, title:string, overview:string, sections:{heading:string, paragraphs:string[]}[]}} article
 * @param {{route?:string, asOfDate?:string}} options
 */
export function annualCaseReview(article, {route, asOfDate = reviews.latest_review_date ?? reviews.review_date} = {}) {
  const date = new Date(`${asOfDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate) || !Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== asOfDate) throw Error('Annual review requires an ISO calendar date');
  const review = annualCaseReviewForId(article.record_id);
  if (!review || asOfDate < annualReviewDate(review) || (route && route !== review.route)) return null;
  const original = originalReaders.records.find(r => r.record_id === article.record_id);
  if (JSON.stringify(article) !== JSON.stringify(original)) throw Error(`Annual reader source drift: ${article.record_id}`);
  return review;
}
/**
 * @param {{record_id:string, title:string, overview:string, sections:{heading:string, paragraphs:string[]}[]}} article
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
  return {review, sections, title:annualCaseTitle(article, options), overview:annualCaseOverview(article, options)};
}
/**
 * @param {{record_id:string, title:string, overview:string, sections:{heading:string, paragraphs:string[]}[]}} article
 * @param {{route?:string, asOfDate?:string}} options
 */
export function annualCaseOverview(article, options = {}) {
  const change = annualCaseReview(article, options)?.overview_replacement;
  if (!change) return article.overview;
  if (article.overview !== change.original_text) throw Error(`Annual overview target drift: ${article.record_id}`);
  return change.replacement_text;
}
/**
 * @param {{record_id:string, title:string, overview:string, sections:{heading:string, paragraphs:string[]}[]}} article
 * @param {{route?:string, asOfDate?:string}} options
 */
export function annualCaseTitle(article, options = {}) {
  const change = annualCaseReview(article, options)?.title_replacement;
  if (!change) return article.title;
  if (article.title !== change.original_text) throw Error(`Annual title target drift: ${article.record_id}`);
  return change.replacement_text;
}
/** @param {typeof reviews.records[number] | null} review */
export function annualReviewContexts(review) {
  const reviewedAt = annualReviewDate(review);
  return (review?.retained_contexts ?? []).map(binding => {
    if (binding.collection === 'evidence_receipts') {
      const receipt = evidence.receipts.find(r => r.receipt_id === binding.id);
      if (!receipt || receipt.source_checked_date > reviewedAt || receipt.decision_date > reviewedAt) throw Error(`Invalid retained annual context: ${binding.id}`);
      return {...binding, checked_date:receipt.source_checked_date, summary:receipt.bounded_finding,
        next_action:receipt.next_action, next_check_date:receipt.next_check_date,
        formal_artifact:'include_formal_artifact' in binding && binding.include_formal_artifact === true ? receipt.formal_artifact : null,
        evidence_boundary:receipt.evidence_boundary};
    }
    if (!['receipts', 'pilot_research_followups'].includes(binding.collection)) throw Error(`Invalid retained annual collection: ${binding.collection}`);
    const receipt = operations[binding.collection]?.find(r => (r.receipt_id ?? r.review_id) === binding.id);
    if (!receipt || receipt.checked_date > reviewedAt) throw Error(`Invalid retained annual context: ${binding.id}`);
    return {...binding, checked_date:receipt.checked_date, summary:receipt.bounded_finding ?? receipt.finding,
      next_action:receipt.next_action, next_check_date:receipt.next_check_date ?? null};
  });
}
