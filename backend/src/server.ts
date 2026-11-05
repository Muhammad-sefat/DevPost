import { prisma } from "@/config/db";
import { app } from "./app";
import { ENV } from "./config/env";
import { startDailySuggestionJob } from "./jobs/daily-suggestion.job";

async function connectWithRetry(retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect();
      return;
    } catch (err: any) {
      if (attempt === retries) throw err;
      console.warn(
        `⏳ Database connection attempt ${attempt}/${retries} failed. Retrying in ${delayMs / 1000}s... (Neon database may be waking up from sleep)`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function startServer() {
  await connectWithRetry();
  console.log("✅ Database connected");
  startDailySuggestionJob();
  console.log("⏰ Daily 6 PM suggestion job scheduled");
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
