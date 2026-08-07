import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "FATITECH — Gestion automatisée des réseaux sociaux par l'IA",
  description:
    "Plateforme SaaS intelligente pour automatiser la gestion de vos réseaux sociaux avec l'IA. TikTok, YouTube, Instagram, LinkedIn et plus.",
  keywords: "réseaux sociaux, IA, automatisation, TikTok, YouTube, Instagram, marketing",
  authors: [{ name: "FATITECH" }],
};

// 1. Configuration essentielle du Viewport pour mobile
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="overflow-x-hidden w-full">
      <body className="bg-slate-950 text-slate-100 antialiased overflow-x-hidden w-full max-w-full min-h-screen">
        {children}
      </body>
    </html>
  );
}