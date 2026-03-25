import { BlogStep } from "@/data/blog"

type Props = {
  steps: BlogStep[]
}

export default function BlogSteps({ steps }: Props) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12" id="passo-a-passo">
      {/* Section header */}
      <div className="mb-10">
        <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">
          Passo a passo
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          5 Passos Para Sair das Dívidas
        </h2>
        <p className="text-zinc-500 mt-3 text-base">
          Siga essa sequência na ordem. Cada passo depende do anterior para funcionar de verdade.
        </p>
      </div>

      {/* Steps */}
      <ol className="flex flex-col gap-6" role="list">
        {steps.map((step) => (
          <li key={step.number} className="group relative">
            <article className="flex gap-5 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-200">
              {/* Number */}
              <div className="shrink-0 w-11 h-11 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                <span className="text-yellow-400 font-black text-sm tabular-nums">
                  {String(step.number).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-base sm:text-lg mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>

                {/* Tip */}
                {step.tip && (
                  <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-yellow-400/8 border border-yellow-400/20">
                    <svg
                      className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-yellow-200/80 text-xs sm:text-sm leading-relaxed">
                      <strong className="text-yellow-300 font-semibold">Dica: </strong>
                      {step.tip}
                    </p>
                  </div>
                )}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
