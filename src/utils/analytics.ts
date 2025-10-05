export type TrackEventPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

const sanitizePayload = (payload?: TrackEventPayload) => {
  if (!payload) return undefined;

  return Object.entries(payload).reduce<Record<string, string | number | boolean | null>>((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export const trackEvent = (event: string, payload?: TrackEventPayload) => {
  if (typeof window === "undefined") {
    return;
  }

  const sanitized = sanitizePayload(payload);

  if (typeof window.plausible === "function") {
    window.plausible(event, sanitized ? { props: sanitized } : undefined);
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", event, sanitized ?? {});
  }
};
