import cron from "node-cron";
import { prisma } from "@/config/db";
import { suggestionsService } from "@/modules/suggestions/suggestions.service";

const getTodayDateStr = () => new Date().toISOString().split("T")[0];

const runDailySuggestions = async () => {
  const dateStr = getTodayDateStr();
  console.log(`⏰ [${dateStr}] Running daily 6 PM suggestion generation...`);

  try {
    // Only users with at least one connected source (GitHub or WakaTime)
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { githubConnection: { isNot: null } },
          { wakatimeConnection: { isNot: null } },
        ],
      },
      select: { id: true },
    });

    let successCount = 0;
    for (const user of users) {
      try {
        // regenerate=true forces a fresh sync + fresh AI generation every day at 6 PM
        await suggestionsService.getSuggestionsForDate(user.id, dateStr, true);
        successCount++;
      } catch (error: any) {
        console.error(
          `❌ Failed to generate suggestions for user ${user.id}:`,
          error.message
        );
      }
    }
    console.log(
      `📊 Daily suggestion job finished: ${successCount}/${users.length} users succeeded.`
    );
  } catch (error: any) {
    console.error("❌ Daily suggestion job failed:", error.message);
  }
};

export const startDailySuggestionJob = () => {
  // Runs every day at 18:00 (6:00 PM) UTC.
  // The whole app (activity sync + suggestions) works in UTC dates, so pinning the
  // job to UTC keeps the date consistent and runs after the full UTC day has ended.
  // Change the timezone below if you want to run at a specific local time instead.
  cron.schedule("0 18 * * *", runDailySuggestions, { timezone: "UTC" });
};
