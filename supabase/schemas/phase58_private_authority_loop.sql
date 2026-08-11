-- Phase 58 declarative design. Not yet applied to a local or remote Supabase project.
-- The database prepares reviewed export candidates; it cannot publish static content.

create schema if not exists authority;

revoke all on schema authority from public, anon;
grant usage on schema authority to authenticated;

create table if not exists authority.source_candidates (
  id uuid primary key default gen_random_uuid(),
  external_key text not null unique,
  source_url text not null,
  source_title text not null,
  exact_artifact text not null,
  candidate_payload jsonb not null default '{}'::jsonb,
  private_notes text,
  state text not null default 'draft' check (state in ('draft', 'submitted', 'changes_requested', 'approved', 'rejected', 'exported')),
  created_by uuid not null references auth.users(id),
  assigned_reviewer uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists authority.review_queue (
  id uuid primary key default gen_random_uuid(),
  source_candidate_id uuid not null unique references authority.source_candidates(id),
  review_state text not null default 'queued' check (review_state in ('queued', 'in_review', 'changes_requested', 'approved', 'rejected', 'exported')),
  reviewer_id uuid references auth.users(id),
  submitted_by uuid not null references auth.users(id),
  submitted_at timestamptz not null default now(),
  decided_at timestamptz,
  private_decision_note text
);

create table if not exists authority.update_candidates (
  id uuid primary key default gen_random_uuid(),
  source_candidate_id uuid not null references authority.source_candidates(id),
  receipt_type text not null check (receipt_type in ('Change Note', 'Watch Note', 'Correction', 'No Material Change')),
  public_title text not null,
  public_summary text not null,
  public_payload jsonb not null,
  prior_state text not null,
  current_state text not null,
  evidence_boundary text not null,
  publication_effect text not null,
  next_check_date date,
  created_by uuid not null references auth.users(id),
  state text not null default 'draft' check (state in ('draft', 'submitted', 'approved', 'rejected', 'exported')),
  created_at timestamptz not null default now()
);

create table if not exists authority.review_receipts (
  id uuid primary key default gen_random_uuid(),
  review_queue_id uuid not null references authority.review_queue(id),
  update_candidate_id uuid references authority.update_candidates(id),
  decision text not null check (decision in ('approved', 'changes_requested', 'rejected', 'export_authorized')),
  public_decision_summary text not null,
  private_decision_note text,
  decided_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists authority.export_batches (
  id uuid primary key default gen_random_uuid(),
  export_key text not null unique,
  update_candidate_ids uuid[] not null,
  public_payload jsonb not null,
  state text not null default 'prepared' check (state in ('prepared', 'validated', 'committed', 'withdrawn')),
  prepared_by uuid not null references auth.users(id),
  reviewed_by uuid not null references auth.users(id),
  git_commit text,
  created_at timestamptz not null default now(),
  committed_at timestamptz,
  check (prepared_by <> reviewed_by)
);

create index if not exists source_candidates_created_by_idx on authority.source_candidates(created_by);
create index if not exists source_candidates_assigned_reviewer_idx on authority.source_candidates(assigned_reviewer);
create index if not exists review_queue_reviewer_id_idx on authority.review_queue(reviewer_id);
create index if not exists update_candidates_created_by_idx on authority.update_candidates(created_by);
create index if not exists review_receipts_decided_by_idx on authority.review_receipts(decided_by);

alter table authority.source_candidates enable row level security;
alter table authority.source_candidates force row level security;
alter table authority.review_queue enable row level security;
alter table authority.review_queue force row level security;
alter table authority.update_candidates enable row level security;
alter table authority.update_candidates force row level security;
alter table authority.review_receipts enable row level security;
alter table authority.review_receipts force row level security;
alter table authority.export_batches enable row level security;
alter table authority.export_batches force row level security;

revoke all on all tables in schema authority from public, anon, authenticated;
grant select, insert, update on authority.source_candidates to authenticated;
grant select, insert, update on authority.review_queue to authenticated;
grant select, insert, update on authority.update_candidates to authenticated;
grant select, insert on authority.review_receipts to authenticated;
grant select, insert, update on authority.export_batches to authenticated;

create policy "private roles can read source candidates"
on authority.source_candidates for select to authenticated
using (
  (select auth.uid()) is not null
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'reviewer', 'admin')
);

create policy "editors can create owned source candidates"
on authority.source_candidates for insert to authenticated
with check (
  (select auth.uid()) = created_by
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'admin')
  and state = 'draft'
);

create policy "editors can revise owned source candidates"
on authority.source_candidates for update to authenticated
using (
  (select auth.uid()) = created_by
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'admin')
  and state in ('draft', 'changes_requested')
)
with check (
  (select auth.uid()) = created_by
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'admin')
  and state in ('draft', 'submitted', 'changes_requested')
);

create policy "private roles can read review queue"
on authority.review_queue for select to authenticated
using (
  (select auth.uid()) is not null
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'reviewer', 'admin')
);

create policy "editors can submit review queue rows"
on authority.review_queue for insert to authenticated
with check (
  (select auth.uid()) = submitted_by
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'admin')
  and review_state = 'queued'
);

create policy "reviewers can decide assigned queue rows"
on authority.review_queue for update to authenticated
using (
  (reviewer_id = (select auth.uid()) or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') = 'admin')
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('reviewer', 'admin')
)
with check (
  (reviewer_id = (select auth.uid()) or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') = 'admin')
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('reviewer', 'admin')
  and review_state in ('in_review', 'changes_requested', 'approved', 'rejected', 'exported')
);

create policy "private roles can read update candidates"
on authority.update_candidates for select to authenticated
using (
  (select auth.uid()) is not null
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'reviewer', 'admin')
);

create policy "editors can create owned update candidates"
on authority.update_candidates for insert to authenticated
with check (
  (select auth.uid()) = created_by
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'admin')
  and state = 'draft'
);

create policy "editors can revise owned update candidates"
on authority.update_candidates for update to authenticated
using (
  (select auth.uid()) = created_by
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'admin')
  and state = 'draft'
)
with check (
  (select auth.uid()) = created_by
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'admin')
  and state in ('draft', 'submitted')
);

create policy "assigned reviewers can decide submitted update candidates"
on authority.update_candidates for update to authenticated
using (
  state = 'submitted'
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('reviewer', 'admin')
  and exists (
    select 1
    from authority.review_queue q
    where q.source_candidate_id = update_candidates.source_candidate_id
      and (q.reviewer_id = (select auth.uid()) or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') = 'admin')
  )
)
with check (
  coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('reviewer', 'admin')
  and state in ('approved', 'rejected')
);

create policy "private roles can read review receipts"
on authority.review_receipts for select to authenticated
using (
  (select auth.uid()) is not null
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'reviewer', 'admin')
);

create policy "reviewers can append review receipts"
on authority.review_receipts for insert to authenticated
with check (
  (select auth.uid()) = decided_by
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('reviewer', 'admin')
);

create policy "private roles can read export batches"
on authority.export_batches for select to authenticated
using (
  (select auth.uid()) is not null
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('editor', 'reviewer', 'admin')
);

create policy "reviewers can prepare dual-control export batches"
on authority.export_batches for insert to authenticated
with check (
  (select auth.uid()) = prepared_by
  and prepared_by <> reviewed_by
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('reviewer', 'admin')
  and state = 'prepared'
);

create policy "reviewers can advance export batches"
on authority.export_batches for update to authenticated
using (
  ((select auth.uid()) = prepared_by or (select auth.uid()) = reviewed_by)
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('reviewer', 'admin')
  and state in ('prepared', 'validated')
)
with check (
  prepared_by <> reviewed_by
  and coalesce((select auth.jwt()) -> 'app_metadata' ->> 'ftfn_role', '') in ('reviewer', 'admin')
  and state in ('prepared', 'validated', 'committed', 'withdrawn')
);

create or replace view authority.reviewed_export_projection
with (security_invoker = true)
as
select
  u.id as update_candidate_id,
  u.receipt_type,
  u.public_title,
  u.public_summary,
  u.public_payload,
  u.prior_state,
  u.current_state,
  u.evidence_boundary,
  u.publication_effect,
  u.next_check_date,
  q.review_state,
  q.decided_at
from authority.update_candidates u
join authority.review_queue q on q.source_candidate_id = u.source_candidate_id
where u.state = 'approved' and q.review_state = 'approved';

revoke all on authority.reviewed_export_projection from public, anon;
grant select on authority.reviewed_export_projection to authenticated;
