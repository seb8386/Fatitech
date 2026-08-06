"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CreditCard,
  Shield,
  Info,
  Check,
  Trash2,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  post_published: {
    icon: <CheckCircle2 size={18} />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  post_failed: {
    icon: <AlertCircle size={18} />,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  ai_recommendation: {
    icon: <Sparkles size={18} />,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  subscription_alert: {
    icon: <CreditCard size={18} />,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  security_alert: {
    icon: <Shield size={18} />,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  system: {
    icon: <Info size={18} />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "ai") return n.type === "ai_recommendation";
    if (filter === "alerts") return ["post_failed", "security_alert", "subscription_alert"].includes(n.type);
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Bell size={28} className="text-violet-400" />
            Notifications
            {unreadCount > 0 && (
              <span className="text-base font-bold px-2.5 py-0.5 rounded-full bg-violet-600 text-white">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-slate-400 mt-1">Restez informé de l&apos;activité de votre compte PostgreSQL</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-all"
          >
            <Check size={15} />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex bg-slate-800 rounded-xl p-1 gap-1 w-fit">
        {[
          { id: "all", label: "Toutes" },
          { id: "unread", label: `Non lues (${unreadCount})` },
          { id: "ai", label: "🤖 IA" },
          { id: "alerts", label: "⚠️ Alertes" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.id
                ? "bg-violet-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-20 text-center">
          <Bell size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-white mb-1">Aucune notification</h3>
          <p className="text-slate-400 text-sm">Vous êtes à jour ! Aucune alerte en attente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notification) => {
            const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.system;
            return (
              <div
                key={notification.id}
                className={`rounded-2xl border bg-slate-900/80 p-5 transition-all hover:border-white/20 group ${
                  !notification.isRead
                    ? "border-violet-500/30 bg-violet-900/10"
                    : "border-white/10"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`text-sm font-bold ${!notification.isRead ? "text-white" : "text-slate-300"}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-slate-500">
                          {new Date(notification.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-violet-500" />
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          onClick={() => markRead(notification.id)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition-all"
                        >
                          <Check size={12} />
                          Marquer lu
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-all"
                      >
                        <Trash2 size={12} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
