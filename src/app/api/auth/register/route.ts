import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, subscriptions, workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Check existing user
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        name: name ?? null,
        role: "user",
        isActive: true,
        isEmailVerified: false,
        language: "fr",
        currency: "USD",
      })
      .returning({ id: users.id, email: users.email, role: users.role });

    // Automatically create a default workspace for Multi-Tenant SaaS
    await db.insert(workspaces).values({
      ownerId: user.id,
      name: "Mon espace",
      slug: `workspace-${user.id.slice(0, 8)}`,
    });

    // Create free subscription for tenant
    await db.insert(subscriptions).values({
      userId: user.id,
      plan: "free",
      status: "active",
      maxSocialAccounts: 2,
      maxPostsPerMonth: 30,
      aiCreditsPerMonth: 50,
      usedAiCredits: 0,
    });

    const ip = req.headers.get("x-forwarded-for") ?? undefined;
    const userAgent = req.headers.get("user-agent") ?? undefined;
    const { token } = await createSession(user.id, ip, userAgent);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
