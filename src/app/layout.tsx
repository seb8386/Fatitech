import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "FATITECH — Gestion automatisée des réseaux sociaux par l'IA",
  description:
    "Plateforme SaaS intelligente pour automatiser la gestion de vos réseaux sociaux avec l'IA. TikTok, YouTube, Instagram, LinkedIn et plus.",
  keywords: "réseaux sociaux, IA, automatisation, TikTok, YouTube, Instagram, marketing",
  authors: [{ name: "FATITECH" }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
