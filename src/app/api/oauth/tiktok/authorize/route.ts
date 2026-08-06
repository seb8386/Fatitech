import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/oauth/tiktok/callback`;
  const scope = "user.info.basic,user.info.stats,video.list";
  const state = `user_${user.id}_${Date.now()}`;

  if (!clientKey) {
    // Return direct authorization URL placeholder or callback simulation URL if client key is missing
    const mockAuthUrl = `${redirectUri}?code=mock_tiktok_code_${user.id}&state=${state}`;
    return NextResponse.redirect(mockAuthUrl);
  }

  const tiktokUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  tiktokUrl.searchParams.append("client_key", clientKey);
  tiktokUrl.searchParams.append("response_type", "code");
  tiktokUrl.searchParams.append("scope", scope);
  tiktokUrl.searchParams.append("redirect_uri", redirectUri);
  tiktokUrl.searchParams.append("state", state);

  return NextResponse.redirect(tiktokUrl.toString());
}
