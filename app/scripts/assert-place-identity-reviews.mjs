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
assert.equal(followups.length, 2);
assert.equal(createHash('sha256').update(JSON.stringify({...review,followups:followups.slice(0,1)})).digest('hex'),'451a07496caa1db11042d40340cb541593f2cb08db1a1e717cae0e2a58438553','The complete earlier geographic payload must remain unchanged.');
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
  assert.deepEqual(placeIdentityFollowups(r), expectedIds.includes(id(r)) ? followups : []);
  assert.deepEqual(placeIdentityFollowups({...r,route:'/unrelated/',dossier_ids:['178-DOSSIER-004']}), []);
  assert.deepEqual(placeIdentityFollowups({title:r.title,route:r.route,dossier_ids:['178-DOSSIER-004']}), []);
}
const laterUpdate = JSON.parse(await read('src/content/updates/2026-09-25-vermont-planning-geography.json'));
assert.deepEqual(laterUpdate.affected_record_ids, expectedIds);
assert.deepEqual(laterUpdate.related_paths, [history.routes.hub,...affected.map(r=>r.route),'/data/place-identity-reviews.json']);
assert.equal(laterUpdate.receipt_id, followup.review_id);
assert.equal(laterUpdate.effective_date, followup.checked_date);
const parcel = followups[1];
function checkParcelBoundary(r) {
  assert.equal(r.review_id,'210-PLACE-VERMONT-PARCELS-2026-09-25');
  assert.equal(r.record_id,'178-DOSSIER-004');assert.equal(r.checked_date,'2026-09-25');
  for(const key of ['canonical_id','independent_identity_decision','full_v1_acceptance']) assert.equal(r[key],null);
  for(const key of ['fab_boundary_verified','current_ownership_verified','complete_campus_inventory']) assert.equal(r[key],false);
  assert.equal(r.accepted_places_added,0);
  assert.equal(r.query_scope.where,"UPPER(OWNER1) LIKE '%GLOBALFOUNDRIES%'");
  assert.deepEqual(r.query_scope.out_fields,['OBJECTID','TOWN','TNAME','YEAR','GLYEAR','SOURCEDATE','MAPID','PARCID','SPAN','GLIST_SPAN','OWNER1','LOCAPROP','DESCPROP']);
  assert.equal(r.query_scope.return_geometry,false);assert.equal(r.query_scope.record_limit,50);
  assert.equal(r.query_scope.returned_rows,3);assert.equal(r.query_scope.transfer_limit_exceeded,false);
  assert.match(r.query_scope.boundary,/other owner spellings, secondary owners, leased sites/);
  assert.deepEqual(r.parcel_records.map(row=>[row.municipality,row.parcel_id,row.grand_list_span,row.grand_list_year,row.source_year,row.reported_owner]),[
    ['Williston','04010.027000','759-241-11611',2025,2025,'GLOBALFOUNDRIES U S 2 LLC'],
    ['Essex Town','2002008000','207-067-13089',2025,2024,'GLOBALFOUNDRIES US 2 LLC'],
    ['Essex Junction','1002008000','208-066-13088',2025,2024,'GLOBALFOUNDRIES US 2 LLC']
  ]);
  for(const row of r.parcel_records){
    assert.deepEqual(Object.keys(row).sort(),['municipality','parcel_id','grand_list_span','grand_list_year','source_year','source_date','location','reported_owner'].sort());
    assert.equal(row.source_date,'UNKNOWN');assert.equal(row.location,null);
  }
  assert.deepEqual(r.municipal_record,{municipality:'Williston',grand_list_year:2026,parcel_id_parts:['04010','027000'],reported_owner:'GLOBALFOUNDRIES U S 2 LLC',e911_number:'326',street:'IBM ROAD',grand_list_span:'759-241-11611',physical_pdf_page:43});
  assert.equal(r.municipal_record.grand_list_span,r.parcel_records[0].grand_list_span);
  assert.match(r.finding,/Essex Town is an additional corporate-property lead, not an established fab location/);
  assert.match(r.geographic_scope,/not a surveyed site, current legal title or complete campus inventory/);
  assert.match(r.geographic_scope,/YEAR has no explanatory definition/);
  assert.match(r.next_artifact,/Current municipal assessor records.*Essex Town and Essex Junction.*crosswalk/);
  assert.deepEqual(r.sources.map(s=>s.sha256),['29ba69b46c099589f7a5420d34ac565d81075f64e8e05211ec08d2b5423c683b','a6664fb2c6604f67b1a07940a518d1dbb493314060cd08bab5e7f99865e58b12','136e779f62bfab69c3241e20d758de9efdfdfb2a916a90152e20dd678070717a']);
  assert.deepEqual(r.sources.map(s=>s.bytes),[27860,2959,3649674]);
  const query = new URL(r.sources[1].url);
  assert.equal(query.origin,'https://maps.vtrans.vermont.gov');assert.equal(query.pathname,'/arcgis/rest/services/ROW/Parcels/MapServer/8/query');
  assert.equal(query.searchParams.get('where'),r.query_scope.where);
  assert.equal(query.searchParams.get('outFields'),r.query_scope.out_fields.join(','));
  assert.equal(query.searchParams.get('returnGeometry'),'false');assert.equal(query.searchParams.get('resultRecordCount'),'50');
  assert.equal(r.sources[2].document_pages,123);assert.deepEqual(r.sources[2].visually_checked_pages,[1,43]);
  assert.match(r.sources[2].access,/not a full-document, survey or current-title review/);
  assert.match(r.sources[2].source_date,/2026 grand list.*exact legal effective date not inferred/);
}
checkParcelBoundary(parcel);
const rejected = [
  r=>r.fab_boundary_verified=true,
  r=>r.current_ownership_verified=true,
  r=>r.complete_campus_inventory=true,
  r=>r.accepted_places_added=3,
  r=>r.canonical_id='invented-place',
  r=>r.independent_identity_decision='Accepted',
  r=>r.full_v1_acceptance=true,
  r=>r.checked_date='2099-01-01',
  r=>r.record_id='178-DOSSIER-003',
  r=>r.parcel_records[1].source_year=2026,
  r=>r.parcel_records[0].source_date='2026-09-25',
  r=>r.parcel_records[0].geometry={rings:[]},
  r=>r.parcel_records[0].tax=123,
  r=>r.municipal_record.grand_list_span=r.parcel_records[1].grand_list_span,
  r=>r.query_scope.out_fields.push('ADDRGL1'),
  r=>r.query_scope.return_geometry=true,
  r=>r.finding=r.finding.replace('not an established fab location','the verified fab location'),
  r=>r.sources[2].visually_checked_pages=[1,43,44],
  r=>r.sources[1].sha256='0'.repeat(64)
];
for(const mutate of rejected){const fixture=structuredClone(parcel);mutate(fixture);assert.throws(()=>checkParcelBoundary(fixture));}
const parcelUpdate=JSON.parse(await read('src/content/updates/2026-09-25-vermont-parcel-identifiers.json'));
assert.deepEqual(parcelUpdate.affected_record_ids,expectedIds);
assert.deepEqual(parcelUpdate.related_paths,laterUpdate.related_paths);
assert.equal(parcelUpdate.receipt_id,parcel.review_id);
assert.equal(parcelUpdate.effective_date,parcel.checked_date);assert.equal(parcelUpdate.source_checked_date,parcel.checked_date);
console.log('Place identity source checks passed: ten original notes and the first planning follow-up preserved; additive three-row parcel result and separate 2026 municipal row, exact source pins and four related readers; 19 negative boundary fixtures rejected. No fab boundary, current-title or portfolio admission.');
