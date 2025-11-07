'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Eye, 
  MoreHorizontal,
  UserCheck,
  Clock,
  Target,
  DollarSign
} from 'lucide-react'

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  enrollments?: Enrollment[];
}

interface Enrollment {
  id: string;
  progress: number;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
  };
}

interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalEnrollments: number;
  averageProgress: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    averageProgress: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Verificar se é admin
    fetchUserData(token)
    fetchAdminData(token)
  }, [router])

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const userData = await response.json()
      if (userData.user.role !== 'ADMIN') {
        router.push('/dashboard')
        return
      }
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const fetchAdminData = async (token: string) => {
    try {
      // Buscar todos os usuários
      const usersResponse = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
        
        // Calcular estatísticas
        const students = usersData.users.filter((u: User) => u.role === 'STUDENT')
        const totalEnrollments = students.reduce((acc: number, user: User) => 
          acc + (user.enrollments?.length || 0), 0
        )
        const averageProgress = students.length > 0 
          ? students.reduce((acc: number, user: User) => {
              const userProgress = user.enrollments?.reduce((total, enrollment) => 
                total + enrollment.progress, 0) || 0
              return acc + (userProgress / (user.enrollments?.length || 1))
            }, 0) / students.length
          : 0

        setStats({
          totalUsers: usersData.users.length,
          totalStudents: students.length,
          totalEnrollments,
          averageProgress: Math.round(averageProgress)
        })
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getUserProgress = (user: User) => {
    if (!user.enrollments || user.enrollments.length === 0) return 0
    const totalProgress = user.enrollments.reduce((acc, enrollment) => 
      acc + enrollment.progress, 0
    )
    return Math.round(totalProgress / user.enrollments.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando dados administrativos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-400">
            Gerencie usuários e acompanhe o progresso dos estudantes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  <p className="text-sm text-gray-400">Total de Usuários</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                  <p className="text-sm text-gray-400">Estudantes Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{stats.totalEnrollments}</p>
                  <p className="text-sm text-gray-400">Matrículas Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{stats.averageProgress}%</p>
                  <p className="text-sm text-gray-400">Progresso Médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Usuários */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Users className="w-5 h-5 text-yellow-500" />
                  <span>Usuários Cadastrados</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Visualize e gerencie todos os usuários da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => {
                    const progress = getUserProgress(user)
                    
                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-center space-x-4">
                            <Avatar>
                            <AvatarFallback className="bg-yellow-500 text-black">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-white">{user.name}</h4>
                              <Badge 
                                variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                                className={
                                  user.role === 'ADMIN' 
                                    ? 'bg-yellow-500 text-black' 
                                    : 'bg-gray-700 text-gray-200'
                                }
                              >
                                {user.role === 'ADMIN' ? 'Admin' : 'Estudante'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            <p className="text-xs text-gray-500">
                              Cadastrado em {formatDate(user.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-white">{progress}%</p>
                            <p className="text-xs text-gray-500">
                              {user.enrollments?.length || 0} curso(s)
                            </p>
                          </div>
                          <Progress value={progress} className="w-20 h-2" />
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalhes do Usuário Selecionado */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Target className="w-5 h-5 text-yellow-500" />
                  <span>Detalhes do Usuário</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-4">
                        <AvatarFallback className="bg-yellow-500 text-black text-xl">
                          {selectedUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg text-white">{selectedUser.name}</h3>
                      <p className="text-sm text-gray-400">{selectedUser.email}</p>
                      <Badge 
                        className={
                          selectedUser.role === 'ADMIN' 
                            ? 'bg-yellow-500 text-black mt-2' 
                            : 'bg-gray-700 text-gray-200 mt-2'
                        }
                      >
                        {selectedUser.role === 'ADMIN' ? 'Administrador' : 'Estudante'}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-white">Informações Gerais</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Data de Cadastro:</span>
                            <span className="text-white">{formatDate(selectedUser.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Cursos Matriculados:</span>
                            <span className="text-white">{selectedUser.enrollments?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Progresso Médio:</span>
                            <span className="text-white">{getUserProgress(selectedUser)}%</span>
                          </div>
                        </div>
                      </div>

                      {selectedUser.enrollments && selectedUser.enrollments.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-white">Cursos em Andamento</h4>
                          <div className="space-y-3">
                            {selectedUser.enrollments.map((enrollment) => (
                              <div key={enrollment.id} className="p-3 bg-gray-800 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium text-sm text-white">{enrollment.course.title}</h5>
                                  <span className="text-xs text-gray-500">
                                    {enrollment.progress}%
                                  </span>
                                </div>
                                <Progress value={enrollment.progress} className="h-2 mb-2" />
                                <p className="text-xs text-gray-500">
                                  Matriculado em {formatDate(enrollment.enrolledAt)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="w-full mb-2 border-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-black" variant="outline">
                        Enviar Mensagem
                      </Button>
                      <Button className="w-full border-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-black" variant="outline">
                        Relatório Detalhado
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Selecione um usuário para ver os detalhes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Ações Rápidas</CardTitle>
              <CardDescription className="text-gray-400">
                Ferramentas administrativas para gerenciar a plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex flex-col space-y-2 border-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-black" variant="outline">
                  <BookOpen className="w-6 h-6" />
                  <span>Gerenciar Cursos</span>
                </Button>
                <Button className="h-20 flex flex-col space-y-2 border-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-black" variant="outline">
                  <Award className="w-6 h-6" />
                  <span>Emitir Certificados</span>
                </Button>
                <Button className="h-20 flex flex-col space-y-2 border-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-black" variant="outline">
                  <DollarSign className="w-6 h-6" />
                  <span>Relatório Financeiro</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
