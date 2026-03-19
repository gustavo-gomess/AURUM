export default function Solution() {
  return (
    <section className="relative bg-black px-6 py-24 overflow-hidden">
      {/* Glow dourado central */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] rounded-full bg-yellow-500/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/25 bg-yellow-500/8 text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-5">
            A solução
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Uma plataforma completa para você construir{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
              liberdade financeira de verdade
            </span>
          </h2>
          <p className="mt-5 text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A AURUM reúne cursos, trilhas guiadas e conteúdos práticos em uma única plataforma — no seu ritmo, sem enrolação.
          </p>
        </div>

        {/* Comparação */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sem AURUM */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">Sem a AURUM</p>
            <ul className="space-y-4">
              {[
                "Conteúdo espalhado e sem ordem",
                "Sem direção clara de onde começar",
                "Teoria sem aplicação prática",
                "Sozinho, sem comunidade",
                "Sem acompanhar seu progresso",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-500 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Com AURUM */}
          <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/[0.06] to-transparent p-8 shadow-xl shadow-yellow-500/5">
            <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-6">Com a AURUM</p>
            <ul className="space-y-4">
              {[
                "Trilha guiada do básico ao avançado",
                "Você sabe exatamente qual passo dar",
                "Aulas curtas, diretas e aplicáveis",
                "Comunidade de alunos ativos",
                "Progresso visível a cada aula",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-200 text-sm">
                  <span className="w-5 h-5 rounded-full bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center shrink-0">
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
