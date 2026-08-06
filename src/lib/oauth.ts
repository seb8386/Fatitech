import { db } from "@/db";
import { oauthAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { decryptToken, encryptToken } from "@/lib/crypto";

export async function getValidAccessToken(
  userId: string,
  provider: string
): Promise<string | null> {
  const [account] = await db
    .select()
    .from(oauthAccounts)
    .where(
      and(
        eq(oauthAccounts.userId, userId),
        eq(oauthAccounts.provider, provider)
      )
    )
    .limit(1);

  if (!account || !account.accessToken) {
    return null;
  }

  const decryptedAccessToken = decryptToken(account.accessToken);
  const decryptedRefreshToken = account.refreshToken
    ? decryptToken(account.refreshToken)
    : null;

  // Check if token is expired or expiring in next 5 minutes
  const now = new Date();
  const isExpired =
    account.expiresAt && account.expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;

  if (!isExpired) {
    return decryptedAccessToken;
  }

  // Token is expired: Attempt to refresh if we have a refresh token
  if (!decryptedRefreshToken) {
    console.warn(`[OAuth] Refresh token missing for user ${userId} provider ${provider}`);
    return decryptedAccessToken;
  }

  try {
    if (provider === "tiktok") {
      const clientKey = process.env.TIKTOK_CLIENT_KEY;
      const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

      if (!clientKey || !clientSecret) {
        console.warn("[OAuth] TIKTOK_CLIENT_KEY or TIKTOK_CLIENT_SECRET not configured.");
        return decryptedAccessToken;
      }

      const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
        body: new URLSearchParams({
          client_key: clientKey,
          client_secret: clientSecret,
          grant_type: "refresh_token",
          refresh_token: decryptedRefreshToken,
        }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        const newAccessToken = data.access_token;
        const newRefreshToken = data.refresh_token || decryptedRefreshToken;
        const expiresIn = data.expires_in || 86400;
        const newExpiresAt = new Date(Date.now() + expiresIn * 1000);

        await db
          .update(oauthAccounts)
          .set({
            accessToken: encryptToken(newAccessToken),
            refreshToken: encryptToken(newRefreshToken),
            expiresAt: newExpiresAt,
            updatedAt: new Date(),
          })
          .where(eq(oauthAccounts.id, account.id));

        return newAccessToken;
      } else {
        console.error("[OAuth] TikTok token refresh failed:", data);
        return decryptedAccessToken;
      }
    }
  } catch (error) {
    console.error("[OAuth] Token refresh error:", error);
  }

  return decryptedAccessToken;
}
