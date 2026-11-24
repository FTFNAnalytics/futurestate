import {createHash} from 'node:crypto';

const dayMs = 86400000;
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };

// Date-only inputs are calendar dates, not instants in the reader's local zone.
export function calendarDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const time = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0,10) === value ? time : null;
}

export function assertSourceMonitoringPolicy(policy, sources) {
  requireThat(policy?.schema_version === '1.0', 'Unsupported source-monitoring policy');
  requireThat(nonempty(policy.policy_id) && nonempty(policy.reviewer) && nonempty(policy.authority), 'Policy identity and authority required');
  requireThat(calendarDay(policy.effective_date) !== null, 'Invalid policy effective date');
  requireThat(nonempty(policy.review_responsibility) && nonempty(policy.source_owner_meaning) && nonempty(policy.boundary), 'Policy scope required');
  for (const field of ['network_retrieval_performed','changes_evidence_dates','changes_gate_appointments','creates_automation','publication_authorized']) {
    requireThat(policy[field] === false, `Monitoring policy cannot claim ${field}`);
  }
  requireThat(Array.isArray(sources) && sources.every(source => nonempty(source?.id)), 'Source identities required');
  const byId = new Map(sources.map(source => [source.id, source]));
  requireThat(byId.size === sources.length, 'Duplicate source identity');
  requireThat(Array.isArray(policy.records) && policy.records.length > 0, 'Policy records required');
  const seen = new Set();
  const fields = ['input_sha256','rationale','review_cadence_days','source_id','source_owner'].sort();
  for (const record of policy.records) {
    requireThat(record && Object.keys(record).sort().join('|') === fields.join('|'), 'Unexpected monitoring policy fields');
    requireThat(nonempty(record.source_id) && !seen.has(record.source_id), 'Duplicate or missing policy source');
    seen.add(record.source_id);
    const source = byId.get(record.source_id);
    requireThat(source && hash(source) === record.input_sha256, `Stale or unknown monitoring input: ${record.source_id}`);
    requireThat(source.review_cadence_days == null && !nonempty(source.source_owner), `Policy may only fill missing metadata: ${record.source_id}`);
    requireThat(Number.isSafeInteger(record.review_cadence_days) && record.review_cadence_days > 0 && record.review_cadence_days <= 3650, 'Invalid editorial review cadence');
    requireThat(nonempty(record.source_owner) && nonempty(record.rationale), 'Publisher label and cadence rationale required');
  }
  return policy;
}

function metadataState(source, asOf, cadence, owner) {
  const checked = calendarDay(source.last_checked_date);
  const reasons = [];
  if (checked === null) reasons.push('Invalid inspection date');
  else if (checked > asOf) reasons.push('Inspection date is in the future');
  if (!Number.isSafeInteger(cadence) || cadence <= 0 || cadence > 3650) reasons.push('Invalid review cadence');
  if (!nonempty(owner)) reasons.push('Missing publisher label');
  const elapsed = checked === null ? null : (asOf - checked) / dayMs;
  const due = checked !== null && Number.isSafeInteger(cadence) && cadence > 0 && cadence <= 3650
    ? new Date(checked + cadence * dayMs).toISOString().slice(0,10) : null;
  return {
    elapsed_days: elapsed,
    metadata_due_date: due,
    status: reasons.length ? 'Missing valid currency metadata' : elapsed > cadence ? 'Cadence overdue' : 'Within declared cadence',
    reasons,
  };
}

const countsFor = records => ({
  sources: records.length,
  overdue: records.filter(record => record.status === 'Cadence overdue').length,
  missing_metadata: records.filter(record => record.status === 'Missing valid currency metadata').length,
  within_declared_cadence: records.filter(record => record.status === 'Within declared cadence').length,
});

export function sourceCurrencyReport(sources, policy, asOfDate) {
  const asOf = calendarDay(asOfDate);
  requireThat(asOf !== null, 'Invalid report calendar date');
  assertSourceMonitoringPolicy(policy, sources);
  const active = asOf >= calendarDay(policy.effective_date);
  const overrides = new Map(active ? policy.records.map(record => [record.source_id, record]) : []);
  const all = [...sources].sort((a,b) => a.id.localeCompare(b.id)).map(source => {
    const override = overrides.get(source.id);
    const cadence = override?.review_cadence_days ?? source.review_cadence_days ?? null;
    const owner = override?.source_owner ?? source.source_owner ?? null;
    const baseline = metadataState(source, asOf, source.review_cadence_days, source.source_owner);
    return {
      id: source.id,
      last_checked_date: source.last_checked_date ?? null,
      review_cadence_days: cadence,
      owner,
      metadata_origin: override ? policy.policy_id : 'Retained source profile',
      policy_effective_date: override ? policy.effective_date : null,
      baseline: {review_cadence_days: source.review_cadence_days ?? null, owner: source.source_owner ?? null, ...baseline},
      ...metadataState(source, asOf, cadence, owner),
    };
  });
  return {
    as_of_date: asOfDate,
    scope: 'Source-profile metadata only; not a live endpoint test or exact-claim currency audit. Later scoped receipts are not rolled into profile inspection dates. Reconcile those receipts and independent appointments before selecting live work.',
    due_date_meaning: 'Inspection date plus editorial cadence, not a scheduled evidence gate or agency publication date. The boundary day is within cadence; overdue begins the next calendar day.',
    policy_id: policy.policy_id,
    policy_effective_date: policy.effective_date,
    policy_active: active,
    network_retrieval_performed: false,
    changes_evidence_dates: false,
    changes_gate_appointments: false,
    raw_counts: countsFor(all.map(record => record.baseline)),
    counts: countsFor(all),
    policy_resolutions: all.filter(record => record.metadata_origin === policy.policy_id),
    records: all.filter(record => record.status !== 'Within declared cadence'),
  };
}

