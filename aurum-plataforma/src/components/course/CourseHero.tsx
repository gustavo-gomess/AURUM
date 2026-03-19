import Link from "next/link"
import { Course } from "@/data/courses"
import { CourseContent } from "@/data/modules"
import BackButton from "@/components/ui/BackButton"

type Props = {
  course: Course
  content: CourseContent
}

export default function CourseHero({ course, content }: Props) {
  const totalLessons = content.modules.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  )

  return (
    <section className="relative bg-black overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] rounded-full bg-yellow-500/6 blur-[100px] mt-10" />
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10 pb-16">
        {/* Breadcrumb + Voltar */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Link href="/" className="hover:text-zinc-400 transition-colors duration-150">
              Início
            </Link>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="text-zinc-500">{course.title}</span>
          </div>
          <BackButton />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/25 bg-yellow-500/8 text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-6">
          {course.type === "main" ? "Trilha principal" : "Curso extra"}
        </span>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-5">
          {course.title}
        </h1>

        <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mb-10">
          {content.longDescription}
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-6 mb-10">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span><strong className="text-white">{totalLessons}</strong> aulas</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span><strong className="text-white">{content.duration}</strong> de conteúdo</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span><strong className="text-white">{content.modules.length}</strong> módulos</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          {course.id === "educacao-financeira" && (
            <a
              href="#aula-gratis"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-yellow-400 text-black font-bold text-base hover:bg-yellow-300 transition-all duration-200 shadow-xl shadow-yellow-500/20 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Ver aula grátis
            </a>
          )}
          <a
            href="#modulos"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-zinc-800 text-zinc-400 font-semibold text-base hover:border-zinc-600 hover:text-white transition-all duration-200"
          >
            Ver conteúdo completo
          </a>
        </div>
      </div>
    </section>
  )
}
