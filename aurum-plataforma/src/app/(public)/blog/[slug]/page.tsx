import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSEOPage, seoPages } from "@/data/blog"
import { buildBlogMetadata, buildArticleJsonLd, buildFAQJsonLd } from "@/lib/seo"
import SEOPageTemplate from "@/components/blog/template/SEOPageTemplate"

type Props = {
  params: Promise<{ slug: string }>
}

// Gera rotas estáticas para todos os posts conhecidos
export async function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }))
}

// Metadata dinâmica por slug
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getSEOPage(slug)
  if (!page) return {}
  return buildBlogMetadata(page)
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const page = getSEOPage(slug)
  if (!page) notFound()

  return (
    <>
      {/* Schema.org: Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd(page)) }}
      />
      {/* Schema.org: FAQPage */}
      {page.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(page.faqs)) }}
        />
      )}

      {/* Template reutilizável — toda lógica de UI está aqui */}
      <SEOPageTemplate page={page} />
    </>
  )
}
