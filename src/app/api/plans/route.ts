import { NextResponse } from "next/server";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allPlans = await db
      .select()
      .from(plans)
      .where(eq(plans.isActive, true))
      .orderBy(plans.priceUsd);

    return NextResponse.json({ plans: allPlans });
  } catch (error) {
    console.error("Get plans error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
