import { prisma } from "@/config/db";
import { ApiError } from "@/utils/api-error";
import { RequestUser } from "@/types/request";
import { UpdateProfileInput } from "./user.types";

const getMe = async (user: RequestUser) => {
    const currentUser = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    return currentUser;
};

const updateProfile = async (userId: string, payload: UpdateProfileInput) => {
    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};

const deleteAccount = async (userId: string) => {
    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    await prisma.user.delete({
        where: { id: userId },
    });

    return null;
};

export const userService = {
    getMe,
    updateProfile,
    deleteAccount,
};