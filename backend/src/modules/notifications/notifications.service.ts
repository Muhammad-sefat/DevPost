import { emailService } from "./email.service";
import axios from "axios";
import { ENV } from "@/config/env";

interface SuggestionAlertData {
  email: string;
  telegramChatId?: string | null;
  channel: string; // "email" | "telegram" | "both"
  dateStr: string;
}

const sendSuggestionsReadyAlert = async (data: SuggestionAlertData) => {
  const clientUrl = ENV.CLIENT_URL || "http://localhost:3000";
  const liveLink = `${clientUrl}/dashboard`;
  const message = `🚀 DevPost Alert: Your LinkedIn post suggestions for today (${data.dateStr}) are ready!\n\nChoose one, refine it, and post it to LinkedIn:\n👉 ${liveLink}`;

  const errors: string[] = [];

  // 1. Email Notification
  const shouldSendEmail = data.channel.toLowerCase() === "email" || data.channel.toLowerCase() === "both";
  if (shouldSendEmail && data.email) {
    try {
      await emailService.sendMail({
        to: data.email,
        subject: `Your LinkedIn Post suggestions for ${data.dateStr} are ready! 🚀`,
        text: message,
        html: `
          <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <h2 style="font-size: 20px; font-weight: bold; color: #0f172a; margin-bottom: 8px;">Your LinkedIn Posts are Ready! 🚀</h2>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
              We synchronized your activity and generated 4-5 post suggestions for you today (${data.dateStr}).
            </p>
            <div style="margin-bottom: 24px;">
              <a href="${liveLink}" style="background-color: #6366f1; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; display: inline-block; font-size: 14px; font-weight: 600; box-shadow: 0 2px 4px rgba(99, 102, 241, 0.25);">
                View Suggestions on Dashboard
              </a>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
              You received this email because you enabled DevPost notifications. You can change your preferences in the settings dashboard.
            </p>
          </div>
        `,
      });
      console.log(`✉️ Email notification sent to ${data.email}`);
    } catch (err: any) {
      console.error(`❌ Email notification failed for ${data.email}:`, err.message);
      errors.push(`Email error: ${err.message}`);
    }
  }

  // 2. Telegram Notification
  const shouldSendTelegram = data.channel.toLowerCase() === "telegram" || data.channel.toLowerCase() === "both";
  if (shouldSendTelegram && data.telegramChatId) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.warn("⚠️ TELEGRAM_BOT_TOKEN is not configured in environment variables.");
      errors.push("Telegram error: TELEGRAM_BOT_TOKEN not configured");
    } else {
      try {
        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          chat_id: data.telegramChatId,
          text: message,
        });
        console.log(`🤖 Telegram message sent to chat ID ${data.telegramChatId}`);
      } catch (err: any) {
        console.error(`❌ Telegram message failed for chat ID ${data.telegramChatId}:`, err.response?.data || err.message);
        errors.push(`Telegram error: ${err.message}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Notification errors: ${errors.join("; ")}`);
  }
};

export const notificationsService = {
  sendSuggestionsReadyAlert,
};
export default notificationsService;
