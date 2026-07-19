import { app } from "./app";
import { prisma } from "@/config/db";
import { ENV } from "./config/env";

async function startServer() {
  await prisma.$connect();
  console.log("✅ Database connected");

  const server = app.listen(ENV.PORT, () => {
    console.log(`🚀 API running on http://localhost:${ENV.PORT}`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log("🔌 Database disconnected. Goodbye!");
      process.exit(0);
    });

    setTimeout(() => {
      console.error("💥 Forced exit after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

process.on("unhandledRejection", (reason: unknown) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
