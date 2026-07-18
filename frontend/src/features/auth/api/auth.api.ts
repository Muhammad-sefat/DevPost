import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, User } from "@/types";
import { LoginFormValues } from "../schema/login.schema";

// Pure request functions — no React here. Keeps them testable and reusable
// outside of hooks if you ever need to (e.g. in a server action).
const loginRequest = (payload: LoginFormValues) =>
  apiClient.post<ApiResponse<{ accessToken: string }>>("/auth/login", payload);

const meRequest = () => apiClient.get<ApiResponse<User>>("/users/me");

// TanStack Query hooks — this is what components actually import.
export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: () => {
      // Re-fetch "me" so role-based UI updates immediately after login.
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useMeQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => (await meRequest()).data.data,
    retry: false,
  });
}
