import { z } from "zod";

export const connectWakatimeSchema = z.object({
  apiKey: z.string({
    required_error: "API key is required",
  }).min(1, "API key cannot be empty"),
});

export const connectGithubSchema = z.object({
  code: z.string({
    required_error: "OAuth authorization code is required",
  }).min(1, "OAuth authorization code cannot be empty"),
});
