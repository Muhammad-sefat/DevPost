import axios from "axios";

// Central axios instance. withCredentials sends the httpOnly cookie
// automatically — no manual Authorization header wiring needed per request.
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// On 401 → try to refresh the token, then retry the original request.
// If refresh also fails, propagate the error so the caller can redirect.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await apiClient.post("/auth/refresh");
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
