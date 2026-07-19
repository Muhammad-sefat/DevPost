import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { routes } from "@/routes";
import { ENV } from "./config/env";

export const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (ENV.NODE_ENV === "development") app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/v1", routes);

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "API is running 🚀",
    });
});
