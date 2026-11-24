import {createHash} from 'node:crypto';
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {pilotReviews} from './content-205-216/pilot-reviews.mjs';
import {pilotResearchFollowups} from './content-205-216/pilot-research-followups.mjs';
import {backlogReviewDate,backlogArtifactChecks,backlogResearchReviews} from './content-205-216/backlog-reviews.mjs';
import backlogPins from './content-205-216/backlog-review-inputs.json' with {type:'json'};
import {verifyBacklogInputs,backlogPropagation,assembleBacklogReview} from './lib/backlog-research.mjs';
import {verifyAuthorizedAdjudications} from './lib/authorized-adjudications.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=async path=>JSON.parse(await readFile(join(root,path),'utf8'));
const reviewPolicy=await read('src/data/build-review-policy.json');
const adjudications=await read('src/data/owner-authorized-adjudications.json');
const registry=await read('src/data/phase-61-project-conversion-registry.json');
const file=registry.records.find(r=>r.file_id==='61-PROJECT-TORONTO-24-254930');
const editorial=await read('src/data/phase-205-216-current-editorial.json');
const affectedIds=[file.file_id,file.canonical_briefing_id,...file.source_ids,...file.signal_ids,...file.evidence_gap_ids,...file.local_system_ids,...file.reader_pathway_ids,...file.dependency_map_ids,'191-PROJECT-001','192-PLACE-001','195-BRIEF-053'];
const routes=new Set(['/atlas/projects/toronto-24-254930/','/atlas/places/ontario-real-estate/','/data/project-conversion.json','/updates/']);
for(const article of editorial.records)if(affectedIds.includes(article.record_id))routes.add(article.route);
const collections=[['sources','/atlas/sources/'],['signals','/signals/'],['briefings','/briefings/'],['dependency-maps','/atlas/dependency-maps/'],['local-systems','/atlas/local-systems/'],['evidence-gaps','/atlas/evidence-gaps/']];
for(const [folder,prefix]of collections)for(const name of await readdir(join(root,'src/content',folder))){
  const text=await readFile(join(root,'src/content',folder,name),'utf8');
  const data=name.endsWith('.json')?JSON.parse(text):{id:text.match(/^id: "([^"]+)"/m)?.[1],slug:text.match(/^slug: "([^"]+)"/m)?.[1]};
  if(affectedIds.includes(data.id))routes.add(`${prefix}${folder==='sources'?data.id:data.slug}/`);
}
const receipt={receipt_id:'207-TORONTO-2026-09-14-BOUNDED-RECHECK',file_id:file.file_id,scheduled_date:'2026-09-09',checked_date:'2026-09-14',decision:'Retain prior stage; downstream enactment/permit verification remains bounded and incomplete',prior_stage:file.current_stage,current_stage:file.current_stage,source_ids:file.source_ids,affected_record_ids:affectedIds,affected_routes:[...routes],source_checks:[{url:'https://secure.toronto.ca/council/agenda-item.do?item=2026.SC33.9',access:'Full item history retrieved',finding:'Council adoption and recommendation 8 pre-enactment conditions remain in the reviewed record.'},{url:'https://secure.toronto.ca/nm/api/individual/notice/7606.do',access:'Official notice retrieved through search',finding:'Exact application and July 9 public-meeting identity; not a subsequent enactment or permit.'}],search_scope:'Official-site searches for the application number with permit/by-law and exact item history. No exact downstream instrument was retrieved; project-portal/permit-file coverage is incomplete.',bounded_finding:'The reviewed Council record supports the retained adoption-with-conditions state. No project advancement is inferred. This bounded check does not establish that enactment, condition compliance or a permit does not exist.',next_check_date:'2026-09-21',next_action:'Retrieve exact enacted amendment numbers and project-file condition/permit records; retain the missed September 9 schedule and actual September 14 review separately.',human_admission_authorized:false,publication_authorized:false};
receipt.sha256=createHash('sha256').update(JSON.stringify(receipt)).digest('hex');
const projectFollowups=[];
for(const name of (await readdir(join(root,'src/data/phase-207-project-checks'))).filter(n=>n.endsWith('.json')).sort()){
 const followup=await read(`src/data/phase-207-project-checks/${name}`);
 const {sha256,...payload}=followup;
 if(createHash('sha256').update(JSON.stringify(payload)).digest('hex')!==sha256)throw new Error(`Invalid preserved project check ${name}`);
 projectFollowups.push(followup);
}
const projectReceipts=[receipt,...projectFollowups];
if(new Set(projectReceipts.map(r=>r.receipt_id)).size!==projectReceipts.length)throw new Error('Duplicate project receipt');
const backlog=await read('src/data/phase-182-evidence-source-backlog.json');
await verifyBacklogInputs(root,backlogPins,backlog,backlogResearchReviews);
const researchReceipts=[];
for(const review of backlogResearchReviews){
 const prior=backlog.backlog_items.find(r=>r.backlog_item_id===review.backlog_item_id);
 const propagation=await backlogPropagation(root,prior,editorial,registry);
 researchReceipts.push(assembleBacklogReview({review,prior,pin:backlogPins.records.find(r=>r.backlog_item_id===review.backlog_item_id),checks:backlogArtifactChecks,propagation,date:backlogReviewDate}));
}
const selected=backlog.backlog_items.filter(x=>x.first_pass_cohort).slice(0,25).map(x=>({backlog_item_id:x.backlog_item_id,signal_id:x.signal_id,title:x.title,source_ids:x.source_ids,date:'2026-09-14',state:'Review preparation only — publication and admissibility held',reason:'Existing evidence/source binding retained. No individual current-artifact review or authorized decision has been completed by this batch preparation.',next_action:'Check the exact artifact, review the claim and limitations, then obtain the required disposition.'}));
for(const row of selected){const review=researchReceipts.find(r=>r.backlog_item_id===row.backlog_item_id);if(review)Object.assign(row,{state:review.state,reason:review.finding,next_action:review.next_action,research_review_id:review.review_id,next_check_date:review.next_check_date});}
verifyAuthorizedAdjudications(reviewPolicy,adjudications,researchReceipts,backlogArtifactChecks);
for(const row of selected){const decision=adjudications.backlog.find(d=>d.backlog_item_id===row.backlog_item_id);Object.assign(row,{state:`AI-adjudicated — ${decision.disposition}`,reason:decision.rationale,next_action:decision.reopening_condition,decision_id:decision.decision_id,decision_date:decision.decision_date,reviewer:adjudications.reviewer});}
for(const review of researchReceipts){
 const number=review.backlog_item_id.slice(-3);
 const update={id:`update-2026-09-14-backlog-research-${number}`,effective_date:backlogReviewDate,entry_type:'Source Refresh',title:`Evidence backlog ${number}: bounded research check; disposition pending`,summary:review.finding,affected_record_ids:review.affected_record_ids,related_paths:[...review.affected_routes,'/data/current-operations.json','/method/editorial-review/'],evidence_note:`${review.recommendation} Assisted research only: no human reviewer, final admission, publication authorization or Phase 60 gate decision is recorded. Exact artifact dates, observation periods, locators and access limits are preserved in the research receipt.`,receipt_id:review.review_id,source_checked_date:review.checked_date,receipt_type:'Watch Note',materiality:'No record-state change',next_check_date:review.next_check_date,publication_effect:'Candidate research note only; historical publication and source-profile dates unchanged',work_package:'docs/work-packages/phase-207-dated-evidence-operations-and-source-currency.md'};
 await writeFile(join(root,`src/content/updates/2026-09-14-backlog-research-${number}.json`),JSON.stringify(update,null,2)+'\n');
}
for(const pilot of pilotReviews){const original=(await read('src/data/phase-160-longitudinal-pilot-matrices.json')).pilot_matrices.find(p=>p.pilot_matrix_id===pilot.pilot_id);if(!original)throw new Error(`Unknown pilot ${pilot.pilot_id}`);pilot.entity_id=original.entity_id;}
for(const followup of pilotResearchFollowups){
 const pilot=pilotReviews.find(p=>p.pilot_id===followup.pilot_id);
 if(!pilot||pilot.entity_id!==followup.entity_id)throw new Error(`Unknown measurement follow-up identity ${followup.review_id}`);
 const expectedRoutes=['/method/editorial-review/',...followup.affected_record_ids.map(id=>{const article=editorial.records.find(r=>r.record_id===id);if(!article)throw new Error(`Unknown follow-up reader ${id}`);return article.route;})];
 if(JSON.stringify([...new Set(expectedRoutes)].sort())!==JSON.stringify([...followup.affected_routes].sort()))throw new Error(`Measurement follow-up route mismatch ${followup.review_id}`);
}
const operationsDate=[reviewPolicy.effective_date,...projectReceipts.map(r=>r.checked_date),...pilotResearchFollowups.map(r=>r.checked_date)].sort().at(-1);
await writeFile(join(root,'src/data/phase-207-current-operations.json'),JSON.stringify({schema_version:'1.2',as_of_date:operationsDate,review_policy:reviewPolicy,receipts:projectReceipts,review_batch:selected,backlog_artifact_checks:backlogArtifactChecks,backlog_reviews:researchReceipts,backlog_adjudications:adjudications.backlog,backlog_research_checked:researchReceipts.length,backlog_research_unchecked:selected.length-researchReceipts.length,backlog_authorized_dispositions:adjudications.backlog.length,pilot_reviews:pilotReviews,pilot_research_followups:pilotResearchFollowups,governed_series_admitted:0,phase_state:'25 backlog determinations completed by owner-authorized AI review. Portfolio and content building continue; measured-series evidence and future calendar remain separate.'},null,2)+'\n');
console.log(`Toronto bounded catch-up preserved; ${researchReceipts.length} retained research reviews; ${adjudications.backlog.length} owner-authorized AI backlog determinations. No human or measured-series acceptance claimed.`);
