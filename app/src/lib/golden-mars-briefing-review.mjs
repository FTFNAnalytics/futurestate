import review from '../data/golden-mars-briefing-review.json' with {type:'json'};
import {annualCaseReviewForId,annualReviewDate} from './annual-case-reviews.mjs';

export const goldenMarsBriefingReview = review;
const recordFor = id => review.records.find(r => r.id === id) ?? null;
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const at = (data,path) => path.reduce((value,key) => {
  if (!value || !Object.hasOwn(value,key) || ['__proto__','constructor','prototype'].includes(String(key))) throw Error('Golden-Mars briefing field path drift');
  return value[key];
},data);
function activeRecord(id,asOfDate) {
  const date=new Date(asOfDate+'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate) || !Number.isFinite(date.valueOf()) || date.toISOString().slice(0,10)!==asOfDate) throw Error('Golden-Mars briefing requires an ISO calendar date');
  return asOfDate < review.review_date ? null : recordFor(id);
}

export function goldenMarsBriefingContext(id,asOfDate=review.review_date) {
  const record=activeRecord(id,asOfDate);
  if (!record) return null;
  const retained=annualCaseReviewForId(review.retained_annual_record_id);
  if (!retained || annualReviewDate(retained)!==review.source_check_date || retained.route!==review.retained_review_route) throw Error('Golden-Mars briefing retained context drift');
  return {review_id:review.review_id,review_date:review.review_date,source_check_date:review.source_check_date,
    update_id:review.update_id,boundary:review.boundary,record,retained_review_route:retained.route,
    source_checks:retained.source_checks,independent_review:false,approval_receipt_id:null};
}

/** Exact, idempotent field projection; original metadata and dates are retained.
 * @template {{id:string}} T
 * @param {T} data
 * @param {string} asOfDate
 * @returns {T}
 */
export function projectGoldenMarsBriefingData(data,asOfDate=review.review_date) {
  const record=activeRecord(data.id,asOfDate);
  if (!record) return data;
  if (!Object.entries(record.identity).every(([key,value])=>same(data[key],value))) throw Error('Golden-Mars briefing identity drift: '+data.id);
  const original=record.changes.every(c=>same(at(data,c.path),c.prior));
  const current=record.changes.every(c=>same(at(data,c.path),c.current));
  if (!original&&!current) throw Error('Golden-Mars briefing wording drift: '+data.id);
  if (current) return data;
  const result=structuredClone(data);
  for (const change of record.changes) {
    const parent=change.path.length===1?result:at(result,change.path.slice(0,-1));
    parent[change.path.at(-1)]=change.current;
  }
  return result;
}

/** Only the four pinned ordinary-Markdown bodies are replaced; methods retain Content. */
export function projectGoldenMarsBriefingBody(id,raw,asOfDate=review.review_date) {
  const record=activeRecord(id,asOfDate);
  if (!record?.body_replacements.length) return null;
  const front=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!front || !front[1].includes('id: "'+id+'"') || !front[1].includes('slug: "'+record.identity.slug+'"')) throw Error('Golden-Mars briefing body identity drift');
  const original=raw.slice(front[0].length);
  if (/^\s*(import|export)\s/m.test(original) || /[{}]/.test(original) || /<[A-Z][A-Za-z]*(?:\s|\/>|>)/.test(original)) throw Error('Golden-Mars briefing requires ordinary Markdown');
  let current=original;
  for (const change of record.body_replacements) {
    if (current.split(change.prior).length!==2) throw Error('Golden-Mars briefing paragraph drift');
    current=current.replace(change.prior,change.current);
  }
  return {original,current};
}
