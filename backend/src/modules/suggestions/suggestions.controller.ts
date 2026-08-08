import { Request, Response } from "express";
import { catchAsync } from "@/utils/catch-async";
import { sendResponse } from "@/utils/api-response";
import { ApiError } from "@/utils/api-error";
import { suggestionsService } from "./suggestions.service";

const getTodaySuggestions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const regenerate = req.query.regenerate === "true";
  const dateStr = new Date().toISOString().split("T")[0];

  const suggestions = await suggestionsService.getSuggestionsForDate(userId, dateStr, regenerate);
  sendResponse(res, 200, "Today's post suggestions retrieved successfully", suggestions);
});

export const suggestionsController = {
  getTodaySuggestions,
};
