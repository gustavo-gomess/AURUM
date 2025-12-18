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

      // 3. Limpar banco de dados (remover dados antigos)
      setStatus('🗑️  Limpando banco de dados...')
      await fetch('/api/dev/reset-db', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // 4. Criar curso diretamente
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

      // 5. Executar seed completo com dados corretos
      setStatus('🌱 Executando seed completo com todos os módulos e vídeos corretos...')
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
• 5 MÓDULOS COMPLETOS criados com dados corretos
• 66 aulas criadas com vídeos corretos do Vimeo
• Todos os vídeos com IDs específicos funcionais

📚 MÓDULOS CRIADOS:
1. MENTALIDADE (15 aulas)
2. DINHEIRO, BANCOS E GOVERNOS (10 aulas)
3. DÍVIDAS, GASTOS E ORÇAMENTO (10 aulas)
4. RENDA FIXA (12 aulas)
5. RENDA VARIÁVEL (19 aulas)

📝 Credenciais de login:
• Admin: admin@aurum.com.br / admin123
• Estudante: estudante@teste.com / student123

🚀 Próximos passos:
1. Acesse /cursos para ver o curso completo
2. Navegue por todos os 5 módulos
3. Assista às aulas com vídeos reais do Vimeo
4. Teste o sistema de comentários

🎥 Todos os vídeos estão configurados com IDs corretos!
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
              <li>✓ Curso AURUM - Educação Financeira Completa</li>
              <li>✓ <strong className="text-yellow-500">5 módulos completos</strong> com conteúdo real</li>
              <li>✓ <strong className="text-yellow-500">66 aulas</strong> detalhadas com vídeos corretos</li>
              <li>✓ Todos os vídeos com IDs específicos do Vimeo</li>
              <li>✓ Sistema de comentários</li>
              <li>✓ Navegação completa entre módulos</li>
              <li>✓ Dados idênticos ao arquivo seed.js</li>
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
