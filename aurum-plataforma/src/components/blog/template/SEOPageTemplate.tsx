import type { SEOPageData } from "@/types/seo-page"
import TemplateHero from "./TemplateHero"
import TemplateContent from "./TemplateContent"
import TemplateCTA from "./TemplateCTA"
import TemplateFAQ from "./TemplateFAQ"
import TemplateFooter from "./TemplateFooter"

type Props = { page: SEOPageData }

/**
 * SEOPageTemplate — componente orquestrador reutilizável.
 *
 * Para criar uma nova página SEO, basta:
 * 1. Adicionar um objeto `SEOPageData` em `src/data/blog.ts`
 * 2. O roteamento, metadata e sitemap são gerados automaticamente.
 *
 * Estrutura:
 *   TemplateHero     → H1, breadcrumb, meta info
 *   TemplateContent  → intro, keyPoint, ContentBlock[]
 *   TemplateCTA      → bloco de conversão configurável
 *   TemplateFAQ      → FAQ em acordeão (client component)
 *   TemplateFooter   → rodapé com links internos
 */
export default function SEOPageTemplate({ page }: Props) {
  return (
    <article className="bg-black text-white">
      <TemplateHero page={page} />

      <TemplateContent
        intro={page.intro}
        keyPoint={page.keyPoint}
        blocks={page.content}
      />

      <TemplateCTA cta={page.cta} />

      <TemplateFAQ faqs={page.faqs} />

      <TemplateFooter />
    </article>
  )
}
