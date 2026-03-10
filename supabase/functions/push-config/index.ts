import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2";

import { corsHeaders } from "../_shared/cors.ts";

type DeviceRegistrationBody = {
  action: "register-device";
  deviceId: string;
  subscription: PushSubscriptionJSON;
  permission: NotificationPermission;
  locale?: string;
  userAgent?: string;
  keywordFilters?: string[];
};

type SourcePreferenceBody = {
  action: "set-source-preference";
  deviceId: string;
  sourceUrl: string;
  sourceName: string | null;
  enabled: boolean;
};

type DisableDeviceBody = {
  action: "disable-device";
  deviceId: string;
  permission?: NotificationPermission | "default";
};

type SetDeviceKeywordFiltersBody = {
  action: "set-device-keyword-filters";
  deviceId: string;
  keywordFilters: string[];
};

type RequestBody = DeviceRegistrationBody | SourcePreferenceBody | DisableDeviceBody | SetDeviceKeywordFiltersBody;

const jsonResponse = (body: unknown, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const getAppSecret = async (secretName: string) => {
  const { data, error } = await supabase.rpc("get_app_secret", {
    secret_name: secretName,
  });

  if (error) {
    throw error;
  }

  return data as string;
};

const getSubscribedSourceUrls = async (deviceId: string) => {
  const { data, error } = await supabase
    .from("push_source_preferences")
    .select("source_url")
    .eq("device_id", deviceId)
    .eq("enabled", true);

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => item.source_url as string);
};

const sanitizeKeywordFilters = (values: unknown) => {
  if (!Array.isArray(values)) {
    return [];
  }

  const seen = new Set<string>();

  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().replace(/\s+/g, " "))
    .filter((value) => value.length > 0 && value.length <= 80)
    .filter((value) => {
      const key = value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .slice(0, 20);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const deviceId = url.searchParams.get("deviceId");

      if (!deviceId) {
        return jsonResponse({ error: "deviceId is required." }, 400);
      }

      const [publicVapidKey, deviceResult, subscribedSourceUrls] = await Promise.all([
        getAppSecret("push_vapid_public_key"),
        supabase
          .from("push_devices")
          .select("device_id, permission, keyword_filters")
          .eq("device_id", deviceId)
          .maybeSingle(),
        getSubscribedSourceUrls(deviceId),
      ]);

      if (deviceResult.error) {
        throw deviceResult.error;
      }

      return jsonResponse({
        publicVapidKey,
        deviceId,
        permission: deviceResult.data?.permission ?? "default",
        subscribedSourceUrls,
        keywordFilters: sanitizeKeywordFilters(deviceResult.data?.keyword_filters),
      });
    }

    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed." }, 405);
    }

    const body = await req.json() as RequestBody;

    if (body.action === "register-device") {
      if (!body.deviceId || !body.subscription?.endpoint) {
        return jsonResponse({ error: "deviceId and subscription endpoint are required." }, 400);
      }

      const { error } = await supabase.from("push_devices").upsert({
        device_id: body.deviceId,
        endpoint: body.subscription.endpoint,
        subscription: body.subscription,
        permission: body.permission,
        locale: body.locale ?? null,
        user_agent: body.userAgent ?? null,
        keyword_filters: sanitizeKeywordFilters(body.keywordFilters),
        disabled_at: null,
      });

      if (error) {
        throw error;
      }

      return jsonResponse({ ok: true });
    }

    if (body.action === "set-source-preference") {
      if (!body.deviceId || !body.sourceUrl) {
        return jsonResponse({ error: "deviceId and sourceUrl are required." }, 400);
      }

      const { error } = await supabase.from("push_source_preferences").upsert({
        device_id: body.deviceId,
        source_url: body.sourceUrl,
        source_name: body.sourceName,
        enabled: body.enabled,
      });

      if (error) {
        throw error;
      }

      return jsonResponse({
        subscribedSourceUrls: await getSubscribedSourceUrls(body.deviceId),
      });
    }

    if (body.action === "set-device-keyword-filters") {
      if (!body.deviceId) {
        return jsonResponse({ error: "deviceId is required." }, 400);
      }

      const keywordFilters = sanitizeKeywordFilters(body.keywordFilters);
      const { error } = await supabase
        .from("push_devices")
        .update({
          keyword_filters: keywordFilters,
        })
        .eq("device_id", body.deviceId);

      if (error) {
        throw error;
      }

      return jsonResponse({ keywordFilters });
    }

    if (body.action === "disable-device") {
      if (!body.deviceId) {
        return jsonResponse({ error: "deviceId is required." }, 400);
      }

      const { error: deviceError } = await supabase
        .from("push_devices")
        .update({
          disabled_at: new Date().toISOString(),
          permission: body.permission ?? "default",
        })
        .eq("device_id", body.deviceId);

      if (deviceError) {
        throw deviceError;
      }

      const { error: sourceError } = await supabase
        .from("push_source_preferences")
        .update({ enabled: false })
        .eq("device_id", body.deviceId);

      if (sourceError) {
        throw sourceError;
      }

      return jsonResponse({ ok: true });
    }

    return jsonResponse({ error: "Unsupported action." }, 400);
  } catch (error) {
    console.error(error);
    return jsonResponse({
      error: error instanceof Error ? error.message : "Unexpected error.",
    }, 500);
  }
});
