import Link from "next/link"
import { getCourseContent } from "@/data/modules"

const content = getCourseContent("educacao-financeira")
const modules = content?.modules ?? []

function LockIcon() {
  return (
    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export default function LearningPath() {
  return (
    <section id="trilha" className="relative bg-zinc-950 px-6 py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-5">
            Trilha principal
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Sua jornada começa aqui
          </h2>
          <p className="text-zinc-500 mt-3 text-base max-w-sm mx-auto leading-relaxed">
            Siga os módulos na ordem certa. Cada etapa desbloqueia a próxima.
          </p>
        </div>

        {/* Module timeline */}
        <div className="relative flex flex-col">
          {modules.map((mod, index) => {
            const isActive = index === 0
            const isLast = index === modules.length - 1

            return (
              <div key={mod.id} className="flex gap-6 items-stretch">
                {/* Spine */}
                <div className="flex flex-col items-center pt-1">
                  <div
                    className={`relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isActive
                        ? "bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-500/30"
                        : "bg-zinc-900 border-zinc-800 text-zinc-600"
                    }`}
                  >
                    {isActive ? <PlayIcon /> : <LockIcon />}
                    {isActive && (
                      <span className="absolute -inset-1 rounded-full border border-yellow-400/30 animate-ping opacity-40" />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-px flex-1 my-2 ${
                        isActive
                          ? "bg-gradient-to-b from-yellow-400/80 to-zinc-800"
                          : "bg-zinc-400"
                      }`}
                    />
                  )}
                </div>

                {/* Card */}
                <div
                  className={`group mb-5 flex-1 rounded-2xl border p-6 transition-all duration-300 ${
                    isActive
                      ? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/[0.07] to-transparent shadow-lg shadow-yellow-500/5 hover:border-yellow-500/50"
                      : "border-zinc-700 bg-zinc-900/50 opacity-80 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                            isActive ? "text-yellow-500" : "text-zinc-400"
                          }`}
                        >
                          Módulo {index + 1}
                        </span>
                        {!isActive && (
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                            Bloqueado
                          </span>
                        )}
                      </div>
                      <h3
                        className={`font-bold leading-snug ${
                          index === 0 ? "text-xl" : "text-base"
                        } ${isActive ? "text-white" : "text-zinc-300"}`}
                      >
                        {mod.title}
                      </h3>
                      <p
                        className={`mt-1 text-sm leading-relaxed ${
                          isActive ? "text-zinc-400" : "text-zinc-400"
                        }`}
                      >
                        {mod.subtitle}
                      </p>
                    </div>

                    {isActive && (
                      <Link
                        href="/curso/educacao-financeira"
                        className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 transition-all duration-200 shadow-md shadow-yellow-400/20 hover:-translate-y-px"
                      >
                        <PlayIcon />
                        Começar
                      </Link>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`flex items-center gap-1.5 text-xs ${
                        isActive ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      {mod.lessons.length} aulas
                    </span>

                    {isActive && (
                      <span className="text-xs text-zinc-600 font-medium">0% concluído</span>
                    )}
                  </div>

                  {isActive && (
                    <div className="mt-3 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom link */}
        <div className="text-center mt-4">
          <Link
            href="/curso/educacao-financeira"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-yellow-400 transition-colors duration-200 font-medium group"
          >
            Ver conteúdo completo do curso
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
