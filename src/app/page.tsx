import Link from "next/link";
import {
  Zap,
  Sparkles,
  TrendingUp,
  Calendar,
  BarChart3,
  MessageSquare,
  Shield,
  Check,
  ArrowRight,
  Star,
  Users,
  Eye,
  Target,
  Clock,
  Flame,
  Globe,
  Bot,
} from "lucide-react";

const PLATFORMS = [
  { name: "TikTok", bg: "#010101", letter: "T" },
  { name: "YouTube", bg: "#FF0000", letter: "Y" },
  { name: "Instagram", bg: "linear-gradient(135deg,#f09433,#dc2743,#bc1888)", letter: "ig" },
  { name: "LinkedIn", bg: "#0A66C2", letter: "in" },
  { name: "X", bg: "#000000", letter: "𝕏" },
  { name: "Facebook", bg: "#1877F2", letter: "f" },
  { name: "Pinterest", bg: "#E60023", letter: "P" },
  { name: "Threads", bg: "#000000", letter: "@" },
];

const FEATURES = [
  {
    icon: <Sparkles size={24} className="text-violet-400" />,
    title: "IA Générative de Contenu",
    description: "Générez automatiquement scripts, descriptions, hashtags optimisés SEO et titres viraux pour toutes vos plateformes.",
    color: "from-violet-600/20 to-indigo-600/20 border-violet-500/30",
  },
  {
    icon: <Calendar size={24} className="text-blue-400" />,
    title: "Publication Automatique",
    description: "Planifiez et publiez automatiquement au meilleur moment selon les données d'engagement de votre audience.",
    color: "from-blue-600/20 to-cyan-600/20 border-blue-500/30",
  },
  {
    icon: <BarChart3 size={24} className="text-emerald-400" />,
    title: "Analytique Avancée",
    description: "Tableaux de bord en temps réel avec évolution des abonnés, vues, engagement et revenus YouTube.",
    color: "from-emerald-600/20 to-teal-600/20 border-emerald-500/30",
  },
  {
    icon: <MessageSquare size={24} className="text-pink-400" />,
    title: "Modération IA des Commentaires",
    description: "Répondez, filtrez les spams, masquez les commentaires toxiques et gérez votre communauté automatiquement.",
    color: "from-pink-600/20 to-rose-600/20 border-pink-500/30",
  },
  {
    icon: <Target size={24} className="text-amber-400" />,
    title: "Campagnes Publicitaires IA",
    description: "Créez, optimisez et analysez vos campagnes sur toutes les plateformes avec des recommandations IA.",
    color: "from-amber-600/20 to-orange-600/20 border-amber-500/30",
  },
  {
    icon: <Bot size={24} className="text-indigo-400" />,
    title: "Assistant IA Intégré",
    description: "Un chatbot IA expert en réseaux sociaux disponible 24h/24 pour répondre à toutes vos questions stratégiques.",
    color: "from-indigo-600/20 to-purple-600/20 border-indigo-500/30",
  },
];

const PRICING = [
  {
    name: "Gratuit",
    price: 0,
    accounts: 2,
    posts: 30,
    credits: 50,
    features: ["2 comptes sociaux", "30 publications/mois", "50 crédits IA", "Analytique de base", "Calendrier éditorial"],
    popular: false,
    cta: "Commencer gratuitement",
  },
  {
    name: "Starter",
    price: 19,
    accounts: 5,
    posts: 100,
    credits: 200,
    features: ["5 comptes sociaux", "100 publications/mois", "200 crédits IA", "Analytique avancée", "Publication automatique", "Modération IA"],
    popular: false,
    cta: "Essai 14 jours gratuits",
  },
  {
    name: "Pro",
    price: 49,
    accounts: 15,
    posts: 500,
    credits: 1000,
    features: ["15 comptes sociaux", "500 publications/mois", "1000 crédits IA", "Toutes les fonctionnalités", "Support prioritaire", "API Access", "Campagnes pub IA"],
    popular: true,
    cta: "Essai 14 jours gratuits",
  },
  {
    name: "Business",
    price: 149,
    accounts: 50,
    posts: 2000,
    credits: 5000,
    features: ["50 comptes sociaux", "2000 publications/mois", "5000 crédits IA", "Multi-workspace", "Gestion d'équipe", "White-label", "Support dédié"],
    popular: false,
    cta: "Contacter les ventes",
  },
];

const TESTIMONIALS = [
  {
    name: "Sophie Martin",
    role: "Créatrice · 580K TikTok",
    avatar: "S",
    avatarBg: "from-pink-500 to-orange-500",
    content: "SocialFlow a complètement transformé ma façon de créer. L'IA génère des idées que je n'aurais jamais trouvées seule. +120K abonnés en 4 mois !",
    stars: 5,
  },
  {
    name: "Alexandre Dubois",
    role: "Agence Marketing · 30 clients",
    avatar: "A",
    avatarBg: "from-blue-500 to-indigo-500",
    content: "Gérer 30 clients avec SocialFlow, c'est comme avoir une équipe de 10 personnes. L'automatisation IA nous a fait économiser 40h/semaine.",
    stars: 5,
  },
  {
    name: "Laura Fontaine",
    role: "Influenceuse · 1.2M YouTube",
    avatar: "L",
    avatarBg: "from-violet-500 to-pink-500",
    content: "Le meilleur investissement que j'ai fait pour ma chaîne. Les analyses IA m'ont aidé à comprendre exactement pourquoi mes vidéos performaient ou non.",
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-black">
              Social<span className="text-violet-400">Flow</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Fonctionnalités", "Tarifs", "Témoignages", "À propos"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-3xl" />
          {/* Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8">
              <Flame size={14} className="text-orange-400" />
              Plateforme n°1 de gestion IA des réseaux sociaux
              <ArrowRight size={14} />
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-8">
              <span className="text-white">Automatisez vos</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400">
                Réseaux Sociaux
              </span>
              <br />
              <span className="text-white">avec l&apos;IA 🚀</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Créez, planifiez et publiez du contenu viral sur TikTok, YouTube, Instagram et 5 autres plateformes.
              L&apos;IA s&apos;occupe de tout — idées, scripts, hashtags, réponses aux commentaires, analyses.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/register"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105"
              >
                <Sparkles size={20} />
                Démarrer gratuitement
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/20 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all"
              >
                Voir la démo live
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-violet-400" />
                <span><strong className="text-white">50 000+</strong> créateurs</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-violet-400" />
                <span><strong className="text-white">8</strong> plateformes</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span><strong className="text-white">4.9/5</strong> satisfaction</span>
              </div>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 z-10 pointer-events-none" style={{ top: "60%" }} />
            <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-violet-900/40">
              <img
                src="/images/dashboard-preview.png"
                alt="SocialFlow Dashboard"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-16 border-y border-white/5 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-slate-500 mb-10 uppercase tracking-wider font-medium">
            Connectez toutes vos plateformes
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {PLATFORMS.map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-2 group">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform"
                  style={{ background: p.bg }}
                >
                  {p.letter}
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalités" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4">
              Tout ce dont vous avez besoin
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                pour dominer les réseaux sociaux
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Une suite complète d&apos;outils IA pour automatiser entièrement votre présence en ligne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className={`rounded-2xl border bg-gradient-to-br ${feature.color} p-6 hover:scale-105 transition-all duration-300`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Créateurs actifs", icon: <Users size={24} className="text-violet-400" /> },
              { value: "2M+", label: "Publications auto", icon: <Calendar size={24} className="text-blue-400" /> },
              { value: "500M+", label: "Vues générées", icon: <Eye size={24} className="text-emerald-400" /> },
              { value: "98%", label: "Taux de satisfaction", icon: <Star size={24} className="text-amber-400" /> },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-3">
                {stat.icon}
                <p className="text-5xl font-black text-white">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features deep dive */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 border border-violet-500/30 text-violet-300 text-sm font-medium mb-6">
                <Sparkles size={14} />
                Intelligence Artificielle Avancée
              </div>
              <h2 className="text-5xl font-black text-white mb-6 leading-tight">
                Votre IA personnelle
                <br />
                pour les réseaux sociaux
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Notre IA analyse des millions de données en temps réel pour vous proposer des recommandations ultra-personnalisées.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Flame size={18} />, text: "Détecte les tendances virales avant tout le monde", color: "text-orange-400" },
                  { icon: <Clock size={18} />, text: "Optimise vos horaires de publication automatiquement", color: "text-blue-400" },
                  { icon: <TrendingUp size={18} />, text: "Prédit le score viral de chaque idée de contenu", color: "text-emerald-400" },
                  { icon: <Shield size={18} />, text: "Modère les commentaires avec une précision de 99.2%", color: "text-violet-400" },
                  { icon: <Globe size={18} />, text: "Supporte 50+ langues pour une portée mondiale", color: "text-indigo-400" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className={`${item.color} flex-shrink-0`}>{item.icon}</div>
                    <span className="text-slate-300">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
              >
                Essayer l&apos;IA gratuitement
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="space-y-4">
              {/* AI Chat preview */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">Assistant IA SocialFlow</span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full ml-auto animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">U</div>
                    <div className="bg-slate-800 rounded-xl rounded-tl-sm px-3 py-2 text-sm text-slate-300">
                      Pourquoi mes vues TikTok ont baissé cette semaine ?
                    </div>
                  </div>
                  <div className="flex gap-2 flex-row-reverse">
                    <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                      <Bot size={13} className="text-white" />
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/20 rounded-xl rounded-tr-sm px-3 py-2 text-sm text-slate-200 max-w-[85%]">
                      <strong>Analyse :</strong> 3 facteurs expliquent cette baisse :<br/>
                      1. Fréquence réduite (-40%)<br/>
                      2. Horaires inadaptés (publié à 14h vs 19h optimal)<br/>
                      3. Hook trop lent (+3s pour accrocher)<br/>
                      <span className="text-emerald-400">→ Publiez ce soir à 19h avec un hook fort !</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Viral ideas preview */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                <p className="text-xs text-slate-400 mb-3 font-medium">💡 Idées virales générées par l&apos;IA</p>
                <div className="space-y-2">
                  {[
                    { title: "5 erreurs fatales que font 97% des créateurs", score: 94 },
                    { title: "Comment j'ai gagné 50K abonnés en 30 jours", score: 91 },
                    { title: "L'IA va-t-elle remplacer les créateurs de contenu ?", score: 88 },
                  ].map((idea) => (
                    <div key={idea.title} className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-xs text-slate-300">{idea.title}</span>
                      <span className="text-xs font-bold text-emerald-400 ml-2 flex-shrink-0">{idea.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4">Tarifs simples et transparents</h2>
            <p className="text-xl text-slate-400">Commencez gratuitement. Évoluez au rythme de votre croissance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 relative ${
                  plan.popular
                    ? "border-violet-500 bg-gradient-to-br from-violet-900/30 to-indigo-900/30 shadow-xl shadow-violet-500/20"
                    : "border-white/10 bg-slate-900/80"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold text-white shadow-lg">
                      ⭐ Le plus populaire
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}€</span>
                  <span className="text-slate-400 text-sm">/mois</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check size={14} className="text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
                      : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="témoignages" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4">Ils nous font confiance</h2>
            <p className="text-xl text-slate-400">50 000+ créateurs et agences utilisent SocialFlow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white font-bold`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-900/30 via-indigo-900/30 to-slate-900 p-12 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-500/30">
                <Zap size={28} className="text-white" />
              </div>
              <h2 className="text-5xl font-black text-white mb-4">
                Prêt à exploser votre croissance ?
              </h2>
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                Rejoignez 50 000+ créateurs qui automatisent leur présence sociale avec SocialFlow. Commencez gratuitement dès aujourd&apos;hui.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105"
                >
                  <Sparkles size={20} />
                  Commencer gratuitement
                  <ArrowRight size={20} />
                </Link>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                ✓ Gratuit pour toujours · ✓ Sans carte bancaire · ✓ Prêt en 2 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-lg font-black text-white">
                Social<span className="text-violet-400">Flow</span>
              </span>
            </div>
            <p className="text-sm text-slate-500">
              © 2025 SocialFlow AI. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
