import { ActionTypes, useMainContext } from "../context/main";
import { disablePushDevice, ensureDeviceId, fetchPushConfig, getCurrentPushPermission, isPushSupported, registerPushDevice, setSourcePushPreference, subscribeBrowserToPush, unsubscribeBrowserFromPush } from "./push";
import { useCallback, useEffect, useState } from "react";

import type { Source } from "../types/storage";
import { useError } from "./useError";
import { useI18n } from "../context/i18n";

export const usePushNotifications = () => {
  const { state, dispatch } = useMainContext();
  const { showError } = useError();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const updateSettings = useCallback((next: Partial<typeof state.notificationSettings>) => {
    dispatch({
      type: ActionTypes.UPDATE_NOTIFICATION_SETTINGS,
      payload: next,
    });
  }, [dispatch]);

  const syncFromServer = useCallback(async () => {
    if (!isPushSupported()) {
      updateSettings({
        permission: "unsupported",
        configSynced: true,
      });
      return null;
    }

    const deviceId = ensureDeviceId(state.notificationSettings.deviceId);

    updateSettings({ deviceId });
    setSyncing(true);

    try {
      const config = await fetchPushConfig(deviceId);
      updateSettings({
        deviceId,
        permission: config.permission,
        subscribedSourceUrls: config.subscribedSourceUrls,
        lastSyncedAt: new Date().toISOString(),
        configSynced: true,
      });
      return config;
    } catch (error) {
      console.error(error);
      showError(t("push.error.sync"));
      return null;
    } finally {
      setSyncing(false);
    }
  }, [showError, state.notificationSettings.deviceId, t, updateSettings]);

  useEffect(() => {
    if (state.notificationSettings.configSynced) {
      return;
    }

    void syncFromServer();
  }, [state.notificationSettings.configSynced, syncFromServer]);

  const enableNotifications = useCallback(async () => {
    if (!isPushSupported()) {
      updateSettings({
        permission: "unsupported",
        configSynced: true,
      });
      showError(t("push.unsupported"), "warning");
      return false;
    }

    const deviceId = ensureDeviceId(state.notificationSettings.deviceId);
    updateSettings({ deviceId });
    setLoading(true);

    try {
      const permission = await Notification.requestPermission();

      updateSettings({ permission });

      if (permission !== "granted") {
        showError(
          permission === "denied" ? t("push.permissionDenied") : t("push.permissionDefault"),
          "warning",
        );
        return false;
      }

      const config = await fetchPushConfig(deviceId);
      const subscription = await subscribeBrowserToPush(config.publicVapidKey);

      await registerPushDevice({
        deviceId,
        subscription,
        permission,
        locale: navigator.language,
        userAgent: navigator.userAgent,
      });

      updateSettings({
        deviceId,
        permission,
        subscribedSourceUrls: config.subscribedSourceUrls,
        lastSyncedAt: new Date().toISOString(),
        configSynced: true,
      });

      showError(t("push.enabled"), "success");
      return true;
    } catch (error) {
      console.error(error);
      showError(t("push.error.enable"));
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError, state.notificationSettings.deviceId, t, updateSettings]);

  const disableNotifications = useCallback(async () => {
    const deviceId = state.notificationSettings.deviceId;

    if (!deviceId) {
      updateSettings({
        permission: getCurrentPushPermission(),
        subscribedSourceUrls: [],
        configSynced: true,
      });
      return true;
    }

    setLoading(true);

    try {
      await unsubscribeBrowserFromPush();
      await disablePushDevice({
        deviceId,
        permission: Notification.permission === "denied" ? "denied" : "default",
      });

      updateSettings({
        permission: getCurrentPushPermission(),
        subscribedSourceUrls: [],
        lastSyncedAt: new Date().toISOString(),
        configSynced: true,
      });

      showError(t("push.disabled"), "info");
      return true;
    } catch (error) {
      console.error(error);
      showError(t("push.error.disable"));
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError, state.notificationSettings.deviceId, t, updateSettings]);

  const setSourceEnabled = useCallback(async (source: Source, enabled: boolean) => {
    setLoading(true);

    try {
      const activated = enabled ? await enableNotifications() : true;

      if (!activated) {
        return false;
      }

      const deviceId = ensureDeviceId(state.notificationSettings.deviceId);
      const result = await setSourcePushPreference({
        deviceId,
        sourceUrl: source.url,
        sourceName: source.name ?? null,
        enabled,
      });

      updateSettings({
        deviceId,
        subscribedSourceUrls: result.subscribedSourceUrls,
        permission: getCurrentPushPermission(),
        lastSyncedAt: new Date().toISOString(),
        configSynced: true,
      });

      showError(enabled ? t("push.sourceEnabled") : t("push.sourceDisabled"), enabled ? "success" : "info");
      return true;
    } catch (error) {
      console.error(error);
      showError(t("push.error.sourcePreference"));
      return false;
    } finally {
      setLoading(false);
    }
  }, [enableNotifications, showError, state.notificationSettings.deviceId, t, updateSettings]);

  const removeSourcePreference = useCallback(async (sourceUrl: string) => {
    if (!state.notificationSettings.deviceId || state.notificationSettings.permission !== "granted") {
      return;
    }

    try {
      const result = await setSourcePushPreference({
        deviceId: state.notificationSettings.deviceId,
        sourceUrl,
        sourceName: null,
        enabled: false,
      });

      updateSettings({
        subscribedSourceUrls: result.subscribedSourceUrls,
        lastSyncedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);
    }
  }, [state.notificationSettings.deviceId, state.notificationSettings.permission, updateSettings]);

  return {
    loading,
    syncing,
    supported: isPushSupported(),
    permission: state.notificationSettings.permission,
    subscribedSourceUrls: state.notificationSettings.subscribedSourceUrls,
    subscribedSourcesCount: state.notificationSettings.subscribedSourceUrls.length,
    enableNotifications,
    disableNotifications,
    syncFromServer,
    setSourceEnabled,
    removeSourcePreference,
    isSourceEnabled: (sourceUrl: string) => state.notificationSettings.subscribedSourceUrls.includes(sourceUrl),
  };
};
