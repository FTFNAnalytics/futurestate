import type { APIRoute } from "astro";
import p130 from "../../data/phase-130-authority-gap-closure-maps.json";
import p131 from "../../data/phase-131-priority-evidence-admission-dockets.json";
import p132 from "../../data/phase-132-dated-source-check-receipts.json";
import p133 from "../../data/phase-133-requirement-adjudication-board.json";
import p134 from "../../data/phase-134-mission-decision-register.json";
import p135 from "../../data/phase-135-atlas-conversion-readiness-audit.json";
import p136 from "../../data/phase-136-named-project-chronicles.json";
import p137 from "../../data/phase-137-place-delivery-ledgers.json";
import p138 from "../../data/phase-138-longitudinal-evidence-eligibility.json";
import p139 from "../../data/phase-139-comparative-dossier-rereview.json";
import p140 from "../../data/phase-140-living-topic-desks.json";
import p141 from "../../data/phase-141-frontier-systems-almanac.json";
import p142 from "../../data/phase-142-topic-delivery-roadmaps.json";
import p143 from "../../data/phase-143-editorial-cadence-editions.json";
import p144 from "../../data/phase-144-v1-launch-candidate-audit.json";
import v07 from "../../data/v07-evidence-admission-dockets.json";
import v08 from "../../data/v08-conversion-longitudinal-atlas.json";
import v09 from "../../data/v09-living-public-intelligence.json";
import p145 from "../../data/phase-145-evidence-gate-operations-journal.json";
import p146 from "../../data/phase-146-authority-gap-resolution-program.json";
import p147 from "../../data/phase-147-evidence-adjudication-record.json";
import p148 from "../../data/phase-148-atlas-changefeed.json";
import p149 from "../../data/phase-149-longitudinal-evidence-lab.json";
import p150 from "../../data/phase-150-comparison-passports-2-0.json";
import p151 from "../../data/phase-151-weekly-desk-review-ledger.json";
import p152 from "../../data/phase-152-frontier-topic-field-guides.json";
import p153 from "../../data/phase-153-future-state-report-series.json";
import p154 from "../../data/phase-154-september-edition-packets.json";
import p155 from "../../data/phase-155-public-method-corrections-library.json";
import p156 from "../../data/phase-156-v1-launch-decision.json";
import v1rc from "../../data/v1-release-candidate.json";
import p157 from "../../data/phase-157-v1-candidate-preservation-ledger.json";
import p158 from "../../data/phase-158-september-evidence-operations-desk.json";
import p159 from "../../data/phase-159-owner-decision-sprint.json";
import p160 from "../../data/phase-160-longitudinal-pilot-matrices.json";
import p161 from "../../data/phase-161-stack-watch.json";
import p162 from "../../data/phase-162-local-system-expansion.json";
import p163 from "../../data/phase-163-september-editorial-runbooks.json";
import p164 from "../../data/phase-164-monthly-candidate-decision.json";
import v1month from "../../data/v1-monthly-operating-program.json";
import p165 from "../../data/phase-165-live-evidence-operations-cycle-001.json";
import p166 from "../../data/phase-166-weekly-desk-closures-and-editions.json";
import p167 from "../../data/phase-167-authority-resolution-hearings.json";
import p168 from "../../data/phase-168-requirement-mission-adjudication.json";
import p169 from "../../data/phase-169-longitudinal-pilot-adjudication.json";
import p170 from "../../data/phase-170-fifteen-place-systems-atlas.json";
import p171 from "../../data/phase-171-frontier-systems-compendium.json";
import p172 from "../../data/phase-172-september-state-report.json";
import v1cycle from "../../data/v1-september-evidence-cycle.json";
import p173 from "../../data/phase-173-september-closeout-october-opening-ledger.json";
import p174 from "../../data/phase-174-evidence-cycle-closure-intake.json";
import p175 from "../../data/phase-175-owner-disposition-sprint-ii.json";
import p176 from "../../data/phase-176-longitudinal-admission-and-zero-series-decision.json";
import p177 from "../../data/phase-177-october-stack-watch-and-source-currency-sweep.json";
import p178 from "../../data/phase-178-systems-atlas-and-compendium-depth-expansion.json";
import p179 from "../../data/phase-179-october-weekly-editions-and-month-end-synthesis.json";
import p180 from "../../data/phase-180-october-state-report-and-v1-promotion-gate.json";
import v1oct from "../../data/v1-october-operating-program.json";
import v1ref from "../../data/v1-public-reference-edition.json";
import { v1refDatasetMap } from "../../data/v1ref-registry";

export function getStaticPaths() {
  const datasets: Record<string, any> = {
    "phase-130-authority-gap-closure-maps": p130, "phase-131-priority-evidence-admission-dockets": p131, "phase-132-dated-source-check-receipts": p132, "phase-133-requirement-adjudication-board": p133, "phase-134-mission-decision-register": p134,
    "phase-135-atlas-conversion-readiness-audit": p135, "phase-136-named-project-chronicles": p136, "phase-137-place-delivery-ledgers": p137, "phase-138-longitudinal-evidence-eligibility": p138, "phase-139-comparative-dossier-rereview": p139,
    "phase-140-living-topic-desks": p140, "phase-141-frontier-systems-almanac": p141, "phase-142-topic-delivery-roadmaps": p142, "phase-143-editorial-cadence-editions": p143, "phase-144-v1-launch-candidate-audit": p144,
    "v07-evidence-admission-dockets": v07, "v08-conversion-longitudinal-atlas": v08, "v09-living-public-intelligence": v09,
    "phase-145-evidence-gate-operations-journal": p145, "phase-146-authority-gap-resolution-program": p146, "phase-147-evidence-adjudication-record": p147, "phase-148-atlas-changefeed": p148, "phase-149-longitudinal-evidence-lab": p149,
    "phase-150-comparison-passports-2-0": p150, "phase-151-weekly-desk-review-ledger": p151, "phase-152-frontier-topic-field-guides": p152, "phase-153-future-state-report-series": p153, "phase-154-september-edition-packets": p154, "phase-155-public-method-corrections-library": p155, "phase-156-v1-launch-decision": p156, "v1-release-candidate": v1rc,
    "phase-157-v1-candidate-preservation-ledger": p157, "phase-158-september-evidence-operations-desk": p158, "phase-159-owner-decision-sprint": p159, "phase-160-longitudinal-pilot-matrices": p160,
    "phase-161-stack-watch": p161, "phase-162-local-system-expansion": p162, "phase-163-september-editorial-runbooks": p163, "phase-164-monthly-candidate-decision": p164, "v1-monthly-operating-program": v1month,
    "phase-165-live-evidence-operations-cycle-001": p165, "phase-166-weekly-desk-closures-and-editions": p166, "phase-167-authority-resolution-hearings": p167, "phase-168-requirement-mission-adjudication": p168,
    "phase-169-longitudinal-pilot-adjudication": p169, "phase-170-fifteen-place-systems-atlas": p170, "phase-171-frontier-systems-compendium": p171, "phase-172-september-state-report": p172, "v1-september-evidence-cycle": v1cycle,
    "phase-173-september-closeout-october-opening-ledger": p173, "phase-174-evidence-cycle-closure-intake": p174, "phase-175-owner-disposition-sprint-ii": p175, "phase-176-longitudinal-admission-and-zero-series-decision": p176,
    "phase-177-october-stack-watch-and-source-currency-sweep": p177, "phase-178-systems-atlas-and-compendium-depth-expansion": p178, "phase-179-october-weekly-editions-and-month-end-synthesis": p179, "phase-180-october-state-report-and-v1-promotion-gate": p180, "v1-october-operating-program": v1oct,
    ...v1refDatasetMap,
    "v1-public-reference-edition": v1ref,
  };
  return Object.keys(datasets).map((release) => ({ params: { release }, props: { dataset: datasets[release] } }));
}
export const GET: APIRoute = ({ props }) => new Response(JSON.stringify(props.dataset, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
