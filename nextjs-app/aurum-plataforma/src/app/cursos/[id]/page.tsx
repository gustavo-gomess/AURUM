'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  ChevronRight,
  Award,
  FileText,
  Users
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
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
  replies?: Comment[];
}

export default function CoursePage() {
  const [course, setCourse] = useState<Course | null>(null)
  const [currentModule, setCurrentModule] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchUserAndCourse(token)
  }, [params.id, router])

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

  const fetchComments = async (lessonId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/lessons/${lessonId}/comments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
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

      const response = await fetch(`/api/lessons/${currentLessonData.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      })

      if (response.ok) {
        setNewComment('')
        fetchComments(currentLessonData.id)
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  const selectLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModule(moduleIndex)
    setCurrentLesson(lessonIndex)
    
    const lesson = course?.modules[moduleIndex]?.lessons[lessonIndex]
    if (lesson) {
      fetchComments(lesson.id)
    }
  }

  const isLessonUnlocked = (moduleIndex: number, lessonIndex: number) => {
    // Para teste, todos os módulos e aulas estão desbloqueados
    return true
  }

  const nextLesson = () => {
    if (!course) return
    
    const currentModuleData = course.modules[currentModule]
    if (currentLesson < currentModuleData.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
    } else if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1)
      setCurrentLesson(0)
    }
  }

  const previousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
    } else if (currentModule > 0) {
      setCurrentModule(currentModule - 1)
      const prevModule = course?.modules[currentModule - 1]
      if (prevModule) {
        setCurrentLesson(prevModule.lessons.length - 1)
      }
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
            <Card className="sticky top-20 bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <BookOpen className="w-5 h-5 text-yellow-500" />
                  <span>Módulos</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {course.modules.length} módulos disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        moduleIndex === 0 ? 'bg-yellow-500' : 'bg-gray-600'
                      }`} />
                      <h4 className="font-medium text-white text-sm">
                        {module.title}
                      </h4>
                    </div>
                    
                    <div className="ml-5 space-y-1">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const isUnlocked = isLessonUnlocked(moduleIndex, lessonIndex)
                        const isActive = currentModule === moduleIndex && currentLesson === lessonIndex
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => isUnlocked && selectLesson(moduleIndex, lessonIndex)}
                            disabled={!isUnlocked}
                            className={`w-full text-left p-2 rounded text-xs transition-colors ${
                              isActive
                                ? 'bg-yellow-500 text-black'
                                : isUnlocked
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              {!isUnlocked ? (
                                <Lock className="w-3 h-3" />
                              ) : isActive ? (
                                <Play className="w-3 h-3" />
                              ) : (
                                <div className="w-3 h-3 rounded-full border border-gray-500" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
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
                      videoId={currentLessonData.vimeoVideoId}
                      title={currentLessonData.title}
                    />
                  </CardContent>
                </Card>

                {/* Navegação */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={previousLesson}
                    disabled={currentModule === 0 && currentLesson === 0}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Aula Anterior
                  </Button>

                  <div className="flex items-center space-x-4">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Concluída
                    </Button>
                  </div>

                  <Button
                    onClick={nextLesson}
                    disabled={
                      currentModule === course.modules.length - 1 && 
                      currentLesson === course.modules[currentModule].lessons.length - 1
                    }
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                  >
                    Próxima Aula
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

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
                        <CardTitle className="text-white">Dúvidas e Comentários</CardTitle>
                        <CardDescription className="text-gray-400">
                          Faça perguntas e interaja com outros estudantes
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Formulário para novo comentário */}
                        <div className="space-y-3">
                          <textarea
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                            rows={3}
                            placeholder="Escreva sua dúvida ou comentário..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <div className="flex justify-end">
                            <Button 
                              onClick={handlePostComment}
                              className="bg-yellow-500 hover:bg-yellow-400 text-black"
                            >
                              Postar Comentário
                            </Button>
                          </div>
                        </div>

                        {/* Lista de comentários */}
                        <div className="space-y-4">
                          {comments.length === 0 ? (
                            <div className="text-center py-8">
                              <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                              <p className="text-gray-400">
                                Nenhum comentário ainda. Seja o primeiro a perguntar!
                              </p>
                            </div>
                          ) : (
                            comments.map((comment) => (
                              <div key={comment.id} className="bg-gray-800 p-4 rounded-lg">
                                <div className="flex items-start space-x-3">
                                  <Avatar>
                                    <AvatarFallback className="bg-yellow-500 text-black">
                                      {comment.user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="font-medium text-white">
                                        {comment.user.name}
                                      </span>
                                      <Badge 
                                        variant="secondary" 
                                        className={comment.user.role === 'ADMIN' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-200'}
                                      >
                                        {comment.user.role === 'ADMIN' ? 'Instrutor' : 'Estudante'}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                                      </span>
                                    </div>
                                    <p className="text-gray-300">{comment.content}</p>
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