import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

// Local review artifacts only: deliberately not part of public candidate inputs.
const root = fileURLToPath(new URL('../../', import.meta.url));
const packetRoot = join(root, 'docs/release-reviews/2026-09-22/translation-pilots');
const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const manifest = await readJson(join(packetRoot, 'manifest.json'));
function assertDraftBoundary(record) {
  for (const key of ['publication_authorized', 'human_approved', 'primary_source_recheck_performed', 'source_to_contract_mapping_approved']) assert.equal(record[key], false, key);
  assert.deepEqual(record.drafts.map(d => d.language_code), ['fr', 'es']);
  for (const draft of record.drafts) {
    for (const key of ['locale_decision', 'human_translator', 'language_reviewer', 'subject_reviewer', 'review_date', 'approval_receipt_id']) assert.equal(draft[key], null, key);
    assert.deepEqual(draft.review_findings, []);
    assert.equal(draft.publication_state, 'Held');
    assert.equal(draft.path, `advanced-manufacturing-${draft.language_code}.md`);
  }
}
assertDraftBoundary(manifest);
const english = (await readJson(join(root, manifest.source_file))).records.find(r => r.record_id === manifest.source_record_id);
assert(english, 'Exact English source missing');
assert.equal(hash(JSON.stringify(english)), manifest.source_record_sha256, 'English source changed: translations require review');
assert.equal(english.inherited_as_of_date, manifest.source_inherited_as_of_date);
assert.equal(english.authored_date, manifest.source_authored_date);
assert.equal(english.review_status, manifest.source_review_status);
assert.equal(english.sections.length, manifest.source_section_count);
assert.deepEqual(english.source_ids, manifest.sources.map(s => s.id));
const englishSnapshot = await readFile(join(packetRoot, 'english-source.md'), 'utf8');
assert(englishSnapshot.startsWith(`# ${english.title}\n`));
assert(englishSnapshot.includes(english.overview));
assert.equal((englishSnapshot.match(/^## /gm) ?? []).length, english.sections.length);
for (const section of english.sections) {
  assert(englishSnapshot.includes(`## ${section.heading}\n`));
  for (const paragraph of section.paragraphs) assert(englishSnapshot.includes(paragraph), 'English comparison copy must preserve the exact source text');
}
const contracts = (await readJson(join(root, manifest.contract_file))).edition_contracts;
assert.equal(contracts.filter(c => c.is_translation).length, 34);
for (const contract of contracts.filter(c => c.is_translation)) {
  assert.equal(contract.translated_content, null);
  assert.equal(contract.approval_receipt_id, null);
  assert.equal(contract.publication_state, 'Held');
}
for (const source of manifest.sources) {
  const bytes = await readFile(join(root, 'app/src/content/sources', `${source.id}.json`));
  assert.equal(hash(bytes), source.source_file_sha256, `Source profile changed: ${source.id}`);
  assert.equal(JSON.parse(bytes).url, source.url);
}
for (const draft of manifest.drafts) {
  const contract = contracts.find(c => c.edition_contract_id === draft.proposed_contract_id);
  assert.equal(hash(JSON.stringify(contract)), draft.contract_record_sha256);
  assert.equal(contract.target_language, draft.language);
  assert.equal(contract.canonical_content_digest, manifest.contract_canonical_content_digest);
  assert.deepEqual(contract.source_ids, manifest.contract_source_ids);
  const bytes = await readFile(join(packetRoot, draft.path)), text = bytes.toString('utf8');
  assert.equal(hash(bytes), draft.file_sha256, `Draft version changed: ${draft.path}`);
  assert.equal((text.match(/^## /gm) ?? []).length, english.sections.length + 1, 'Six translated sections plus source list required');
  assert(text.includes(manifest.source_record_id));
  for (const source of manifest.sources) assert(text.includes(source.id) && text.includes(source.url), `Missing original source: ${source.id}`);
  for (const name of ['Monaghan Medical', 'F-15EX', 'KC-46']) assert(text.includes(name));
  assert(text.includes(draft.language_code === 'fr' ? 'non approuvé, non publié' : 'no aprobado ni publicado'));
}
for (const key of ['publication_authorized', 'human_approved', 'source_to_contract_mapping_approved']) {
  const changed = structuredClone(manifest); changed[key] = true;
  assert.throws(() => assertDraftBoundary(changed));
}
const inventedReview = structuredClone(manifest); inventedReview.drafts[0].language_reviewer = 'Unperformed review';
assert.throws(() => assertDraftBoundary(inventedReview));
console.log('Two local translation drafts verified: exact English/contract/source/draft pins, six sections and original links each; 34 contracts remain held. This is structural verification, not language or factual approval.');
