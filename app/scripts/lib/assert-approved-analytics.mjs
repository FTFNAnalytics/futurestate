import assert from 'node:assert/strict';
import {parse} from 'parse5';

const loader = 'https://www.googletagmanager.com/gtag/js?id=G-8DR04KSE6W';
const expected = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-8DR04KSE6W');`;
const normalize = text => text.split(/\r?\n/).map(line=>line.trim()).filter(Boolean).join('\n');

// Static readers may contain the owner-approved analytics pair, but no page
// behavior, extra destination, duplicate initialization or other script.
export function assertOnlyApprovedAnalyticsScripts(html) {
  const scripts = [];
  function visit(node) {
    if (node.tagName === 'script') scripts.push(node);
    for (const child of node.childNodes ?? []) visit(child);
    if (node.content) visit(node.content);
  }
  visit(parse(html));
  assert.equal(scripts.length, 2, 'Only the two approved analytics scripts are allowed');
  const [external, inline] = scripts;
  for (const script of scripts) assert.equal(script.parentNode?.tagName, 'head', 'Analytics stays in the head, not the static reader body');
  assert.deepEqual(Object.fromEntries(external.attrs.map(a=>[a.name,a.value])), {async:'',src:loader});
  assert.equal(external.childNodes.length, 0, 'External loader must not carry inline code');
  assert.deepEqual(inline.attrs, [], 'Initializer must not gain executable attributes or a new source');
  assert(inline.childNodes.every(n=>n.nodeName==='#text'));
  assert.equal(normalize(inline.childNodes.map(n=>n.value).join('')), expected, 'Only the exact approved initializer is allowed');
}
