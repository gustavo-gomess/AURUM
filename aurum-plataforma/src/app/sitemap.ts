import { MetadataRoute } from "next"
import { seoPages } from "@/data/blog"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.aurumnovaescola.com.br"

  const courseIds = [
    "educacao-financeira",
    "energia-fotovoltaica",
    "cozinha-inteligente",
    "renda-imoveis",
    "negocios-do-zero",
    "renda-online",
  ]

  const coursePages = courseIds.map((id) => ({
    url: `${baseUrl}/curso/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const blogPages = seoPages.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...blogPages,
    ...coursePages,
  ]
}
