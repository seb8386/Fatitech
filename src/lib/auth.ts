import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "prod-super-secret-jwt-key-ianovatech-2025";
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: "super_admin" | "admin" | "user";
  isActive: boolean;
  mustChangePassword: boolean;
  language: string | null;
  currency: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: Record<string, unknown>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_DURATION });
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || typeof payload.userId !== "string") return null;

    // Zero-downtime persistent session check in DB
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        role: users.role,
        isActive: users.isActive,
        mustChangePassword: users.mustChangePassword,
        language: users.language,
        currency: users.currency,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user || !user.isActive) return null;
    return user;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

export async function createSession(userId: string, ip?: string, userAgent?: string) {
  const token = signToken({ userId, createdAt: Date.now() });
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000);

  await db.insert(sessions).values({
    userId,
    token,
    ipAddress: ip ?? null,
    userAgent: userAgent ?? null,
    lastActiveAt: new Date(),
    expiresAt,
  });

  return { token, expiresAt };
}

export async function deleteSession(token: string) {
  try {
    await db.delete(sessions).where(eq(sessions.token, token));
  } catch (e) {
    console.error("deleteSession error:", e);
  }
}

export async function getUserById(id: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user ?? null;
}

export async function updateSessionActivity(token: string) {
  try {
    await db
      .update(sessions)
      .set({ lastActiveAt: new Date() })
      .where(eq(sessions.token, token));
  } catch (e) {
    console.error("updateSessionActivity error:", e);
  }
}
