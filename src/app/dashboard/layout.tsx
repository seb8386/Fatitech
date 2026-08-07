"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  LayoutDashboard,
  Share2,
  FileText,
  Calendar,
  BarChart3,
  Bot,
  MessageSquare,
  Target,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
  Sparkles,
} from "lucide-react";

const NAVIGATION = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard, current: true },
  { name: "Comptes sociaux", href: "/dashboard/accounts", icon: Share2 },
  { name: "Publications", href: "/dashboard/posts", icon: FileText },
  { name: "Calendrier", href: "/dashboard/calendar", icon: Calendar },
  { name: "Analytique", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Assistant IA", href: "/dashboard/ai-assistant", icon: Bot, badge: "IA" },
  { name: "Commentaires", href: "/dashboard/comments", icon: MessageSquare },
  { name: "Campagnes", href: "/dashboard/campaigns", icon: Target },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      {/* Superposition sombre sur mobile quand le menu est ouvert */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Responsive */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900/95 border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Logo & Bouton Fermer */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-lg font-black tracking-wide">
                FAT<span className="text-violet-400">ITECH</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Badge Plan */}
          <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400" />
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">
                Plan Free
              </span>
            </div>
            <Link
              href="/dashboard/billing"
              className="text-[10px] bg-violet-600 hover:bg-violet-500 text-white font-semibold px-2 py-1 rounded-md transition-colors"
            >
              UPGRADE
            </Link>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {NAVIGATION.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    item.current
                      ? "bg-violet-600 text-white font-semibold shadow-lg shadow-violet-600/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full border border-violet-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profil utilisateur bas de sidebar */}
        <div className="p-4 border-t border-white/10 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-violet-700 flex items-center justify-center font-bold text-sm shrink-0">
                S
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">Sébastien</p>
                <p className="text-[10px] text-slate-400 truncate">Créateur</p>
              </div>
            </div>
            <button className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Zone Principale */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Header Mobile avec bouton Burger */}
        <header className="h-14 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 flex items-center justify-between md:hidden sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold text-white">FATITECH</span>
          <div className="w-8" />
        </header>

        {/* Ingestion des pages (dashboard/page.tsx, dashboard/posts/page.tsx, etc.) */}
        <main className="flex-1 p-3 sm:p-6 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}