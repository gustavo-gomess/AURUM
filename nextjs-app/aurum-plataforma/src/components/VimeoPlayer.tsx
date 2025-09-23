'use client'

import { useState, useEffect } from 'react'
import { Play, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VimeoPlayerProps {
  videoId: string
  title: string
  className?: string
}

export function VimeoPlayer({ videoId, title, className = '' }: VimeoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Resetar estado quando o videoId mudar
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    setRetryCount(0)
  }, [videoId])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setIsLoading(true)
    setHasError(false)
  }

  // Verificar se o videoId é válido
  const isValidVideoId = videoId && videoId !== '000000000'

  if (!isValidVideoId) {
    return (
      <div className={`aspect-video bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            Conteúdo em breve
          </h3>
          <p className="text-gray-500">
            Esta aula estará disponível em breve
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`aspect-video bg-gray-800 rounded-lg overflow-hidden relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
          <div className="text-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando vídeo...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Erro ao carregar vídeo
            </h3>
            <p className="text-gray-400 mb-4">
              Não foi possível carregar o vídeo. Verifique sua conexão ou tente novamente.
            </p>
            <Button 
              onClick={handleRetry}
              className="bg-yellow-500 hover:bg-yellow-400 text-black"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </div>
      )}

      <iframe
        key={`${videoId}-${retryCount}`} // Força re-render ao tentar novamente
        src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="w-full h-full"
        title={title}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: hasError ? 'none' : 'block' }}
      />
    </div>
  )
}
