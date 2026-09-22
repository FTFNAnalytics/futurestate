// Dated rendering repair, 2026-09-14. Historical update records remain unchanged.
export const historicalPathRepairs = Object.freeze({
  '/sources/': '/atlas/sources/',
  '/atlas/pathways/': '/atlas/#reader-pathways',
  '/briefings/evidence-return-control-room-001/': '/briefings/evidence-return-control-room-001-forty-five-governed-returns/',
  '/briefings/research-watch-039-versioned-registry-change-detection-bounded-observation-ingestion/': '/briefings/research-watch-039-versioned-change-detection-bounded-observation-ingestion/',
  ...Object.fromEntries([
    'local-conversion-southwest-ontario', 'critical-minerals-to-industrial-capacity',
    'energy-grid-capacity-to-service', 'climate-observation-to-local-decision',
    'autonomy-regulation-to-service', 'ai-infrastructure-policy-to-assurance',
    'advanced-manufacturing-workforce-to-operating-capacity', 'industrial-water-agreement-to-reuse-operation',
  ].map(slug => [`/pathways/${slug}/`, `/atlas/#pathway-${slug}`])),
  '/dependency-maps/observation-data-is-not-local-decision/': '/atlas/dependency-maps/observation-data-is-not-local-decision/',
  '/dependency-maps/autonomy-rules-are-not-service/': '/atlas/dependency-maps/autonomy-rules-are-not-service/',
  '/local-systems/us-southwest-chip-corridor/': '/atlas/local-systems/us-southwest-chip-corridor/',
  '/local-systems/ontario-real-estate/': '/atlas/local-systems/ontario-real-estate/',
});

// Additive September 15 repair; preserve the original sixteen-target audit.
export const currentPathRepairs = Object.freeze({
  '/classification/': '/browse/classification/1/',
});
export const canonicalContentPath = path => historicalPathRepairs[path] ?? currentPathRepairs[path] ?? path;
