import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
const corpus=JSON.parse(await read('src/data/phase-205-216-current-editorial.json'));
const update=JSON.parse(await read('src/content/updates/2026-09-22-reader-reconciliation.json'));
for(const id of ['119-PROJECT-001','191-PROJECT-001','195-BRIEF-017','195-BRIEF-053','195-BRIEF-047','195-BRIEF-057']){
  const article=corpus.records.find(r=>r.record_id===id);
  assert.equal(article.updated_date,'2026-09-22');assert.equal(article.approved,false);
  assert.equal(readerCatalog.find(r=>r.id===id).date,'2026-09-22');
  assert(update.affected_record_ids.includes(id));assert(update.related_paths.includes(article.route));
  assert.match(article.source_check_boundary,/September 22/);
}
assert.match(corpus.records.find(r=>r.record_id==='195-BRIEF-057').source_check_boundary,/Both Nature links failed/);
assert.match(corpus.records.find(r=>r.record_id==='195-BRIEF-047').source_notes[0].scope,/Bienville Parish/);
assert.match(await read('src/components/layout/BaseLayout.astro'),/rel="icon" type="image\/svg\+xml" href="\/favicon.svg"/);
assert.match(await read('public/favicon.svg'),/viewBox="0 0 32 32"/);
assert.match(await read('src/pages/index.astro'),/dependencyMaps\.slice\(0, 6\)\.map/);
assert.match(await read('src/pages/index.astro'),/href="\/atlas\/dependency-maps\/"/);
console.log('Reader finishing: six dated reconciliations, exact research limits, current catalog dates, six-map homepage preview and favicon verified.');
