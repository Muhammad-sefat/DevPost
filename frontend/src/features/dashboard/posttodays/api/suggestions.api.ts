import api from "@/lib/axios";

export interface PostSuggestion {
  id: string;
  title: string;
  content: string;
  status: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const getTodaySuggestionsApi = async (regenerate = false): Promise<ApiResponse<PostSuggestion[]>> => {
  const response = await api.get(`/suggestions/today${regenerate ? "?regenerate=true" : ""}`);
  return response.data;
};
