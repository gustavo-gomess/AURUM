"use client"

import { useState } from "react"
import type { FAQItem } from "@/types/seo-page"

type Props = { faqs: FAQItem[] }

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FAQItem
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors duration-200">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-ans-${index}`}
        id={`faq-q-${index}`}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-zinc-900/40 hover:bg-zinc-900/70 transition-colors duration-150"
      >
        <h3 className="text-white font-semibold text-sm sm:text-base leading-snug pr-2">
          {item.question}
        </h3>
        <span
          aria-hidden="true"
          className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "border-yellow-400/50 bg-yellow-400/10 rotate-180"
              : "border-zinc-700 bg-zinc-800/50"
          }`}
        >
          <svg
            className={`w-3.5 h-3.5 transition-colors duration-200 ${
              isOpen ? "text-yellow-400" : "text-zinc-500"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div
        id={`faq-ans-${index}`}
        role="region"
        aria-labelledby={`faq-q-${index}`}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-6 py-5 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-zinc-800/60">
          {item.answer}
        </p>
      </div>
    </div>
  )
}

export default function TemplateFAQ({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!faqs.length) return null

  return (
    <section
      className="max-w-3xl mx-auto px-6 py-12 border-t border-zinc-800/50"
      id="perguntas-frequentes"
      aria-label="Perguntas Frequentes"
    >
      <div className="mb-10">
        <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">
          FAQ
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          Perguntas Frequentes
        </h2>
        <p className="text-zinc-500 mt-3 text-base">
          As dúvidas mais comuns de quem está começando.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((item, index) => (
          <FAQItem
            key={index}
            item={item}
            index={index}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>

      <p className="text-center text-zinc-600 text-sm mt-10">
        Ainda tem dúvidas?{" "}
        <a
          href="https://api.whatsapp.com/send/?phone=55&text=Ol%C3%A1%2C+tenho+uma+d%C3%BAvida+sobre+finan%C3%A7as&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 font-medium"
        >
          Fale com nossa equipe no WhatsApp →
        </a>
      </p>
    </section>
  )
}
