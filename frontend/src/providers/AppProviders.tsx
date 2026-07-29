"use client";

import * as React from "react";
import { QueryProvider } from "@/lib/query-client";
import { ToastProvider } from "@/components/ui/toast";
import { StoreProvider } from "@/store/provider";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <QueryProvider>
        <ToastProvider>{children}</ToastProvider>
        <Toaster position="bottom-right" richColors theme="dark" />
      </QueryProvider>
    </StoreProvider>
  );
}
