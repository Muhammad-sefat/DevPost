import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "@/utils/jwt";
import { ApiError } from "@/utils/api-error";

export const auth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    const decoded = verifyAccessToken(token) as {
      userId: string;
      role: "USER" | "ADMIN";
    };

    req.user = decoded;

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};