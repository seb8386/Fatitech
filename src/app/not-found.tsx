import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center mb-6 shadow-2xl">
        <FileQuestion size={40} className="text-violet-400" />
      </div>
      <h1 className="text-4xl font-black text-white mb-2">404 - Page non trouvée</h1>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/dashboard">
        <Button className="flex items-center gap-2">
          <ArrowLeft size={16} /> Retour au tableau de bord
        </Button>
      </Link>
    </div>
  );
}
