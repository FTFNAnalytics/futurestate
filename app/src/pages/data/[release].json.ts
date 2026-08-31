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

export function getStaticPaths() {
  const datasets: Record<string, any> = {
    "phase-130-authority-gap-closure-maps": p130, "phase-131-priority-evidence-admission-dockets": p131, "phase-132-dated-source-check-receipts": p132, "phase-133-requirement-adjudication-board": p133, "phase-134-mission-decision-register": p134,
    "phase-135-atlas-conversion-readiness-audit": p135, "phase-136-named-project-chronicles": p136, "phase-137-place-delivery-ledgers": p137, "phase-138-longitudinal-evidence-eligibility": p138, "phase-139-comparative-dossier-rereview": p139,
    "phase-140-living-topic-desks": p140, "phase-141-frontier-systems-almanac": p141, "phase-142-topic-delivery-roadmaps": p142, "phase-143-editorial-cadence-editions": p143, "phase-144-v1-launch-candidate-audit": p144,
    "v07-evidence-admission-dockets": v07, "v08-conversion-longitudinal-atlas": v08, "v09-living-public-intelligence": v09,
  };
  return Object.keys(datasets).map((release) => ({ params: { release }, props: { dataset: datasets[release] } }));
}
export const GET: APIRoute = ({ props }) => new Response(JSON.stringify(props.dataset, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
