const differentials = [
  {
    title: "Trilha guiada",
    description: "Nada de conteúdo aleatório. Você segue uma jornada estruturada do básico ao avançado, na ordem certa.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    title: "Acesso ilimitado",
    description: "Um único plano para todos os cursos. Assine e acesse tudo — sem pagar por curso individual.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "Conteúdo prático",
    description: "Aulas curtas e diretas ao ponto. Sem papo furado. Você aprende e já consegue aplicar no mesmo dia.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "No seu ritmo",
    description: "Assista quando e onde quiser. A plataforma salva seu progresso e você retoma de onde parou.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function Differentials() {
  return (
    <section className="bg-black px-6 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-5">
            Por que a AURUM
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            O que nos diferencia
          </h2>
          <p className="mt-4 text-zinc-500 text-base max-w-xl mx-auto">
            Não somos mais um curso de finanças. Somos uma escola completa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {differentials.map((item, i) => (
            <div
              key={i}
              className="group flex gap-5 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 hover:border-yellow-500/25 hover:bg-yellow-500/[0.03] transition-all duration-300"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/15 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400/15 group-hover:border-yellow-400/25 transition-all duration-300">
                {item.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
