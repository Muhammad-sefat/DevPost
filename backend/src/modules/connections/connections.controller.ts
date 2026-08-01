import { Request, Response } from "express";
import { catchAsync } from "@/utils/catch-async";
import { sendResponse } from "@/utils/api-response";
import { ApiError } from "@/utils/api-error";
import { ENV } from "@/config/env";
import { connectionsService } from "./connections.service";
import { connectWakatimeSchema } from "./connections.validation";

const getConnectionStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const status = await connectionsService.getConnectionStatus(userId);
  sendResponse(res, 200, "Connections status retrieved successfully", status);
});

const connectGithubRedirect = catchAsync(async (req: Request, res: Response) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${ENV.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    ENV.GITHUB_CALLBACK_URL
  )}&scope=${encodeURIComponent("read:user,repo,user:email")}&state=connect`;
  
  res.redirect(url);
});

const disconnectGithub = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await connectionsService.disconnectGithub(userId);
  sendResponse(res, 200, result.message);
});

const connectWakatime = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const validation = connectWakatimeSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((err) => err.message).join(", ");
    throw new ApiError(400, errorMsg);
  }

  await connectionsService.connectWakatime(userId, validation.data.apiKey);
  sendResponse(res, 200, "WakaTime connected successfully");
});

const disconnectWakatime = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await connectionsService.disconnectWakatime(userId);
  sendResponse(res, 200, result.message);
});

export const connectionsController = {
  getConnectionStatus,
  connectGithubRedirect,
  disconnectGithub,
  connectWakatime,
  disconnectWakatime,
};
