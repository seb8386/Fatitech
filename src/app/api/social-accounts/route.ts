import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const accounts = await db
    .select()
    .from(socialAccounts)
    .where(eq(socialAccounts.userId, user.id));

  return NextResponse.json({ accounts });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { platform, accountName, accountId, accountUrl, followersCount } = body;

  if (!platform || !accountName || !accountId) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const [account] = await db
    .insert(socialAccounts)
    .values({
      userId: user.id,
      platform,
      accountName,
      accountId,
      accountUrl: accountUrl ?? null,
      followersCount: followersCount ?? 0,
      isActive: true,
    })
    .returning();

  return NextResponse.json({ account }, { status: 201 });
}
