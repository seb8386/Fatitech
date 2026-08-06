import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { payments } from "@/db/schema";

const MPESA_PHONE_NUMBER = "0838654948";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, phoneNumber, planId } = body;

    if (!amount || !phoneNumber) {
      return NextResponse.json(
        { error: "Montant et numéro de téléphone requis" },
        { status: 400 }
      );
    }

    if (amount < 10) {
      return NextResponse.json(
        { error: "Le montant minimum est de 10 KES" },
        { status: 400 }
      );
    }

    // Validate phone number format (Kenya: 254XXXXXXXXX or 07XXXXXXXXX)
    const formattedPhone = phoneNumber.startsWith("0")
      ? "254" + phoneNumber.slice(1)
      : phoneNumber;

    if (!/^254[0-9]{9}$/.test(formattedPhone)) {
      return NextResponse.json(
        { error: "Format de numéro invalide. Utilisez 07XXXXXXXXX ou 254XXXXXXXXX" },
        { status: 400 }
      );
    }

    // Generate transaction reference
    const transactionRef = `FATI${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create payment record
    const [payment] = await db
      .insert(payments)
      .values({
        userId: user.id,
        amount: amount,
        currency: "KES",
        method: "mpesa",
        status: "pending",
        transactionRef,
        phoneNumber: formattedPhone,
        metadata: {
          planId: planId || null,
          merchantPhone: MPESA_PHONE_NUMBER,
        },
      })
      .returning();

    // In production, you would call the actual Mpesa API here
    // For now, we'll simulate the payment initiation
    const mpesaResponse = {
      MerchantRequestID: transactionRef,
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      CustomerMessage: `Payment of KES ${amount} initiated. Enter your M-PESA PIN to complete.`,
    };

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        transactionRef: payment.transactionRef,
        amount: payment.amount,
        status: payment.status,
      },
      mpesaResponse,
    });
  } catch (error) {
    console.error("Mpesa initiate error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
