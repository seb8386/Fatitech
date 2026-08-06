"use client";

import { cn } from "@/lib/utils";

interface PlatformIconProps {
  platform: string;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

const PLATFORM_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; letter: string }
> = {
  tiktok: { label: "TikTok", color: "#ffffff", bg: "#010101", letter: "T" },
  youtube: { label: "YouTube", color: "#ffffff", bg: "#FF0000", letter: "Y" },
  facebook: { label: "Facebook", color: "#ffffff", bg: "#1877F2", letter: "f" },
  instagram: {
    label: "Instagram",
    color: "#ffffff",
    bg: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    letter: "in",
  },
  twitter: { label: "X (Twitter)", color: "#ffffff", bg: "#000000", letter: "𝕏" },
  linkedin: { label: "LinkedIn", color: "#ffffff", bg: "#0A66C2", letter: "in" },
  pinterest: { label: "Pinterest", color: "#ffffff", bg: "#E60023", letter: "P" },
  threads: { label: "Threads", color: "#ffffff", bg: "#000000", letter: "@" },
};

export function PlatformIcon({
  platform,
  size = 32,
  className,
  showLabel,
}: PlatformIconProps) {
  const config = PLATFORM_CONFIG[platform.toLowerCase()] ?? {
    label: platform,
    color: "#ffffff",
    bg: "#6366f1",
    letter: platform[0]?.toUpperCase() ?? "?",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="rounded-xl flex items-center justify-center font-bold shadow-lg flex-shrink-0"
        style={{
          width: size,
          height: size,
          background: config.bg,
          color: config.color,
          fontSize: size * 0.38,
        }}
      >
        {config.letter}
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-slate-300">{config.label}</span>
      )}
    </div>
  );
}
