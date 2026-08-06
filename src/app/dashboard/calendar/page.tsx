"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import Link from "next/link";

const DAYS_OF_WEEK = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

interface CalendarPost {
  id: string;
  title: string;
  platform: string;
  time: string;
  color: string;
  status: "scheduled" | "published" | "draft";
  scheduledAt: string;
}

export default function CalendarPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [postsByDay, setPostsByDay] = useState<Record<number, CalendarPost[]>>({});
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  useEffect(() => {
    async function loadCalendar() {
      setLoading(true);
      try {
        const res = await fetch("/api/calendar");
        if (res.ok) {
          const data = await res.json();
          const items: Array<{ id: string; title: string; platform?: string; scheduledAt: string; status?: string; color?: string }> = [
            ...(data.posts || []),
            ...(data.calendar || []),
          ];

          const mapped: Record<number, CalendarPost[]> = {};
          items.forEach((item) => {
            if (!item.scheduledAt) return;
            const d = new Date(item.scheduledAt);
            if (d.getFullYear() === year && d.getMonth() === month) {
              const dayNum = d.getDate();
              if (!mapped[dayNum]) mapped[dayNum] = [];
              mapped[dayNum].push({
                id: item.id,
                title: item.title,
                platform: item.platform || "tiktok",
                time: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                color: item.color || "#7c3aed",
                status: (item.status as "scheduled" | "published" | "draft") || "scheduled",
                scheduledAt: item.scheduledAt,
              });
            }
          });

          setPostsByDay(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch calendar data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCalendar();
  }, [year, month]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const selectedPosts = selectedDay ? postsByDay[selectedDay] ?? [] : [];
  const totalScheduled = Object.values(postsByDay).flat().filter((p) => p.status === "scheduled").length;
  const totalPublished = Object.values(postsByDay).flat().filter((p) => p.status === "published").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Calendrier éditorial</h1>
          <p className="text-slate-400 mt-1">Planifiez et visualisez vos publications réelles</p>
        </div>
        <Link href="/dashboard/posts">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
            <Plus size={16} />
            Planifier
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Publications ce mois", value: totalScheduled + totalPublished, color: "text-white" },
          { label: "Planifiées", value: totalScheduled, color: "text-violet-400" },
          { label: "Publiées", value: totalPublished, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-slate-900/80 p-6">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-white">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="text-center text-xs font-bold text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 rounded-xl" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = day === selectedDay;
                const dayPosts = postsByDay[day] ?? [];

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-16 rounded-xl p-1.5 text-left transition-all hover:bg-white/10 relative ${
                      isSelected
                        ? "bg-violet-600/30 border border-violet-500/50"
                        : isToday
                        ? "bg-white/10 border border-white/20"
                        : "border border-transparent hover:border-white/10"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? "text-violet-400"
                          : isSelected
                          ? "text-violet-300"
                          : "text-slate-400"
                      }`}
                    >
                      {day}
                    </span>
                    <div className="mt-0.5 space-y-0.5">
                      {dayPosts.slice(0, 2).map((post) => (
                        <div
                          key={post.id}
                          className="h-1.5 rounded-full opacity-80"
                          style={{ backgroundColor: post.color }}
                        />
                      ))}
                      {dayPosts.length > 2 && (
                        <span className="text-[9px] text-slate-500">+{dayPosts.length - 2}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected day details */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
          <h3 className="text-lg font-bold text-white mb-2">
            {selectedDay
              ? `${selectedDay} ${MONTHS[month]}`
              : "Sélectionnez un jour"}
          </h3>

          {selectedDay && (
            <div className="space-y-3">
              {selectedPosts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon size={20} className="text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-500">Aucune publication ce jour-là</p>
                  <Link href="/dashboard/posts" className="inline-block mt-3 text-xs text-violet-400 hover:text-violet-300 font-semibold">
                    + Planifier une publication
                  </Link>
                </div>
              ) : (
                selectedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <PlatformIcon platform={post.platform} size={28} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{post.title}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock size={11} className="text-slate-500" />
                          <span className="text-xs text-slate-500">{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        post.status === "published"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : post.status === "scheduled"
                          ? "bg-violet-500/20 text-violet-300"
                          : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {post.status === "published" ? "Publié" : post.status === "scheduled" ? "Planifié" : "Brouillon"}
                    </span>
                  </div>
                ))
              )}

              <Link href="/dashboard/posts" className="block w-full">
                <button className="w-full py-2.5 rounded-xl border border-dashed border-white/20 text-xs text-slate-400 hover:border-violet-500/50 hover:text-violet-400 transition-all">
                  + Ajouter une publication
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
