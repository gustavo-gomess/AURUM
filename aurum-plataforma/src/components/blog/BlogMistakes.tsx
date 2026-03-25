import { BlogMistake } from "@/data/blog"

type Props = {
  mistakes: BlogMistake[]
}

export default function BlogMistakes({ mistakes }: Props) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12 border-t border-zinc-800/50" id="erros-comuns">
      {/* Section header */}
      <div className="mb-10">
        <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
          Atenção
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          Erros Que Mantêm Você Preso nas Dívidas
        </h2>
        <p className="text-zinc-500 mt-3 text-base">
          Evitar esses comportamentos vale tanto quanto seguir o passo a passo.
        </p>
      </div>

      {/* Mistakes grid */}
      <ul className="grid gap-4 sm:grid-cols-2" role="list">
        {mistakes.map((mistake, index) => (
          <li key={index}>
            <article className="h-full p-5 rounded-2xl border border-red-500/15 bg-red-500/5 hover:border-red-500/25 hover:bg-red-500/8 transition-all duration-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0 leading-none mt-0.5" aria-hidden="true">
                  {mistake.icon}
                </span>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base mb-2 leading-snug">
                    {mistake.title}
                  </h3>
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                    {mistake.description}
                  </p>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
