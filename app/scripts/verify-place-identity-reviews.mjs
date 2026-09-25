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
    if(followup.municipal_records){
      const tables=all(node,n=>attr(n,'data-essex-municipal-identifiers')===followup.review_id);assert.equal(tables.length,1);
      const rows=all(tables[0],n=>n.tagName==='tr').map(tr=>all(tr,n=>['td','th'].includes(n.tagName)).map(visible));
      assert.deepEqual(rows,[['Municipal source','Parcel ID','Tax map #','SPAN','E911 number / suffix / street'],...followup.municipal_records.map(row=>[row.municipality,row.parcel_id,row.tax_map_id,row.grand_list_span,`${row.e911_number} / ${row.e911_suffix} / ${row.street}`])]);
      assert.equal(all(tables[0],n=>n.tagName==='th'&&attr(n,'scope')==='col').length,5);
      assert.equal(all(tables[0],n=>n.tagName==='th'&&attr(n,'scope')==='row').length,2);
      assert.equal(visible(all(tables[0],n=>n.tagName==='caption')[0]),'Separate 2026 municipal records — not a fab-boundary table');
      const region=tables[0].parentNode;assert.equal(attr(region,'role'),'region');assert.equal(attr(region,'tabindex'),'0');assert.equal(attr(region,'aria-label'),'Separate 2026 Essex municipal parcel records');
      const periods=all(node,n=>attr(n,'data-municipal-period')===followup.review_id);assert.equal(periods.length,1);
      assert(visible(periods[0]).includes(followup.period_note));
      const times=all(periods[0],n=>n.tagName==='time');assert.equal(times.length,1);assert.equal(attr(times[0],'datetime'),followup.owner_name_period);assert.equal(visible(times[0]),followup.owner_name_period);
      const owners=all(node,n=>attr(n,'data-municipal-owner')===followup.review_id);assert.equal(owners.length,1);
      assert.equal(visible(owners[0]),`Reported owner in both rows: ${followup.municipal_records[0].reported_owner}.`);
      assert(content.includes(followup.identifier_note));
    }
    if(followup.source_contexts){
      const contexts=all(node,n=>attr(n,'data-facility-source-context')!==undefined);
      assert.deepEqual(contexts.map(n=>attr(n,'data-facility-source-context')),followup.source_contexts.map(c=>c.key));
      for(const [i,context]of followup.source_contexts.entries()){
        const region=contexts[i];assert.equal(visible(all(region,n=>n.tagName==='h5')[0]),context.label);
        assert(visible(region).includes(context.statement));assert(visible(region).includes(`Physical PDF pages ${context.physical_pages.join(', ')}.`));
        assert.deepEqual(all(region,n=>n.tagName==='a').map(n=>attr(n,'href')),[followup.sources.find(s=>s.key===context.source_key).url]);
        assert.deepEqual(all(region,n=>n.tagName==='a').map(visible),[followup.sources.find(s=>s.key===context.source_key).title]);
      }
      const discrepancy=all(node,n=>attr(n,'data-facility-discrepancy')===followup.review_id);assert.equal(discrepancy.length,1);
      assert.equal(visible(discrepancy[0]),'Parcel/location reconciliation: Unresolved.');
      const extentNote=all(node,n=>attr(n,'data-facility-extent-note')===followup.review_id);assert.equal(extentNote.length,1);assert.equal(visible(extentNote[0]),followup.extent_note);
      const tables=all(node,n=>attr(n,'data-facility-extents')===followup.review_id);assert.equal(tables.length,1);
      assert.deepEqual(all(tables[0],n=>n.tagName==='tr').map(tr=>all(tr,n=>['td','th'].includes(n.tagName)).map(visible)),[['Extent described','Source-reported area','Physical PDF page'],...followup.extent_records.map(row=>[row.extent,row.source_value,String(row.physical_page)])]);
      assert.equal(visible(all(tables[0],n=>n.tagName==='caption')[0]),'Different source extents — not verified fab or current parcel areas');
      for(const scope of ['row','col'])assert.equal(all(tables[0],n=>n.tagName==='th'&&attr(n,'scope')===scope).length,3);
      assert.equal(attr(tables[0].parentNode,'role'),'region');assert.equal(attr(tables[0].parentNode,'tabindex'),'0');assert.equal(attr(tables[0].parentNode,'aria-label'),'Distinct source-reported solar extents');
    }
  }
  assert.equal(all(dom,n=>attr(n,'data-facility-extents')!==undefined).length,followups.filter(f=>f.source_contexts).length);
  assert.equal(all(dom,n=>attr(n,'data-facility-source-context')!==undefined).length,followups.reduce((n,f)=>n+(f.source_contexts?.length??0),0));
  assert.equal(all(dom,n=>attr(n,'data-parcel-identifiers')!==undefined).length,followups.filter(f=>f.parcel_records).length);
  assert.equal(all(dom,n=>attr(n,'data-essex-municipal-identifiers')!==undefined).length,followups.filter(f=>f.municipal_records).length);
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
assert.equal((hub.match(/data-place-identity-followup-card=/g) ?? []).length, 16);
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
const municipalUpdate=decodeHtmlText(await read('/updates/update-2026-09-25-essex-municipal-identifiers/index.html'));
assert(municipalUpdate.includes('April 1, 2026')&&municipalUpdate.includes('No fab footprint or current ownership is established'));
const facilityUpdate=decodeHtmlText(await read('/updates/update-2026-09-25-vermont-facility-geography/index.html'));
assert(facilityUpdate.includes('discrepancy remains unresolved')&&facilityUpdate.includes('no current fab boundary is verified'));
console.log('Place identity output verified: ten preserved dossier notes, twelve related pages, four dated follow-ups on four exact readers, sixteen follow-up card notices, exact state/municipal tables and four extent tables with sixteen located source contexts, explicit unresolved discrepancy, five updates and exact JSON; historical export unchanged. No browser, identity admission or independent accessibility acceptance claimed.');
