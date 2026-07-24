"use client";

import { useAppSelector } from "@/store";

export function useRole() {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const role = user?.role || "USER";

  const hasRole = (...roles: string[]) => roles.includes(role);
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  return { role, isLoading, hasRole, isAdmin };
}
