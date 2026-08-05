import { Request, Response } from "express";
import { catchAsync } from "@/utils/catch-async";
import { sendResponse } from "@/utils/api-response";
import { ApiError } from "@/utils/api-error";
import { activityService } from "./activity.service";

const getTodayActivity = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const dateStr = new Date().toISOString().split("T")[0];

  const activity = await activityService.getActivityForDate(userId, dateStr);
  sendResponse(res, 200, "Today's activity retrieved successfully", activity);
});

const getActivityByDate = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { date } = req.params;

  const activity = await activityService.getActivityForDate(userId, date);
  sendResponse(res, 200, `Activity for ${date} retrieved successfully`, activity);
});

const getMonthlyActivity = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const now = new Date();
  const year = req.query.year ? parseInt(req.query.year as string, 10) : now.getFullYear();
  const month = req.query.month ? parseInt(req.query.month as string, 10) : now.getMonth() + 1;

  const activities = await activityService.getMonthlyActivity(userId, year, month);
  sendResponse(res, 200, "Monthly activities retrieved successfully", activities);
});

export const activityController = {
  getTodayActivity,
  getActivityByDate,
  getMonthlyActivity,
};
