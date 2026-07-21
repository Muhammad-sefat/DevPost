import { Request, Response } from "express";
import { catchAsync } from "@/utils/catch-async";
import { sendResponse } from "@/utils/api-response";
import { userService } from "./user.service";
import { updateProfileSchema } from "./user.validation";
import { ApiError } from "@/utils/api-error";
import { clearAccessTokenCookie, clearRefreshTokenCookie } from "@/utils/cookies";

const getMe = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getMe(req.user!);

    sendResponse(res, 200, "Profile retrieved successfully", result);
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const validationResult = updateProfileSchema.safeParse(req.body);

    if (!validationResult.success) {
        const errors = validationResult.error.errors.map((err) => err.message);
        throw new ApiError(400, errors.join(", "));
    }

    const result = await userService.updateProfile(req.user!.userId, validationResult.data);

    sendResponse(res, 200, "Profile updated successfully", result);
});

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
    await userService.deleteAccount(req.user!.userId);

    clearAccessTokenCookie(res);
    clearRefreshTokenCookie(res);

    sendResponse(res, 200, "Account deleted successfully");
});

export const userController = {
    getMe,
    updateProfile,
    deleteAccount,
};