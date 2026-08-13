import api from "@/lib/axios";
import { ConnectionStatus, NotificationSettings } from "../types";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const getConnectionsApi = async (): Promise<ApiResponse<ConnectionStatus>> => {
  const response = await api.get("/connections");
  return response.data;
};

export const connectWakatimeApi = async (apiKey: string): Promise<ApiResponse> => {
  const response = await api.post("/connections/wakatime", { apiKey });
  return response.data;
};

export const disconnectWakatimeApi = async (): Promise<ApiResponse> => {
  const response = await api.delete("/connections/wakatime");
  return response.data;
};

export const disconnectGithubApi = async (): Promise<ApiResponse> => {
  const response = await api.delete("/connections/github");
  return response.data;
};

export const getNotificationSettingsApi = async (): Promise<ApiResponse<NotificationSettings>> => {
  const response = await api.get("/notifications/settings");
  return response.data;
};

export const updateNotificationSettingsApi = async (settings: Partial<NotificationSettings>): Promise<ApiResponse<NotificationSettings>> => {
  const response = await api.put("/notifications/settings", settings);
  return response.data;
};
