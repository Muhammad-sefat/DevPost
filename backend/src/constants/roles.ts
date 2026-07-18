// Single source of truth for roles. Both auth.middleware and role.middleware
// import from here — never hardcode role strings in route files.
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
