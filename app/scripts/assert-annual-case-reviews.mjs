import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {annualCaseReviews, annualCaseReview, applyAnnualCaseReview, annualReviewContexts, annualCaseOverview, annualCaseTitle, annualReviewDate, annualReviewVersions} from '../src/lib/annual-case-reviews.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {searchReaders} from '../src/lib/reader-search.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const raw = p => readFile(join(root, p), 'utf8');
const json = async p => JSON.parse(await raw(p));
const hash = value => createHash('sha256').update(value).digest('hex');
const pack = await json('src/data/phase-204-reader-completion.json');
const ops = await json('src/data/phase-207-current-operations.json');
const evidence = await json('src/data/phase-60-current-decisions.json');
const sources = await Promise.all((await readdir(join(root, 'src/content/sources'))).filter(f => f.endsWith('.json')).map(f => json(`src/content/sources/${f}`)));
const sourceMap = new Map(sources.map(s => [s.id, s]));
const pairedIds = ['203-SYNTHESIS-01', '200-MONOGRAPH-01', '203-SYNTHESIS-03', '200-MONOGRAPH-03'];
const spacePairedIds = ['203-SYNTHESIS-06', '200-MONOGRAPH-06', '203-SYNTHESIS-08', '200-MONOGRAPH-08'];
const allPairedIds = [...pairedIds, ...spacePairedIds];
const citationIds = ['203-APPENDIX-01', '203-APPENDIX-02', '203-TOPIC-17', '203-TOPIC-06'];
const locatorIds = ['203-TOPIC-16','203-SYNTHESIS-04','200-MONOGRAPH-04','203-SYNTHESIS-11','200-MONOGRAPH-11'];
const waterLocatorIds = locatorIds.slice(1,3);
const financeLocatorIds = locatorIds.slice(3);
const locatorProfilePins = new Map([["source-161-usbr-colorado-river-2027-decision","dc54a7b42943f45035787dd49e87abdd5cc85e008e67609f3140f9855782e40c"],["source-161-nist-usa-rare-earth-june-2026","7d9562b9b4cbe279475dbbbae3955aef8a4eeccf19f10c81781f6761a6169d6a"],["source-56k-f15ex-ex16-portland-receipt-2026","3d539092bdbfcec4fbdb1057404cd85ee62f764460ae46b007d7ee72fa39ebda"]]);
for(const [id,pin] of locatorProfilePins) assert.equal(hash(await raw('src/content/sources/'+id+'.json')),pin,'Locator source profile drift');
const batteryIds = ['203-SYNTHESIS-08','200-MONOGRAPH-08','203-CASE-11','203-CASE-13','203-SYNTHESIS-10','200-MONOGRAPH-10'];
const revisedBatteryIds = batteryIds.slice(0,2), newBatteryIds = batteryIds.slice(2);
const batteryPairIds = batteryIds.filter(id=>!id.includes('CASE'));
const nevadaIds = ['203-SYNTHESIS-10','200-MONOGRAPH-10'];
const nevadaSourceId = 'source-ndep-rhyolite-ridge-water-permit-2025';
const nevadaProfilePin = '854449efc992d0e8922bebc6a1c9f1585156ab43ce2e5df33951c3095a28041c';
assert.equal(hash(await raw('src/content/sources/'+nevadaSourceId+'.json')),nevadaProfilePin,'Nevada source profile drift');
const batteryProfilePins = new Map([["source-56d-gateway-cpuc-resolution-e5428-2025","ed28a8e479c954305d2728c2c88eb1622824d73497d9622aa589970fbe68900c"],["source-56e-vbb-esv-fire-findings-2021","2bd1158cbb185a960f8e162c87a9c32e5e2a494d0812c08edf7ed8f45720dc43"],["source-56e-vbb-esv-investigations","48a4d3faee061d6d552a1e9310dff45aab12b301f2ed1c1fbaa767cb8f6b7ad5"],["source-56e-vbb-aemo-registration-2021","f338eb86406b67fe26271ca8d63a6c598b6b0f2f5d82af4cd9d6e34a762a5773"],["source-56e-vbb-aemo-operational-2021","c99570e1aab3515ec9968954dd3775469afed0c8f81b5b82f224105c9330d9d1"]]);
for (const [id,pin] of batteryProfilePins) assert.equal(hash(await raw('src/content/sources/'+id+'.json')),pin,'Retained battery source profile drift');
const laterIds = [...allPairedIds, ...citationIds, ...locatorIds, ...newBatteryIds];
const expectedIds = ['203-CASE-02', '203-CASE-12', '203-CASE-14', '203-CASE-04', '203-CASE-16', '203-CASE-03', '203-CASE-18', ...laterIds];
const citationSources = new Map([["203-APPENDIX-01","source-161-lbnl-data-center-energy-usage-2024"],["203-TOPIC-17","source-chandler-reclaimed-water-system"],["203-TOPIC-06","source-noaa-2025-global-climate-report"]]);
const citationProfilePins = new Map([["source-161-lbnl-data-center-energy-usage-2024","0a31c39d4b27d17075a368fb20ba2ff7f91b569594d3447cc3019c65c8edf7a6"],["source-noaa-2025-global-climate-report","dd8c9f18902e20b541696978d494fdaf7238849a6e453093262c1cd487b1c3bc"],["source-chandler-reclaimed-water-system","b21de1128514758b92beb9f446b31234794e249cd2d7c5657c280ce57912cf8a"]]);
for (const [id, pin] of citationProfilePins) assert.equal(hash(await raw('src/content/sources/'+id+'.json')), pin, 'Additional source profile bytes changed');
const originalReport = await json('src/data/phase-203-state-of-future-systems-2026.json');
const reportByteHash = hash(await raw('src/data/phase-203-state-of-future-systems-2026.json'));
assert.equal(reportByteHash, '5623c3d52263ab65628edc38d987dc33a31d19909312be1a282dd56c027d9021');
const readerByteHash = hash(await raw('src/data/phase-204-reader-completion.json'));
let expandedPairs = 0, subsetReaders = 0;
assert.equal(originalReport.report_package_records.length, 58);
assert.equal(new Set(originalReport.report_package_records.map(r=>r.report_record_id)).size, 58);
for (const contract of originalReport.report_package_records) {
  const article = pack.records.find(r=>r.record_id===contract.report_record_id);
  assert(article);
  const additional = article.source_ids.filter(id=>!contract.source_ids.includes(id));
  if (additional.length) {
    expandedPairs++;
    assert(contract.upstream_monograph_id);
    const pair = pack.records.find(r=>r.record_id===contract.upstream_monograph_id);
    assert(pair);
    assert.deepEqual(article.source_ids,pair.source_ids);
    assert.deepEqual(article.sections,pair.sections);
  } else subsetReaders++;
}
assert.equal(expandedPairs,12);assert.equal(subsetReaders,46);
const acquiredGoldenArtifacts = new Map([
  ['https://www.scc.virginia.gov/docketsearch/DOCS/8d5z01%21.PDF', '5c23200353d195cc79d4101681c7b0a7de9d8f60c17c726dac4c0a84db6d50ec'],
  ['https://www.scc.virginia.gov/docketsearch/DOCS/8dj_01%21.PDF', '0bee8f19fa878f11aff25982156fb74097dc9a3ad675eb913c9f978803640054'],
  ['https://www.scc.virginia.gov/docketsearch#caseDetails/146021', 'c550b8590b92c089246b0743813267f6addc967ac6f81fb85118bd338c4b1ca9'],
]);
assert.equal(hash(await raw('src/data/phase-204-reader-completion.json')), '38ffd8b3e44dc671dd6590f80658240b6e533c645e5cf5fc3e84f345009d9125');
assert.equal(hash(await raw('src/data/phase-205-216-current-editorial.json')), 'e2fd76e4b53e638523696fb47ed4ae04bc5d073d3b22e6731e02603078d1f230');
assert.equal(hash(await raw('src/data/phase-202-accessible-multilingual-low-bandwidth-editions.json')), '3f2d0494cc16dfb192f0ab909a0c035411c6884b0a4563528019ce8917416f26');

// Validate the declarations independently of the renderer; malformed declarations
// must fail before a build can turn a retained research finding into approval.
function assertBindings(data, history = pack, operations = ops, decisions = evidence) {
  assert.deepEqual(data.records.map(r => r.record_id), expectedIds);
  assert.equal(data.review_date, '2026-09-22');
  assert.equal(data.latest_review_date, '2026-09-23');
  const earlier = data.records.slice(0,24).map(r=>r.previous_review??r);
  assert.equal(hash(JSON.stringify(earlier)),'26a10cf4779189fc6f400c4bbdc68891aa3375cb339cc1139440448c6f4661b0','All prior 24 review versions must survive');
  assert.deepEqual(data.records.filter(r=>r.previous_review).map(r=>r.record_id),[...revisedBatteryIds,...nevadaIds]);
  const beforeRegistration = data.records.map(r=>nevadaIds.includes(r.record_id)?r.previous_review:r);
  assert.equal(hash(JSON.stringify(beforeRegistration)),'279f8656b2cb398ba28d5e09622953faf0c98710ca18d490c5bc04709a165cbc','All preceding Nevada-candidate reviews must survive exactly');
  const beforeNevada = beforeRegistration.map(r=>nevadaIds.includes(r.record_id)?r.previous_review:r);
  assert.equal(hash(JSON.stringify(beforeNevada)),'321c7d376bc49171c9d78c95c4dec234e15212d78f491be775e33e687056c564','All preceding 28 review records must survive exactly');
  assert.equal(hash(JSON.stringify(beforeNevada.filter(r=>batteryIds.includes(r.record_id)))),'e6d937131c4fbb3209128dc37a80c9a915361428439809cceba1d3543abd527d','Scoped battery declaration drift');
  assert.equal(hash(JSON.stringify(beforeRegistration.filter(r=>nevadaIds.includes(r.record_id)))),'1e3b3cc50653ce98a72dc0a598ecaeb360e53ba79c1345dea3f3a13fd3807edb','Scoped Nevada identity declaration drift');
  assert.equal(hash(JSON.stringify(data.records.filter(r=>nevadaIds.includes(r.record_id)))),'4be2d7e3dbd23dfaa5c7b97f5efd7ec3fc2cb441f316b054535c896f5241a932','Scoped registration/reserve declaration drift');
  for (const r of data.records.filter(r=>r.previous_review)) {
    assert.equal(annualReviewVersions(r).length,nevadaIds.includes(r.record_id)?3:2,'Complete preceding review chain required');
    if (!nevadaIds.includes(r.record_id)) assert.deepEqual(r.replacements[0],r.previous_review.replacements[0],'Earlier Space Coast correction lost');
    assert.deepEqual(r.retained_contexts,r.previous_review.retained_contexts,'Earlier renewal context lost');
  }
  assert.equal(hash(JSON.stringify(earlier.slice(0, 7))), '054c81854e26fe58f786b24050984d4b3e5ce34ca746b7a1a0453863cff1ab69', 'Earlier seven reviews changed');
  assert.equal(hash(JSON.stringify(earlier.slice(0, 11))), '4cf9116132695d46acc0e382bbd16f994ba7618e8c9c195603f2cb4a4a5a9c5c', 'Earlier eleven reviews changed');
  assert.equal(hash(JSON.stringify(earlier.slice(0, 15))), 'ca8db6563e3b2761aa22c5b422b38a09dda18536f3a81b4e1ee1dcccc11a27e8', 'Earlier fifteen reviews changed');
  assert.equal(hash(JSON.stringify(earlier.slice(0,19))), '8d9e4834f69e92d95ddeef6a81afd6f65c4b752a9e9cdd94ca737188b45f97d8', 'Earlier nineteen reviews changed');
  assert.equal(data.records.reduce((n, r) => n + r.replacements.length, 0), 49);
  assert.equal(data.records.filter(r => r.overview_replacement).length, 6);
  assert.equal(data.records.reduce((n, r) => n + (r.heading_replacements?.length ?? 0), 0), 1);
  for (const r of data.records) {
    const article = history.records.find(a => a.record_id === r.record_id);
    assert.equal(hash(JSON.stringify(article)), r.source_record_sha256, 'Article hash drift');
    assert.equal(readerCatalog.find(a => a.id === r.record_id).route, r.route, 'Canonical route drift');
    assert.equal(r.independent_article_review, false);
    assert.equal(r.approval_receipt_id, null);
    assert.equal(r.review_date, laterIds.includes(r.record_id) ? '2026-09-23' : undefined);
    if (nevadaIds.includes(r.record_id)) {
      assert.equal(r.update_id,'update-2026-09-23-annual-battery-registration-reserve');
      assert.deepEqual(r.replacements.slice(1,3),r.previous_review.replacements.slice(1),'Nevada and unaffected naming correction must remain intact');
      assert.deepEqual(r.overview_replacement,r.previous_review.overview_replacement);
      assert.deepEqual(r.related_readings,r.previous_review.related_readings);
      assert.equal(r.replacements.length,4);
      assert.equal(r.replacements[0].original_text,r.previous_review.replacements[0].original_text);
      assert(r.replacements[0].replacement_text.includes('National Electricity Market (NEM)'));
      assert(r.replacements[0].replacement_text.includes('separately contracted System Integrity Protection Scheme (SIPS) service'));
      assert(!r.replacements[0].replacement_text.includes('protection-scheme registration'));
      assert.equal(r.replacements[3].paragraph_index,1);
      assert.equal(r.replacements[3].section_heading,r.replacements[0].section_heading);
      assert(r.replacements[3].replacement_text.includes('neither announcement provides a later annual availability, dispatch or cycling series'));
      const nevada=r.previous_review;
      assert.equal(nevada.update_id,'update-2026-09-23-annual-nevada-permit-identity');
      assert.deepEqual(nevada.replacements.slice(0,-1),nevada.previous_review.replacements,'Earlier battery review must remain exact');
      const change=nevada.replacements.at(-1);
      assert(change.original_text.startsWith('The Nevada permit case does identify'));
      assert(change.replacement_text.includes('NEV2020107 (Renewal 2025, Revision 00), not Thacker Pass'));
      assert(change.replacement_text.includes('do not establish that operations began, an inspection passed or a violation occurred'));
      assert.equal(r.source_checks.length,3);
      const check=r.source_checks[0];
      assert.deepEqual(check,nevada.source_checks[0],'No fresh Nevada inspection claimed');
      assert.equal(hash(JSON.stringify(check)),'ecc27be06ebdd8ebdb6029719b3602b0030339a82d925901a7a5d48b5f1001bf');
      assert.equal(check.source_id,nevadaSourceId);
      assert.equal(check.source_profile_sha256,nevadaProfilePin);
      assert.equal(check.primary_checked_date,'2026-09-23');
      assert.equal(check.captured_sha256,'59e57f2cd151af476c0a7f6b1ca8534028be8c4b7c7c6767148b3819834152be');
      assert.deepEqual(check.visually_checked_pages,[1,2,3,14,15,16]);
      assert(!check.additional_source&&!check.retained_checked_date&&!check.checked_date);
      const aemo=r.source_checks.slice(1);
      assert.equal(hash(JSON.stringify(aemo)),'9b7589a8a97a3e327c16fa39a48a0356de042ceba276aa846bb12d8914586d6d');
      assert.deepEqual(aemo.map(c=>c.source_id),['source-56e-vbb-aemo-registration-2021','source-56e-vbb-aemo-operational-2021']);
      for(const c of aemo){
        assert.equal(c.source_profile_sha256,batteryProfilePins.get(c.source_id));
        assert.equal(c.primary_checked_date,'2026-09-23');
        assert(!c.captured_sha256&&!c.additional_source&&!c.retained_checked_date&&!c.checked_date);
      }
    }
    if (pairedIds.includes(r.record_id)) {
      assert.equal(r.update_id, 'update-2026-09-23-annual-golden-mars-paired-readings');
      assert.equal(hash(JSON.stringify(r.source_checks)), '99a14f6598f8e8c76e4a806179cdf0fb23e26c2bdcc36e48c091aff1c32b75b2', 'Retained September 22 checks changed');
      assert(r.summary.includes('not a new artifact retrieval'));
      assert.equal(r.replacements.length, r.record_id.endsWith('-01') ? 3 : 1);
    }
    if (spacePairedIds.includes(r.record_id)) {
      assert.equal(r.update_id, revisedBatteryIds.includes(r.record_id) ? 'update-2026-09-23-annual-battery-chronology' : 'update-2026-09-23-annual-space-coast-paired-readings');
      assert.deepEqual(r.source_checks, [], 'No fresh Space Coast inspection claimed');
      assert.deepEqual(r.retained_contexts, data.records[3].retained_contexts, 'Separate retained renewal binding changed');
      assert.equal(r.replacements.length, r.record_id.endsWith('-06') ? 4 : 3);
      assert(r.summary.includes('not a fresh FAA search'));
    }
    if (citationIds.includes(r.record_id)) {
      assert.equal(r.update_id,'update-2026-09-23-annual-citation-provenance-followthrough');
      assert.equal(r.replacements.length,1);
      assert.deepEqual(r.retained_contexts,[]);
      assert.equal(r.source_checks.length,citationSources.has(r.record_id)?1:0);
      if (r.record_id === '203-APPENDIX-02') {
        const context = r.local_provenance_context;
        assert.equal(context.checked_date,'2026-09-23');
        assert.deepEqual([context.report_records,context.expanded_pairs,context.remaining_subset_records],[58,12,46]);
        assert.deepEqual(context.artifacts.map(a=>[a.route,a.sha256]),[
          ['/data/phase-203-state-of-future-systems-2026.json',reportByteHash],
          ['/data/phase-204-reader-completion.json',readerByteHash]
        ]);
        assert(context.scope.includes('not independent verification'));
      } else assert(!r.local_provenance_context);
    }
    if (locatorIds.includes(r.record_id)) {
      assert.equal(r.update_id,'update-2026-09-23-annual-locators-acceptance-boundaries');
      if (r.record_id === '203-TOPIC-16') {
        assert.equal(r.replacements.length,1);
        assert.deepEqual(r.source_checks,[]);
        assert.deepEqual(r.related_readings.map(v=>v.record_id),['203-CASE-04']);
        assert.equal(r.retained_contexts[0].id,'receipt-60-slf-2026-09-15-renewal-discovered');
        assert.deepEqual(r.retained_contexts[0].matched_source_ids,[]);
        assert(r.retained_contexts[0].relation.includes('not part of the chapter'));
        assert(r.summary.includes('not a fresh FAA check'));
      } else if (waterLocatorIds.includes(r.record_id)) {
        assert.deepEqual(r.replacements,[]);
        assert.deepEqual(r.retained_contexts,[]);
        assert.equal(r.source_checks.length,1);
        assert.equal(r.source_checks[0].source_id,'source-161-usbr-colorado-river-2027-decision');
        assert.equal(r.source_checks[0].retained_checked_date,'2026-09-22');
        assert(!r.source_checks[0].primary_checked_date);
      } else {
        assert.equal(r.replacements.length,2);
        assert.deepEqual(r.source_checks.map(c=>c.source_id),['source-161-nist-usa-rare-earth-june-2026','source-56k-f15ex-ex16-portland-receipt-2026']);
        for(const c of r.source_checks) assert.equal(c.primary_checked_date,'2026-09-23');
        assert.deepEqual(r.related_readings.map(v=>v.record_id),['203-CASE-16']);
        assert.equal(r.retained_contexts[0].id,'211-F15EX-ACCESS-2026-09-22');
        assert.deepEqual(r.retained_contexts[0].matched_source_ids,[]);
        assert(r.retained_contexts[0].relation.includes('not the receiving-wing source'));
      }
      for(const c of r.source_checks) {
        assert.equal(c.source_profile_sha256,locatorProfilePins.get(c.source_id));
        assert(!c.additional_source && !c.checked_date,'Existing sources are not additional citations');
      }
    }
    const related = r.related_readings ?? [];
    assert.equal(related.length, r.record_id==='203-TOPIC-16'||financeLocatorIds.includes(r.record_id)||batteryPairIds.includes(r.record_id)?1:0);
    for(const linked of related) {
      assert.equal(linked.route,readerCatalog.find(a=>a.id===linked.record_id)?.route,'Wrong related-case route');
      assert(linked.label && linked.relation);
    }
    if (r.title_replacement) {
      assert.equal(r.record_id,'203-CASE-13');
      assert.equal(r.title_replacement.original_text,article.title);
      assert.equal(r.title_replacement.replacement_text,article.title.replace('Victoria Big Battery','Victorian Big Battery'));
      assert(r.title_replacement.reason);
    }
    if (r.overview_replacement) {
      assert(['203-CASE-04', '203-CASE-03', '203-CASE-18','203-CASE-13','203-SYNTHESIS-10','200-MONOGRAPH-10'].includes(r.record_id));
      assert.equal(r.overview_replacement.original_text, article.overview, 'Overview target drift');
      assert(r.overview_replacement.reason && r.overview_replacement.replacement_text !== article.overview);
    }
    for (const change of r.replacements) {
      const sections = article.sections.filter(s => s.heading === change.section_heading);
      assert.equal(sections.length, 1);
      assert.equal(sections[0].paragraphs[change.paragraph_index], change.original_text, 'Replacement target drift');
      assert(change.reason && change.replacement_text && change.replacement_text !== change.original_text);
    }
    for (const change of r.heading_replacements ?? []) {
      assert.equal(r.record_id, '203-CASE-18');
      assert.equal(article.sections.filter(s => s.heading === change.original_text).length, 1, 'Heading target drift');
      assert(change.reason && change.replacement_text && change.replacement_text !== change.original_text);
    }
    for (const check of r.source_checks) {
      if (check.additional_source === true) {
        assert.equal(check.source_id,citationSources.get(r.record_id),'Additional source is scoped to another article');
        assert(!article.source_ids.includes(check.source_id),'Additional source misrepresented as an original citation');
        assert.equal(check.source_profile_sha256,citationProfilePins.get(check.source_id),'Additional profile hash drift');
        assert.equal(check.checked_date,'2026-09-23');
        assert.equal(check.checked_date,annualReviewDate(r));
        assert(check.relation.includes('not part of the original'));
        assert(check.relation.includes('not a remote-page capture'));
      } else {
        assert(!citationSources.has(r.record_id),'Missing explicit additional-source marker');
        assert(article.source_ids.includes(check.source_id));
      }
      if (check.profile_url) {
        assert(['203-CASE-03', ...pairedIds].includes(r.record_id), 'Additional artifact is not scoped to a reviewed Golden-Mars reading');
        assert.equal(check.source_id, 'source-virginia-scc-golden-mars-2026');
        assert.equal(check.profile_url, sourceMap.get(check.source_id)?.url, 'Original source-profile URL drift');
        assert(acquiredGoldenArtifacts.has(check.url), 'Unknown additional artifact');
        assert.equal(check.captured_sha256, acquiredGoldenArtifacts.get(check.url), 'Acquired artifact hash drift');
        assert(check.relation);
      } else assert.equal(check.url, sourceMap.get(check.source_id)?.url, 'Checked source URL drift');
      assert(check.locator && check.access && check.finding);
    }
    assert.equal(r.retained_contexts.length, ['203-CASE-03', '203-CASE-18', ...pairedIds, ...citationIds, ...waterLocatorIds, ...newBatteryIds].includes(r.record_id) ? 0 : 1);
    for (const b of r.retained_contexts) {
      assert(['receipts', 'pilot_research_followups', 'evidence_receipts'].includes(b.collection));
      const receipt = (b.collection === 'evidence_receipts' ? decisions.receipts : operations[b.collection]).find(v => (v.receipt_id ?? v.review_id) === b.id);
      assert(receipt, 'Missing exact receipt');
      assert.equal(hash(JSON.stringify(receipt)), b.receipt_payload_sha256, 'Receipt hash drift');
      assert.equal(b.include_formal_artifact,r.record_id==='203-TOPIC-16'?true:undefined,'Formal artifact scope drift');
      if (b.include_formal_artifact) {
        assert.equal(b.collection,'evidence_receipts');
        assert.equal(receipt.formal_artifact.url,'https://drs.faa.gov/browse/excelExternalWindow/DRSDOCID152397580020231120183622.0001');
        assert.equal(receipt.source_checked_date,'2026-09-15');
        assert.equal(receipt.next_check_date,'2026-10-09');
      }
      assert((receipt.checked_date ?? receipt.source_checked_date) <= data.review_date);
      if (b.collection === 'evidence_receipts') {
        assert(receipt.decision_date <= data.review_date);
        assert.equal(receipt.independent_stage_admission, false);
        assert.equal(receipt.human_reviewer, null);
      } else assert.equal(receipt.independent_review_complete, false);
      assert.equal(receipt.publication_authorized, false);
      assert(b.relation);
      for (const id of b.matched_source_ids) {
        assert(article.source_ids.includes(id), 'Unmatched article source');
        if (['receipts', 'evidence_receipts'].includes(b.collection)) assert(receipt.checked_source_ids.includes(id), 'Context-only source cannot be presented as checked');
        else assert(receipt.source_checks.some(s => s.url === sourceMap.get(id)?.url), 'Retained artifact URL mismatch');
      }
      if (b.collection === 'receipts') assert.equal(b.route, `/updates/${receipt.update_id}/`);
      else if (b.collection === 'evidence_receipts') assert.equal(b.route, receipt.gate_route);
      else assert.equal(b.route, `/method/editorial-review/#${b.id}`);
      for (const url of b.additional_artifact_urls) {
        assert(receipt.source_checks.some(s => s.url === url), 'Missing additional artifact');
        assert(!article.source_ids.some(id => sourceMap.get(id)?.url === url), 'Additional artifact is an original cited source');
      }
    }
  }
  const [toronto, hornsdale, dalrymple, spaceCoast, f15ex, golden, current] = data.records;
  assert.deepEqual(toronto.retained_contexts[0].matched_source_ids, ['source-toronto-2026-sc33-9-item-history']);
  assert.equal(operations.receipts.find(r => r.receipt_id === toronto.retained_contexts[0].id).next_check_date, '2026-09-28');
  assert.equal(hornsdale.replacements.length, 0);
  assert.equal(hornsdale.source_checks.length, 0, 'No fresh Hornsdale check claimed');
  assert.deepEqual(dalrymple.retained_contexts[0].matched_source_ids, []);
  assert.deepEqual(dalrymple.retained_contexts[0].additional_artifact_urls, operations.pilot_research_followups.find(r => r.review_id === dalrymple.retained_contexts[0].id).source_checks.map(s => s.url));
  assert.deepEqual(dalrymple.source_checks[0].visually_checked_pages, [1, 2]);
  assert.equal(dalrymple.source_checks[0].captured_sha256, 'f431e507a48bb61c27247495e8365f9bb1e2b830c5b2145d0ca6bf41aaee7b99');
  assert.equal(spaceCoast.source_checks.length, 0, 'No new licence inspection claimed');
  assert.equal(spaceCoast.retained_contexts[0].id, 'receipt-60-slf-2026-09-15-renewal-discovered');
  assert.deepEqual(spaceCoast.retained_contexts[0].matched_source_ids, ['source-faa-shuttle-landing-facility-license']);
  assert.equal(decisions.receipts.find(r => r.receipt_id === spaceCoast.retained_contexts[0].id).next_check_date, '2026-10-09');
  assert.equal(f15ex.source_checks.length, 0); assert.equal(f15ex.replacements.length, 0); assert(!f15ex.overview_replacement);
  assert.deepEqual(f15ex.retained_contexts[0].matched_source_ids, ['source-56e-f15ex-production-resumes-2025']);
  assert.deepEqual(golden.source_checks.filter(c => c.profile_url).map(c => c.url), [...acquiredGoldenArtifacts.keys()]);
  assert.equal(golden.source_checks.length, 4);
  assert.deepEqual(golden.source_checks[0].visually_checked_pages, [4]);
  assert.deepEqual(golden.source_checks[1].visually_checked_pages, [1, 2]);
  assert(golden.replacements[0].replacement_text.includes('Under Appeal'));
  assert(golden.replacements[0].replacement_text.includes('January 1, 2027'));
  assert(golden.replacements[1].replacement_text.includes('Supreme Court docket and appeal merits were not inspected'));
  assert.equal(current.source_checks.length, 1);
  assert.equal(current.source_checks[0].url, 'https://regionalcouncils.ny.gov/cfa/project/51146');
  assert(current.replacements[0].replacement_text.includes('CFA 19418'));
  assert(current.replacements[0].replacement_text.includes('Black - Cancelled/Declined'));
  assert(current.replacements[0].replacement_text.includes('Zero grant disbursement is not zero private investment'));
}
assertBindings(annualCaseReviews);
for (const mutate of [
  d => { d.records[0].approval_receipt_id = 'invented'; },
  d => { d.records[0].independent_article_review = true; },
  d => { d.records[0].route = '/reference/unrelated/'; },
  d => { d.records[0].source_record_sha256 = '0'.repeat(64); },
  d => { d.records[0].replacements[0].original_text = 'wrong paragraph'; },
  d => { d.records[0].retained_contexts[0].id = 'unknown'; },
  d => { d.records[0].retained_contexts[0].receipt_payload_sha256 = '0'.repeat(64); },
  d => { d.records[0].retained_contexts[0].matched_source_ids.push('source-toronto-development-pipeline-2025'); },
  d => { d.records[1].retained_contexts[0].matched_source_ids = [pack.records.find(a => a.record_id === '203-CASE-12').source_ids.find(id => id !== 'source-56j-hornsdale-h1-2024-operations')]; },
  d => { d.records[2].retained_contexts[0].additional_artifact_urls[0] = d.records[2].source_checks[0].url; },
  d => { d.records[3].overview_replacement.original_text = 'wrong overview'; },
  d => { d.records[3].retained_contexts[0].matched_source_ids.push('source-faa-slc40-final-ea'); },
  d => { d.records[3].retained_contexts[0].route = '/wrong-gate/'; },
  d => { d.records[3].retained_contexts[0].collection = 'receipts'; },
  d => { d.records[4].retained_contexts[0].matched_source_ids = ['source-56e-f15ex-gao-2025']; },
  d => { d.records[5].source_checks[0].url = 'https://www.scc.virginia.gov/about-the-scc/scc-facts/'; },
  d => { d.records[5].source_checks[0].source_id = 'source-virginia-scc-large-load-gs5-2025'; },
  d => { d.records[5].source_checks[0].captured_sha256 = '0'.repeat(64); },
  d => { delete d.records[5].source_checks[0].profile_url; },
  d => { d.records[5].source_checks[2].url = 'https://www.scc.virginia.gov/docketsearch#caseDetails/146025'; },
  d => { d.records[6].heading_replacements[0].original_text = 'unmatched heading'; },
  d => { d.records[6].heading_replacements.push(d.records[6].heading_replacements[0]); },
  d => { d.records[6].source_checks[0].url = 'https://regionalcouncils.ny.gov/cfa/project/19418'; },
  d => { d.records[7].review_date = '2026-09-22'; },
  d => { d.records[7].source_checks[0].finding = 'Invented fresh inspection'; },
  d => { d.records[8].replacements[0].original_text = 'Wrong paired paragraph'; },
  d => { d.records[9].approval_receipt_id = 'invented-paired-approval'; },
  d => { d.records[10].route = d.records[9].route; },
  d => { d.records[11].review_date = '2026-09-22'; },
  d => { d.records[11].retained_contexts[0].id = 'receipt-60-slf-2026-08-15-no-material-change'; },
  d => { d.records[12].source_checks.push({source_id:'invented'}); },
  d => { d.records[13].replacements[0].original_text = 'Wrong paired paragraph'; },
  d => { d.records[14].approval_receipt_id = 'invented-space-approval'; },
  d => { d.records[15].source_checks[0].source_id = 'source-161-lbnl-queued-up-2026'; },
  d => { d.records[15].source_checks[0].additional_source = false; },
  d => { d.records[16].local_provenance_context.expanded_pairs = 0; },
  d => { d.records[16].local_provenance_context.artifacts[0].sha256 = '0'.repeat(64); },
  d => { d.records[17].source_checks[0].source_profile_sha256 = '0'.repeat(64); },
  d => { d.records[17].source_checks[0].url = 'https://example.invalid/unrelated-water'; },
  d => { d.records[18].source_checks[0].checked_date = '2026-09-01'; },
  d => { d.records[18].approval_receipt_id = 'invented-climate-review'; },
  d => { d.records[19].retained_contexts[0].matched_source_ids = ['source-nasa-moon-to-mars-architecture-rev-c-2025']; },
  d => { d.records[19].retained_contexts[0].include_formal_artifact = false; },
  d => { d.records[19].related_readings[0].route = '/unrelated/'; },
  d => { d.records[19].related_readings[0].record_id = '203-CASE-16'; },
  d => { d.records[20].source_checks[0].retained_checked_date = '2026-09-23'; },
  d => { d.records[20].source_checks[0].primary_checked_date = '2026-09-23'; },
  d => { d.records[21].source_checks[0].source_profile_sha256 = '0'.repeat(64); },
  d => { d.records[21].source_checks[0].url = 'https://example.invalid/other-study'; },
  d => { d.records[22].source_checks[0].primary_checked_date = '2026-09-22'; },
  d => { d.records[22].retained_contexts[0].matched_source_ids = ['source-56k-f15ex-ex16-portland-receipt-2026']; },
  d => { d.records[23].approval_receipt_id = 'invented-finance-approval'; },
  d => { d.records[23].related_readings[0].record_id = '203-CASE-04'; },
  d => { delete d.records[13].previous_review; },
  d => { d.records[13].previous_review.summary = 'lost provenance'; },
  d => { d.records[13].replacements[0].replacement_text = 'lost earlier correction'; },
  d => { d.records[24].source_checks[0].captured_sha256 = '0'.repeat(64); },
  d => { d.records[25].title_replacement.original_text = 'wrong title'; },
  d => { d.records[25].source_checks[2].retained_checked_date = '2026-09-23'; },
  d => { d.records[26].approval_receipt_id = 'invented-battery-approval'; },
  d => { d.records[27].overview_replacement.replacement_text = 'wrong name'; },
  d => { delete d.records[26].previous_review; },
  d => { d.records[27].previous_review.summary = 'lost battery review'; },
  d => { d.records[26].source_checks[0].source_id = 'source-ndep-thacker-pass-water-permit'; },
  d => { d.records[26].source_checks[0].captured_sha256 = '0'.repeat(64); },
  d => { d.records[26].source_checks[0].visually_checked_pages.push(21); },
  d => { d.records[27].source_checks[0].primary_checked_date = '2026-09-22'; },
  d => { d.records[27].replacements.at(-1).replacement_text = 'Thacker Pass has completed every permit requirement.'; },
  d => { d.records[26].update_id = 'update-2026-09-23-annual-battery-chronology'; },
  d => { delete d.records[26].previous_review.previous_review; },
  d => { d.records[27].previous_review.previous_review.summary = 'lost earliest review'; },
  d => { d.records[26].replacements[0].replacement_text = 'Protection-scheme registration proves safe operation.'; },
  d => { d.records[27].replacements[3].paragraph_index = 0; },
  d => { d.records[26].source_checks[1].source_id = d.records[26].source_checks[2].source_id; },
  d => { d.records[27].source_checks[2].captured_sha256 = '0'.repeat(64); },
  d => { d.records[26].source_checks[1].primary_checked_date = '2026-09-22'; },
  d => { d.records[27].source_checks[2].finding = 'Every corrective action is closed.'; },
]) {
  const changed = structuredClone(annualCaseReviews); mutate(changed);
  assert.throws(() => assertBindings(changed));
}

const before = JSON.stringify({pack, ops, evidence, reviews:annualCaseReviews});
let changedBodies = 0, changedParagraphs = 0, notices = 0, changedOverviews = 0, changedHeadings = 0;
for (const a of pack.records) {
  const catalog = readerCatalog.find(r => r.id === a.record_id);
  const {review, sections, overview, title} = applyAnnualCaseReview(a, {route:catalog.route});
  assert.equal(overview, review?.overview_replacement?.replacement_text ?? a.overview);
  if (overview !== a.overview) changedOverviews++;
  assert.equal(title,review?.title_replacement?.replacement_text??a.title);
  assert.equal(annualCaseTitle(a,{asOfDate:'2026-09-21'}),a.title);
  assert.equal(annualCaseTitle(a,{route:'/wrong/'}),a.title);
  assert.equal(catalog.title, title); assert.equal(catalog.summary, overview); assert.equal(catalog.status, a.review_status);
  assert.equal(catalog.date, review ? annualReviewDate(review) : a.authored_date);
  assert.equal(sections.length, a.sections.length);
  if (JSON.stringify(sections) !== JSON.stringify(a.sections)) changedBodies++;
  sections.forEach((s, i) => {
    const originalHeading = a.sections[i].heading;
    assert.equal(s.heading, review?.heading_replacements?.find(c => c.original_text === originalHeading)?.replacement_text ?? originalHeading);
    if (s.heading !== originalHeading) changedHeadings++;
    assert.equal(s.paragraphs.length, a.sections[i].paragraphs.length);
    s.paragraphs.forEach((p, j) => {
      const change = review?.replacements.find(c => c.section_heading === originalHeading && c.paragraph_index === j);
      assert.equal(p, change?.replacement_text ?? a.sections[i].paragraphs[j]);
      if (p !== a.sections[i].paragraphs[j]) changedParagraphs++;
    });
  });
  if (!review) { assert(!expectedIds.includes(a.record_id)); continue; }
  notices++;
  if (laterIds.includes(a.record_id)) {
    assert.equal(annualCaseReview(a, {asOfDate:'2026-09-22'}), null, 'Later clarification leaked into an earlier presentation');
    assert.deepEqual(applyAnnualCaseReview(a, {asOfDate:'2026-09-22'}).sections, a.sections);
  }
  assert.equal(annualCaseReview(a, {route:'/wrong/'}), null);
  assert.equal(annualCaseReview(a, {asOfDate:'2026-09-21'}), null);
  assert.deepEqual(applyAnnualCaseReview(a, {asOfDate:'2026-09-21'}).sections, a.sections);
  assert.equal(annualCaseOverview(a, {asOfDate:'2026-09-21'}), a.overview);
  assert.equal(annualCaseOverview(a, {route:'/wrong/'}), a.overview);
  assert.throws(() => annualCaseReview({...a, overview:'unreviewed drift'}), /source drift/);
  for (const date of ['September 22', '2026-02-30']) assert.throws(() => annualCaseReview(a, {asOfDate:date}), /ISO calendar date/);
  const contexts = annualReviewContexts(review); assert.equal(contexts.length, review.retained_contexts.length);
  for (const context of contexts) {
    assert(context.summary && context.next_action);
    if (a.record_id==='203-TOPIC-16') {
      const receipt=evidence.receipts.find(r=>r.receipt_id===context.id);
      assert.deepEqual(context.formal_artifact,receipt.formal_artifact);
      assert.equal(context.evidence_boundary,receipt.evidence_boundary);
    } else assert(!context.formal_artifact,'Unexpected formal-artifact projection');
  }
}
assert.equal(notices, 28); assert.equal(changedBodies, 24); assert.equal(changedParagraphs, 49); assert.equal(changedOverviews, 6); assert.equal(changedHeadings, 1);
for (const suffix of ['01', '03', '04', '06', '08', '10', '11']) {
  const [report, essay] = [`203-SYNTHESIS-${suffix}`, `200-MONOGRAPH-${suffix}`].map(id => pack.records.find(a => a.record_id === id));
  assert.deepEqual(applyAnnualCaseReview(report).sections, applyAnnualCaseReview(essay).sections, 'Paired current readings diverged');
}
assert(searchReaders(readerCatalog, 'formal site-licence renewal', 'Report').some(r => r.id === '203-CASE-04'));
assert(!searchReaders(readerCatalog, 'unresolved Shuttle Landing Facility license disposition').some(r => r.id === '203-CASE-04'));
assert(searchReaders(readerCatalog, 'Cancelled/Declined', 'Report').some(r => r.id === '203-CASE-18'));
assert(!searchReaders(readerCatalog, 'canceled expansion').some(r => r.id === '203-CASE-18'));
assert(searchReaders(readerCatalog, 'appeal-status', 'Report').some(r => r.id === '203-CASE-03'));
assert(!searchReaders(readerCatalog, 'future rate-class decision').some(r => r.id === '203-CASE-03'));
assert.equal(annualCaseReview({...pack.records[0], record_id:'similar-but-unmatched'}), null);
assert.deepEqual(annualReviewContexts(null), []);
assert.throws(() => annualReviewContexts({...annualCaseReviews.records[0], retained_contexts:[{collection:'receipts', id:'missing'}]}), /Invalid retained/);
assert.throws(() => annualReviewContexts({...annualCaseReviews.records[3], retained_contexts:[{collection:'evidence_receipts', id:'missing'}]}), /Invalid retained/);
assert.throws(() => annualReviewContexts({...annualCaseReviews.records[3], retained_contexts:[{collection:'unknown', id:'missing'}]}), /Invalid retained/);
assert.equal(JSON.stringify({pack, ops, evidence, reviews:annualCaseReviews}), before);
const reviewVersions=annualCaseReviews.records.flatMap(annualReviewVersions);
assert.equal(reviewVersions.length,34);
assert.deepEqual(annualReviewVersions(null),[]);
assert.deepEqual(annualReviewVersions(undefined),[]);
const historyRecord=annualCaseReviews.records.find(r=>r.record_id===nevadaIds[0]);
assert.deepEqual(annualReviewVersions(historyRecord).map(r=>r.update_id),[
  'update-2026-09-23-annual-battery-chronology',
  'update-2026-09-23-annual-nevada-permit-identity',
  'update-2026-09-23-annual-battery-registration-reserve'
]);
for(const mutate of [
  r=>{r.previous_review.previous_review=r;},
  r=>{r.previous_review.update_id=r.update_id;},
  r=>{r.previous_review.record_id='wrong-record';},
  r=>{r.previous_review.route='/wrong/';},
  r=>{r.previous_review.source_record_sha256='0'.repeat(64);},
  r=>{r.previous_review.review_date='2026-09-24';},
  r=>{r.previous_review.previous_review.review_date='2026-02-30';}
]) {
  const malformed=structuredClone(historyRecord);mutate(malformed);
  assert.throws(()=>annualReviewVersions(malformed),/annual review history|Annual review history/);
}
assert.equal(annualCaseReviews.records.filter(r=>r.title_replacement).length,1);
assert(searchReaders(readerCatalog,'Victorian Big Battery').some(r=>r.id==='203-CASE-13'));
assert(!readerCatalog.some(r=>r.id==='203-CASE-13'&&r.title.includes('Victoria Big Battery')));
for (const updateId of new Set(reviewVersions.map(r => r.update_id ?? annualCaseReviews.update_id))) {
  const update = await json(`src/content/updates/${updateId.replace(/^update-/, '')}.json`);
  assert.equal(update.id, updateId);
  assert.deepEqual(update.affected_record_ids, reviewVersions.filter(r => (r.update_id ?? annualCaseReviews.update_id) === updateId).map(r => r.record_id));
  for (const r of reviewVersions.filter(r => (r.update_id ?? annualCaseReviews.update_id) === updateId)) {
    assert(update.related_paths.includes(r.route));
    assert.equal(update.effective_date, annualReviewDate(r), 'Update and per-record correction dates differ');
  }
}
assert.equal(ops.governed_series_admitted, 0);
console.log('Annual source checks passed: 28 exact notices, 1 current title, 6 current overviews, 49 changed paragraphs, 1 heading, 80 unchanged bodies; scoped market-registration/reserve-service distinction, retained Rhyolite Ridge permit identity, three explicitly additional sources and 58-row lineage proof; all seven changed/noticed synthesis pairs agree, all preceding Nevada-candidate records remain exact, including six inspectable preceding reviews. History cycle/identity/date fixtures rejected. Original records, source/receipt bindings and approval/measurement holds preserved.');
