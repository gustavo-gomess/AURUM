import type { CTAConfig } from "@/types/seo-page"

type Props = { cta: CTAConfig }

export default function TemplateCTA({ cta }: Props) {
  return (
    <section
      className="max-w-3xl mx-auto px-6 py-12"
      aria-label={cta.headline}
    >
      <div className="relative overflow-hidden rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black p-8 sm:p-10">
        {/* Glows decorativos */}
        <div aria-hidden="true" className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400/8 rounded-full blur-3xl pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-10 -left-10 w-44 h-44 bg-yellow-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Badge */}
          {cta.badge && (
            <div className="mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 text-xs font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" aria-hidden="true" />
                {cta.badge}
              </span>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
            {cta.headline}
          </h2>

          <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-xl">
            {cta.description}
          </p>

          {/* Benefícios */}
          {cta.benefits && cta.benefits.length > 0 && (
            <ul className="flex flex-col gap-2 mb-8" role="list">
              {cta.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <svg
                    className="w-4 h-4 text-yellow-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          )}

          {/* Preço + botão */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Preço */}
            {cta.price && (
              <div className="shrink-0">
                {cta.price.original && (
                  <div className="text-zinc-500 text-sm line-through mb-0.5">
                    {cta.price.original}
                  </div>
                )}
                <div className="flex items-end gap-1">
                  <span className="text-zinc-400 text-base">R$</span>
                  <span className="text-4xl font-black text-white leading-none">
                    {cta.price.current}
                  </span>
                  <span className="text-zinc-400 text-base mb-0.5">{cta.price.period}</span>
                </div>
                {cta.price.note && (
                  <p className="text-zinc-600 text-xs mt-1">{cta.price.note}</p>
                )}
              </div>
            )}

            {/* CTA button */}
            <a
              href={cta.buttonHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-yellow-400 text-black font-black text-base hover:bg-yellow-300 transition-all duration-200 shadow-xl shadow-yellow-400/20 hover:-translate-y-0.5 whitespace-nowrap"
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.571a.5.5 0 0 0 .61.637l5.939-1.56A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.853 0-3.587-.5-5.084-1.375l-.361-.214-3.757.986.999-3.648-.235-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              {cta.buttonText}
            </a>
          </div>

          {/* Garantia */}
          {cta.guarantee && (
            <p className="text-zinc-700 text-xs mt-5">{cta.guarantee}</p>
          )}
        </div>
      </div>
    </section>
  )
}
