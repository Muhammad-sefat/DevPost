import { catchAsync } from "@/utils/catch-async";
import { forgotPasswordSchema, githubSigninSchema, googlesigninSchema, resendForgotPasswordOtpSchema, resendVerificationOtpSchema, resetPasswordSchema, signinSchema, signupSchema, verifyEmailSchema, verifyForgotPasswordOtpSchema } from "./auth.validation";
import { Request, Response } from "express";
import { ApiError } from "@/utils/api-error";
import { authService } from "./auth.service";
import { clearAccessTokenCookie, clearRefreshTokenCookie, setAccessTokenCookie, setRefreshTokenCookie } from "@/utils/cookies";
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
    // accessToken: result.accessToken,
    // refreshToken: result.refreshToken,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  const result = await authService.refreshToken(refreshToken);

  setAccessTokenCookie(res, result.accessToken);

  sendResponse(res, 200, "Access token refreshed successfully", {
    accessToken: result.accessToken,
  });
});

const googleSignin = catchAsync(async (req, res) => {
  const validation = googlesigninSchema.safeParse(req.body);

  if (!validation.success) {
    throw new ApiError(400, validation.error.errors[0].message);
  }

  const result = await authService.googleSignin(
    validation.data.idToken
  );

  setAccessTokenCookie(res, result.accessToken);
  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, 200, "Google login successful", {
    user: result.user,
  });
});

const githubSignin = catchAsync(async (req, res) => {
  const validation = githubSigninSchema.safeParse(req.body);

  if (!validation.success) {
    throw new ApiError(
      400,
      validation.error.errors[0].message
    );
  }

  const result = await authService.githubSignin(
    validation.data.code
  );

  setAccessTokenCookie(res, result.accessToken);
  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, 200, "GitHub login successful", {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
});

const logout = catchAsync(async (_req: Request, res: Response) => {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);

  sendResponse(res, 200, "Logged out successfully");
});

const resendVerificationOtp = catchAsync(async (req: Request, res: Response) => {
  const validationResult = resendVerificationOtpSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => err.message);
    throw new ApiError(400, errors.join(", "));
  }

  await authService.resendVerificationOtp(validationResult.data);

  sendResponse(res, 200, "Verification OTP resent successfully");
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const validationResult = forgotPasswordSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => err.message);
    throw new ApiError(400, errors.join(", "));
  }

  await authService.forgotPassword(validationResult.data);

  sendResponse(res, 200, "Password reset OTP sent to email");
});

const resendForgotPasswordOtp = catchAsync(async (req: Request, res: Response) => {
  const validationResult = resendForgotPasswordOtpSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => err.message);
    throw new ApiError(400, errors.join(", "));
  }

  await authService.resendForgotPasswordOtp(validationResult.data);

  sendResponse(res, 200, "Password reset OTP resent successfully");
});

const verifyForgotPasswordOtp = catchAsync(async (req: Request, res: Response) => {
  const validationResult = verifyForgotPasswordOtpSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => err.message);
    throw new ApiError(400, errors.join(", "));
  }

  await authService.verifyForgotPasswordOtp(validationResult.data);

  sendResponse(res, 200, "Password reset OTP verified successfully");
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const validationResult = resetPasswordSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => err.message);
    throw new ApiError(400, errors.join(", "));
  }

  await authService.resetPassword(validationResult.data);

  sendResponse(res, 200, "Password reset successfully");
});

export const authController = {
  signup,
  verifyEmail,
  resendVerificationOtp,
  signin,
  refreshToken,
  googleSignin,
  githubSignin,
  logout,
  forgotPassword,
  resendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
};