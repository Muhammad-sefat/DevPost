import axios from "axios";

export class OpenRouterClient {
  async generateSuggestions(prompt: string): Promise<Array<{ title: string; content: string }>> {
    const apiKey = process.env.OPENROUTER_API_KEY || "";
    const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash:free";

    if (!apiKey) {
      console.warn("OPENROUTER_API_KEY is not configured. Returning fallback mock suggestions.");
      return this.getFallbackSuggestions();
    }

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: model,
          messages: [
            {
              role: "system",
              content: "You are a JSON generator. You must return only a valid JSON array of suggestions and nothing else. Do not wrap in markdown tags."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://devpost.app",
            "X-Title": "DevPost App"
          }
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
      if (Array.isArray(suggestions)) {
        return suggestions;
      }
      return this.getFallbackSuggestions();
    } catch (e: any) {
      console.error("OpenRouter API error:", e.response?.data || e.message);
      return this.getFallbackSuggestions();
    }
  }

  private getFallbackSuggestions() {
    return [
      {
        "title": "Refactoring & Clean Code",
        "content": "Today was all about refactoring. Cleared up some legacy handlers and streamlined our routing system. Less code is always more code. What's your rule of thumb for refactoring?"
      },
      {
        "title": "Prisma Schema Updates",
        "content": "Pushed a database schema change today to track rich commit diff metadata. Prisma makes schema syncs so straightforward. Ready to plug in OpenRouter next!"
      },
      {
        "title": "Dashboard Structure",
        "content": "Spent the afternoon modifying our dashboard folder structure to align with cleaner modular patterns. Clean codebase, clean mind."
      },
      {
        "title": "GDPR Compliance Work",
        "content": "Spent the day focusing on privacy! Worked on the business profile delete account request workflow to align with GDPR guidelines. Important backend safety checks."
      }
    ];
  }
}

export const openRouterClient = new OpenRouterClient();
