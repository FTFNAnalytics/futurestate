import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {annualCaseReviews, annualCaseReview, applyAnnualCaseReview, annualReviewContexts} from '../src/lib/annual-case-reviews.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const raw = p => readFile(join(root, p), 'utf8');
const json = async p => JSON.parse(await raw(p));
const hash = value => createHash('sha256').update(value).digest('hex');
const pack = await json('src/data/phase-204-reader-completion.json');
const ops = await json('src/data/phase-207-current-operations.json');
const sources = await Promise.all((await readdir(join(root, 'src/content/sources'))).filter(f => f.endsWith('.json')).map(f => json(`src/content/sources/${f}`)));
const sourceMap = new Map(sources.map(s => [s.id, s]));
const expectedIds = ['203-CASE-02', '203-CASE-12', '203-CASE-14'];
assert.equal(hash(await raw('src/data/phase-204-reader-completion.json')), '38ffd8b3e44dc671dd6590f80658240b6e533c645e5cf5fc3e84f345009d9125');
assert.equal(hash(await raw('src/data/phase-205-216-current-editorial.json')), 'e2fd76e4b53e638523696fb47ed4ae04bc5d073d3b22e6731e02603078d1f230');
assert.equal(hash(await raw('src/data/phase-202-accessible-multilingual-low-bandwidth-editions.json')), '3f2d0494cc16dfb192f0ab909a0c035411c6884b0a4563528019ce8917416f26');

// Validate the declarations independently of the renderer; malformed declarations
// must fail before a build can turn a retained research finding into approval.
function assertBindings(data, history = pack, operations = ops) {
  assert.deepEqual(data.records.map(r => r.record_id), expectedIds);
  assert.equal(data.review_date, '2026-09-22');
  assert.equal(data.records.reduce((n, r) => n + r.replacements.length, 0), 2);
  for (const r of data.records) {
    const article = history.records.find(a => a.record_id === r.record_id);
    assert.equal(hash(JSON.stringify(article)), r.source_record_sha256, 'Article hash drift');
    assert.equal(readerCatalog.find(a => a.id === r.record_id).route, r.route, 'Canonical route drift');
    assert.equal(r.independent_article_review, false);
    assert.equal(r.approval_receipt_id, null);
    for (const change of r.replacements) {
      const sections = article.sections.filter(s => s.heading === change.section_heading);
      assert.equal(sections.length, 1);
      assert.equal(sections[0].paragraphs[change.paragraph_index], change.original_text, 'Replacement target drift');
      assert(change.reason && change.replacement_text && change.replacement_text !== change.original_text);
    }
    for (const check of r.source_checks) {
      assert(article.source_ids.includes(check.source_id));
      assert.equal(check.url, sourceMap.get(check.source_id)?.url, 'Checked source URL drift');
      assert(check.locator && check.access && check.finding);
    }
    assert.equal(r.retained_contexts.length, 1);
    for (const b of r.retained_contexts) {
      assert(['receipts', 'pilot_research_followups'].includes(b.collection));
      const receipt = operations[b.collection].find(v => (v.receipt_id ?? v.review_id) === b.id);
      assert(receipt, 'Missing exact receipt');
      assert.equal(hash(JSON.stringify(receipt)), b.receipt_payload_sha256, 'Receipt hash drift');
      assert(receipt.checked_date <= data.review_date);
      assert.equal(receipt.independent_review_complete, false);
      assert.equal(receipt.publication_authorized, false);
      assert(b.relation);
      for (const id of b.matched_source_ids) {
        assert(article.source_ids.includes(id), 'Unmatched article source');
        if (b.collection === 'receipts') assert(receipt.checked_source_ids.includes(id), 'Context-only source cannot be presented as checked');
        else assert(receipt.source_checks.some(s => s.url === sourceMap.get(id)?.url), 'Retained artifact URL mismatch');
      }
      if (b.collection === 'receipts') assert.equal(b.route, `/updates/${receipt.update_id}/`);
      else assert.equal(b.route, `/method/editorial-review/#${b.id}`);
      for (const url of b.additional_artifact_urls) {
        assert(receipt.source_checks.some(s => s.url === url), 'Missing additional artifact');
        assert(!article.source_ids.some(id => sourceMap.get(id)?.url === url), 'Additional artifact is an original cited source');
      }
    }
  }
  const [toronto, hornsdale, dalrymple] = data.records;
  assert.deepEqual(toronto.retained_contexts[0].matched_source_ids, ['source-toronto-2026-sc33-9-item-history']);
  assert.equal(operations.receipts.find(r => r.receipt_id === toronto.retained_contexts[0].id).next_check_date, '2026-09-28');
  assert.equal(hornsdale.replacements.length, 0);
  assert.equal(hornsdale.source_checks.length, 0, 'No fresh Hornsdale check claimed');
  assert.deepEqual(dalrymple.retained_contexts[0].matched_source_ids, []);
  assert.deepEqual(dalrymple.retained_contexts[0].additional_artifact_urls, operations.pilot_research_followups.find(r => r.review_id === dalrymple.retained_contexts[0].id).source_checks.map(s => s.url));
  assert.deepEqual(dalrymple.source_checks[0].visually_checked_pages, [1, 2]);
  assert.equal(dalrymple.source_checks[0].captured_sha256, 'f431e507a48bb61c27247495e8365f9bb1e2b830c5b2145d0ca6bf41aaee7b99');
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
]) {
  const changed = structuredClone(annualCaseReviews); mutate(changed);
  assert.throws(() => assertBindings(changed));
}

const before = JSON.stringify({pack, ops, reviews:annualCaseReviews});
let changedBodies = 0, changedParagraphs = 0, notices = 0;
for (const a of pack.records) {
  const catalog = readerCatalog.find(r => r.id === a.record_id);
  const {review, sections} = applyAnnualCaseReview(a, {route:catalog.route});
  assert.equal(catalog.title, a.title); assert.equal(catalog.summary, a.overview); assert.equal(catalog.status, a.review_status);
  assert.equal(catalog.date, review ? annualCaseReviews.review_date : a.authored_date);
  assert.equal(sections.length, a.sections.length);
  if (JSON.stringify(sections) !== JSON.stringify(a.sections)) changedBodies++;
  sections.forEach((s, i) => {
    assert.equal(s.heading, a.sections[i].heading); assert.equal(s.paragraphs.length, a.sections[i].paragraphs.length);
    s.paragraphs.forEach((p, j) => {
      const change = review?.replacements.find(c => c.section_heading === s.heading && c.paragraph_index === j);
      assert.equal(p, change?.replacement_text ?? a.sections[i].paragraphs[j]);
      if (p !== a.sections[i].paragraphs[j]) changedParagraphs++;
    });
  });
  if (!review) { assert(!expectedIds.includes(a.record_id)); continue; }
  notices++;
  assert.equal(annualCaseReview(a, {route:'/wrong/'}), null);
  assert.equal(annualCaseReview(a, {asOfDate:'2026-09-21'}), null);
  assert.deepEqual(applyAnnualCaseReview(a, {asOfDate:'2026-09-21'}).sections, a.sections);
  assert.throws(() => annualCaseReview({...a, overview:'unreviewed drift'}), /source drift/);
  for (const date of ['September 22', '2026-02-30']) assert.throws(() => annualCaseReview(a, {asOfDate:date}), /ISO calendar date/);
  const contexts = annualReviewContexts(review); assert.equal(contexts.length, 1);
  assert(contexts[0].summary && contexts[0].next_action);
}
assert.equal(notices, 3); assert.equal(changedBodies, 2); assert.equal(changedParagraphs, 2);
assert.equal(annualCaseReview({...pack.records[0], record_id:'similar-but-unmatched'}), null);
assert.deepEqual(annualReviewContexts(null), []);
assert.throws(() => annualReviewContexts({...annualCaseReviews.records[0], retained_contexts:[{collection:'receipts', id:'missing'}]}), /Invalid retained/);
assert.equal(JSON.stringify({pack, ops, reviews:annualCaseReviews}), before);
const update = await json('src/content/updates/2026-09-22-annual-case-clarifications.json');
assert.equal(update.id, annualCaseReviews.update_id);
assert.deepEqual(update.affected_record_ids, expectedIds);
assert.equal(ops.governed_series_admitted, 0);
console.log('Annual-case source checks passed: 3 exact notices, 2 changed paragraphs, 102 unchanged bodies; original records, receipt hashes, route/date boundaries and all approval/measurement holds preserved; false-association fixtures rejected.');
