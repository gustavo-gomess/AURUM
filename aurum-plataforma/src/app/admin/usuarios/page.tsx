'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Search, Trash2, Shield, User as UserIcon } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  _count?: {
    enrollments: number
    comments: number
  }
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  })
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 Verificando autenticação...')
      
      const token = localStorage.getItem('token')
      console.log('Token existe?', !!token)
      
      if (!token) {
        console.log('❌ Sem token, redirecionando para login')
        router.push('/login')
        return
      }

      // Verificar se o usuário é admin
      try {
        console.log('📡 Verificando usuário com API...')
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        console.log('📊 Resposta da API:', response.status)

        if (!response.ok) {
          console.log('❌ Token inválido, limpando e redirecionando')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/login')
          return
        }

        const data = await response.json()
        console.log('👤 Dados do usuário:', data.user)
        
        if (data.user.role !== 'ADMIN') {
          console.log('❌ Usuário não é admin:', data.user.role)
          alert('Acesso negado. Apenas administradores podem acessar esta página.')
          router.push('/dashboard')
          return
        }

        console.log('✅ Usuário é admin, carregando página...')
        // Se tudo OK, carregar usuários
        fetchUsers(token)
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Erro ao criar usuário')
        return
      }

      alert('Usuário criado com sucesso!')
      setShowModal(false)
      setFormData({ name: '', email: '', password: '', role: 'STUDENT' })
      
      // Recarregar lista de usuários
      if (token) fetchUsers(token)
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Erro ao criar usuário')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      alert('Usuário excluído com sucesso!')
      if (token) fetchUsers(token)
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Erro ao excluir usuário')
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          </div>
          <p className="text-gray-400">Gerencie os usuários da plataforma AURUM</p>
        </div>

        {/* Card Principal */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <CardTitle className="text-white text-xl">Gerenciamento de Usuários</CardTitle>
                <CardDescription className="text-gray-400">
                  Crie, edite e exclua usuários do sistema
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Busca */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Nome</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Tipo</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Perguntas</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Criado em</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        {searchTerm ? 'Nenhum usuário encontrado' : 'Carregando...'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-4 px-4 text-white">{user.name}</td>
                        <td className="py-4 px-4 text-gray-400">{user.email}</td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                            className={user.role === 'ADMIN' ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'}
                          >
                            {user.role === 'ADMIN' ? 'Administrador' : 'Estudante'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {user._count?.comments || 0}
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-950"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Criar Usuário */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full border border-gray-800">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Criar Novo Usuário</h2>
              <p className="text-gray-400 text-sm mb-6">Preencha os dados do novo usuário</p>

              <form onSubmit={handleCreateUser} className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    placeholder="João da Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Máximo 60 caracteres</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="joao@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                {/* Senha */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Senha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                {/* Tipo de Usuário */}
                <div>
                  <label className="block text-white font-medium mb-2">Tipo de Usuário</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="STUDENT">Estudante</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                {/* Botões */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false)
                      setFormData({ name: '', email: '', password: '', role: 'STUDENT' })
                    }}
                    className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                    disabled={submitting}
                  >
                    {submitting ? 'Criando...' : 'Criar Usuário'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

