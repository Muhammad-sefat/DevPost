import { prisma } from "@/config/db";
import { ApiError } from "@/utils/api-error";
import { RequestUser } from "@/types/request";

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

export const userService = {
    getMe,
};