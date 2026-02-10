'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { VimeoPlayer } from "@/components/VimeoPlayer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Clock,
  Calendar,
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

export default function LivePage() {
  const params = useParams()
  const router = useRouter()
  const liveId = params.id as string

  const [liveData, setLiveData] = useState<LiveData | null>(null)

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

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Área principal - Video e Informações */}
          <div className="space-y-6">
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
        </div>
      </main>
    </div>
  )
}

