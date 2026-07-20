import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
}


export const ENV: EnvConfig = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT || "",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "",
};