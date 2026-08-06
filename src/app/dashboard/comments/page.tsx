"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Shield,
  Trash2,
  EyeOff,
  Star,
  Bot,
  Search,
  AlertTriangle,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { Input } from "@/components/ui/input";

interface CommentItem {
  id: string;
  authorName?: string | null;
  content: string;
  platform?: string | null;
  time?: string | null;
  createdAt: string;
  isSpam: boolean;
  isToxic: boolean;
  isHidden: boolean;
  isImportant: boolean;
  aiResponse?: string | null;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedComment, setSelectedComment] = useState<CommentItem | null>(null);
  const [aiReply, setAiReply] = useState("");
  const [generatingReply, setGeneratingReply] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/comments");
      const data = await res.json();
      setComments(data.comments ?? []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const filteredComments = comments.filter((c) => {
    if (filter === "spam" && !c.isSpam) return false;
    if (filter === "toxic" && !c.isToxic) return false;
    if (filter === "important" && !c.isImportant) return false;
    if (filter === "hidden" && !c.isHidden) return false;
    if (search && !c.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const generateAIReply = async (comment: CommentItem) => {
    setGeneratingReply(true);
    setSelectedComment(comment);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskType: "comment_response", prompt: comment.content }),
      });
      const data = await res.json();
      if (data.result?.response) {
        setAiReply(data.result.response);
      } else {
        setAiReply("Merci beaucoup pour votre commentaire ! 🙏 Nous sommes ravis d'avoir vos retours !");
      }
    } catch {
      setAiReply("Merci pour votre retour ! C'est très apprécié !");
    } finally {
      setGeneratingReply(false);
    }
  };

  const toggleHide = async (id: string, current: boolean) => {
    await fetch("/api/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isHidden: !current }),
    });
    fetchComments();
  };

  const toggleImportant = async (id: string, current: boolean) => {
    await fetch("/api/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isImportant: !current }),
    });
    fetchComments();
  };

  const deleteComment = async (id: string) => {
    await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
    fetchComments();
  };

  const spamCount = comments.filter((c) => c.isSpam).length;
  const toxicCount = comments.filter((c) => c.isToxic).length;
  const importantCount = comments.filter((c) => c.isImportant).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Gestion des commentaires</h1>
          <p className="text-slate-400 mt-1">Modération IA et réponses automatiques réelles PostgreSQL</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/10 border border-emerald-500/30">
          <Bot size={16} className="text-emerald-400" />
          <span className="text-sm font-medium text-emerald-300">Modération IA active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total commentaires", value: comments.length, color: "text-white", icon: <MessageSquare size={18} className="text-slate-400" /> },
          { label: "Spams détectés", value: spamCount, color: "text-amber-400", icon: <AlertTriangle size={18} className="text-amber-400" /> },
          { label: "Commentaires toxiques", value: toxicCount, color: "text-red-400", icon: <Shield size={18} className="text-red-400" /> },
          { label: "Importants", value: importantCount, color: "text-violet-400", icon: <Star size={18} className="text-violet-400" /> },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between mb-2">
              {s.icon}
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Comments list */}
        <div className="xl:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-xs">
              <Input
                placeholder="Rechercher..."
                icon={<Search size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex bg-slate-800 rounded-xl p-1">
              {["all", "important", "spam", "toxic", "hidden"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    filter === f ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {f === "all" ? "Tous" : f === "important" ? "⭐ Importants" : f === "spam" ? "🚫 Spam" : f === "toxic" ? "⚠️ Toxiques" : "👁️ Masqués"}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-16 text-center">
              <MessageSquare size={44} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Aucun commentaire trouvé</h3>
              <p className="text-xs text-slate-400">Les nouveaux commentaires synchronisés apparaîtront ici.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`rounded-2xl border bg-slate-900/80 p-5 transition-all ${
                    comment.isSpam
                      ? "border-amber-500/30 bg-amber-900/10"
                      : comment.isToxic
                      ? "border-red-500/30 bg-red-900/10"
                      : comment.isImportant
                      ? "border-violet-500/30"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {(comment.authorName?.[0] ?? "U").toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">@{comment.authorName || "utilisateur"}</span>
                          {comment.platform && <PlatformIcon platform={comment.platform} size={18} />}
                          {comment.isSpam && <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">SPAM</span>}
                          {comment.isToxic && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">TOXIQUE</span>}
                          {comment.isImportant && <Star size={14} className="text-amber-400 fill-amber-400" />}
                          {comment.isHidden && <EyeOff size={14} className="text-slate-500" />}
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>

                      <p className="text-sm text-slate-300 mb-2">{comment.content}</p>

                      {/* AI Response */}
                      {comment.aiResponse && (
                        <div className="mt-3 p-3 rounded-xl bg-violet-900/20 border border-violet-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Bot size={13} className="text-violet-400" />
                            <span className="text-xs font-medium text-violet-300">Réponse IA automatique</span>
                          </div>
                          <p className="text-xs text-slate-300">{comment.aiResponse}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => generateAIReply(comment)}
                        className="p-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-all"
                        title="Répondre avec l'IA"
                      >
                        <Bot size={14} />
                      </button>
                      <button
                        onClick={() => toggleImportant(comment.id, comment.isImportant)}
                        className={`p-2 rounded-lg transition-all ${
                          comment.isImportant
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-white/5 hover:bg-white/10 text-slate-400"
                        }`}
                        title="Marquer important"
                      >
                        <Star size={14} />
                      </button>
                      <button
                        onClick={() => toggleHide(comment.id, comment.isHidden)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all"
                        title="Masquer"
                      >
                        <EyeOff size={14} />
                      </button>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Reply Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
            <h3 className="text-sm font-bold text-white mb-4">🤖 Réponse IA</h3>

            {generatingReply ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400">Génération en cours...</p>
              </div>
            ) : selectedComment ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Commentaire de @{selectedComment.authorName || "Utilisateur"}</p>
                  <p className="text-xs text-slate-300">{selectedComment.content}</p>
                </div>
                {aiReply && (
                  <div className="p-3 rounded-xl bg-violet-900/20 border border-violet-500/20">
                    <p className="text-xs text-violet-300 mb-1">Réponse suggérée :</p>
                    <p className="text-xs text-slate-200">{aiReply}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot size={32} className="text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">
                  Cliquez sur l&apos;icône robot d&apos;un commentaire pour générer une réponse IA
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
