import { PostHog } from "posthog-node";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

let posthogClient: PostHog | null = null;

function isServerPostHogEnabled() {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.POSTHOG_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true"
  );
}

function getPostHogClient() {
  const apiKey = process.env.POSTHOG_API_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!apiKey || !isServerPostHogEnabled()) {
    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(apiKey, {
      host:
        process.env.POSTHOG_HOST ??
        process.env.NEXT_PUBLIC_POSTHOG_HOST ??
        "https://us.i.posthog.com",
    });
  }

  return posthogClient;
}

export function captureServerEvent(
  event: string,
  distinctId: string,
  properties?: AnalyticsProperties,
) {
  const client = getPostHogClient();

  if (!client) {
    return;
  }

  client.capture({
    distinctId,
    event,
    properties,
  });
}
