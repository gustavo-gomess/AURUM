import Link from "next/link"
import type { SEOPageData } from "@/types/seo-page"

type Props = { page: SEOPageData }

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })
}

export default function BlogCard({ page }: Props) {
  return (
    <Link
      href={`/blog/${page.slug}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-2xl"
      aria-label={`Ler: ${page.title}`}
    >
      <article className="h-full flex flex-col p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 group-hover:border-zinc-600 group-hover:bg-zinc-900/80 transition-all duration-200">
        {/* Categoria */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] font-bold uppercase tracking-widest">
            {page.category}
          </span>
        </div>

        {/* Título */}
        <h2 className="text-white font-bold text-base sm:text-lg leading-snug mb-3 group-hover:text-yellow-400 transition-colors duration-200 line-clamp-3">
          {page.title}
        </h2>

        {/* Intro truncado */}
        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {page.intro}
        </p>

        {/* Rodapé do card */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-800/60">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <time dateTime={page.publishedAt}>{formatDate(page.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{page.readingTime} min de leitura</span>
          </div>

          <span
            className="text-yellow-400/70 text-xs font-medium group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-200"
            aria-hidden="true"
          >
            Ler →
          </span>
        </div>
      </article>
    </Link>
  )
}
