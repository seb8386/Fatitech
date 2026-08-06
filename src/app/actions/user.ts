"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Non authentifié" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;
  const timezone = formData.get("timezone") as string;
  const domain = formData.get("domain") as string;

  try {
    await db
      .update(users)
      .set({
        name: name || null,
        email: email?.toLowerCase() || user.email,
        phone: phone || null,
        bio: bio || null,
        timezone: timezone || "UTC",
        domain: domain || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Erreur lors de la mise à jour du profil" };
  }
}

export async function updatePreferences(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Non authentifié" };
  }

  const language = formData.get("language") as string;
  const aiModel = formData.get("aiModel") as string;
  const currency = formData.get("currency") as string;

  try {
    await db
      .update(users)
      .set({
        language: language || "fr",
        aiModel: aiModel || null,
        currency: currency || "USD",
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Preferences update error:", error);
    return { error: "Erreur lors de la mise à jour des préférences" };
  }
}

export async function changePassword(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Non authentifié" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Tous les champs sont requis" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas" };
  }

  if (newPassword.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères" };
  }

  try {
    // Get current user with password hash
    const [currentUser] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!currentUser || !currentUser.passwordHash) {
      return { error: "Utilisateur non trouvé" };
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, currentUser.passwordHash);
    if (!isValid) {
      return { error: "Mot de passe actuel incorrect" };
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        mustChangePassword: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Password change error:", error);
    return { error: "Erreur lors du changement de mot de passe" };
  }
}

export async function getActiveSessions() {
  const user = await getCurrentUser();
  if (!user) {
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
      .where(eq(sessions.userId, user.id))
      .orderBy(sessions.createdAt);

    return userSessions;
  } catch (error) {
    console.error("Get sessions error:", error);
    return [];
  }
}

export async function revokeSession(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Non authentifié" };
  }

  try {
    await db
      .delete(sessions)
      .where(eq(sessions.id, sessionId));

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Revoke session error:", error);
    return { error: "Erreur lors de la révocation de la session" };
  }
}

export async function revokeAllSessions() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Non authentifié" };
  }

  try {
    await db
      .delete(sessions)
      .where(eq(sessions.userId, user.id));

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Revoke all sessions error:", error);
    return { error: "Erreur lors de la révocation des sessions" };
  }
}
