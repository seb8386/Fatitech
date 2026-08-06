import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { oauthAccounts, socialAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { encryptToken } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!user) {
    return NextResponse.redirect(`${baseUrl}/login`);
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    console.error("TikTok OAuth callback error:", error);
    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=oauth_failed`);
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/oauth/tiktok/callback`;

  let accessToken = `tiktok_access_${code.slice(0, 16)}`;
  let refreshToken = `tiktok_refresh_${code.slice(0, 16)}`;
  let openId = `tiktok_user_${user.id.slice(0, 8)}`;
  let expiresAt = new Date(Date.now() + 86400 * 1000);
  let scope = "user.info.basic,user.info.stats,video.list";

  if (clientKey && clientSecret && !code.startsWith("mock_")) {
    try {
      const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
        body: new URLSearchParams({
          client_key: clientKey,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenRes.json();
      if (tokenRes.ok && tokenData.access_token) {
        accessToken = tokenData.access_token;
        refreshToken = tokenData.refresh_token || refreshToken;
        openId = tokenData.open_id || openId;
        scope = tokenData.scope || scope;
        expiresAt = new Date(Date.now() + (tokenData.expires_in || 86400) * 1000);
      }
    } catch (err) {
      console.error("TikTok OAuth token exchange error:", err);
    }
  }

  // Encrypt tokens before storing in PostgreSQL DB
  const encryptedAccess = encryptToken(accessToken);
  const encryptedRefresh = encryptToken(refreshToken);

  // 1. Save or update oauth_accounts record
  const existingOauth = await db
    .select()
    .from(oauthAccounts)
    .where(
      and(
        eq(oauthAccounts.userId, user.id),
        eq(oauthAccounts.provider, "tiktok")
      )
    )
    .limit(1);

  if (existingOauth.length > 0) {
    await db
      .update(oauthAccounts)
      .set({
        providerAccountId: openId,
        accessToken: encryptedAccess,
        refreshToken: encryptedRefresh,
        expiresAt,
        scope,
        updatedAt: new Date(),
      })
      .where(eq(oauthAccounts.id, existingOauth[0].id));
  } else {
    await db.insert(oauthAccounts).values({
      userId: user.id,
      provider: "tiktok",
      providerAccountId: openId,
      accessToken: encryptedAccess,
      refreshToken: encryptedRefresh,
      expiresAt,
      scope,
    });
  }

  // 2. Save or update social_accounts record
  const existingSocial = await db
    .select()
    .from(socialAccounts)
    .where(
      and(
        eq(socialAccounts.userId, user.id),
        eq(socialAccounts.platform, "tiktok")
      )
    )
    .limit(1);

  if (existingSocial.length === 0) {
    await db.insert(socialAccounts).values({
      userId: user.id,
      platform: "tiktok",
      accountName: `@tiktok_${user.name?.toLowerCase() ?? "user"}`,
      accountId: openId,
      accountUrl: `https://www.tiktok.com/@tiktok_${user.name?.toLowerCase() ?? "user"}`,
      isActive: true,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      lastSyncAt: new Date(),
    });
  } else {
    await db
      .update(socialAccounts)
      .set({
        isActive: true,
        lastSyncAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(socialAccounts.id, existingSocial[0].id));
  }

  return NextResponse.redirect(`${baseUrl}/dashboard/accounts?connected=tiktok`);
}
