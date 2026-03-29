"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type PaymentStatus = "loading" | "pending" | "active" | "error"

const MAX_POLLS = 40     // 40 × 3s = 2 minutos
const POLL_INTERVAL = 3000 // 3 segundos

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState<PaymentStatus>("loading")
  const [email, setEmail] = useState("")
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    const billingId = localStorage.getItem("abacate_billing_id")
    const storedEmail = localStorage.getItem("abacate_billing_email")

    if (storedEmail) setEmail(storedEmail)

    if (!billingId) {
      setStatus("error")
      return
    }

    let polls = 0

    const poll = async () => {
      try {
        const res = await fetch(`/api/payment/status/${billingId}`)
        if (!res.ok) {
          polls++
          setPollCount(polls)
          if (polls >= MAX_POLLS) setStatus("error")
          return
        }

        const data = await res.json()

        if (data.status === "ACTIVE") {
          setStatus("active")
          localStorage.removeItem("abacate_billing_id")
          localStorage.removeItem("abacate_billing_email")
          clearInterval(timer)
          return
        }

        polls++
        setPollCount(polls)
        setStatus("pending")

        if (polls >= MAX_POLLS) {
          setStatus("error")
          clearInterval(timer)
        }
      } catch {
        polls++
        if (polls >= MAX_POLLS) setStatus("error")
      }
    }

    // Primeira checagem imediata
    poll()
    const timer = setInterval(poll, POLL_INTERVAL)

    return () => clearInterval(timer)
  }, [])

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-md w-full text-center">

        {/* ── Pago e ativo ─────────────────────────────────────────── */}
        {status === "active" && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-400/15 border-2 border-green-400/40 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">
                Pagamento confirmado!
              </h1>
              <p className="text-zinc-400 text-base leading-relaxed">
                Sua conta foi criada com sucesso.
                {email && (
                  <>
                    {" "}Faça login com o email{" "}
                    <strong className="text-yellow-400">{email}</strong>.
                  </>
                )}
              </p>
            </div>

            <div className="w-full p-4 rounded-xl bg-yellow-400/8 border border-yellow-400/20 text-left">
              <p className="text-yellow-200 text-sm leading-relaxed">
                <strong className="text-yellow-300">Próximo passo:</strong>{" "}
                faça login com seu email. Caso precise de suporte para acessar sua senha,{" "}
                <a
                  href="https://api.whatsapp.com/send/?phone=55&text=Ol%C3%A1%2C+acabei+de+pagar+o+plano+AURUM+e+preciso+de+ajuda+para+acessar+minha+conta&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 underline hover:text-yellow-300 transition-colors"
                >
                  entre em contato pelo WhatsApp
                </a>.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-yellow-400 text-black font-black text-base hover:bg-yellow-300 transition-all duration-200 shadow-xl shadow-yellow-400/20 hover:-translate-y-0.5"
            >
              Acessar minha conta →
            </Link>
          </div>
        )}

        {/* ── Aguardando confirmação ────────────────────────────────── */}
        {(status === "loading" || status === "pending") && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
              <div
                className="absolute inset-0 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"
                style={{ animationDuration: "1.2s" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                </svg>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black text-white mb-2">
                Aguardando confirmação do PIX
              </h1>
              <p className="text-zinc-400 text-base">
                Estamos verificando o pagamento automaticamente...
              </p>
            </div>

            <div className="w-full p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 text-left">
              <p className="text-zinc-400 text-sm leading-relaxed">
                <strong className="text-zinc-300">Como funciona:</strong>{" "}
                após confirmar o PIX no seu banco, o acesso é liberado em até 1 minuto automaticamente.
              </p>
            </div>

            {pollCount > 5 && (
              <p className="text-zinc-600 text-xs">
                Verificando... ({Math.round((pollCount * POLL_INTERVAL) / 1000)}s)
              </p>
            )}
          </div>
        )}

        {/* ── Erro / timeout ────────────────────────────────────────── */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-black text-white mb-3">
                Não conseguimos confirmar ainda
              </h1>
              <p className="text-zinc-400 text-base leading-relaxed">
                Se você já pagou, não se preocupe — o acesso será liberado assim que o pagamento for processado pelo banco.
              </p>
            </div>

            <a
              href="https://api.whatsapp.com/send/?phone=55&text=Ol%C3%A1%2C+efetuei+o+pagamento+do+plano+AURUM+mas+minha+conta+n%C3%A3o+foi+ativada&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-yellow-400 text-black font-black text-sm hover:bg-yellow-300 transition-all duration-200"
            >
              Falar com suporte no WhatsApp →
            </a>

            <Link href="/" className="text-zinc-600 text-sm hover:text-zinc-400 transition-colors">
              Voltar para a página inicial
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
