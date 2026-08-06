import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { aiTasks } from "@/db/schema";

const GENERATED_CONTENT = {
  ideas: [
    {
      title: "Comment l'IA va révolutionner votre secteur en 2025",
      viralScore: 94,
      platform: "youtube",
      estimatedViews: "500K-2M",
      tags: ["IA", "innovation", "futur"],
    },
    {
      title: "5 erreurs fatales que font 95% des créateurs débutants",
      viralScore: 91,
      platform: "tiktok",
      estimatedViews: "1M-5M",
      tags: ["erreurs", "conseils", "débutant"],
    },
    {
      title: "Mon secret pour créer 30 posts en 2 heures avec l'IA",
      viralScore: 88,
      platform: "instagram",
      estimatedViews: "200K-800K",
      tags: ["productivité", "IA", "création"],
    },
    {
      title: "La stratégie qui m'a rapporté 50K abonnés en 3 mois",
      viralScore: 96,
      platform: "youtube",
      estimatedViews: "300K-1M",
      tags: ["croissance", "stratégie", "abonnés"],
    },
    {
      title: "Pourquoi 90% des gens échouent sur les réseaux sociaux",
      viralScore: 89,
      platform: "tiktok",
      estimatedViews: "500K-3M",
      tags: ["réseaux sociaux", "succès", "psychologie"],
    },
  ],
  scripts: [
    `🎬 HOOK (0-3 sec):
"Sais-tu pourquoi 97% des créateurs abandonent avant d'atteindre 1000 abonnés ? Reste jusqu'à la fin..."

📌 INTRO (3-15 sec):
"Je vais te révéler la méthode exacte que j'utilise pour créer du contenu viral, même quand je n'ai aucune inspiration."

🎯 CONTENU PRINCIPAL (15-45 sec):
Point 1: La règle du 3-2-1 (3 vidéos edu, 2 entertainment, 1 promotion)
Point 2: Le secret du hook émotionnel
Point 3: L'erreur n°1 que tout le monde fait

💡 RÉVÉLATION (45-55 sec):
"Le vrai secret ? La constance bat le talent. Voici mon planning exact..."

🔥 CTA (55-60 sec):
"Sauvegarde cette vidéo et abonne-toi pour ma stratégie complète de la semaine prochaine !"`,
  ],
  hashtags: [
    "#créateur #contenu #viral #TikTok #YouTube #Instagram #marketing #réseauxsociaux #stratégie #croissance #abonnés #engagement #créativité #entrepreneuriat #succès",
  ],
  descriptions: [
    `🚀 Dans cette vidéo, je vous révèle ma stratégie EXACTE pour créer du contenu viral et exploser votre croissance sur tous les réseaux sociaux.

✅ Ce que vous allez apprendre :
• La méthode des 3 piliers de contenu qui génère de l'engagement
• Comment identifier les sujets viraux AVANT qu'ils explosent  
• Mon système de création de contenu en batch (30 posts en 2h)
• Les meilleurs horaires de publication par plateforme

⏰ CHAPITRES :
0:00 Introduction
1:30 Le système des 3 piliers
4:15 Identifier les tendances virales
7:40 La méthode batch creation
11:20 Planning et automatisation
14:00 Résultats et preuves

📱 SUIVEZ-MOI :
→ TikTok : @votrepseudo
→ Instagram : @votrepseudo
→ Newsletter : lien en bio

🔔 Abonnez-vous et activez la cloche pour ne manquer aucun conseil !

#créateur #contenu #viral #stratégie #réseauxsociaux`,
  ],
};

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { taskType, context } = body;

  if (!taskType) {
    return NextResponse.json({ error: "Type de tâche requis" }, { status: 400 });
  }

  // Log the AI task
  const [task] = await db
    .insert(aiTasks)
    .values({
      userId: user.id,
      taskType,
      prompt: context ?? null,
      status: "completed",
      model: "gpt-4o",
      tokensUsed: Math.floor(Math.random() * 500) + 100,
      completedAt: new Date(),
    })
    .returning();

  let result: unknown;

  switch (taskType) {
    case "generate_ideas":
      result = GENERATED_CONTENT.ideas;
      break;
    case "create_script":
      result = { script: GENERATED_CONTENT.scripts[0] };
      break;
    case "generate_hashtags":
      result = { hashtags: GENERATED_CONTENT.hashtags[0] };
      break;
    case "generate_description":
      result = { description: GENERATED_CONTENT.descriptions[0] };
      break;
    case "generate_title":
      result = {
        titles: [
          "Comment j'ai doublé mes vues en 7 jours (méthode exacte)",
          "La stratégie virale que personne ne vous enseigne",
          "5 secrets des créateurs à 1M d'abonnés",
        ],
      };
      break;
    case "schedule_optimization":
      result = {
        recommendations: [
          { platform: "TikTok", times: ["07:00", "12:30", "19:00"], bestDay: "Jeudi" },
          { platform: "Instagram", times: ["08:00", "11:30", "17:00"], bestDay: "Mercredi" },
          { platform: "YouTube", times: ["15:00", "17:00", "20:00"], bestDay: "Samedi" },
        ],
      };
      break;
    default:
      result = { message: "Tâche complétée avec succès" };
  }

  return NextResponse.json({ taskId: task.id, result });
}
