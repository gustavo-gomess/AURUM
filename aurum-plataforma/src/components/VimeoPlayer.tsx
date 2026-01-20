'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VimeoPlayerProps {
  videoId: string
  title: string
  className?: string
  onVideoEnd?: () => void
}

function VimeoPlayer({ videoId, title, className = '', onVideoEnd }: VimeoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [videoEnded, setVideoEnded] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<any>(null)
  const endedTriggeredRef = useRef(false)
  const onVideoEndRef = useRef(onVideoEnd)

  // Resetar estado quando o videoId mudar
  useEffect(() => {
    console.log(`🔄 VimeoPlayer: videoId mudou para ${videoId}`)
    setIsLoading(true)
    setHasError(false)
    setRetryCount(0)
    setVideoEnded(false)
    setIframeLoaded(false)
    endedTriggeredRef.current = false
    if (playerRef.current) {
      try {
        playerRef.current.off('ended')
        playerRef.current.off('timeupdate')
        playerRef.current.off('error')
        playerRef.current.destroy?.()
      } catch (error) {
        console.error('Erro ao limpar player anterior:', error)
      } finally {
        playerRef.current = null
      }
    }
  }, [videoId])

  useEffect(() => {
    onVideoEndRef.current = onVideoEnd
  }, [onVideoEnd])

  const triggerVideoEnd = () => {
    if (endedTriggeredRef.current) return
    endedTriggeredRef.current = true
    setVideoEnded(true)
    if (onVideoEndRef.current) {
      console.log('📞 Chamando callback onVideoEnd...')
      onVideoEndRef.current()
    } else {
      console.warn('⚠️ onVideoEnd não está definido!')
    }
  }

  // Integrar com Vimeo Player API para detectar quando o vídeo termina
  useEffect(() => {
    if (!iframeRef.current || !videoId || videoId === '000000000' || !iframeLoaded) return

    let isCancelled = false

    const ensureSdkLoaded = () => {
      if (typeof window.Vimeo !== 'undefined') {
        return Promise.resolve()
      }

      return new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve())
          existingScript.addEventListener('error', () => reject(new Error('Falha ao carregar SDK do Vimeo')))
          return
        }

        const script = document.createElement('script')
        script.src = 'https://player.vimeo.com/api/player.js'
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Falha ao carregar SDK do Vimeo'))
        document.body.appendChild(script)
      })
    }

    const initPlayer = async () => {
      try {
        await ensureSdkLoaded()
        if (isCancelled || !iframeRef.current) return

        // @ts-expect-error - Vimeo SDK
        const vimeoPlayerInstance = new window.Vimeo.Player(iframeRef.current)
        playerRef.current = vimeoPlayerInstance

        console.log('✅ Vimeo Player inicializado')

        vimeoPlayerInstance.on('ended', () => {
          console.log('🎬 EVENTO ENDED DISPARADO - Vídeo terminou!')
          triggerVideoEnd()
        })

        vimeoPlayerInstance.on('timeupdate', (data: any) => {
          if (data?.duration && data?.seconds) {
            const remaining = data.duration - data.seconds
            if (remaining <= 0.5 || data.percent >= 0.995) {
              console.log(`⏱️ Fallback fim do vídeo: ${data.seconds.toFixed(1)}s / ${data.duration.toFixed(1)}s`)
              triggerVideoEnd()
            }
          }
        })

        vimeoPlayerInstance.on('error', (error: any) => {
          console.error('❌ Erro do Vimeo Player:', error)
        })
      } catch (error) {
        console.error('❌ Erro ao inicializar Vimeo Player:', error)
      }
    }

    initPlayer()

    // Cleanup
    return () => {
      isCancelled = true
      if (playerRef.current) {
        try {
          playerRef.current.off('ended')
          playerRef.current.off('timeupdate')
          playerRef.current.off('error')
          playerRef.current.destroy?.()
        } catch (error) {
          console.error('Erro ao remover listener:', error)
        } finally {
          playerRef.current = null
        }
      }
    }
  }, [videoId, iframeLoaded])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
    setIframeLoaded(true)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setIsLoading(true)
    setHasError(false)
    setVideoEnded(false)
    setIframeLoaded(false)
    endedTriggeredRef.current = false
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

      {videoEnded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-20">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Aula concluída!
            </h3>
            <p className="text-gray-400">
              Carregando próxima aula...
            </p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        key={`${videoId}-${retryCount}`}
        src={`https://player.vimeo.com/video/${videoId}?h=0&badge=0&autopause=0&player_id=vimeo-${videoId}&title=0&byline=0&portrait=0&controls=1&dnt=1&playsinline=1`}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen
        className="w-full h-full"
        title={title}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: (hasError || videoEnded) ? 'none' : 'block' }}
      />
    </div>
  )
}

// Export explícito para evitar problemas com Turbopack
export { VimeoPlayer }
export default VimeoPlayer
