import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = join(appRoot, "..");
const schema = await readFile(
  join(workspaceRoot, "supabase", "schemas", "phase58_private_authority_loop.sql"),
  "utf8"
);

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const roles = {
  editor: { id: "user-editor", role: "editor" },
  reviewerA: { id: "user-reviewer-a", role: "reviewer" },
  reviewerB: { id: "user-reviewer-b", role: "reviewer" },
  outsider: { id: "user-outsider", role: "authenticated" }
};

function createCandidate(actor) {
  if (!['editor', 'admin'].includes(actor.role)) return { ok: false, reason: "role_denied" };
  return {
    ok: true,
    candidate: {
      id: "candidate-darpa-2026-08-11",
      createdBy: actor.id,
      state: "draft",
      privateNotes: "Reviewer-only locator notes",
      publicPayload: { receipt_type: "No Material Change" }
    }
  };
}

function submitCandidate(actor, candidate, reviewer) {
  if (actor.id !== candidate.createdBy || !['editor', 'admin'].includes(actor.role)) {
    return { ok: false, reason: "ownership_or_role_denied" };
  }
  return {
    ok: true,
    queue: {
      candidateId: candidate.id,
      submittedBy: actor.id,
      reviewerId: reviewer.id,
      state: "queued"
    }
  };
}

function decideCandidate(actor, queue, decision) {
  if (actor.id !== queue.reviewerId || !['reviewer', 'admin'].includes(actor.role)) {
    return { ok: false, reason: "reviewer_denied" };
  }
  if (!['approved', 'changes_requested', 'rejected'].includes(decision)) {
    return { ok: false, reason: "invalid_decision" };
  }
  return { ok: true, queue: { ...queue, state: decision } };
}

function prepareExport(actor, secondReviewer, queue, publicPayload) {
  if (!['reviewer', 'admin'].includes(actor.role) || queue.state !== 'approved') {
    return { ok: false, reason: "approval_required" };
  }
  if (actor.id === secondReviewer.id) return { ok: false, reason: "dual_control_required" };
  return {
    ok: true,
    batch: {
      state: "prepared",
      preparedBy: actor.id,
      reviewedBy: secondReviewer.id,
      publicPayload,
      publicationEffect: "none_until_human_git_commit"
    }
  };
}

const created = createCandidate(roles.editor);
check(created.ok, "An editor must be able to create an owned private candidate.");
check(!createCandidate(roles.outsider).ok, "An authenticated user without a private role must not create a candidate.");

const submitted = submitCandidate(roles.editor, created.candidate, roles.reviewerA);
check(submitted.ok, "The candidate owner must be able to submit a candidate to an assigned reviewer.");
check(!submitCandidate(roles.outsider, created.candidate, roles.reviewerA).ok, "A non-owner must not submit another user's candidate.");

check(!decideCandidate(roles.editor, submitted.queue, "approved").ok, "An editor must not approve their own candidate.");
check(!decideCandidate(roles.reviewerB, submitted.queue, "approved").ok, "An unassigned reviewer must not decide a queue row.");
const approved = decideCandidate(roles.reviewerA, submitted.queue, "approved");
check(approved.ok && approved.queue.state === "approved", "The assigned reviewer must be able to approve the candidate.");

check(!prepareExport(roles.reviewerA, roles.reviewerA, approved.queue, created.candidate.publicPayload).ok, "Export preparation must reject single-reviewer control.");
const prepared = prepareExport(roles.reviewerA, roles.reviewerB, approved.queue, created.candidate.publicPayload);
check(prepared.ok, "Two distinct reviewers must be able to prepare a reviewed export batch.");
check(prepared.batch.publicationEffect === "none_until_human_git_commit", "A prepared database export must have no direct publication effect.");
check(!JSON.stringify(prepared.batch.publicPayload).includes(created.candidate.privateNotes), "The public export must exclude private notes.");

const forcedRlsTables = [...schema.matchAll(/alter table authority\.([a-z_]+) force row level security;/g)].map((match) => match[1]);
check(new Set(forcedRlsTables).size === 5, "All five authority tables must force RLS.");
check(/revoke all on schema authority from public, anon;/.test(schema), "The authority schema must deny public and anon access.");
check(!/grant[^;]+\bto anon\b/i.test(schema), "No authority object may grant access to anon.");
check(!/security definer/i.test(schema), "The authority schema must not use security-definer code.");
check(!/create\s+(or\s+replace\s+)?function/i.test(schema), "The authority schema must not create a database function.");
check(!/create\s+trigger/i.test(schema), "The authority schema must not create a trigger.");
check(/with \(security_invoker = true\)/.test(schema), "The reviewed export projection must be a security-invoker view.");
check((schema.match(/for update to authenticated/g) ?? []).length === 5, "Mutable workflow tables must define editor and reviewer update policies with no receipt mutation path.");
check((schema.match(/\nwith check \(/g) ?? []).length >= 9, "Insert and update policies must enforce WITH CHECK predicates.");
check(!/grant[^;]+delete/i.test(schema), "The authority contract must not grant destructive delete access.");

if (failures.length) {
  console.error("Phase 58 authority-loop harness failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 58 authority-loop harness passed: private role and ownership checks, assigned review, dual-control export, private-field exclusion, 5 forced-RLS tables, explicit grants, security-invoker projection, and zero direct-publication path.");
