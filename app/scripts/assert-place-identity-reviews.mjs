import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {placeIdentityNotes, placeIdentityTitle, placeIdentityFollowups, placeIdentityReview as review} from '../src/lib/place-identity-reviews.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFile(join(root, p));
const historyBytes = await read('src/data/phase-178-systems-atlas-and-compendium-depth-expansion.json');
assert.equal(createHash('sha256').update(historyBytes).digest('hex'), 'dc1790751b66dcf48a7829738826e5051ebbaad66eed1169cc628af26b8cf4f4');
const history = JSON.parse(historyBytes);
assert.equal(review.records.length, 10);
assert.equal(new Set(review.records.map(r => r.record_id)).size, 10);
assert.equal(new Set(review.records.map(r => r.route)).size, 10);
assert.equal(review.sources.length, 9);
assert.equal(new Set(review.sources.map(s => s.key)).size, 9);
assert.equal(review.checked_date, '2026-09-22');
const sourceKeys = new Set(review.sources.map(s => s.key));
for (const r of review.records) {
  const original = history.place_system_dossiers.find(d => d.place_system_dossier_id === r.record_id);
  assert(original);
  assert.equal(r.historical_label, original.place_identity);
  assert.equal(r.route, original.route);
  assert.deepEqual(placeIdentityNotes(original), [r]);
  assert(r.source_keys.length && r.source_keys.every(k => sourceKeys.has(k)));
  for (const k of ['canonical_id','independent_identity_decision','full_v1_acceptance']) assert.equal(r[k], null);
  for (const k of ['finding','geographic_scope','next_artifact']) assert(r[k].length > 40);
  assert.deepEqual(placeIdentityNotes({...original, route:'/unrelated/'}), []);
  assert.deepEqual(placeIdentityNotes({title:original.title, route:original.route}), []);
  assert.deepEqual(placeIdentityNotes({atlas_project_id:r.record_id, route:r.route}), []);
}
for (const r of [...history.comparison_overlays, ...history.interpretive_essays]) {
  assert.deepEqual(placeIdentityNotes(r).map(n => n.record_id), r.dossier_ids);
  assert.equal(placeIdentityTitle(r), null);
  assert.deepEqual(placeIdentityNotes({...r, route:'/unrelated/',dossier_ids:['178-DOSSIER-004']}), []);
}
assert.deepEqual(placeIdentityNotes({dossier_ids:['178-DOSSIER-004']}), []);
const vermont = review.records.find(r => r.record_id === '178-DOSSIER-004');
assert.equal(review.records.filter(r => r.current_title !== null).length, 1);
for (const term of ['Burlington','Essex Junction','entire campus boundary']) assert(vermont.finding.includes(term));
assert.match(review.records.at(-1).finding, /August 1.*July-to-September.*historical/);
assert.match(review.sources.find(s => s.key === 'pmt-2025').access, /historical proposal.*not verification/);
const update = JSON.parse(await read('src/content/updates/2026-09-22-place-identity-review.json'));
const all = [...history.place_system_dossiers, ...history.comparison_overlays, ...history.interpretive_essays];
const id = r => r.place_system_dossier_id ?? r.comparison_overlay_id ?? r.interpretive_essay_id;
assert.deepEqual(update.affected_record_ids, all.map(id));
assert.deepEqual(update.related_paths, [history.routes.hub, ...all.map(r => r.route), '/data/place-identity-reviews.json']);
assert.equal(update.effective_date, review.checked_date);
assert.equal(update.receipt_id, '210-PLACE-SCOPE-2026-09-22');
const {followups, ...baseline} = review;
assert.equal(createHash('sha256').update(JSON.stringify(baseline)).digest('hex'), 'c6d008d3d7c184788133e060609a0795f63bb235c350d685ba72db35ceb4831e', 'September 22 notes and source observations must remain unchanged.');
assert.equal(followups.length, 1);
const followup = followups[0];
assert.equal(followup.review_id, '210-PLACE-VERMONT-2026-09-25');
assert.equal(followup.record_id, '178-DOSSIER-004');
assert.equal(followup.checked_date, '2026-09-25');
assert.deepEqual(followup.sources.map(s => s.source_date), ['2025-06-01','2025-06-23']);
assert.deepEqual(followup.sources.map(s => s.sha256), ['5b3a9a2cda3965dc7694f215720201c6a370ab6aa6db3555b524e409fcc799ef','cd037970c9ca9a5283ffe4db1c62cefd9e31b4c1fb793e35c268bf128bab17ba']);
for (const k of ['canonical_id','independent_identity_decision','full_v1_acceptance']) assert.equal(followup[k], null);
assert.match(followup.finding,/June 1, 2025.*Williston.*June 23.*draft/);
assert.match(followup.geographic_scope,/draft planning map, not a zoning map/);
assert.match(followup.next_artifact,/Do not infer a sale, rezoning, permit/);
const expectedIds = ['178-DOSSIER-004','178-OVERLAY-02','178-OVERLAY-08','178-ESSAY-04'];
const affected = all.filter(r => expectedIds.includes(id(r)));
for (const r of all) {
  assert.deepEqual(placeIdentityFollowups(r), expectedIds.includes(id(r)) ? [followup] : []);
  assert.deepEqual(placeIdentityFollowups({...r,route:'/unrelated/',dossier_ids:['178-DOSSIER-004']}), []);
  assert.deepEqual(placeIdentityFollowups({title:r.title,route:r.route,dossier_ids:['178-DOSSIER-004']}), []);
}
const laterUpdate = JSON.parse(await read('src/content/updates/2026-09-25-vermont-planning-geography.json'));
assert.deepEqual(laterUpdate.affected_record_ids, expectedIds);
assert.deepEqual(laterUpdate.related_paths, [history.routes.hub,...affected.map(r=>r.route),'/data/place-identity-reviews.json']);
assert.equal(laterUpdate.receipt_id, followup.review_id);
assert.equal(laterUpdate.effective_date, followup.checked_date);
console.log('Place identity source checks passed: ten preserved notes; one dated Vermont follow-up with two exact PDF pins, four exact related records, draft/survey limits and no transferred identity or acceptance.');
