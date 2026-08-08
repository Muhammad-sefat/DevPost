import { prisma } from "@/config/db";
import { activityService } from "@/modules/activity/activity.service";
import { openRouterClient } from "@/modules/ai/openrouter.client";
import { promptService } from "@/modules/ai/prompt.service";

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
    const syncedActivity = await activityService.getActivityForDate(userId, dateStr);
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

  // 3. If regenerating, delete existing suggestions first
  if (existingSuggestions.length > 0 && regenerate) {
    await prisma.postSuggestion.deleteMany({
      where: {
        activityId: activity.id,
      },
    });
  }

  // 4. Generate suggestion prompt using today's activity stats
  const prompt = promptService.buildSuggestionPrompt(activity);

  // 5. Query OpenRouter
  const aiSuggestions = await openRouterClient.generateSuggestions(prompt);

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
