"use client";

import { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  Crown,
  UserCheck,
  UserX,
  Eye,
  BarChart2,
  Globe,
  Server,
  Activity,
  Key,
  Copy,
  Check,
} from "lucide-react";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { toggleUserStatus, resetUserPassword } from "@/app/actions/admin";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  paidUsers: number;
  monthlyRevenue: number;
  growth: {
    users: number;
    revenue: number;
    posts: number;
  };
}

interface UserItem {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  super_admin: { label: "Super Admin", color: "bg-red-500/20 text-red-400", icon: <Crown size={12} /> },
  admin: { label: "Admin", color: "bg-amber-500/20 text-amber-400", icon: <Shield size={12} /> },
  user: { label: "Utilisateur", color: "bg-slate-500/20 text-slate-400", icon: <UserCheck size={12} /> },
};

const SYSTEM_HEALTH = [
  { label: "API Gateway", status: "operational", uptime: "99.97%" },
  { label: "Base de données PostgreSQL", status: "operational", uptime: "99.99%" },
  { label: "File d'attente Drizzle Engine", status: "operational", uptime: "99.95%" },
  { label: "IA Engine", status: "operational", uptime: "99.80%" },
  { label: "Stockage Media", status: "operational", uptime: "99.90%" },
  { label: "Session Engine", status: "operational", uptime: "99.99%" },
];

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [resetModal, setResetModal] = useState<{ userId: string; tempPassword: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setUsers(d.users || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (userId: string) => {
    const result = await toggleUserStatus(userId);
    if (result.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: result.isActive! } : u))
      );
    }
  };

  const handleResetPassword = async (userId: string) => {
    const result = await resetUserPassword(userId);
    if (result.success) {
      setResetModal({ userId, tempPassword: result.tempPassword! });
    }
  };

  const copyPassword = () => {
    if (resetModal?.tempPassword) {
      navigator.clipboard.writeText(resetModal.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Shield size={28} className="text-amber-400" />
            <h1 className="text-3xl font-black text-white">Panel d&apos;administration</h1>
          </div>
          <p className="text-slate-400 mt-1">Superviser et gérer toute la plateforme PostgreSQL</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600/10 border border-amber-500/30">
          <Crown size={16} className="text-amber-400" />
          <span className="text-sm font-bold text-amber-300">Super Administrateur</span>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex bg-slate-800 rounded-xl p-1 gap-1 w-fit">
        {[
          { id: "overview", label: "Vue d'ensemble" },
          { id: "users", label: "Utilisateurs" },
          { id: "system", label: "Système" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-violet-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
                {[
                  {
                    label: "Utilisateurs totaux",
                    value: formatNumber(stats?.totalUsers ?? 0),
                    change: stats?.growth.users ?? 0,
                    icon: <Users size={18} className="text-violet-400" />,
                    bg: "from-violet-900/40 to-indigo-900/40",
                  },
                  {
                    label: "Utilisateurs actifs",
                    value: formatNumber(stats?.activeUsers ?? 0),
                    change: 0,
                    icon: <Activity size={18} className="text-emerald-400" />,
                    bg: "from-emerald-900/40 to-teal-900/40",
                  },
                  {
                    label: "Utilisateurs payants",
                    value: formatNumber(stats?.paidUsers ?? 0),
                    change: stats?.growth.revenue ?? 0,
                    icon: <UserCheck size={18} className="text-blue-400" />,
                    bg: "from-blue-900/40 to-cyan-900/40",
                  },
                  {
                    label: "Revenus mensuels",
                    value: formatCurrency(stats?.monthlyRevenue ?? 0),
                    change: stats?.growth.revenue ?? 0,
                    icon: <DollarSign size={18} className="text-amber-400" />,
                    bg: "from-amber-900/40 to-orange-900/40",
                  },
                  {
                    label: "Publications totales",
                    value: formatNumber(stats?.totalPosts ?? 0),
                    change: stats?.growth.posts ?? 0,
                    icon: <BarChart2 size={18} className="text-pink-400" />,
                    bg: "from-pink-900/40 to-rose-900/40",
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className={`rounded-2xl border border-white/10 bg-gradient-to-br ${kpi.bg} p-5`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      {kpi.icon}
                      <span className="text-xs font-bold text-emerald-400">+{kpi.change}%</span>
                    </div>
                    <p className="text-2xl font-black text-white">{kpi.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{kpi.label}</p>
                  </div>
                ))}
              </div>

              {/* Revenue breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "MRR", value: formatCurrency(stats?.monthlyRevenue ?? 0), change: "+0$", trend: "up" },
                  { label: "ARR", value: formatCurrency((stats?.monthlyRevenue ?? 0) * 12), change: "+0$", trend: "up" },
                  { label: "Churn Rate", value: "0.0%", change: "0%", trend: "down_good" },
                ].map((m) => (
                  <div key={m.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">{m.label}</p>
                    <p className="text-2xl font-black text-white mt-1">{m.value}</p>
                    <p className="text-xs mt-1 text-emerald-400">
                      <TrendingUp size={12} className="inline mr-1" />
                      {m.change} ce mois
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden">
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Liste des utilisateurs réels</h2>
                  <span className="text-sm text-slate-400">{users.length} utilisateurs</span>
                </div>

                {users.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">Aucun utilisateur enregistré</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800/50">
                        <tr className="text-left text-slate-400">
                          <th className="px-5 py-3 font-medium">Utilisateur</th>
                          <th className="px-5 py-3 font-medium">Rôle</th>
                          <th className="px-5 py-3 font-medium">Statut</th>
                          <th className="px-5 py-3 font-medium">Inscrit le</th>
                          <th className="px-5 py-3 font-medium">Dernière connexion</th>
                          <th className="px-5 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.map((user) => {
                          const roleConfig = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.user;
                          return (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                                    {(user.name?.[0] ?? user.email[0]).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-white">
                                      {user.name || user.email}
                                    </p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`flex items-center gap-1 w-fit text-xs px-2.5 py-1 rounded-full font-medium ${roleConfig.color}`}>
                                  {roleConfig.icon}
                                  {roleConfig.label}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                    user.isActive
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : "bg-red-500/20 text-red-400"
                                  }`}
                                >
                                  {user.isActive ? "Actif" : "Suspendu"}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-slate-400">
                                {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                              </td>
                              <td className="px-5 py-4 text-slate-400">
                                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("fr-FR") : "—"}
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex gap-2">
                                  <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all">
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleToggleStatus(user.id)}
                                    className={`p-1.5 rounded-lg transition-all ${
                                      user.isActive
                                        ? "bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                        : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                                    }`}
                                    title={user.isActive ? "Bloquer" : "Débloquer"}
                                  >
                                    {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                                  </button>
                                  <button
                                    onClick={() => handleResetPassword(user.id)}
                                    className="p-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-all"
                                    title="Réinitialiser le mot de passe"
                                  >
                                    <Key size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === "system" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SYSTEM_HEALTH.map((service) => (
                  <div
                    key={service.label}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-900/10 p-5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <p className="text-sm font-medium text-white">{service.label}</p>
                        <p className="text-xs text-emerald-400">Opérationnel · {service.uptime} uptime</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Server size={16} className="text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={18} className="text-violet-400" />
                  <h2 className="text-lg font-bold text-white">Métriques système</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "CPU", value: 18, unit: "%", color: "bg-blue-500" },
                    { label: "RAM", value: 42, unit: "%", color: "bg-violet-500" },
                    { label: "Disque", value: 15, unit: "%", color: "bg-emerald-500" },
                  ].map((m) => (
                    <div key={m.label} className="text-center">
                      <p className="text-sm text-slate-400 mb-2">{m.label}</p>
                      <div className="relative w-20 h-20 mx-auto">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="15.9" fill="none"
                            stroke="#7c3aed"
                            strokeWidth="3"
                            strokeDasharray={`${m.value} ${100 - m.value}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <p className="absolute inset-0 flex items-center justify-center text-xl font-black text-white">
                          {m.value}{m.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Password Reset Modal */}
      {resetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <Key size={24} className="text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Mot de passe réinitialisé</h3>
                <p className="text-sm text-slate-400">Nouveau mot de passe temporaire généré</p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between gap-2">
                <code className="text-lg font-mono text-violet-300 flex-1 break-all">
                  {resetModal.tempPassword}
                </code>
                <button
                  onClick={copyPassword}
                  className="p-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 transition-all"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-400 mb-4">
              L'utilisateur devra changer ce mot de passe lors de sa prochaine connexion.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setResetModal(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
