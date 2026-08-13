import { prisma } from "@/config/db";

interface SavePostInput {
  userId: string;
  title: string;
  content: string;
  suggestionId?: string;
}

const saveFinalPost = async (input: SavePostInput) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayDate = new Date(`${todayStr}T00:00:00.000Z`);
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  // Check if a post was already recorded today
  const existingPost = await prisma.post.findFirst({
    where: {
      userId: input.userId,
      createdAt: {
        gte: todayDate,
        lt: tomorrowDate,
      },
    },
  });

  if (existingPost) {
    // Update existing post
    return prisma.post.update({
      where: { id: existingPost.id },
      data: {
        title: input.title,
        content: input.content,
        suggestionId: input.suggestionId || null,
        postedAt: new Date(),
        status: "PUBLISHED",
      },
    });
  }

  // Create new post log
  return prisma.post.create({
    data: {
      userId: input.userId,
      title: input.title,
      content: input.content,
      suggestionId: input.suggestionId || null,
      postedAt: new Date(),
      status: "PUBLISHED",
    },
  });
};

const getPostHistory = async (userId: string) => {
  return prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

const getPostStreaks = async (userId: string) => {
  const posts = await prisma.post.findMany({
    where: {
      userId,
      status: "PUBLISHED",
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate streak based on UTC dates
  const dates = posts.map((p) => p.createdAt.toISOString().split("T")[0]);
  const uniqueDates = Array.from(new Set(dates)); // list of unique YYYY-MM-DD strings in descending order

  if (uniqueDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalPosts: 0,
    };
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // If the user hasn't posted today or yesterday, their active streak is 0
  let currentStreak = 0;
  const hasPostedTodayOrYesterday = uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr);

  if (hasPostedTodayOrYesterday) {
    let checkDate = uniqueDates.includes(todayStr) ? new Date(todayStr) : new Date(yesterdayStr);
    while (true) {
      const checkStr = checkDate.toISOString().split("T")[0];
      if (uniqueDates.includes(checkStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak in history
  let longestStreak = 0;
  let runningStreak = 0;
  
  // To calculate longest streak, we sort dates ascending
  const sortedUniqueDates = uniqueDates.map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
  
  if (sortedUniqueDates.length > 0) {
    runningStreak = 1;
    longestStreak = 1;
    
    for (let i = 1; i < sortedUniqueDates.length; i++) {
      const prevDate = sortedUniqueDates[i - 1];
      const currDate = sortedUniqueDates[i];
      
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
      
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    }
  }

  // If currentStreak is higher than longestStreak (e.g. edge cases), sync them
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    currentStreak,
    longestStreak,
    totalPosts: uniqueDates.length,
  };
};

export const postsService = {
  saveFinalPost,
  getPostHistory,
  getPostStreaks,
};
export default postsService;
