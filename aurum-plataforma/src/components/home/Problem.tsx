const problems = [
  "Ganhar dinheiro sem saber para onde ele vai no fim do mês",
  "Sentir que nunca sobra nada, mesmo trabalhando muito",
  "Não entender investimentos e ficar paralisado com medo de errar",
  "Ver o dinheiro perdendo valor enquanto fica parado na conta",
  "Depender de um único salário e não ter nenhuma renda extra",
  "Não ter clareza sobre metas financeiras ou como alcançá-las",
]

export default function Problem() {
  return (
    <section className="bg-[#0a0a0a] px-6 py-24 relative overflow-hidden">
      {/* Glow sutil */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[500px] h-[200px] bg-red-900/10 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold uppercase tracking-widest mb-5">
            O problema
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Você trabalha muito,{" "}
            <span className="text-red-400">mas o dinheiro some.</span>
          </h2>
          <p className="mt-5 text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Não é falta de esforço. É falta de educação financeira. E ninguém te ensinou isso na escola.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {problems.map((problem, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-colors duration-200"
            >
              <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full border border-red-500/40 bg-red-500/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </span>
              <p className="text-zinc-300 text-sm leading-relaxed">{problem}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-zinc-500 text-sm">
          Se você se identificou com pelo menos um desses pontos,{" "}
          <span className="text-yellow-400 font-semibold">a AURUM foi feita para você.</span>
        </p>
      </div>
    </section>
  )
}
