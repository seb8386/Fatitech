import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contentCalendar, posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const calendarEvents = await db
    .select()
    .from(contentCalendar)
    .where(eq(contentCalendar.userId, user.id))
    .orderBy(desc(contentCalendar.scheduledAt));

  const scheduledPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.userId, user.id))
    .orderBy(desc(posts.scheduledAt));

  return NextResponse.json({
    calendar: calendarEvents,
    posts: scheduledPosts,
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { title, description, platform, scheduledAt, color } = body;

  if (!title || !scheduledAt) {
    return NextResponse.json({ error: "Titre et date requis" }, { status: 400 });
  }

  const [entry] = await db
    .insert(contentCalendar)
    .values({
      userId: user.id,
      title,
      description: description ?? null,
      platform: platform ?? "tiktok",
      scheduledAt: new Date(scheduledAt),
      color: color ?? "#7c3aed",
    })
    .returning();

  return NextResponse.json({ calendar: entry }, { status: 201 });
}
