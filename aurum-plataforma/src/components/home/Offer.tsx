const included = [
  "Acesso completo à trilha de Educação Financeira",
  "5 cursos extras (Energia Solar, Cozinha Inteligente, Imóveis, Negócios, Renda Online)",
  "Atualizações e novos conteúdos incluídos",
  "Progresso salvo e sequências gamificadas",
  "Acesso em qualquer dispositivo",
  "Suporte direto com nossa equipe via WhatsApp",
]

export default function Offer() {
  return (
    <section id="precos" className="bg-zinc-950 px-6 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] rounded-full bg-yellow-500/5 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/25 bg-yellow-500/8 text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-5">
            Oferta
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Tudo isso por muito menos do que você imagina
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start justify-center">
          {/* Card preço */}
          <div className="w-full md:w-80 rounded-2xl border border-yellow-500/40 bg-gradient-to-br from-yellow-500/[0.08] to-transparent p-8 shadow-2xl shadow-yellow-500/10 flex flex-col items-center text-center shrink-0">
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">Plano completo</span>

            <div className="mb-2">
              <span className="text-zinc-500 text-sm line-through">R$ 79,90/mês</span>
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-zinc-400 text-lg font-medium">R$</span>
              <span className="text-6xl font-black text-white leading-none">29</span>
              <span className="text-zinc-400 text-lg font-medium mb-1">,90</span>
            </div>
            <span className="text-zinc-500 text-sm mb-8">por mês · cancele quando quiser</span>

            <a
              href="/dashboard"
              className="w-full py-4 rounded-xl bg-yellow-400 text-black font-black text-base hover:bg-yellow-300 transition-all duration-200 shadow-xl shadow-yellow-400/25 hover:-translate-y-0.5 text-center block"
            >
              Começar agora
            </a>

            <p className="text-zinc-600 text-xs mt-4">
              7 dias de garantia · Sem fidelidade
            </p>
          </div>

          {/* O que está incluído */}
          <div className="flex-1 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20">
            <p className="text-white font-bold text-base mb-6">O que está incluído:</p>
            <ul className="space-y-4">
              {included.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-yellow-400/15 border border-yellow-400/25 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
