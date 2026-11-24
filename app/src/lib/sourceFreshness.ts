import type { MetaTone } from "./editorial";

export type SourceFreshnessStatus = "Current" | "Watch soon" | "Review due";
export type SourceHealthStatus = "Probe ready" | "Manual review" | "Needs endpoint" | "Paused" | "Blocked";

export interface SourceFreshnessResult {
  ageDays: number | null;
  reviewAfterDays: number;
  status: SourceFreshnessStatus;
  tone: MetaTone;
  note: string;
}

export interface SourceHealthInput {
  url: string;
  live_access_type?: string;
  api_url?: string;
  feed_url?: string;
  data_download_url?: string;
  docket_search_url?: string;
  release_calendar_url?: string;
  monitoring_status?: string;
}

export interface SourceHealthResult {
  status: SourceHealthStatus;
  tone: MetaTone;
  note: string;
  endpointCount: number;
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function sourceReviewCalendarDate(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}

// One calculation date per build process, separate from any evidence review date.
export const sourceReviewAsOfDate = sourceReviewCalendarDate();

function calendarDay(value: Date | string): number | null {
  if (value instanceof Date) {
    if (!Number.isFinite(value.valueOf())) return null;
    value = value.toISOString().slice(0,10);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0,10) === value ? time : null;
}

const validCadence = (value: number | undefined): value is number =>
  Number.isSafeInteger(value) && Number(value) > 0 && Number(value) <= 3650;

export function getSourceReviewWindowDays(
  updateFrequency: string,
  capturePriority: string,
  reviewCadenceDays?: number
): number {
  if (validCadence(reviewCadenceDays)) {
    return reviewCadenceDays;
  }

  const normalized = updateFrequency.toLowerCase();
  let reviewAfterDays = 90;

  if (normalized.includes("daily")) {
    reviewAfterDays = 10;
  } else if (normalized.includes("weekly")) {
    reviewAfterDays = 21;
  } else if (normalized.includes("monthly")) {
    reviewAfterDays = 45;
  } else if (normalized.includes("ongoing")) {
    reviewAfterDays = 30;
  } else if (normalized.includes("irregular")) {
    reviewAfterDays = 120;
  } else if (normalized.includes("regular")) {
    reviewAfterDays = 60;
  } else if (normalized.includes("annual")) {
    reviewAfterDays = 400;
  } else if (normalized.includes("varies")) {
    reviewAfterDays = 75;
  }

  if (capturePriority === "High" && reviewAfterDays > 90 && !normalized.includes("annual")) {
    return 90;
  }

  if (capturePriority === "Low" && reviewAfterDays < 60) {
    return 60;
  }

  return reviewAfterDays;
}

export function getSourceFreshness(
  lastCheckedDate: Date | string,
  updateFrequency: string,
  capturePriority: string,
  generatedAt: Date | string = sourceReviewAsOfDate,
  reviewCadenceDays?: number
): SourceFreshnessResult {
  const reviewAfterDays = getSourceReviewWindowDays(updateFrequency, capturePriority, reviewCadenceDays);
  const checkedDay = calendarDay(lastCheckedDate);
  const generatedDay = calendarDay(generatedAt);
  if (generatedDay === null) throw new Error('Source review requires a valid calculation date');
  if (checkedDay === null || checkedDay > generatedDay || (reviewCadenceDays !== undefined && !validCadence(reviewCadenceDays))) {
    return {
      ageDays: null,
      reviewAfterDays,
      status: 'Review due',
      tone: 'urgency',
      note: checkedDay === null ? 'Invalid recorded inspection date; resolve the metadata before reuse.'
        : checkedDay > generatedDay ? 'Recorded inspection date is later than the calculation date; no current-source status is inferred.'
          : 'Invalid declared review cadence; resolve the metadata before reuse.'
    };
  }
  const ageDays = (generatedDay - checkedDay) / millisecondsPerDay;

  if (ageDays > reviewAfterDays) {
    return {
      ageDays,
      reviewAfterDays,
      status: "Review due",
      tone: "urgency",
      note: "Reconcile later scoped receipts and appointments before deciding whether a new source check is due."
    };
  }

  if (ageDays >= Math.floor(reviewAfterDays * 0.75)) {
    return {
      ageDays,
      reviewAfterDays,
      status: "Watch soon",
      tone: "review",
      note: "Reconcile scoped receipts when planning the next manual review pass."
    };
  }

  return {
    ageDays,
    reviewAfterDays,
    status: "Current",
    tone: "possibility",
      note: "Within the recorded metadata window; not a new source check or approval of related claims."
  };
}

export function getFreshnessRank(status: SourceFreshnessStatus): number {
  if (status === "Review due") return 0;
  if (status === "Watch soon") return 1;
  return 2;
}

export function getSourceHealth(source: SourceHealthInput): SourceHealthResult {
  const monitoringStatus = source.monitoring_status ?? "Active";
  const liveAccessType = source.live_access_type ?? "Manual Page Check";
  const endpointCount = [
    source.api_url,
    source.feed_url,
    source.data_download_url,
    source.docket_search_url,
    source.release_calendar_url
  ].filter(Boolean).length;

  if (monitoringStatus === "Blocked") {
    return {
      status: "Blocked",
      tone: "urgency",
      endpointCount,
      note: "Do not rely on this source until the access blocker is resolved."
    };
  }

  if (monitoringStatus === "Paused") {
    return {
      status: "Paused",
      tone: "draft",
      endpointCount,
      note: "This source is retained, but not active in the current monitoring pass."
    };
  }

  const hasExpectedEndpoint =
    (liveAccessType === "API" && Boolean(source.api_url)) ||
    (liveAccessType === "RSS Feed" && Boolean(source.feed_url)) ||
    (liveAccessType === "Data Download" && Boolean(source.data_download_url)) ||
    (liveAccessType === "Docket Search" && Boolean(source.docket_search_url)) ||
    (liveAccessType === "Filing System" && Boolean(source.api_url || source.docket_search_url));

  if (hasExpectedEndpoint) {
    return {
      status: "Probe ready",
      tone: "possibility",
      endpointCount,
      note: "Machine-readable or queryable endpoint metadata is present for later automated checks."
    };
  }

  if (["API", "RSS Feed", "Data Download", "Docket Search", "Filing System"].includes(liveAccessType)) {
    return {
      status: "Needs endpoint",
      tone: "urgency",
      endpointCount,
      note: "The source is classified as live-access capable, but its specific endpoint field is missing."
    };
  }

  return {
    status: "Manual review",
    tone: "review",
    endpointCount,
    note: "This source remains authoritative, but must be checked manually or by a custom scraper later."
  };
}
