"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur de connexion");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: string) => {
    if (role === "admin") {
      setEmail("superadmin@fatitech.ai");
      setPassword("Admin@2025!");
    } else {
      setEmail("demo@fatitech.ai");
      setPassword("Demo@2025!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left: Form */}
      <div className="w-full xl:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                FATI<span className="text-violet-400">TECH</span>
              </span>
            </Link>
            <h1 className="text-3xl font-black text-white">Bon retour ! 👋</h1>
            <p className="text-slate-400 mt-2">
              Connectez-vous pour accéder à votre tableau de bord
            </p>
          </div>

          {/* Demo buttons */}
          <div className="p-4 rounded-2xl bg-violet-900/20 border border-violet-500/30">
            <p className="text-xs text-violet-300 font-medium mb-3">🎯 Accès démo rapide :</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo("user")}
                className="flex-1 px-3 py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs font-medium transition-all border border-violet-500/30"
              >
                👤 Compte Démo
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="flex-1 px-3 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-medium transition-all border border-amber-500/30"
              >
                👑 Super Admin
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-900/20 border border-red-500/30 text-sm text-red-300">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="vous@exemple.com"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-9 text-slate-400 hover:text-white transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-violet-600" />
                Se souvenir de moi
              </label>
              <Link href="/forgot-password" className="text-sm text-violet-400 hover:text-violet-300">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" isLoading={loading} size="lg" className="w-full">
              Se connecter
              <ArrowRight size={18} className="ml-2" />
            </Button>

            <div className="relative flex items-center">
              <div className="flex-1 border-t border-white/10" />
              <span className="px-4 text-xs text-slate-500">ou continuer avec</span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-all"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-all"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#0078D4">
                  <path d="M11.4 24H0V12.6L11.4 24zM12.6 24H24V12.6L12.6 24zM0 11.4V0h11.4L0 11.4zM12.6 0H24v11.4L12.6 0z"/>
                </svg>
                Microsoft
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-400">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 font-semibold">
              Créer un compte gratuitement
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden xl:flex w-1/2 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-8">
            <Zap size={24} className="text-white" />
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="text-2xl font-bold text-white leading-relaxed">
            &ldquo;SocialFlow a multiplié mon engagement par 5 en seulement 3 mois. L&apos;IA fait tout le travail pour moi !&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <p className="font-bold text-white">Marie Lefebvre</p>
              <p className="text-sm text-slate-400">Créatrice · 280K abonnés TikTok</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { value: "50K+", label: "Créateurs actifs" },
              { value: "2M+", label: "Posts publiés" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
