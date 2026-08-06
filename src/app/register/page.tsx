"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FEATURES = [
  "Gestion de 8 plateformes sociales",
  "Génération de contenu IA",
  "Publication automatique",
  "Analyses détaillées",
  "Modération des commentaires IA",
  "Calendrier éditorial",
];

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur d'inscription");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left: Visual */}
      <div className="hidden xl:flex w-1/2 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 space-y-8 max-w-md">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                FATI<span className="text-violet-400">TECH</span>
              </span>
            </Link>
            <h2 className="text-4xl font-black text-white leading-tight">
              Automatisez votre présence sociale avec l&apos;IA
            </h2>
            <p className="text-slate-400 mt-4 text-lg">
              Rejoignez 50 000+ créateurs qui font confiance à FATITECH pour gérer leurs réseaux sociaux.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/50 flex items-center justify-center flex-shrink-0">
                  <Check size={13} className="text-violet-300" />
                </div>
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex -space-x-2 mb-3">
              {["A", "B", "C", "D", "E"].map((l, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `hsl(${i * 60 + 240}, 70%, 50%)` }}
                >
                  {l}
                </div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-slate-950 bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                +
              </div>
            </div>
            <p className="text-sm text-white font-semibold">50 000+ créateurs font déjà confiance à SocialFlow</p>
            <p className="text-xs text-slate-400 mt-1">Note moyenne : ⭐⭐⭐⭐⭐ 4.9/5</p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full xl:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="xl:hidden">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                FATI<span className="text-violet-400">TECH</span>
              </span>
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-black text-white">Créez votre compte</h1>
            <p className="text-slate-400 mt-2">
              Gratuit · Pas de carte bancaire requise · Prêt en 2 minutes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-900/20 border border-red-500/30 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Prénom"
                placeholder="Jean"
                icon={<User size={16} />}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Nom"
                placeholder="Dupont"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="vous@exemple.com"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="Minimum 8 caractères"
              icon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {password.length > 0 && (
              <div className="space-y-1">
                {[
                  { label: "8 caractères minimum", ok: password.length >= 8 },
                  { label: "Une majuscule", ok: /[A-Z]/.test(password) },
                  { label: "Un chiffre", ok: /[0-9]/.test(password) },
                ].map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.ok ? "bg-emerald-500/20" : "bg-slate-700"}`}>
                      {req.ok && <Check size={10} className="text-emerald-400" />}
                    </div>
                    <span className={req.ok ? "text-emerald-400" : "text-slate-500"}>{req.label}</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-500">
              En créant un compte, vous acceptez nos{" "}
              <Link href="/terms" className="text-violet-400 hover:text-violet-300">Conditions d&apos;utilisation</Link>{" "}
              et notre{" "}
              <Link href="/privacy" className="text-violet-400 hover:text-violet-300">Politique de confidentialité</Link>.
            </p>

            <Button type="submit" isLoading={loading} size="lg" className="w-full">
              Créer mon compte gratuit
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}