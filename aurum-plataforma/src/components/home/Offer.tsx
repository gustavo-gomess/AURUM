const included = [
  "Acesso completo à trilha de Educação Financeira",
  "Cursos extras em breve",
  "Atualizações e novos conteúdos incluídos",
  "Progresso salvo e sequências gamificadas",
  "Acesso em qualquer dispositivo",
  "Suporte direto com nossa equipe via WhatsApp",
]

const CHECKOUT_URL = "/checkout"

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
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">Plano anual</span>

            <div className="mb-2">
              <span className="text-zinc-500 text-sm line-through">R$ 79,90/mês</span>
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-zinc-400 text-lg font-medium">R$</span>
              <span className="text-6xl font-black text-white leading-none">39</span>
              <span className="text-zinc-400 text-lg font-medium mb-1">/mês</span>
            </div>
            <span className="text-zinc-500 text-sm mb-2">parcelado em 12x no cartão</span>

            <div className="w-full mb-6 py-2 px-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-300 text-xs font-semibold">
                Total: R$ 468 — 1 ano de acesso completo
              </p>
            </div>

            <a
              href={CHECKOUT_URL}
              className="w-full py-4 rounded-xl bg-yellow-400 text-black font-black text-base hover:bg-yellow-300 transition-all duration-200 shadow-xl shadow-yellow-400/25 hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M2 5h2l3.6 7.59L6.25 15c-.16.28-.25.61-.25.96C6 17.1 6.9 18 8 18h12v-2H8.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.46 5H4.21l-.94-2H0v2h2zM7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm13 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              Quero assinar agora — PIX
            </a>

            <p className="text-zinc-600 text-xs mt-4">
              7 dias de garantia · Pagamento seguro via AbacatePay
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

            <div className="mt-8 p-4 rounded-xl border border-zinc-700 bg-zinc-900/50">
              <p className="text-zinc-400 text-xs leading-relaxed">
                🔒 <strong className="text-zinc-300">Pagamento 100% seguro:</strong> você será redirecionado para a página da AbacatePay. Pague via PIX e seu acesso é liberado automaticamente em até 1 minuto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
