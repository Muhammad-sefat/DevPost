import { app } from "./app";
import { env } from "@/config/env";
import { prisma } from "@/config/db";

async function startServer() {
  await prisma.$connect();
  console.log("✅ Database connected");

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 API running on http://localhost:${env.PORT}`);
  });

  // ----------------------------------------------------------------
  // Graceful shutdown — close DB connection & HTTP server, then exit.
  // This prevents dangling connections when you Ctrl+C or the process
  // receives a SIGTERM (e.g. from Docker/Kubernetes/dashboard host).
  // ----------------------------------------------------------------
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log("🔌 Database disconnected. Goodbye!");
      process.exit(0);
    });

    // Force exit if graceful shutdown takes longer than 10 seconds.
    setTimeout(() => {
      console.error("💥 Forced exit after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

// ----------------------------------------------------------------
// Process-level error handlers — catch what the Express error
// middleware can't (e.g. bugs outside request handlers).
// Without these, an unhandled promise rejection would crash
// the entire server silently.
// ----------------------------------------------------------------
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
