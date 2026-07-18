import axios from "axios";

// Central axios instance. withCredentials sends the httpOnly cookie
// automatically — no manual Authorization header wiring needed per request.
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// If the access token expires, the backend returns 401. Instead of every
// feature hook handling that separately, refresh once here and retry.
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
        // refresh failed too — force a redirect to login at the call site
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
