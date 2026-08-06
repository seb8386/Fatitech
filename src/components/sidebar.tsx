"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Share2,
  Calendar,
  BarChart3,
  MessageSquare,
  Sparkles,
  Settings,
  Bell,
  Zap,
  ChevronLeft,
  LogOut,
  Crown,
  Target,
  BookOpen,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Comptes sociaux",
    href: "/dashboard/accounts",
    icon: <Share2 size={20} />,
  },
  {
    label: "Publications",
    href: "/dashboard/posts",
    icon: <BookOpen size={20} />,
  },
  {
    label: "Calendrier",
    href: "/dashboard/calendar",
    icon: <Calendar size={20} />,
  },
  {
    label: "Analytique",
    href: "/dashboard/analytics",
    icon: <BarChart3 size={20} />,
  },
  {
    label: "Assistant IA",
    href: "/dashboard/ai-assistant",
    icon: <Sparkles size={20} />,
    badge: "IA",
  },
  {
    label: "Commentaires",
    href: "/dashboard/comments",
    icon: <MessageSquare size={20} />,
  },
  {
    label: "Campagnes",
    href: "/dashboard/campaigns",
    icon: <Target size={20} />,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: <Bell size={20} />,
  },
  {
    label: "Administration",
    href: "/dashboard/admin",
    icon: <Shield size={20} />,
    adminOnly: true,
  },
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: <Settings size={20} />,
  },
];

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string;
    role?: string;
    avatarUrl?: string | null;
  } | null;
  plan?: string;
}

export function Sidebar({ user, plan = "free" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin =
    user?.role === "super_admin" || user?.role === "admin";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-50 flex flex-col",
        "bg-slate-950 border-r border-white/5",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 h-16">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-black text-white">FATI</span>
              <span className="text-lg font-black text-violet-400">TECH</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap size={18} className="text-white" />
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all",
            collapsed && "mx-auto"
          )}
        >
          <ChevronLeft
            size={18}
            className={cn("transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Plan badge */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Crown size={14} className="text-violet-400" />
            <span className="text-xs font-bold text-violet-300 uppercase tracking-wide">
              Plan {plan}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5",
                collapsed && "justify-center"
              )}
            >
              <span className={isActive ? "text-violet-400" : ""}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-violet-600 text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.adminOnly && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-600/30 text-amber-300 border border-amber-500/30">
                      ADMIN
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="p-3 border-t border-white/5">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl",
            "hover:bg-white/5 cursor-pointer transition-all",
            collapsed && "justify-center"
          )}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-9 h-9 rounded-xl object-cover flex-shrink-0 shadow-lg"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
              {initials}
            </div>
          )}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center p-2 text-slate-500 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all mt-1"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
