import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const result = await db
    .select()
    .from(comments)
    .where(eq(comments.userId, user.id))
    .orderBy(desc(comments.createdAt));

  return NextResponse.json({ comments: result });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { postId, content, authorName, platform } = body;

  if (!content) {
    return NextResponse.json({ error: "Le contenu est requis" }, { status: 400 });
  }

  const [comment] = await db
    .insert(comments)
    .values({
      userId: user.id,
      postId: postId ?? user.id, // Fallback if general comment
      content,
      authorName: authorName ?? user.name ?? "Utilisateur",
      platform: platform ?? "tiktok",
    })
    .returning();

  return NextResponse.json({ comment }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { id, isHidden, isImportant, isSpam, aiResponse } = body;

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const [updated] = await db
    .update(comments)
    .set({
      ...(isHidden !== undefined && { isHidden }),
      ...(isImportant !== undefined && { isImportant }),
      ...(isSpam !== undefined && { isSpam }),
      ...(aiResponse !== undefined && { aiResponse, respondedAt: new Date() }),
    })
    .where(and(eq(comments.id, id), eq(comments.userId, user.id)))
    .returning();

  return NextResponse.json({ comment: updated });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  await db
    .delete(comments)
    .where(and(eq(comments.id, id), eq(comments.userId, user.id)));

  return NextResponse.json({ success: true });
}
