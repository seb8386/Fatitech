import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { subscriptions, plans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ error: "Plan ID requis" }, { status: 400 });
    }

    // Get the plan details
    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, planId))
      .limit(1);

    if (!plan) {
      return NextResponse.json({ error: "Plan non trouvé" }, { status: 404 });
    }

    // Update user subscription
    await db
      .update(subscriptions)
      .set({
        planId: plan.id,
        plan: plan.name.toLowerCase().replace(" ", "_") as any,
        status: "active",
        maxSocialAccounts: plan.accountsLimit,
        maxPostsPerMonth: plan.postsLimit,
        aiCreditsPerMonth: plan.aiCreditsLimit,
        usedAiCredits: 0,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, user.id));

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      plan: {
        name: plan.name,
        priceUsd: plan.priceUsd,
        accountsLimit: plan.accountsLimit,
        postsLimit: plan.postsLimit,
        aiCreditsLimit: plan.aiCreditsLimit,
      },
    });
  } catch (error) {
    console.error("Change subscription error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
