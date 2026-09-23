import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {annualCaseReviews, annualCaseReview, applyAnnualCaseReview, annualReviewContexts, annualCaseOverview, annualReviewDate} from '../src/lib/annual-case-reviews.mjs';
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
const laterIds = [...allPairedIds, ...citationIds];
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
  assert.equal(hash(JSON.stringify(data.records.slice(0, 7))), '054c81854e26fe58f786b24050984d4b3e5ce34ca746b7a1a0453863cff1ab69', 'Earlier seven reviews changed');
  assert.equal(hash(JSON.stringify(data.records.slice(0, 11))), '4cf9116132695d46acc0e382bbd16f994ba7618e8c9c195603f2cb4a4a5a9c5c', 'Earlier eleven reviews changed');
  assert.equal(hash(JSON.stringify(data.records.slice(0, 15))), 'ca8db6563e3b2761aa22c5b422b38a09dda18536f3a81b4e1ee1dcccc11a27e8', 'Earlier fifteen reviews changed');
  assert.equal(data.records.reduce((n, r) => n + r.replacements.length, 0), 29);
  assert.equal(data.records.filter(r => r.overview_replacement).length, 3);
  assert.equal(data.records.reduce((n, r) => n + (r.heading_replacements?.length ?? 0), 0), 1);
  for (const r of data.records) {
    const article = history.records.find(a => a.record_id === r.record_id);
    assert.equal(hash(JSON.stringify(article)), r.source_record_sha256, 'Article hash drift');
    assert.equal(readerCatalog.find(a => a.id === r.record_id).route, r.route, 'Canonical route drift');
    assert.equal(r.independent_article_review, false);
    assert.equal(r.approval_receipt_id, null);
    assert.equal(r.review_date, laterIds.includes(r.record_id) ? '2026-09-23' : undefined);
    if (pairedIds.includes(r.record_id)) {
      assert.equal(r.update_id, 'update-2026-09-23-annual-golden-mars-paired-readings');
      assert.equal(hash(JSON.stringify(r.source_checks)), '99a14f6598f8e8c76e4a806179cdf0fb23e26c2bdcc36e48c091aff1c32b75b2', 'Retained September 22 checks changed');
      assert(r.summary.includes('not a new artifact retrieval'));
      assert.equal(r.replacements.length, r.record_id.endsWith('-01') ? 3 : 1);
    }
    if (spacePairedIds.includes(r.record_id)) {
      assert.equal(r.update_id, 'update-2026-09-23-annual-space-coast-paired-readings');
      assert.deepEqual(r.source_checks, [], 'No fresh Space Coast inspection claimed');
      assert.deepEqual(r.retained_contexts, data.records[3].retained_contexts, 'Separate retained renewal binding changed');
      assert.equal(r.replacements.length, r.record_id.endsWith('-06') ? 4 : 1);
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
    if (r.overview_replacement) {
      assert(['203-CASE-04', '203-CASE-03', '203-CASE-18'].includes(r.record_id));
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
    assert.equal(r.retained_contexts.length, ['203-CASE-03', '203-CASE-18', ...pairedIds, ...citationIds].includes(r.record_id) ? 0 : 1);
    for (const b of r.retained_contexts) {
      assert(['receipts', 'pilot_research_followups', 'evidence_receipts'].includes(b.collection));
      const receipt = (b.collection === 'evidence_receipts' ? decisions.receipts : operations[b.collection]).find(v => (v.receipt_id ?? v.review_id) === b.id);
      assert(receipt, 'Missing exact receipt');
      assert.equal(hash(JSON.stringify(receipt)), b.receipt_payload_sha256, 'Receipt hash drift');
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
]) {
  const changed = structuredClone(annualCaseReviews); mutate(changed);
  assert.throws(() => assertBindings(changed));
}

const before = JSON.stringify({pack, ops, evidence, reviews:annualCaseReviews});
let changedBodies = 0, changedParagraphs = 0, notices = 0, changedOverviews = 0, changedHeadings = 0;
for (const a of pack.records) {
  const catalog = readerCatalog.find(r => r.id === a.record_id);
  const {review, sections, overview} = applyAnnualCaseReview(a, {route:catalog.route});
  assert.equal(overview, review?.overview_replacement?.replacement_text ?? a.overview);
  if (overview !== a.overview) changedOverviews++;
  assert.equal(catalog.title, a.title); assert.equal(catalog.summary, overview); assert.equal(catalog.status, a.review_status);
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
  for (const context of contexts) assert(context.summary && context.next_action);
}
assert.equal(notices, 19); assert.equal(changedBodies, 17); assert.equal(changedParagraphs, 29); assert.equal(changedOverviews, 3); assert.equal(changedHeadings, 1);
for (const suffix of ['01', '03', '06', '08']) {
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
for (const updateId of new Set(annualCaseReviews.records.map(r => r.update_id ?? annualCaseReviews.update_id))) {
  const update = await json(`src/content/updates/${updateId.replace(/^update-/, '')}.json`);
  assert.equal(update.id, updateId);
  assert.deepEqual(update.affected_record_ids, annualCaseReviews.records.filter(r => (r.update_id ?? annualCaseReviews.update_id) === updateId).map(r => r.record_id));
  for (const r of annualCaseReviews.records.filter(r => (r.update_id ?? annualCaseReviews.update_id) === updateId)) {
    assert(update.related_paths.includes(r.route));
    assert.equal(update.effective_date, annualReviewDate(r), 'Update and per-record correction dates differ');
  }
}
assert.equal(ops.governed_series_admitted, 0);
console.log('Annual source checks passed: 19 exact notices, 3 current overviews, 29 changed paragraphs, 1 heading, 87 unchanged bodies; three explicitly additional sources and 58-row lineage proof; Golden-Mars and Space Coast pairs agree, per-record review dates and all earlier reviews/checks remain pinned. Original records, source/receipt bindings and approval/measurement holds preserved.');
