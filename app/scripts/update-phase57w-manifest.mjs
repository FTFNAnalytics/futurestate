import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot=fileURLToPath(new URL("..",import.meta.url));
const workspaceRoot=dirname(appRoot);
const manifestPath=join(workspaceRoot,"deployment","ftfn-v0.2-build.json");
const capturedDate="2026-08-10";
const archiveSlug="quorum-ceremonies-witness-availability-fork-accountability-time-failover-build-provenance-reissuance-2026";
const briefingSlug="research-watch-053-quorum-operations-and-post-compromise-reissuance";
const archivePath=join(appRoot,"public","downloads",archiveSlug+".zip");
const manifest=JSON.parse(await readFile(manifestPath,"utf8"));
const ledger=JSON.parse(await readFile(join(appRoot,"src","data","phase-57w-quorum-ceremonies-witness-availability-fork-time-build-reissuance.json"),"utf8"));
const archiveBuffer=await readFile(archivePath);
const archiveSha256=createHash("sha256").update(archiveBuffer).digest("hex").toUpperCase();
const addUnique=(items,additions)=>[...new Set([...(items??[]),...additions])];
const publishedSignalSlugs=ledger.records.filter((record)=>record.record_status==="Published").map((record)=>record.signal_id.replace(/^signal-/,""));
const archiveCommand="powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug "+archiveSlug;

manifest.predeploy_commands=manifest.predeploy_commands.filter((command)=>![archiveCommand,"npm run test:phase57w","npm run verify:phase57w"].includes(command));
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"),0,archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"),0,"npm run test:phase57w","npm run verify:phase57w");

manifest.expected_build={...manifest.expected_build,static_pages:3597,signals:1280,published_signals:1011,in_review_signals:269,draft_sample_signals:0,
  published_support_sources:498,sources:715,topics:17,organizations:19,technologies:5,local_systems:5,briefings:61,published_briefings:54,in_review_briefings:7,
  evidence_gaps:16,dependency_maps:7,published_dependency_maps:6,in_review_dependency_maps:1,research_collections:58,research_documents:1396,reader_pathways:15,
  published_reader_pathways:11,reader_pathway_surfaces:19,phase_55q_gap_decisions:4,updates:77,public_json_exports:5,research_export_records:1204,pathway_export_records:11};

manifest.release_delta_from_v0_1_1={...manifest.release_delta_from_v0_1_1,static_pages_added:3415,signals_added:1262,published_signals_added:1008,sources_added:613,
  summary:"Extends the Phase 55K through Phase 57V evidence baseline with Phase 57W governed quorum ceremonies and member lifecycle, bounded witness availability and catch-up, attributable fork quarantine, federated time-authority failover, three-verifier reproducible build provenance, and lineage-preserving post-compromise re-issuance: 715 public sources, 1,280 signals, 1,011 Published signals, five local systems, fifty-four Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 77 public updates, fifty-eight research collections, 1,396 summarized research documents, 1,204 research export records, and five versioned public-data exports."};

manifest.phase_57w_delta={
  operational_federation_records_reviewed:63,records_added_published:54,records_held_in_review:9,contract_specific_controls_published:54,controls_per_contract:6,
  ceremony_schemas:9,availability_schemas:9,fork_evidence_schemas:9,time_failover_schemas:9,build_provenance_schemas:9,artifact_reissuance_schemas:9,total_contract_specific_schemas:54,
  ceremony_cases:252,valid_ceremony_routes:72,rejected_ceremony_routes:180,availability_cases:234,valid_availability_routes:63,rejected_availability_routes:171,
  fork_evidence_cases:216,valid_fork_evidence_routes:54,rejected_fork_evidence_routes:162,time_failover_cases:225,valid_time_failover_routes:63,rejected_time_failover_routes:162,
  build_provenance_cases:243,valid_build_provenance_routes:72,rejected_build_provenance_routes:171,artifact_reissuance_cases:261,valid_artifact_reissuance_routes:72,rejected_artifact_reissuance_routes:189,
  total_workflow_cases:1431,valid_or_preservation_routes:396,rejected_routes:1035,workflow_test_failures:0,
  actual_ceremonies:0,actual_membership_events:0,actual_availability_observations:0,actual_catchup_proofs:0,actual_fork_events:0,actual_fork_attributions:0,actual_time_failovers:0,actual_build_attestations:0,actual_reissuances:0,actual_reader_migrations:0,
  actual_reader_state_changes:0,eligible_records_accepted:0,reopening_triggers_fired:0,automated_closures_or_publications:0,operating_outcomes_ingested:0,
  exact_target_artifacts_acquired:0,public_agency_contacts_or_foia_requests:0,directive_scope_changes:0,implementation_changes:0,capability_changes:0,closure_changes:0,
  attribution_changes:0,operating_outcome_changes:0,inherited_entity_ledger_closure_changes:0,current_closure_states_closed:1,current_closure_states_partially_closed:21,
  current_closure_states_open:2,phase_57v_holds_preserved:9,new_visible_holds:0,official_source_profiles_added:0,official_source_profiles_reused:36,
  structured_ceremony_registries_added:1,structured_availability_registries_added:1,structured_fork_evidence_registries_added:1,structured_time_failover_registries_added:1,structured_build_provenance_registries_added:1,structured_reissuance_registries_added:1,
  research_documents_added_published:54,research_documents_added_in_review:9,signals_added_published:54,signals_added_in_review:9,downloadable_records:63,
  archive_file_count:66,archive_bytes:archiveBuffer.length,archive_sha256:archiveSha256,briefings_added_published:1,reader_pathways_deepened:3,topics_deepened:5,
  dependency_maps_deepened:1,public_update_entries_added:1,generated_pages_added:128,
  deployment_status:"pending_exact_source_commit_and_owner_only_deployment_phase-57v-version-78-remains-live"
};

manifest.last_verified={...manifest.last_verified,date:capturedDate,published_support_minimum_date:"2026-07-22",validate_content:"passed-715-sources-1280-signals-1396-research-documents",
  source_health:"passed",source_health_manual_review:494,source_health_probe_ready:221,source_monitor_current:715,astro_check:"passed",build:"passed",static_pages_built:3597,
  release_assertions:"passed-phase-57w",browser_qa:"passed-local-phase-55k; phase-55l-through-phase-57w-visual-qa-not-requested",
  preview_qa:"phase-57w-owner-only-deployment-pending-exact-source-commit; phase-57v-owner-only-sites-version-78-remains-live-and-verified"};

manifest.required_output_files=addUnique(manifest.required_output_files,["dist/research/"+archiveSlug+"/index.html","dist/downloads/"+archiveSlug+".zip","dist/briefings/"+briefingSlug+"/index.html",...publishedSignalSlugs.map((slug)=>"dist/signals/"+slug+"/index.html")]);
manifest.published_signal_routes=addUnique(manifest.published_signal_routes,publishedSignalSlugs.map((slug)=>"/signals/"+slug+"/"));
manifest.launch_critical_routes=addUnique(manifest.launch_critical_routes,["/research/"+archiveSlug+"/","/downloads/"+archiveSlug+".zip","/briefings/"+briefingSlug+"/",...publishedSignalSlugs.map((slug)=>"/signals/"+slug+"/")]);
manifest.published_briefing_routes=addUnique(manifest.published_briefing_routes,["/briefings/"+briefingSlug+"/"]);

manifest.release_gates=manifest.release_gates.map((gate)=>{
  if(/^Confirm [\d,]+ generated HTML pages/.test(gate))return "Confirm 3,597 generated HTML pages and all required outputs";
  if(/^Confirm all \d+ Published signal URLs/.test(gate))return "Confirm all 1,011 Published signal URLs are present in the sitemap";
  if(/^Confirm all (fifty-one|51|fifty-two|52|fifty-three|53|fifty-four|54) Published briefing URLs/.test(gate))return "Confirm all fifty-four Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if(/^Confirm all \d+ sources supporting Published signals/.test(gate))return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if(/^Confirm the \d+-entry public update log/.test(gate))return "Confirm the 77-entry public update log renders";
  if(/^Confirm all (fifty-five|55|fifty-six|56|fifty-seven|57|fifty-eight|58) research collections/.test(gate))return "Confirm all fifty-eight research collections render 1,396 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates=addUnique(manifest.release_gates,[
  "Confirm Phase 57W contains sixty-three unique records: fifty-four contract-specific ceremony, availability, fork-evidence, time-failover, build-provenance, re-issuance, and zero-state-inflation controls plus nine preserved holds",
  "Confirm Phase 57W publishes fifty-four bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57V holds exactly once, and adds no new hold",
  "Confirm nine ceremony schemas pass 252 cases, preserve seventy-two admission, suspension, replacement, emergency, fixed-threshold, actor-separation, domain-separation, and append-only routes, and reject 180 threshold-lowering, unquorate, duplicated, unauthorized, unreasoned, untimed, replayed, rewritten, publication, closure, or evidence fixtures",
  "Confirm nine witness-availability schemas pass 234 cases, preserve sixty-three bounded-staleness, stale-exclusion, catch-up, gap-coverage, consistency, lineage, and rejoin routes, and reject 171 incomplete, regressive, rewritten, majority-substituting, unverified, unknown, revoked, activation, publication, closure, or evidence fixtures",
  "Confirm nine fork-evidence schemas pass 216 cases, preserve fifty-four conflict, observer, technical-attribution, quarantine, and no-automatic-blame routes, and reject 162 nonfork, incomparable, dependent, invalid, unattributable, blame-assigning, publishing, closing, rewriting, substituting, bypassing, replaying, activating, resolving, or causal fixtures",
  "Confirm nine time-failover schemas pass 225 cases, preserve sixty-three failover, monotonic-sequence, counter, time, lineage, quorum, and domain routes, and reject 162 regressive, missing, self-failover, unquorate, dependent, unnecessary, rollback, substituting, invalid, skewed, stale, rewritten, publication, or evidence fixtures",
  "Confirm nine build-provenance schemas pass 243 cases, preserve seventy-two source, recipe, SBOM, artifact, verifier, codebase, operator, and builder routes, and reject 171 missing, insufficient, duplicated, shared, divergent, nonreproducible, substituting, replayed, rewritten, publication, or evidence fixtures",
  "Confirm nine re-issuance schemas pass 261 cases, preserve seventy-two distinct-artifact, compromised-lineage, explicit-link, threshold, witness, time, build, and inactive-migration routes, and reject 189 reused, unlinked, rewritten, re-trusted, unauthorized, unwitnessed, untimed, unprovenanced, unverified, activated, publishing, closing, replayed, backdated, partial, unsigned, causal, or outcome fixtures",
  "Confirm Phase 57W records zero production ceremonies, membership events, availability observations, catch-up proofs, fork events, fork attributions, time failovers, build attestations, re-issuances, reader migrations, reader-state changes, triggers, publications, closures, or operating-outcome changes",
  "Confirm Phase 57W preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero evidence, acceptance, scope, implementation, capability, closure, attribution, or operating-outcome promotions",
  "Confirm the Phase 57W collection contains sixty-three official-link records backed by thirty-six carried Tier 1 sources and a sixty-six-file archive"
]);

manifest.notes="This manifest records the locally release-validated Phase 57W governed-ceremony, witness-availability, fork-accountability, time-failover, build-provenance, and re-issuance expansion. Thirty-six carried Tier 1 sources support fifty-four Published contract-specific controls, nine preserved In Review holds, fifty-four schemas, 1,431 executable cases, Research Watch 053, one collection, one update, and a sixty-six-file archive. Threshold lowering, stale-witness counting, incomplete catch-up, automatic blame, time rollback, divergent builds, compromised-lineage rewriting, and retroactive trust fail closed; reader migration remains inactive. Zero production ceremonies, membership events, availability observations, catch-up proofs, fork events, fork attributions, time failovers, build attestations, re-issuances, reader migrations, reader-state changes, triggers, publications, closures, or operating-outcome changes are recorded. The Phase 57W package awaits exact-source commit and owner-only deployment. Sites version 78 continues to serve the exact Phase 57V package with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath,JSON.stringify(manifest,null,2)+"\n","utf8");
console.log("Updated Phase 57W manifest at "+manifestPath+"; archive "+archiveBuffer.length+" bytes, SHA-256 "+archiveSha256);

