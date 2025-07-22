'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  modules: Module[];
}

interface Module {
  title: string;
  lessons: Lesson[];
  order: number;
}

interface Lesson {
  title: string;
  vimeoVideoId: string;
  order: number;
}

export default function CoursePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchCourse();
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: params.id,
          moduleIndex: currentModule,
          lessonIndex: currentLesson,
          completed: true,
        }),
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const selectLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentLessonData = course.modules[currentModule]?.lessons[currentLesson];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold">{course.title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-yellow-500">AURUM</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-900 h-screen overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Módulos do Curso</h2>
            {course.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="mb-4">
                <h3 className="font-semibold text-yellow-500 mb-2">
                  {module.title}
                </h3>
                {module.lessons.map((lesson, lessonIndex) => (
                  <button
                    key={lessonIndex}
                    onClick={() => selectLesson(moduleIndex, lessonIndex)}
                    className={`w-full text-left p-2 rounded mb-1 transition-colors ${
                      currentModule === moduleIndex && currentLesson === lessonIndex
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-sm">{lesson.title}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {currentLessonData ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">{currentLessonData.title}</h2>
              
              {/* Video Player */}
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  {currentLessonData.vimeoVideoId ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${currentLessonData.vimeoVideoId}`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-4">🎥</div>
                      <p className="text-gray-400">Vídeo não disponível</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button
                    onClick={markAsCompleted}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Marcar como Concluída
                  </button>
                </div>
                
                <div className="text-sm text-gray-400">
                  Aula {currentLesson + 1} de {course.modules[currentModule]?.lessons.length || 0} - 
                  Módulo {currentModule + 1} de {course.modules.length}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">Selecione uma aula</h2>
              <p className="text-gray-400">Escolha uma aula na barra lateral para começar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

