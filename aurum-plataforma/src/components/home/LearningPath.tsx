import Link from "next/link"

export default function LearningPath() {
  return (
    <section id="trilha" className="relative bg-zinc-950 px-6 py-24 overflow-hidden scroll-mt-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

      <div className="max-w-xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-5">
          Trilha principal
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Sua jornada começa aqui
        </h2>
        <p className="text-zinc-500 mt-4 text-base leading-relaxed">
          A trilha completa, o módulo introdutório e a aula gratuita estão na página do curso principal. Acesse para ver todos os módulos e começar pelo básico.
        </p>
        <Link
          href="/curso-principal"
          className="mt-10 inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-yellow-400 text-black font-bold text-base hover:bg-yellow-300 transition-all duration-200 shadow-xl shadow-yellow-500/25 hover:-translate-y-0.5"
        >
          Ver trilha e aula grátis
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
