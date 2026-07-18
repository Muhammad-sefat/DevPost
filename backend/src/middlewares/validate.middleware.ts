import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

// Validates body/query/params against a Zod schema BEFORE the controller runs.
// Keeps controllers free of manual "if (!email) throw ..." checks.
// Usage: router.post("/login", validate(loginSchema), authController.login)
export const validate = (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction) => {
  schema.parse({
    body: req.body,
    query: req.query,
    params: req.params,
  });
  next();
};
