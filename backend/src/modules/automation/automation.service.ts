import { prisma } from "@/config/db";
import { suggestionsService } from "@/modules/suggestions/suggestions.service";
import { notificationsService } from "@/modules/notifications/notifications.service";

const runDailyWorkflowForTime = async (utcTimeStr: string, dateStr: string) => {
  console.log(`📡 Fetching notification schedules for time: ${utcTimeStr} (UTC), Date: ${dateStr}`);

  // Query notification settings matching the scheduled time
  const settings = await prisma.notificationSetting.findMany({
    where: {
      notifyTime: utcTimeStr,
    },
    include: {
      user: true,
    },
  });

  console.log(`👤 Found ${settings.length} users scheduled for ${utcTimeStr}`);

  let successCount = 0;
  let failCount = 0;

  for (const setting of settings) {
    try {
      console.log(`🔄 Syncing activity and generating suggestions for user ${setting.userId}...`);
      
      // 1. Force sync and regenerate suggestions
      await suggestionsService.getSuggestionsForDate(setting.userId, dateStr, true);

      console.log(`🔔 Sending suggestions notification for user ${setting.userId}...`);

      // 2. Send email/telegram notifications
      await notificationsService.sendSuggestionsReadyAlert({
        email: setting.email,
        telegramChatId: setting.telegramChatId,
        channel: setting.channel || "email",
        dateStr,
      });

      successCount++;
    } catch (error: any) {
      console.error(`❌ Failed daily workflow for user ${setting.userId}:`, error.message);
      failCount++;
    }
  }

  return {
    total: settings.length,
    success: successCount,
    failed: failCount,
  };
};

export const automationService = {
  runDailyWorkflowForTime,
};
export default automationService;
