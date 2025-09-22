'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestSeedPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const executeSeed = async () => {
    setLoading(true)
    setStatus('🌱 Iniciando seed...')

    try {
      // 1. Criar usuários
      setStatus('📝 Criando usuários...')
      const usersResponse = await fetch('/api/dev/create-users', {
        method: 'POST'
      })
      const usersData = await usersResponse.json()
      console.log('Usuários:', usersData)

      // 2. Fazer login
      setStatus('🔐 Fazendo login como admin...')
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@aurum.com.br',
          password: 'admin123'
        })
      })
      const loginData = await loginResponse.json()
      
      if (!loginResponse.ok) {
        throw new Error('Falha no login: ' + loginData.error)
      }

      // 3. Executar seed
      setStatus('🏗️ Criando curso e módulos...')
      const seedResponse = await fetch('/api/dev/seed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      })
      const seedData = await seedResponse.json()

      if (seedResponse.ok) {
        setStatus(`✅ Seed executado com sucesso! 
        
📚 Curso criado com:
• 10 módulos de educação financeira
• Todas as aulas com vídeo de teste
• Sistema de comentários
• Materiais de apoio

🎯 Agora você pode:
1. Ir para http://localhost:3000/cursos
2. Fazer login com admin@aurum.com.br / admin123
3. Acessar o curso e navegar pelos módulos
4. Testar os vídeos do Vimeo
5. Deixar comentários nas aulas

🎥 Todos os vídeos usam o mesmo ID do Vimeo para teste: 1120965691`)
      } else {
        throw new Error('Falha no seed: ' + seedData.message)
      }

    } catch (error: any) {
      setStatus('❌ Erro: ' + error.message)
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-center text-yellow-500">
              🌱 Seed do Curso de Educação Financeira
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-400 mb-6">
                Execute o seed para criar o curso completo com 10 módulos e todas as aulas.
              </p>
              
              <Button 
                onClick={executeSeed}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-3"
              >
                {loading ? '⏳ Executando...' : '🚀 Executar Seed'}
              </Button>
            </div>

            {status && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  {status}
                </pre>
              </div>
            )}

            <div className="text-xs text-gray-500 text-center">
              <p>Esta página cria automaticamente:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Usuários admin e estudante</li>
                <li>Curso completo de educação financeira</li>
                <li>10 módulos com aulas detalhadas</li>
                <li>Integração com vídeos do Vimeo</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
