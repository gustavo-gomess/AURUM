"use client"

import { useEffect, useRef } from "react"
import { getExtraCourses, Course } from "@/data/courses"

const courseVisuals: Record<string, {
  gradient: string
  glow: string
  image?: string
}> = {
  "ia-pratica": {
    gradient: "from-violet-950 via-purple-900 to-fuchsia-950",
    glow: "shadow-fuchsia-500/15",
    image: "/cursos/ia-pratica.png",
  },
  "energia-fotovoltaica": {
    gradient: "from-zinc-950 via-zinc-900 to-zinc-800",
    glow: "shadow-yellow-500/10",
    image: "/cursos/energia-fotovoltaica.jpg",
  },
  "cozinha-inteligente": {
    gradient: "from-orange-950 via-orange-900 to-amber-900",
    glow: "shadow-orange-500/10",
    image: "/cursos/cozinha-inteligente.jpg",
  },
  "renda-imoveis": {
    gradient: "from-teal-950 via-teal-900 to-emerald-900",
    glow: "shadow-teal-500/10",
    image: "/cursos/renda-imoveis.jpg",
  },
  "negocios-do-zero": {
    gradient: "from-indigo-950 via-indigo-900 to-violet-900",
    glow: "shadow-indigo-500/10",
    image: "/cursos/negocios-do-zero.jpg",
  },
  "renda-online": {
    gradient: "from-cyan-950 via-cyan-900 to-sky-900",
    glow: "shadow-cyan-500/10",
    image: "/cursos/renda-online.jpg",
  },
}

function CourseCard({ course }: { course: Course }) {
  const visuals = courseVisuals[course.id]
  if (!visuals) return null

  // Curso também no Prisma (/cursos = player + progresso); demais extras seguem só prévia em /curso
  const href = course.id === "ia-pratica" ? `/cursos/${course.id}` : `/curso/${course.id}`

  return (
    <a
      href={href}
      className={`
        group relative block shrink-0 w-52 sm:w-60 h-80
        rounded-2xl overflow-hidden
        bg-gradient-to-br ${visuals.gradient}
        border border-white/5 hover:border-white/20
        transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${visuals.glow}
      `}
    >
      {/* Imagem de fundo */}
      {visuals.image && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${visuals.image})` }}
        />
      )}

      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />

      {/* Badge EM ANDAMENTO */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/40 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse shrink-0" />
          <span className="text-yellow-300 text-[10px] font-bold uppercase tracking-widest">
            Em andamento
          </span>
        </span>
      </div>

      {/* Seta no hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
        <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Tooltip no hover */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
        <div className="bg-black/80 backdrop-blur-sm rounded-xl p-2.5 border border-zinc-700/50">
          <p className="text-zinc-300 text-xs text-center">
            📚 Prévia disponível — conteúdo completo em breve
          </p>
        </div>
      </div>
    </a>
  )
}

export default function ExtraCourses() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const mouseDown = useRef(false)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startScroll = useRef(0)
  const stopAutoUntil = useRef(0)
  const extraCourses = getExtraCourses()
  const duplicatedCourses = [...extraCourses, ...extraCourses]

  useEffect(() => {
    const slider = scrollRef.current
    if (!slider) return
    let raf = 0

    const tick = () => {
      const now = Date.now()
      const total = slider.scrollWidth
      const half = total / 2

      if (!mouseDown.current && now > stopAutoUntil.current) {
        slider.scrollLeft += 0.5
      }

      if (slider.scrollLeft >= half) {
        slider.scrollLeft -= half
      } else if (slider.scrollLeft <= 0) {
        slider.scrollLeft += half
      }

      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = scrollRef.current
    if (!slider) return
    mouseDown.current = true
    isDragging.current = false
    startX.current = e.pageX
    startScroll.current = slider.scrollLeft
    stopAutoUntil.current = Date.now() + 3000
    slider.style.cursor = "grabbing"
    slider.style.userSelect = "none"

    const onMove = (ev: MouseEvent) => {
      if (!mouseDown.current) return
      const delta = ev.pageX - startX.current
      if (Math.abs(delta) > 4) isDragging.current = true
      slider.scrollLeft = startScroll.current - delta
    }

    const onUp = () => {
      mouseDown.current = false
      slider.style.cursor = "grab"
      slider.style.userSelect = ""
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      e.preventDefault()
      e.stopPropagation()
      isDragging.current = false
    }
  }

  return (
    <section className="bg-black py-20">
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      {/* Cabeçalho */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
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

      {/* Carrossel — arraste no celular e no desktop */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onClickCapture={handleClickCapture}
        className="no-scrollbar w-full overflow-x-scroll flex gap-4 px-6 pb-2"
        style={{ cursor: "grab", WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
      >
        {duplicatedCourses.map((course, index) => (
          <CourseCard key={`${course.id}-${index}`} course={course} />
        ))}
        {/* Espaço extra no final */}
        <div className="shrink-0 w-6" aria-hidden="true" />
      </div>

      {/* Dica de swipe — só mobile */}
      <p className="md:hidden text-center text-zinc-700 text-xs mt-3">
        ← arraste para ver mais →
      </p>
    </section>
  )
}
