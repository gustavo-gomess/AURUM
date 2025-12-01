'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Play, Lock, CheckCircle, Clock, BookOpen, Users, MessageSquare, ChevronRight, Award } from 'lucide-react'
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

interface UserQuestion {
  id: string;
  content: string;
  timestamp: string;
  lesson: {
    id: string;
    title: string;
    module: {
      courseId: string;
    };
  };
  user: {
    id: string;
    name: string;
    role: string;
  };
  replies: Array<{
    id: string;
    content: string;
    timestamp: string;
    user: {
      id: string;
      name: string;
      role: string;
    };
  }>;
}

export function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchDashboardData(token)
    fetchUserQuestions(token)
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
      const progress = {
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
              const courseModule = aurumCourse.modules[modIndex]
              for (let lesIndex = 0; lesIndex < courseModule.lessons.length && !foundNextLesson; lesIndex++) {
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
            const courseModule = aurumCourse.modules[lastProgress.moduleIndex]
            if (courseModule && courseModule.lessons) {
              const lesson = courseModule.lessons[lastProgress.lessonIndex]
              if (lesson) {
                lastWatchedLesson = {
                  moduleIndex: lastProgress.moduleIndex,
                  lessonIndex: lastProgress.lessonIndex,
                  moduleTitle: courseModule.title,
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

  const fetchUserQuestions = async (token: string) => {
    try {
      setLoadingQuestions(true)
      const response = await fetch('/api/comments/my-questions', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setUserQuestions(result.questions || [])
      }
    } catch (error) {
      console.error('Error fetching user questions:', error)
    } finally {
      setLoadingQuestions(false)
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Olá, {user.name}! 👋
              </h1>
              <p className="text-white text-sm sm:text-base">
                Continue sua jornada em educação financeira na plataforma AURUM
              </p>
            </div>
            
            <div className="flex items-center">
              <Badge variant="secondary" className="bg-yellow-500 text-black px-4 py-2 text-sm">
                {user.role === 'STUDENT' ? 'Estudante' : user.role}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-8">
            {/* Progresso Geral */}
            <Card className="bg-gray-900 border-2 border-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white-500">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span>Seu Progresso</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg border-2 border-yellow-500/30">
                    <div className="text-4xl font-bold text-yellow-500 mb-2">
                      {progress.overallProgress}%
                    </div>
                    <p className="text-sm text-yellow-400 font-medium mb-2">Progresso Geral</p>
                    <Progress value={progress.overallProgress} className="mt-2 h-2" />
                  </div>
                  
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg border-2 border-yellow-500/30">
                    <div className="text-4xl font-bold text-yellow-500 mb-2">
                      {progress.completedModules}
                    </div>
                    <p className="text-sm text-yellow-400 font-medium">Módulos Concluídos</p>
                    <p className="text-xs text-yellow-300 mt-1">
                      de {progress.totalModules} módulos
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg border-2 border-yellow-500/30 sm:col-span-2 lg:col-span-1">
                    <div className="text-4xl font-bold text-yellow-500 mb-2">
                      {progress.completedLessons}
                    </div>
                    <p className="text-sm text-yellow-400 font-medium">Vídeos Assistidos</p>
                    <p className="text-xs text-yellow-300 mt-1">
                      de {progress.totalLessons} vídeos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Próxima Aula */}
            {lastWatchedLesson && (
              <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white-500">
                    <Play className="w-5 h-5 text-yellow-500" />
                    <span>Continue Assistindo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/3">
                      <div className="aspect-video bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg overflow-hidden border border-yellow-500/30">
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-16 h-16 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2 border-yellow-500/50 text-yellow-500">
                        {lastWatchedLesson.moduleTitle}
                      </Badge>
                      <h3 className="text-xl font-semibold mb-2 text-yellow-400">
                        {lastWatchedLesson.lessonTitle}
                      </h3>
                      <p className="text-white-300 mb-4 text-sm">
                        {lastWatchedLesson.lessonDescription}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-white mb-4">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>Educação Financeira</span>
                        </div>
                        {lastWatchedLesson.completed ? (
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <CheckCircle className="w-4 h-4" />
                            <span>Concluída</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-white">
                            <Clock className="w-4 h-4" />
                            <span>Em andamento</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold w-full sm:w-auto"
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

            {/* Seção de Perguntas e Respostas */}
            <Card className="bg-gray-900 border-2 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white-500">
                  <MessageSquare className="w-5 h-5 text-yellow-500" />
                  <span>Perguntas realizadas</span>
                </CardTitle>
                <CardDescription className="text-yellow-300">
                  Veja as dúvidas enviadas pelos alunos e as respostas do professor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingQuestions ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-yellow-400 text-sm">Carregando suas perguntas...</p>
                  </div>
                ) : userQuestions.length === 0 ? (
                  <div className="text-center py-8 bg-gray-800/30 rounded-lg border border-gray-700">
                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-yellow-400 text-sm mb-2 font-medium">
                      Nenhuma pergunta realizada
                    </p>
                    <p className="text-yellow-300 text-xs px-4">
                      Informe suas dúvidas nos comentários em cada aula que elas serão respondidas aqui
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userQuestions.map((question) => (
                      <div key={question.id} className="bg-gray-800/50 rounded-lg p-4 space-y-3 border border-gray-700">
                        {/* Pergunta do Aluno */}
                        <div className="flex items-start space-x-3">
                          <Avatar className="flex-shrink-0">
                            <AvatarFallback className="bg-gray-600 text-white">
                              {question.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-sm text-white">{question.user.name}</span>
                              <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">Estudante</Badge>
                            </div>
                            <p className="text-xs text-yellow-300 mb-1">
                              {question.lesson.title}
                            </p>
                            <p className="text-sm text-white">
                              {question.content}
                            </p>
                          </div>
                        </div>
                        
                        {/* Resposta do Professor */}
                        {question.replies && question.replies.length > 0 ? (
                          <div className="flex items-start space-x-3 pl-4 border-l-2 border-yellow-500/30">
                            <Avatar className="flex-shrink-0">
                              <AvatarFallback className="bg-yellow-500 text-black font-semibold">
                                {question.replies[0].user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-sm text-white">{question.replies[0].user.name}</span>
                                <Badge variant="secondary" className="text-xs bg-yellow-500 text-black">Instrutor</Badge>
                              </div>
                              <p className="text-sm text-white">
                                {question.replies[0].content}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="pl-4 border-l-2 border-gray-700/30">
                            <p className="text-xs text-yellow-400 italic">
                              Aguardando resposta do professor...
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {userQuestions.length > 0 && (
                      <Button 
                        variant="outline" 
                        className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-black hover:border-yellow-500"
                        onClick={() => {
                          // Navegar para a página de cursos onde estão todas as perguntas
                          router.push('/cursos/aurum-course-id')
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Ver todas as perguntas e respostas
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
