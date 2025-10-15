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

export function VimeoPlayer({ videoId, title, className = '', onVideoEnd }: VimeoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [videoEnded, setVideoEnded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Resetar estado quando o videoId mudar
  useEffect(() => {
    console.log(`🔄 VimeoPlayer: videoId mudou para ${videoId}`)
    setIsLoading(true)
    setHasError(false)
    setRetryCount(0)
    setVideoEnded(false)
  }, [videoId])

  // Integrar com Vimeo Player API para detectar quando o vídeo termina
  useEffect(() => {
    if (!iframeRef.current || !videoId || videoId === '000000000') return

    let player: VimeoPlayer | null = null
    let timeoutId: NodeJS.Timeout

    const initPlayer = () => {
      if (!iframeRef.current) return
      
      // Aguardar um pouco para garantir que o iframe está totalmente carregado
      timeoutId = setTimeout(() => {
        try {
          // @ts-ignore - Vimeo SDK
          player = new window.Vimeo.Player(iframeRef.current)
          
          console.log('Vimeo Player inicializado com sucesso')
          
          // Listener para quando o vídeo terminar
          player.on('ended', () => {
            console.log('🎬 EVENTO ENDED DISPARADO - Vídeo terminou!')
            
            // Esconder o iframe imediatamente para não mostrar sugestões
            setVideoEnded(true)
            
            if (onVideoEnd) {
              console.log('📞 Chamando callback onVideoEnd...')
              onVideoEnd()
            } else {
              console.warn('⚠️ onVideoEnd não está definido!')
            }
          })

          // Adicionar listener de progresso para debug
          player.on('timeupdate', (data: any) => {
            // Quando estiver próximo do fim (últimos 2 segundos)
            if (data.duration - data.seconds < 2 && data.duration - data.seconds > 1.5) {
              console.log(`⏱️ Vídeo próximo do fim: ${data.seconds.toFixed(1)}s / ${data.duration.toFixed(1)}s`)
            }
          })

          console.log('✅ Listeners de eventos adicionados')
        } catch (error) {
          console.error('❌ Erro ao inicializar Vimeo Player:', error)
        }
      }, 1000) // Aguarda 1 segundo para garantir que o iframe está pronto
    }

    // Verificar se o SDK do Vimeo já está carregado
    // @ts-ignore
    if (typeof window.Vimeo !== 'undefined') {
      console.log('📦 SDK do Vimeo já carregado, inicializando player...')
      initPlayer()
    } else {
      // Verificar se o script já existe
      const existingScript = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')
      
      if (existingScript) {
        console.log('📜 Script do Vimeo encontrado, aguardando carregamento...')
        // Script já existe, aguardar o carregamento
        existingScript.addEventListener('load', initPlayer)
      } else {
        console.log('📥 Carregando SDK do Vimeo...')
        // Carregar o SDK do Vimeo Player
        const script = document.createElement('script')
        script.src = 'https://player.vimeo.com/api/player.js'
        script.async = true
        script.onload = () => {
          console.log('✅ SDK do Vimeo carregado com sucesso')
          initPlayer()
        }
        document.body.appendChild(script)
      }
    }

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (player) {
        try {
          player.off('ended')
          player.off('timeupdate')
        } catch (error) {
          console.error('Erro ao remover listener:', error)
        }
      }
    }
  }, [videoId, onVideoEnd])

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
        src={`https://player.vimeo.com/video/${videoId}?h=0&badge=0&autopause=0&player_id=vimeo-${videoId}&title=0&byline=0&portrait=0&controls=1&dnt=1`}
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
