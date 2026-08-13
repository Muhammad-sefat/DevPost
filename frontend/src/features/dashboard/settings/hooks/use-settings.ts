"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConnectionStatus, NotificationSettings } from "../types";
import {
  getConnectionsApi,
  connectWakatimeApi,
  disconnectWakatimeApi,
  disconnectGithubApi,
  getNotificationSettingsApi,
  updateNotificationSettingsApi,
} from "../api/settings.api";

export function useSettings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Connections state
  const [connections, setConnections] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{
    githubConnect?: boolean;
    githubDisconnect?: boolean;
    wakatimeConnect?: boolean;
    wakatimeDisconnect?: boolean;
  }>({});

  // Notifications state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [savingNotifications, setSavingNotifications] = useState(false);

  const fetchConnections = useCallback(async () => {
    try {
      const response = await getConnectionsApi();
      if (response.success && response.data) {
        setConnections(response.data);
      }
    } catch (error: any) {
      console.error("Failed to load connections status:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotificationSettings = useCallback(async () => {
    setNotificationsLoading(true);
    try {
      const response = await getNotificationSettingsApi();
      if (response.success && response.data) {
        setNotificationSettings(response.data);
      }
    } catch (error: any) {
      console.error("Failed to load notification settings:", error);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  const handleRedirectParams = useCallback(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "github") {
      toast.success("GitHub connected successfully! Sync is active.");
      router.replace("/settings");
      fetchConnections();
    } else if (error) {
      toast.error(decodeURIComponent(error));
      router.replace("/settings");
    }
  }, [searchParams, router, fetchConnections]);

  useEffect(() => {
    fetchConnections();
    fetchNotificationSettings();
  }, [fetchConnections, fetchNotificationSettings]);

  useEffect(() => {
    handleRedirectParams();
  }, [handleRedirectParams]);

  const connectGithub = () => {
    setActionLoading((prev) => ({ ...prev, githubConnect: true }));
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    window.location.href = `${apiBaseUrl}/connections/github/connect`;
  };

  const disconnectGithub = async () => {
    setActionLoading((prev) => ({ ...prev, githubDisconnect: true }));
    try {
      const response = await disconnectGithubApi();
      if (response.success) {
        toast.success(response.message || "GitHub connection removed.");
        await fetchConnections();
      } else {
        toast.error(response.message || "Failed to disconnect GitHub.");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || "Failed to disconnect GitHub.";
      toast.error(errMsg);
    } finally {
      setActionLoading((prev) => ({ ...prev, githubDisconnect: false }));
    }
  };

  const connectWakatime = async (apiKey: string) => {
    setActionLoading((prev) => ({ ...prev, wakatimeConnect: true }));
    try {
      const response = await connectWakatimeApi(apiKey);
      if (response.success) {
        toast.success(response.message || "WakaTime integration configured successfully!");
        await fetchConnections();
        return true;
      } else {
        toast.error(response.message || "Failed to connect WakaTime.");
        return false;
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || "Failed to connect WakaTime.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading((prev) => ({ ...prev, wakatimeConnect: false }));
    }
  };

  const disconnectWakatime = async () => {
    setActionLoading((prev) => ({ ...prev, wakatimeDisconnect: true }));
    try {
      const response = await disconnectWakatimeApi();
      if (response.success) {
        toast.success(response.message || "WakaTime integration removed.");
        await fetchConnections();
      } else {
        toast.error(response.message || "Failed to disconnect WakaTime.");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || "Failed to disconnect WakaTime.";
      toast.error(errMsg);
    } finally {
      setActionLoading((prev) => ({ ...prev, wakatimeDisconnect: false }));
    }
  };

  const updateNotificationSettings = async (settings: Partial<NotificationSettings>) => {
    setSavingNotifications(true);
    try {
      const response = await updateNotificationSettingsApi(settings);
      if (response.success && response.data) {
        setNotificationSettings(response.data);
        toast.success(response.message || "Notification settings updated successfully!");
        return true;
      } else {
        toast.error(response.message || "Failed to update notification settings.");
        return false;
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || "Failed to update notification settings.";
      toast.error(errMsg);
      return false;
    } finally {
      setSavingNotifications(false);
    }
  };

  return {
    connections,
    loading,
    actionLoading,
    connectGithub,
    disconnectGithub,
    connectWakatime,
    disconnectWakatime,
    refetchConnections: fetchConnections,
    
    // Notifications exports
    notificationSettings,
    notificationsLoading,
    savingNotifications,
    updateNotificationSettings,
    refetchNotificationSettings: fetchNotificationSettings,
  };
}
