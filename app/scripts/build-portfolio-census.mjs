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
const pinnedBytes = async path => {
  const bytes = await readFile(join(root, path));
  pins.push({path, bytes: bytes.length, sha256: hash(bytes)});
  return bytes;
};
const get = async name => JSON.parse(await pinnedBytes(`app/src/data/${name}.json`));

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

export function reconcileMontana(baseline, layers, sourceCheck) {
  const byId = new Map(baseline.projects.map(r => [r.project_id, r]));
  assert.equal(byId.size, baseline.projects.length, 'Duplicate Montana source ID');
  const source = new Map(sourceCheck.records.map(r => [r.project_id, r]));
  assert.equal(source.size, sourceCheck.records.length, 'Duplicate CSV project ID');
  assert.deepEqual([...source.keys()].sort(), [...byId.keys()].sort(), 'CSV/baseline identity mismatch');
  const rows = new Map();
  for (const [id, r] of byId) {
    const s = source.get(id);
    assert.equal(s.uei, r.uei, `CSV UEI mismatch: ${id}`);
    assert.equal(s.name.trim().replaceAll('\u2013','-'), r.project_name, `CSV name mismatch: ${id}`);
    for (const [sourceField, localField] of [['bead_support','bead_support_usd'],['subgrantee_match','subgrantee_match_usd']]) {
      assert.match(s[sourceField], /^\d+(\.\d+)?$/, `Missing or nonnumeric CSV amount: ${id}`);
      assert.equal(Number(s[sourceField]), r[localField], `CSV amount mismatch: ${id}`);
    }
    assert.equal(r.outcome_state, null);
    rows.set(id, {source_project_id:id, name:r.project_name, source_name:s.name, csv_row:s.csv_row,
      uei:r.uei, subgrantee_id:r.subgrantee_id, outcome_state:r.outcome_state,
      estimated_dates:{subaward:s.estimated_subaward_date,performance_start:s.estimated_performance_start,performance_end:s.estimated_performance_end},
      membership:[{registry:'phase-57g-montana-project-cohort-registry',array:'projects',id}],
      canonical_id:null, eligibility_decision:null, full_v1_acceptance:null});
  }
  for (const layer of layers) {
    const seen = new Set(), perProject = new Map();
    for (const r of layer.records) {
      const original = byId.get(r.project_id);
      assert(original, `Unknown Montana project in ${layer.registry}: ${r.project_id}`);
      assert(!seen.has(r[layer.idKey]), `Duplicate layer row: ${r[layer.idKey]}`);
      seen.add(r[layer.idKey]);
      if ('subgrantee_id' in r) assert.equal(r.subgrantee_id, original.subgrantee_id);
      if (r.baseline) for (const [key,value] of Object.entries(r.baseline)) assert.deepEqual(value, original[key], `Version baseline drift: ${r.project_id}/${key}`);
      for (const key of ['current_completed_project_quarter','current_service_state','current_adoption_state','current_acceptance_state','reporting_period','source_authority','state_acceptance','operating_outcome','accepted_observation','accepted_value']) {
        if (key in r) assert.equal(r[key], null, `${layer.registry}/${key}: new evidence requires review`);
      }
      if ('migration_allowed' in r) assert.equal(r.migration_allowed, false);
      if ('test_result' in r) assert.equal(r.test_result, 'rejected');
      if ('state' in r) assert.equal(r.state, 'unmet');
      const row = rows.get(r.project_id);
      if (row.reporting_rail) assert.equal(r.reporting_rail, row.reporting_rail);
      else row.reporting_rail = r.reporting_rail;
      row.membership.push({registry:layer.registry,array:layer.array,id:r[layer.idKey]});
      perProject.set(r.project_id,(perProject.get(r.project_id) ?? 0)+1);
    }
    assert.equal(perProject.size, byId.size, `Missing project in ${layer.registry}`);
    assert([...perProject.values()].every(n => n === layer.rowsPerProject), `Unexpected per-project row multiplicity: ${layer.registry}`);
  }
  return [...rows.values()];
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
  const sourceCheck = JSON.parse(await pinnedBytes('docs/release-reviews/2026-09-22/evidence/montana-csv-reconciliation.json'));
  const capture = await pinnedBytes(sourceCheck.source_path);
  assert.equal(hash(capture), sourceCheck.source_sha256, 'CSV capture changed');
  assert.equal(capture.length, sourceCheck.source_bytes);
  const layers = [];
  for (const [registry,array,idKey,rowsPerProject] of [
    ['phase-57h-montana-field-provenance-version-matrix','project_versions','project_id',1],
    ['phase-57i-montana-schema-migration-project-quarter-intake','project_quarter_envelopes','envelope_id',1],
    ['phase-57j-montana-migration-envelope-rejection-taxonomy','project_envelope_tests','test_case_id',1],
    ['phase-57k-montana-project-field-compatibility-matrix','compatibility_matrix','cell_id',13],
    ['phase-57k-montana-project-field-compatibility-matrix','project_envelope_requirement_checks','check_id',7],
  ]) layers.push({registry,array,idKey,rowsPerProject,records:(await get(registry))[array]});
  const montanaRows = reconcileMontana(montana,layers,sourceCheck);
  const montanaAggregate = index.get('Project:119-PROJECT-023');
  assert.equal(montanaAggregate.canonical_id,'casebook-montana-bead-completed-quarter');
  const expansion = await get('phase-178-systems-atlas-and-compendium-depth-expansion');
  const placeReview = await get('place-identity-reviews');
  assert.deepEqual(placeReview.records.map(r => r.record_id), expansion.place_system_dossiers.map(r => r.place_system_dossier_id));
  const orientations = await get('phase-185-global-place-systems-atlas-i');
  const globalAuthority = await get('phase-117-global-authority-graph');
  const jurisdictionIndex = new Map(globalAuthority.jurisdictions.map(r => [r.jurisdiction_id,r]));
  const railIndex = new Map(globalAuthority.rails.map(r => [r.rail_id,r]));
  assert.equal(new Set(orientations.place_system_dossiers.map(r => r.jurisdiction_id)).size, orientations.place_system_dossiers.length);
  for (const r of orientations.place_system_dossiers) {
    const jurisdiction = jurisdictionIndex.get(r.jurisdiction_id);
    assert(jurisdiction, `Unknown jurisdiction: ${r.jurisdiction_id}`);
    assert.deepEqual(r.authority_rail_ids, jurisdiction.rail_ids);
    assert.deepEqual(r.source_ids, r.authority_rail_ids.map(id => railIndex.get(id)?.source_id));
    assert(r.authority_rail_ids.every(id => railIndex.get(id)?.jurisdiction_id === r.jurisdiction_id));
    assert.equal(r.place_stage, null);
  }
  const targets = await get('phase-197-underrepresented-region-topic-gap-closure');
  assert(targets.gap_closure_packets.every(r => r.named_entity === null && r.canonical_identity_id === null),
    'Target contracts now contain identities; reconcile them before counting');
  const translations = await get('phase-202-accessible-multilingual-low-bandwidth-editions');
  const annual = await get('phase-203-state-of-future-systems-2026');
  const readerPack = await get('phase-204-reader-completion');
  const readerIndex = new Map(readerPack.records.map(r => [r.record_id,r]));
  assert.equal(readerIndex.size, readerPack.records.length);
  const annualDrafts = annual.report_package_records.map(r => {
    const reader = readerIndex.get(r.report_record_id);
    assert(reader, `Annual record missing reader draft: ${r.report_record_id}`);
    return {record_id:r.report_record_id,record_kind:r.record_kind,historical_route:r.route,
      reader_title:reader.title,reader_record_sha256:hash(JSON.stringify(reader)),
      inherited_as_of_date:reader.inherited_as_of_date,authored_date:reader.authored_date,
      source_ids:reader.source_ids,review_status:reader.review_status,
      independent_acceptance:null,
      next_action:'Review this existing reader draft and its current source contexts; identify specific stale claims or substantive omissions before rewriting. Source links and structural completeness are not independent acceptance.'};
  });
  const gate = await get('phase-204-v1-public-reference-edition-promotion-gate');
  const followup = {
    montana_project_baseline: {records: montanaRows,
      source_ids: montana.source_ids, boundary: montana.interpretation_boundary,
      source_check: sourceCheck,
      registry_row_counts: [{registry:'phase-57g-montana-project-cohort-registry',array:'projects',rows:montana.projects.length},...layers.map(l => ({registry:l.registry,array:l.array,rows:l.records.length}))],
      shared_program_context: {canonical_id:montanaAggregate.canonical_id,atlas_id:montanaAggregate.atlas_id,route:montanaAggregate.route,
        relationship:'Source projects and aggregate casebook share Montana BEAD program scope; this is not an approved parent/child identity or portfolio-counting decision.'},
      counting_proposal:'Keep the aggregate as program context. Assess each distinct source project for a substantive dossier using its exact project ID; repeated version/envelope/control rows add no entities. Do not add the aggregate and children to one accepted-project total without an explicit counting decision.',
      counting_decision:null,
      next_action:'Obtain the applicable parent/child counting and dossier-eligibility decisions; source IDs are reconciled, but no completed project-quarter or accepted service was established.'},
    named_place_dossiers: expansion.place_system_dossiers.map(r => ({id: r.place_system_dossier_id,
      name: r.place_identity, project_context: r.subject, source_ids: r.source_ids, route: r.route,
      source_check: placeReview.records.find(n => n.record_id === r.place_system_dossier_id),
      canonical_id: null, next_action: 'Use the dated location note, obtain the precise missing geographic artifact, then review canonical identity and portfolio eligibility.'})),
    jurisdiction_orientations: orientations.place_system_dossiers.map(r => ({id: r.place_system_dossier_id,
      title: r.title, jurisdiction_id: r.jurisdiction_id, geographic_unit_kind: r.geographic_unit_kind,
      state: r.dossier_state, canonical_id: null,route:r.route,
      authority_rail_ids:r.authority_rail_ids,source_ids:r.source_ids,
      local_identity_reconciliation:'Exact jurisdiction, authority-rail and source-ID join verified; this is a discovery orientation, not an accepted local place dossier.',
      eligibility_decision:null,
      next_action:'Obtain the scope/counting decision for national or supranational orientations; do not sum them with municipality, county, campus or basin dossiers merely because all use place routes.'})),
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
  return {schema_version: '1.1', as_of_date: '2026-09-22',
    scope: 'Exact-identifier reconciliation of the listed local registries with a retained Montana CSV check and ten dated place-source notes. Broader source-array discovery remains incomplete. Not an accepted-portfolio total or admission decision.',
    inputs: [...new Map(pins.map(p => [p.path,p])).values()].sort((a,b) => a.path.localeCompare(b.path)),
    summary: {canonical_projects: records.filter(r => r.kind === 'Project').length,
      canonical_places: records.filter(r => r.kind === 'Place').length,
      additional_editorial_project_candidates: candidates.filter(r => r.kind === 'Project').length,
      additional_editorial_place_candidates: candidates.filter(r => r.kind === 'Place').length,
      montana_source_project_ids_reconciled: montanaRows.length,
      montana_source_projects_awaiting_eligibility: montanaRows.length,
      montana_registry_rows_reconciled: montanaRows.reduce((n,r) => n+r.membership.length,0),
      named_place_dossiers_source_checked: placeReview.records.length,
      named_place_dossiers_to_reconcile: expansion.place_system_dossiers.length,
      jurisdiction_orientations_to_disposition: orientations.place_system_dossiers.length,
      jurisdiction_orientations_joined: orientations.place_system_dossiers.length,
      national_orientations: orientations.place_system_dossiers.filter(r => r.geographic_unit_kind === 'National jurisdiction').length,
      supranational_orientations: orientations.place_system_dossiers.filter(r => r.geographic_unit_kind === 'Supranational jurisdiction').length,
      unnamed_target_contracts: targets.gap_closure_packets.length,
      target_projects: 100, target_places: 70, accepted_projects: null, accepted_places: null,
      accepted_project_gap: null, accepted_place_gap: null, new_admissions: 0},
    entities: records, additional_editorial_candidates: candidates, followup,
    mandatory_scope: {portfolio_gate: gate.promotion_gates.find(g => g.slug === 'portfolio-targets'),
      translations: translations.edition_contracts.filter(r => r.is_translation).map(r => ({id: r.edition_contract_id,
        topic_id: r.topic_id, language: r.target_language, translated_content: r.translated_content,
        human_editor: r.human_editor, subject_reviewer: r.subject_reviewer, approval_receipt_id: r.approval_receipt_id})),
      annual_edition_counts: annual.counts, annual_reader_drafts:annualDrafts},
    broader_array_discovery: {root_json_files_scanned: files.length, method: 'Top-level array-key discovery only; matching is not identity admission and may include inactive schemas.', records: discovery},
    remaining_census_work: ['Resolve parent/child counting and eligibility for the 32 reconciled Montana source projects; obtain exact geographic scope and identity decisions for the ten source-checked place dossiers.',
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
