"use client"

import { useState } from "react"
import type { SEOPageData } from "@/types/seo-page"
import BlogCard from "./BlogCard"

type Props = {
  pages: SEOPageData[]
  categories: string[]
}

export default function BlogIndexClient({ pages, categories }: Props) {
  const [active, setActive] = useState<string | null>(null)

  const filtered = active ? pages.filter((p) => p.category === active) : pages

  return (
    <>
      {/* Filtro por categoria */}
      <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filtrar por categoria">
        <button
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
            active === null
              ? "bg-yellow-400 border-yellow-400 text-black"
              : "bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
          }`}
        >
          Todos ({pages.length})
        </button>

        {categories.map((cat) => {
          const count = pages.filter((p) => p.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                active === cat
                  ? "bg-yellow-400 border-yellow-400 text-black"
                  : "bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
              }`}
            >
              {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* Grid de posts */}
      {filtered.length > 0 ? (
        <ul
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {filtered.map((page) => (
            <li key={page.slug}>
              <BlogCard page={page} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-base">Nenhum artigo encontrado nessa categoria.</p>
        </div>
      )}
    </>
  )
}
