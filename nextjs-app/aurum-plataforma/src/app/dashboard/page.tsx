'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  courses: string[];
}

interface Module {
  title: string;
  lessons: unknown[];
  order: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  modules: Module[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserData(token);
    fetchCourses();
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/login');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-yellow-500">AURUM</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Olá, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meu Dashboard</h1>
          <p className="text-gray-400">Gerencie seus cursos e acompanhe seu progresso</p>
        </div>

        {/* User Info */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Informações da Conta</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Nome</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Tipo de Conta</p>
              <p className="font-semibold capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-gray-400">Cursos Matriculados</p>
              <p className="font-semibold">{user?.courses?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Cursos Disponíveis</h2>
          {courses.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <p className="text-gray-400">Nenhum curso disponível no momento.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-400 mb-4">{course.description}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Instrutor: {course.instructor}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Módulos: {course.modules?.length || 0}
                  </p>
                  <button
                    onClick={() => router.push(`/cursos/${course._id}`)}
                    className="w-full bg-yellow-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    Acessar Curso
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

