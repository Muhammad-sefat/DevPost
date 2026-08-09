import axios from "axios";
import { ENV } from "./env";

export class OpenRouterClient {
  async generateSuggestions(
    prompt: string
  ): Promise<Array<{ title: string; content: string }>> {
    if (!ENV.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured.");
    }

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: ENV.OPENROUTER_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a JSON generator. You must return only a valid JSON array of suggestions and nothing else. Do not wrap in markdown tags.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${ENV.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://devpost.app",
            "X-Title": "DevPost App",
          },
        }
      );

      const responseText = response.data?.choices?.[0]?.message?.content || "";

      // Clean up markdown block formatting if present
      let cleanJson = responseText.trim();
      if (cleanJson.startsWith("```json")) {
        cleanJson = cleanJson.substring(7);
      } else if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.substring(3);
      }
      if (cleanJson.endsWith("```")) {
        cleanJson = cleanJson.substring(0, cleanJson.length - 3);
      }

      const suggestions = JSON.parse(cleanJson.trim());
      if (!Array.isArray(suggestions) || suggestions.length === 0) {
        throw new Error("OpenRouter returned an invalid or empty response.");
      }
      return suggestions;
    } catch (error: any) {
      console.error("OpenRouter API error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message ||
          error.message ||
          "OpenRouter API error"
      );
    }
  }
}

export const openRouterClient = new OpenRouterClient();
