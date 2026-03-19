export type Course = {
  id: string
  title: string
  lessons: number
  type: "main" | "extra"
  order?: number
  image: string
  progress?: number
  locked?: boolean
}

export const courses: Course[] = [
  {
    id: "educacao-financeira",
    title: "Educação Financeira",
    lessons: 60,
    type: "main",
    order: 1,
    image: "/cursos/financas.jpg",
    progress: 0,
    locked: false,
  },
  {
    id: "energia-fotovoltaica",
    title: "Energia Fotovoltaica",
    lessons: 8,
    type: "extra",
    image: "/cursos/energia-fotovoltaica.jpg",
    locked: false,
  },
  {
    id: "cozinha-inteligente",
    title: "Cozinha Inteligente",
    lessons: 7,
    type: "extra",
    image: "/cursos/cozinha-inteligente.jpg",
    locked: false,
  },
  {
    id: "renda-imoveis",
    title: "Renda com Imóveis",
    lessons: 9,
    type: "extra",
    image: "/cursos/renda-imoveis.jpg",
    locked: false,
  },
  {
    id: "negocios-do-zero",
    title: "Negócios do Zero",
    lessons: 8,
    type: "extra",
    image: "/cursos/negocios-do-zero.jpg",
    locked: false,
  },
  {
    id: "renda-online",
    title: "Renda Online",
    lessons: 10,
    type: "extra",
    image: "/cursos/renda-online.jpg",
    locked: false,
  },
]

export function getMainCourses(): Course[] {
  return courses
    .filter((c) => c.type === "main")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export function getExtraCourses(): Course[] {
  return courses.filter((c) => c.type === "extra")
}

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id)
}
