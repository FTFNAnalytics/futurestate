import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {parse} from 'parse5';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
import {placeIdentityNotes, placeIdentityTitle, placeIdentityFollowups, placeIdentityReview} from '../src/lib/place-identity-reviews.mjs';
import history from '../src/data/phase-178-systems-atlas-and-compendium-depth-expansion.json' with {type:'json'};
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const read = p => readFile(join(root, p), 'utf8');
const attr=(node,key)=>node.attrs?.find(a=>a.name===key)?.value;
const all=(node,predicate)=>[...(predicate(node)?[node]:[]),...(node.childNodes??[]).flatMap(child=>all(child,predicate))];
const visible=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(visible).join('');
for (const r of [...history.place_system_dossiers, ...history.comparison_overlays, ...history.interpretive_essays]) {
  const html = await read(`${r.route}index.html`), text = decodeHtmlText(html);
  const dom=parse(html);
  const notes = placeIdentityNotes(r);
  const followups = placeIdentityFollowups(r);
  assert.equal((html.match(/data-place-identity-followup=/g) ?? []).length, followups.length, r.route);
  const followupNodes=all(dom,node=>attr(node,'data-place-identity-followup')!==undefined);
  assert.deepEqual(followupNodes.map(node=>attr(node,'data-place-identity-followup')),followups.map(f=>f.review_id));
  for (const followup of followups) {
    const node=followupNodes.find(node=>attr(node,'data-place-identity-followup')===followup.review_id);
    const content=visible(node),hrefs=all(node,n=>n.tagName==='a').map(n=>attr(n,'href'));
    for (const key of ['title','checked_date','finding','geographic_scope','next_artifact','review_state']) assert(content.includes(followup[key]),`${r.route}: missing follow-up ${key}`);
    for (const source of followup.sources) {
      assert(hrefs.includes(source.url),`${r.route}: missing follow-up source`);
      for (const value of [source.title,source.source_date,source.locator,source.access]) assert(content.includes(value));
    }
    if(followup.parcel_records){
      const tables=all(node,n=>attr(n,'data-parcel-identifiers')===followup.review_id);assert.equal(tables.length,1);
      const rows=all(tables[0],n=>n.tagName==='tr').map(tr=>all(tr,n=>['td','th'].includes(n.tagName)).map(visible));
      assert.deepEqual(rows,[['Municipality in source','Parcel ID','Grand-list SPAN','GLYEAR','YEAR'],...followup.parcel_records.map(row=>[row.municipality,row.parcel_id,row.grand_list_span,String(row.grand_list_year),String(row.source_year)])]);
      assert(all(tables[0],n=>n.tagName==='th').every(n=>['row','col'].includes(attr(n,'scope'))));
      assert(visible(all(tables[0],n=>n.tagName==='caption')[0]).includes('not a fab-boundary table'));
      assert(content.includes(followup.query_scope.where)&&content.includes(followup.query_scope.boundary));
      const municipal=all(node,n=>attr(n,'data-municipal-parcel-match')===followup.review_id);assert.equal(municipal.length,1);
      for(const value of [followup.municipal_record.grand_list_year,followup.municipal_record.reported_owner,followup.municipal_record.parcel_id_parts.join(' / '),followup.municipal_record.e911_number,followup.municipal_record.street,followup.municipal_record.grand_list_span])assert(visible(municipal[0]).includes(String(value)));
      assert(visible(municipal[0]).includes('does not locate the fab within that parcel'));
    }
  }
  assert.equal(all(dom,n=>attr(n,'data-parcel-identifiers')!==undefined).length,followups.filter(f=>f.parcel_records).length);
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
assert.equal((hub.match(/data-place-identity-followup-card=/g) ?? []).length, 8);
for (const followup of placeIdentityReview.followups) assert(decodeHtmlText(hub).includes(followup.card_summary));
for (const n of placeIdentityReview.records) assert(decodeHtmlText(hub).includes(n.finding));
assert.deepEqual(JSON.parse(await read('/data/place-identity-reviews.json')), placeIdentityReview);
assert((await read('/data/index.html')).includes('/data/place-identity-reviews.json'));
assert.deepEqual(JSON.parse(await read(history.routes.public_export)), history);
const update = await read('/updates/update-2026-09-22-place-identity-review/index.html');
assert(decodeHtmlText(update).includes('Essex Junction'));
const laterUpdate = decodeHtmlText(await read('/updates/update-2026-09-25-vermont-planning-geography/index.html'));
assert(laterUpdate.includes('Williston') && laterUpdate.includes('draft planning map'));
const parcelUpdate=decodeHtmlText(await read('/updates/update-2026-09-25-vermont-parcel-identifiers/index.html'));
assert(parcelUpdate.includes('Essex Town')&&parcelUpdate.includes('does not identify the fab footprint'));
console.log('Place identity output verified: ten preserved dossier notes, twelve related pages, two dated follow-ups on four exact readers, eight follow-up card notices, four exact semantic parcel tables with separate 2026 rows, three updates and exact JSON; historical export unchanged. No browser, identity admission or independent accessibility acceptance claimed.');
