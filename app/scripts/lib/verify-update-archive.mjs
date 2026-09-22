import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';

export const decodeHtmlText=value=>value.replace(/&#(?:x([\da-f]+)|(\d+));/gi,(_,hex,dec)=>String.fromCodePoint(parseInt(hex??dec,hex?16:10))).replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&apos;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');

// Preserve the old all-update acceptance requirement across pagination. This is
// stricter than checking titles on the root: every full receipt must render.
export async function verifyUpdateArchive({appRoot}){
  const updates=[];
  for(const file of await readdir(join(appRoot,'src/content/updates')))if(file.endsWith('.json'))updates.push(JSON.parse(await readFile(join(appRoot,'src/content/updates',file),'utf8')));
  const index=JSON.parse(await readFile(join(appRoot,'dist/data/shelves/updates.json'),'utf8')).records;
  assert.deepEqual(index.map(r=>r.id).sort(),updates.map(r=>r.id).sort(),'Update search index membership');
  const seen=[];
  for(let page=1;page<=Math.ceil(updates.length/40);page++){
    const html=await readFile(join(appRoot,`dist/browse/updates/${page}/index.html`),'utf8');
    const ids=[...html.matchAll(/data-shelf-card="([^"]+)"/g)].map(m=>m[1]);assert(ids.length<=40);seen.push(...ids);
  }
  assert.deepEqual(seen.sort(),updates.map(r=>r.id).sort(),'Every update appears exactly once across static pages');
  for(const u of updates){
    const raw=await readFile(join(appRoot,`dist/updates/${u.id}/index.html`),'utf8'),html=decodeHtmlText(raw);
    assert.equal((raw.match(/data-update-receipt=/g)??[]).length,1,`One complete receipt per page: ${u.id}`);
    for(const value of [u.title,u.summary,u.evidence_note,u.receipt_id,u.prior_state,u.current_state,u.publication_effect,...u.affected_record_ids].filter(Boolean))assert(html.includes(value),`Missing full update field ${u.id}: ${String(value).slice(0,75)}`);
    for(const field of ['effective_date','source_checked_date','decision_date','next_check_date'])if(u[field])assert(html.includes(u[field]),`Missing update date ${u.id}/${field}`);
    assert(raw.includes('href="/updates/"'));
    assert.equal(index.find(r=>r.id===u.id).route,`/updates/${u.id}/`);
  }
  return updates.length;
}

// Historical phase checks still require every exact update title. Pagination
// changes its location, not the acceptance requirement or the source inventory.
export async function verifiedPaginatedUpdateHtml({appRoot}){
  const count=await verifyUpdateArchive({appRoot});
  const pages=await Promise.all(Array.from({length:Math.ceil(count/40)},(_,i)=>readFile(join(appRoot,`dist/browse/updates/${i+1}/index.html`),'utf8')));
  return pages.join('\n');
}
