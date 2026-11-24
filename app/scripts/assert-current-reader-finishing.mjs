import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {selectedArticleReviewFor,selectedReviewDate} from '../src/lib/selected-article-reviews.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
const corpus=JSON.parse(await read('src/data/phase-205-216-current-editorial.json'));
const update=JSON.parse(await read('src/content/updates/2026-09-22-reader-reconciliation.json'));
for(const id of ['119-PROJECT-001','191-PROJECT-001','195-BRIEF-017','195-BRIEF-053','195-BRIEF-047','195-BRIEF-057']){
  const article=corpus.records.find(r=>r.record_id===id);
  assert.equal(article.updated_date,'2026-09-22');assert.equal(article.approved,false);
  assert.equal(readerCatalog.find(r=>r.id===id).date,selectedArticleReviewFor(article,{route:article.route})?selectedReviewDate:'2026-09-22');
  assert(update.affected_record_ids.includes(id));assert(update.related_paths.includes(article.route));
  assert.match(article.source_check_boundary,/September 22/);
}
assert.match(corpus.records.find(r=>r.record_id==='195-BRIEF-057').source_check_boundary,/Both Nature links failed/);
assert.match(corpus.records.find(r=>r.record_id==='195-BRIEF-047').source_notes[0].scope,/Bienville Parish/);
assert.match(await read('src/components/layout/BaseLayout.astro'),/rel="icon" type="image\/svg\+xml" href="\/favicon.svg"/);
assert.match(await read('public/favicon.svg'),/viewBox="0 0 32 32"/);
assert.match(await read('src/pages/index.astro'),/dependencyMaps\.slice\(0, 6\)\.map/);
assert.match(await read('src/pages/index.astro'),/href="\/atlas\/dependency-maps\/"/);
const css=await read('src/styles/global.css'),tokens=await read('src/styles/tokens.css');
assert.match(css,/:focus-visible\s*\{\s*outline:\s*3px solid var\(--color-accent-strong\);\s*outline-offset:\s*4px/);
assert.match(css,/\.filter-panel input\s*\{[^}]*border:\s*1px solid var\(--color-muted\)/s);
const colors=Object.fromEntries([...tokens.matchAll(/--(color-[\w-]+):\s*(#[0-9a-f]{6})/gi)].map(m=>[m[1],m[2]]));
const luminance=hex=>{const channels=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return channels.reduce((sum,v,i)=>sum+v*[0.2126,0.7152,0.0722][i],0);};
const contrast=(a,b)=>{const [lo,hi]=[luminance(a),luminance(b)].sort((x,y)=>x-y);return (hi+0.05)/(lo+0.05);};
for(const bg of ['color-panel','color-surface','color-panel-alt']){
 assert(contrast(colors['color-accent-strong'],colors[bg])>=3,`Focus contrast below 3:1 on ${bg}`);
 assert(contrast(colors['color-muted'],colors[bg])>=3,`Input boundary contrast below 3:1 on ${bg}`);
}
assert(contrast('#ffffff','#ffffff')<3,'Regression fixture must reject the observed invisible white focus ring');
assert(contrast(colors['color-line'],colors['color-panel'])<3,'Regression fixture must reject the former low-contrast field boundary');
console.log('Focus and input-boundary source regressions passed; browser confirmation and independent accessibility acceptance remain separate.');
console.log('Reader finishing: six dated reconciliations, exact research limits, current catalog dates, six-map homepage preview and favicon verified.');
