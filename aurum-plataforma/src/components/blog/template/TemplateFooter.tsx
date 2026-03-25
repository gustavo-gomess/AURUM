import Link from "next/link"

export default function TemplateFooter() {
  return (
    <footer className="border-t border-zinc-800/50 mt-4 pb-16">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Branding */}
          <div>
            <span className="text-white font-black text-lg tracking-tight">
              AURUM
              <span className="text-yellow-400 ml-1 font-light text-sm">Nova Escola</span>
            </span>
            <p className="text-zinc-600 text-xs mt-1">
              Educação financeira do zero ao avançado.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Navegação do blog" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/" className="text-zinc-500 hover:text-zinc-300 transition-colors duration-150">
              Início
            </Link>
            <Link href="/curso/educacao-financeira" className="text-zinc-500 hover:text-zinc-300 transition-colors duration-150">
              Cursos
            </Link>
            <a
              href="https://api.whatsapp.com/send/?phone=55&text=Ol%C3%A1%2C+quero+saber+mais+sobre+a+AURUM&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors duration-150"
            >
              Contato
            </a>
          </nav>
        </div>

        <p className="text-zinc-700 text-xs mt-8">
          © {new Date().getFullYear()} AURUM Nova Escola. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
