import { prisma } from "@/config/db";
import { githubClient } from "./github.client";
import { wakatimeClient } from "./wakatime.client";
import { ApiError } from "@/utils/api-error";

export class ConnectionsService {
  async getConnectionStatus(userId: string) {
    const [githubConn, wakatimeConn] = await Promise.all([
      prisma.githubConnection.findUnique({
        where: { userId },
      }),
      prisma.wakatimeConnection.findUnique({
        where: { userId },
      }),
    ]);

    return {
      github: {
        connected: !!githubConn,
        username: githubConn?.username || null,
        connectedAt: githubConn?.connectedAt || null,
      },
      wakatime: {
        connected: !!wakatimeConn,
        connectedAt: wakatimeConn?.connectedAt || null,
      },
    };
  }

  async connectGithub(userId: string, code: string) {
    // 1. Exchange code for access token
    let accessToken: string;
    try {
      accessToken = await githubClient.exchangeCodeForToken(code);
    } catch (error: any) {
      throw new ApiError(400, `GitHub OAuth exchange failed: ${error.message}`);
    }

    // 2. Fetch GitHub profile
    let profile: any;
    try {
      profile = await githubClient.getGithubUser(accessToken);
    } catch (error: any) {
      throw new ApiError(400, `Failed to retrieve GitHub profile: ${error.message}`);
    }

    const githubId = String(profile.id);
    const username = profile.login;

    if (!githubId || !username) {
      throw new ApiError(400, "Invalid GitHub profile response");
    }

    // 3. Upsert GitHub Connection
    const connection = await prisma.githubConnection.upsert({
      where: { userId },
      create: {
        userId,
        githubId,
        username,
        accessToken,
      },
      update: {
        githubId,
        username,
        accessToken,
      },
    });

    return connection;
  }

  async disconnectGithub(userId: string) {
    const existing = await prisma.githubConnection.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new ApiError(404, "GitHub connection not found");
    }

    await prisma.githubConnection.delete({
      where: { userId },
    });

    return { message: "GitHub connection disconnected successfully" };
  }

  async connectWakatime(userId: string, apiKey: string) {
    // 1. Validate API Key against WakaTime API
    try {
      const response = await wakatimeClient.getUserProfile(apiKey);
      if (!response || !response.data) {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      throw new ApiError(400, `WakaTime API key validation failed: ${error.message}`);
    }

    // 2. Upsert WakaTime Connection
    const connection = await prisma.wakatimeConnection.upsert({
      where: { userId },
      create: {
        userId,
        apiKey,
      },
      update: {
        apiKey,
      },
    });

    return connection;
  }

  async disconnectWakatime(userId: string) {
    const existing = await prisma.wakatimeConnection.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new ApiError(404, "WakaTime connection not found");
    }

    await prisma.wakatimeConnection.delete({
      where: { userId },
    });

    return { message: "WakaTime connection disconnected successfully" };
  }
}

export const connectionsService = new ConnectionsService();
