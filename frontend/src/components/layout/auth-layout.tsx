"use client";

import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Portal Auth
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in or sign up to continue
          </p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
