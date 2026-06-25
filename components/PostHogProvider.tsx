"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { PostHogProvider as Provider } from "posthog-js/react";
import { Suspense, useEffect } from "react";
import { canCapturePostHog, captureEvent, posthog } from "@/lib/analytics/client";

type PostHogProviderProps = {
  children: React.ReactNode;
};

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const search = searchParams.toString();
    const url = `${window.location.origin}${pathname}${search ? `?${search}` : ""}`;

    captureEvent("$pageview", {
      $current_url: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  useEffect(() => {
    if (!apiKey || !canCapturePostHog() || posthog.__loaded) {
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
  }, [apiHost, apiKey]);

  return (
    <Provider client={posthog}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </Provider>
  );
}
