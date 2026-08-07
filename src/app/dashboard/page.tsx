"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Eye,
  Heart,
  TrendingUp,
  DollarSign,
  Sparkles,
  Calendar,
  ArrowRight,
  Flame,
  Clock,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StatCard } from "@/components/stat-card";
import { PlatformIcon } from "@/components/platform-icon";
import { formatNumber, formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalFollowers: number;
  followersGrowth: number;
  totalViews: number;
  viewsGrowth: number;
  totalLikes: number;
  likesGrowth: number;
  engagementRate: number;
  engagementGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
  postsPublished: number;
  postsGrowth: number;
}

interface Post {
  id: string;
  title?: string | null;
  content: string;
  status: string;
  scheduledAt?: string | null;
  platform?: string | null;
}

interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  followersCount: number | null;
  isActive: boolean;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<Array<{ date: string; followers: number; views: number; likes: number; engagement: number }>>([]);
  const [platformData, setPlatformData] = useState<SocialAccount[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<{ firstName?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [analyticsRes, userRes, postsRes, accountsRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/auth/me"),
          fetch("/api/posts?status=scheduled"),
          fetch("/api/social-accounts"),
        ]);

        if (analyticsRes.ok) {
          const d = await analyticsRes.json();
          setStats(d.stats);
          setChartData(d.chartData || []);
        }

        if (userRes.ok) {
          const d = await userRes.json();
          setUser(d.user);
        }

        if (postsRes.ok) {
          const d = await postsRes.json();
          setScheduledPosts(d.posts || []);
        }

        if (accountsRes.ok) {
          const d = await accountsRes.json();
          setPlatformData(d.accounts || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-black text-white truncate">
            {greeting},{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              {user?.firstName ?? "Créateur"}
            </span>{" "}
            👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate">
            Voici le résumé de vos performances réelles aujourd&apos;hui
          </p>
        </div>
        <Link
          href="/dashboard/ai-assistant"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all w-full sm:w-auto shrink-0"
        >
          <Sparkles size={16} />
          Générer du contenu
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 min-w-0">
        <StatCard
          title="Abonnés totaux"
          value={stats?.totalFollowers ?? 0}
          change={stats?.followersGrowth ?? 0}
          icon={<Users size={20} className="text-violet-400" />}
          gradient="from-violet-900/40 to-indigo-900/40"
        />
        <StatCard
          title="Vues totales"
          value={stats?.totalViews ?? 0}
          change={stats?.viewsGrowth ?? 0}
          icon={<Eye size={20} className="text-blue-400" />}
          gradient="from-blue-900/40 to-cyan-900/40"
        />
        <StatCard
          title="Likes totaux"
          value={stats?.totalLikes ?? 0}
          change={stats?.likesGrowth ?? 0}
          icon={<Heart size={20} className="text-pink-400" />}
          gradient="from-pink-900/40 to-rose-900/40"
        />
        <StatCard
          title="Engagement"
          value={`${stats?.engagementRate ?? 0}%`}
          change={stats?.engagementGrowth ?? 0}
          icon={<TrendingUp size={20} className="text-emerald-400" />}
          gradient="from-emerald-900/40 to-teal-900/40"
        />
        <StatCard
          title="Revenus"
          value={stats?.totalRevenue ?? 0}
          change={stats?.revenueGrowth ?? 0}
          icon={<DollarSign size={20} className="text-amber-400" />}
          gradient="from-amber-900/40 to-orange-900/40"
          prefix="$"
        />
        <StatCard
          title="Posts publiés"
          value={stats?.postsPublished ?? 0}
          change={stats?.postsGrowth ?? 0}
          icon={<Calendar size={20} className="text-indigo-400" />}
          gradient="from-indigo-900/40 to-purple-900/40"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-w-0">
        {/* Growth Chart */}
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Croissance des abonnés</h2>
              <p className="text-xs sm:text-sm text-slate-400">Évolution de vos comptes</p>
            </div>
            <TrendingUp size={20} className="text-violet-400 shrink-0" />
          </div>

          {chartData.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-4 sm:p-6 text-center">
              <Eye size={36} className="text-slate-600 mb-2" />
              <p className="text-slate-400 text-sm">Aucune donnée d&apos;analytique disponible</p>
              <p className="text-xs text-slate-500 mt-1">Connectez vos réseaux pour synchroniser vos statistiques</p>
              <Link href="/dashboard/accounts" className="mt-4">
                <Button size="sm">Connecter un compte</Button>
              </Link>
            </div>
          ) : (
            <div className="w-full min-w-0 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradFollowers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} tickFormatter={formatNumber} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      color: "#f1f5f9",
                    }}
                    formatter={(v: unknown) => [formatNumber(typeof v === "number" ? v : 0), ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="followers"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    fill="url(#gradFollowers)"
                    name="Abonnés"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Platform breakdown */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6 min-w-0 max-w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Par plateforme</h2>
              <p className="text-xs sm:text-sm text-slate-400">Comptes actifs</p>
            </div>
            <Flame size={20} className="text-orange-400 shrink-0" />
          </div>

          {platformData.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-sm">Aucun compte réseau connecté</p>
              <Link href="/dashboard/accounts" className="mt-3 inline-block">
                <Button size="sm" variant="outline">
                  <Plus size={14} className="mr-1" /> Connecter
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {platformData.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors min-w-0">
                  <div className="shrink-0">
                    <PlatformIcon platform={p.platform.toLowerCase()} size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-slate-300 font-medium truncate">{p.accountName}</span>
                      <span className="text-[10px] text-emerald-400 font-bold ml-2 shrink-0">Actif</span>
                    </div>
                    <p className="text-xs text-slate-500">{formatNumber(p.followersCount ?? 0)} abonnés</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        {/* Scheduled Posts */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6 min-w-0 max-w-full">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base sm:text-lg font-bold text-white">Publications planifiées</h2>
            <Link
              href="/dashboard/calendar"
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 shrink-0"
            >
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>

          {scheduledPosts.length === 0 ? (
            <div className="p-6 sm:p-8 text-center border border-dashed border-white/10 rounded-xl">
              <Clock size={32} className="text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Aucune publication planifiée</p>
              <Link href="/dashboard/posts">
                <Button size="sm" className="mt-3">
                  Créer une publication
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 min-w-0">
              {scheduledPosts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all min-w-0"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {post.platform && (
                      <div className="shrink-0">
                        <PlatformIcon platform={post.platform} size={28} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-white font-medium truncate">{post.title || post.content}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={11} className="text-slate-500 shrink-0" />
                        <span className="text-[11px] text-slate-500 truncate">
                          {post.scheduledAt ? formatDateTime(post.scheduledAt) : "Non définie"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium bg-violet-500/20 text-violet-300 shrink-0">
                    Planifié
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Assistant Quick Generator */}
        <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 p-4 sm:p-6 flex flex-col justify-between min-w-0 max-w-full">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-violet-400 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-white">Assistant IA SocialFlow</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Besoin d&apos;idées virales ou d&apos;optimiser votre calendrier de publication ? L&apos;assistant IA analyse votre créneau et génère du contenu prêt à diffuser.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/dashboard/ai-assistant" className="block w-full">
              <Button className="w-full">
                Ouvrir l&apos;assistant IA
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}