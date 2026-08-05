import { PrismaClient } from "@/generated/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClient = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prismaClient;
}

export const prisma = prismaClient;
