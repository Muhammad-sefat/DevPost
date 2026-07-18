"use client";

import { useState, useEffect } from "react";

export function useRole() {
  const [role, setRole] = useState<string>("USER");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dummy-role") || "USER";
      setRole(saved);
    }
  }, []);

  const changeRole = (newRole: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dummy-role", newRole);
      setRole(newRole);
      window.location.reload();
    }
  };

  const hasRole = (...roles: string[]) => roles.includes(role);

  return { role, isLoading: false, hasRole, changeRole };
}
