'use client'

import { useState, useEffect } from 'react'
import { VimeoPlayer } from '@/components/VimeoPlayer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, CheckCircle2, Clock, RefreshCw, Sparkles } from 'lucide-react'

// ======================================================
// CONFIGURAÇÃO DOS VÍDEOS DE TESTE
// ======================================================
// Substitua esses IDs pelos IDs reais do Vimeo das aulas 2, 3 e 4
const TEST_VIDEOS = [
  { id: '1037925944', title: 'AULA 02 - MENTALIDADE DO ALTO DESEMPENHO', order: 2 },
  { id: '1037925966', title: 'AULA 03 - CRENÇAS LIMITANTES', order: 3 },
  { id: '1037925978', title: 'AULA 04 - CRENÇAS POTENCIALIZADORAS', order: 4 },
]

const DELAY_BETWEEN_VIDEOS = 5000 // 5 segundos em milissegundos

// ======================================================
// TIPOS
// ======================================================
type TestStatus = 'idle' | 'playing' | 'waiting' | 'completed'

export default function VideoSequenceTestPage() {
  // Estado do teste
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [testStatus, setTestStatus] = useState<TestStatus>('idle')
  const [completedVideos, setCompletedVideos] = useState<number[]>([])
  const [countdown, setCountdown] = useState(0)

  // Vídeo atual
  const currentVideo = TEST_VIDEOS[currentVideoIndex]
  const totalVideos = TEST_VIDEOS.length
  const progress = (currentVideoIndex / totalVideos) * 100

  // ======================================================
  // FUNÇÃO: Iniciar Teste
  // ======================================================
  const startTest = () => {
    console.log('🚀 ======================================')
    console.log('🚀 INICIANDO TESTE DE SEQUÊNCIA DE VÍDEOS')
    console.log('🚀 ======================================')
    console.log(`📊 Total de vídeos: ${totalVideos}`)
    console.log('📋 Vídeos:', TEST_VIDEOS.map(v => `${v.title} (${v.id})`).join(', '))
    console.log('')
    
    setCurrentVideoIndex(0)
    setCompletedVideos([])
    setTestStatus('playing')
    setCountdown(0)
    
    console.log(`▶️  INICIANDO AULA ${TEST_VIDEOS[0].order}: ${TEST_VIDEOS[0].title}`)
  }

  // ======================================================
  // FUNÇÃO: Quando um vídeo termina
  // ======================================================
  const handleVideoEnd = () => {
    const completedVideo = TEST_VIDEOS[currentVideoIndex]
    
    console.log(`✅ AULA ${completedVideo.order} CONCLUÍDA: ${completedVideo.title}`)
    console.log(`📈 Progresso: ${currentVideoIndex + 1}/${totalVideos} vídeos`)
    
    // Marcar vídeo como concluído
    setCompletedVideos(prev => [...prev, currentVideoIndex])
    
    // Verificar se há mais vídeos
    if (currentVideoIndex < totalVideos - 1) {
      // Ainda há vídeos para reproduzir
      console.log(`⏳ AGUARDANDO ${DELAY_BETWEEN_VIDEOS / 1000} SEGUNDOS PARA PRÓXIMA AULA...`)
      console.log('')
      
      setTestStatus('waiting')
      setCountdown(DELAY_BETWEEN_VIDEOS / 1000)
      
      // Iniciar countdown
      let remainingTime = DELAY_BETWEEN_VIDEOS / 1000
      const countdownInterval = setInterval(() => {
        remainingTime -= 1
        setCountdown(remainingTime)
        
        if (remainingTime <= 0) {
          clearInterval(countdownInterval)
        }
      }, 1000)
      
      // Aguardar delay e carregar próximo vídeo
      setTimeout(() => {
        const nextIndex = currentVideoIndex + 1
        const nextVideo = TEST_VIDEOS[nextIndex]
        
        console.log(`▶️  INICIANDO AULA ${nextVideo.order}: ${nextVideo.title}`)
        
        setCurrentVideoIndex(nextIndex)
        setTestStatus('playing')
        setCountdown(0)
      }, DELAY_BETWEEN_VIDEOS)
    } else {
      // Teste concluído!
      console.log('')
      console.log('🎉 ======================================')
      console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!')
      console.log('🎉 ======================================')
      console.log(`✅ Todos os ${totalVideos} vídeos foram reproduzidos corretamente`)
      console.log('🏁 Teste finalizado')
      console.log('')
      
      setTestStatus('completed')
    }
  }

  // ======================================================
  // FUNÇÃO: Reiniciar Teste
  // ======================================================
  const resetTest = () => {
    console.log('🔄 Reiniciando teste...')
    console.log('')
    
    setCurrentVideoIndex(0)
    setCompletedVideos([])
    setTestStatus('idle')
    setCountdown(0)
  }

  // ======================================================
  // RENDERIZAÇÃO
  // ======================================================
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <PlayCircle className="w-10 h-10 text-yellow-500" />
            Teste de Sequência de Vídeos
          </h1>
          <p className="text-gray-400">
            Execução automatizada de {totalVideos} vídeos do Vimeo em sequência
          </p>
        </div>

        {/* Card de Status */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-white">Status do Teste</span>
              <Badge 
                className={
                  testStatus === 'idle' ? 'bg-gray-600' :
                  testStatus === 'playing' ? 'bg-blue-600' :
                  testStatus === 'waiting' ? 'bg-yellow-600' :
                  'bg-green-600'
                }
              >
                {testStatus === 'idle' ? 'Aguardando' :
                 testStatus === 'playing' ? 'Reproduzindo' :
                 testStatus === 'waiting' ? 'Aguardando próximo' :
                 'Concluído'}
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400">
              {testStatus === 'idle' && 'Clique em "Iniciar Teste" para começar'}
              {testStatus === 'playing' && `Reproduzindo aula ${currentVideo.order} de ${totalVideos}`}
              {testStatus === 'waiting' && `Próximo vídeo em ${countdown} segundos...`}
              {testStatus === 'completed' && '🎉 Todos os vídeos foram reproduzidos com sucesso!'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Barra de Progresso */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progresso</span>
                <span className="text-white font-medium">
                  {completedVideos.length}/{totalVideos} vídeos concluídos
                </span>
              </div>
              <Progress 
                value={testStatus === 'completed' ? 100 : progress} 
                className="h-3"
              />
            </div>

            {/* Lista de Vídeos */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Vídeos do Teste:</h3>
              {TEST_VIDEOS.map((video, index) => {
                const isCompleted = completedVideos.includes(index)
                const isCurrent = index === currentVideoIndex && testStatus !== 'idle' && testStatus !== 'completed'
                
                return (
                  <div
                    key={video.id}
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      isCurrent
                        ? 'bg-yellow-500/10 border-yellow-500'
                        : isCompleted
                        ? 'bg-green-500/10 border-green-700'
                        : 'bg-gray-800 border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-600' :
                        isCurrent ? 'bg-yellow-500 animate-pulse' :
                        'bg-gray-700'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : isCurrent ? (
                          <PlayCircle className="w-5 h-5 text-black" />
                        ) : (
                          <span className="text-sm text-gray-400">{video.order}</span>
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${isCurrent ? 'text-yellow-500' : 'text-white'}`}>
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-500">ID: {video.id}</p>
                      </div>
                    </div>
                    
                    {isCurrent && testStatus === 'playing' && (
                      <Badge className="bg-yellow-500 text-black">
                        Reproduzindo
                      </Badge>
                    )}
                    {isCurrent && testStatus === 'waiting' && (
                      <Badge className="bg-orange-600">
                        <Clock className="w-3 h-3 mr-1" />
                        {countdown}s
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge className="bg-green-600">
                        Concluído
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Botões de Controle */}
            <div className="mt-6 flex gap-3">
              {testStatus === 'idle' && (
                <Button 
                  onClick={startTest}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-medium"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Iniciar Teste
                </Button>
              )}
              
              {testStatus === 'completed' && (
                <Button 
                  onClick={resetTest}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-medium"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reiniciar Teste
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Player de Vídeo */}
        {(testStatus === 'playing' || testStatus === 'waiting') && currentVideo && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Aula {currentVideo.order} - {currentVideo.title}</span>
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                  Vídeo {currentVideoIndex + 1} de {totalVideos}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testStatus === 'playing' && (
                <VimeoPlayer
                  videoId={currentVideo.id}
                  title={currentVideo.title}
                  onVideoEnd={handleVideoEnd}
                />
              )}
              
              {testStatus === 'waiting' && (
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Aguardando próximo vídeo
                    </h3>
                    <p className="text-gray-400 text-lg">
                      Próxima aula em <span className="text-yellow-500 font-bold">{countdown}</span> segundos
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Mensagem de Sucesso */}
        {testStatus === 'completed' && (
          <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                🎉 Teste Concluído com Sucesso!
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Todos os {totalVideos} vídeos foram reproduzidos corretamente em sequência.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="text-center">
                  <p className="text-gray-400">Vídeos Reproduzidos</p>
                  <p className="text-2xl font-bold text-green-400">{totalVideos}</p>
                </div>
                <div className="w-px h-12 bg-gray-700"></div>
                <div className="text-center">
                  <p className="text-gray-400">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-green-400">100%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instruções */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">ℹ️ Instruções</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400 space-y-2">
            <p>• Este teste executa 3 vídeos do Vimeo em sequência automaticamente</p>
            <p>• Cada vídeo é reproduzido uma única vez (sem loop)</p>
            <p>• Após cada vídeo, há um delay de {DELAY_BETWEEN_VIDEOS / 1000} segundos antes do próximo</p>
            <p>• Todos os eventos são registrados no console do navegador (F12)</p>
            <p>• Ao final, você pode reiniciar o teste clicando no botão "Reiniciar Teste"</p>
            <p className="text-yellow-500 mt-4">
              💡 <strong>Dica:</strong> Abra o console (F12) para ver os logs detalhados do teste
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

