'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Search, Send, Clock, User, CheckCircle, Filter } from 'lucide-react'

interface Comment {
  id: string
  content: string
  timestamp: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  lesson: {
    id: string
    title: string
    module: {
      title: string
    }
  }
  replies?: Comment[]
  answeredBy?: string
  answerContent?: string
}

export default function PerguntasPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'answered' | 'unanswered'>('all')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) {
          localStorage.removeItem('token')
          router.push('/login')
          return
        }

        const data = await response.json()
        
        if (data.user.role !== 'ADMIN') {
          alert('Acesso negado. Apenas administradores podem acessar esta página.')
          router.push('/dashboard')
          return
        }

        fetchComments(token)
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  const fetchComments = async (token: string) => {
    try {
      console.log('🔍 [Perguntas Page] Buscando comentários...')
      
      // Por enquanto, vamos buscar os comentários através da API de lessons
      // que já está funcionando perfeitamente
      const coursesResponse = await fetch('/api/courses')
      if (!coursesResponse.ok) {
        throw new Error('Erro ao buscar cursos')
      }
      
      const coursesData = await coursesResponse.json()
      const course = coursesData.courses?.find((c: any) => c.id === 'aurum-course-id')
      
      if (!course) {
        console.log('📭 Nenhum curso encontrado')
        setComments([])
        setLoading(false)
        return
      }

      // Buscar comentários de todas as lições
      const allComments: Comment[] = []
      
      for (const courseModule of course.modules || []) {
        for (const lesson of courseModule.lessons || []) {
          try {
            const commentsResponse = await fetch(`/api/lessons/${lesson.id}/comments`)
            if (commentsResponse.ok) {
              const commentsData = await commentsResponse.json()
              const lessonComments = (commentsData.data || commentsData.comments || []).map((c: any) => ({
                ...c,
                lesson: {
                  id: lesson.id,
                  title: lesson.title,
                  module: {
                    title: courseModule.title
                  }
                }
              }))
              allComments.push(...lessonComments)
            }
          } catch (err) {
            console.error(`Erro ao buscar comentários da lição ${lesson.id}:`, err)
          }
        }
      }

      console.log(`✅ [Perguntas Page] ${allComments.length} comentários encontrados`)
      setComments(allComments)
    } catch (error) {
      console.error('❌ [Perguntas Page] Erro:', error)
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim()) return

    // Encontrar o comentário para pegar o lessonId
    const comment = comments.find(c => c.id === commentId)
    if (!comment) {
      alert('Comentário não encontrado')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/lessons/${comment.lesson.id}/comments`, {
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

      if (!response.ok) {
        throw new Error('Failed to reply')
      }

      alert('Resposta enviada com sucesso!')
      setReplyingTo(null)
      setReplyContent('')
      
      if (token) fetchComments(token)
    } catch (error) {
      console.error('Error replying:', error)
      alert('Erro ao enviar resposta')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.lesson.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'answered' && comment.replies && comment.replies.length > 0) ||
      (filterStatus === 'unanswered' && (!comment.replies || comment.replies.length === 0))

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <MessageSquare className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">Perguntas dos Usuários</h1>
          </div>
          <p className="text-gray-400">Central unificada de perguntas das aulas</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Todas as Perguntas</CardTitle>
            <CardDescription className="text-gray-400">
              {filteredComments.length} perguntas encontradas
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Filtros */}
            <div className="mb-6 space-y-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por pergunta, usuário ou aula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Filtro de Status */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Filtrar:</span>
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-yellow-500 text-black' : ''}
                >
                  Todas
                </Button>
                <Button
                  variant={filterStatus === 'unanswered' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('unanswered')}
                  className={filterStatus === 'unanswered' ? 'bg-yellow-500 text-black' : ''}
                >
                  Não Respondidas
                </Button>
                <Button
                  variant={filterStatus === 'answered' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('answered')}
                  className={filterStatus === 'answered' ? 'bg-yellow-500 text-black' : ''}
                >
                  Respondidas
                </Button>
              </div>
            </div>

            {/* Lista de Perguntas */}
            <div className="space-y-4">
              {filteredComments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm ? 'Nenhuma pergunta encontrada' : 'Nenhuma pergunta ainda'}
                </div>
              ) : (
                filteredComments.map((comment) => (
                  <Card key={comment.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      {/* Header da Pergunta */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 flex-1">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-yellow-500 text-black">
                              {comment.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-white">{comment.user.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                Estudante
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.timestamp).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400 mb-2">
                              <span className="text-yellow-500">{comment.lesson.module.title}</span>
                              {' > '}
                              <span>{comment.lesson.title}</span>
                            </div>
                          </div>
                        </div>
                        
                        {comment.replies && comment.replies.length > 0 ? (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Respondida
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500 text-black">
                            Aguardando
                          </Badge>
                        )}
                      </div>

                      {/* Conteúdo da Pergunta */}
                      <div className="ml-13 mb-4">
                        <p className="text-gray-200">{comment.content}</p>
                      </div>

                      {/* Respostas Existentes */}
                      {comment.replies && comment.replies.map((reply) => (
                        <div key={reply.id} className="ml-13 mt-4 p-4 bg-gray-700 rounded-lg border-l-4 border-yellow-500">
                          <div className="flex items-center space-x-2 mb-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-yellow-500 text-black">
                                {reply.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-white">{reply.user.name}</span>
                            <Badge className="bg-yellow-500 text-black text-xs">Instrutor</Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(reply.timestamp).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-gray-200">{reply.content}</p>
                        </div>
                      ))}

                      {/* Formulário de Resposta */}
                      {replyingTo === comment.id ? (
                        <div className="ml-13 mt-4 space-y-3">
                          <Textarea
                            placeholder="Digite sua resposta..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                          />
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleReply(comment.id)}
                              disabled={submitting || !replyContent.trim()}
                              className="bg-yellow-500 hover:bg-yellow-400 text-black"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              {submitting ? 'Enviando...' : 'Enviar Resposta'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyContent('')
                              }}
                              className="border-gray-600 text-gray-300"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="ml-13 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReplyingTo(comment.id)}
                            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Responder
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

