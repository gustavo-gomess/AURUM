import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/database"
import { hashPassword } from "@/lib/auth"

export const dynamic = "force-dynamic"

// Gera senha aleatória segura para novos usuários
function generateTempPassword(length = 12): string {
  const chars =
    "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$"
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("")
}

export async function POST(request: NextRequest) {
  try {
    // ── Validação do webhook secret ────────────────────────────────────────
    const webhookSecret = process.env.ABACATEPAY_WEBHOOK_SECRET
    if (webhookSecret) {
      const authHeader = request.headers.get("authorization")
      if (authHeader !== `Bearer ${webhookSecret}`) {
        console.warn("[Webhook] Unauthorized request")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const payload = await request.json()

    // AbacatePay pode enviar { event: "...", data: {...} } ou direto o objeto
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const billing = (payload?.data?.id ? payload.data : payload) as any

    const billingId: string | undefined = billing?.id
    const status: string | undefined = billing?.status

    if (!billingId) {
      return NextResponse.json({ ok: true })
    }

    console.log(`[Webhook] Received billing ${billingId} — status: ${status}`)

    // Só processa pagamentos confirmados
    if (status !== "PAID") {
      return NextResponse.json({ ok: true })
    }

    const prisma = dbConnect()

    // Buscar assinatura pendente
    const subscription = await prisma.subscription.findUnique({
      where: { abacatePayId: billingId },
    })

    if (!subscription) {
      console.error("[Webhook] Subscription not found for billing:", billingId)
      return NextResponse.json({ ok: true })
    }

    // Idempotência — não processa duas vezes
    if (subscription.status === "ACTIVE") {
      console.log("[Webhook] Already activated, skipping:", billingId)
      return NextResponse.json({ ok: true })
    }

    const email = subscription.customerEmail

    // ── Criar usuário se não existir ──────────────────────────────────────
    let userId = subscription.userId
    let tempPassword: string | null = null

    if (!userId) {
      let user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        tempPassword = generateTempPassword()
        const hashedPassword = await hashPassword(tempPassword)

        user = await prisma.user.create({
          data: {
            name: subscription.customerName || email.split("@")[0],
            email,
            password: hashedPassword,
            role: "STUDENT",
          },
        })

        console.log(
          `[Webhook] New user created: ${email} | tempPassword: ${tempPassword}`
        )
      }

      userId = user.id
    }

    // ── Ativar assinatura ─────────────────────────────────────────────────
    await prisma.subscription.update({
      where: { abacatePayId: billingId },
      data: {
        status: "ACTIVE",
        userId,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    })

    console.log(`[Webhook] ✅ Subscription activated for ${email}`)

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    console.error("[Webhook] Error:", error)
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    )
  }
}
