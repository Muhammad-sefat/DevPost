import api from "@/lib/axios";

export interface Post {
  id: string;
  userId: string;
  suggestionId: string | null;
  title: string;
  content: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "FAILED";
  tags: string;
  postedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostStreaks {
  currentStreak: number;
  longestStreak: number;
  totalPosts: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const saveFinalPostApi = async (post: {
  title: string;
  content: string;
  suggestionId?: string;
}): Promise<ApiResponse<Post>> => {
  const response = await api.post("/posts", post);
  return response.data;
};

export const getPostHistoryApi = async (): Promise<ApiResponse<Post[]>> => {
  const response = await api.get("/posts/history");
  return response.data;
};

export const getPostStreaksApi = async (): Promise<ApiResponse<PostStreaks>> => {
  const response = await api.get("/posts/streaks");
  return response.data;
};
