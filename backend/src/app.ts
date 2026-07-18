import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { corsOptions } from "@/config/cors";
import { routes } from "@/routes";
import { errorHandler, notFoundHandler } from "@/middlewares/error-handler.middleware";
import { env } from "@/config/env";

export const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (env.NODE_ENV === "development") app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/v1", routes);

// Order matters: notFoundHandler catches unmatched routes,
// errorHandler MUST be registered last so Express treats it as the
// error-handling middleware (it recognizes it by the 4-argument signature).
app.use(notFoundHandler);
app.use(errorHandler);
