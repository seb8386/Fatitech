import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Sidebar } from "@/components/sidebar";
import type { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Redirect to change password if required
  if (user.mustChangePassword) {
    redirect("/dashboard/change-password");
  }

  const [sub] = await db
    .select({ plan: subscriptions.plan })
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar 
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        }} 
        plan={sub?.plan ?? "free"} 
      />
      <main className="flex-1 ml-72 overflow-y-auto transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
