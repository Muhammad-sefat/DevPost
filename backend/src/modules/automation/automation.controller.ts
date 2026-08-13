import { Request, Response } from "express";
import { catchAsync } from "@/utils/catch-async";
import { automationService } from "./automation.service";
import { ApiError } from "@/utils/api-error";

const triggerDailyJob = catchAsync(async (req: Request, res: Response) => {
  const secret = req.headers["x-cron-secret"] || req.query.secret;
  const configuredSecret = process.env.CRON_SECRET || "devpost-cron-secret";

  if (secret !== configuredSecret) {
    throw new ApiError(403, "Forbidden: Invalid cron secret");
  }

  // Get current UTC hour in HH:MM format (rounded to nearest 30 mins, matching timeOptions)
  const now = new Date();
  const minutes = now.getUTCMinutes();
  const roundedMinutes = minutes < 15 ? "00" : minutes < 45 ? "30" : "00";
  
  // Adjust hour if rounded up to next hour
  let hours = now.getUTCHours();
  if (minutes >= 45) {
    hours = (hours + 1) % 24;
  }
  
  const utcTimeStr = `${String(hours).padStart(2, "0")}:${roundedMinutes}`;
  
  console.log(`⏰ Webhook triggered for UTC Time: ${utcTimeStr}`);

  // We can pass an optional query parameter "forceDate" to test suggestions generation for a specific day
  const forceDate = req.query.date as string; 
  const dateStr = forceDate || now.toISOString().split("T")[0];

  // We also run a background promise to process notifications so the webhook returns quickly
  automationService.runDailyWorkflowForTime(utcTimeStr, dateStr)
    .then((stats) => {
      console.log(`✅ Daily workflow successfully finished for time: ${utcTimeStr}. Stats: ${JSON.stringify(stats)}`);
    })
    .catch((err) => {
      console.error(`❌ Daily workflow failed for time: ${utcTimeStr}:`, err.message);
    });

  res.status(200).json({
    success: true,
    message: `Daily suggestions workflow initiated for time ${utcTimeStr} (UTC)`,
    date: dateStr,
  });
});

export const automationController = {
  triggerDailyJob,
};
