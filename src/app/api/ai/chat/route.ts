import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { aiChatMessages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const AI_RESPONSES: Record<string, string> = {
  default: `Je suis votre assistant IA SocialFlow ! Je peux vous aider avec :

• 📊 **Analyse de vos performances** - Comprendre vos statistiques
• 🎯 **Stratégie de contenu** - Idées et recommandations personnalisées  
• ⏰ **Meilleurs horaires** - Quand publier pour maximiser l'engagement
• 🔥 **Tendances virales** - Sujets tendance dans votre niche
• 💬 **Gestion des commentaires** - Automatisation des réponses
• 🚀 **Croissance** - Stratégies pour gagner des abonnés

Que souhaitez-vous savoir ?`,
};

function generateAIResponse(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes("vue") && (msg.includes("diminue") || msg.includes("baisse") || msg.includes("chute"))) {
    return `**Analyse de la baisse des vues** 📉

D'après les patterns que j'observe, voici les causes probables :

1. **Fréquence irrégulière** : L'algorithme pénalise les créateurs qui publient de manière incohérente
2. **Horaires inadaptés** : Vos publications ne touchent pas votre audience à son pic d'activité
3. **Rétention faible** : Si les spectateurs quittent avant 30% de la vidéo, l'algo réduit la distribution
4. **Engagement initial** : Les 2 premières heures sont cruciales

**Actions recommandées** :
- Publiez à 18h30 ou 20h00 (vos meilleurs créneaux)
- Utilisez un hook fort dans les 3 premières secondes
- Posez une question dans le caption pour générer des commentaires
- Répondez aux 10 premiers commentaires dans l'heure`;
  }

  if (msg.includes("abonné") || msg.includes("follower") || msg.includes("subscriber")) {
    return `**Stratégie pour gagner des abonnés** 🚀

Basé sur votre niche et vos données, voici ce qui fonctionne en 2025 :

**Court terme (0-30 jours)** :
- Créez des vidéos sur des sujets trending avec faible concurrence
- Collaborez avec 2-3 créateurs de taille similaire
- Publiez 1-2x par jour (cohérence > quantité)

**Moyen terme (30-90 jours)** :
- Développez une série récurrente (ex: "Tip du lundi")
- Optimisez vos titres avec des mots-clés à forte intention
- Utilisez les Stories pour maintenir l'engagement quotidien

**Stratégie SEO** :
- Intégrez vos mots-clés cibles dans les 150 premiers caractères
- Utilisez 3-5 hashtags ultra-ciblés plutôt que 30 hashtags génériques

Voulez-vous que je génère un plan de contenu sur 30 jours ?`;
  }

  if (msg.includes("publier") || msg.includes("horaire") || msg.includes("heure")) {
    return `**Meilleurs horaires de publication** ⏰

Basé sur l'analyse de votre audience, voici vos créneaux optimaux :

**TikTok** : 07h00, 12h30, 19h00 (pic engagement : mardi & jeudi)
**Instagram** : 08h00, 11h30, 17h00 (pic : mercredi & vendredi)
**YouTube** : 15h00, 17h00, 20h00 (pic : samedi & dimanche)
**LinkedIn** : 07h30, 12h00, 17h30 (pic : mardi & mercredi)

**Aujourd'hui, je recommande** :
- Publiez sur TikTok à **19h00** (forte activité prévisionnelle)
- Programmez votre Story Instagram à **17h00**

Le système peut planifier automatiquement vos publications aux meilleurs créneaux. Voulez-vous activer la publication intelligente ?`;
  }

  if (msg.includes("tiktok") && (msg.includes("recommande") || msg.includes("algorithm") || msg.includes("algo"))) {
    return `**Comprendre l'algorithme TikTok** 🎯

L'algorithme TikTok priorise ces facteurs (par ordre d'importance) :

1. **Taux de complétion** (40%) : % de spectateurs qui regardent jusqu'à la fin
2. **Engagement ratio** (25%) : Likes + commentaires + partages / vues
3. **Partages** (20%) : Le signal le plus puissant
4. **Replay** (15%) : Les gens qui regardent plusieurs fois

**Pourquoi votre distribution baisse** :
- Score de complétion < 30% → l'algo limit la diffusion
- Peu de commentaires dans les premières 2h
- Hashtags trop génériques (pas de niche)

**Solutions immédiates** :
- Hook visuel fort dans les 1.5 premières secondes
- Texte à l'écran pour augmenter la rétention
- CTA clair : "Garde pour plus tard" (booste les saves)
- Publiez entre 18h et 21h pendant 2 semaines consécutives`;
  }

  if (msg.includes("vidéo") || msg.includes("video") || msg.includes("contenu") || msg.includes("idée")) {
    return `**Idées de contenu viral pour votre niche** 💡

Voici les formats qui performent le mieux en ce moment :

🔥 **Formats tendance** :
1. "J'ai testé X pendant 30 jours, voici ce qui s'est passé"
2. "5 erreurs que font 90% des gens" (très partageable)
3. "Ce que les experts ne vous disent pas sur X"
4. "De 0 à [résultat] en [temps] - ma méthode exacte"
5. "Réaction à [contenu viral] dans votre domaine"

📅 **Plan de contenu suggéré (cette semaine)** :
- Lundi : Contenu éducatif (conseil pratique)
- Mercredi : Behind the scenes / authentique
- Vendredi : Contenu de divertissement dans votre niche
- Dimanche : Bilan / engagement avec la communauté

Voulez-je que génère des scripts complets pour ces idées ?`;
  }

  return AI_RESPONSES.default;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const messages = await db
    .select()
    .from(aiChatMessages)
    .where(eq(aiChatMessages.userId, user.id))
    .orderBy(desc(aiChatMessages.createdAt))
    .limit(50);

  return NextResponse.json({ messages: messages.reverse() });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { message } = body;

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message requis" }, { status: 400 });
  }

  // Save user message
  await db.insert(aiChatMessages).values({
    userId: user.id,
    role: "user",
    content: message,
  });

  // Generate AI response
  const aiResponse = generateAIResponse(message);

  // Save AI response
  const [saved] = await db
    .insert(aiChatMessages)
    .values({
      userId: user.id,
      role: "assistant",
      content: aiResponse,
      tokensUsed: Math.floor(aiResponse.length / 4),
    })
    .returning();

  return NextResponse.json({ message: saved });
}
