import Image from "next/image"
import Link from "next/link"

const IMAGEM_BANNER = "/images/banner-curso-principal.png"

export default function CursoPrincipalBanner() {
  return (
    <section className="bg-black px-6 pb-10">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/curso-principal"
          className="group relative block w-full overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/15 via-yellow-500/5 to-transparent transition hover:border-yellow-500/40 hover:scale-[1.005] focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        >
          <div className="aspect-[16/9] md:aspect-[21/8] w-full" />

          <Image
            src={IMAGEM_BANNER}
            alt="Curso principal: do zero à liberdade financeira"
            fill
            priority
            sizes="(min-width: 1280px) 1152px, 100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(250,222,53,0.18),transparent_60%)]" />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <span className="inline-flex w-fit items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-yellow-400 mb-4">
              CURSO PRINCIPAL
            </span>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-2xl leading-tight">
              Do zero à liberdade financeira
            </h2>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-yellow-400/90">
              <span>Ver trilha e aula grátis</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
