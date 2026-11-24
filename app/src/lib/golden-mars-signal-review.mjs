import review from '../data/golden-mars-signal-review.json' with {type:'json'};
import annual from '../data/annual-case-reviews.json' with {type:'json'};

export const goldenMarsSignalReview = review;
const normal = value => value instanceof Date ? value.toISOString().slice(0, 10) : value;
const same = (a, b) => JSON.stringify(normal(a)) === JSON.stringify(normal(b));
export function goldenMarsSignalContext(id) {
  if (id !== review.signal_id) return null;
  const retained = annual.records.find(r => r.record_id === review.annual_review_id);
  if (!retained || annual.review_date !== review.review_date) throw Error('Golden-Mars retained review drift');
  const source_checks = retained.source_checks.filter(s => s.source_id === review.source_ids[0]);
  if (source_checks.length !== 3) throw Error('Golden-Mars exact source binding drift');
  return {...review, retained_review_route:retained.route, source_checks};
}

/** Apply only this exact signal's dated metadata; never alter its source file or feed eligibility.
 * @template {{id:string}} T
 * @param {T} data
 * @param {string} asOfDate
 * @returns {T}
 */
export function projectGoldenMarsSignalData(data, asOfDate = review.review_date) {
  const date = new Date(`${asOfDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate) || !Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== asOfDate) throw Error('Signal review requires an ISO calendar date');
  if (data.id !== review.signal_id || asOfDate < review.review_date) return data;
  if (data.slug !== review.slug || !same(data.source_ids, review.source_ids)) throw Error('Golden-Mars signal identity drift');
  const keys = Object.keys(review.prior).filter(key => Object.hasOwn(data, key));
  if (!keys.includes('title') || !keys.includes('summary')) throw Error('Golden-Mars signal metadata incomplete');
  const original = keys.every(key => same(data[key], review.prior[key]));
  const current = keys.every(key => same(data[key], review.current[key]));
  if (!original && !current) throw Error('Golden-Mars signal metadata drift');
  if (current) return data;
  const changes = Object.fromEntries(keys.map(key => [key,
    key === 'last_reviewed_date' && data[key] instanceof Date ? new Date(`${review.current[key]}T00:00:00Z`) : structuredClone(review.current[key])
  ]));
  return {...data, ...changes};
}
