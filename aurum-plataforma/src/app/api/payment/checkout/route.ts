import { NextRequest, NextResponse } from "next/server"
import abacatepay, {
  AURUM_ANNUAL_PLAN,
  createSubscription,
} from "@/lib/abacatepay"
import dbConnect from "@/lib/database"

export const dynamic = "force-dynamic"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.aurumnovaescola.com.br"

function sanitizeCPF(value: string): string {
  return value.replace(/\D/g, "")
}

type CheckoutBody = {
  name?: string
  email: string
  taxId?: string
  cellphone?: string
  paymentMethod?: "pix" | "card"
}

async function handlePixCheckout(body: CheckoutBody) {
  const { name, email, taxId, cellphone } = body

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

  if (billing.error || !billing.data) {
    console.error("[Checkout/PIX] AbacatePay error:", billing.error)
    return null
  }

  return { url: billing.data.url, billingId: billing.data.id }
}

async function handleCardCheckout(body: CheckoutBody) {
  const { name, email, taxId, cellphone } = body

  // 1. Criar (ou reutilizar) customer no AbacatePay para vincular à assinatura
  const customer = await abacatepay.customer.create({
    name: name?.trim() || undefined,
    email: email.trim().toLowerCase(),
    taxId: taxId ? sanitizeCPF(taxId) : undefined,
    cellphone: cellphone?.trim() || undefined,
  })

  if (customer.error || !customer.data) {
    console.error("[Checkout/Card] Customer creation error:", customer.error)
    return null
  }

  // 2. Criar assinatura recorrente (YEARLY, CARD) via API v2
  const subscription = await createSubscription({
    customerId: customer.data.id,
    externalId: `aurum-sub-${Date.now()}`,
    methods: ["CARD"],
    returnUrl: `${BASE_URL}/#precos`,
    completionUrl: `${BASE_URL}/checkout/sucesso`,
  })

  if (!subscription.data || subscription.error) {
    console.error("[Checkout/Card] Subscription error:", subscription.error)
    return null
  }

  return { url: subscription.data.url, billingId: subscription.data.id }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutBody
    const { email, name, paymentMethod = "pix" } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    const isCard = paymentMethod === "card"

    const result = isCard
      ? await handleCardCheckout(body)
      : await handlePixCheckout(body)

    if (!result) {
      return NextResponse.json(
        { error: "Erro ao gerar cobrança. Tente novamente." },
        { status: 400 }
      )
    }

    const prisma = dbConnect()

    await prisma.subscription.create({
      data: {
        abacatePayId: result.billingId,
        status: "PENDING",
        amount: AURUM_ANNUAL_PLAN.price,
        paymentMethod: isCard ? "CARD" : "PIX",
        autoRenew: isCard,
        customerEmail: email.trim().toLowerCase(),
        customerName: name?.trim() || null,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json({
      url: result.url,
      billingId: result.billingId,
      paymentMethod,
    })
  } catch (error: unknown) {
    console.error("[Checkout] Unexpected error:", error)
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    )
  }
}
