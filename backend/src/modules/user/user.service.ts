import { prisma } from "@/config/db";
import { ApiError } from "@/lib/api-error";

export const userService = {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) throw ApiError.notFound("User not found");
    return user;
  },

  // Admin-only: list all users. Pagination is stubbed here — wire up
  // ?page=&limit= once you're past the MVP stage.
  async listUsers() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  },
};
