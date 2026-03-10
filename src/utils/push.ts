import type { NotificationSettings } from "../types/storage";

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeXdreXN0a2tpeHVqaHVhbnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Nzc3MjEsImV4cCI6MjA4ODU1MzcyMX0.irgwW8PidC8VQdntRuG_mNDFb0iDIO8_c0iFl-kCyV4";
export const PUSH_CONFIG_FUNCTION = `${SUPABASE_URL}/functions/v1/push-config`;

const SUPABASE_CLIENT_KEY = SUPABASE_PUBLISHABLE_KEY ?? SUPABASE_ANON_KEY;

type RegisterDevicePayload = {
  action: "register-device";
  deviceId: string;
  subscription: PushSubscriptionJSON;
  permission: NotificationPermission;
  locale: string;
  userAgent: string;
  keywordFilters: string[];
};

type SetSourcePreferencePayload = {
  action: "set-source-preference";
  deviceId: string;
  sourceUrl: string;
  sourceName: string | null;
  enabled: boolean;
};

type DisableDevicePayload = {
  action: "disable-device";
  deviceId: string;
  permission: NotificationPermission | "default";
};

type SetDeviceKeywordFiltersPayload = {
  action: "set-device-keyword-filters";
  deviceId: string;
  keywordFilters: string[];
};

type PushConfigResponse = {
  publicVapidKey: string;
  deviceId: string;
  permission: NotificationSettings["permission"];
  subscribedSourceUrls: string[];
  keywordFilters: string[];
};

const hasSupabasePushConfig = () => {
  return Boolean(SUPABASE_URL && SUPABASE_CLIENT_KEY && SUPABASE_ANON_KEY);
};

const getBaseHeaders = (): HeadersInit => {
  if (!hasSupabasePushConfig()) {
    throw new Error("Supabase push configuration is missing.");
  }

  return {
    apikey: SUPABASE_CLIENT_KEY!,
    Authorization: `Bearer ${SUPABASE_ANON_KEY!}`,
  };
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const payload = await response.json();
      if (payload?.error && typeof payload.error === "string") {
        message = payload.error;
      }
    } catch {
      // Ignore JSON parsing issues and use the default message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

export const isPushSupported = () => {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    hasSupabasePushConfig()
  );
};

export const getCurrentPushPermission = (): NotificationSettings["permission"] => {
  if (!isPushSupported()) {
    return "unsupported";
  }

  return Notification.permission;
};

export const ensureDeviceId = (existingDeviceId: string | null) => {
  if (existingDeviceId) {
    return existingDeviceId;
  }

  return crypto.randomUUID();
};

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);

  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
};

export const fetchPushConfig = async (deviceId: string): Promise<PushConfigResponse> => {
  const response = await fetch(`${PUSH_CONFIG_FUNCTION}?deviceId=${encodeURIComponent(deviceId)}`, {
    method: "GET",
    headers: getBaseHeaders(),
  });

  return parseResponse<PushConfigResponse>(response);
};

export const registerPushDevice = async (payload: Omit<RegisterDevicePayload, "action">) => {
  const response = await fetch(PUSH_CONFIG_FUNCTION, {
    method: "POST",
    headers: {
      ...getBaseHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "register-device",
      ...payload,
    } satisfies RegisterDevicePayload),
  });

  return parseResponse<{ ok: boolean }>(response);
};

export const setSourcePushPreference = async (payload: Omit<SetSourcePreferencePayload, "action">) => {
  const response = await fetch(PUSH_CONFIG_FUNCTION, {
    method: "POST",
    headers: {
      ...getBaseHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "set-source-preference",
      ...payload,
    } satisfies SetSourcePreferencePayload),
  });

  return parseResponse<{ subscribedSourceUrls: string[] }>(response);
};

export const setDeviceKeywordFilters = async (payload: Omit<SetDeviceKeywordFiltersPayload, "action">) => {
  const response = await fetch(PUSH_CONFIG_FUNCTION, {
    method: "POST",
    headers: {
      ...getBaseHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "set-device-keyword-filters",
      ...payload,
    } satisfies SetDeviceKeywordFiltersPayload),
  });

  return parseResponse<{ keywordFilters: string[] }>(response);
};

export const disablePushDevice = async (payload: Omit<DisableDevicePayload, "action">) => {
  const response = await fetch(PUSH_CONFIG_FUNCTION, {
    method: "POST",
    headers: {
      ...getBaseHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "disable-device",
      ...payload,
    } satisfies DisableDevicePayload),
  });

  return parseResponse<{ ok: boolean }>(response);
};

export const subscribeBrowserToPush = async (publicVapidKey: string) => {
  const registration = await navigator.serviceWorker.ready;
  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    return existingSubscription.toJSON();
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  return subscription.toJSON();
};

export const unsubscribeBrowserFromPush = async () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await subscription.unsubscribe();
  }
};
