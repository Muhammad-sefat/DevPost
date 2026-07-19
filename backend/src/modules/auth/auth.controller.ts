import { Request, Response } from "express";
import { catchAsync } from "@/utils/catch-async";
import { ApiResponse } from "@/utils/api-response";
import { authService } from "./auth.service";

// Cookies are httpOnly + secure so the token can't be read by JS (XSS-safe),
// and sameSite lax works for the web/admin apps since they're separate
// subdomains hitting the same API in production.
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const authController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await authService.register(req.body);
    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(201)
      .json(new ApiResponse("Registered successfully", { accessToken }));
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await authService.login(req.body);
    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(new ApiResponse("Logged in successfully", { accessToken }));
  }),

  logout: catchAsync(async (_req: Request, res: Response) => {
    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json(new ApiResponse("Logged out successfully", null));
  }),
};
