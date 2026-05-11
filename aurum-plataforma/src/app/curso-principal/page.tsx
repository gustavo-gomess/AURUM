import type { Metadata } from "next"
import Navbar from "@/components/home/Navbar"
import CursoPrincipalTrilha from "@/components/CursoPrincipalTrilha"

export const metadata: Metadata = {
  title: "Curso principal | Aurum Nova Escola",
  description:
    "Trilha do curso principal: do zero à liberdade financeira. Comece grátis pelo módulo Mentalidade.",
}

export default function CursoPrincipalPage() {
  return (
    <>
      <Navbar />
      <main className="bg-black text-white min-h-screen pt-16">
        <CursoPrincipalTrilha />
      </main>
    </>
  )
}
