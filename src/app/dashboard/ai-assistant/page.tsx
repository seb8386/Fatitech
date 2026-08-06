"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Lightbulb,
  FileText,
  Hash,
  Clock,
  Flame,
  Wand2,
  TrendingUp,
  Bot,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/platform-icon";

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface GeneratedIdea {
  title: string;
  viralScore: number;
  platform: string;
  estimatedViews: string;
  tags: string[];
}

const QUICK_QUESTIONS = [
  "Pourquoi mes vues diminuent-elles ?",
  "Comment obtenir plus d'abonnés sur TikTok ?",
  "Quelle est la meilleure heure pour publier ?",
  "Pourquoi TikTok recommande moins mes vidéos ?",
  "Quel type de contenu dois-je créer ?",
  "Comment améliorer mon taux d'engagement ?",
];

const AI_TOOLS = [
  { id: "generate_ideas", label: "Idées de contenu", icon: <Lightbulb size={18} />, color: "from-amber-600/20 to-orange-600/20 border-amber-500/30" },
  { id: "create_script", label: "Créer un script", icon: <FileText size={18} />, color: "from-violet-600/20 to-indigo-600/20 border-violet-500/30" },
  { id: "generate_hashtags", label: "Générer des hashtags", icon: <Hash size={18} />, color: "from-blue-600/20 to-cyan-600/20 border-blue-500/30" },
  { id: "schedule_optimization", label: "Optimiser les horaires", icon: <Clock size={18} />, color: "from-emerald-600/20 to-teal-600/20 border-emerald-500/30" },
  { id: "generate_title", label: "Titres SEO", icon: <TrendingUp size={18} />, color: "from-pink-600/20 to-rose-600/20 border-pink-500/30" },
  { id: "generate_description", label: "Description + CTA", icon: <Wand2 size={18} />, color: "from-indigo-600/20 to-purple-600/20 border-indigo-500/30" },
];

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^### (.+)/gm, "<h3 class='text-sm font-bold text-white mt-3 mb-1'>$1</h3>")
    .replace(/^## (.+)/gm, "<h2 class='text-base font-bold text-white mt-3 mb-1'>$2</h2>")
    .replace(/^• (.+)/gm, "<li class='ml-4 list-disc text-slate-300'>$1</li>")
    .replace(/^\d+\. (.+)/gm, "<li class='ml-4 list-decimal text-slate-300'>$1</li>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant IA SocialFlow 🤖\n\nJe peux vous aider à :\n\n• Analyser vos performances réelles PostgreSQL\n• Générer des idées de contenu viral\n• Optimiser vos horaires de publication TikTok\n• Améliorer votre stratégie de croissance\n\nQue souhaitez-vous savoir ?",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "tools">("chat");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [toolResult, setToolResult] = useState<any>(null);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [toolLoading, setToolLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch("/api/ai/chat")
      .then((r) => r.json())
      .then((d) => {
        if (d.messages?.length > 0) setMessages(d.messages);
      })
      .catch(() => {});
  }, []);

  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || sending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message as ChatMessage]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Désolé, une erreur s'est produite. Réessayez.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const runTool = async (toolId: string) => {
    setActiveToolId(toolId);
    setToolLoading(true);
    setToolResult(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskType: toolId }),
      });
      const data = await res.json();
      setToolResult(data.result);
    } finally {
      setToolLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Sparkles size={20} className="text-white" />
              </span>
              Assistant IA
            </h1>
            <p className="text-slate-400 mt-1">Votre copilote IA pour la gestion de vos réseaux sociaux</p>
          </div>
          <div className="flex bg-slate-800 rounded-xl p-1">
            {(["chat", "tools"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {tab === "chat" ? "💬 Chat IA" : "🛠️ Outils IA"}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "chat" ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Chat area */}
            <div className="xl:col-span-3 flex flex-col h-[calc(100vh-220px)] rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                        msg.role === "user"
                          ? "bg-gradient-to-br from-violet-500 to-pink-500"
                          : "bg-gradient-to-br from-violet-600 to-indigo-600"
                      )}
                    >
                      {msg.role === "user" ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Bot size={16} className="text-white" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-violet-600 text-white rounded-tr-sm"
                          : "bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5"
                      )}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(msg.content),
                        }}
                      />
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-3">
                  <input
                    className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder="Posez votre question à l'IA..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || sending}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-40 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick questions */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                <h3 className="text-sm font-bold text-white mb-3">Questions fréquentes</h3>
                <div className="space-y-2">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left text-xs text-slate-300 hover:text-white px-3 py-2.5 rounded-lg bg-white/5 hover:bg-violet-500/10 hover:border-violet-500/30 border border-transparent transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-900/10 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={16} className="text-orange-400" />
                  <span className="text-sm font-bold text-white">Tendances du jour</span>
                </div>
                <div className="space-y-1.5 mt-3">
                  {["#IA2025", "#TikTokGrowth", "#ContentStrategy", "#ViralTips", "#MarketingDigital"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => sendMessage(`Parle-moi de la tendance ${tag}`)}
                      className="block w-full text-left text-xs text-violet-300 hover:text-violet-200 py-1 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tools grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {AI_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => runTool(tool.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-5 rounded-2xl border bg-gradient-to-br",
                    tool.color,
                    "hover:scale-105 transition-all duration-200",
                    activeToolId === tool.id && "ring-2 ring-violet-500"
                  )}
                >
                  <div className="text-violet-300">{tool.icon}</div>
                  <span className="text-sm font-medium text-white text-center">{tool.label}</span>
                </button>
              ))}
            </div>

            {/* Tool results */}
            {toolLoading && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-12 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400">L&apos;IA génère votre contenu...</p>
              </div>
            )}

            {toolResult && !toolLoading && activeToolId === "generate_ideas" && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <h2 className="text-lg font-bold text-white mb-4">💡 Idées de contenu générées</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {(toolResult as GeneratedIdea[]).map((idea, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <PlatformIcon platform={idea.platform} size={30} />
                        <span className="text-sm font-black text-emerald-400">{idea.viralScore}% viral</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2">{idea.title}</h3>
                      <p className="text-xs text-slate-400">{idea.estimatedViews} vues estimées</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {idea.tags?.map((tag: string) => (
                          <span key={tag} className="text-[10px] text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
