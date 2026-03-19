import { notFound } from "next/navigation"
import { getCourseById } from "@/data/courses"
import { getCourseContent } from "@/data/modules"
import CourseHero from "@/components/course/CourseHero"
import FreeLesson from "@/components/course/FreeLesson"
import CourseModules from "@/components/course/CourseModules"

type Props = {
  params: Promise<{ id: string }>
}

export default async function CoursePage({ params }: Props) {
  const { id } = await params
  const course = getCourseById(id)
  const content = getCourseContent(id)

  if (!course || !content) notFound()

  return (
    <main className="bg-black text-white min-h-screen">
      <CourseHero course={course} content={content} />
      {course.id === "educacao-financeira" && <FreeLesson content={content} />}
      <CourseModules content={content} />
    </main>
  )
}
