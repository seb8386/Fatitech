import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Get full user data
    const [userData] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        role: users.role,
        isActive: users.isActive,
        mustChangePassword: users.mustChangePassword,
        language: users.language,
        aiModel: users.aiModel,
        timezone: users.timezone,
        bio: users.bio,
        phone: users.phone,
        domain: users.domain,
        currency: users.currency,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    // Get subscription data
    const [subscription] = await db
      .select({
        id: subscriptions.id,
        plan: subscriptions.plan,
        status: subscriptions.status,
        maxSocialAccounts: subscriptions.maxSocialAccounts,
        maxPostsPerMonth: subscriptions.maxPostsPerMonth,
        aiCreditsPerMonth: subscriptions.aiCreditsPerMonth,
        usedAiCredits: subscriptions.usedAiCredits,
        currentPeriodStart: subscriptions.currentPeriodStart,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);

    return NextResponse.json({
      user: userData,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
