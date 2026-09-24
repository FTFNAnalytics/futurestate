import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {parse} from 'parse5';
import {annualCaseReviews, annualReviewContexts, annualCaseOverview, annualCaseTitle, annualReviewDate} from '../src/lib/annual-case-reviews.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import history from '../src/data/phase-204-reader-completion.json' with {type:'json'};
import originalReport from '../src/data/phase-203-state-of-future-systems-2026.json' with {type:'json'};
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const read = p => readFile(join(root, p), 'utf8');
const attr = (node, key) => node.attrs?.find(a => a.name === key)?.value;
const all = (node, predicate) => [...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap(n => all(n, predicate))];
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const links = node => all(node, n => n.tagName === 'a').map(n => attr(n, 'href'));
const hubs=new Map();
let revisedTitles=0, previousReviews=0;
let totalNotices = 0, revisedParagraphs = 0, revisedOverviews = 0, revisedHeadings = 0;
for (const article of history.records) {
  const route = readerCatalog.find(r => r.id === article.record_id).route;
  const dom = parse(await read(`${route}index.html`));
  const notices = all(dom, n => attr(n, 'data-annual-case-review') !== undefined);
  const review = annualCaseReviews.records.find(r => r.record_id === article.record_id);
  const overview = annualCaseOverview(article, {route});
  const title=annualCaseTitle(article,{route});
  const [pageTitle]=all(dom,n=>n.tagName==='title');
  assert.equal(text(pageTitle),title+' | FTFN','Current title metadata mismatch');
  const [h1]=all(dom,n=>n.tagName==='h1');
  assert.equal(text(h1),title,'Current reader title mismatch');
  const hubRoute=route.split('/').slice(0,3).join('/')+'/';
  if(!hubs.has(hubRoute))hubs.set(hubRoute,parse(await read(hubRoute+'index.html')));
  const [hubCard]=all(hubs.get(hubRoute),n=>n.tagName==='article'&&links(n).includes(route));
  assert(hubCard,'Missing reference hub card');
  assert.equal(text(all(hubCard,n=>n.tagName==='h3')[0]),title,'Stale reference hub title');
  assert.equal(text(all(hubCard,n=>n.tagName==='p')[0]),overview,'Stale reference hub overview');
  const originals=all(dom,n=>attr(n,'data-annual-original-title')!==undefined);
  assert.equal(originals.length,review?.title_replacement?1:0);
  if(review?.title_replacement){revisedTitles++;assert(text(originals[0]).includes(article.title));assert(text(originals[0]).includes(review.title_replacement.reason));}
  const priors=all(dom,n=>attr(n,'data-annual-prior-review')!==undefined);
  assert.equal(priors.length,review?.previous_review?1:0);
  if(review?.previous_review){previousReviews++;assert(text(priors[0]).includes(review.previous_review.summary));assert(links(priors[0]).includes('/updates/'+review.previous_review.update_id+'/'));}
  const [hero] = all(dom, n => n.tagName === 'header' && (attr(n, 'class') ?? '').split(' ').includes('review-hero'));
  assert(hero, `Missing reader header ${route}`);
  const [lede] = all(hero, n => n.tagName === 'p' && (attr(n, 'class') ?? '').split(' ').includes('lede'));
  assert.equal(text(lede), overview, `Stale reader overview ${route}`);
  const [description] = all(dom, n => n.tagName === 'meta' && attr(n, 'name') === 'description');
  assert.equal(attr(description, 'content'), overview, `Stale metadata overview ${route}`);
  const earlierOverviews = all(dom, n => attr(n, 'data-annual-original-overview') !== undefined);
  assert.equal(earlierOverviews.length, review?.overview_replacement ? 1 : 0);
  if (review?.overview_replacement) {
    revisedOverviews++;
    assert(text(earlierOverviews[0]).includes(article.overview));
    assert(text(earlierOverviews[0]).includes(review.overview_replacement.reason));
    assert.equal(all(dom, n => n.tagName === 'p' && text(n) === article.overview).length, 1, 'Earlier overview belongs only in provenance');
    const catalogIndex = readerCatalog.findIndex(r => r.id === article.record_id);
    const catalogPage = parse(await read(`/reference/explore/${Math.floor(catalogIndex / 40) + 1}/index.html`));
    const [card] = all(catalogPage, n => n.tagName === 'article' && links(n).includes(route));
    assert(card && text(card).includes(overview), 'Static catalog card must carry the current overview');
    assert(!text(card).includes(article.overview), 'Static catalog card must not repeat the superseded overview');
  }
  assert.equal(notices.length, review ? 1 : 0, route);
  totalNotices += notices.length;
  for (let i = 0; i < article.sections.length; i++) {
    const original = article.sections[i];
    const [heading] = all(dom, n => attr(n, 'id') === `${article.record_id.toLowerCase()}-section-${i + 1}`);
    assert(heading, `Missing reading heading at ${route}`);
    const headingChange = review?.heading_replacements?.find(c => c.original_text === original.heading);
    assert.equal(text(heading), headingChange?.replacement_text ?? original.heading, 'Current section heading mismatch');
    const [contents] = all(dom, n => attr(n, 'data-reader-contents') !== undefined);
    const sectionLinks = all(contents, n => n.tagName === 'a' && attr(n, 'href') === `#${article.record_id.toLowerCase()}-section-${i + 1}`);
    assert.equal(sectionLinks.length, 1, 'Existing section anchor must remain stable');
    assert.equal(text(sectionLinks[0]), text(heading), 'Contents label must match current heading');
    if (headingChange) revisedHeadings++;
    const paragraphs = heading.parentNode.childNodes.filter(n => n.tagName === 'p').map(text);
    const expected = [...original.paragraphs];
    for (const change of review?.replacements ?? []) if (change.section_heading === original.heading) {
      expected[change.paragraph_index] = change.replacement_text; revisedParagraphs++;
    }
    assert.deepEqual(paragraphs, expected, `Wrong current reading body at ${route}`);
  }
  if (!review) continue;
  const notice = notices[0], visible = text(notice), hrefs = links(notice);
  assert.equal(attr(notice, 'data-annual-case-review'), article.record_id);
  const reviewHeadings = all(notice, n => n.tagName === 'h2').map(text);
  assert.deepEqual(reviewHeadings, [`Editorial clarification and source context · ${annualReviewDate(review)}`], 'Notice must display this record’s correction date');
  for (const value of [annualReviewDate(review), annualCaseReviews.boundary, review.summary]) assert(visible.includes(value));
  const catalogIndex = readerCatalog.findIndex(r => r.id === article.record_id);
  const catalogPage = parse(await read(`/reference/explore/${Math.floor(catalogIndex / 40) + 1}/index.html`));
  const [catalogCard] = all(catalogPage, n => n.tagName === 'article' && links(n).includes(route));
  assert(catalogCard && text(catalogCard).includes(annualReviewDate(review)), 'Catalog must show this record’s review date');
  assert.equal(text(all(catalogCard,n=>n.tagName==='h2'||n.tagName==='h3')[0]),title,'Catalog card current title mismatch');
  assert(hrefs.includes(annualCaseReviews.export_route));
  assert(hrefs.includes(`/updates/${review.update_id ?? annualCaseReviews.update_id}/`));
  const provenance = all(notice, n => attr(n, 'data-annual-original') === article.record_id);
  assert.equal(provenance.length, review.replacements.length);
  for (const [i, change] of review.replacements.entries()) {
    assert(text(provenance[i]).includes(change.original_text));
    assert(text(provenance[i]).includes(change.reason));
    assert.equal(all(dom, n => n.tagName === 'p' && text(n) === change.original_text).length, 1, 'Original wording must occur only in provenance');
  }
  const earlierHeadings = all(notice, n => attr(n, 'data-annual-original-heading') === article.record_id);
  assert.equal(earlierHeadings.length, review.heading_replacements?.length ?? 0);
  for (const [i, change] of (review.heading_replacements ?? []).entries()) {
    assert(text(earlierHeadings[i]).includes(change.original_text));
    assert(text(earlierHeadings[i]).includes(change.reason));
    assert(!all(dom, n => ['h2', 'h3'].includes(n.tagName)).some(n => text(n) === change.original_text), 'Superseded heading must not remain a current heading');
  }
  const sourceChecks = all(notice, n => attr(n, 'data-annual-source-check') !== undefined);
  assert.equal(sourceChecks.length, review.source_checks.length);
  for (const check of review.source_checks) {
    assert(hrefs.includes(check.url));
    for (const value of [check.locator, check.access, check.finding]) assert(visible.includes(value));
    if (check.relation) assert(visible.includes(check.relation), 'Additional-artifact relation must be visible');
    const section=sourceChecks.find(n=>attr(n,'data-annual-source-check')===check.source_id);
    if (check.retained_checked_date) {
      assert(text(section).includes('Retained primary-page check: '+check.retained_checked_date));
      assert(text(section).includes('no fresh retrieval'));
    }
    if (check.primary_checked_date) {
      assert(text(section).includes('Primary-page check: '+check.primary_checked_date));
      assert(text(section).includes('profile check date remain unchanged'));
    }
    if (check.additional_source === true) {
      const exact = sourceChecks.filter(n=>attr(n,'data-annual-source-check')===check.source_id);
      assert.equal(exact.length,1);
      assert(text(exact[0]).includes('Additional source: '+check.locator));
      assert(text(exact[0]).includes('Editorial source check: '+check.checked_date));
      assert(text(exact[0]).includes('does not replace the original source list'));
      assert(!article.source_ids.includes(check.source_id));
    }
  }
  const localProof = all(notice,n=>attr(n,'data-annual-local-provenance')!==undefined);
  assert.equal(localProof.length,review.local_provenance_context?1:0);
  if (review.local_provenance_context) {
    assert.equal(article.record_id,'203-APPENDIX-02');
    const proof=review.local_provenance_context;
    assert.equal(attr(localProof[0],'data-annual-local-provenance'),article.record_id);
    assert(text(localProof[0]).includes(proof.checked_date));
    assert(text(localProof[0]).includes(proof.scope));
    assert(text(localProof[0]).includes(proof.report_records+' original annual readers were compared: '+proof.expanded_pairs+' use the expanded paired-essay text and sources; the other '+proof.remaining_subset_records+' have no source IDs outside their original report contracts.'), 'Rendered local lineage counts or meaning differ');
    for(const artifact of proof.artifacts)assert(links(localProof[0]).includes(artifact.route));
    assert.deepEqual(JSON.parse(await read('/data/phase-203-state-of-future-systems-2026.json')),originalReport);
    assert.deepEqual(JSON.parse(await read('/data/phase-204-reader-completion.json')),history);
  }
  const relatedSections=all(notice,n=>attr(n,'data-annual-related-readings')!==undefined);
  assert.equal(relatedSections.length,review.related_readings?.length?1:0);
  if(review.related_readings?.length) {
    assert.equal(attr(relatedSections[0],'data-annual-related-readings'),article.record_id);
    for(const linked of review.related_readings) {
      assert(links(relatedSections[0]).includes(linked.route));
      assert(text(relatedSections[0]).includes(linked.label));
      assert(text(relatedSections[0]).includes(linked.relation));
      const target=parse(await read(linked.route+'index.html'));
      assert.equal(all(target,n=>attr(n,'data-annual-case-review')===linked.record_id).length,1);
    }
    assert(text(relatedSections[0]).includes('not independent acceptance'));
  }
  assert.equal(all(notice,n=>attr(n,'data-annual-formal-artifact')!==undefined).length,article.record_id==='203-TOPIC-16'?1:0);
  for (const context of annualReviewContexts(review)) {
    assert.equal(all(notice, n => attr(n, 'data-annual-retained-context') === context.id).length, 1);
    assert(hrefs.includes(context.route));
    if(context.formal_artifact) {
      const formal=all(notice,n=>attr(n,'data-annual-formal-artifact')===context.id);
      assert.equal(formal.length,1);
      assert(links(formal[0]).includes(context.formal_artifact.url));
      for(const value of [context.formal_artifact.title,context.formal_artifact.issued_date,context.formal_artifact.effective_date,context.formal_artifact.expiration_date,context.checked_date,context.evidence_boundary]) assert(text(formal[0]).includes(value));
    }
    for (const value of [context.checked_date, context.relation, context.summary, context.next_action]) assert(visible.includes(value));
    if (context.next_check_date) assert(visible.includes(context.next_check_date));
    for (const id of context.matched_source_ids) assert(hrefs.includes(`/atlas/sources/${id}/`));
    for (const url of context.additional_artifact_urls) assert(hrefs.includes(url));
    const [path, fragment] = context.route.split('#');
    const target = parse(await read(`${path}index.html`));
    if (fragment) assert.equal(all(target, n => attr(n, 'id') === fragment).length, 1, `Missing retained receipt anchor ${context.id}`);
    assert(text(target).includes(context.summary), `Destination omits retained finding ${context.id}`);
  }
}
assert.equal(totalNotices, 28); assert.equal(revisedParagraphs, 47); assert.equal(revisedOverviews, 6); assert.equal(revisedTitles,1); assert.equal(previousReviews,4); assert.equal(revisedHeadings, 1);
assert.deepEqual(JSON.parse(await read(annualCaseReviews.export_route)), annualCaseReviews);
assert.deepEqual(JSON.parse(await read('/data/phase-204-reader-completion.json')), history);
assert.deepEqual(JSON.parse(await read('/data/reader-catalog.json')).records, readerCatalog);
assert(links(parse(await read('/data/index.html'))).includes(annualCaseReviews.export_route));
const reviewVersions=annualCaseReviews.records.flatMap(r=>r.previous_review?[r.previous_review,r]:[r]);
for (const updateId of new Set(reviewVersions.map(r => r.update_id ?? annualCaseReviews.update_id))) {
  const update = parse(await read(`/updates/${updateId}/index.html`));
  assert(links(update).includes(annualCaseReviews.export_route));
  for (const r of reviewVersions.filter(r => (r.update_id ?? annualCaseReviews.update_id) === updateId)) assert(links(update).includes(r.route));
}
console.log('Annual output verified across all 104 original reader routes: 28 scoped notices, 1 current title, 6 current overviews, 47 current paragraphs, 1 heading with stable anchors, inspectable originals, exact source/receipt links, per-record catalog dates, three explicit additional source checks, retained/new primary check dates including Rhyolite Ridge permit identity, exact formal-instrument and case links, local provenance links and matching dated updates/export, current reference-hub cards and four preserved preceding review records. No browser, independent or release approval claimed.');
