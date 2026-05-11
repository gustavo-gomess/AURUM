"use client"

import Image from "next/image"
import { useState } from "react"

const IMAGEM_BANNER = "/images/banner-curso-principal.png"

export default function CursoPrincipalBanner() {
  const [aberto, setAberto] = useState(false)

  const beneficios = [
    "Sair das dívidas",
    "Organizar sua vida financeira",
    "Criar sua reserva de emergência",
    "Começar a investir",
  ]

  return (
    <section className="bg-black px-6 pb-10">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="curso-principal-detalhes"
          className="group relative block w-full overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/15 via-yellow-500/5 to-transparent transition hover:border-yellow-500/40 hover:scale-[1.005] focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-left"
        >
          <div className="aspect-[16/9] md:aspect-[21/8] w-full" />

          <Image
            src={IMAGEM_BANNER}
            alt="Curso principal: do zero à liberdade financeira"
            fill
            priority
            sizes="(min-width: 1280px) 1152px, 100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(250,222,53,0.18),transparent_60%)]" />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <span className="inline-flex w-fit items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-yellow-400 mb-4">
              CURSO PRINCIPAL
            </span>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-2xl leading-tight">
              Do zero à liberdade financeira
            </h2>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-yellow-400/90">
              <span>{aberto ? "Ocultar detalhes" : "Ver detalhes"}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${aberto ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        <div
          id="curso-principal-detalhes"
          className={`grid transition-all duration-500 ease-in-out ${
            aberto ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900/40 p-6 md:p-8">
              <p className="max-w-2xl text-zinc-300 leading-relaxed">
                Aprenda a sair das dívidas, organizar seu dinheiro e começar a investir com segurança.
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-zinc-200">
                {beneficios.map((beneficio) => (
                  <li key={beneficio} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span>{beneficio}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#trilha"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-black shadow-lg shadow-yellow-500/20 transition hover:scale-105"
              >
                Começar agora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
