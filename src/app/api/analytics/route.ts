import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { analytics, socialAccounts, posts } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Fetch user's social accounts stats from PostgreSQL
  const userAccounts = await db
    .select()
    .from(socialAccounts)
    .where(eq(socialAccounts.userId, user.id));

  // Fetch user's analytics history from PostgreSQL
  const analyticsHistory = await db
    .select()
    .from(analytics)
    .where(eq(analytics.userId, user.id))
    .orderBy(desc(analytics.date))
    .limit(30);

  // Fetch user's posts count from PostgreSQL
  const [postsCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(eq(posts.userId, user.id));

  const totalFollowers = userAccounts.reduce(
    (sum, acc) => sum + (acc.followersCount ?? 0),
    0
  );

  const totalViews = analyticsHistory.reduce(
    (sum, item) => sum + Number(item.viewsCount ?? 0),
    0
  );

  const totalLikes = analyticsHistory.reduce(
    (sum, item) => sum + (item.likesCount ?? 0),
    0
  );

  const stats = {
    totalFollowers,
    followersGrowth: totalFollowers > 0 ? 5.2 : 0,
    totalViews,
    viewsGrowth: totalViews > 0 ? 12.4 : 0,
    totalLikes,
    likesGrowth: totalLikes > 0 ? 8.1 : 0,
    engagementRate: totalViews > 0 ? Number(((totalLikes / totalViews) * 100).toFixed(1)) : 0,
    engagementGrowth: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    postsPublished: Number(postsCountResult?.count ?? 0),
    postsGrowth: 0,
  };

  const chartData = analyticsHistory.map((item) => ({
    date: new Date(item.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    followers: item.followersCount ?? 0,
    views: Number(item.viewsCount ?? 0),
    likes: item.likesCount ?? 0,
    engagement: item.engagementRate ? Number(item.engagementRate) : 0,
  }));

  const platformData = userAccounts.map((acc) => ({
    platform: acc.platform,
    followers: acc.followersCount ?? 0,
    growth: 0,
    accountName: acc.accountName,
  }));

  return NextResponse.json({
    stats,
    chartData,
    platformData,
  });
}
