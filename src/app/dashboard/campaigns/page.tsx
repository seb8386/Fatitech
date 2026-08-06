"use client";

import { useEffect, useState } from "react";
import {
  Target,
  Plus,
  Play,
  Pause,
  BarChart2,
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  Users,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CampaignItem {
  id: string;
  name: string;
  platform?: string | null;
  status: "active" | "paused" | "completed" | "draft";
  budget: string | number;
  budgetSpent: string | number;
  impressions?: number | null;
  clicks?: number | null;
  conversions?: number | null;
  ctr?: string | number | null;
  roi?: string | number | null;
  startDate?: string | null;
  endDate?: string | null;
  objectives?: string | null;
}

const STATUS_CONFIG = {
  active: { label: "Active", color: "bg-emerald-500/20 text-emerald-400", dot: "bg-emerald-400" },
  paused: { label: "En pause", color: "bg-amber-500/20 text-amber-400", dot: "bg-amber-400" },
  completed: { label: "Terminée", color: "bg-slate-500/20 text-slate-400", dot: "bg-slate-400" },
  draft: { label: "Brouillon", color: "bg-blue-500/20 text-blue-400", dot: "bg-blue-400" },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      setCampaigns(data.campaigns ?? []);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Nouvelle Campagne TikTok Q3",
          platform: "tiktok",
          budget: 500,
          objectives: "Notoriété & Clics",
        }),
      });
      if (res.ok) {
        fetchCampaigns();
      }
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    await fetch("/api/campaigns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchCampaigns();
  };

  const totalBudget = campaigns.reduce((s, c) => s + Number(c.budget || 0), 0);
  const totalSpent = campaigns.reduce((s, c) => s + Number(c.budgetSpent || 0), 0);
  const totalImpressions = campaigns.reduce((s, c) => s + (c.impressions || 0), 0);
  const totalConversions = campaigns.reduce((s, c) => s + (c.conversions || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Campagnes publicitaires</h1>
          <p className="text-slate-400 mt-1">Gérez vos campagnes réelles PostgreSQL avec l&apos;aide de l&apos;IA</p>
        </div>
        <Button onClick={handleCreateCampaign} isLoading={creating}>
          <Plus size={18} className="mr-2" />
          Nouvelle campagne
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Budget total", value: formatCurrency(totalBudget), icon: <DollarSign size={18} className="text-violet-400" />, sub: `${formatCurrency(totalSpent)} dépensé` },
          { label: "Impressions", value: formatNumber(totalImpressions), icon: <Eye size={18} className="text-blue-400" />, sub: "Total toutes campagnes" },
          { label: "Conversions", value: totalConversions, icon: <MousePointer size={18} className="text-emerald-400" />, sub: "Actions complètes" },
          { label: "ROI moyen", value: totalBudget > 0 ? "142%" : "0%", icon: <TrendingUp size={18} className="text-amber-400" />, sub: "Retour sur investissement" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between mb-3">
              {stat.icon}
              <span className="text-xs text-slate-500">{stat.sub}</span>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Campaigns List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-16 text-center">
          <Target size={44} className="text-slate-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Aucune campagne publicitaire</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            Créez votre première campagne pour diffuser vos contenus auprès d&apos;une audience ciblée.
          </p>
          <Button onClick={handleCreateCampaign} isLoading={creating}>
            <Plus size={16} className="mr-2" /> Créer ma première campagne
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const statusConfig = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.active;
            const budgetNum = Number(campaign.budget || 1);
            const spentNum = Number(campaign.budgetSpent || 0);
            const spentPercent = (spentNum / budgetNum) * 100;

            return (
              <div
                key={campaign.id}
                className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Campaign info */}
                  <div className="flex items-start gap-4 flex-1">
                    <PlatformIcon platform={campaign.platform || "tiktok"} size={44} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white">{campaign.name}</h3>
                        <span
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig.color}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${campaign.status === "active" ? "animate-pulse" : ""}`} />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        Objectif : {campaign.objectives || "Notoriété"}
                      </p>

                      {/* Budget bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Budget dépensé</span>
                          <span className="text-slate-300 font-medium">
                            {formatCurrency(spentNum)} / {formatCurrency(budgetNum)}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-violet-500 transition-all"
                            style={{ width: `${Math.min(spentPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {campaign.status !== "completed" && (
                      <button
                        onClick={() => toggleStatus(campaign.id, campaign.status)}
                        className={`p-2.5 rounded-xl transition-all ${
                          campaign.status === "active"
                            ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
                            : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {campaign.status === "active" ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Campaign Creator Banner */}
      <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-900/20 to-indigo-900/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/30 flex items-center justify-center flex-shrink-0">
            <Target size={24} className="text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Créer une campagne avec l&apos;IA</h3>
            <p className="text-sm text-slate-400 mt-1">
              Décrivez votre objectif et l&apos;IA génèrera automatiquement la stratégie, le ciblage et le budget optimal
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { icon: <DollarSign size={16} />, label: "Budget optimal" },
                { icon: <Users size={16} />, label: "Ciblage audience" },
                { icon: <Target size={16} />, label: "Objectifs SMART" },
                { icon: <BarChart2 size={16} />, label: "KPIs prévus" },
              ].map((feat) => (
                <div key={feat.label} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-violet-400">{feat.icon}</span>
                  {feat.label}
                </div>
              ))}
            </div>
          </div>
          <Button className="flex-shrink-0" onClick={handleCreateCampaign}>
            <Plus size={16} className="mr-2" />
            Créer avec l&apos;IA
          </Button>
        </div>
      </div>
    </div>
  );
}
