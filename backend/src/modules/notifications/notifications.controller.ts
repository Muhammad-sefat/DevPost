import { Request, Response } from "express";
import { catchAsync } from "@/utils/catch-async";
import { sendResponse } from "@/utils/api-response";
import { ApiError } from "@/utils/api-error";
import { prisma } from "@/config/db";

const getSettings = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // Find or create default notification setting
  let settings = await prisma.notificationSetting.findFirst({
    where: { userId },
  });

  if (!settings) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    settings = await prisma.notificationSetting.create({
      data: {
        userId,
        email: user?.email || "",
        channel: "email",
        notifyTime: "18:00",
        telegramChatId: "",
      },
    });
  }

  sendResponse(res, 200, "Notification settings retrieved successfully", settings);
});

const updateSettings = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { email, channel, notifyTime, telegramChatId } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  let settings = await prisma.notificationSetting.findFirst({
    where: { userId },
  });

  if (settings) {
    settings = await prisma.notificationSetting.update({
      where: { id: settings.id },
      data: {
        email,
        channel: channel || "email",
        notifyTime: notifyTime || "18:00",
        telegramChatId: telegramChatId || "",
      },
    });
  } else {
    settings = await prisma.notificationSetting.create({
      data: {
        userId,
        email,
        channel: channel || "email",
        notifyTime: notifyTime || "18:00",
        telegramChatId: telegramChatId || "",
      },
    });
  }

  sendResponse(res, 200, "Notification settings updated successfully", settings);
});

export const notificationsController = {
  getSettings,
  updateSettings,
};
