import { CourseContent } from "@/data/modules"

type Props = {
  content: CourseContent
}

export default function FreeLesson({ content }: Props) {
  let freeLesson = null
  let freeModuleTitle = ""

  for (const mod of content.modules) {
    const found = mod.lessons.find((l) => l.free)
    if (found) {
      freeLesson = found
      freeModuleTitle = mod.title
      break
    }
  }

  if (!freeLesson) return null

  return (
    <section id="aula-gratis" className="bg-zinc-950 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-bold uppercase tracking-widest">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Aula grátis
          </span>
          <span className="text-zinc-600 text-sm">{freeModuleTitle}</span>
        </div>

        {/* Vimeo Player */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50">
          <iframe
            src="https://player.vimeo.com/video/1146940366?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0"
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
            title={freeLesson.title}
          />
        </div>

        {/* Lesson label */}
        <div className="mt-4 flex items-center gap-2 text-zinc-500 text-sm">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-zinc-300 font-medium">{freeLesson.title}</span>
          <span className="text-zinc-600">·</span>
          <span>{freeLesson.duration}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-yellow-500 font-medium">Gratuita</span>
        </div>
      </div>
    </section>
  )
}
