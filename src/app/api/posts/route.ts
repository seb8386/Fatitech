import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = db
    .select()
    .from(posts)
    .where(eq(posts.userId, user.id))
    .orderBy(desc(posts.createdAt))
    .$dynamic();

  if (status) {
    query = query.where(eq(posts.status, status as "draft" | "scheduled" | "published" | "failed" | "cancelled"));
  }

  const result = await query.limit(50);
  return NextResponse.json({ posts: result });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { content, title, hashtags, postType, status, scheduledAt, socialAccountId } = body;

  if (!content) {
    return NextResponse.json({ error: "Le contenu est requis" }, { status: 400 });
  }

  const [post] = await db
    .insert(posts)
    .values({
      userId: user.id,
      socialAccountId: socialAccountId ?? null,
      title: title ?? null,
      content,
      hashtags: hashtags ?? [],
      postType: postType ?? "text",
      status: status ?? "draft",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    })
    .returning();

  return NextResponse.json({ post }, { status: 201 });
}
