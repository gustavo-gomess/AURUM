'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  Users,
  Play,
  Filter,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Interface para os dados de uma live no catálogo
interface LiveItem {
  id: string
  title: string
  description: string
  instructorName: string
  instructorAvatar?: string
  thumbnailUrl: string
  vimeoVideoId: string
  scheduledDate: string
  scheduledTime: string
  duration: string
  category: string
  status: 'live' | 'upcoming' | 'finished'
  viewersCount?: number
}

type FilterType = 'all' | 'live' | 'upcoming' | 'finished'

export default function LivesPage() {
  const router = useRouter()
  const [lives, setLives] = useState<LiveItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')

  // Carregar lives da API
  useEffect(() => {
    fetchLives()
  }, [])

  const fetchLives = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/lives')
      if (response.ok) {
        const data = await response.json()
        setLives(data.lives)
      }
    } catch (error) {
      console.error('Erro ao carregar lives:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar lives baseado no status selecionado
  const filteredLives = lives.filter((live) => {
    if (filter === 'all') return true
    return live.status === filter
  })

  // Função para obter a configuração do badge baseado no status
  const getStatusBadge = (status: LiveItem['status']) => {
    switch (status) {
      case 'live':
        return {
          label: 'AO VIVO',
          className: 'bg-red-500 text-white font-semibold animate-pulse',
          icon: '●',
        }
      case 'upcoming':
        return {
          label: 'AGENDADA',
          className: 'bg-blue-500 text-white font-semibold',
          icon: '📅',
        }
      case 'finished':
        return {
          label: 'FINALIZADA',
          className: 'bg-gray-600 text-gray-300 font-semibold',
          icon: '✓',
        }
    }
  }

  // Navegar para a página da live individual
  const handleLiveClick = (liveId: string) => {
    router.push(`/live/${liveId}`)
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20">
              <Play className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                Catálogo de <span className="text-yellow-500">Lives</span>
              </h1>
              <p className="text-gray-400 mt-1">
                Assista lives ao vivo ou acesse o conteúdo gravado
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-3 flex-wrap mt-6">
            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtrar:</span>
            </div>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                "font-medium",
                filter === 'all'
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-yellow-500'
              )}
            >
              Todas ({lives.length})
            </Button>
            <Button
              variant={filter === 'live' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('live')}
              className={cn(
                "font-medium",
                filter === 'live'
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-yellow-500'
              )}
            >
              Ao Vivo ({lives.filter(l => l.status === 'live').length})
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('upcoming')}
              className={cn(
                "font-medium",
                filter === 'upcoming'
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-yellow-500'
              )}
            >
              Próximas ({lives.filter(l => l.status === 'upcoming').length})
            </Button>
            <Button
              variant={filter === 'finished' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('finished')}
              className={cn(
                "font-medium",
                filter === 'finished'
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-yellow-500'
              )}
            >
              Concluídas ({lives.filter(l => l.status === 'finished').length})
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Carregando lives...</p>
            </div>
          </div>
        ) : filteredLives.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Nenhuma live encontrada para este filtro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLives.map((live) => {
              const statusBadge = getStatusBadge(live.status)
              
              return (
                <Card
                  key={live.id}
                  className="group bg-gray-900 border-gray-800 overflow-hidden hover:border-yellow-500/50 transition-all duration-300 cursor-pointer"
                  onClick={() => handleLiveClick(live.id)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gray-800">
                    <img
                      src={live.thumbnailUrl}
                      alt={live.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay com Play Button */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Play className="h-6 w-6 text-black fill-black ml-1" />
                      </div>
                    </div>

                    {/* Badge de Status */}
                    <div className="absolute top-3 left-3">
                      <Badge className={cn("px-3 py-1 shadow-lg", statusBadge.className)}>
                        {statusBadge.icon} {statusBadge.label}
                      </Badge>
                    </div>

                    {/* Viewers Count (apenas para lives ao vivo) */}
                    {live.status === 'live' && live.viewersCount && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 backdrop-blur-sm border border-gray-600">
                          <Users className="h-3.5 w-3.5 text-white" />
                          <span className="text-xs font-medium text-white">
                            {live.viewersCount.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Categoria */}
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-yellow-500 text-black font-medium text-xs">
                        {live.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <CardContent className="p-5 space-y-4">
                    {/* Título */}
                    <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-yellow-500 transition-colors">
                      {live.title}
                    </h3>

                    {/* Descrição */}
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                      {live.description}
                    </p>

                    {/* Informações de Data e Hora */}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-yellow-500" />
                        <span>{live.scheduledDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span>{live.scheduledTime}</span>
                      </div>
                    </div>

                    {/* Instrutor */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
                      <Avatar className="h-10 w-10 border-2 border-yellow-500/50">
                        <AvatarImage src={live.instructorAvatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-yellow-500 text-black text-sm font-bold">
                          {live.instructorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Instrutor</p>
                        <p className="text-sm font-semibold text-white">{live.instructorName}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {live.duration}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

