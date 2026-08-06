"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart2,
  Users,
  Eye,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { PlatformIcon } from "@/components/platform-icon";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PERIODS = ["7 jours", "30 jours", "3 mois", "6 mois", "1 an"];
const PIE_COLORS = ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

interface AnalyticsState {
  stats: {
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
  };
  chartData: Array<{ date: string; followers: number; views: number; likes: number; engagement: number }>;
  platformData: Array<{ platform: string; followers: number; growth: number; accountName: string }>;
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30 jours");
  const [data, setData] = useState<AnalyticsState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats ?? {
    totalFollowers: 0,
    followersGrowth: 0,
    totalViews: 0,
    viewsGrowth: 0,
    totalLikes: 0,
    likesGrowth: 0,
    engagementRate: 0,
    engagementGrowth: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
  };

  const chartData = data?.chartData ?? [];
  const platformData = data?.platformData ?? [];

  const platformPieData = platformData.map((p) => ({
    name: p.platform,
    value: p.followers,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Analytique</h1>
          <p className="text-slate-400 mt-1">Analyse détaillée de vos performances réelles PostgreSQL</p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === p
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Abonnés totaux"
          value={stats.totalFollowers}
          change={stats.followersGrowth}
          icon={<Users size={20} className="text-violet-400" />}
          gradient="from-violet-900/40 to-indigo-900/40"
        />
        <StatCard
          title="Vues totales"
          value={stats.totalViews}
          change={stats.viewsGrowth}
          icon={<Eye size={20} className="text-blue-400" />}
          gradient="from-blue-900/40 to-cyan-900/40"
        />
        <StatCard
          title="Taux d'engagement"
          value={`${stats.engagementRate}%`}
          change={stats.engagementGrowth}
          icon={<TrendingUp size={20} className="text-emerald-400" />}
          gradient="from-emerald-900/40 to-teal-900/40"
        />
        <StatCard
          title="Revenus estimés"
          value={stats.totalRevenue}
          change={stats.revenueGrowth}
          icon={<DollarSign size={20} className="text-amber-400" />}
          gradient="from-amber-900/40 to-orange-900/40"
          prefix="$"
        />
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Growth over time */}
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-slate-900/80 p-6">
          <h2 className="text-lg font-bold text-white mb-6">Évolution des abonnés</h2>

          {chartData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-8 text-center">
              <BarChart2 size={40} className="text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Aucune métrique enregistrée</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                Connectez vos comptes réseaux sociaux pour générer votre premier historique d&apos;analytique réel.
              </p>
              <Link href="/dashboard/accounts">
                <Button size="sm">Connecter un compte</Button>
              </Link>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradVio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={formatNumber} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#f1f5f9" }}
                  formatter={(v: unknown) => [formatNumber(typeof v === "number" ? v : 0), ""]}
                />
                <Area type="monotone" dataKey="followers" stroke="#7c3aed" strokeWidth={2} fill="url(#gradVio)" name="Abonnés" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Platform distribution */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
          <h2 className="text-lg font-bold text-white mb-6">Répartition par plateforme</h2>
          {platformPieData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-400">Aucune plateforme connectée</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={platformPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    dataKey="value"
                  >
                    {platformPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#f1f5f9" }}
                    formatter={(v: unknown) => [formatNumber(typeof v === "number" ? v : 0), ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {platformData.map((p, i) => (
                  <div key={p.platform} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-xs text-slate-400 capitalize">{p.platform}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{formatNumber(p.followers)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Platform performance list */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={18} className="text-violet-400" />
          <h2 className="text-lg font-bold text-white">Performance par compte social</h2>
        </div>

        {platformData.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
            <p className="text-slate-400 text-sm">Aucun compte à afficher pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {platformData.map((p) => (
              <div key={p.platform} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                <PlatformIcon platform={p.platform.toLowerCase()} size={36} />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-white">{p.accountName}</span>
                    <span className="text-sm font-bold text-emerald-400">{formatNumber(p.followers)} abonnés</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
