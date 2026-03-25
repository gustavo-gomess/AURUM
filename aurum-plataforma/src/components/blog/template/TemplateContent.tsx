import type {
  ContentBlock,
  StepItem,
  MistakeItem,
} from "@/types/seo-page"

// ─── Blocos inline ────────────────────────────────────────────────────────────

function ParagraphBlock({ text }: { text: string }) {
  return (
    <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">{text}</p>
  )
}

function CalloutBlock({
  text,
  variant = "gold",
}: {
  text: string
  variant?: "gold" | "warning"
}) {
  if (variant === "warning") {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/25 bg-red-500/5">
        <svg
          className="w-4 h-4 text-red-400 shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p className="text-red-200 text-sm sm:text-base leading-relaxed">{text}</p>
      </div>
    )
  }

  return (
    <blockquote className="relative pl-6 border-l-2 border-yellow-400/60 bg-yellow-400/5 rounded-r-xl py-5 pr-6">
      <div
        aria-hidden="true"
        className="absolute -left-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400/80 to-yellow-400/20 rounded-full"
      />
      <p className="text-yellow-100 text-base font-medium leading-relaxed italic">
        &ldquo;{text}&rdquo;
      </p>
    </blockquote>
  )
}

function Heading2Block({ text }: { text: string }) {
  return (
    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight pt-2">
      {text}
    </h2>
  )
}

function Heading3Block({ text }: { text: string }) {
  return (
    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
      {text}
    </h3>
  )
}

function DividerBlock() {
  return <hr className="border-zinc-800" />
}

function ChecklistBlock({
  data,
}: {
  data: Extract<ContentBlock, { type: "checklist" }>
}) {
  return (
    <section className="pt-4">
      <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
        {data.heading}
      </h2>
      {data.subheading && (
        <p className="text-zinc-500 text-sm mb-5">{data.subheading}</p>
      )}
      <ul className="flex flex-col gap-2.5" role="list">
        {data.items.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm sm:text-base">
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
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

// ─── Blocos de seção ──────────────────────────────────────────────────────────

function StepCard({ step }: { step: StepItem }) {
  return (
    <article className="flex gap-5 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-200">
      {/* Número */}
      <div className="shrink-0 w-11 h-11 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
        <span className="text-yellow-400 font-black text-sm tabular-nums">
          {String(step.number).padStart(2, "0")}
        </span>
      </div>
      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-base sm:text-lg mb-2 leading-snug">
          {step.title}
        </h3>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          {step.description}
        </p>
        {step.tip && (
          <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-yellow-400/8 border border-yellow-400/20">
            <svg
              className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-yellow-200/80 text-xs sm:text-sm leading-relaxed">
              <strong className="text-yellow-300 font-semibold">Dica: </strong>
              {step.tip}
            </p>
          </div>
        )}
      </div>
    </article>
  )
}

function StepsBlock({
  data,
}: {
  data: Extract<ContentBlock, { type: "steps" }>
}) {
  return (
    <section className="pt-6 border-t border-zinc-800/50" id="passo-a-passo">
      <div className="mb-8">
        {data.label && (
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">
            {data.label}
          </p>
        )}
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          {data.heading}
        </h2>
        {data.subheading && (
          <p className="text-zinc-500 mt-2 text-base">{data.subheading}</p>
        )}
      </div>
      <ol className="flex flex-col gap-5" role="list">
        {data.items.map((step) => (
          <li key={step.number}>
            <StepCard step={step} />
          </li>
        ))}
      </ol>
    </section>
  )
}

function MistakeCard({ mistake }: { mistake: MistakeItem }) {
  return (
    <article className="h-full p-5 rounded-2xl border border-red-500/15 bg-red-500/5 hover:border-red-500/25 hover:bg-red-500/8 transition-all duration-200">
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 leading-none mt-0.5" aria-hidden="true">
          {mistake.icon}
        </span>
        <div>
          <h3 className="text-white font-bold text-sm sm:text-base mb-2 leading-snug">
            {mistake.title}
          </h3>
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
            {mistake.description}
          </p>
        </div>
      </div>
    </article>
  )
}

function MistakesBlock({
  data,
}: {
  data: Extract<ContentBlock, { type: "mistakes" }>
}) {
  return (
    <section className="pt-6 border-t border-zinc-800/50" id="erros-comuns">
      <div className="mb-8">
        {data.label && (
          <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
            {data.label}
          </p>
        )}
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          {data.heading}
        </h2>
        {data.subheading && (
          <p className="text-zinc-500 mt-2 text-base">{data.subheading}</p>
        )}
      </div>
      <ul className="grid gap-4 sm:grid-cols-2" role="list">
        {data.items.map((mistake, i) => (
          <li key={i}>
            <MistakeCard mistake={mistake} />
          </li>
        ))}
      </ul>
    </section>
  )
}

// ─── Renderizador principal ────────────────────────────────────────────────────

type Props = {
  intro: string
  keyPoint?: string
  blocks: ContentBlock[]
}

export default function TemplateContent({ intro, keyPoint, blocks }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-6">
      {/* Intro + keypoint */}
      <div className="py-10 flex flex-col gap-6">
        <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">{intro}</p>
        {keyPoint && (
          <blockquote className="relative pl-6 border-l-2 border-yellow-400/60 bg-yellow-400/5 rounded-r-xl py-5 pr-6">
            <div
              aria-hidden="true"
              className="absolute -left-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400/80 to-yellow-400/20 rounded-full"
            />
            <p className="text-yellow-100 text-base font-medium leading-relaxed italic">
              &ldquo;{keyPoint}&rdquo;
            </p>
          </blockquote>
        )}
      </div>

      {/* Blocos de conteúdo */}
      <div className="flex flex-col gap-8 pb-12">
        {blocks.map((block, i) => {
          switch (block.type) {
            case "paragraph":
              return <ParagraphBlock key={i} text={block.text} />
            case "callout":
              return <CalloutBlock key={i} text={block.text} variant={block.variant} />
            case "heading2":
              return <Heading2Block key={i} text={block.text} />
            case "heading3":
              return <Heading3Block key={i} text={block.text} />
            case "divider":
              return <DividerBlock key={i} />
            case "checklist":
              return <ChecklistBlock key={i} data={block} />
            case "steps":
              return <StepsBlock key={i} data={block} />
            case "mistakes":
              return <MistakesBlock key={i} data={block} />
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
