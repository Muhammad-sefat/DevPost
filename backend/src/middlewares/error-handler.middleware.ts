import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ApiError } from "@/lib/api-error";
import { env } from "@/config/env";

// The ONE place in the whole app that formats errors. No controller should
// ever write its own try/catch + res.status(...).json(...) — throw and let
// this middleware handle shaping the response.
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors: unknown = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.flatten().fieldErrors;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = unique constraint violation (e.g. duplicate email)
    if (err.code === "P2002") {
      statusCode = 409;
      message = `Duplicate value for field: ${err.meta?.target}`;
    } else {
      statusCode = 400;
      message = "Database request error";
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: env.NODE_ENV === "development" && err instanceof Error ? err.stack : undefined,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}
