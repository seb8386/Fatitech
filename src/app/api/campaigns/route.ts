import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const result = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.userId, user.id))
    .orderBy(desc(campaigns.createdAt));

  return NextResponse.json({ campaigns: result });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { name, platform, budget, objectives, startDate, endDate } = body;

  if (!name) {
    return NextResponse.json({ error: "Le nom de la campagne est requis" }, { status: 400 });
  }

  const [campaign] = await db
    .insert(campaigns)
    .values({
      userId: user.id,
      name,
      platform: platform ?? "tiktok",
      status: "active",
      budget: budget ? String(budget) : "100.00",
      budgetSpent: "0.00",
      objectives: objectives ?? "Notoriété",
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 86400 * 1000),
    })
    .returning();

  return NextResponse.json({ campaign }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { id, status } = body;

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const [updated] = await db
    .update(campaigns)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, user.id)))
    .returning();

  return NextResponse.json({ campaign: updated });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  await db
    .delete(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, user.id)));

  return NextResponse.json({ success: true });
}
