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

    // Redirecionar direto para o curso AURUM
    router.push('/cursos/aurum-course-id')
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
    const totalLessons = course.modules?.reduce((acc, courseModule) => acc + (courseModule.lessons?.length || 0), 0) || 0
    const estimatedDuration = totalLessons * 25 // 25 min por aula em média
    
    return {
      modules: totalModules,
      lessons: totalLessons,
      duration: Math.floor(estimatedDuration / 60), // em horas
      students: course._count?.enrollments || 0
    }
  }

  // Página de redirecionamento
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Carregando aulas...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
