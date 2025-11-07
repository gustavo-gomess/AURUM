'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Play, 
  Trophy, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Target,
  TrendingUp,
  Shield,
  Award,
  Clock,
  DollarSign,
  BarChart3,
  PiggyBank,
  LineChart
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const features = [
    {
      icon: BookOpen,
      title: "Conteúdo Completo",
      description: "10+ módulos especializados em educação financeira básica"
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
    },
    {
      icon: Award,
      title: "Certificado",
      description: "Receba certificado reconhecido ao concluir o curso"
    }
  ]

  const modules = [
    {
      icon: Target,
      title: "Mentalidade Financeira",
      description: "Desenvolva a mentalidade certa para alcançar a liberdade financeira",
      lessons: 15,
      color: "from-yellow-400 to-yellow-600"
    },
    {
      icon: PiggyBank,
      title: "Orçamento Pessoal",
      description: "Aprenda a organizar suas finanças e controlar seus gastos",
      lessons: 8,
      color: "from-green-400 to-green-600"
    },
    {
      icon: TrendingUp,
      title: "Investimentos",
      description: "Faça seu dinheiro trabalhar para você com investimentos seguros",
      lessons: 12,
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Shield,
      title: "Controle de Dívidas",
      description: "Estratégias para quitar dívidas e evitar o endividamento",
      lessons: 6,
      color: "from-red-400 to-red-600"
    },
    {
      icon: BarChart3,
      title: "Planejamento",
      description: "Planeje seu futuro financeiro com metas claras e alcançáveis",
      lessons: 10,
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: DollarSign,
      title: "Renda Extra",
      description: "Descubra formas de aumentar sua renda e diversificar fontes",
      lessons: 7,
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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-yellow-500">AURUM</h1>
                <p className="text-xs text-gray-400">Educação Financeira</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-300 hover:text-yellow-500 transition-colors">Sobre</a>
              <a href="#modules" className="text-gray-300 hover:text-yellow-500 transition-colors">Módulos</a>
              <a href="#testimonials" className="text-gray-300 hover:text-yellow-500 transition-colors">Depoimentos</a>
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


              {/* Stats */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">1000+</div>
                  <div className="text-sm text-gray-400">Alunos Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">4.9</div>
                  <div className="text-sm text-gray-400">Avaliação</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">50h</div>
                  <div className="text-sm text-gray-400">Conteúdo</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Video Preview */}
            <div className="relative">
              <Card className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <Play className="w-16 h-16 text-white/90 cursor-pointer hover:scale-110 transition-transform" />
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-red-500 text-white">AO VIVO</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Aula Gratuita: Primeiros Passos
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Assista nossa aula introdutória e descubra como transformar suas finanças.
                  </p>
                </CardContent>
              </Card>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <ArrowRight className="w-4 h-4 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              O que nossos <span className="text-yellow-500">Alunos</span> dizem
            </h2>
            <p className="text-xl text-gray-400">
              Histórias reais de transformação financeira
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">
                    &quot;{testimonial.comment}&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
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

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-black relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-black text-yellow-500">POPULAR</Badge>
            </div>
            
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">Curso Completo</CardTitle>
              <div className="text-5xl font-bold mt-4">
                R$ 197
                <span className="text-lg font-normal">/único</span>
              </div>
              <p className="text-black/80 mt-2">Pagamento único • Acesso vitalício</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-700" />
                    <span>10+ módulos completos</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-700" />
                    <span>50+ horas de conteúdo</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-700" />
                    <span>Certificado de conclusão</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-700" />
                    <span>Acesso vitalício</span>
                  </div>
                </div>
                <div className="space-y-3">
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
                    <span>Atualizações gratuitas</span>
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
                <li><a href="#" className="hover:text-yellow-500">Certificado</a></li>
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