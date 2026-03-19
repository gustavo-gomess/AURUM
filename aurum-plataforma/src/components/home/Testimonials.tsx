const testimonials = [
  {
    name: "Mariana Souza",
    role: "Professora, 34 anos",
    avatar: "MS",
    text: "Nunca tinha entendido nada de investimentos. Com a AURUM, em 3 semanas já tinha minha reserva de emergência montada e minha primeira aplicação no Tesouro Direto.",
    stars: 5,
  },
  {
    name: "Rafael Oliveira",
    role: "Autônomo, 28 anos",
    avatar: "RO",
    text: "Sempre ganhei bem mas nunca sobrava nada. A trilha de Dívidas e Orçamento mudou completamente minha relação com dinheiro. Recomendo demais.",
    stars: 5,
  },
  {
    name: "Camila Torres",
    role: "Analista de RH, 31 anos",
    avatar: "CT",
    text: "A plataforma é linda e o conteúdo é direto ao ponto. Não tem enrolação. Cada aula eu aprendo algo que consigo aplicar no mesmo dia.",
    stars: 5,
  },
  {
    name: "Lucas Ferreira",
    role: "Estudante, 22 anos",
    avatar: "LF",
    text: "Comecei do zero mesmo. Hoje já tenho carteira de ações montada e entendo o que está acontecendo no mercado. Incrível demais.",
    stars: 5,
  },
  {
    name: "Ana Paula Lima",
    role: "Enfermeira, 40 anos",
    avatar: "AL",
    text: "Tentei outros cursos antes, mas nenhum tinha essa estrutura de trilha guiada. Sabia exatamente o que estudar e em qual ordem. Fez toda a diferença.",
    stars: 5,
  },
  {
    name: "Thiago Mendes",
    role: "Empreendedor, 37 anos",
    avatar: "TM",
    text: "Além dos cursos de finanças, os conteúdos extras como energia solar e negócios agregaram muito. Vale muito mais do que o preço da assinatura.",
    stars: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="bg-black px-6 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-5">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Quem já está transformando a vida financeira
          </h2>
          <p className="mt-4 text-zinc-500 text-base max-w-lg mx-auto">
            Resultados reais de pessoas reais. Sem exceção.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 transition-all duration-300"
            >
              <Stars count={t.stars} />
              <p className="text-zinc-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
                <div className="w-9 h-9 rounded-full bg-yellow-400/15 border border-yellow-400/20 flex items-center justify-center text-yellow-400 text-xs font-black shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none">{t.name}</p>
                  <p className="text-zinc-600 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
