import { getExtraCourses, Course } from "@/data/courses"

const courseVisuals: Record<string, {
  gradient: string
  glow: string
  emoji: string
  image?: string
}> = {
  "energia-fotovoltaica": {
    gradient: "from-zinc-950 via-zinc-900 to-zinc-800",
    glow: "shadow-yellow-500/10",
    emoji: "",
    image: "/cursos/energia-fotovoltaica.jpg",
  },
  "cozinha-inteligente": {
    gradient: "from-orange-950 via-orange-900 to-amber-900",
    glow: "shadow-orange-500/10",
    emoji: "🍳",
    image: "/cursos/cozinha-inteligente.jpg",
  },
  "renda-imoveis": {
    gradient: "from-teal-950 via-teal-900 to-emerald-900",
    glow: "shadow-teal-500/10",
    emoji: "🏡",
    image: "/cursos/renda-imoveis.jpg",
  },
  "negocios-do-zero": {
    gradient: "from-indigo-950 via-indigo-900 to-violet-900",
    glow: "shadow-indigo-500/10",
    emoji: "🚀",
    image: "/cursos/negocios-do-zero.jpg",
  },
  "renda-online": {
    gradient: "from-cyan-950 via-cyan-900 to-sky-900",
    glow: "shadow-cyan-500/10",
    emoji: "💻",
    image: "/cursos/renda-online.jpg",
  },
}

const extraCourses = getExtraCourses()

function CourseCard({ course }: { course: Course }) {
  const visuals = courseVisuals[course.id]
  if (!visuals) return null

  return (
    <a
      href={`/curso/${course.id}`}
      className={`group relative shrink-0 w-64 h-[340px] rounded-2xl bg-gradient-to-br ${visuals.gradient} border border-white/5 hover:border-white/15 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${visuals.glow}`}
    >
      {/* Banner image */}
      {visuals.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${visuals.image})` }}
        />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            }}
          />
          {visuals.emoji && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] opacity-10 select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">
              {visuals.emoji}
            </div>
          )}
        </>
      )}

      {/* Overlay escuro no topo para o badge ficar legível */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

      {/* Badge EM ANDAMENTO */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/40 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse shrink-0" />
          <span className="text-yellow-300 text-[10px] font-bold uppercase tracking-widest">
            Em andamento
          </span>
        </span>
      </div>

      {/* Arrow on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 z-10">
        <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Tooltip no hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
        <div className="bg-black/80 backdrop-blur-sm rounded-xl p-3 border border-zinc-700/50">
          <p className="text-zinc-300 text-xs leading-relaxed text-center">
            📚 Prévia disponível — conteúdo completo em breve
          </p>
        </div>
      </div>
    </a>
  )
}

export default function ExtraCourses() {
  return (
    <section className="relative bg-black py-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4">
              Cursos extras
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Explore outros conhecimentos
            </h2>
            <p className="text-zinc-400 text-sm mt-2 flex items-center gap-2">
              Conteúdos curtos para expandir suas habilidades.
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] font-semibold">
                <span className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />
                Em desenvolvimento
              </span>
            </p>
          </div>
        </div>

        {/* Aviso */}
        <div className="mt-5 flex items-start gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <svg className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Esses cursos estão sendo produzidos e serão lançados em breve. Você já pode acessar a prévia com os módulos e aulas planejadas — o conteúdo completo chegará automaticamente na sua conta assim que for publicado.
          </p>
        </div>
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* Infinite carousel */}
      <div className="overflow-hidden">
        <div className="carousel-track flex gap-5 w-max pb-3">
          {extraCourses.map((course) => (
            <CourseCard key={`a-${course.id}`} course={course} />
          ))}
          {extraCourses.map((course) => (
            <CourseCard key={`b-${course.id}`} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}
