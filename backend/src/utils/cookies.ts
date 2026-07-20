import { Response } from "express";
import { ENV } from "@/config/env";

const cookieOptions = {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "lax" as const,
};

export const setAccessTokenCookie = (
    res: Response,
    accessToken: string
) => {
    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
    });
};

export const setRefreshTokenCookie = (
    res: Response,
    refreshToken: string
) => {
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const clearAccessTokenCookie = (res: Response) => {
    res.clearCookie("accessToken", cookieOptions);
};

export const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie("refreshToken", cookieOptions);
};