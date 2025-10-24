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
  userProgress?: any[]; // Array com o progresso detalhado de cada aula
  lastWatchedLesson?: {
    moduleIndex: number;
    lessonIndex: number;
    moduleTitle: string;
    lessonTitle: string;
    lessonDescription: string;
    completed: boolean;
  } | null;
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

      // Buscar curso AURUM completo com módulos e aulas
      const aurumCourseResponse = await fetch('/api/courses/aurum-course-id')
      const aurumCourseData = await aurumCourseResponse.json()
      const aurumCourse = aurumCourseData.course
      
      // Calcular progresso REAL do usuário
      let progress = {
        overallProgress: 0,
        completedModules: 0,
        totalModules: 5, // 5 módulos fixos
        completedLessons: 0,
        totalLessons: 66 // Total de aulas (15+10+10+12+19)
      }

      let lastWatchedLesson = null

      if (aurumCourse) {
        // Buscar progresso real do banco
        const progressResponse = await fetch('/api/progress/aurum-course-id', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          const userProgress = progressData.progress || []

          // Contar aulas concluídas
          const completedLessons = userProgress.filter((p: any) => p.completed).length
          progress.completedLessons = completedLessons

          // Calcular módulos concluídos
          // Módulo é considerado concluído quando todas as suas aulas estão concluídas
          const lessonsByModule = [
            15, // Módulo 1: 15 aulas
            10, // Módulo 2: 10 aulas
            10, // Módulo 3: 10 aulas
            12, // Módulo 4: 12 aulas
            19  // Módulo 5: 19 aulas
          ]

          let completedModules = 0
          let totalLessonsChecked = 0

          for (let moduleIndex = 0; moduleIndex < lessonsByModule.length; moduleIndex++) {
            const moduleLessonsCount = lessonsByModule[moduleIndex]
            const moduleLessonsCompleted = userProgress.filter((p: any) => 
              p.moduleIndex === moduleIndex && p.completed
            ).length

            if (moduleLessonsCompleted === moduleLessonsCount) {
              completedModules++
            }

            totalLessonsChecked += moduleLessonsCount
          }

          progress.completedModules = completedModules

          // Calcular progresso geral (porcentagem)
          progress.overallProgress = Math.round((completedLessons / progress.totalLessons) * 100)

          // Encontrar a última aula NÃO concluída (aula que o usuário parou)
          let lastProgress = null

          // Primeiro, tentar encontrar aulas NÃO concluídas ordenadas por última atualização
          const incompleteLessons = userProgress.filter((p: any) => !p.completed)
          
          if (incompleteLessons.length > 0) {
            // Ordenar por updatedAt (mais recente primeiro)
            const sortedIncomplete = [...incompleteLessons].sort((a: any, b: any) => {
              const dateA = new Date(a.updatedAt || a.createdAt).getTime()
              const dateB = new Date(b.updatedAt || b.createdAt).getTime()
              return dateB - dateA
            })
            lastProgress = sortedIncomplete[0] // Última aula NÃO concluída
          } else {
            // Se todas as aulas foram concluídas, pegar a próxima aula disponível
            // Procurar a primeira aula que não tem progresso registrado
            let foundNextLesson = false
            for (let modIndex = 0; modIndex < aurumCourse.modules.length && !foundNextLesson; modIndex++) {
              const module = aurumCourse.modules[modIndex]
              for (let lesIndex = 0; lesIndex < module.lessons.length && !foundNextLesson; lesIndex++) {
                const hasProgress = userProgress.some((p: any) => 
                  p.moduleIndex === modIndex && p.lessonIndex === lesIndex
                )
                if (!hasProgress) {
                  lastProgress = {
                    moduleIndex: modIndex,
                    lessonIndex: lesIndex,
                    completed: false
                  }
                  foundNextLesson = true
                }
              }
            }
          }

          // Se não há progresso algum, pega a primeira aula do primeiro módulo
          if (!lastProgress && aurumCourse.modules?.length > 0) {
            lastProgress = {
              moduleIndex: 0,
              lessonIndex: 0,
              completed: false
            }
          }

          // Buscar informações da aula
          if (lastProgress && aurumCourse.modules) {
            const module = aurumCourse.modules[lastProgress.moduleIndex]
            if (module && module.lessons) {
              const lesson = module.lessons[lastProgress.lessonIndex]
              if (lesson) {
                lastWatchedLesson = {
                  moduleIndex: lastProgress.moduleIndex,
                  lessonIndex: lastProgress.lessonIndex,
                  moduleTitle: module.title,
                  lessonTitle: lesson.title,
                  lessonDescription: lesson.description || 'Continue sua jornada de aprendizado',
                  completed: lastProgress.completed || false
                }
              }
            }
          }
        }
      }

      setData({
        user: userData.user,
        courses: coursesData.courses || [],
        progress,
        userProgress: aurumCourse ? (await fetch('/api/progress/aurum-course-id', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).then(data => data.progress || [])) : [],
        lastWatchedLesson
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

  const { user, courses, progress, userProgress, lastWatchedLesson } = data

  const handleContinueWatching = () => {
    if (lastWatchedLesson) {
      // Navegar para o curso com os parâmetros da última aula
      const url = `/cursos/aurum-course-id?module=${lastWatchedLesson.moduleIndex}&lesson=${lastWatchedLesson.lessonIndex}`
      router.push(url)
    }
  }

  // Função para calcular a porcentagem de conclusão de um módulo
  const calculateModuleProgress = (moduleIndex: number, totalLessons: number) => {
    if (!userProgress || userProgress.length === 0) return 0
    
    const completedLessonsInModule = userProgress.filter((p: any) => 
      p.moduleIndex === moduleIndex && p.completed
    ).length
    
    return Math.round((completedLessonsInModule / totalLessons) * 100)
  }

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
              <p className="text-yellow-500">
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
                {[
                  { title: '01 MENTALIDADE', description: 'Fundamentos da mentalidade financeira', lessons: 15 },
                  { title: '02 DINHEIRO, BANCOS E GOVERNOS', description: 'Sistema financeiro e moedas', lessons: 10 },
                  { title: '03 DÍVIDAS, GASTOS E ORÇAMENTO', description: 'Controle financeiro e orçamento', lessons: 10 },
                  { title: '04 RENDA FIXA', description: 'Investimentos em renda fixa', lessons: 12 },
                  { title: '05 RENDA VARIÁVEL', description: 'Ações e análise fundamentalista', lessons: 19 }
                ].map((module, index) => {
                  const moduleProgress = calculateModuleProgress(index, module.lessons)
                  const isCompleted = moduleProgress === 100
                  const isCurrent = moduleProgress > 0 && moduleProgress < 100
                  // Administradores têm todos os módulos desbloqueados
                  const isLocked = user.role === 'ADMIN' ? false : (index > 0 && calculateModuleProgress(index - 1, [15, 10, 10, 12, 19][index - 1]) < 100)

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
                          ) : moduleProgress > 0 ? (
                            <Play className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <Play className="w-4 h-4 text-gray-500" />
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
                      
                      <h4 className="font-medium text-sm mb-1 text-white">{module.title}</h4>
                      <p className="text-xs text-gray-400 mb-2">{module.description}</p>
                      
                      {!isLocked && (
                        <div className="space-y-1">
                          <Progress value={moduleProgress} className="h-1" />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{moduleProgress}% completo</span>
                            <span>{module.lessons} aulas</span>
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
            {lastWatchedLesson && (
              <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Play className="w-5 h-5 text-yellow-500" />
                    <span>Continue Assistindo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="aspect-video bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg overflow-hidden border border-yellow-500/30">
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-16 h-16 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <Badge variant="outline" className="mb-2 border-yellow-500/50 text-yellow-500">
                        {lastWatchedLesson.moduleTitle}
                      </Badge>
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {lastWatchedLesson.lessonTitle}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {lastWatchedLesson.lessonDescription}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>Educação Financeira</span>
                        </div>
                        {lastWatchedLesson.completed ? (
                          <div className="flex items-center space-x-1 text-green-500">
                            <CheckCircle className="w-4 h-4" />
                            <span>Concluída</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <Clock className="w-4 h-4" />
                            <span>Em andamento</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                        onClick={handleContinueWatching}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continuar Assistindo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
