import type { MetaTone } from "./editorial";

export type SourceFreshnessStatus = "Current" | "Watch soon" | "Review due";
export type SourceHealthStatus = "Probe ready" | "Manual review" | "Needs endpoint" | "Paused" | "Blocked";

export interface SourceFreshnessResult {
  ageDays: number;
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

export function getSourceReviewWindowDays(
  updateFrequency: string,
  capturePriority: string,
  reviewCadenceDays?: number
): number {
  if (reviewCadenceDays) {
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
  } else if (normalized.includes("regular")) {
    reviewAfterDays = 60;
  } else if (normalized.includes("annual")) {
    reviewAfterDays = 400;
  } else if (normalized.includes("varies")) {
    reviewAfterDays = 75;
  } else if (normalized.includes("irregular")) {
    reviewAfterDays = 120;
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
  lastCheckedDate: Date,
  updateFrequency: string,
  capturePriority: string,
  generatedAt = new Date(),
  reviewCadenceDays?: number
): SourceFreshnessResult {
  const reviewAfterDays = getSourceReviewWindowDays(updateFrequency, capturePriority, reviewCadenceDays);
  const ageDays = Math.max(
    0,
    Math.floor((generatedAt.valueOf() - lastCheckedDate.valueOf()) / millisecondsPerDay)
  );

  if (ageDays > reviewAfterDays) {
    return {
      ageDays,
      reviewAfterDays,
      status: "Review due",
      tone: "urgency",
      note: "Review before using this source for new publication claims."
    };
  }

  if (ageDays >= Math.floor(reviewAfterDays * 0.75)) {
    return {
      ageDays,
      reviewAfterDays,
      status: "Watch soon",
      tone: "review",
      note: "Keep this source in the next manual review pass."
    };
  }

  return {
    ageDays,
    reviewAfterDays,
    status: "Current",
    tone: "possibility",
    note: "Fresh enough for the current manual review cadence."
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
