import { CourseContent } from "@/data/modules"

type Props = {
  content: CourseContent
}

function LockIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export default function CourseModules({ content }: Props) {
  const totalLessons = content.modules.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  )

  return (
    <section id="modulos" className="bg-black px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4">
              Conteúdo do curso
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              O que você vai aprender
            </h2>
          </div>
          <p className="text-zinc-600 text-sm shrink-0">
            {content.modules.length} módulos · {totalLessons} aulas
          </p>
        </div>

        {/* Module list */}
        <div className="flex flex-col gap-3">
          {content.modules.map((mod, modIndex) => {
            const lessonCount = mod.lessons.length

            return (
              <div
                key={mod.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden"
              >
                {/* Module header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">
                      {modIndex + 1}
                    </span>
                    <h3 className="font-bold text-white text-base">{mod.title}</h3>
                  </div>
                  <span className="text-xs text-zinc-600 font-medium shrink-0">
                    {lessonCount} aulas
                  </span>
                </div>

                {/* Lessons */}
                <ul>
                  {mod.lessons.map((lesson, lessonIndex) => {
                    const isFree = lesson.free === true
                    const isLast = lessonIndex === mod.lessons.length - 1

                    return (
                      <li
                        key={lesson.id}
                        className={`flex items-center justify-between px-6 py-3.5 gap-4 transition-colors duration-150 ${
                          isFree
                            ? "hover:bg-yellow-500/[0.04] cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        } ${!isLast ? "border-b border-zinc-800/40" : ""}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="shrink-0">
                            {isFree ? <PlayIcon /> : <LockIcon />}
                          </span>
                          <span
                            className={`text-sm truncate ${
                              isFree ? "text-zinc-300" : "text-zinc-600"
                            }`}
                          >
                            {lesson.title}
                          </span>
                          {isFree && (
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                              Grátis
                            </span>
                          )}
                        </div>
                        <span className="shrink-0 text-xs text-zinc-600 font-mono">
                          {lesson.duration}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-base mb-1">
              Pronto para começar?
            </p>
            <p className="text-zinc-500 text-sm">
              Acesse todas as {totalLessons} aulas e avance no seu ritmo.
            </p>
          </div>
          <a
            href="#aula-gratis"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Assistir aula grátis
          </a>
        </div>
      </div>
    </section>
  )
}
