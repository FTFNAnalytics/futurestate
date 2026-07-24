export type MetaTone = "default" | "possibility" | "urgency" | "review" | "draft" | "published";

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getStatusTone(status: string): MetaTone {
  if (status === "Published") return "published";
  if (status === "In Review") return "review";
  if (status === "Needs Update") return "urgency";
  if (status === "Draft Sample" || status === "Draft") return "draft";
  return "default";
}

export function getVerificationTone(status: string): MetaTone {
  if (status === "Verified Against Primary Source" || status === "Reviewed") return "possibility";
  if (status === "Needs Follow-Up" || status === "Disputed") return "urgency";
  if (status === "Unreviewed") return "draft";
  return "default";
}

export function getEvidenceGapTone(status: string): MetaTone {
  if (status === "Resolved") return "published";
  if (status === "Source Added" || status === "Source Identified") return "review";
  if (status === "Open" || status === "Signal Needed" || status === "Local Profile Update Needed") return "urgency";
  if (status === "Deferred") return "draft";
  return "default";
}

export function getStatusNote(status: string): string {
  if (status === "Published") return "Public editorial record.";
  if (status === "In Review") return "Source checked; awaiting final publication review.";
  if (status === "Draft Sample") return "Scaffold record visible during prelaunch review.";
  if (status === "Draft") return "Editorial draft, not public-ready.";
  if (status === "Needs Update") return "Published context may be stale or incomplete.";
  if (status === "Archived") return "Preserved for history, not current intelligence.";
  return "Editorial state not classified.";
}

export function getClaimScopeNote(scope: string): string {
  if (scope === "General Context") return "Frames a topic or system without making a specific local claim.";
  if (scope === "Specific Source Update") return "Summarizes a bounded source update, release, filing, dataset, or standard.";
  if (scope === "System-Level Pattern") return "Interprets a recurring pattern across systems or signals.";
  if (scope === "Local Constraint Map") return "Maps how a signal may meet local constraints without proving local outcomes.";
  if (scope === "Project-Level Claim") return "Makes a claim about a specific project, facility, filing, permit, or deployment.";
  if (scope === "Speculative Scenario") return "Explores a plausible future that requires clear caveats.";
  if (scope === "Editorial Synthesis") return "Synthesizes multiple records while preserving their evidence limits.";
  return "Claim scope not classified.";
}

export function getLocalEvidenceNote(level: string): string {
  if (level === "None") return "No local evidence layer is attached.";
  if (level === "General Source Layer") return "Uses broad official or institutional sources, but not specific local records.";
  if (level === "Local Source Layer") return "Uses local or jurisdiction-specific sources, but not enough to prove outcomes.";
  if (level === "Specific Local Record") return "Uses a specific local record such as a filing, application, table, permit, or docket.";
  if (level === "Project-Level Evidence") return "Uses evidence tied to a specific project, facility, or deployment.";
  return "Local evidence level not classified.";
}

export function getRecordCardClass(status: string): string {
  return `record-card record-card--${status.toLowerCase().replace(/\s+/g, "-")}`;
}
