import { runGovernedContentHarness } from "./lib/run-governed-content-harness.mjs";
await runGovernedContentHarness({
  phase: 101,
  registryFilename: "phase-101-whole-system-futures-scenario-governance-polycrisis-readiness-civilizational-resilience-future-generations-registry.json",
  zeroLabel: "scenario, forecast, probability, polycrisis, stress-test, readiness, option, recovery, resilience, renewal, or future-generations decisions",
  families: [
    { label: "scenario", required: ["verified_phase100", "purpose", "identity", "baseline", "drivers", "assumptions", "boundaries", "uncertainty", "review", "receipt"] },
    { label: "polycrisis", required: ["adopted_scenario", "identity", "dependencies", "hazards", "exposure", "cascades", "exercise", "observation", "correction", "receipt"] },
    { label: "readiness", required: ["verified_stress_test", "mission", "options", "authority", "resources", "portfolio", "continuity", "recovery", "review", "receipt"] },
    { label: "civilizational-resilience", required: ["verified_readiness", "essential_floors", "ecology", "knowledge", "institutions", "capacity", "renewal", "future_generations", "review", "receipt"] }
  ]
});
