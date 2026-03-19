export default function FinalCTA() {
  return (
    <section className="bg-black px-6 py-28 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[400px] rounded-full bg-yellow-500/7 blur-[130px]" />
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/25 bg-yellow-500/8 text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-8">
          Comece hoje
        </span>

        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
          Sua vida financeira muda{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
            quando você decide.
          </span>
        </h2>

        <p className="text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Cada dia sem educação financeira é dinheiro que você perde. Comece agora com a estrutura certa, no seu ritmo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/dashboard"
            className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-yellow-400 text-black font-black text-base hover:bg-yellow-300 transition-all duration-200 shadow-2xl shadow-yellow-500/30 hover:-translate-y-0.5"
          >
            Quero começar agora
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <p className="mt-6 text-zinc-600 text-xs tracking-wide">
          7 dias de garantia &nbsp;·&nbsp; Cancele quando quiser &nbsp;·&nbsp; Acesso imediato
        </p>
      </div>

      {/* Footer mínimo */}
      <div className="relative z-10 mt-24 pt-8 border-t border-zinc-900 text-center">
        <p className="text-zinc-700 text-xs">
          © {new Date().getFullYear()} AURUM Nova Escola · Todos os direitos reservados
        </p>
      </div>
    </section>
  )
}
