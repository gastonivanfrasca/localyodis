export type TrackEventProperties = Record<string, string | number | boolean | null | undefined>;

type PlausibleOptions = {
  props?: Record<string, string | number | boolean>;
};

type PlausibleFn = (event: string, options?: PlausibleOptions) => void;

const sanitizeProperties = (properties?: TrackEventProperties) => {
  if (!properties) return undefined;

  const sanitizedEntries = Object.entries(properties).filter(([, value]) => value !== undefined && value !== null);

  if (sanitizedEntries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(sanitizedEntries) as Record<string, string | number | boolean>;
};

const sendWithPlausible = (event: string, properties?: TrackEventProperties) => {
  if (typeof window === "undefined") return false;
  const plausible = window.plausible as PlausibleFn | undefined;
  if (typeof plausible !== "function") return false;

  const sanitized = sanitizeProperties(properties);

  if (sanitized) {
    plausible(event, { props: sanitized });
  } else {
    plausible(event);
  }

  return true;
};

export const trackEvent = (event: string, properties?: TrackEventProperties) => {
  if (!event) return;

  const sent = sendWithPlausible(event, properties);

  if (!sent && import.meta.env.DEV) {
    const sanitized = sanitizeProperties(properties);
    if (sanitized) {
      console.debug(`[analytics] ${event}`, sanitized);
    } else {
      console.debug(`[analytics] ${event}`);
    }
  }
};
