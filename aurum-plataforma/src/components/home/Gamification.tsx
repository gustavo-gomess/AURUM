const achievements = [
  { emoji: "🔥", label: "Sequência de 7 dias" },
  { emoji: "🏆", label: "Primeiro módulo concluído" },
  { emoji: "💡", label: "Mentalidade desbloqueada" },
  { emoji: "📈", label: "Investidor iniciante" },
  { emoji: "⭐", label: "Top 10% da semana" },
  { emoji: "🎯", label: "Meta financeira definida" },
]

export default function Gamification() {
  return (
    <section className="bg-zinc-950 px-6 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

      {/* Glow central dourado */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] rounded-full bg-yellow-500/6 blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/25 bg-yellow-500/8 text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-6">
              Gamificação
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-5">
              Aprender vicia.{" "}
              <span className="text-yellow-400">Aqui ainda mais.</span>
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed mb-6">
              A cada aula concluída você desbloqueia conquistas, sobe de nível e mantém sua sequência ativa. Aprender nunca foi tão envolvente.
            </p>
            <ul className="space-y-3">
              {["Sequências diárias que te mantêm consistente", "Conquistas por módulo desbloqueado", "Ranking semanal entre alunos"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
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

          {/* Conquistas */}
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                  i === 0
                    ? "border-yellow-500/40 bg-yellow-500/8 shadow-lg shadow-yellow-500/10"
                    : "border-zinc-800 bg-zinc-900/30 opacity-60"
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className={`text-xs font-semibold leading-tight ${i === 0 ? "text-yellow-300" : "text-zinc-500"}`}>
                  {item.label}
                </span>
                {i === 0 && (
                  <span className="ml-auto text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-full shrink-0">
                    NOVO
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
