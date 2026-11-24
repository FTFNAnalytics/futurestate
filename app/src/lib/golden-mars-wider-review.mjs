import review from '../data/golden-mars-wider-review.json' with {type:'json'};
import {goldenMarsSignalContext} from './golden-mars-signal-review.mjs';

export const goldenMarsWiderReview = review;
export const goldenMarsRecordReview = id => review.records.find(r => r.id === id) ?? null;
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const at = (data,path) => path.reduce((value,key) => {
  if (!value || !Object.hasOwn(value,key) || ['__proto__','constructor','prototype'].includes(String(key))) throw Error('Golden-Mars field path drift');
  return value[key];
},data);

export function goldenMarsWiderContext(id) {
  const record = goldenMarsRecordReview(id);
  if (!record) return null;
  const retained = goldenMarsSignalContext(review.retained_signal_id);
  if (!retained || retained.review_date !== review.source_check_date) throw Error('Golden-Mars retained source date drift');
  return {review_id:review.review_id,review_date:review.review_date,source_check_date:review.source_check_date,
    update_id:review.update_id,boundary:review.boundary,independent_review:false,approval_receipt_id:null,
    record,retained_review_route:retained.retained_review_route,source_checks:retained.source_checks};
}

/** Source downloads retain their public field allowlist, including inside review history.
 * The source-page monitoring guidance is deliberately not part of that export contract.
 */
export function goldenMarsSourceExportContext(id) {
  const context = goldenMarsWiderContext(id);
  if (!context) return null;
  const {record} = context;
  if (record.id !== 'source-virginia-scc-golden-mars-2026') throw Error('Golden-Mars source export identity drift');
  return {...context, record: {
    id:record.id, route:record.route, source_sha256:record.source_sha256,
    changes:record.changes.filter(change => change.path.length === 1 && change.path[0] === 'known_limitations')
      .map(({path,label,prior,current}) => ({path:[...path],label,prior,current}))
  }};
}

/** Exact, idempotent editorial projection. No source date, status or decision is changed.
 * @template {{id:string}} T
 * @param {T} data
 * @param {string} asOfDate
 * @returns {T}
 */
export function projectGoldenMarsRecordData(data, asOfDate = review.review_date) {
  const date = new Date(`${asOfDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate) || !Number.isFinite(date.valueOf()) || date.toISOString().slice(0,10) !== asOfDate) throw Error('Golden-Mars follow-through requires an ISO calendar date');
  const record = goldenMarsRecordReview(data.id);
  if (!record || asOfDate < review.review_date) return data;
  if (!Object.entries(record.identity).every(([key,value]) => same(data[key],value))) throw Error(`Golden-Mars identity drift: ${data.id}`);
  const original = record.changes.every(c => same(at(data,c.path),c.prior));
  const current = record.changes.every(c => same(at(data,c.path),c.current));
  if (!original && !current) throw Error(`Golden-Mars wording drift: ${data.id}`);
  if (current) return data;
  const result = structuredClone(data);
  for (const change of record.changes) {
    const parent = change.path.length === 1 ? result : at(result,change.path.slice(0,-1));
    parent[change.path.at(-1)] = change.current;
  }
  return result;
}

/** The preserved MDX contains plain Markdown, not imported components or executable expressions. */
export function projectGoldenMarsSystemBody(id, raw) {
  const record = goldenMarsRecordReview(id);
  if (!record?.body_replacements) return null;
  const front = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!front || !front[1].includes(`id: "${id}"`) || !front[1].includes(`slug: "${record.identity.slug}"`)) throw Error('Golden-Mars system body identity drift');
  const original = raw.slice(front[0].length);
  let body = original;
  for (const change of record.body_replacements) {
    if (body.split(change.prior).length !== 2) throw Error('Golden-Mars system paragraph drift');
    body = body.replace(change.prior,change.current);
  }
  return {original,current:body};
}
