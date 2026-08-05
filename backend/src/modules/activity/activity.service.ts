import { prisma } from "@/config/db";
import { githubClient } from "@/modules/connections/github.client";
import { wakatimeClient } from "@/modules/connections/wakatime.client";

const getActivityForDate = async (userId: string, dateStr: string) => {
  // 1. Fetch user connections
  const [githubConn, wakatimeConn] = await Promise.all([
    prisma.githubConnection.findUnique({ where: { userId } }),
    prisma.wakatimeConnection.findUnique({ where: { userId } }),
  ]);

  let commitsCount = 0;
  let prsCount = 0;
  let repositories: string[] = [];

  // 2. Fetch GitHub data if connected
  if (githubConn) {
    try {
      const [commitsData, prsData, repos] = await Promise.all([
        githubClient.getTodayCommits(githubConn.accessToken, githubConn.username, dateStr),
        githubClient.getTodayPullRequests(githubConn.accessToken, githubConn.username, dateStr),
        githubClient.getRepositories(githubConn.accessToken),
      ]);

      commitsCount = commitsData.total_count || 0;
      prsCount = prsData.total_count || 0;

      if (Array.isArray(repos)) {
        repositories = repos
          .filter((r: any) => {
            const pushDate = r.pushed_at || r.updated_at;
            return pushDate && pushDate.startsWith(dateStr);
          })
          .map((r: any) => r.name);
      }
    } catch (error: any) {
      console.error("Error fetching GitHub data:", error.message);
    }
  }

  let codingMinutes = 0;
  let languages: Record<string, number> = {};

  // 3. Fetch WakaTime data if connected
  if (wakatimeConn) {
    try {
      const summary = await wakatimeClient.getTodaySummary(wakatimeConn.apiKey, dateStr);
      const dayData = summary?.data?.[0];
      if (dayData) {
        codingMinutes = Math.round((dayData.grand_total?.total_seconds || 0) / 60);
        if (Array.isArray(dayData.languages)) {
          dayData.languages.forEach((lang: any) => {
            languages[lang.name] = Math.round((lang.total_seconds || 0) / 60);
          });
        }
      }
    } catch (error: any) {
      console.error("Error fetching WakaTime data:", error.message);
    }
  }

  // 4. Save to Database
  const targetDate = new Date(`${dateStr}T00:00:00.000Z`);
  const activity = await prisma.dailyActivity.upsert({
    where: {
      userId_date: {
        userId,
        date: targetDate,
      },
    },
    update: {
      commits: commitsCount,
      pullRequests: prsCount,
      codingMinutes,
      languages,
      repositories,
    },
    create: {
      userId,
      date: targetDate,
      commits: commitsCount,
      pullRequests: prsCount,
      codingMinutes,
      languages,
      repositories,
      hourlyPulse: {},
    },
  });

  // 5. Return formatted response
  return {
    commits: activity.commits,
    pullRequests: activity.pullRequests,
    codingMinutes: activity.codingMinutes,
    repositories: activity.repositories as string[],
    languages: activity.languages as Record<string, number>,
  };
};

const getMonthlyActivity = async (userId: string, year: number, month: number) => {
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  const activities = await prisma.dailyActivity.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return activities.map((activity) => ({
    id: activity.id,
    date: activity.date,
    commits: activity.commits,
    pullRequests: activity.pullRequests,
    codingMinutes: activity.codingMinutes,
    repositories: activity.repositories as string[],
    languages: activity.languages as Record<string, number>,
  }));
};

export const activityService = {
  getActivityForDate,
  getMonthlyActivity,
};
