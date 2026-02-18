'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Logo } from '@/components/logo'
import { 
  BookOpen, 
  Play, 
  Users, 
  Star, 
  CheckCircle,
  Target,
  TrendingUp,
  Shield,
  DollarSign,
  BarChart3,
  PiggyBank
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null)

  const features = [
    {
      icon: BookOpen,
      title: "Conteúdo Completo",
      description: "5 módulos especializados qiue vai da educação financeira basica ao avançado"
    },
    {
      icon: Play,
      title: "Vídeos Práticos",
      description: "Aulas em vídeo com exemplos reais e aplicações práticas"
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Interaja com outros estudantes e tire suas dúvidas"
    }
  ]

  const modules = [
    {
      icon: Target,
      title: "Mentalidade",
      description: "Fundamentos e hábitos para construir uma base financeira sólida",
      lessons: 15,
      color: "from-yellow-400 to-yellow-600",
      items: [
        'LIMPAR O TERRENO',
        'MENTALIDADE ABUNDÂNCIA X MENTALIDADE ESCASSEZ',
        'CRENÇAS LIMITANTES SOBRE VOCÊ',
        'CRENÇAS LIMITANTES EM RELAÇÃO AO DINHEIRO',
        'O PODER DO AMBIENTE E DAS PESSOAS AO REDOR',
        'COMPORTAMENTO; FICAR RICO É COMPORTAMENTAL E NÃO INTELECTUAL',
        'COMO CRIAR UM HÁBITO',
        'MINDSET LONGO PRAZO X IMEDIATO',
        'FOCO E PRIORIDADES',
        'IMPORTÂNCIA DA META - COMO ESTABELECER UMA',
        'AUTO RESPONSABILIDADE A CHAVE PRA MUDAR DE VIDA',
        'COMO LIDAR COM O MEDO E O FRACASSO FINANCEIRO',
        'MELHORIA CONTÍNUA',
        'APRENDA A SER GRATO'
      ]
    },
    {
      icon: PiggyBank,
      title: "Dinheiro, Bancos e Governos",
      description: "Entenda o papel do dinheiro e como instituições e governos impactam você",
      lessons: 10,
      color: "from-green-400 to-green-600",
      items: [
        'A HISTÓRIA DO DINHEIRO',
        'MOEDAS FIDUCIÁRIAS O FIM DO LASTRO EM OURO',
        'QUAL A FUNÇÃO DO DINHEIRO',
        'INFLAÇÃO; O QUE É E COMO FUNCIONA',
        'INFLAÇÃO X DEFLAÇÃO',
        'RESERVAS FRACIONÁRIAS; O DINHEIRO QUE NÃO EXISTE',
        'EFEITO CANTILLON',
        'PORQUE OS GOVERNOS FAZEM DIVIDAS',
        'A IMPORTÂNCIA DO CAPITALISMO',
        'CONCLUSÃO E FECHAMENTO; O PAPEL DA INFLAÇÃO NA EXPANSÃO DA DIVIDA PÚBLICA'
      ]
    },
    {
      icon: TrendingUp,
      title: "Dívidas, Gastos e Orçamento",
      description: "Organize despesas, saia das dívidas e planeje seu orçamento",
      lessons: 10,
      color: "from-blue-400 to-blue-600",
      items: [
        'DIAGNÓSTICO FINANCEIRO ENTENDENDO A RAIZ DO ENDIVIDAMENTO',
        'O CUSTO INVISÍVEL DA DÍVIDA O PREÇO QUE VOCÊ NÃO VÊ',
        'COMO SAIR DAS DÍVIDAS - PASSO A PASSO',
        'A VIDA DO ZERO A ZERO O ENGANO DA SOBREVIVÊNCIA FINANCEIRA',
        'O GRANDE VILÃO O CONSUMO AUTOMÁTICO',
        'A MENTIRA DO EU MEREÇO E DA CLASSE MÉDIA ENDIVIDADA',
        'POR QUE SOBRAR DINHEIRO NÃO É O FIM, MAS O COMEÇO',
        'CRIANDO O SEU ORÇAMENTO PESSOAL INTELIGENTE',
        'O PRIMEIRO PASSO PARA INVESTIR E FAZER O DINHEIRO TRABALHAR',
        'AULA EXTRA - COMO CONVERSAR SOBRE DINHEIRO COM A FAMÍLIA'
      ]
    },
    {
      icon: Shield,
      title: "Renda Fixa",
      description: "Conheça produtos e estratégias de renda fixa para investir com segurança",
      lessons: 12,
      color: "from-red-400 to-red-600",
      items: [
        'O QUE É A RENDA FIXA',
        'MITOS E VERDADES DA RENDA FIXA',
        'ENDIVIDAMENTO X INVESTIMENTOS - CONSÓRCIOS, FINANCIAMENTOS E TÍTULOS DE CAPITALIZAÇÃO',
        'TESOURO DIRETO (SELIC, PREFIXADO E IPCA+)',
        'CDB, LCI, LCA E CDI; ENTENDENDO A RENDA FIXA DOS BANCOS E O PAPEL DO FGC',
        'RISCO DE CRÉDITO E BANCOS RUINS',
        'DEBÊNTURES, CRI E CRA A RENDA FIXA DE EMPRESAS',
        'IOF, IR E TRIBUTAÇÃO NA RENDA FIXA + COE',
        'PIRÂMIDES FINANCEIRAS E GOLPES',
        'CORRETORAS, BANCOS E HOME BROKER POR ONDE INVESTIR',
        'RESERVA DE EMERGÊNCIA ONDE COLOCAR NA PRÁTICA',
        'COMPRANDO TESOURO DIRETO NA PRÁTICA - PASSO A PASSO'
      ]
    },
    {
      icon: BarChart3,
      title: "Renda Variável",
      description: "Aprenda sobre renda variável e como construir uma carteira diversificada",
      lessons: 19,
      color: "from-purple-400 to-purple-600",
      items: [
        'RENDA VARIÁVEL E ESCOLAS DE ANÁLISE FUNDAMENTALISTA X GRÁFICA',
        'AÇÕES O QUE SÃO E PORQUE INVESTIR',
        'TIPOS DE AÇÕES E NOMENCLATURAS (ON, PN, UNITS E TAG ALONG)',
        'INDICADORES FUNDAMENTAIS QUE TODO INVESTIDOR DEVE CONHECER',
        'FERRAMENTAS E SITES PARA CONSULTAR INDICADORES',
        'COMO COMPRAR AÇÕES PELO HOME BROKER E PRINCIPAIS FUNCIONALIDADES',
        'PROVENTOS DIVIDENDOS; JCP; BONIFICAÇÕES E SUBSCRIÇÕES',
        'DESDOBRAMENTOS E GRUPAMENTOS POR QUE AS EMPRESAS FAZEM ISSO',
        'LEITURA DE GRÁFICOS CANDLESTICKS; SUPORTES E RESISTÊNCIAS',
        'ALUGUEL DE AÇÕES E OUTRAS FORMAS DE RENTABILIZAR SUA CARTEIRA',
        'FUNDOS DE AÇÕES E MULTIMERCADOS COMO FUNCIONAM E QUANDO USAR',
        'FUNDOS IMOBILIÁRIOS (FIIS) COMO GERAM RENDA PASSIVA',
        'PREVIDÊNCIA PRIVADA (PGBL E VGBL) QUANDO VALE A PENA',
        'CARTEIRA DE INVESTIMENTOS E DIVERSIFICAÇÃO INTELIGENTE'
      ]
    },
    {
      icon: DollarSign,
      title: "Aula Bônus",
      description: "Uma aula extra com conteúdo prático para acelerar seus resultados",
      lessons: 1,
      color: "from-orange-400 to-orange-600",
      items: []
    }
  ]

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Estudante",
      comment: "Consegui organizar minhas finanças e já estou investindo. Mudou minha vida!",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Empreendedor",
      comment: "O curso me deu a base necessária para expandir meu negócio com segurança.",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Professora",
      comment: "Finalmente entendi como fazer meu dinheiro render. Recomendo muito!",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Logo variant="light" size="sm" />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-300 hover:text-yellow-500 transition-colors">Sobre</a>
              <a href="#modules" className="text-gray-300 hover:text-yellow-500 transition-colors">Módulos</a>
              <a href="#pricing" className="text-gray-300 hover:text-yellow-500 transition-colors">Preços</a>
            </nav>

            {/* CTA */}
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/login')}
                className="bg-yellow-500 hover:bg-yellow-400 text-black"
              >
                Acessar Plataforma
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-yellow-500 text-black px-4 py-2">
                  🚀 Transforme sua vida financeira
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Domine suas
                  <span className="text-yellow-500"> Finanças </span>
                  e Alcance a
                  <span className="text-yellow-500"> Liberdade </span>
                  Financeira
                </h1>
                <p className="text-xl text-gray-400 max-w-lg">
                  Aprenda com especialistas os fundamentos da educação financeira 
                  e transforme sua relação com o dinheiro para sempre.
                </p>
              </div>


            </div>

            <div className="w-full">
              <div className="aspect-video bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                <iframe
                  src="https://player.vimeo.com/video/1146940366?h=0&badge=0&autopause=0&title=0&byline=0&portrait=0&controls=1&dnt=1&playsinline=1"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="AURUM - Aula de apresentação"
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Por que escolher a <span className="text-yellow-500">AURUM</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Nossa plataforma oferece tudo que você precisa para dominar suas finanças pessoais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-black" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Módulos do <span className="text-yellow-500">Curso</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Conteúdo estruturado para levar você do zero à independência financeira
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((moduleItem, index) => (
              <Dialog
                key={index}
                open={openModuleIndex === index}
                onOpenChange={(open) => setOpenModuleIndex(open ? index : null)}
              >
                <Card className="bg-gray-900 border-0 shadow-sm hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${moduleItem.color} rounded-lg flex items-center justify-center mb-4`}>
                      <moduleItem.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{moduleItem.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {moduleItem.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {moduleItem.lessons} aulas
                      </span>
                      <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-[11px] text-yellow-400 hover:text-black hover:bg-yellow-400"
                          >
                            Clque aqui para ver mais detalhes
                          </Button>
                        </DialogTrigger>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                <DialogContent className="bg-gray-900 border border-gray-800 text-white max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl shadow-2xl p-8 sm:p-10">
                  <DialogHeader className="space-y-2 pr-10 p-0 text-left">
                    <DialogTitle className="text-yellow-400 text-2xl">{moduleItem.title}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-6">
                    <p className="text-sm sm:text-base text-gray-300">{moduleItem.description}</p>
                    {moduleItem.items.length > 0 ? (
                      <>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-yellow-400 font-semibold">
                          O que você vai aprender
                        </p>
                        <ul className="space-y-3">
                          {moduleItem.items.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-gray-200">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Em breve mais detalhes desse conteúdo.
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>


      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Invista no seu <span className="text-yellow-500">Futuro</span>
            </h2>
            <p className="text-xl text-gray-400">
              Acesso completo ao curso por um preço que cabe no seu bolso
            </p>
          </div>

          <Card className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
            <CardHeader className="text-center pb-6 pt-6">
              <CardTitle className="text-3xl lg:text-4xl font-bold">Curso Completo</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pb-10">
              <div className="h-px bg-black/10"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-700" />
                    <span>5 módulos completos</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-700" />
                    <span>Acesso anual</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-700" />
                    <span>Atualizações gratuitas</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-700" />
                    <span>Suporte especializado</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-700" />
                    <span>Comunidade exclusiva</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-700" />
                    <span>Garantia de 7 dias</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
            Pronto para transformar sua vida financeira?
          </h2>
          <p className="text-xl text-black/80 mb-8">
            Junte-se a milhares de pessoas que já mudaram sua relação com o dinheiro
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold">A</span>
                </div>
                <span className="text-xl font-bold text-yellow-500">AURUM</span>
              </div>
              <p className="text-gray-400">
                Transformando vidas através da educação financeira.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Curso</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500">Módulos</a></li>
                <li><a href="#" className="hover:text-yellow-500">Suporte</a></li>
              </ul>
            </div>
          </div>


          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 AURUM. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}