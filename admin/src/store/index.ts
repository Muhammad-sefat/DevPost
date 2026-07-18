import { configureStore } from "@reduxjs/toolkit";

// Use Redux ONLY for client-side UI state (sidebar open/closed, current
// theme, form drafts). Server data — users, services, everything from the
// API — belongs in TanStack Query, not Redux.
export const store = configureStore({
  reducer: {
    _dummy: (state = {}) => state,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
