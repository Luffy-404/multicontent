export type ProductAnalyticsCard = {
  label: string;
  value: string | null;
};

const PRODUCT_ANALYTICS_LABELS = [
  "Active Users",
  "Daily Visitors",
  "Returning Visitors",
  "Bounce Rate",
  "Session Duration",
] as const;

export function isPostHogConnected() {
  return Boolean(process.env.POSTHOG_API_KEY);
}

export function getPostHogDashboardUrl() {
  return process.env.POSTHOG_DASHBOARD_URL || "https://app.posthog.com";
}

export function getProductAnalyticsCards(): ProductAnalyticsCard[] {
  return PRODUCT_ANALYTICS_LABELS.map((label) => ({ label, value: null }));
}
