import { PrismaClient } from "@prisma/client";

// Singleton pattern: prevents multiple PrismaClient instances during
// dev hot-reload, which otherwise exhausts your DB connection pool.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (env_is_dev()) global.prisma = prisma;

function env_is_dev() {
  return process.env.NODE_ENV !== "production";
}
