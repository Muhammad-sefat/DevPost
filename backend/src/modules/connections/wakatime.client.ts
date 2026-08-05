import axios from "axios";

export class WakatimeClient {
  async getUserProfile(apiKey: string) {
    const base64ApiKey = Buffer.from(apiKey).toString("base64");
    const response = await axios.get("https://wakatime.com/api/v1/users/current", {
      headers: {
        Authorization: `Basic ${base64ApiKey}`,
      },
    });
    return response.data;
  }

  async getStats(apiKey: string, range: string = "last_7_days") {
    const base64ApiKey = Buffer.from(apiKey).toString("base64");
    const response = await axios.get(`https://wakatime.com/api/v1/users/current/stats/${range}`, {
      headers: {
        Authorization: `Basic ${base64ApiKey}`,
      },
    });
    return response.data;
  }

  async getTodaySummary(apiKey: string, dateStr: string) {
    const base64ApiKey = Buffer.from(apiKey).toString("base64");
    const response = await axios.get(
      `https://wakatime.com/api/v1/users/current/summaries?start=${dateStr}&end=${dateStr}`,
      {
        headers: {
          Authorization: `Basic ${base64ApiKey}`,
        },
      }
    );
    return response.data;
  }

  async getLanguages(apiKey: string, dateStr: string) {
    const summary = await this.getTodaySummary(apiKey, dateStr);
    return summary?.data?.[0]?.languages || [];
  }

  async getCodingTime(apiKey: string, dateStr: string) {
    const summary = await this.getTodaySummary(apiKey, dateStr);
    return summary?.data?.[0]?.grand_total?.total_seconds || 0;
  }

  async getEditors(apiKey: string, dateStr: string) {
    const summary = await this.getTodaySummary(apiKey, dateStr);
    return summary?.data?.[0]?.editors || [];
  }

  async getOperatingSystems(apiKey: string, dateStr: string) {
    const summary = await this.getTodaySummary(apiKey, dateStr);
    return summary?.data?.[0]?.operating_systems || [];
  }
}

export const wakatimeClient = new WakatimeClient();
