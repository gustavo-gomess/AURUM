import type { SEOPageData, FAQItem } from "@/types/seo-page"
import type { Metadata } from "next"

const BASE_URL = "https://www.aurumnovaescola.com.br"

// ─── Metadata do Next.js ──────────────────────────────────────────────────────

export function buildBlogMetadata(page: SEOPageData): Metadata {
  const canonical = page.canonical ?? `/blog/${page.slug}`
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${BASE_URL}${canonical}`,
      siteName: "AURUM Nova Escola",
      locale: "pt_BR",
      type: "article",
      publishedTime: page.publishedAt,
      modifiedTime: page.updatedAt,
    },
    robots: { index: true, follow: true },
  }
}

// ─── JSON-LD (schema.org) ─────────────────────────────────────────────────────

export function buildArticleJsonLd(page: SEOPageData) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.metaDescription,
    datePublished: page.publishedAt,
    dateModified: page.updatedAt,
    author: {
      "@type": "Organization",
      name: "AURUM Nova Escola",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "AURUM Nova Escola",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${page.slug}`,
    },
  }
}

export function buildFAQJsonLd(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
