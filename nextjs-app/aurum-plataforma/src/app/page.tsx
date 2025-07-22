import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-yellow-500">AURUM</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#inicio" className="hover:text-yellow-500 transition-colors">Início</a>
            <a href="#cursos" className="hover:text-yellow-500 transition-colors">Cursos</a>
            <a href="#sobre" className="hover:text-yellow-500 transition-colors">Sobre nós</a>
          </nav>
          <div className="flex space-x-4">
            <button className="text-white hover:text-yellow-500 transition-colors">Entrar</button>
            <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Cadastrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Nossos <span className="text-yellow-500">Cofundadores</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Conheça os visionários por trás da AURUM. Nossa equipe de liderança acumula décadas de experiência em 
            finanças, educação e tecnologia, com uma missão clara: democratizar o conhecimento financeiro de 
            qualidade no Brasil.
          </p>
        </div>
      </section>

      {/* Cofundadores Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Nossos <span className="text-yellow-500">Cofundadores</span>
          </h2>
          <p className="text-center text-gray-300 mb-12">
            Conheça a equipe que está transformando a educação financeira no Brasil
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Eric Da Silva Martinello Rocha */}
            <div className="bg-black rounded-lg p-6 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Eric Da Silva Martinello Rocha</h3>
              <p className="text-yellow-500 mb-3">CEO e Cofundador</p>
              <p className="text-gray-300 text-sm">
                Especialista em educação financeira e liderança estratégica, com mais de 15 anos de experiência no 
                mercado financeiro.
              </p>
            </div>

            {/* Cledemilson dos Santos */}
            <div className="bg-black rounded-lg p-6 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Cledemilson dos Santos</h3>
              <p className="text-yellow-500 mb-3">CTO e Cofundador</p>
              <p className="text-gray-300 text-sm">
                Gestor financeiro com vasta experiência em estruturação financeira e investimentos para grandes 
                corporações.
              </p>
            </div>

            {/* Gustavo Henrique Silveira Gomes */}
            <div className="bg-black rounded-lg p-6 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Gustavo Henrique Silveira Gomes</h3>
              <p className="text-yellow-500 mb-3">CPO e Cofundador</p>
              <p className="text-gray-300 text-sm">
                Especialista em operações e processos, com foco em eficiência e implementação de metodologias ágeis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curso em Destaque */}
      <section id="cursos" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Curso em <span className="text-yellow-500">Destaque</span>
          </h2>
          <p className="text-center text-gray-300 mb-12">
            Transforme sua relação com o dinheiro e construa um futuro financeiro sólido
          </p>
          
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 flex items-center justify-center bg-yellow-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-2xl font-bold text-black mb-2">EDUCAÇÃO FINANCEIRA</h3>
                  <p className="text-black font-semibold">Construindo Riqueza</p>
                </div>
              </div>
              <div className="md:w-1/2 p-8 bg-white text-black">
                <h3 className="text-2xl font-bold mb-4">EDUCAÇÃO FINANCEIRA: Construindo Riqueza</h3>
                <p className="text-gray-700 mb-6">
                  Um programa de educação financeira com estratégias práticas para 
                  construir patrimônio, investir corretamente e conquistar independência 
                  financeira.
                </p>
                
                <div className="flex items-center space-x-4 mb-6">
                  <span className="flex items-center"><span className="mr-2">⏱️</span> 40 horas</span>
                  <span className="flex items-center"><span className="mr-2">📚</span> 72 aulas</span>
                  <span className="flex items-center"><span className="mr-2">🎓</span> Certificado</span>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold mb-2">O que você vai aprender:</h4>
                  <ul className="text-sm space-y-1">
                    <li>✓ Planejamento financeiro completo</li>
                    <li>✓ Estratégias de investimento para diferentes perfis</li>
                    <li>✓ Como sair de dívidas e construir patrimônio</li>
                    <li>✓ Psicologia financeira e comportamento</li>
                    <li>✓ Independência financeira e aposentadoria</li>
                  </ul>
                </div>

                <div className="bg-yellow-100 p-4 rounded-lg mb-6">
                  <p className="text-sm font-semibold">Política de reembolso: Devolvemos o seu dinheiro em até sete dias, com direito ao arrependimento.</p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">12x de R$ 166,67</div>
                  <p className="text-sm text-gray-600 mb-4">50% de desconto com feedback</p>
                  <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors w-full">
                    Comprar agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre a AURUM */}
      <section id="sobre" className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">
                Sobre a <span className="text-yellow-500">AURUM</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Fundada em 2025, a AURUM nasceu com um propósito claro: transformar conhecimento em 
                resultados reais para nossos alunos. Nossa plataforma foi desenvolvida por especialistas 
                apaixonados que acreditam entre o aprendizado e a aplicação prática.
              </p>
              <p className="text-gray-300 mb-6">
                No AURUM, acreditamos em uma verdade fundamental: o conhecimento precisa ser direito e 
                aplicável. Nossa filosofia rápida combina expertise e alcance a digitalização com 
                eficiência.
              </p>
              <p className="text-gray-300 mb-8">
                O espírito AURUM é sobre resultados, não promessas. Aqui você encontra:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-3">✓</span>
                  Informações claras e objetivas, sem rodeios ou conhecimento desnecessário
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-3">✓</span>
                  Conteúdo relevante e atualizado constantemente com as práticas de mercado
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-3">✓</span>
                  Uma plataforma intuitiva projetada para facilitar seu aprendizado
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-3">✓</span>
                  Metodologia focada em aplicação prática e resultados mensuráveis
                </li>
              </ul>
              <p className="text-gray-300">
                Nossa missão é democratizar o acesso ao conhecimento que realmente transforma. Sem 
                frescura, sem complicações, apenas o essencial para que você alcance seus objetivos com 
                eficiência.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-800 rounded-lg p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-gray-300">Imagem da equipe AURUM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Conteúdo Assertivo</h3>
              <p className="text-gray-300">
                Sem enrolação, nossos cursos vão direto ao ponto com informações claras e aplicações que 
                realmente impactam sua vida profissional.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Certificação com Valor Real</h3>
              <p className="text-gray-300">
                Nossos certificados representam conhecimento prático que suas apenas teorias reconhecidas 
                pelo mercado por seu valor aplicável.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Resultados Garantidos</h3>
              <p className="text-gray-300">
                Nosso compromisso não é apenas com o ensino, mas com a transformação concreta da sua realidade 
                através do conhecimento aplicado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-yellow-500">AURUM</span>
          </div>
          <p className="text-gray-400 mb-4">
            Transformando conhecimento em resultados reais
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-yellow-500 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Contato</a>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            © 2025 AURUM. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

