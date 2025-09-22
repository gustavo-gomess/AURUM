'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Clock, Users, Star, Play, Award } from 'lucide-react'

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  modules?: Module[];
  _count?: {
    modules: number;
    enrollments: number;
  };
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration?: string;
}

export default function CursosPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchData(token)
  }, [router])

  const fetchData = async (token: string) => {
    try {
      // Buscar dados do usuário
      const userResponse = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const userData = await userResponse.json()
      setUser(userData.user)

      // Buscar cursos
      const coursesResponse = await fetch('/api/courses')
      const coursesData = await coursesResponse.json()
      
      setCourses(coursesData.courses || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      localStorage.removeItem('token')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const calculateCourseStats = (course: Course) => {
    const totalModules = course.modules?.length || course._count?.modules || 0
    const totalLessons = course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0
    const estimatedDuration = totalLessons * 25 // 25 min por aula em média
    
    return {
      modules: totalModules,
      lessons: totalLessons,
      duration: Math.floor(estimatedDuration / 60), // em horas
      students: course._count?.enrollments || 0
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando cursos...</p>
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
            Cursos Disponíveis
          </h1>
          <p className="text-gray-400">
            Explore nossos cursos e continue sua jornada em educação financeira
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{courses.length}</p>
                  <p className="text-sm text-gray-400">Cursos Disponíveis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Play className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">
                    {courses.reduce((acc, course) => acc + calculateCourseStats(course).lessons, 0)}
                  </p>
                  <p className="text-sm text-gray-400">Total de Aulas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">
                    {courses.reduce((acc, course) => acc + calculateCourseStats(course).duration, 0)}h
                  </p>
                  <p className="text-sm text-gray-400">Horas de Conteúdo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">
                    {courses.reduce((acc, course) => acc + calculateCourseStats(course).students, 0)}
                  </p>
                  <p className="text-sm text-gray-400">Estudantes Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Nenhum curso disponível
              </h3>
              <p className="text-gray-400">
                Novos cursos de educação financeira serão adicionados em breve. Acompanhe nossas atualizações!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const stats = calculateCourseStats(course)
              
              return (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-900 border-gray-800">
                  {/* Course Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-black" />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="bg-yellow-500 text-black mb-2">
                        Curso
                      </Badge>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">4.8</span>
                      </div>
                    </div>
                    
                    <CardTitle className="line-clamp-2 text-white">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3 text-gray-400">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Instructor */}
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {course.instructor?.charAt(0) || 'I'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">{course.instructor}</span>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{stats.modules} módulos</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Play className="w-4 h-4" />
                        <span>{stats.lessons} aulas</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{stats.duration}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{stats.students} alunos</span>
                      </div>
                    </div>

                    {/* Progress (if enrolled) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progresso</span>
                        <span className="font-medium text-white">0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black"
                      onClick={() => router.push(`/cursos/${course.id}`)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Acessar Curso
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Featured Section */}
        {courses.length > 0 && (
          <div className="mt-12">
            <Card className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold mb-2">
                      🎓 Conquiste seu certificado!
                    </h3>
                    <p className="text-gray-800 max-w-md">
                      Complete os cursos e obtenha certificados em educação financeira reconhecidos no mercado. 
                      Acelere sua independência financeira com conhecimento prático e aplicável.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Award className="w-16 h-16 text-gray-800" />
                    <div>
                      <p className="text-sm text-gray-800">Certificados emitidos</p>
                      <p className="text-3xl font-bold">150+</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
