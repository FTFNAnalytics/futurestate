import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>readFile(join(root,path),'utf8');
const ops=JSON.parse(await read('src/data/phase-207-current-operations.json'));
assert.deepEqual(JSON.parse(await read('dist/data/current-operations.json')),ops);
const sourceExport=JSON.parse(await read('dist/data/sources.json')).records;
for(const r of ops.backlog_reviews){
  const decision=ops.backlog_adjudications.find(d=>d.backlog_item_id===r.backlog_item_id);
  const receiptHtml=await read(`dist${r.route}index.html`),receiptText=decodeHtmlText(receiptHtml);
  assert(receiptHtml.includes(`id="${r.review_id}"`),`Missing anchored full receipt ${r.review_id}`);
  for(const route of r.affected_routes){
    const html=await read(`dist${route}index.html`),text=decodeHtmlText(html);
    assert.equal(html.split(`data-backlog-review="${r.review_id}"`).length-1,1,`Missing/duplicate research notice ${r.review_id}/${route}`);
    assert(text.includes(r.finding)); assert(text.includes(r.recommendation)); assert(text.includes(r.next_action));
    for(const id of r.check_ids){
      const check=ops.backlog_artifact_checks.find(c=>c.check_id===id);
      const target=route===r.route?text:receiptText;
      for(const field of ['artifact_date','observation_period','locator','access','finding','limitation'])assert(target.includes(check[field]),`Missing full receipt artifact ${field}: ${id}/${r.route}`);
      if(check.evidence_role){assert(target.includes(check.evidence_role));assert(target.includes(check.access_result));}
    }
    if(route!==r.route)assert(html.includes(`data-backlog-full-receipt="${r.review_id}"`)&&html.includes(`href="${r.route}#${r.review_id}"`),`Missing exact full-receipt link ${r.review_id}/${route}`);
    assert.equal(html.split(`data-backlog-decision="${decision.decision_id}"`).length-1,1,`Missing/duplicate AI determination ${route}`);
    assert(text.includes(decision.rationale));assert(text.includes(decision.reopening_condition));
    assert(text.includes('AI determination 2026-09-25, authorized by the owner.'));
  }
  for(const id of r.source_ids){const source=sourceExport.find(s=>s.id===id);assert(source?.bounded_backlog_research.some(review=>review.sha256===r.sha256),`Source export missing review ${id}`);}
  const update=JSON.parse(await read(`src/content/updates/2026-09-14-backlog-research-${r.backlog_item_id.slice(-3)}.json`));
  const html=await read(`dist/updates/${update.id}/index.html`);
  assert(html.includes(r.review_id));assert(decodeHtmlText(html).includes(r.finding));
}
const method=decodeHtmlText(await read('dist/method/editorial-review/index.html'));
assert(method.includes('25 AI determinations completed'));
assert(method.includes('No record in this batch awaits human adjudication'));
console.log(`Production backlog verification passed: all assigned routes show one evidence-bound AI determination and a direct anchored full-receipt link. Exact artifacts, source exports and ${ops.backlog_reviews.length} historical update receipts retain their original provenance.`);
