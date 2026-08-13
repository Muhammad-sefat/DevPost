import axios from "axios";
import { ENV } from "./env";

export interface LinkedInSuggestion {
  title: string;
  content: string;
}

export class OpenRouterClient {
  async generateSuggestions(prompt: string): Promise<LinkedInSuggestion[]> {
    if (!ENV.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured.");
    }

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openrouter/free",

          messages: [
            {
              role: "system",
              content: `
You are a professional LinkedIn content writer.

Generate engaging, professional LinkedIn posts.

Rules:
- Write naturally.
- Do not sound robotic.
- Do not invent facts.
- Keep posts suitable for LinkedIn.
- Include a strong opening hook.
- Use short paragraphs.
- Use relevant hashtags.
- Return only the requested structured data.
              `.trim(),
            },
            {
              role: "user",
              content: prompt,
            },
          ],

          response_format: {
            type: "json_schema",
            json_schema: {
              name: "linkedin_suggestions",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: {
                          type: "string",
                        },
                        content: {
                          type: "string",
                        },
                      },
                      required: ["title", "content"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["suggestions"],
                additionalProperties: false,
              },
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${ENV.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://devpost.app",
            "X-Title": "DevPost App",
          },
        },
      );

      const content = response.data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("OpenRouter returned an empty response.");
      }

      const parsed = JSON.parse(content);

      if (
        !parsed.suggestions ||
        !Array.isArray(parsed.suggestions) ||
        parsed.suggestions.length === 0
      ) {
        throw new Error(
          "OpenRouter returned an invalid or empty suggestions response.",
        );
      }

      return parsed.suggestions;
    } catch (error: any) {
      console.error(
        "OpenRouter API error:",
        error.response?.data || error.message,
      );

      throw new Error(
        error.response?.data?.error?.message ||
          error.message ||
          "OpenRouter API error",
      );
    }
  }
}

export const openRouterClient = new OpenRouterClient();
