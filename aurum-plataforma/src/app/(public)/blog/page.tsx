import type { Metadata } from "next"
import { seoPages } from "@/data/blog"
import BlogIndexClient from "@/components/blog/template/BlogIndexClient"

export const metadata: Metadata = {
  title: "Blog AURUM — Educação Financeira Gratuita",
  description:
    "Artigos práticos sobre finanças pessoais, saída das dívidas, investimentos e renda extra. Conteúdo gratuito da AURUM Nova Escola.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog AURUM — Educação Financeira Gratuita",
    description:
      "Artigos práticos sobre finanças pessoais, saída das dívidas, investimentos e renda extra.",
    url: "https://www.aurumnovaescola.com.br/blog",
    siteName: "AURUM Nova Escola",
    locale: "pt_BR",
    type: "website",
  },
}

// Garante SSG — página estática no build
export const dynamic = "force-static"

export default function BlogIndexPage() {
  // Ordenar por data de publicação (mais recente primeiro)
  const pages = [...seoPages].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  // Categorias únicas com deduplicação
  const categories = [...new Set(pages.map((p) => p.category))]

  const totalPosts = pages.length
  const totalCategories = categories.length

  return (
    <main className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <header className="relative bg-black overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-14 pb-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
            <a href="/" className="hover:text-zinc-400 transition-colors duration-150">
              Início
            </a>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="text-zinc-500">Blog</span>
          </nav>

          {/* Tag */}
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" aria-hidden="true" />
              Conteúdo Gratuito
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            Educação Financeira{" "}
            <span className="text-yellow-400">na Prática</span>
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mb-8">
            Artigos práticos para você entender de dinheiro, sair das dívidas
            e começar a investir — sem enrolação.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-600 border-t border-zinc-800/60 pt-6">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-zinc-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span>
                <strong className="text-white">{totalPosts}</strong>{" "}
                {totalPosts === 1 ? "artigo publicado" : "artigos publicados"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-zinc-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>
                <strong className="text-white">{totalCategories}</strong>{" "}
                {totalCategories === 1 ? "categoria" : "categorias"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-zinc-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                <strong className="text-white">100%</strong> gratuito
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Listagem ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12" aria-label="Lista de artigos">
        {/* BlogIndexClient gerencia o filtro de categoria no client-side */}
        <BlogIndexClient pages={pages} categories={categories} />
      </section>

      {/* ── Banner CTA ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-yellow-400/15 bg-gradient-to-r from-zinc-900 to-black p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-16 w-48 h-48 bg-yellow-400/8 rounded-full blur-3xl pointer-events-none"
          />
          <div className="relative z-10">
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">
              AURUM Nova Escola
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Quer ir além dos artigos?
            </h2>
            <p className="text-zinc-500 text-sm mt-1 max-w-sm">
              Acesse o curso completo de educação financeira e aprenda do zero ao avançado.
            </p>
          </div>
          <a
            href="https://api.whatsapp.com/send/?phone=55&text=Ol%C3%A1%2C+quero+assinar+a+AURUM+por+R%2439%2Fm%C3%AAs&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-yellow-400 text-black font-black text-sm hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:-translate-y-0.5 whitespace-nowrap"
          >
            Começar por R$ 39/mês →
          </a>
        </div>
      </section>
    </main>
  )
}
