import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile, readdir, writeFile} from 'node:fs/promises';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';

// Local editorial audit only. No canonical identity, approval, admission or
// promotion-gate mutation; the report is not part of the published candidate.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const pins = [];
const get = async name => {
  const path = `app/src/data/${name}.json`;
  const bytes = await readFile(join(root, path));
  pins.push({path, bytes: bytes.length, sha256: hash(bytes)});
  return JSON.parse(bytes);
};

export function makeIdentityIndex(registry, atlas) {
  const index = new Map();
  const records = [];
  for (const [kind, registryKey, atlasKey, idKey] of [
    ['Project', 'casebooks', 'projects', 'atlas_project_id'],
    ['Place', 'local_systems', 'places', 'atlas_place_id'],
  ]) {
    const canonical = new Map(registry.entity_registry[registryKey].map(r => [r.canonical_id, r]));
    assert.equal(canonical.size, registry.entity_registry[registryKey].length, 'Duplicate canonical identity');
    assert.equal(atlas[atlasKey].length, canonical.size, 'Canonical/Atlas inventory mismatch');
    for (const r of atlas[atlasKey]) {
      const original = canonical.get(r.canonical_id);
      assert(original, `Unregistered Atlas identity: ${r.canonical_id}`);
      const row = {kind, canonical_id: r.canonical_id, atlas_id: r[idKey], name: r.named_entity ?? r.title,
        coverage_tier: r.coverage.tier_id, representation_tier: original.representation_tier,
        aliases: [...new Set([...(original.aliases ?? []), ...(r.aliases ?? [])])],
        source_ids: r.evidence_rails.source_ids, route: r.routes.atlas,
        next_artifact: r.conversion.exact_next_artifact,
        membership: [{registry: 'phase-116-coverage-architecture', id: original.canonical_id},
          {registry: 'phase-119-deep-project-place-atlas', id: r[idKey]}],
        editorial_versions: [], full_v1_acceptance: null};
      // Match explicit identifiers only. Similar labels, parent/child geography,
      // project/place aliases and names are never silently merged.
      for (const id of new Set([r.canonical_id, r[idKey], ...(r.legacy_ids ?? []), ...(original.legacy_ids ?? [])])) {
        const key = `${kind}:${id}`;
        assert(!index.has(key), `Conflicting identity binding: ${key}`);
        index.set(key, row);
      }
      records.push(row);
    }
  }
  return {index, records};
}

export function attachIdentity(index, kind, id, membership) {
  const row = index.get(`${kind}:${id}`);
  assert(row, `Unresolved explicit ${kind} identity: ${id}`);
  row.membership.push(membership);
  return row;
}

async function build() {
  const registry = await get('phase-116-coverage-architecture');
  const atlas = await get('phase-119-deep-project-place-atlas');
  const {index, records} = makeIdentityIndex(registry, atlas);
  for (const [name, array, kind, key, rowId] of [
    ['phase-127-project-place-conversion-biographies', 'project_biographies', 'Project', 'canonical_id', 'biography_id'],
    ['phase-127-project-place-conversion-biographies', 'place_biographies', 'Place', 'canonical_id', 'biography_id'],
    ['phase-136-named-project-chronicles', 'project_chronicles', 'Project', 'atlas_project_id', 'chronicle_id'],
    ['phase-137-place-delivery-ledgers', 'place_ledgers', 'Place', 'atlas_place_id', 'ledger_id'],
    ['phase-170-fifteen-place-systems-atlas', 'place_system_dossiers', 'Place', 'atlas_place_id', 'place_system_dossier_id'],
    ['phase-198-failure-delay-reversal-correction-casebooks', 'casebook_packets', 'Project', 'atlas_project_id', 'casebook_packet_id'],
  ]) {
    const data = await get(name);
    for (const r of data[array]) attachIdentity(index, kind, r[key], {registry: name, array, id: r[rowId]});
  }
  const acquisitionDockets = [];
  const originalDockets = new Map();
  for (const [name, array, kind, key, label] of [
    ['phase-191-international-named-project-conversion-cohort', 'project_conversion_packets', 'Project', 'international_project_packet_id', 'project_name'],
    ['phase-192-global-place-systems-atlas', 'place_system_dossiers', 'Place', 'global_place_dossier_id', 'place_name'],
  ]) {
    const data = await get(name);
    for (const r of data[array]) {
      const identity = `${kind}:${r[key]}`;
      originalDockets.set(identity, r);
      if (r.upstream_canonical_id) {
        const row = attachIdentity(index, kind, r.upstream_canonical_id, {registry: name, array, id: r[key]});
        assert(!index.has(identity), `Duplicate docket ID: ${identity}`);
        index.set(identity, row);
      } else {
        assert.equal(r[label], null, 'Named docket needs explicit identity reconciliation');
        acquisitionDockets.push({kind, id: r[key], registry: name, name: null, record_kind: r.record_kind,
          canonical_id: null, current_editorial_candidate: null});
      }
    }
  }
  const editorial = await get('phase-205-216-current-editorial');
  const candidates = [];
  for (const r of editorial.records.filter(r => ['Project', 'Place'].includes(r.kind))) {
    const version = {record_id: r.record_id, article_sha256: r.sha256, route: r.route,
      approved: r.approved, identity_evidence: r.identity_evidence,
      source_urls: r.sources.map(s => s.url)};
    const inherited = index.get(`${r.kind}:${r.record_id}`);
    if (inherited) inherited.editorial_versions.push(version);
    else {
      assert(originalDockets.has(`${r.kind}:${r.record_id}`), 'Unknown new editorial identity');
      assert(r.identity_evidence?.candidate_name, 'Unnamed editorial candidate');
      candidates.push({kind: r.kind, ...version, canonical_id: null, full_v1_acceptance: null});
      acquisitionDockets.find(d => d.kind === r.kind && d.id === r.record_id).current_editorial_candidate = r.identity_evidence.candidate_name;
    }
  }
  const caseAtlas = await get('phase-186-named-delivery-case-atlas-ii');
  const caseContexts = [];
  for (const r of caseAtlas.delivery_case_files) {
    if (index.has(`Project:${r.entity_identity}`)) attachIdentity(index, 'Project', r.entity_identity,
      {registry: 'phase-186-named-delivery-case-atlas-ii', id: r.delivery_case_id});
    else caseContexts.push({id: r.delivery_case_id, kind: r.case_slot, identity: r.entity_identity,
      disposition: 'Authority or signal context, not an additional resolved project identity'});
  }
  const montana = await get('phase-57g-montana-project-cohort-registry');
  assert.equal(new Set(montana.projects.map(r => r.project_id)).size, montana.projects.length, 'Duplicate Montana source ID');
  const expansion = await get('phase-178-systems-atlas-and-compendium-depth-expansion');
  const orientations = await get('phase-185-global-place-systems-atlas-i');
  const targets = await get('phase-197-underrepresented-region-topic-gap-closure');
  assert(targets.gap_closure_packets.every(r => r.named_entity === null && r.canonical_identity_id === null),
    'Target contracts now contain identities; reconcile them before counting');
  const translations = await get('phase-202-accessible-multilingual-low-bandwidth-editions');
  const annual = await get('phase-203-state-of-future-systems-2026');
  const gate = await get('phase-204-v1-public-reference-edition-promotion-gate');
  const followup = {
    montana_project_baseline: {records: montana.projects.map(r => ({source_project_id: r.project_id, name: r.project_name,
      subgrantee_id: r.subgrantee_id, outcome_state: r.outcome_state, canonical_id: null})),
      source_ids: montana.source_ids, boundary: montana.interpretation_boundary,
      next_action: 'Reconcile each source project with the aggregate Montana casebook, define child/parent counting and review eligibility; do not count 32 source rows as 32 accepted dossiers.'},
    named_place_dossiers: expansion.place_system_dossiers.map(r => ({id: r.place_system_dossier_id,
      name: r.place_identity, project_context: r.subject, source_ids: r.source_ids, route: r.route,
      canonical_id: null, next_action: 'Resolve exact geographic scope and aliases before canonical registration or portfolio acceptance.'})),
    jurisdiction_orientations: orientations.place_system_dossiers.map(r => ({id: r.place_system_dossier_id,
      title: r.title, jurisdiction_id: r.jurisdiction_id, geographic_unit_kind: r.geographic_unit_kind,
      state: r.dossier_state, canonical_id: null})),
    acquisition_dockets: acquisitionDockets,
    unnamed_target_contracts: targets.gap_closure_packets.map(r => ({id: r.gap_closure_packet_id,
      kind: r.target_entity_kind, region: r.region, topic: r.topic_name, name: r.named_entity})),
    non_project_case_contexts: caseContexts,
  };
  const files = (await readdir(join(root, 'app/src/data'))).filter(n => n.endsWith('.json')).sort();
  const discovery = [];
  for (const name of files) {
    const bytes = await readFile(join(root, 'app/src/data', name));
    const data = JSON.parse(bytes);
    const arrays = Object.entries(data).filter(([k,v]) => Array.isArray(v) && /(project|place|casebook|deliver.*case)/i.test(k))
      .map(([key,v]) => ({key, rows: v.length}));
    if (arrays.length) discovery.push({path: `app/src/data/${name}`, sha256: hash(bytes), arrays});
  }
  return {schema_version: '1.0', as_of_date: '2026-09-22',
    scope: 'Exact-identifier reconciliation of the listed local registries, with broader source-array discovery. Not a complete accepted-portfolio census, external source recheck or admission decision.',
    inputs: [...new Map(pins.map(p => [p.path,p])).values()].sort((a,b) => a.path.localeCompare(b.path)),
    summary: {canonical_projects: records.filter(r => r.kind === 'Project').length,
      canonical_places: records.filter(r => r.kind === 'Place').length,
      additional_editorial_project_candidates: candidates.filter(r => r.kind === 'Project').length,
      additional_editorial_place_candidates: candidates.filter(r => r.kind === 'Place').length,
      montana_source_projects_to_reconcile: montana.projects.length,
      named_place_dossiers_to_reconcile: expansion.place_system_dossiers.length,
      jurisdiction_orientations_to_disposition: orientations.place_system_dossiers.length,
      unnamed_target_contracts: targets.gap_closure_packets.length,
      target_projects: 100, target_places: 70, accepted_projects: null, accepted_places: null,
      accepted_project_gap: null, accepted_place_gap: null, new_admissions: 0},
    entities: records, additional_editorial_candidates: candidates, followup,
    mandatory_scope: {portfolio_gate: gate.promotion_gates.find(g => g.slug === 'portfolio-targets'),
      translations: translations.edition_contracts.filter(r => r.is_translation).map(r => ({id: r.edition_contract_id,
        topic_id: r.topic_id, language: r.target_language, translated_content: r.translated_content,
        human_editor: r.human_editor, subject_reviewer: r.subject_reviewer, approval_receipt_id: r.approval_receipt_id})),
      annual_edition_counts: annual.counts},
    broader_array_discovery: {root_json_files_scanned: files.length, method: 'Top-level array-key discovery only; matching is not identity admission and may include inactive schemas.', records: discovery},
    remaining_census_work: ['Resolve the 32 source-level Montana projects and ten named Phase 178 place dossiers.',
      'Disposition the 18 jurisdiction orientations and inspect other discovery results for eligible distinct entities.',
      'Record independent identity and acceptance decisions for the four added editorial candidates and applicable existing content.',
      'Compute accepted totals and target gaps only after coverage and parent/child eligibility are resolved.']};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await build();
  const path = join(root, 'docs/release-reviews/2026-09-22/portfolio-census.json');
  const bytes = JSON.stringify(result, null, 2) + '\n';
  if (process.argv.includes('--check')) assert.equal(await readFile(path, 'utf8'), bytes, 'Census is stale');
  else await writeFile(path, bytes);
  console.log(JSON.stringify(result.summary, null, 2));
  console.log('Source-pinned local census; no identity admission or full-v1 acceptance created.');
}
