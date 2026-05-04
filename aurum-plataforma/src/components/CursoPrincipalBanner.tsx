export default function CursoPrincipalBanner() {
  const beneficios = [
    "Sair das dívidas",
    "Organizar sua vida financeira",
    "Criar sua reserva de emergência",
    "Começar a investir",
  ]

  return (
    <section className="bg-black px-6 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-transparent p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-yellow-400">
                CURSO PRINCIPAL
              </span>

              <h2 className="mt-5 text-3xl md:text-4xl font-black tracking-tight text-white">
                Do zero à liberdade financeira
              </h2>

              <p className="mt-4 max-w-xl text-zinc-300 leading-relaxed">
                Aprenda a sair das dívidas, organizar seu dinheiro e começar a investir com segurança.
              </p>

              <ul className="mt-6 space-y-3 text-zinc-200">
                {beneficios.map((beneficio) => (
                  <li key={beneficio} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span>{beneficio}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-black shadow-lg shadow-yellow-500/20 transition hover:scale-105"
              >
                Começar agora
              </button>
            </div>

            <div className="h-56 md:h-full min-h-[220px] rounded-xl border border-yellow-500/15 bg-zinc-950/40" />
          </div>
        </div>
      </div>
    </section>
  )
}
