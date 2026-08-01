import axios from "axios";
import { ENV } from "@/config/env";

export class GithubClient {
  async exchangeCodeForToken(code: string): Promise<string> {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: ENV.GITHUB_CLIENT_ID,
        client_secret: ENV.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = response.data.access_token;
    if (!accessToken) {
      throw new Error(response.data.error_description || "GitHub authentication failed");
    }
    return accessToken;
  }

  async getGithubUser(accessToken: string) {
    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    return response.data;
  }

  async getEmails(accessToken: string) {
    const response = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    return response.data;
  }

  async getRepositories(accessToken: string) {
    const response = await axios.get("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    return response.data;
  }

  async getCommits(accessToken: string, owner: string, repo: string) {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    return response.data;
  }

  async getPullRequests(accessToken: string, owner: string, repo: string) {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    return response.data;
  }
}

export const githubClient = new GithubClient();
