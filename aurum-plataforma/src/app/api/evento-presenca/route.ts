import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/database"

export const dynamic = "force-dynamic"

type VoteOption = "SIM" | "NAO"

const EVENT_SLUG = "colegio-adventista-criciuma-2026-05-11"

async function ensureVotesTable() {
  const prisma = dbConnect()
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS event_presence_votes (
      id TEXT PRIMARY KEY,
      event_slug TEXT NOT NULL,
      vote_option TEXT NOT NULL CHECK (vote_option IN ('SIM', 'NAO')),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

async function getVoteTotals() {
  const prisma = dbConnect()
  const rows = await prisma.$queryRawUnsafe<Array<{ sim: bigint | number; nao: bigint | number }>>(
    `
      SELECT
        COALESCE(SUM(CASE WHEN vote_option = 'SIM' THEN 1 ELSE 0 END), 0) AS sim,
        COALESCE(SUM(CASE WHEN vote_option = 'NAO' THEN 1 ELSE 0 END), 0) AS nao
      FROM event_presence_votes
      WHERE event_slug = $1
    `,
    EVENT_SLUG
  )

  const firstRow = rows[0] ?? { sim: 0, nao: 0 }
  const sim = Number(firstRow.sim)
  const nao = Number(firstRow.nao)

  return {
    sim,
    nao,
    total: sim + nao,
  }
}

export async function GET() {
  try {
    await ensureVotesTable()
    const totals = await getVoteTotals()
    return NextResponse.json(totals)
  } catch (error) {
    console.error("Erro ao buscar votos de presenca:", error)
    return NextResponse.json({ error: "Erro ao carregar enquete" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const vote = String(body?.vote ?? "").toUpperCase() as VoteOption

    if (vote !== "SIM" && vote !== "NAO") {
      return NextResponse.json({ error: "Voto invalido" }, { status: 400 })
    }

    await ensureVotesTable()
    const prisma = dbConnect()

    await prisma.$executeRawUnsafe(
      `
        INSERT INTO event_presence_votes (id, event_slug, vote_option)
        VALUES ($1, $2, $3)
      `,
      crypto.randomUUID(),
      EVENT_SLUG,
      vote
    )

    const totals = await getVoteTotals()
    return NextResponse.json(totals, { status: 201 })
  } catch (error) {
    console.error("Erro ao registrar voto de presenca:", error)
    return NextResponse.json({ error: "Erro ao registrar voto" }, { status: 500 })
  }
}
