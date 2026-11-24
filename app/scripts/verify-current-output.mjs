import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { historicalPathRepairs } from '../src/lib/canonical-content-paths.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const files = new Set();
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.add(relative(root, path).replaceAll('\\', '/'));
  }
}
await walk(root);
const resolveTarget = url => {
  const path = decodeURIComponent(url.pathname).replace(/^\//, '');
  return files.has(path) ? path : files.has(`${path.replace(/\/$/, '')}/index.html`) ? `${path.replace(/\/$/, '')}/index.html` : path === '' ? 'index.html' : null;
};
const failures = new Map();
const sizes = [];
let checked = 0;
for (const file of files) {
  if (!file.endsWith('.html') || file.startsWith('downloads/')) continue;
  const html = await readFile(join(root, file), 'utf8');
  const page = '/' + file.replace(/index\.html$/, '');
  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const target = match[1].replaceAll('&amp;', '&');
    if (/^(?:mailto:|tel:|data:|javascript:|#)/i.test(target)) continue;
    let url;
    try { url = new URL(target, `https://ftfn.io${page}`); } catch { failures.set(`${page}: malformed ${target}`, 1); continue; }
    if (url.origin !== 'https://ftfn.io') continue;
    checked++;
    if (!resolveTarget(url)) failures.set(url.pathname, (failures.get(url.pathname) ?? 0) + 1);
  }
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${page}: expected one H1`);
  assert(html.includes('id="main-content"') && html.includes('Skip to main content'), `${page}: missing keyboard entry`);
  sizes.push({ route: page, bytes: Buffer.byteLength(html), gzip_bytes: gzipSync(html).length });
}
assert.equal(Object.keys(historicalPathRepairs).length, 16, 'Preserve all sixteen independently audited targets');
for (const [oldPath, target] of Object.entries(historicalPathRepairs)) {
  const url = new URL(target, 'https://ftfn.io');
  const file = resolveTarget(url);
  assert(file, `Repair ${oldPath} targets missing ${target}`);
  if (url.hash) assert((await readFile(join(root, file), 'utf8')).includes(`id="${url.hash.slice(1)}"`), `Repair ${oldPath} has missing anchor`);
}
console.log(JSON.stringify({ checked_at: new Date().toISOString(), html_pages: sizes.length, checked_local_references: checked, missing_targets: Object.fromEntries(failures), largest_pages: sizes.sort((a,b) => b.bytes-a.bytes).slice(0,12), scope: 'Local generated paths and structural checks; not external source currency, browser timing or accessibility certification.' }, null, 2));
assert.equal(failures.size, 0, 'Generated output contains missing local targets');
