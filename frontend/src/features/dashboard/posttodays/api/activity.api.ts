import api from "@/lib/axios";
import { TodayActivity } from "../types";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const getTodayActivityApi = async (): Promise<ApiResponse<TodayActivity>> => {
  const response = await api.get("/activity/today");
  return response.data;
};
