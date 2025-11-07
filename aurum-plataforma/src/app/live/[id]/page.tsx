'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { VimeoPlayer } from "@/components/VimeoPlayer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Clock,
  Calendar,
  Send,
  Smile,
  ArrowLeft,
} from "lucide-react"

// Interface para os dados da live
interface LiveData {
  id: string
  title: string
  description: string
  instructorName: string
  instructorAvatar?: string
  instructorBio?: string
  vimeoVideoId: string
  scheduledDate: string
  scheduledTime: string
  duration: string
  viewersCount: number
  isLive: boolean
  category: string
}

// Interface para mensagens do chat
interface ChatMessage {
  id: string
  userName: string
  userAvatar?: string
  message: string
  timestamp: string
}

export default function LivePage() {
  const params = useParams()
  const router = useRouter()
  const liveId = params.id as string

  const [liveData, setLiveData] = useState<LiveData | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      userName: "Maria Silva",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      message: "Ótima explicação sobre diversificação!",
      timestamp: "19:15",
    },
    {
      id: "2",
      userName: "João Santos",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
      message: "Qual a melhor estratégia para iniciantes?",
      timestamp: "19:16",
    },
    {
      id: "3",
      userName: "Ana Costa",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      message: "Conteúdo incrível como sempre! 🔥",
      timestamp: "19:18",
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  // Carregar dados da live baseado no ID
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch(`/api/lives/${liveId}`)
        if (response.ok) {
          const data = await response.json()
          const live = data.live
          
          // Converter para o formato esperado
          setLiveData({
            id: live.id,
            title: live.title,
            description: live.description,
            instructorName: live.instructorName,
            instructorAvatar: live.instructorAvatar,
            instructorBio: live.instructorBio,
            vimeoVideoId: live.vimeoVideoId,
            scheduledDate: live.scheduledDate,
            scheduledTime: live.scheduledTime,
            duration: live.duration,
            viewersCount: live.viewersCount,
            isLive: live.status === 'live',
            category: live.category,
          })
        }
      } catch (error) {
        console.error('Erro ao carregar live:', error)
      }
    }

    fetchLiveData()
  }, [liveId])

  // Função para enviar mensagem no chat
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userName: "Você",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      }
      setChatMessages([...chatMessages, message])
      setNewMessage("")
    }
  }

  // Loading state
  if (!liveData) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando live...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          className="mb-4 text-gray-400 hover:text-yellow-500 hover:bg-gray-900"
          onClick={() => router.push('/lives')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o catálogo
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Área principal - Video e Informações */}
          <div className="xl:col-span-2 space-y-6">
            {/* Player de Vídeo do Vimeo */}
            <Card className="overflow-hidden bg-gray-900 border-gray-800">
              <div className="relative">
                {/* Badge de Live */}
                {liveData.isLive && (
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-red-500 text-white font-semibold px-3 py-1 animate-pulse shadow-lg">
                      ● AO VIVO
                    </Badge>
                  </div>
                )}

                {/* Contador de viewers */}
                {liveData.viewersCount > 0 && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-sm border border-gray-700 shadow-lg">
                      <Users className="h-4 w-4 text-white" />
                      <span className="text-sm font-medium text-white">
                        {liveData.viewersCount.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Vimeo Player */}
                <VimeoPlayer
                  videoId={liveData.vimeoVideoId}
                  title={liveData.title}
                  className="w-full"
                />
              </div>
            </Card>

            {/* Informações da Live */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Título e Categoria */}
                  <div className="space-y-3">
                    <Badge className="bg-yellow-500 text-black font-medium">
                      {liveData.category}
                    </Badge>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                      {liveData.title}
                    </h1>
                  </div>

                  {/* Detalhes da Live */}
                  <div className="grid gap-4 sm:grid-cols-3 rounded-lg bg-gray-800/50 border border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                        <Calendar className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Data</p>
                        <p className="text-sm font-medium text-white">{liveData.scheduledDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                        <Clock className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Horário</p>
                        <p className="text-sm font-medium text-white">{liveData.scheduledTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                        <Users className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Duração</p>
                        <p className="text-sm font-medium text-white">{liveData.duration}</p>
                      </div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-white">Sobre esta Live</h2>
                    <p className="text-sm leading-relaxed text-gray-400">{liveData.description}</p>
                  </div>

                  {/* Instrutor */}
                  <div className="flex items-center gap-4 rounded-lg border border-gray-700 bg-gray-800/30 p-4">
                    <Avatar className="h-16 w-16 border-2 border-yellow-500">
                      <AvatarImage src={liveData.instructorAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-yellow-500 text-black text-xl font-bold">
                        {liveData.instructorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Instrutor</p>
                      <h3 className="text-lg font-semibold text-white">{liveData.instructorName}</h3>
                      <p className="text-sm text-gray-400 mt-1">{liveData.instructorBio}</p>
                    </div>
                    <Button className="bg-yellow-500 text-black hover:bg-yellow-400 font-semibold">
                      Seguir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Lateral */}
          <div className="xl:col-span-1">
            <Card className="flex flex-col h-[600px] xl:h-[calc(100vh-8rem)] bg-gray-900 border-gray-800">
              {/* Header do Chat */}
              <CardHeader className="border-b border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Chat ao Vivo</h2>
                  <Badge className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                    {liveData.viewersCount > 0 ? liveData.viewersCount : 0} online
                  </Badge>
                </div>
              </CardHeader>

              {/* Mensagens do Chat */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-3 animate-in slide-in-from-bottom-2">
                    <Avatar className="h-8 w-8 flex-shrink-0 border border-gray-700">
                      <AvatarImage src={msg.userAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-800 text-gray-300 text-xs">
                        {msg.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-white">{msg.userName}</span>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input de Mensagem */}
              <div className="border-t border-gray-800 p-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="flex-shrink-0 text-gray-400 hover:text-yellow-500 hover:bg-gray-800"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                  <Button
                    size="icon"
                    className="flex-shrink-0 bg-yellow-500 text-black hover:bg-yellow-400"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

