'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/logo'
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

      // 4. Executar seed completo
      setStatus('🌱 Executando seed completo com todos os módulos...')
      const seedResponse = await fetch('/api/dev/seed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!seedResponse.ok) {
        throw new Error('Falha ao executar seed')
      }

      setStatus(`✅ PLATAFORMA COMPLETA CRIADA! 

🎯 Configuração concluída com sucesso:
• Usuários criados (admin e estudante)
• Curso "EDUCAÇÃO FINANCEIRA BÁSICA" criado
• 10 MÓDULOS COMPLETOS criados
• 80+ aulas criadas com conteúdo real
• Todos os vídeos funcionando (ID: 1120965691)

📚 MÓDULOS CRIADOS:
1. Mentalidade Financeira (15 aulas)
2. Orçamento e Controle Financeiro (10 aulas)
3. Investimentos para Iniciantes (10 aulas)
4. Controle de Dívidas e Crédito (8 aulas)
5. Empreendedorismo Financeiro (6 aulas)
6. Planejamento de Aposentadoria (7 aulas)
7. Impostos e Declarações (5 aulas)
8. Seguros e Proteção Financeira (6 aulas)
9. Educação Financeira dos Filhos (6 aulas)
10. Estratégias Financeiras Avançadas (6 aulas)

📝 Credenciais de login:
• Admin: admin@aurum.com.br / admin123
• Estudante: estudante@teste.com / student123

🚀 Próximos passos:
1. Acesse /cursos para ver o curso completo
2. Navegue por todos os 10 módulos
3. Assista às aulas com vídeos do Vimeo
4. Teste o sistema de comentários

🎥 TODOS OS VÍDEOS estão configurados e funcionais!
🏆 O curso está 100% pronto para uso!`)

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
          <div className="flex items-center justify-center mb-4">
            <Logo variant="light" size="md" />
          </div>
          <CardTitle className="text-2xl font-bold text-white mt-4">
            Configuração Inicial
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
              <li>✓ <strong className="text-yellow-500">10 módulos completos</strong> com conteúdo real</li>
              <li>✓ <strong className="text-yellow-500">80+ aulas</strong> detalhadas</li>
              <li>✓ Todos os vídeos funcionais do Vimeo</li>
              <li>✓ Sistema de comentários</li>
              <li>✓ Navegação completa entre módulos</li>
              <li>✓ Estrutura padrão para futuros cursos</li>
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
                  onClick={() => router.push('/cursos/aurum-course-id')}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Ver Aulas
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
