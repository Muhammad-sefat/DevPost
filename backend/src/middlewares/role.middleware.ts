import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/lib/api-error";
import { Role } from "@/constants/roles";

// Usage: router.get("/admin-only", authenticate, authorize("ADMIN", "SUPER_ADMIN"), handler)
// Always chain AFTER `authenticate` — this middleware assumes req.user exists.
export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw ApiError.unauthorized("You are not logged in");
    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden("You do not have permission to perform this action");
    }
    next();
  };
