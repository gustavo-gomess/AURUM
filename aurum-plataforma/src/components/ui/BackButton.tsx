"use client"

import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="group inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors duration-200"
    >
      <span className="w-7 h-7 rounded-full border border-zinc-800 bg-zinc-900/50 group-hover:border-zinc-600 group-hover:bg-zinc-800 flex items-center justify-center transition-all duration-200">
        <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </span>
      Voltar
    </button>
  )
}
