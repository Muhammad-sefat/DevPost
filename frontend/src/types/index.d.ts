export type Role = "SUPER_ADMIN" | "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

// Mirrors the backend's ApiResponse<T> shape exactly — the axios interceptor
// and every TanStack Query hook rely on this being consistent.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  allowedRoles?: Role[];
  badge?: number | string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
