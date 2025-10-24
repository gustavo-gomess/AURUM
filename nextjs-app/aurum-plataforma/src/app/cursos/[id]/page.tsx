'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { VimeoPlayer } from '@/components/VimeoPlayer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Lock, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  MessageSquare, 
  ChevronLeft,
  Award,
  FileText,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  vimeoVideoId: string;
  order: number;
  duration?: string;
}

interface Comment {
  id: string;
  content: string;
  timestamp: string; // Nome correto do campo no banco de dados
  createdAt?: string; // Alias para compatibilidade
  user: {
    id: string;
    name: string;
    role: string;
  };
  replies?: Comment[];
}

interface ProgressItem {
  id: string;
  moduleIndex: number;
  lessonIndex: number;
  completed: boolean;
  completedAt: string | null;
}

export default function CoursePage() {
  const [course, setCourse] = useState<Course | null>(null)
  const [currentModule, setCurrentModule] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null) // ID do comentário sendo respondido
  const [replyContent, setReplyContent] = useState('') // Conteúdo da resposta
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<ProgressItem[]>([])
  const [markingComplete, setMarkingComplete] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0])) // Primeiro módulo expandido por padrão
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchUserAndCourse(token)
  }, [params.id, router])

  // Atualizar módulo e aula quando os parâmetros de URL mudarem
  useEffect(() => {
    if (course) {
      const moduleParam = searchParams.get('module')
      const lessonParam = searchParams.get('lesson')
      
      if (moduleParam !== null && lessonParam !== null) {
        const moduleIndex = parseInt(moduleParam, 10)
        const lessonIndex = parseInt(lessonParam, 10)
        
        if (!isNaN(moduleIndex) && !isNaN(lessonIndex)) {
          if (moduleIndex >= 0 && moduleIndex < course.modules.length) {
            if (lessonIndex >= 0 && lessonIndex < course.modules[moduleIndex].lessons.length) {
              setCurrentModule(moduleIndex)
              setCurrentLesson(lessonIndex)
              // Expandir o módulo atual
              setExpandedModules(prev => new Set(prev).add(moduleIndex))
            }
          }
        }
      }
    }
  }, [course, searchParams])

  // Log quando módulo ou aula mudam e carregar comentários
  useEffect(() => {
    if (course) {
      const lesson = course.modules[currentModule]?.lessons[currentLesson]
      if (lesson) {
        console.log(`📺 Aula mudou: Módulo ${currentModule + 1}, Aula ${currentLesson + 1} - ${lesson.title}`)
        console.log(`🎬 Video ID: ${lesson.vimeoVideoId}`)
        // Carregar comentários da aula atual
        fetchComments(lesson.id)
      }
    }
  }, [currentModule, currentLesson, course])

  const fetchUserAndCourse = async (token: string) => {
    try {
      // Buscar dados do usuário
      const userResponse = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const userData = await userResponse.json()
      setUser(userData.user)

      // Buscar curso com módulos e aulas
      const courseResponse = await fetch(`/api/courses/${params.id}`)
      if (courseResponse.ok) {
        const courseData = await courseResponse.json()
        setCourse(courseData.course)
        
        // Buscar progresso do usuário
        await fetchProgress(token, params.id as string)
      } else {
        router.push('/cursos')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      localStorage.removeItem('token')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async (token: string, courseId: string) => {
    try {
      const response = await fetch(`/api/progress/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProgress(data.progress || [])
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const fetchComments = async (lessonId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/lessons/${lessonId}/comments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('📩 Comentários recebidos:', result)
        // API retorna { success: true, data: comments }
        setComments(result.data || result.comments || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handlePostComment = async () => {
    if (!newComment.trim()) return

    try {
      const token = localStorage.getItem('token')
      if (!token || !currentLessonData) return

      console.log('📤 Enviando comentário:', { content: newComment, lessonId: currentLessonData.id })

      const response = await fetch(`/api/lessons/${currentLessonData.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      })

      const result = await response.json()
      console.log('📥 Resposta do servidor:', result)

      if (response.ok && result.success) {
        setNewComment('')
        fetchComments(currentLessonData.id)
      } else {
        console.error('❌ Erro ao postar comentário:', result.message)
        alert(`Erro ao postar comentário: ${result.message || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('Erro ao conectar com o servidor. Verifique sua conexão.')
    }
  }

  const handlePostReply = async (commentId: string) => {
    if (!replyContent.trim()) return

    try {
      const token = localStorage.getItem('token')
      if (!token || !currentLessonData) return

      console.log('📤 Enviando resposta:', { content: replyContent, parentId: commentId })

      const response = await fetch(`/api/lessons/${currentLessonData.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          content: replyContent,
          parentId: commentId 
        })
      })

      const result = await response.json()
      console.log('📥 Resposta do servidor (reply):', result)

      if (response.ok && result.success) {
        setReplyContent('')
        setReplyingTo(null)
        fetchComments(currentLessonData.id)
      } else {
        console.error('❌ Erro ao postar resposta:', result.message)
        alert(`Erro ao postar resposta: ${result.message || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Error posting reply:', error)
      alert('Erro ao conectar com o servidor.')
    }
  }

  const toggleModule = (moduleIndex: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleIndex)) {
        newSet.delete(moduleIndex)
      } else {
        newSet.add(moduleIndex)
      }
      return newSet
    })
  }

  const selectLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModule(moduleIndex)
    setCurrentLesson(lessonIndex)
    
    // Expandir automaticamente o módulo ao selecionar uma aula
    setExpandedModules(prev => new Set(prev).add(moduleIndex))
    
    // Buscar comentários da aula selecionada
    const lesson = course?.modules[moduleIndex]?.lessons[lessonIndex]
    if (lesson) {
      console.log('🔄 Carregando comentários da aula:', lesson.title)
      fetchComments(lesson.id)
    }
  }

  const isLessonUnlocked = (moduleIndex: number, lessonIndex: number) => {
    // Administradores têm acesso a todas as aulas
    if (user?.role === 'ADMIN') {
      return true
    }

    // Primeira aula do primeiro módulo sempre está desbloqueada
    if (moduleIndex === 0 && lessonIndex === 0) {
      return true
    }

    // Verificar se a aula anterior foi concluída
    let previousModuleIndex = moduleIndex
    let previousLessonIndex = lessonIndex - 1

    // Se é a primeira aula de um módulo, verificar a última aula do módulo anterior
    if (previousLessonIndex < 0 && moduleIndex > 0) {
      previousModuleIndex = moduleIndex - 1
      const previousModule = course?.modules[previousModuleIndex]
      if (previousModule) {
        previousLessonIndex = previousModule.lessons.length - 1
      }
    }

    // Se é a primeira aula de um módulo mas não é o primeiro módulo
    if (previousLessonIndex < 0 && moduleIndex === 0) {
      return false
    }

    // Verificar se a aula anterior está concluída
    const previousLesson = progress.find(
      p => p.moduleIndex === previousModuleIndex && p.lessonIndex === previousLessonIndex
    )

    return previousLesson?.completed || false
  }

  const isLessonCompleted = (moduleIndex: number, lessonIndex: number) => {
    const lessonProgress = progress.find(
      p => p.moduleIndex === moduleIndex && p.lessonIndex === lessonIndex
    )
    return lessonProgress?.completed || false
  }

  const isModuleCompleted = (moduleIndex: number) => {
    if (!course) return false
    const module = course.modules[moduleIndex]
    if (!module || !module.lessons) return false
    
    // Verifica se todas as aulas do módulo estão concluídas
    return module.lessons.every((_, lessonIndex) => 
      isLessonCompleted(moduleIndex, lessonIndex)
    )
  }

  const handleMarkAsComplete = async () => {
    if (!course || markingComplete) return

    setMarkingComplete(true)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: course.id,
          moduleIndex: currentModule,
          lessonIndex: currentLesson,
          completed: true
        })
      })

      if (response.ok) {
        // Atualizar progresso local
        await fetchProgress(token, course.id)
        
        // Avançar automaticamente para a próxima aula
        setTimeout(() => {
          nextLesson()
        }, 500)
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error)
    } finally {
      setMarkingComplete(false)
    }
  }

  // Função chamada quando o vídeo termina
  const handleVideoEnd = async () => {
    console.log('🎯 handleVideoEnd chamado!')
    console.log(`📍 Aula atual: Módulo ${currentModule}, Aula ${currentLesson}`)
    
    // Verifica se a aula já foi concluída
    const isCompleted = isLessonCompleted(currentModule, currentLesson)
    console.log(`✅ Aula já concluída? ${isCompleted}`)
    
    if (isCompleted) {
      console.log('➡️ Avançando para próxima aula (já concluída)...')
      // Se já está concluída, apenas avança para a próxima
      nextLesson()
      return
    }

    console.log('💾 Marcando aula como concluída e avançando...')
    // Marca como concluída e avança
    await handleMarkAsComplete()
  }

  const nextLesson = () => {
    if (!course) return
    
    console.log(`📍 Estado atual: Módulo ${currentModule}, Aula ${currentLesson}`)
    
    const currentModuleData = course.modules[currentModule]
    if (currentLesson < currentModuleData.lessons.length - 1) {
      const nextLessonIndex = currentLesson + 1
      console.log(`➡️ Avançando para próxima aula do mesmo módulo: Aula ${nextLessonIndex}`)
      setCurrentLesson(nextLessonIndex)
    } else if (currentModule < course.modules.length - 1) {
      const nextModuleIndex = currentModule + 1
      console.log(`➡️ Avançando para próximo módulo: Módulo ${nextModuleIndex}, Aula 0`)
      setCurrentModule(nextModuleIndex)
      setCurrentLesson(0)
    } else {
      console.log('🏁 Última aula do curso alcançada!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando curso...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
              <Button onClick={() => router.push('/cursos')} className="bg-yellow-500 hover:bg-yellow-400 text-black">
                Voltar aos Cursos
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentLessonData = course.modules[currentModule]?.lessons[currentLesson]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/cursos')}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar aos Cursos
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-gray-400">{course.description}</p>
              <div className="flex items-center space-x-4 mt-4">
                <Badge className="bg-yellow-500 text-black">
                  {course.instructor}
                </Badge>
                <span className="text-sm text-gray-400">
                  {course.modules.length} módulos
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lista de Módulos */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 bg-gray-900 border-gray-800 max-h-[calc(100vh-6rem)] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center space-x-2 text-white text-base">
                  <BookOpen className="w-5 h-5 text-yellow-500" />
                  <span>Módulos</span>
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  {course.modules.length} módulos disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 overflow-y-auto flex-1 pr-2">
                {course.modules.map((module, moduleIndex) => {
                  const isExpanded = expandedModules.has(moduleIndex)
                  const moduleProgress = module.lessons.filter((_, lessonIndex) => 
                    isLessonCompleted(moduleIndex, lessonIndex)
                  ).length
                  const totalLessons = module.lessons.length
                  const isCompleted = isModuleCompleted(moduleIndex)
                  
                  return (
                    <div key={module.id} className={`border rounded-lg overflow-hidden transition-all ${
                      isCompleted 
                        ? 'border-green-500 bg-green-900/30' 
                        : 'border-gray-800 bg-gray-800/50'
                    }`}>
                      {/* Cabeçalho do Módulo - Clicável */}
                      <button
                        onClick={() => toggleModule(moduleIndex)}
                        className={`w-full p-3 flex items-start justify-between transition-colors group ${
                          isCompleted 
                            ? 'hover:bg-green-900/50' 
                            : 'hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-start space-x-2 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                            isCompleted 
                              ? 'bg-green-500' 
                              : moduleIndex === 0 
                              ? 'bg-yellow-500' 
                              : 'bg-gray-600'
                          }`} />
                          <div className="flex-1 min-w-0 text-left">
                            <h4 className={`font-semibold text-xs leading-tight line-clamp-2 transition-colors ${
                              isCompleted 
                                ? 'text-green-400 group-hover:text-green-300' 
                                : 'text-white group-hover:text-yellow-500'
                            }`}>
                              {module.title}
                            </h4>
                            <p className={`text-xs mt-1 ${
                              isCompleted ? 'text-green-500' : 'text-gray-400'
                            }`}>
                              {moduleProgress} de {totalLessons} aulas concluídas
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          {isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          )}
                          {isExpanded ? (
                            <ChevronUp className={`w-4 h-4 transition-colors ${
                              isCompleted 
                                ? 'text-green-400 group-hover:text-green-300' 
                                : 'text-gray-400 group-hover:text-yellow-500'
                            }`} />
                          ) : (
                            <ChevronDown className={`w-4 mt-1 mb-4.5 h-4 transition-colors ${
                              isCompleted 
                                ? 'text-green-400 group-hover:text-green-300' 
                                : 'text-gray-400 group-hover:text-yellow-500'
                            }`} />
                          )}
                        </div>
                      </button>
                      
                      {/* Lista de Aulas - Mostra apenas quando expandido */}
                      {isExpanded && (
                        <div className="px-2 pb-2 space-y-1 border-t border-gray-700/50 pt-2">
                          {module.lessons.map((lesson, lessonIndex) => {
                            const isUnlocked = isLessonUnlocked(moduleIndex, lessonIndex)
                            const isCompleted = isLessonCompleted(moduleIndex, lessonIndex)
                            const isActive = currentModule === moduleIndex && currentLesson === lessonIndex
                            
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => isUnlocked && selectLesson(moduleIndex, lessonIndex)}
                                disabled={!isUnlocked}
                                className={`w-full text-left p-2 rounded-md text-xs transition-all duration-200 group ${
                                  isActive
                                    ? 'bg-yellow-500 text-black font-semibold shadow-md'
                                    : isCompleted
                                    ? 'bg-green-900/50 hover:bg-green-800/60 text-green-200 border border-green-700/30'
                                    : isUnlocked
                                    ? 'bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white'
                                    : 'bg-gray-800/30 text-gray-500 cursor-not-allowed opacity-40'
                                }`}
                              >
                                <div className="flex items-start space-x-2 min-w-0">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {!isUnlocked ? (
                                      <Lock className="w-3 h-3" />
                                    ) : isCompleted ? (
                                      <CheckCircle className="w-3 h-3" />
                                    ) : isActive ? (
                                      <Play className="w-3 h-3 fill-current" />
                                    ) : (
                                      <div className="w-3 h-3 rounded-full border border-current group-hover:bg-current group-hover:border-current transition-all" />
                                    )}
                                  </div>
                                  <span className="flex-1 min-w-0 leading-tight line-clamp-2">
                                    {lesson.title}
                                  </span>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            {currentLessonData ? (
              <div className="space-y-6">
                {/* Cabeçalho da Aula */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">{currentLessonData.title}</CardTitle>
                        <CardDescription className="text-gray-400 mt-2">
                          {currentLessonData.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="border-gray-700 text-gray-300">
                        Aula {currentLesson + 1} de {course.modules[currentModule].lessons.length}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                {/* Player de Vídeo */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <VimeoPlayer 
                      key={`video-${currentModule}-${currentLesson}`}
                      videoId={currentLessonData.vimeoVideoId}
                      title={currentLessonData.title}
                      onVideoEnd={handleVideoEnd}
                    />
                  </CardContent>
                </Card>

                {/* Indicador de Conclusão */}
                {isLessonCompleted(currentModule, currentLesson) && (
                  <div className="flex items-center justify-center text-green-500 py-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Aula Concluída</span>
                  </div>
                )}

                {/* Tabs para Comentários e Materiais */}
                <Tabs defaultValue="comments" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-900">
                    <TabsTrigger value="comments" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Comentários
                    </TabsTrigger>
                    <TabsTrigger value="materials" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                      <FileText className="w-4 h-4 mr-2" />
                      Materiais
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="comments" className="mt-6">
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center space-x-2">
                          <MessageSquare className="w-5 h-5" />
                          <span>Dúvidas e Comentários</span>
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Faça perguntas e interaja com outros estudantes
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Formulário para novo comentário */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                          <div className="flex items-start space-x-3 mb-3">
                            <Avatar className="flex-shrink-0">
                              <AvatarFallback className="bg-yellow-500 text-black font-semibold">
                                {user?.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-white text-sm">
                                  {user?.name || 'Usuário'}
                                </span>
                                <Badge 
                                  variant="secondary" 
                                  className={user?.role === 'ADMIN' ? 'bg-yellow-500 text-black text-xs' : 'bg-gray-700 text-gray-200 text-xs'}
                                >
                                  {user?.role === 'ADMIN' ? 'Instrutor' : 'Estudante'}
                                </Badge>
                              </div>
                          <textarea
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                            rows={3}
                                placeholder="Escreva sua dúvida ou comentário sobre esta aula..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button 
                              onClick={handlePostComment}
                              disabled={!newComment.trim()}
                              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Postar Comentário
                            </Button>
                          </div>
                        </div>

                        {/* Lista de comentários */}
                        <div className="space-y-4">
                          {comments.length === 0 ? (
                            <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-800">
                              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                              <p className="text-gray-400 text-lg font-medium mb-2">
                                Nenhum comentário ainda
                              </p>
                              <p className="text-gray-500 text-sm">
                                Seja o primeiro a fazer uma pergunta sobre esta aula!
                              </p>
                            </div>
                          ) : (
                            comments.map((comment) => (
                              <div key={comment.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                                {/* Comentário Principal */}
                                <div className="flex items-start space-x-3">
                                  <Avatar className="flex-shrink-0">
                                    <AvatarFallback className={comment.user.role === 'ADMIN' ? 'bg-yellow-500 text-black font-semibold' : 'bg-gray-600 text-white font-semibold'}>
                                      {comment.user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    {/* Header do Comentário */}
                                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                                      <span className="font-semibold text-white">
                                        {comment.user.name}
                                      </span>
                                      <Badge 
                                        variant="secondary" 
                                        className={comment.user.role === 'ADMIN' ? 'bg-yellow-500 text-black text-xs font-semibold' : 'bg-blue-600 text-white text-xs font-semibold'}
                                      >
                                        {comment.user.role === 'ADMIN' ? '👨‍🏫 Instrutor' : '👨‍🎓 Estudante'}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        {new Date(comment.timestamp || comment.createdAt || Date.now()).toLocaleDateString('pt-BR', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                    
                                    {/* Conteúdo do Comentário */}
                                    <p className="text-gray-300 leading-relaxed mb-3 whitespace-pre-wrap">
                                      {comment.content}
                                    </p>
                                    
                                    {/* Botão de Responder */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                      className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 text-xs font-medium -ml-2"
                                    >
                                      <MessageSquare className="w-3 h-3 mr-1" />
                                      {replyingTo === comment.id ? 'Cancelar' : 'Responder'}
                                    </Button>
                                    
                                    {/* Formulário de Resposta */}
                                    {replyingTo === comment.id && (
                                      <div className="mt-3 pl-4 border-l-2 border-yellow-500/30">
                                        <div className="flex items-start space-x-2">
                                          <Avatar className="flex-shrink-0 w-8 h-8">
                                            <AvatarFallback className="bg-yellow-500 text-black font-semibold text-xs">
                                              {user?.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <textarea
                                              className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                              rows={2}
                                              placeholder={`Respondendo para ${comment.user.name}...`}
                                              value={replyContent}
                                              onChange={(e) => setReplyContent(e.target.value)}
                                              autoFocus
                                            />
                                            <div className="flex justify-end space-x-2 mt-2">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                  setReplyingTo(null)
                                                  setReplyContent('')
                                                }}
                                                className="text-gray-400 hover:text-white text-xs"
                                              >
                                                Cancelar
                                              </Button>
                                              <Button
                                                size="sm"
                                                onClick={() => handlePostReply(comment.id)}
                                                disabled={!replyContent.trim()}
                                                className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold disabled:opacity-50"
                                              >
                                                Enviar Resposta
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Respostas (se houver) */}
                                    {comment.replies && comment.replies.length > 0 && (
                                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-700">
                                        {comment.replies.map((reply) => (
                                          <div key={reply.id} className="flex items-start space-x-2">
                                            <Avatar className="flex-shrink-0 w-8 h-8">
                                              <AvatarFallback className={reply.user.role === 'ADMIN' ? 'bg-yellow-500 text-black font-semibold text-xs' : 'bg-gray-600 text-white font-semibold text-xs'}>
                                                {reply.user.name.charAt(0).toUpperCase()}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center space-x-2 mb-1 flex-wrap">
                                                <span className="font-semibold text-white text-sm">
                                                  {reply.user.name}
                                                </span>
                                                <Badge 
                                                  variant="secondary" 
                                                  className={reply.user.role === 'ADMIN' ? 'bg-yellow-500 text-black text-xs font-semibold' : 'bg-blue-600 text-white text-xs font-semibold'}
                                                >
                                                  {reply.user.role === 'ADMIN' ? '👨‍🏫 Instrutor' : '👨‍🎓 Estudante'}
                                                </Badge>
                                                <span className="text-xs text-gray-500">
                                                  {new Date(reply.timestamp || reply.createdAt || Date.now()).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                  })}
                                                </span>
                                              </div>
                                              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                {reply.content}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="materials" className="mt-6">
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white">Materiais de Apoio</CardTitle>
                        <CardDescription className="text-gray-400">
                          Downloads e recursos adicionais para esta aula
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400">
                            Materiais estarão disponíveis em breve
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Selecione uma aula
                  </h3>
                  <p className="text-gray-400">
                    Escolha uma aula na barra lateral para começar seus estudos
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}