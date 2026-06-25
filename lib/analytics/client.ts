"use client";

import posthog from "posthog-js";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

export function isPostHogEnabled() {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true"
  );
}

export function canCapturePostHog() {
  return isPostHogEnabled() && Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
}

export function captureEvent(event: string, properties?: AnalyticsProperties) {
  if (!canCapturePostHog()) {
    return;
  }

  posthog.capture(event, properties);
}

export function identifyUser(
  distinctId: string,
  properties?: AnalyticsProperties,
) {
  if (!canCapturePostHog()) {
    return;
  }

  posthog.identify(distinctId, properties);
}

export { posthog };
