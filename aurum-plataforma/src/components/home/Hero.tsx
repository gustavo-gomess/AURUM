export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 md:py-48 bg-black overflow-hidden">
      {/* Radial glow background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[500px] rounded-full bg-yellow-500/8 blur-[120px]" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-yellow-500/25 bg-yellow-500/8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-yellow-400 text-xs font-semibold uppercase tracking-widest">
            Jornada guiada
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight max-w-5xl">
          Comece sua jornada rumo à{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
              liberdade financeira
            </span>
            <span className="absolute -inset-1 bg-yellow-400/10 blur-xl rounded-xl" />
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-8 text-lg md:text-xl text-zinc-500 max-w-xl leading-relaxed font-light">
          Aprenda do zero ao avançado com um caminho{" "}
          <span className="text-zinc-300 font-normal">estruturado e seguro.</span>
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#trilha"
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-yellow-400 text-black font-bold text-base hover:bg-yellow-300 transition-all duration-200 shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:-translate-y-0.5"
          >
            Começar pelo básico
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#como-funciona"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-zinc-800 text-zinc-400 font-semibold text-base hover:border-zinc-600 hover:text-white hover:bg-white/[0.03] transition-all duration-200"
          >
            Ver como funciona
          </a>
        </div>

      </div>
    </section>
  )
}
