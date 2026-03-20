"use client"

import { useState } from "react"

const faqs = [
  {
    question: "Quais as formas de pagamento?",
    answer: "Aceitamos cartão de crédito (parcelado em até 12x), cartão de débito, PIX e boleto bancário. O acesso é liberado imediatamente após a confirmação do pagamento.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim. Você pode cancelar a assinatura a qualquer momento, sem multa e sem burocracia. Após o cancelamento, seu acesso segue ativo até o fim do período pago.",
  },
  {
    question: "Quanto tempo terei acesso ao conteúdo?",
    answer: "Enquanto sua assinatura estiver ativa, o acesso é ilimitado. Você assiste quantas vezes quiser, no seu ritmo, sem prazo de validade para cada aula.",
  },
  {
    question: "O conteúdo funciona em qualquer dispositivo?",
    answer: "Sim. A plataforma AURUM funciona em computadores, tablets e celulares — basta ter acesso à internet. Não é necessário instalar nenhum aplicativo.",
  },
  {
    question: "Preciso ter conhecimento prévio em finanças?",
    answer: "Não. Os cursos foram construídos do zero ao avançado. Se você nunca investiu ou nunca organizou seu orçamento, vai entender tudo sem dificuldade.",
  },
  {
    question: "Quando os novos cursos são lançados?",
    answer: "Novos conteúdos são adicionados continuamente. Os cursos marcados como 'Em andamento' no carrossel já estão em produção e serão liberados diretamente na sua conta.",
  },
  {
    question: "Tenho garantia de devolução do dinheiro?",
    answer: "Sim. Oferecemos 7 dias de garantia incondicional. Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do valor pago — sem perguntas.",
  },
  {
    question: "Posso compartilhar minha conta?",
    answer: "A assinatura é individual e intransferível. Cada aluno deve ter sua própria conta para garantir uma experiência personalizada e acesso ao progresso individual.",
  },
]

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-yellow-500/30 bg-yellow-500/5"
          : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`font-semibold text-base leading-snug transition-colors duration-200 ${isOpen ? "text-yellow-400" : "text-white"}`}>
          {question}
        </span>
        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-yellow-400 rotate-45" : "bg-zinc-800"
        }`}>
          <svg className={`w-3.5 h-3.5 transition-colors duration-200 ${isOpen ? "text-black" : "text-zinc-400"}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="px-6 pb-5 text-zinc-400 text-sm leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative bg-black py-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      {/* Glow sutil */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-yellow-500/4 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4">
            Dúvidas frequentes
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Ainda tem alguma{" "}
            <span className="text-yellow-400">dúvida?</span>
          </h2>
          <p className="text-zinc-500 text-base mt-3 max-w-xl mx-auto">
            Reunimos as perguntas mais comuns para te ajudar a tomar a melhor decisão.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Rodapé */}
        <p className="text-center text-zinc-600 text-sm mt-10">
          Não encontrou o que procurava?{" "}
          <a
            href="https://api.whatsapp.com/send/?phone=55&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 font-medium"
          >
            Fale com nossa equipe no WhatsApp →
          </a>
        </p>
      </div>
    </section>
  )
}
