import { NextFunction, Request, Response } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

// Wrap every async controller with this. Without it, a rejected promise
// inside an async Express handler crashes the process instead of being
// caught by your error-handler middleware.
export const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
