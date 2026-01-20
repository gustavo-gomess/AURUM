'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

  const features = [
    {
      icon: BookOpen,
      title: "Conteúdo Completo",
      description: "5 módulos especializados em educação financeira básica"
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
      color: "from-yellow-400 to-yellow-600"
    },
    {
      icon: PiggyBank,
      title: "Dinheiro, Bancos e Governos",
      description: "Entenda o papel do dinheiro e como instituições e governos impactam você",
      lessons: 10,
      color: "from-green-400 to-green-600"
    },
    {
      icon: TrendingUp,
      title: "Dívidas, Gastos e Orçamento",
      description: "Organize despesas, saia das dívidas e planeje seu orçamento",
      lessons: 10,
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Shield,
      title: "Renda Fixa",
      description: "Conheça produtos e estratégias de renda fixa para investir com segurança",
      lessons: 12,
      color: "from-red-400 to-red-600"
    },
    {
      icon: BarChart3,
      title: "Renda Variável",
      description: "Aprenda sobre renda variável e como construir uma carteira diversificada",
      lessons: 19,
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: DollarSign,
      title: "Aula Bônus",
      description: "Uma aula extra com conteúdo prático para acelerar seus resultados",
      lessons: 1,
      color: "from-orange-400 to-orange-600"
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
              <Card key={index} className="bg-gray-900 border-gray-800 hover:shadow-lg transition-all">
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
                  </div>
                </CardContent>
              </Card>
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
            <div className="absolute top-4 right-4">
              <Badge className="bg-black/90 text-yellow-400 px-3 py-1 rounded-full text-xs tracking-wide">POPULAR</Badge>
            </div>
            
            <CardHeader className="text-center pb-6 pt-10">
              <CardTitle className="text-3xl lg:text-4xl font-bold">Curso Completo</CardTitle>
              <div className="mt-5 flex items-end justify-center gap-2">
                <span className="text-5xl lg:text-6xl font-bold">R$ 197</span>
                <span className="text-base font-medium pb-1">/mês</span>
              </div>
              <p className="text-black/80 mt-3">Pagamento mensal • Acesso anual</p>
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

            <div>
              <h3 className="font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500">Sobre</a></li>
                <li><a href="#" className="hover:text-yellow-500">Blog</a></li>
                <li><a href="#" className="hover:text-yellow-500">Contato</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500">Termos</a></li>
                <li><a href="#" className="hover:text-yellow-500">Privacidade</a></li>
                <li><a href="#" className="hover:text-yellow-500">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AURUM. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}