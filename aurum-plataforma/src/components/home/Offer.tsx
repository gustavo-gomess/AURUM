const included = [
  "Acesso completo à trilha de Educação Financeira",
  "Cursos extras em breve",
  "Atualizações e novos conteúdos incluídos",
  "Progresso salvo e sequências gamificadas",
  "Acesso em qualquer dispositivo",
  "Suporte direto com nossa equipe via WhatsApp",
]

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=55&text=Ol%C3%A1%2C+quero+assinar+a+AURUM+por+R%2439%2Fm%C3%AAs&type=phone_number&app_absent=0"

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
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-yellow-400 text-black font-black text-base hover:bg-yellow-300 transition-all duration-200 shadow-xl shadow-yellow-400/25 hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.571a.5.5 0 0 0 .61.637l5.939-1.56A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.853 0-3.587-.5-5.084-1.375l-.361-.214-3.757.986.999-3.648-.235-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Quero assinar via WhatsApp
            </a>

            <p className="text-zinc-600 text-xs mt-4">
              7 dias de garantia · Pagamento seguro via InfinitPay
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
                💬 <strong className="text-zinc-300">Como funciona:</strong> clique no botão, entre em contato pelo WhatsApp e nossa equipe envia o link de pagamento seguro via InfinitPay. Acesso liberado em minutos após a confirmação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
