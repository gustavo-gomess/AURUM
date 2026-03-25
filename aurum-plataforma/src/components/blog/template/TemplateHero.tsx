import Link from "next/link"
import type { SEOPageData } from "@/types/seo-page"

type Props = { page: SEOPageData }

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function TemplateHero({ page }: Props) {
  return (
    <header className="relative bg-black overflow-hidden">
      {/* Glow sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-14 pb-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/" className="hover:text-zinc-400 transition-colors duration-150">
            Início
          </Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <Link href="/blog" className="hover:text-zinc-400 transition-colors duration-150">
            Blog
          </Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-zinc-500 truncate max-w-[180px]">{page.category}</span>
        </nav>

        {/* Tag de categoria */}
        <div className="mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" aria-hidden="true" />
            {page.category}
          </span>
        </div>

        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-5">
          {page.title}
        </h1>

        {/* Subtítulo opcional */}
        {page.subtitle && (
          <p className="text-zinc-400 text-lg leading-relaxed mb-6 max-w-2xl">
            {page.subtitle}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-500 border-t border-zinc-800/60 pt-6">
          {/* Autor */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black text-xs font-black"
              aria-hidden="true"
            >
              A
            </div>
            <span>AURUM Nova Escola</span>
          </div>

          {/* Data */}
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time dateTime={page.publishedAt}>{formatDate(page.publishedAt)}</time>
          </div>

          {/* Tempo de leitura */}
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{page.readingTime} min de leitura</span>
          </div>
        </div>
      </div>
    </header>
  )
}
