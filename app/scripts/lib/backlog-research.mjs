import {createHash} from 'node:crypto';
import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';

export const backlogHash = value => createHash('sha256').update(value).digest('hex');

export async function verifyBacklogInputs(appRoot, pins, backlog, reviews) {
  if (new Set(reviews.map(r => r.backlog_item_id)).size !== reviews.length) throw new Error('Duplicate backlog review');
  if (pins.records.length !== reviews.length) throw new Error('Backlog pin inventory mismatch');
  for (const review of reviews) {
    const pin = pins.records.find(r => r.backlog_item_id === review.backlog_item_id);
    const prior = backlog.backlog_items.find(r => r.backlog_item_id === review.backlog_item_id);
    if (!pin || !prior || pin.signal_id !== prior.signal_id || JSON.stringify(pin.source_ids) !== JSON.stringify(prior.source_ids)) throw new Error(`Changed backlog identity: ${review.backlog_item_id}`);
    const expectedPaths = [`src/content/signals/${prior.signal_id}.mdx`, ...prior.source_ids.map(id => `src/content/sources/${id}.json`)];
    if (JSON.stringify(pin.inputs.map(i => i.path)) !== JSON.stringify(expectedPaths)) throw new Error(`Missing backlog input: ${review.backlog_item_id}`);
    for (const input of pin.inputs) {
      const raw = await readFile(join(appRoot, input.path));
      if (backlogHash(raw) !== input.sha256) throw new Error(`Backlog input changed; individual re-review required: ${input.path}`);
    }
  }
}

const routeFolders = [
  ['sources', '/atlas/sources/'], ['signals', '/signals/'], ['briefings', '/briefings/'],
  ['dependency-maps', '/atlas/dependency-maps/'], ['local-systems', '/atlas/local-systems/'],
  ['evidence-gaps', '/atlas/evidence-gaps/'], ['reader-pathways', '/pathways/'],
  ['research-documents', '/research/documents/']
];

// Direct, exact-ID references only. These are contextual notification targets,
// not evidence of downstream admission, project advancement or causal transfer.
export async function backlogPropagation(appRoot, prior, editorial, projectRegistry) {
  const matchIds = [prior.signal_id, ...prior.source_ids];
  const explicit = new Set([prior.signal_id, ...prior.source_ids,
    'briefing-outcomes-watch-001-what-actually-changed',
    'briefing-evidence-cycle-001-operating-baseline']);
  const signalRaw = await readFile(join(appRoot, 'src/content/signals', `${prior.signal_id}.mdx`), 'utf8');
  const gapBlock = signalRaw.match(/^evidence_gap_ids:\s*\r?\n((?:[ \t]+-.*\r?\n)+)/m)?.[1] ?? '';
  for (const match of gapBlock.matchAll(/"([^"]+)"/g)) explicit.add(match[1]);
  const targets = [{record_id: prior.backlog_item_id, route: prior.route, relation: 'Exact Phase 182 backlog identity', matched_ids: [prior.signal_id]}];
  for (const [folder, prefix] of routeFolders) {
    for (const name of (await readdir(join(appRoot, 'src/content', folder))).filter(n => /\.(json|mdx)$/.test(n)).sort()) {
      const raw = await readFile(join(appRoot, 'src/content', folder, name), 'utf8');
      const data = name.endsWith('.json') ? JSON.parse(raw) : {id: raw.match(/^id: "([^"]+)"/m)?.[1], slug: raw.match(/^slug: "([^"]+)"/m)?.[1]};
      const matched = matchIds.filter(id => raw.includes(JSON.stringify(id)));
      if (!explicit.has(data.id) && !matched.length) continue;
      if (!data.id || (folder !== 'sources' && !data.slug)) throw new Error(`Missing propagation route: ${folder}/${name}`);
      targets.push({record_id: data.id, route: `${prefix}${folder === 'sources' ? data.id : data.slug}/`,
        relation: explicit.has(data.id) ? 'Source, reviewed signal, assigned gap or evidence digest' : 'Exact source/signal reference; contextual notice only', matched_ids: matched});
    }
  }
  for (const article of editorial.records) {
    const matched = matchIds.filter(id => JSON.stringify(article).includes(JSON.stringify(id)));
    if (matched.length) targets.push({record_id: article.record_id, route: article.route, relation: 'Exact current-draft reference; independent approval unchanged', matched_ids: matched});
  }
  const namedFileIds = projectRegistry.records.filter(r => r.signal_ids.includes(prior.signal_id)).map(r => r.file_id);
  return {propagation_targets: targets, affected_record_ids: [...new Set(targets.map(t => t.record_id))],
    affected_routes: [...new Set(targets.map(t => t.route))], named_file_ids: namedFileIds};
}

export function assembleBacklogReview({review, prior, pin, checks, propagation, date}) {
  const checkedSources = new Set();
  for (const id of review.check_ids) {
    const check = checks.find(c => c.check_id === id);
    if (!check) throw new Error(`Unknown artifact check ${id}`);
    for (const source of check.source_ids) if (prior.source_ids.includes(source)) checkedSources.add(source);
  }
  if (prior.source_ids.some(id => !checkedSources.has(id))) throw new Error(`Unchecked source binding: ${review.backlog_item_id}`);
  if (review.next_check_date <= date) throw new Error(`Invalid next backlog check: ${review.review_id}`);
  const result = {...review, checked_date: date, signal_id: prior.signal_id, title: prior.title, route: prior.route,
    source_ids: prior.source_ids, reviewed_inputs: pin.inputs, ...propagation,
    state: 'Research checked — authorized disposition pending; publication and admissibility held',
    research_author: 'FTFN assisted research pass', human_reviewer: null, human_admission_authorized: false,
    publication_authorized: false, adjudication_complete: false, final_disposition: null,
    phase_60_gate_decision: false, source_profile_dates_changed: false};
  return {...result, sha256: backlogHash(JSON.stringify(result))};
}
