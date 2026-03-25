import { BlogPost } from "@/data/blog"

type Props = {
  post: BlogPost
}

export default function BlogIntro({ post }: Props) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      {/* Intro text */}
      <p className="text-zinc-300 text-lg leading-relaxed mb-8">
        {post.intro}
      </p>

      {/* Key point callout */}
      <blockquote className="relative pl-6 border-l-2 border-yellow-400/60 bg-yellow-400/5 rounded-r-xl py-5 pr-6">
        <div className="absolute -left-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400/80 to-yellow-400/20 rounded-full" />
        <p className="text-yellow-100 text-base font-medium leading-relaxed italic">
          &ldquo;{post.keyPoint}&rdquo;
        </p>
      </blockquote>
    </section>
  )
}
