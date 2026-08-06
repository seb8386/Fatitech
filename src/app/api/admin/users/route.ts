import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { desc, ne } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "super_admin" && currentUser.role !== "admin")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt,
      adminId: users.adminId,
    })
    .from(users)
    .where(ne(users.role, "super_admin"))
    .orderBy(desc(users.createdAt));

  return NextResponse.json({ users: allUsers });
}

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "super_admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const { email, firstName, lastName, role } = body;

  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  const [user] = await db
    .insert(users)
    .values({
      email: email.toLowerCase(),
      firstName: firstName ?? null,
      lastName: lastName ?? null,
      role: role ?? "user",
      isActive: true,
    })
    .returning();

  await db.insert(subscriptions).values({
    userId: user.id,
    plan: "free",
    status: "active",
    maxSocialAccounts: 2,
    maxPostsPerMonth: 30,
    aiCreditsPerMonth: 50,
  });

  return NextResponse.json({ user }, { status: 201 });
}
