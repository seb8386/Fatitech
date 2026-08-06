"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlatformIcon } from "@/components/platform-icon";
import { formatDateTime, formatNumber } from "@/lib/utils";

interface Post {
  id: string;
  title?: string | null;
  content: string;
  status: string;
  postType: string;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  platform?: string;
  viewsCount?: number | null;
  likesCount?: number | null;
  isAiGenerated?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Brouillon", color: "bg-slate-500/20 text-slate-400", icon: <Edit3 size={12} /> },
  scheduled: { label: "Planifié", color: "bg-violet-500/20 text-violet-300", icon: <Clock size={12} /> },
  published: { label: "Publié", color: "bg-emerald-500/20 text-emerald-400", icon: <CheckCircle2 size={12} /> },
  failed: { label: "Échoué", color: "bg-red-500/20 text-red-400", icon: <XCircle size={12} /> },
};

interface NewPostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function NewPostModal({ onClose, onSuccess }: NewPostModalProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState("text");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const generateWithAI = async () => {
    setAiGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskType: "generate_description" }),
      });
      const data = await res.json();
      if (data.result?.description) {
        setContent(data.result.description);
      }
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          title: title || null,
          postType,
          status: scheduledAt ? "scheduled" : "draft",
          scheduledAt: scheduledAt || null,
        }),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Nouvelle publication</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Titre (optionnel)"
            placeholder="Titre de votre publication..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Type de contenu</label>
            <div className="flex gap-2 flex-wrap">
              {["text", "image", "video", "reel", "story", "short"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPostType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    postType === t
                      ? "bg-violet-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-300">Contenu</label>
              <button
                type="button"
                onClick={generateWithAI}
                disabled={aiGenerating}
                className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Sparkles size={12} />
                {aiGenerating ? "Génération..." : "Générer avec l'IA"}
              </button>
            </div>
            <textarea
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none transition-all"
              placeholder="Rédigez votre publication..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Planifier (optionnel)</label>
            <input
              type="datetime-local"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" isLoading={loading} className="flex-1">
              {scheduledAt ? "Planifier" : "Enregistrer brouillon"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 space-y-6">
      {showModal && (
        <NewPostModal onClose={() => setShowModal(false)} onSuccess={fetchPosts} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Publications</h1>
          <p className="text-slate-400 mt-1">Gérez et planifiez vos publications réelles PostgreSQL</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} className="mr-2" />
          Nouvelle publication
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Rechercher une publication..."
            icon={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
          {["all", "draft", "scheduled", "published", "failed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {f === "all" ? "Tous" : STATUS_CONFIG[f]?.label ?? f}
            </button>
          ))}
        </div>
        <button className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <Filter size={18} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: posts.length, color: "text-white" },
          { label: "Planifiés", value: posts.filter((p) => p.status === "scheduled").length, color: "text-violet-400" },
          { label: "Publiés", value: posts.filter((p) => p.status === "published").length, color: "text-emerald-400" },
          { label: "Brouillons", value: posts.filter((p) => p.status === "draft").length, color: "text-slate-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-20 text-center">
          <Calendar size={48} className="text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-1">Aucune publication trouvée</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-4">
            Vous n&apos;avez encore créé aucune publication. Lancez-vous dès maintenant !
          </p>
          <Button onClick={() => setShowModal(true)}>
            Créer votre première publication
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => {
            const statusConfig = STATUS_CONFIG[post.status] ?? STATUS_CONFIG.draft;
            return (
              <div
                key={post.id}
                className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 hover:border-white/20 transition-all group"
              >
                <div className="flex items-start gap-4">
                  {post.platform && (
                    <PlatformIcon platform={post.platform} size={38} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {post.title && (
                          <h3 className="text-base font-bold text-white">{post.title}</h3>
                        )}
                        <p className="text-sm text-slate-400 line-clamp-2 mt-1">{post.content}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {post.isAiGenerated && (
                          <span className="flex items-center gap-1 text-[10px] text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                            <Sparkles size={9} />IA
                          </span>
                        )}
                        <span
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      {post.scheduledAt && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock size={12} />
                          {formatDateTime(post.scheduledAt)}
                        </div>
                      )}
                      <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full capitalize">
                        {post.postType}
                      </span>
                      {(post.viewsCount ?? 0) > 0 && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Eye size={12} />
                          {formatNumber(post.viewsCount ?? 0)} vues
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                      <Edit3 size={15} />
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
