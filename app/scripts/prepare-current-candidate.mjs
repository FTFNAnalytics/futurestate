import{readFile,writeFile,readdir}from'node:fs/promises';import{dirname,resolve,join}from'node:path';import{fileURLToPath}from'node:url';import{readerCatalog}from'../src/lib/reader-catalog.mjs';
import {readShelfInputs,expectedShelfMembership} from './lib/read-shelf-inputs.mjs';
import {declaredPublicJsonExports, applyExportInventory} from './lib/public-json-inventory.mjs';
import {translatedReaders} from '../src/lib/translated-readers.mjs';
import {localityDossiers} from '../src/lib/locality-dossiers.mjs';
import {selectedArticleReviews} from '../src/lib/selected-article-reviews.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');const path=join(root,'../deployment/ftfn-v0.2-build.json');const manifest=JSON.parse(await readFile(path,'utf8'));
// Independent pre-extension inventory: September 14 initial production build.
// Counts come from source inputs, not from dist. Existing detail URLs are retained.
const input=await readShelfInputs(root),ledger=JSON.parse(await readFile(join(root,'src/data/phase-206-editorial-classification.json'),'utf8'));
const membership=expectedShelfMembership(input,ledger);
const shelfPages=Object.values(membership).reduce((sum,ids)=>sum+Math.max(1,Math.ceil(ids.length/40)),0);
const montanaDossiers=JSON.parse(await readFile(join(root,'src/data/montana-project-dossiers.json'),'utf8'));
manifest.expected_build.static_pages=10233+Math.ceil(readerCatalog.length/40)+2+shelfPages+input.readerPathways.length+input.updates.length+montanaDossiers.records.length+2+translatedReaders.length;
applyExportInventory(manifest, await declaredPublicJsonExports(root));
manifest.expected_build.updates=(await readdir(join(root,'src/content/updates'))).filter(f=>f.endsWith('.json')).length;
// This is current rendered membership, not the immutable Phase 55Q launch delta.
const gapRoot=join(root,'src/content/evidence-gaps');
const currentGaps=await Promise.all((await readdir(gapRoot)).filter(f=>f.endsWith('.json')).map(async f=>JSON.parse(await readFile(join(gapRoot,f),'utf8'))));
manifest.phase_55q_gap_routes=currentGaps.filter(g=>g.latest_review?.phase==='Phase 55Q').map(g=>`/atlas/evidence-gaps/${g.slug}/`).sort();
manifest.expected_build.phase_55q_gap_decisions=manifest.phase_55q_gap_routes.length;
const gate=`Confirm ${manifest.expected_build.static_pages.toLocaleString('en-US')} generated HTML pages, ${manifest.expected_build.public_json_exports} top-level public JSON exports, ${manifest.expected_build.updates} update records and all required outputs`;
manifest.release_gates=manifest.release_gates.map(g=>/^Confirm [\d,]+ generated HTML pages/.test(g)?gate:g);
if(!manifest.release_gates.includes(gate))manifest.release_gates.unshift(gate);
const editorial=JSON.parse(await readFile(join(root,'src/data/phase-205-216-current-editorial.json'),'utf8'));
const evidence=JSON.parse(await readFile(join(root,'src/data/phase-60-current-decisions.json'),'utf8'));
manifest.current_editorial_extension={as_of_date:[editorial.as_of_date,evidence.as_of_date].sort().at(-1),state:'Candidate prepared; full current validation pending',reader_drafts:33,independent_review_approvals:0,source_commit:null,github_publication:false,hosted_deployment:false,phase_216_complete:false};
manifest.current_editorial_extension.review_policy='OWNER-AUTHORIZED-AI-REVIEW-2026-09-25';
manifest.current_editorial_extension.human_review_required=false;
manifest.current_editorial_extension.ai_backlog_determinations=25;
manifest.current_editorial_extension.ai_portfolio_identity_determinations=103;
manifest.current_editorial_extension.new_ai_reviewed_project_dossiers=montanaDossiers.records.length;
manifest.current_editorial_extension.ai_reviewed_locality_accounts=localityDossiers.records.length;
manifest.current_editorial_extension.ai_reviewed_translations=translatedReaders.length;
manifest.current_editorial_extension.ai_selected_article_assessments=selectedArticleReviews.length;
await writeFile(path,JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared candidate expectations: ${manifest.expected_build.static_pages} HTML / ${manifest.expected_build.public_json_exports} JSON / ${manifest.expected_build.updates} updates. Historical last_verified receipt is not changed.`);
