import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/api-error";
import { ZodError } from "zod";

export const globalErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    // Custom ApiError
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Zod validation
    else if (err instanceof ZodError) {
        statusCode = 400;
        message = err.errors.map((e) => e.message).join(", ");
    }

    // Unknown Error
    else if (err instanceof Error) {
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};