"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type Totals = {
  sim: number
  nao: number
  total: number
}

const EVENTO = {
  titulo: "Apresentacao Aurum para os pais",
  escola: "Colegio Adventista de Criciuma",
  data: "11/05/2026",
  horario: "19:00",
}

export default function ConfirmacaoPresencaPage() {
  const [totals, setTotals] = useState<Totals>({ sim: 0, nao: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [sendingVote, setSendingVote] = useState<"SIM" | "NAO" | null>(null)
  const [voted, setVoted] = useState<"SIM" | "NAO" | null>(null)
  const [error, setError] = useState<string | null>(null)

  const pctSim = useMemo(() => {
    if (!totals.total) return 0
    return Math.round((totals.sim / totals.total) * 100)
  }, [totals])

  const pctNao = useMemo(() => {
    if (!totals.total) return 0
    return Math.round((totals.nao / totals.total) * 100)
  }, [totals])

  async function fetchTotals() {
    const response = await fetch("/api/evento-presenca", { cache: "no-store" })
    if (!response.ok) throw new Error("Falha ao carregar votos")
    const data = (await response.json()) as Totals
    setTotals(data)
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        await fetchTotals()
      } catch {
        if (mounted) setError("Nao foi possivel carregar os votos agora.")
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  async function submitVote(vote: "SIM" | "NAO") {
    try {
      setError(null)
      setSendingVote(vote)

      const response = await fetch("/api/evento-presenca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote }),
      })

      if (!response.ok) {
        throw new Error("Falha ao registrar voto")
      }

      const data = (await response.json()) as Totals
      setTotals(data)
      setVoted(vote)
    } catch {
      setError("Nao foi possivel registrar seu voto. Tente novamente.")
    } finally {
      setSendingVote(null)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl shadow-black/40">
          <span className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-yellow-400">
            Confirmacao de presenca
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight">
            {EVENTO.titulo}
          </h1>

          <p className="mt-3 text-zinc-300">
            Evento no <strong className="text-white">{EVENTO.escola}</strong>, dia{" "}
            <strong className="text-white">{EVENTO.data}</strong> as{" "}
            <strong className="text-white">{EVENTO.horario}</strong>.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Esta enquete registra somente os votos de presenca (Sim/Não), sem coletar dados pessoais.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => submitVote("SIM")}
              disabled={sendingVote !== null}
              className="rounded-xl bg-yellow-400 px-4 py-3 text-black font-bold hover:bg-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sendingVote === "SIM" ? "Enviando..." : "Sim, vou comparecer"}
            </button>

            <button
              type="button"
              onClick={() => submitVote("NAO")}
              disabled={sendingVote !== null}
              className="rounded-xl border border-zinc-700 px-4 py-3 text-zinc-200 font-bold hover:border-zinc-500 hover:bg-zinc-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sendingVote === "NAO" ? "Enviando..." : "Não vou comparecer"}
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-sm text-zinc-400">Parcial da enquete</p>
            {loading ? (
              <p className="mt-2 text-zinc-300">Carregando votos...</p>
            ) : (
              <>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-zinc-300">Sim</span>
                  <span className="text-yellow-400 font-semibold">
                    {totals.sim} voto(s) - {pctSim}%
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-zinc-300">Não</span>
                  <span className="text-zinc-200 font-semibold">
                    {totals.nao} voto(s) - {pctNao}%
                  </span>
                </div>
                <div className="mt-2 text-xs text-zinc-500">
                  Total de votos: {totals.total}
                </div>
              </>
            )}
          </div>

          {voted && (
            <div className="mt-8 rounded-xl border border-green-500/40 bg-green-500/10 p-4">
              <p className="text-green-300 font-semibold">
                Obrigado! Seu voto "{voted === "SIM" ? "Sim" : "Não"}" foi registrado.
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                Se quiser, voce pode acessar a plataforma Aurum agora:
              </p>
              <Link
                href="https://www.aurumnovaescola.com.br/"
                className="mt-4 inline-flex items-center rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-300 transition"
              >
                Acessar Plataforma
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
