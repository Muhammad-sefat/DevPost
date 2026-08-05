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

  async getTodayCommits(accessToken: string, username: string, dateStr: string) {
    const response = await axios.get(
      `https://api.github.com/search/commits?q=author:${username}+committer-date:>=${dateStr}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.cloak-preview+json",
        },
      }
    );
    return response.data;
  }

  async getTodayPullRequests(accessToken: string, username: string, dateStr: string) {
    const response = await axios.get(
      `https://api.github.com/search/issues?q=author:${username}+type:pr+created:>=${dateStr}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    return response.data;
  }

  async getContributionCalendar(accessToken: string, username: string) {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;
    const response = await axios.post(
      "https://api.github.com/graphql",
      {
        query,
        variables: { username },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "User-Agent": "DevPost-App",
        },
      }
    );
    return response.data;
  }
}

export const githubClient = new GithubClient();
