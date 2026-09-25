import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
import {placeIdentityNotes, placeIdentityTitle, placeIdentityFollowups, placeIdentityReview} from '../src/lib/place-identity-reviews.mjs';
import history from '../src/data/phase-178-systems-atlas-and-compendium-depth-expansion.json' with {type:'json'};
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const read = p => readFile(join(root, p), 'utf8');
for (const r of [...history.place_system_dossiers, ...history.comparison_overlays, ...history.interpretive_essays]) {
  const html = await read(`${r.route}index.html`), text = decodeHtmlText(html);
  const notes = placeIdentityNotes(r);
  const followups = placeIdentityFollowups(r);
  assert.equal((html.match(/data-place-identity-followup=/g) ?? []).length, followups.length, r.route);
  for (const followup of followups) {
    for (const key of ['title','checked_date','finding','geographic_scope','next_artifact','review_state']) assert(text.includes(followup[key]),`${r.route}: missing follow-up ${key}`);
    for (const source of followup.sources) {
      assert(html.includes(source.url),`${r.route}: missing follow-up source`);
      for (const value of [source.title,source.locator,source.access]) assert(text.includes(value));
    }
  }
  assert.equal((html.match(/data-place-identity-notice/g) ?? []).length, 1, r.route);
  assert.equal((html.match(/data-place-identity="/g) ?? []).length, notes.length, r.route);
  assert(text.includes(placeIdentityReview.boundary));
  for (const n of notes) {
    for (const value of [n.historical_label,n.finding,n.geographic_scope,n.next_artifact]) assert(text.includes(value), `${r.route}: missing ${value}`);
    for (const key of n.source_keys) {
      const source = placeIdentityReview.sources.find(s => s.key === key);
      assert(html.includes(source.url));
      assert(text.includes(source.locator) && text.includes(source.access));
    }
  }
  const title = placeIdentityTitle(r);
  if (title) {
    assert(text.includes(r.title), 'Original heading provenance missing');
    assert(decodeHtmlText(html.match(/<title>(.*?)<\/title>/s)[1]).includes(title));
    assert(decodeHtmlText(html.match(/<h1[^>]*>(.*?)<\/h1>/s)[1]).includes(title));
  }
  assert(html.includes('/data/place-identity-reviews.json'));
}
const hub = await read(`${history.routes.hub}index.html`);
assert.equal((hub.match(/data-place-identity-card=/g) ?? []).length, 22);
assert.equal((hub.match(/data-place-identity-followup-card=/g) ?? []).length, 4);
for (const followup of placeIdentityReview.followups) assert(decodeHtmlText(hub).includes(followup.card_summary));
for (const n of placeIdentityReview.records) assert(decodeHtmlText(hub).includes(n.finding));
assert.deepEqual(JSON.parse(await read('/data/place-identity-reviews.json')), placeIdentityReview);
assert((await read('/data/index.html')).includes('/data/place-identity-reviews.json'));
assert.deepEqual(JSON.parse(await read(history.routes.public_export)), history);
const update = await read('/updates/update-2026-09-22-place-identity-review/index.html');
assert(decodeHtmlText(update).includes('Essex Junction'));
const laterUpdate = decodeHtmlText(await read('/updates/update-2026-09-25-vermont-planning-geography/index.html'));
assert(laterUpdate.includes('Williston') && laterUpdate.includes('draft planning map'));
console.log('Place identity output verified: ten preserved dossier notes, twelve related pages, four dated follow-up projections/cards, both updates and exact JSON; historical export unchanged. No browser or independent acceptance claimed.');
