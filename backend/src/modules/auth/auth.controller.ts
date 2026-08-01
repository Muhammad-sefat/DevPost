import { catchAsync } from "@/utils/catch-async";
import { ENV } from "@/config/env";
import axios from "axios";
import {
  forgotPasswordSchema,
  githubSigninSchema,
  googlesigninSchema,
  resendForgotPasswordOtpSchema,
  resendVerificationOtpSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
  verifyEmailSchema,
  verifyForgotPasswordOtpSchema,
} from "./auth.validation";
import { Request, Response } from "express";
import { ApiError } from "@/utils/api-error";
import { authService } from "./auth.service";
import {
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "@/utils/cookies";
import { sendResponse } from "@/utils/api-response";
import { verifyAccessToken } from "@/utils/jwt";
import { connectionsService } from "@/modules/connections/connections.service";

const signup = catchAsync(async (req: Request, res: Response) => {
  const validationResult = signupSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => err.message);
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
    const errors = validationResult.error.errors.map((err) => err.message);
    throw new ApiError(400, errors.join(", "));
  }

  await authService.verifyEmail(validationResult.data);

  sendResponse(res, 200, "Email verified successfully");
});

const signin = catchAsync(async (req: Request, res: Response) => {
  const validationResult = signinSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => err.message);
    throw new ApiError(400, errors.join(", "));
  }

  const result = await authService.signin(validationResult.data);

  setAccessTokenCookie(res, result.accessToken);
  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, 200, "Login successful", {
    user: result.user,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token =
    req.cookies?.refreshToken ||
    req.headers.authorization?.replace("Bearer ", "");

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

const googleSignin = catchAsync(async (req: Request, res: Response) => {
  const validation = googlesigninSchema.safeParse(req.body);

  if (!validation.success) {
    throw new ApiError(400, validation.error.errors[0].message);
  }

  const result = await authService.googleSignin(validation.data.idToken);

  setAccessTokenCookie(res, result.accessToken);
  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, 200, "Google login successful", {
    user: result.user,
  });
});

const githubSignin = catchAsync(async (req: Request, res: Response) => {
  const validation = githubSigninSchema.safeParse(req.body);

  if (!validation.success) {
    throw new ApiError(400, validation.error.errors[0].message);
  }

  const result = await authService.githubSignin(validation.data.code);

  setAccessTokenCookie(res, result.accessToken);
  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, 200, "GitHub login successful", {
    user: result.user,
  });
});

const googleAuthRedirect = catchAsync(async (req: Request, res: Response) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${ENV.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(ENV.GOOGLE_CALLBACK_URL)}&response_type=code&scope=${encodeURIComponent("profile email")}&access_type=offline&prompt=consent`;
  res.redirect(url);
});

const googleAuthCallback = catchAsync(async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    return res.redirect(`${ENV.CLIENT_URL}/signin?error=${encodeURIComponent("Google authorization code missing")}`);
  }

  try {
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: ENV.GOOGLE_CLIENT_ID,
      client_secret: ENV.GOOGLE_CLIENT_SECRET,
      redirect_uri: ENV.GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
    });

    const idToken = tokenResponse.data.id_token;
    if (!idToken) {
      throw new Error("Failed to retrieve ID token from Google");
    }

    const result = await authService.googleSignin(idToken);

    setAccessTokenCookie(res, result.accessToken);
    setRefreshTokenCookie(res, result.refreshToken);

    res.redirect(`${ENV.CLIENT_URL}/dashboard`);
  } catch (error: any) {
    const errorMessage = error.response?.data?.error_description || error.message || "Google authentication failed";
    res.redirect(`${ENV.CLIENT_URL}/signin?error=${encodeURIComponent(errorMessage)}`);
  }
});

const githubAuthRedirect = catchAsync(async (req: Request, res: Response) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${ENV.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(ENV.GITHUB_CALLBACK_URL)}&scope=${encodeURIComponent("user:email")}`;
  res.redirect(url);
});

const githubAuthCallback = catchAsync(async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const state = req.query.state as string;

  if (!code) {
    if (state === "connect") {
      return res.redirect(`${ENV.CLIENT_URL}/settings?error=${encodeURIComponent("GitHub authorization code missing")}`);
    }
    return res.redirect(`${ENV.CLIENT_URL}/signin?error=${encodeURIComponent("GitHub authorization code missing")}`);
  }

  try {
    if (state === "connect") {
      const token = req.cookies?.accessToken;
      if (!token) {
        return res.redirect(`${ENV.CLIENT_URL}/signin?error=${encodeURIComponent("Unauthorized")}`);
      }

      let decoded: { userId: string; role: "USER" | "ADMIN" };
      try {
        decoded = verifyAccessToken(token) as { userId: string; role: "USER" | "ADMIN" };
      } catch {
        return res.redirect(`${ENV.CLIENT_URL}/signin?error=${encodeURIComponent("Session expired")}`);
      }

      await connectionsService.connectGithub(decoded.userId, code);
      return res.redirect(`${ENV.CLIENT_URL}/settings?success=github`);
    }

    const result = await authService.githubSignin(code);

    setAccessTokenCookie(res, result.accessToken);
    setRefreshTokenCookie(res, result.refreshToken);

    res.redirect(`${ENV.CLIENT_URL}/dashboard`);
  } catch (error: any) {
    const errorMessage = error.response?.data?.error_description || error.message || "GitHub authentication failed";
    if (state === "connect") {
      return res.redirect(`${ENV.CLIENT_URL}/settings?error=${encodeURIComponent(errorMessage)}`);
    }
    res.redirect(`${ENV.CLIENT_URL}/signin?error=${encodeURIComponent(errorMessage)}`);
  }
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

const resendForgotPasswordOtp = catchAsync(
  async (req: Request, res: Response) => {
    const validationResult = resendForgotPasswordOtpSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      throw new ApiError(400, errors.join(", "));
    }

    await authService.resendForgotPasswordOtp(validationResult.data);

    sendResponse(res, 200, "Password reset OTP resent successfully");
  }
);

const verifyForgotPasswordOtp = catchAsync(
  async (req: Request, res: Response) => {
    const validationResult = verifyForgotPasswordOtpSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      throw new ApiError(400, errors.join(", "));
    }

    await authService.verifyForgotPasswordOtp(validationResult.data);

    sendResponse(res, 200, "Password reset OTP verified successfully");
  }
);

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
  signin,
  refreshToken,
  googleSignin,
  googleAuthRedirect,
  googleAuthCallback,
  githubSignin,
  githubAuthRedirect,
  githubAuthCallback,
  logout,
  resendVerificationOtp,
  forgotPassword,
  resendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
};
