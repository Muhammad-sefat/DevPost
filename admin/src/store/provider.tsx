"use client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { store } from "./index";

export function Providers({ children }: { children: ReactNode }) {
  // Each <Providers> mount gets its own QueryClient so tests don't
  // share stale caches. React ensures this survives re-renders.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes before re-fetch
            retry: 1,                  // don't spam the API on failure
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
