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
}

export const wakatimeClient = new WakatimeClient();
