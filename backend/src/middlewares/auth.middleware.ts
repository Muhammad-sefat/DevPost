import { NextFunction, Request, Response } from "express";
import { catchAsync } from "@/lib/catch-async";
import { ApiError } from "@/lib/api-error";
import { verifyAccessToken, JwtPayload } from "@/lib/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;
  const token = req.cookies?.accessToken || bearerToken;

  if (!token) throw ApiError.unauthorized("You are not logged in");

  try {
    req.user = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }

  next();
});
