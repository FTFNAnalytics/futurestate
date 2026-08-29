import { runGovernedContentHarness } from "./lib/run-governed-content-harness.mjs";
await runGovernedContentHarness({
  phase: 102,
  registryFilename: "phase-102-public-knowledge-synthesis-civic-decision-literacy-reader-navigation-content-closure-evergreen-stewardship-registry.json",
  zeroLabel: "evidence, synthesis, recommendation, reader, comprehension, accessibility, translation, content-closure, archive, deletion, or evergreen-truth decisions",
  families: [
    { label: "canonical-synthesis", required: ["verified_phase101", "purpose", "lineage", "claims", "evidence", "counterevidence", "uncertainty", "citations", "review", "receipt"] },
    { label: "decision-literacy", required: ["adopted_synthesis", "reader", "question", "authority", "options", "tradeoffs", "distribution", "public_reason", "review", "receipt"] },
    { label: "reader-navigation", required: ["verified_literacy", "reader_need", "entry_point", "pathway", "plain_language", "accessibility", "translation", "usability", "review", "receipt"] },
    { label: "content-stewardship", required: ["verified_navigation", "corpus", "coverage", "source_health", "lineage", "maintenance", "refresh", "correction", "review", "receipt"] }
  ]
});
