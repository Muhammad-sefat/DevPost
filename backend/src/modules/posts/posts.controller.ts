import { Request, Response } from "express";
import { catchAsync } from "@/utils/catch-async";
import { sendResponse } from "@/utils/api-response";
import { ApiError } from "@/utils/api-error";
import { postsService } from "./posts.service";

const saveFinalPost = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { title, content, suggestionId } = req.body;
  if (!title || !content) {
    throw new ApiError(400, "Title and content are required to save a post.");
  }

  const post = await postsService.saveFinalPost({
    userId,
    title,
    content,
    suggestionId,
  });

  sendResponse(res, 201, "Final LinkedIn post recorded successfully", post);
});

const getPostHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const history = await postsService.getPostHistory(userId);
  sendResponse(res, 200, "Post history retrieved successfully", history);
});

const getPostStreaks = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const streaks = await postsService.getPostStreaks(userId);
  sendResponse(res, 200, "Post streak details retrieved successfully", streaks);
});

export const postsController = {
  saveFinalPost,
  getPostHistory,
  getPostStreaks,
};
export default postsController;
