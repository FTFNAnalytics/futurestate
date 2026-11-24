import assert from 'node:assert/strict';
import {readdir, readFile} from 'node:fs/promises';
import {join} from 'node:path';

// Dynamic /data/[release].json routes are declared by these source programs.
// Literal endpoints are read separately; dist never determines expectations.
const programs = [
  'v07-evidence-admission-dockets', 'v08-conversion-longitudinal-atlas',
  'v09-living-public-intelligence', 'v1-release-candidate',
  'v1-monthly-operating-program', 'v1-september-evidence-cycle',
  'v1-october-operating-program', 'v1-public-reference-edition',
];
const routePattern = /^\/data\/[a-z0-9][a-z0-9-]*\.json$/;

export function checkedExportRoutes(routes) {
  assert(Array.isArray(routes), 'Export inventory must be an array');
  assert(routes.every(route => typeof route === 'string' && routePattern.test(route)), 'Invalid top-level public JSON route');
  assert.equal(new Set(routes).size, routes.length, 'Duplicate public JSON route');
  return [...routes].sort();
}

export async function declaredPublicJsonExports(appRoot) {
  const entries = await readdir(join(appRoot, 'src/pages/data'), {withFileTypes: true});
  const endpoints = entries.filter(e => e.isFile() && e.name.endsWith('.json.ts')).map(e => e.name);
  assert.deepEqual(endpoints.filter(name => name.includes('[')).sort(), ['[release].json.ts'], 'Unaccounted dynamic public JSON endpoint');
  const literalRoutes = endpoints.filter(name => !name.includes('[')).map(name => `/data/${name.slice(0, -3)}`);
  const datasets = await Promise.all(programs.map(async name => JSON.parse(await readFile(join(appRoot, 'src/data', `${name}.json`), 'utf8'))));
  const dynamicRoutes = datasets.flatMap(dataset => checkedExportRoutes(dataset.public_json_exports));
  return checkedExportRoutes([...literalRoutes, ...dynamicRoutes]);
}

export function assertExportInventory(expected, actual, label = 'Public JSON output') {
  const declared = checkedExportRoutes(expected), observed = checkedExportRoutes(actual);
  const missing = declared.filter(route => !observed.includes(route));
  const unexpected = observed.filter(route => !declared.includes(route));
  assert(missing.length === 0 && unexpected.length === 0, `${label} mismatch: missing ${JSON.stringify(missing)}; unexpected ${JSON.stringify(unexpected)}`);
}

export function applyExportInventory(manifest, routes) {
  const declared = checkedExportRoutes(routes);
  manifest.public_json_export_routes = declared;
  manifest.expected_build.public_json_exports = declared.length;
  manifest.required_output_files = [...new Set([
    ...manifest.required_output_files, ...declared.map(route => `dist${route}`),
  ])].sort();
}

export async function verifyPublicJsonInventory(appRoot, manifest) {
  const declared = await declaredPublicJsonExports(appRoot);
  const files = await readdir(join(appRoot, 'dist/data'), {withFileTypes: true});
  const actual = files.filter(e => e.isFile() && e.name.endsWith('.json')).map(e => `/data/${e.name}`);
  assertExportInventory(declared, actual);
  assertExportInventory(declared, manifest.public_json_export_routes, 'Manifest public JSON inventory');
  assert.equal(manifest.expected_build.public_json_exports, declared.length, 'Manifest public JSON count differs from declared identities');
  const required = manifest.required_output_files.filter(path => /^dist\/data\/[^/]+\.json$/.test(path)).map(path => path.slice(4));
  assertExportInventory(declared, required, 'Required public JSON outputs');
  return declared;
}
