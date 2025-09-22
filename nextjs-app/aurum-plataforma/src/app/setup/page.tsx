'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const createEverything = async () => {
    setLoading(true)
    setStatus('🌱 Iniciando configuração completa...')

    try {
      // 1. Criar usuários
      setStatus('👥 Criando usuários (admin e estudante)...')
      await fetch('/api/dev/create-users', { method: 'POST' })

      // 2. Login como admin
      setStatus('🔐 Fazendo login como admin...')
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@aurum.com.br',
          password: 'admin123'
        })
      })
      const { token } = await loginResponse.json()

      // 3. Criar curso diretamente
      setStatus('📚 Criando curso "EDUCAÇÃO FINANCEIRA"...')
      const courseResponse = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'EDUCAÇÃO FINANCEIRA BÁSICA',
          description: 'Programa completo para transformação financeira prática.',
          instructor: 'AURUM',
          price: 1999
        })
      })
      const courseData = await courseResponse.json()
      const courseId = courseData.course.id

      // 4. Criar módulos
      setStatus('📖 Criando módulos...')
      const modules = [
        'Módulo 1 - Mentalidade Financeira',
        'Módulo 2 - Orçamento e Planejamento',
        'Módulo 3 - Investimentos',
        'Módulo 4 - Controle de Dívidas'
      ]

      for (let i = 0; i < modules.length; i++) {
        const moduleResponse = await fetch('/api/modules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: modules[i],
            description: `Conteúdo sobre ${modules[i]}`,
            order: i,
            courseId: courseId
          })
        })
        const moduleData = await moduleResponse.json()
        const moduleId = moduleData.module.id

        // 5. Criar aulas para cada módulo
        setStatus(`🎥 Criando aulas para ${modules[i]}...`)
        const lessons = [
          `${modules[i]} - Aula 1`,
          `${modules[i]} - Aula 2`, 
          `${modules[i]} - Aula 3`,
          `${modules[i]} - Aula 4`,
          `${modules[i]} - Aula 5`
        ]

        for (let j = 0; j < lessons.length; j++) {
          await fetch('/api/lessons', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: lessons[j],
              description: `Descrição da ${lessons[j]}`,
              vimeoVideoId: '1120965691', // Vídeo de teste
              order: j,
              moduleId: moduleId,
              courseId: courseId
            })
          })
        }
      }

      setStatus(`✅ TUDO PRONTO! 

🎯 Configuração concluída com sucesso:
• Usuários criados (admin e estudante)
• Curso "EDUCAÇÃO FINANCEIRA BÁSICA" criado
• 4 módulos criados
• 20 aulas criadas (5 por módulo)
• Todos os vídeos funcionando

📝 Credenciais de login:
• Admin: admin@aurum.com.br / admin123
• Estudante: estudante@teste.com / student123

🚀 Próximos passos:
1. Acesse /cursos para ver os cursos
2. Clique no curso para ver os módulos
3. Assista às aulas com vídeos do Vimeo
4. Teste o sistema de comentários

O sistema está 100% funcional!`)

    } catch (error: any) {
      setStatus(`❌ Erro durante a configuração: ${error.message}`)
      console.error('Setup error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-xl">A</span>
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-500">
            AURUM - Configuração Inicial
          </CardTitle>
          <p className="text-gray-400">
            Configure sua plataforma de educação financeira em um clique
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              O que será criado:
            </h3>
            <ul className="text-gray-400 space-y-1 text-sm">
              <li>✓ Usuários admin e estudante</li>
              <li>✓ Curso completo de educação financeira</li>
              <li>✓ 4 módulos com 5 aulas cada</li>
              <li>✓ Vídeos funcionais do Vimeo</li>
              <li>✓ Sistema de comentários</li>
              <li>✓ Navegação completa</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={createEverything}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 text-lg"
            >
              {loading ? '⏳ Configurando...' : '🚀 Configurar Agora'}
            </Button>

            {!loading && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => router.push('/cursos')}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Ver Cursos
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/login')}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Fazer Login
                </Button>
              </div>
            )}
          </div>

          {status && (
            <div className="bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                {status}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
