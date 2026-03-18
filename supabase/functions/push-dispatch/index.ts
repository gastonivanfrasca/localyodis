import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";
import { matchesNotificationKeywordFilters, sanitizeNotificationSearchableText } from "../../../src/utils/notificationKeywordMatch.ts";

type FeedItem = {
  title?: string | string[] | { _?: string };
  id?: string | string[] | null;
  link?: string | string[] | Array<{ $?: { href?: string } }> | null;
  guid?: string[] | null;
  description?: string | null;
  pubDate?: string | null;
  source?: string | null;
  rssName?: string | null;
};

type FeedResponse = FeedItem[] | {
  feed?: FeedItem[];
  errors?: unknown[];
};

type PushDeviceRow = {
  device_id: string;
  endpoint: string;
  locale: string | null;
  subscription: PushSubscriptionJSON;
  keyword_filters: string[] | null;
};

type PushPreferenceRow = {
  device_id: string;
  source_url: string;
  source_name: string | null;
};

type PushSourceStateRow = {
  source_url: string;
  last_item_key: string | null;
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const jsonResponse = (body: unknown, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getAppSecret = async (secretName: string) => {
  const { data, error } = await supabase.rpc("get_app_secret", {
    secret_name: secretName,
  });

  if (error) {
    throw error;
  }

  return data as string;
};

const extractString = (value: unknown): string => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return extractString(value[0]);
  }

  if (typeof value === "object" && "_" in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>)._ ?? "");
  }

  return "";
};

const extractLink = (item: FeedItem): string => {
  const value = item.link;

  if (!value) {
    return extractString(item.id);
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    const first = value[0];
    if (typeof first === "string") {
      return first;
    }

    if (typeof first === "object" && first?.$?.href) {
      return first.$.href;
    }
  }

  return extractString(item.id);
};

const extractItemKey = (item: FeedItem): string => {
  return (
    extractString(item.guid) ||
    extractLink(item) ||
    extractString(item.id) ||
    `${extractString(item.title)}::${item.pubDate ?? ""}`
  );
};

const itemMatchesKeywords = (item: FeedItem, keywordFilters: string[] | null | undefined) => {
  const searchableText = sanitizeNotificationSearchableText([
    extractString(item.title),
    extractString(item.description),
  ].join(" "));

  return matchesNotificationKeywordFilters(searchableText, keywordFilters);
};

const getSaveActionLabel = (locale: string | null | undefined) => {
  const normalizedLocale = locale?.toLowerCase() ?? "";

  if (normalizedLocale.startsWith("es")) {
    return "Guardar";
  }

  if (normalizedLocale.startsWith("fr")) {
    return "Enregistrer";
  }

  return "Save";
};

const getRemoveActionLabel = (locale: string | null | undefined) => {
  const normalizedLocale = locale?.toLowerCase() ?? "";

  if (normalizedLocale.startsWith("es")) {
    return "Quitar";
  }

  if (normalizedLocale.startsWith("fr")) {
    return "Retirer";
  }

  return "Remove";
};

const sortNewestFirst = (items: FeedItem[]) => {
  return [...items].sort((left, right) => {
    const leftDate = new Date(left.pubDate ?? "").getTime();
    const rightDate = new Date(right.pubDate ?? "").getTime();

    return rightDate - leftDate;
  });
};

const groupItemsBySource = (items: FeedItem[]) => {
  const itemsBySource = new Map<string, FeedItem[]>();

  items.forEach((item) => {
    if (!item.source) {
      return;
    }

    const bucket = itemsBySource.get(item.source) ?? [];
    bucket.push(item);
    itemsBySource.set(item.source, bucket);
  });

  itemsBySource.forEach((bucket, sourceUrl) => {
    itemsBySource.set(sourceUrl, sortNewestFirst(bucket));
  });

  return itemsBySource;
};

const normalizeFeedResponse = (payload: FeedResponse): FeedItem[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.feed)) {
    return payload.feed;
  }

  return [];
};

const getNewItems = (items: FeedItem[], previousKey: string | null) => {
  if (!previousKey) {
    return [];
  }

  const previousStillPresent = items.some((item) => extractItemKey(item) === previousKey);

  if (!previousStillPresent) {
    return items.slice(0, 1);
  }

  const unseen: FeedItem[] = [];

  for (const item of items) {
    if (extractItemKey(item) === previousKey) {
      break;
    }

    unseen.push(item);
  }

  return unseen.slice(0, 3).reverse();
};

const markDeviceAsDisabled = async (deviceId: string) => {
  await supabase
    .from("push_devices")
    .update({ disabled_at: new Date().toISOString() })
    .eq("device_id", deviceId);
};

const getExistingDeliveries = async (sourceUrl: string, itemKey: string, deviceIds: string[]) => {
  const { data, error } = await supabase
    .from("push_deliveries")
    .select("device_id")
    .eq("source_url", sourceUrl)
    .eq("item_key", itemKey)
    .in("device_id", deviceIds);

  if (error) {
    throw error;
  }

  return new Set((data ?? []).map((row) => row.device_id as string));
};

Deno.serve(async () => {
  try {
    const [
      rssServerBaseUrl,
      vapidPublicKey,
      vapidPrivateKey,
      preferencesResult,
      devicesResult,
    ] = await Promise.all([
      getAppSecret("rss_server_base_url"),
      getAppSecret("push_vapid_public_key"),
      getAppSecret("push_vapid_private_key"),
      supabase
        .from("push_source_preferences")
        .select("device_id, source_url, source_name")
        .eq("enabled", true),
      supabase
        .from("push_devices")
        .select("device_id, endpoint, locale, subscription, keyword_filters")
        .eq("permission", "granted")
        .is("disabled_at", null),
    ]);

    if (preferencesResult.error) {
      throw preferencesResult.error;
    }

    if (devicesResult.error) {
      throw devicesResult.error;
    }

    const preferences = (preferencesResult.data ?? []) as PushPreferenceRow[];
    const devices = (devicesResult.data ?? []) as PushDeviceRow[];

    if (preferences.length === 0 || devices.length === 0) {
      return jsonResponse({ processedSources: 0, sentNotifications: 0, failedNotifications: 0 });
    }

    const activeDeviceIds = new Set(devices.map((device) => device.device_id));
    const filteredPreferences = preferences.filter((preference) => activeDeviceIds.has(preference.device_id));
    const sourceUrls = [...new Set(filteredPreferences.map((preference) => preference.source_url))];

    if (sourceUrls.length === 0) {
      return jsonResponse({ processedSources: 0, sentNotifications: 0, failedNotifications: 0 });
    }

    webpush.setVapidDetails(
      "mailto:push@localyodis.local",
      vapidPublicKey,
      vapidPrivateKey,
    );

    const rssResponse = await fetch(`${rssServerBaseUrl}/rss/fetch-feeds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: sourceUrls.map((sourceUrl) => ({
          id: sourceUrl,
          url: sourceUrl,
        })),
      }),
    });

    if (!rssResponse.ok) {
      throw new Error(`RSS backend returned ${rssResponse.status}`);
    }

    const feedPayload = await rssResponse.json() as FeedResponse;
    const feedItems = normalizeFeedResponse(feedPayload);
    const itemsBySource = groupItemsBySource(feedItems);
    const { data: sourceStates, error: sourceStatesError } = await supabase
      .from("push_source_state")
      .select("source_url, last_item_key")
      .in("source_url", sourceUrls);

    if (sourceStatesError) {
      throw sourceStatesError;
    }

    const sourceStateMap = new Map<string, PushSourceStateRow>(
      ((sourceStates ?? []) as PushSourceStateRow[]).map((row) => [row.source_url, row]),
    );
    const deviceMap = new Map(devices.map((device) => [device.device_id, device]));

    let sentNotifications = 0;
    let failedNotifications = 0;

    for (const sourceUrl of sourceUrls) {
      const sourceItems = itemsBySource.get(sourceUrl) ?? [];

      if (sourceItems.length === 0) {
        continue;
      }

      const latestItem = sourceItems[0];
      const latestItemKey = extractItemKey(latestItem);
      const previousState = sourceStateMap.get(sourceUrl);

      if (!latestItemKey) {
        continue;
      }

      const newItems = getNewItems(sourceItems, previousState?.last_item_key ?? null);
      const subscribers = filteredPreferences.filter((preference) => preference.source_url === sourceUrl);

      for (const item of newItems) {
        const itemKey = extractItemKey(item);
        const existingDeliveries = await getExistingDeliveries(
          sourceUrl,
          itemKey,
          subscribers.map((subscriber) => subscriber.device_id),
        );

        for (const subscriber of subscribers) {
          if (existingDeliveries.has(subscriber.device_id)) {
            continue;
          }

          const device = deviceMap.get(subscriber.device_id);

          if (!device) {
            continue;
          }

          if (!itemMatchesKeywords(item, device.keyword_filters)) {
            continue;
          }

          const title = extractString(item.title) || subscriber.source_name || "New article";
          const payload = {
            title: subscriber.source_name || extractString(item.rssName) || "LocalYodis",
            body: title,
            url: extractLink(item),
            articleTitle: title,
            pubDate: item.pubDate ?? null,
            sourceName: subscriber.source_name || extractString(item.rssName) || null,
            sourceUrl,
            itemKey,
            saveActionLabel: getSaveActionLabel(device.locale),
            removeActionLabel: getRemoveActionLabel(device.locale),
          };

          const { error: insertError } = await supabase.from("push_deliveries").insert({
            device_id: subscriber.device_id,
            source_url: sourceUrl,
            item_key: itemKey,
            item_title: title,
            item_link: payload.url,
            payload,
          });

          if (insertError) {
            throw insertError;
          }

          try {
            await webpush.sendNotification(device.subscription, JSON.stringify(payload));
            sentNotifications += 1;

            const { error: updateError } = await supabase
              .from("push_deliveries")
              .update({
                status: "sent",
                sent_at: new Date().toISOString(),
              })
              .eq("device_id", subscriber.device_id)
              .eq("source_url", sourceUrl)
              .eq("item_key", itemKey);

            if (updateError) {
              throw updateError;
            }
          } catch (error) {
            failedNotifications += 1;

            const statusCode = typeof error === "object" && error && "statusCode" in error
              ? Number((error as { statusCode?: number }).statusCode)
              : null;

            await supabase
              .from("push_deliveries")
              .update({
                status: "failed",
                response_status: statusCode,
                error_message: error instanceof Error ? error.message : "Unknown push error",
              })
              .eq("device_id", subscriber.device_id)
              .eq("source_url", sourceUrl)
              .eq("item_key", itemKey);

            if (statusCode === 404 || statusCode === 410) {
              await markDeviceAsDisabled(subscriber.device_id);
            }
          }
        }
      }

      const { error: upsertStateError } = await supabase.from("push_source_state").upsert({
        source_url: sourceUrl,
        last_item_key: latestItemKey,
        last_item_title: extractString(latestItem.title),
        last_item_link: extractLink(latestItem),
        last_item_published_at: latestItem.pubDate ? new Date(latestItem.pubDate).toISOString() : null,
        checked_at: new Date().toISOString(),
      });

      if (upsertStateError) {
        throw upsertStateError;
      }
    }

    return jsonResponse({
      processedSources: sourceUrls.length,
      sentNotifications,
      failedNotifications,
    });
  } catch (error) {
    console.error(error);
    return jsonResponse({
      error: error instanceof Error ? error.message : "Unexpected error.",
    }, 500);
  }
});
