import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {resolve, relative} from 'node:path';
import vm from 'node:vm';
import './test-google-analytics-policy.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const id = 'G-8DR04KSE6W';
const source = await readFile(resolve(root, 'src/components/GoogleAnalytics.astro'), 'utf8');
assert(source.includes('import.meta.env.PROD'), 'Do not track development-server visits');
const paths = [];
async function visit(directory) {
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    if (directory === dist && entry.name === 'downloads') continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await visit(path);
    else if (entry.isFile() && entry.name.endsWith('.html')) paths.push(path);
  }
}
await visit(dist);
assert(paths.length > 0, 'Build the site before checking analytics');
let initialized = false;
for (const path of paths) {
  const html = await readFile(path, 'utf8');
  const label = relative(dist, path);
  const head = html.match(/<head(?:\s[^>]*)?>([\s\S]*?)<\/head>/i)?.[1];
  assert(head, `Missing head: ${label}`);
  const loaders = [...html.matchAll(/<script\b[^>]*src=["']https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=([^"']+)["'][^>]*><\/script>/g)];
  assert.equal(loaders.length, 1, `Exactly one tag loader: ${label}`);
  assert.equal(loaders[0][1], id, `Correct property: ${label}`);
  assert(/\basync(?:\s|=|>)/.test(loaders[0][0]), `Async loader: ${label}`);
  assert(head.includes(loaders[0][0]), `Loader in head: ${label}`);
  const scripts = [...head.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
  const initializers = scripts.filter(([,body]) => body.includes(`gtag('config', '${id}')`));
  assert.equal(initializers.length, 1, `Exactly one initialization: ${label}`);
  assert.equal((html.match(/gtag\(['"]config['"]/g) ?? []).length, 1, `No duplicate config: ${label}`);
  if (!initialized) {
    const priorEvent = {retained:true};
    const context = {dataLayer:[priorEvent]};
    context.window = context;
    vm.runInNewContext(initializers[0][1], context, {timeout:1000});
    assert.equal(context.dataLayer[0], priorEvent, 'Preserve any existing data layer');
    assert.equal(context.dataLayer[1][0], 'js');
    assert.equal(context.dataLayer[2][0], 'config');
    assert.equal(context.dataLayer[2][1], id);
    assert.equal(context.dataLayer.length, 3, 'Initialize once without duplicate page-view event');
    initialized = true;
  }
}
console.log(JSON.stringify({status:'Passed',measurement_id:id,application_html_pages:paths.length,scope:'Built tag coverage and initialization only; not GA4 account receipt confirmation'}));
