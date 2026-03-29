import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/database"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Props) {
  const { id } = await params

  try {
    const prisma = dbConnect()

    const subscription = await prisma.subscription.findUnique({
      where: { abacatePayId: id },
      select: {
        status: true,
        customerEmail: true,
        expiresAt: true,
        userId: true,
        updatedAt: true,
      },
    })

    if (!subscription) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(subscription)
  } catch (error: unknown) {
    console.error("[PaymentStatus] Error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
