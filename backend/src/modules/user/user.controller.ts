import { Request, Response } from "express";
import { catchAsync } from "@/lib/catch-async";
import { ApiResponse } from "@/lib/api-response";
import { userService } from "./user.service";

export const userController = {
  getMe: catchAsync(async (req: Request, res: Response) => {
    const user = await userService.getMe(req.user!.userId);
    res.status(200).json(new ApiResponse("Current user fetched", user));
  }),

  listUsers: catchAsync(async (_req: Request, res: Response) => {
    const users = await userService.listUsers();
    res.status(200).json(new ApiResponse("Users fetched", users));
  }),
};
