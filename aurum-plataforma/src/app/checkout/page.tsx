"use client"

import { useState } from "react"
import Link from "next/link"

type PaymentMethod = "pix" | "card"

function formatCPF(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function PixIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.45 16.52l-3.01-3.01a.6.6 0 00-.88 0l-3.01 3.01a2.44 2.44 0 01-1.72.71h-.6l3.8 3.8a2.84 2.84 0 004.02 0l3.82-3.82h-.72a2.44 2.44 0 01-1.7-.69zM8.55 7.48l3.01 3.01a.62.62 0 00.88 0l3.01-3.01a2.44 2.44 0 011.7-.71h.72L14.05 2.97a2.84 2.84 0 00-4.02 0l-3.8 3.8h.6c.65 0 1.26.25 1.72.71z" />
      <path d="M21.03 9.95l-2.07-2.08h-1.61c-.38 0-.75.15-1.02.42l-3.01 3.01a1.82 1.82 0 01-2.56 0L7.75 8.3a1.44 1.44 0 00-1.02-.42H4.96l-2 2.07a2.84 2.84 0 000 4.02l2.07 2.07h1.61c.38 0 .75-.15 1.02-.42l3.01-3.01a1.82 1.82 0 012.56 0l3.01 3.01c.27.27.64.42 1.02.42h1.68l2.07-2.07a2.84 2.84 0 00.02-4.02z" />
    </svg>
  )
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" strokeLinecap="round" />
    </svg>
  )
}

export default function CheckoutPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [taxId, setTaxId] = useState("")
  const [cellphone, setCellphone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isCard = paymentMethod === "card"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          taxId: taxId.replace(/\D/g, "") || undefined,
          cellphone: cellphone.replace(/\D/g, "") || undefined,
          paymentMethod,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao gerar cobrança. Tente novamente.")
        return
      }

      localStorage.setItem("abacate_billing_id", data.billingId)
      localStorage.setItem("abacate_billing_email", email.trim())
      localStorage.setItem("abacate_payment_method", paymentMethod)

      window.location.href = data.url
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* ── Resumo do pedido ──────────────────────────────────────────── */}
        <div>
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">
            Plano Anual
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-6">
            AURUM Nova Escola
          </h1>

          {/* Preço */}
          <div className="p-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 mb-6">
            <div className="flex items-end gap-1 mb-1">
              <span className="text-zinc-400 text-base">R$</span>
              <span className="text-5xl font-black text-white leading-none">39</span>
              <span className="text-zinc-400 text-base mb-0.5">/mês</span>
            </div>
            <p className="text-zinc-500 text-sm">
              Cobrado anualmente — R$ 468 no total
            </p>
            <div className="mt-3 pt-3 border-t border-yellow-400/10">
              <p className="text-yellow-300 text-xs font-semibold">
                Equivale a R$ 1,30 por dia
              </p>
            </div>
          </div>

          {/* Aviso de renovação automática (cartão) */}
          {isCard && (
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 mb-6">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <p className="text-blue-300 text-sm font-semibold mb-1">
                    Renovação automática
                  </p>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Ao pagar com cartão, sua assinatura será renovada automaticamente
                    a cada 12 meses pelo valor de R$ 468,00. Você pode cancelar a
                    renovação a qualquer momento antes da próxima cobrança.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* O que está incluído */}
          <ul className="flex flex-col gap-3">
            {[
              "Curso completo de educação financeira",
              "Novos cursos chegando em breve",
              "Suporte direto via WhatsApp",
              "1 ano de acesso completo",
              "7 dias de garantia",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                <svg
                  className="w-4 h-4 text-yellow-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Formulário ────────────────────────────────────────────────── */}
        <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40">

          {/* Seletor de método de pagamento */}
          <div className="mb-6">
            <p className="text-zinc-400 text-sm font-medium mb-3">
              Forma de pagamento
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                  isCard
                    ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-300"
                    : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <CardIcon className="w-5 h-5" />
                Cartão
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                  !isCard
                    ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-300"
                    : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <PixIcon className="w-5 h-5" />
                PIX
              </button>
            </div>

            {isCard && (
              <p className="text-zinc-600 text-xs mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Cobrança recorrente — renova automaticamente a cada ano
              </p>
            )}
          </div>

          <h2 className="text-white font-bold text-lg mb-6">
            {isCard ? "Seus dados para o cartão" : "Seus dados para o PIX"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1.5">
                Nome completo {isCard && <span className="text-yellow-400">*</span>}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="João da Silva"
                autoComplete="name"
                required={isCard}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400/60 transition-colors text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1.5">
                Email <span className="text-yellow-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400/60 transition-colors text-sm"
              />
              <p className="text-zinc-600 text-xs mt-1">
                Será o email de acesso à plataforma
              </p>
            </div>

            {/* CPF */}
            <div>
              <label htmlFor="taxId" className="block text-sm font-medium text-zinc-400 mb-1.5">
                CPF {isCard
                  ? <span className="text-yellow-400">*</span>
                  : <span className="text-zinc-600 text-xs font-normal">(recomendado para PIX)</span>
                }
              </label>
              <input
                id="taxId"
                type="text"
                inputMode="numeric"
                value={taxId}
                onChange={(e) => setTaxId(formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                required={isCard}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400/60 transition-colors text-sm"
              />
            </div>

            {/* Celular */}
            <div>
              <label htmlFor="cellphone" className="block text-sm font-medium text-zinc-400 mb-1.5">
                WhatsApp <span className="text-zinc-600 text-xs font-normal">(para suporte)</span>
              </label>
              <input
                id="cellphone"
                type="tel"
                inputMode="tel"
                value={cellphone}
                onChange={(e) => setCellphone(formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                autoComplete="tel"
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400/60 transition-colors text-sm"
              />
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Termos para cartão */}
            {isCard && (
              <p className="text-zinc-600 text-xs leading-relaxed">
                Ao prosseguir, você autoriza a cobrança automática de R$ 468,00 no
                seu cartão a cada 12 meses até que você cancele. Cancele a qualquer
                momento sem multa.
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || (isCard && (!name || !taxId))}
              className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-black text-base hover:bg-yellow-300 transition-all duration-200 shadow-xl shadow-yellow-400/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Gerando cobrança...
                </>
              ) : isCard ? (
                <>
                  <CardIcon className="w-5 h-5" />
                  Assinar com cartão — R$ 468/ano
                </>
              ) : (
                <>
                  <PixIcon className="w-5 h-5" />
                  Pagar com PIX — R$ 468
                </>
              )}
            </button>

            <p className="text-zinc-700 text-xs text-center">
              Ao continuar, você será redirecionado para a página de pagamento seguro da AbacatePay.
              {" "}
              <Link href="/" className="text-zinc-500 hover:text-zinc-400 underline transition-colors">
                Cancelar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
