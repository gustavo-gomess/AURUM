// ─── Blocos de conteúdo ───────────────────────────────────────────────────────

export type StepItem = {
  number: number
  title: string
  description: string
  tip?: string
}

export type MistakeItem = {
  icon: string
  title: string
  description: string
}

export type ChecklistItem = string

/**
 * ContentBlock — união discriminada de tipos de bloco.
 * Adicione novos tipos aqui para expandir o sistema.
 */
export type ContentBlock =
  | {
      type: "paragraph"
      text: string
    }
  | {
      type: "callout"
      text: string
      /** "gold" (destaque padrão) | "warning" (alerta vermelho) */
      variant?: "gold" | "warning"
    }
  | {
      type: "steps"
      label?: string
      heading: string
      subheading?: string
      items: StepItem[]
    }
  | {
      type: "mistakes"
      label?: string
      heading: string
      subheading?: string
      items: MistakeItem[]
    }
  | {
      type: "checklist"
      heading: string
      subheading?: string
      items: ChecklistItem[]
    }
  | {
      type: "heading2"
      text: string
    }
  | {
      type: "heading3"
      text: string
    }
  | {
      type: "divider"
    }

// ─── CTA ────────────────────────────────────────────────────────────────────

export type CTAPrice = {
  original?: string
  current: string
  period: string
  note?: string
}

export type CTAConfig = {
  badge?: string
  headline: string
  description: string
  benefits?: string[]
  price?: CTAPrice
  buttonText: string
  buttonHref: string
  guarantee?: string
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export type FAQItem = {
  question: string
  answer: string
}

// ─── Página SEO principal ─────────────────────────────────────────────────────

export type SEOPageData = {
  // identificação
  slug: string
  // SEO
  metaTitle: string       // ≤ 60 caracteres
  metaDescription: string // ≤ 155 caracteres
  canonical?: string      // omitir = usa /blog/<slug>
  // conteúdo
  category: string
  title: string           // H1 da página
  subtitle?: string
  publishedAt: string     // ISO date "YYYY-MM-DD"
  updatedAt: string       // ISO date "YYYY-MM-DD"
  readingTime: number     // minutos
  intro: string
  keyPoint?: string       // citação em destaque após o intro
  content: ContentBlock[]
  cta: CTAConfig
  faqs: FAQItem[]
}
