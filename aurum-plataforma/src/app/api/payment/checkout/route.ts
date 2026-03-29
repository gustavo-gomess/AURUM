import { NextRequest, NextResponse } from "next/server"
import abacatepay, { AURUM_ANNUAL_PLAN } from "@/lib/abacatepay"
import dbConnect from "@/lib/database"

export const dynamic = "force-dynamic"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.aurumnovaescola.com.br"

function sanitizeCPF(value: string): string {
  return value.replace(/\D/g, "")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, taxId, cellphone } = body as {
      name?: string
      email: string
      taxId?: string
      cellphone?: string
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    // Criar cobrança no AbacatePay
    const billing = await abacatepay.billing.create({
      frequency: "ONE_TIME",
      methods: ["PIX"],
      products: [AURUM_ANNUAL_PLAN],
      returnUrl: `${BASE_URL}/#precos`,
      completionUrl: `${BASE_URL}/checkout/sucesso`,
      customer: {
        name: name?.trim() || undefined,
        email: email.trim().toLowerCase(),
        taxId: taxId ? sanitizeCPF(taxId) : undefined,
        cellphone: cellphone?.trim() || undefined,
      },
    })

    if (billing.error) {
      console.error("[Checkout] AbacatePay error:", billing.error)
      return NextResponse.json(
        { error: "Erro ao gerar cobrança. Tente novamente." },
        { status: 400 }
      )
    }

    const prisma = dbConnect()

    // Salvar assinatura pendente no banco
    await prisma.subscription.create({
      data: {
        abacatePayId: billing.data.id,
        status: "PENDING",
        amount: AURUM_ANNUAL_PLAN.price,
        customerEmail: email.trim().toLowerCase(),
        customerName: name?.trim() || null,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json({
      url: billing.data.url,
      billingId: billing.data.id,
    })
  } catch (error: unknown) {
    console.error("[Checkout] Unexpected error:", error)
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    )
  }
}
