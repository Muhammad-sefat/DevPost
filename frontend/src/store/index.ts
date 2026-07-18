import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/auth.slice";
import uiReducer from "@/store/slices/uiSlice";

// Use Redux ONLY for client-side UI state (sidebar open/closed, current
// theme, form drafts). Server data — users, posts, anything from the API —
// belongs in TanStack Query, not Redux. Mixing the two causes cache
// desync bugs where Redux has stale data and React Query has fresh data.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
