export default function Guarantee() {
  return (
    <section className="bg-black px-6 py-16 relative overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 text-center sm:text-left">
          {/* Ícone */}
          <div className="shrink-0 w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>

          {/* Texto */}
          <div>
            <h3 className="text-white font-black text-xl mb-2">
              Garantia de 7 dias
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Se por qualquer motivo você não gostar da plataforma nos primeiros 7 dias, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
