"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users, sessions, auditLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return { error: "Non autorisé" };
  }

  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        mustChangePassword: users.mustChangePassword,
        language: users.language,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return { users: allUsers };
  } catch (error) {
    console.error("Get users error:", error);
    return { error: "Erreur lors de la récupération des utilisateurs" };
  }
}

export async function getUserSessions(userId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return [];
  }

  try {
    const userSessions = await db
      .select({
        id: sessions.id,
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
        lastActiveAt: sessions.lastActiveAt,
        createdAt: sessions.createdAt,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.lastActiveAt));

    return userSessions;
  } catch (error) {
    console.error("Get user sessions error:", error);
    return [];
  }
}

export async function toggleUserStatus(userId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return { error: "Non autorisé" };
  }

  try {
    // Get current user status
    const [targetUser] = await db
      .select({ isActive: users.isActive })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!targetUser) {
      return { error: "Utilisateur non trouvé" };
    }

    // Toggle status
    const newStatus = !targetUser.isActive;
    await db
      .update(users)
      .set({ 
        isActive: newStatus,
        suspendedAt: newStatus ? null : new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // If blocking user, revoke all their sessions
    if (!newStatus) {
      await db.delete(sessions).where(eq(sessions.userId, userId));
    }

    // Log the action
    await db.insert(auditLogs).values({
      actorId: user.id,
      action: newStatus ? "user_unblocked" : "user_blocked",
      targetId: userId,
      details: { 
        targetEmail: userId,
        action: newStatus ? "unblocked" : "blocked",
        actorEmail: user.email,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, isActive: newStatus };
  } catch (error) {
    console.error("Toggle user status error:", error);
    return { error: "Erreur lors de la modification du statut" };
  }
}

export async function resetUserPassword(userId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return { error: "Non autorisé" };
  }

  try {
    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + 
                        Math.random().toString(36).slice(-4).toUpperCase();
    
    const passwordHash = await hashPassword(tempPassword);

    // Update user password and force change
    await db
      .update(users)
      .set({ 
        passwordHash,
        mustChangePassword: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Revoke all sessions for security
    await db.delete(sessions).where(eq(sessions.userId, userId));

    // Log the action
    await db.insert(auditLogs).values({
      actorId: user.id,
      action: "password_reset",
      targetId: userId,
      details: { 
        actorEmail: user.email,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, tempPassword };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "Erreur lors de la réinitialisation du mot de passe" };
  }
}

export async function getAuditLogs(limit = 50) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return [];
  }

  try {
    const logs = await db
      .select({
        id: auditLogs.id,
        actorId: auditLogs.actorId,
        action: auditLogs.action,
        targetId: auditLogs.targetId,
        details: auditLogs.details,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);

    return logs;
  } catch (error) {
    console.error("Get audit logs error:", error);
    return [];
  }
}
