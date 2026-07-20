import { Request, Response } from "express";
import { catchAsync } from "@/utils/catch-async";
import { sendResponse } from "@/utils/api-response";
import { userService } from "./user.service";

const getMe = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getMe(req.user!);

    sendResponse(res, 200, "Profile retrieved successfully", result);
});

export const userController = {
    getMe,
};