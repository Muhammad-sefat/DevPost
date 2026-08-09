import { prisma } from "@/config/db";
import { activityService } from "@/modules/activity/activity.service";
import { openRouterClient } from "@/config/openrouter.client";
import { promptService } from "@/config/prompt.service";

const getSuggestionsForDate = async (userId: string, dateStr: string, regenerate = false) => {
  const targetDate = new Date(`${dateStr}T00:00:00.000Z`);

  // 1. Find or sync today's DailyActivity record
  let activity = await prisma.dailyActivity.findUnique({
    where: {
      userId_date: {
        userId,
        date: targetDate,
      },
    },
  });

  if (!activity) {
    // If no activity is stored yet, trigger sync to create it
    await activityService.getActivityForDate(userId, dateStr);
    activity = await prisma.dailyActivity.findUnique({
      where: {
        userId_date: {
          userId,
          date: targetDate,
        },
      },
    });
  }

  if (!activity) {
    throw new Error("Failed to find or synchronize today's developer activity.");
  }

  // 2. Check if suggestions already exist
  const existingSuggestions = await prisma.postSuggestion.findMany({
    where: {
      activityId: activity.id,
    },
    orderBy: {
      order: "asc",
    },
  });

  if (existingSuggestions.length > 0 && !regenerate) {
    return existingSuggestions;
  }

  // 3. Generate suggestion prompt using today's activity stats
  const prompt = promptService.buildSuggestionPrompt(activity);

  // 4. Query OpenRouter (throws on failure so existing suggestions are kept)
  const aiSuggestions = await openRouterClient.generateSuggestions(prompt);

  // 5. Delete old suggestions only after new ones are successfully generated
  if (existingSuggestions.length > 0 && regenerate) {
    await prisma.postSuggestion.deleteMany({
      where: {
        activityId: activity.id,
      },
    });
  }

  // 6. Save new suggestions to the database
  const createdSuggestions = await Promise.all(
    aiSuggestions.map((s, index) =>
      prisma.postSuggestion.create({
        data: {
          activityId: activity!.id,
          order: index,
          title: s.title,
          content: s.content,
        },
      })
    )
  );

  return createdSuggestions;
};

export const suggestionsService = {
  getSuggestionsForDate,
};
