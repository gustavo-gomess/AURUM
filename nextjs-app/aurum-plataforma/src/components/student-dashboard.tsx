'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Play, Lock, CheckCircle, Clock, BookOpen, Users, MessageSquare, ChevronRight, Star, Calendar, Award, TrendingUp } from 'lucide-react'
import { Navigation } from '@/components/navigation'

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  enrollments?: any[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  modules?: Module[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration?: string;
  moduleId: string;
  order: number;
}

interface DashboardData {
  user: User;
  courses: Course[];
  progress: {
    overallProgress: number;
    completedModules: number;
    totalModules: number;
    completedLessons: number;
    totalLessons: number;
  };
}

export function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchDashboardData(token)
  }, [router])

  const fetchDashboardData = async (token: string) => {
    try {
      // Buscar dados do usuário
      const userResponse = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await userResponse.json()

      // Buscar cursos
      const coursesResponse = await fetch('/api/courses')
      const coursesData = await coursesResponse.json()

      // Calcular progresso (simulado por enquanto)
      const progress = {
        overallProgress: 35,
        completedModules: 3,
        totalModules: 10,
        completedLessons: 12,
        totalLessons: 30
      }

      setData({
        user: userData.user,
        courses: coursesData.courses || [],
        progress
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      localStorage.removeItem('token')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Erro ao carregar dados</p>
      </div>
    )
  }

  const { user, courses, progress } = data

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header do Dashboard */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-white mb-2">
                Olá, {user.name}! 👋
              </h1>
              <p className="text-gray-400">
                Continue sua jornada em educação financeira na plataforma AURUM
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">1250</span>
                </div>
                <p className="text-xs text-gray-400">Pontos</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center space-x-1 text-yellow-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">7</span>
                </div>
                <p className="text-xs text-gray-400">Dias seguidos</p>
              </div>
              
              <Badge variant="secondary" className="bg-yellow-500 text-black">
                {user.role === 'STUDENT' ? 'Estudante' : user.role}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar com Módulos */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 bg-gray-900 border-gray-800">
              <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                  <BookOpen className="w-5 h-5 text-yellow-500" />
                  <span>Módulos do Curso</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Educação Financeira Básica - {progress.completedModules} de {progress.totalModules} concluídos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => {
                  const isCompleted = index < progress.completedModules
                  const isCurrent = index === progress.completedModules
                  const isLocked = index > progress.completedModules

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border border-gray-700 transition-all cursor-pointer ${
                        isLocked ? 'opacity-50 pointer-events-none' : ''
                      } ${
                        isCurrent ? 'border-yellow-500 bg-gray-800' : ''
                      } ${
                        isCompleted ? 'border-green-500 bg-gray-800' : ''
                      } ${
                        selectedModule === index.toString() ? 'ring-2 ring-yellow-500' : ''
                      }`}
                      onClick={() => !isLocked && setSelectedModule(
                        selectedModule === index.toString() ? null : index.toString()
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-gray-500" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Play className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className="font-medium text-sm">
                            Módulo {index + 1}
                          </span>
                        </div>
                        {!isLocked && (
                          <ChevronRight className={`w-4 h-4 transition-transform ${
                            selectedModule === index.toString() ? 'rotate-90' : ''
                          }`} />
                        )}
                      </div>
                      
                      <h4 className="font-medium text-sm mb-1 text-white">Módulo {index + 1}</h4>
                      <p className="text-xs text-gray-400 mb-2">Fundamentos financeiros</p>
                      
                      {!isLocked && (
                        <div className="space-y-1">
                          <Progress value={isCompleted ? 100 : isCurrent ? 60 : 0} className="h-1" />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{isCompleted ? 100 : isCurrent ? 60 : 0}% completo</span>
                            <span>2h 30min</span>
                          </div>
                        </div>
                      )}

                      {isLocked && (
                        <p className="text-xs text-gray-500 mt-2">
                          Complete o módulo anterior para desbloquear
                        </p>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3 space-y-8">
            {/* Progresso Geral */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span>Seu Progresso</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">
                      {progress.overallProgress}%
                    </div>
                    <p className="text-sm text-gray-400">Progresso Geral</p>
                    <Progress value={progress.overallProgress} className="mt-2" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-1">
                      {progress.completedModules}
                    </div>
                    <p className="text-sm text-gray-400">Módulos Concluídos</p>
                    <p className="text-xs text-gray-500 mt-1">
                      de {progress.totalModules} módulos
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">
                      {progress.completedLessons}
                    </div>
                    <p className="text-sm text-gray-400">Vídeos Assistidos</p>
                    <p className="text-xs text-gray-500 mt-1">
                      de {progress.totalLessons} vídeos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Próxima Aula */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Play className="w-5 h-5 text-yellow-500" />
                  <span>Continue Assistindo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Play className="w-12 h-12" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <Badge variant="outline" className="mb-2">
                      Módulo 4: Investimentos
                    </Badge>
                    <h3 className="text-xl font-semibold mb-2">
                      Fundamentos de Investimentos
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Aprenda os conceitos básicos de investimentos e como fazer seu dinheiro trabalhar para você
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>25:30</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>Educação Financeira</span>
                      </div>
                    </div>
                    
                    <Button className="bg-yellow-500 hover:bg-yellow-400 text-black">
                      <Play className="w-4 h-4 mr-2" />
                      Continuar Assistindo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cursos Disponíveis */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  <span>Cursos Disponíveis</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Explore e se matricule em novos cursos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <div key={course.id} className="border border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-gray-800">
                      <div className="aspect-video bg-gray-700 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-gray-500" />
                      </div>
                      <div className="p-4">
                        <Badge variant="outline" className="mb-2 text-xs">
                          Curso
                        </Badge>
                        <h4 className="font-semibold text-sm mb-2 text-white">{course.title}</h4>
                        <p className="text-xs text-gray-400 mb-3">{course.description}</p>
                        <Button 
                          size="sm" 
                          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black"
                          onClick={() => router.push(`/cursos/${course.id}`)}
                        >
                          Acessar Curso
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seção de Comunidade */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <MessageSquare className="w-5 h-5 text-yellow-500" />
                  <span>Comunidade</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Interaja com outros estudantes e instrutores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                    <Avatar>
                      <AvatarFallback>Prof</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm">Prof. João Silva</span>
                        <Badge variant="secondary" className="text-xs">Instrutor</Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        Parabéns pelo progresso! Continue assim que logo você dominará as finanças pessoais! 💰
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                    <Avatar>
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm">Ana Santos</span>
                        <Badge variant="outline" className="text-xs">Estudante</Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        Alguém mais teve dificuldade com planejamento financeiro? Consegui organizar meu orçamento seguindo o exemplo do vídeo!
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-black hover:border-yellow-500">
                    <Users className="w-4 h-4 mr-2" />
                    Ver Todas as Discussões
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
