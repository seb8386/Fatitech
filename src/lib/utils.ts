import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(
    amount
  );
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getInitials(firstName?: string | null, lastName?: string | null): string {
  const f = firstName?.[0] ?? "";
  const l = lastName?.[0] ?? "";
  return `${f}${l}`.toUpperCase() || "?";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export const PLAN_LIMITS = {
  free: {
    socialAccounts: 2,
    postsPerMonth: 30,
    aiCredits: 50,
    price: 0,
  },
  starter: {
    socialAccounts: 5,
    postsPerMonth: 100,
    aiCredits: 200,
    price: 19,
  },
  pro: {
    socialAccounts: 15,
    postsPerMonth: 500,
    aiCredits: 1000,
    price: 49,
  },
  business: {
    socialAccounts: 50,
    postsPerMonth: 2000,
    aiCredits: 5000,
    price: 149,
  },
  enterprise: {
    socialAccounts: -1,
    postsPerMonth: -1,
    aiCredits: -1,
    price: 499,
  },
};

export const PLATFORM_COLORS: Record<string, string> = {
  tiktok: "#010101",
  youtube: "#FF0000",
  facebook: "#1877F2",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
  pinterest: "#E60023",
  threads: "#000000",
};

export const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X (Twitter)",
  linkedin: "LinkedIn",
  pinterest: "Pinterest",
  threads: "Threads",
};
