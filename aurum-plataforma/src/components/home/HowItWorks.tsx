const steps = [
  {
    number: "01",
    title: "Acesse a plataforma",
    description: "Faça seu cadastro e tenha acesso imediato a todos os cursos e à trilha guiada.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Siga a trilha guiada",
    description: "Comece pelo módulo de Mentalidade e avance no seu ritmo — cada etapa desbloqueia a próxima.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Transforme conhecimento em resultado",
    description: "Aplique o que aprendeu, acompanhe seu progresso e veja sua vida financeira mudar.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-zinc-950 px-6 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-5">
            Como funciona
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Simples. Direto. Eficiente.
          </h2>
          <p className="mt-4 text-zinc-500 text-base max-w-xl mx-auto">
            Sem complicação. Em 3 passos você já está aprendendo e evoluindo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Linha conectora (desktop) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-zinc-800 via-yellow-500/30 to-zinc-800" />

          {steps.map((step, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:border-yellow-500/20 hover:bg-yellow-500/[0.03] transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 mb-5 group-hover:bg-yellow-400/15 group-hover:border-yellow-400/30 transition-all duration-300">
                {step.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500/60 mb-2">
                Passo {step.number}
              </span>
              <h3 className="text-white font-bold text-base mb-3 leading-snug">{step.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
