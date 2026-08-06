import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getValidAccessToken } from "@/lib/oauth";
import { db } from "@/db";
import { socialAccounts, analytics, posts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const validToken = await getValidAccessToken(user.id, "tiktok");
  if (!validToken) {
    return NextResponse.json(
      { error: "Aucun compte TikTok connecté ou jeton expiré. Veuillez reconnecter votre compte." },
      { status: 400 }
    );
  }

  let username = `@tiktok_${user.name?.toLowerCase() ?? "user"}`;
  let avatar = user.avatarUrl ?? null;
  let followerCount = 0;
  let followingCount = 0;
  let likesCount = 0;
  let videoCount = 0;
  let realVideos: Array<{ id: string; title: string; views: number; likes: number; comments: number }> = [];

  try {
    const userInfoRes = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,follower_count,following_count,likes_count,video_count", {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    if (userInfoRes.ok) {
      const userInfoData = await userInfoRes.json();
      const info = userInfoData.data?.user;
      if (info) {
        username = info.display_name ? `@${info.display_name.replace(/\s+/g, "_")}` : username;
        avatar = info.avatar_url || avatar;
        followerCount = info.follower_count || 0;
        followingCount = info.following_count || 0;
        likesCount = info.likes_count || 0;
        videoCount = info.video_count || 0;
      }
    }

    const videoListRes = await fetch("https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,view_count,like_count,comment_count,share_count,create_time", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${validToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ max_count: 10 }),
    });

    if (videoListRes.ok) {
      const videoListData = await videoListRes.json();
      const list = videoListData.data?.videos;
      if (Array.isArray(list)) {
        realVideos = list.map((v) => ({
          id: v.id,
          title: v.title || v.video_description || "Vidéo TikTok",
          views: v.view_count || 0,
          likes: v.like_count || 0,
          comments: v.comment_count || 0,
        }));
      }
    }
  } catch (err) {
    console.error("Failed to fetch real TikTok API metrics:", err);
  }

  // Update social accounts record in PostgreSQL
  const [socialAccount] = await db
    .select()
    .from(socialAccounts)
    .where(
      and(
        eq(socialAccounts.userId, user.id),
        eq(socialAccounts.platform, "tiktok")
      )
    )
    .limit(1);

  if (socialAccount) {
    await db
      .update(socialAccounts)
      .set({
        accountName: username,
        avatar,
        followersCount: followerCount,
        followingCount,
        postsCount: videoCount,
        lastSyncAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(socialAccounts.id, socialAccount.id));

    // Insert analytics snapshot record for user
    await db.insert(analytics).values({
      userId: user.id,
      socialAccountId: socialAccount.id,
      date: new Date(),
      followersCount: followerCount,
      followersGrowth: 0,
      viewsCount: realVideos.reduce((acc, v) => acc + v.views, 0),
      likesCount: likesCount || realVideos.reduce((acc, v) => acc + v.likes, 0),
      commentsCount: realVideos.reduce((acc, v) => acc + v.comments, 0),
      platform: "tiktok",
    });

    // Sync real posts into posts table
    for (const vid of realVideos) {
      const existingPost = await db
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.userId, user.id),
            eq(posts.externalPostId, vid.id)
          )
        )
        .limit(1);

      if (existingPost.length === 0) {
        await db.insert(posts).values({
          userId: user.id,
          socialAccountId: socialAccount.id,
          title: vid.title,
          content: vid.title,
          postType: "video",
          status: "published",
          publishedAt: new Date(),
          externalPostId: vid.id,
          viewsCount: vid.views,
          likesCount: vid.likes,
          commentsCount: vid.comments,
        });
      } else {
        await db
          .update(posts)
          .set({
            viewsCount: vid.views,
            likesCount: vid.likes,
            commentsCount: vid.comments,
            updatedAt: new Date(),
          })
          .where(eq(posts.id, existingPost[0].id));
      }
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      username,
      followerCount,
      followingCount,
      likesCount,
      videoCount,
      syncedVideos: realVideos.length,
    },
  });
}
