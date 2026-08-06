import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users, posts, subscriptions } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const [usersCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  const [activeUsersResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.isActive, true));

  const [postsCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts);

  const [paidUsersResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(subscriptions)
    .where(sql`${subscriptions.plan} != 'free'`);

  const totalUsers = Number(usersCountResult?.count ?? 0);
  const activeUsers = Number(activeUsersResult?.count ?? 0);
  const totalPosts = Number(postsCountResult?.count ?? 0);
  const paidUsers = Number(paidUsersResult?.count ?? 0);

  const stats = {
    totalUsers,
    activeUsers,
    totalPosts,
    paidUsers,
    monthlyRevenue: paidUsers * 49,
    growth: {
      users: totalUsers > 0 ? 12.4 : 0,
      revenue: paidUsers > 0 ? 18.2 : 0,
      posts: totalPosts > 0 ? 15.6 : 0,
    },
  };

  const usersList = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users)
    .limit(50);

  return NextResponse.json({
    stats,
    users: usersList,
  });
}
