"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  gradient?: string;
  suffix?: string;
  prefix?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  gradient = "from-violet-600/20 to-indigo-600/20",
  suffix = "",
  prefix = "",
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;
  const displayValue =
    typeof value === "number" ? formatNumber(value) : value;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 p-6",
        "bg-gradient-to-br",
        gradient,
        "backdrop-blur-xl shadow-xl"
      )}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-slate-900/60" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
            {icon}
          </div>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                isPositive
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
              )}
            >
              {isPositive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {isPositive ? "+" : ""}
              {change}%
            </div>
          )}
        </div>

        <div>
          <p className="text-3xl font-black text-white">
            {prefix}
            {displayValue}
            {suffix}
          </p>
          <p className="text-sm text-slate-400 mt-1">{title}</p>
        </div>
      </div>
    </div>
  );
}
