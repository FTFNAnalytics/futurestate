import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {readerPresentation,readerSourceReviewContexts} from '../src/lib/reader-presentation.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {annualCaseReviewForId} from '../src/lib/annual-case-reviews.mjs';
import {currentEvidenceLedger,projectEvidenceRecord} from '../src/lib/current-evidence.mjs';
import {assertReceiptControlExport} from './lib/assert-receipt-control-export.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8'),json=async p=>JSON.parse(await read('src/data/'+p));
const pack=await json('phase-204-reader-completion.json'),editions=await json('phase-202-accessible-multilingual-low-bandwidth-editions.json'),ops=await json('phase-207-current-operations.json');
const hash=raw=>createHash('sha256').update(raw).digest('hex');
assert.equal(hash(await read('src/data/phase-204-reader-completion.json')),'38ffd8b3e44dc671dd6590f80658240b6e533c645e5cf5fc3e84f345009d9125');
assert.equal(hash(await read('src/data/phase-202-accessible-multilingual-low-bandwidth-editions.json')),'3f2d0494cc16dfb192f0ab909a0c035411c6884b0a4563528019ce8917416f26');
const sources=await Promise.all((await readdir(join(root,'src/content/sources'))).filter(f=>f.endsWith('.json')).map(async f=>JSON.parse(await read('src/content/sources/'+f))));
const before=JSON.stringify({pack,editions,ops,sources,evidence:currentEvidenceLedger});let pairCount=0,contexts=0,contextArticles=0,englishContextArticles=0;
for(const a of pack.records){
 const view=readerPresentation(a,sources,editions.edition_contracts,readerCatalog),route=readerCatalog.find(r=>r.id===a.record_id).route;
 assert.equal(view.sections.length,a.sections.length);assert.equal(new Set(view.sections.map(s=>s.anchor)).size,a.sections.length);
 view.sections.forEach((s,i)=>{const review=annualCaseReviewForId(a.record_id),original=a.sections[i];assert.equal(s.heading,review?.heading_replacements?.find(c=>c.original_text===original.heading)?.replacement_text??original.heading);const expected=[...original.paragraphs];for(const change of review?.replacements??[])if(change.section_heading===original.heading){assert.equal(expected[change.paragraph_index],change.original_text);expected[change.paragraph_index]=change.replacement_text;}assert.deepEqual(s.paragraphs,expected);assert.equal(s.anchor,`${a.record_id.toLowerCase()}-section-${i+1}`);});
 assert.deepEqual(view.sources.map(s=>s.id),a.source_ids);for(const s of view.sources){assert.equal(s.url,sources.find(r=>r.id===s.id).url);assert.equal(s.profile_route,`/atlas/sources/${s.id}/`);}
 assert(view.related.every(l=>l.title&&!l.title.startsWith('/')));
 const contract=editions.edition_contracts.find(r=>r.edition_contract_id===a.record_id);
 if(contract){assert.equal(view.alternatives.length,1);pairCount++;const other=editions.edition_contracts.find(r=>r.edition_contract_id===view.alternatives[0].id);assert.equal(other.topic_id,contract.topic_id);assert.equal(other.target_language,'English');assert.equal(other.is_translation,false);assert.notEqual(other.edition_mode,contract.edition_mode);assert(pack.records.some(r=>r.record_id===other.edition_contract_id));}
 else assert.equal(view.alternatives.length,0);
 const notes=readerSourceReviewContexts(a,currentEvidenceLedger,ops,{route,asOfDate:'2026-09-15'});
 const expected=[...currentEvidenceLedger.receipts.filter(r=>r.checked_source_ids.some(id=>a.source_ids.includes(id))&&r.decision_date<='2026-09-15'&&r.source_checked_date<='2026-09-15'&&!r.affected_routes.includes(route)).map(r=>r.receipt_id),...ops.backlog_reviews.filter(r=>r.source_ids.some(id=>a.source_ids.includes(id))&&r.checked_date<='2026-09-15'&&!r.affected_routes.includes(route)).map(r=>r.review_id)];
 assert.deepEqual(notes.map(n=>n.id).sort(),expected.sort());assert.equal(new Set(notes.map(n=>n.id)).size,notes.length);
 for(const n of notes){assert.equal(n.independent_article_review,false);assert(n.matched_source_ids.every(id=>a.source_ids.includes(id)));assert(n.route.startsWith('/'));assert(n.summary&&n.checked_date&&n.next_check_date);}
 contexts+=notes.length;if(notes.length){contextArticles++;if(contract)englishContextArticles++;}
 assert.equal(readerSourceReviewContexts(a,currentEvidenceLedger,ops,{asOfDate:'2026-09-01'}).length,0,'Later checks cannot leak into the inherited cutoff');
}
assert.equal(pairCount,34);assert.equal(englishContextArticles,14);assert(editions.edition_contracts.filter(r=>r.is_translation).every(r=>r.translated_content===null&&r.approval_receipt_id===null));
assert.equal(JSON.stringify({pack,editions,ops,sources,evidence:currentEvidenceLedger}),before);
// Generic presentation fixtures are deliberately not a version-pinned review.
// Reviewed originals must instead reject any mutation before rendering it.
const reviewedSample=pack.records.find(r=>annualCaseReviewForId(r.record_id));assert(reviewedSample);
for(const mutation of [{source_ids:['unknown-source']},{related_paths:['/unknown-label/']},{sections:[reviewedSample.sections[0],reviewedSample.sections[0]]}])assert.throws(()=>readerPresentation({...reviewedSample,...mutation},sources,[],[]),/Annual reader source drift/);
const sample={...pack.records[0],record_id:'fixture-reader-presentation-unreviewed'};assert.equal(annualCaseReviewForId(sample.record_id),null);
assert.throws(()=>readerPresentation({...sample,source_ids:['unknown-source']},sources,[],[]),/Missing reader source link/);assert.throws(()=>readerPresentation({...sample,related_paths:['/unknown-label/']},sources,[],[]),/Missing reader link label/);
const repeated=readerPresentation({...sample,sections:[sample.sections[0],sample.sections[0]]},sources,[],[]);assert.notEqual(repeated.sections[0].anchor,repeated.sections[1].anchor);
assert.throws(()=>readerSourceReviewContexts(sample,currentEvidenceLedger,ops,{asOfDate:'September 15'}),/ISO calendar date/);
assert.equal(readerSourceReviewContexts({...sample,source_ids:['source-similar-but-unmatched']},currentEvidenceLedger,ops).length,0);
const fixtureControls={queue:{records:(await json('phase-58-dated-evidence-queue.json')).records},envelope:{records:(await json('phase-67-evidence-return-envelope-ledger.json')).envelope_records},desk:{records:(await json('phase-60c-editorial-desk.json')).records}};
for(const v of Object.values(fixtureControls))v.records=v.records.map(r=>({...r,current_state:projectEvidenceRecord(r)}));
for(const receipt of currentEvidenceLedger.receipts)for(const kind of ['queue','envelope','desk'])assert.doesNotThrow(()=>assertReceiptControlExport(receipt,fixtureControls[kind],kind));
const primary=currentEvidenceLedger.receipts.find(r=>r.counts_as_cycle_decision!==false),companion=currentEvidenceLedger.receipts.find(r=>r.counts_as_cycle_decision===false);
const missing=structuredClone(fixtureControls.envelope);missing.records.find(r=>r.envelope_id===companion.envelope_id).current_state.companion_rechecks=[];assert.throws(()=>assertReceiptControlExport(companion,missing,'envelope'),/One separate/);
const overwritten=structuredClone(fixtureControls.envelope);overwritten.records.find(r=>r.envelope_id===companion.envelope_id).current_state.receipt_id=companion.receipt_id;assert.throws(()=>assertReceiptControlExport(companion,overwritten,'envelope'),/cannot replace/);
const wrong=structuredClone(fixtureControls.envelope);wrong.records.find(r=>r.envelope_id===primary.envelope_id).current_state.source_checked_date='2026-09-09';assert.throws(()=>assertReceiptControlExport(primary,wrong,'envelope'),/source_checked_date/);
const source=await read('src/components/review/ReferenceArticle.astro'),page=await read('src/pages/reference/[...path].astro'),verifier=await read('scripts/verify-phase204-reader-completion.mjs');
assert(source.includes('data-reader-source-context'));assert(source.includes('data-edition-alternative'));assert(source.includes('data-reader-contents'));assert(source.includes('href={source.url}'));assert(source.includes("article.mode === 'low-bandwidth'"));assert(source.includes('data-reader-contract={article.record_id}'));assert(!source.includes('details,.card-note{display:none;}'));
assert(page.includes('`${readerTitle} | FTFN`'));assert(page.includes('annualCaseTitle(article, {route:Astro.url.pathname})'));assert(source.includes('title={view.title}'));assert(page.includes('readerOverview ?? description'));assert(page.includes('annualCaseOverview(article, {route:Astro.url.pathname})'));
for(const marker of ['Buffer.byteLength(html)<64000','bytes<100000','assertReceiptControlExport(receipt,exported,kind)','await verifyUpdateArchive','receipt.update_id'])assert(verifier.includes(marker));
console.log(`Reading edition source checks passed: 104 preserved source articles with explicit dated paragraph clarifications, 34 reciprocal English format links, ${contexts} historical September 15 exact-source contexts across ${contextArticles} articles; headings, original URLs, cutoff/translation holds and ${currentEvidenceLedger.receipts.length} receipt-control bindings preserved. Production HTML/CSS budgets and human acceptance remain unverified.`);
