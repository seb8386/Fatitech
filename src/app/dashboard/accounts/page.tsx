"use client";

import { useEffect, useState } from "react";
import { Plus, Wifi, WifiOff, RefreshCw, Trash2, ExternalLink, Sparkles } from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { formatNumber, PLATFORM_LABELS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PLATFORMS = [
  "tiktok", "youtube", "facebook", "instagram", "twitter", "linkedin", "pinterest", "threads",
];

interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  accountId: string;
  accountUrl: string | null;
  followersCount: number | null;
  isActive: boolean;
  lastSyncAt: string | null;
}

interface ConnectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function ConnectModal({ onClose, onSuccess }: ConnectModalProps) {
  const [platform, setPlatform] = useState("tiktok");
  const [accountName, setAccountName] = useState("");
  const [accountUrl, setAccountUrl] = useState("");
  const [followersCount, setFollowersCount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/social-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          accountName,
          accountId: accountName,
          accountUrl: accountUrl || null,
          followersCount: parseInt(followersCount) || 0,
        }),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Connecter un compte</h2>

        {platform === "tiktok" && (
          <div className="mb-6 p-4 rounded-xl bg-violet-900/20 border border-violet-500/30 text-center">
            <p className="text-sm font-semibold text-white mb-1">Connexion OAuth 2.0 TikTok Officielle</p>
            <p className="text-xs text-slate-400 mb-3">Connectez-vous directement avec vos identifiants TikTok réels.</p>
            <a
              href="/api/oauth/tiktok/authorize"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 transition-all"
            >
              <Sparkles size={14} /> Se connecter avec TikTok OAuth
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Plateforme</label>
            <div className="grid grid-cols-4 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    platform === p
                      ? "border-violet-500 bg-violet-500/20"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <PlatformIcon platform={p} size={28} />
                  <span className="text-[10px] text-slate-400">{PLATFORM_LABELS[p]?.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Nom du compte"
            placeholder="@moncompte"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
          />
          <Input
            label="URL du profil (optionnel)"
            placeholder="https://www.tiktok.com/@moncompte"
            value={accountUrl}
            onChange={(e) => setAccountUrl(e.target.value)}
          />
          <Input
            label="Nombre d'abonnés actuels"
            type="number"
            placeholder="10000"
            value={followersCount}
            onChange={(e) => setFollowersCount(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" isLoading={loading} className="flex-1">
              Connecter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/social-accounts");
      const data = await res.json();
      setAccounts(data.accounts ?? []);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncTikTok = async () => {
    setSyncing("tiktok");
    try {
      const res = await fetch("/api/integrations/tiktok/sync", { method: "POST" });
      if (res.ok) {
        await fetchAccounts();
      }
    } finally {
      setSyncing(null);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 space-y-8">
      {showModal && (
        <ConnectModal onClose={() => setShowModal(false)} onSuccess={fetchAccounts} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Comptes sociaux</h1>
          <p className="text-slate-400 mt-1">Gérez vos comptes réels connectés via PostgreSQL</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/api/oauth/tiktok/authorize"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black border border-white/20 text-white text-sm font-semibold hover:border-violet-500 transition-all shadow-lg"
          >
            <PlatformIcon platform="tiktok" size={20} />
            OAuth TikTok
          </a>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={18} className="mr-2" />
            Connecter un compte
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Comptes connectés", value: accounts.length, color: "text-violet-400" },
          { label: "Abonnés totaux", value: formatNumber(accounts.reduce((s, a) => s + (a.followersCount ?? 0), 0)), color: "text-emerald-400" },
          { label: "Actifs", value: accounts.filter((a) => a.isActive).length, color: "text-blue-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Accounts grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Aucun compte réseau connecté</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Connectez votre compte TikTok ou d&apos;autres réseaux sociaux pour synchroniser automatiquement vos abonnés, vues et métriques réelles.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/api/oauth/tiktok/authorize"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-indigo-500 transition-all"
            >
              <PlatformIcon platform="tiktok" size={20} />
              Connecter TikTok OAuth
            </a>
            <Button variant="outline" onClick={() => setShowModal(true)}>
              Autre compte
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <PlatformIcon platform={account.platform} size={44} showLabel />
                <div className="flex items-center gap-1">
                  {account.isActive ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                      <Wifi size={11} />Actif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                      <WifiOff size={11} />Inactif
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white">{account.accountName}</h3>
              <p className="text-3xl font-black text-white mt-3">
                {formatNumber(account.followersCount ?? 0)}
                <span className="text-sm font-normal text-slate-400 ml-1">abonnés</span>
              </p>

              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={account.platform === "tiktok" ? handleSyncTikTok : fetchAccounts}
                  disabled={syncing === "tiktok"}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-all"
                >
                  <RefreshCw size={13} className={syncing === "tiktok" ? "animate-spin" : ""} />
                  {syncing === "tiktok" ? "Synchro..." : "Sync"}
                </button>
                {account.accountUrl && (
                  <a
                    href={account.accountUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-all"
                  >
                    <ExternalLink size={13} />Voir
                  </a>
                )}
                <button className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

          {/* Add account card */}
          <button
            onClick={() => setShowModal(true)}
            className="rounded-2xl border-2 border-dashed border-white/10 p-6 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group flex flex-col items-center justify-center gap-3 min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={24} className="text-violet-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-300">Ajouter un compte</p>
              <p className="text-xs text-slate-500 mt-1">TikTok, YouTube, Instagram...</p>
            </div>
          </button>
        </div>
      )}

      {/* Available platforms */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Plateformes supportées</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {PLATFORMS.map((p) => (
            <div key={p} className="flex flex-col items-center gap-2">
              <PlatformIcon platform={p} size={40} />
              <span className="text-xs text-slate-400 text-center">{PLATFORM_LABELS[p]?.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
