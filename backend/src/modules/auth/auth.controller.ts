import { catchAsync } from "@/utils/catch-async";
import { signinSchema, signupSchema, verifyEmailSchema } from "./auth.validation";
import { Request, Response } from "express";
import { ApiError } from "@/utils/api-error";
import { authService } from "./auth.service";
import { setAccessTokenCookie, setRefreshTokenCookie, clearAccessTokenCookie, clearRefreshTokenCookie } from "@/utils/cookies";
import { sendResponse } from "@/utils/api-response";


const signup = catchAsync(async (req: Request, res: Response) => {
  const validationResult = signupSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(
      (err) => err.message
    );

    throw new ApiError(400, errors.join(", "));
  }

  const result = await authService.signup(validationResult.data);

  setAccessTokenCookie(res, result.accessToken);
  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, 201, "User registered successfully", {
    user: result.user,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const validationResult = verifyEmailSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(
      (err) => err.message
    );

    throw new ApiError(400, errors.join(", "));
  }

  await authService.verifyEmail(validationResult.data);

  sendResponse(res, 200, "Email verified successfully");
});


const signin = catchAsync(async (req: Request, res: Response) => {
  const validationResult = signinSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(
      (err) => err.message
    );

    throw new ApiError(400, errors.join(", "));
  }

  const result = await authService.signin(validationResult.data);

  setAccessTokenCookie(res, result.accessToken);
  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, 200, "Login successful", {
    user: result.user,
  });
});

const logout = catchAsync(async (_req: Request, res: Response) => {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);

  sendResponse(res, 200, "Logged out successfully");
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Refresh token missing");
  }

  const result = await authService.refreshToken(token);

  setAccessTokenCookie(res, result.accessToken);
  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, 200, "Token refreshed successfully", {
    user: result.user,
  });
});

export const authController = { signup, verifyEmail, signin, logout, refreshToken };