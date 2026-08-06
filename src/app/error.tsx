"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
        <AlertTriangle size={32} className="text-red-400" />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">Une erreur inattendue est survenue</h1>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        L&apos;application a rencontré un problème temporaire. Veuillez réessayer ou contacter le support si le problème persiste.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="flex items-center gap-2">
          <RefreshCw size={16} /> Réessayer
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Retour à l&apos;accueil
        </Button>
      </div>
    </div>
  );
}
