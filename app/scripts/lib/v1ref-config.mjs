export const v1refEffectiveDate = "2026-09-01";
export const v1refVersion = "v1ref";
export const v1refProgramId = "FTFN-V1-PUBLIC-REFERENCE-EDITION";

export const v1refPhaseDefinitions = Object.freeze([
  { phase: 181, file: "phase-181-canonical-resource-map.json", section: "resource-map", workPackage: "phase-181-canonical-resource-map.md" },
  { phase: 182, file: "phase-182-evidence-source-backlog.json", section: "evidence-source-backlog", workPackage: "phase-182-evidence-source-backlog.md" },
  { phase: 183, file: "phase-183-missing-system-topic-missions.json", section: "missing-system-missions", workPackage: "phase-183-missing-system-topic-missions.md" },
  { phase: 184, file: "phase-184-canonical-topic-edition-2.json", section: "topic-canon", workPackage: "phase-184-canonical-topic-edition-2.md" },
  { phase: 185, file: "phase-185-global-place-systems-atlas-i.json", section: "global-places-i", workPackage: "phase-185-global-place-systems-atlas-i.md" },
  { phase: 186, file: "phase-186-named-delivery-case-atlas-ii.json", section: "delivery-cases-ii", workPackage: "phase-186-named-delivery-case-atlas-ii.md" },
  { phase: 187, file: "phase-187-outcomes-longitudinal-observatory.json", section: "outcome-candidates", workPackage: "phase-187-outcomes-longitudinal-observatory.md" },
  { phase: 188, file: "phase-188-state-of-frontier-systems-edition.json", section: "frontier-systems-edition", workPackage: "phase-188-state-of-frontier-systems-edition.md" },
  { phase: 189, file: "phase-189-global-authority-rail-activation.json", section: "global-authority", workPackage: "phase-189-global-authority-rail-activation.md" },
  { phase: 190, file: "phase-190-global-jurisdiction-system-profiles.json", section: "jurisdictions", workPackage: "phase-190-global-jurisdiction-system-profiles.md" },
  { phase: 191, file: "phase-191-international-named-project-conversion-cohort.json", section: "international-projects", workPackage: "phase-191-international-named-project-conversion-cohort.md" },
  { phase: 192, file: "phase-192-global-place-systems-atlas.json", section: "global-places-ii", workPackage: "phase-192-global-place-systems-atlas.md" },
  { phase: 193, file: "phase-193-comparative-evidence-lab.json", section: "comparative-lab", workPackage: "phase-193-comparative-evidence-lab.md" },
  { phase: 194, file: "phase-194-longitudinal-outcomes-observatory.json", section: "longitudinal-review", workPackage: "phase-194-longitudinal-outcomes-observatory.md" },
  { phase: 195, file: "phase-195-canonical-question-library.json", section: "questions", workPackage: "phase-195-canonical-question-library.md" },
  { phase: 196, file: "phase-196-global-reference-candidate-gate.json", section: "global-reference-gate", workPackage: "phase-196-global-reference-candidate-gate.md" },
  { phase: 197, file: "phase-197-underrepresented-region-topic-gap-closure.json", section: "gap-closure", workPackage: "phase-197-underrepresented-region-topic-gap-closure.md" },
  { phase: 198, file: "phase-198-failure-delay-reversal-correction-casebooks.json", section: "failure-casebooks", workPackage: "phase-198-failure-delay-reversal-correction-casebooks.md" },
  { phase: 199, file: "phase-199-distribution-affordability-service-quality-observatory.json", section: "distribution-observatory", workPackage: "phase-199-distribution-affordability-service-quality-observatory.md" },
  { phase: 200, file: "phase-200-cross-system-constraint-monographs.json", section: "constraint-monographs", workPackage: "phase-200-cross-system-constraint-monographs.md" },
  { phase: 201, file: "phase-201-change-intelligence-correction-service.json", section: "change-intelligence", workPackage: "phase-201-change-intelligence-correction-service.md" },
  { phase: 202, file: "phase-202-accessible-multilingual-low-bandwidth-editions.json", section: "accessible-editions", workPackage: "phase-202-accessible-multilingual-low-bandwidth-editions.md" },
  { phase: 203, file: "phase-203-state-of-future-systems-2026.json", section: "state-of-future-systems", workPackage: "phase-203-state-of-future-systems-2026.md" },
  { phase: 204, file: "phase-204-v1-public-reference-edition-promotion-gate.json", section: "promotion-gate", workPackage: "phase-204-v1-public-reference-edition-promotion-gate.md" },
]);

export const v1refExportNames = Object.freeze([
  ...v1refPhaseDefinitions.map(({ file }) => file),
  "v1-public-reference-edition.json",
]);

export const phaseDefinition = (phase) => {
  const definition = v1refPhaseDefinitions.find((candidate) => candidate.phase === phase);
  if (!definition) throw new Error(`Unknown v1 reference phase ${phase}.`);
  return definition;
};

