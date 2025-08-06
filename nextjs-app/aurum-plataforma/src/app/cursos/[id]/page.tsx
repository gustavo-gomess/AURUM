'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  modules: PopulatedModule[];
}

interface PopulatedModule {
  _id: string;
  title: string;
  lessons: PopulatedLesson[];
  order: number;
}

interface PopulatedLesson {
  _id: string;
  title: string;
  vimeoVideoId: string;
  order: number;
  tasks?: string[];
}

interface Comment {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  lessonId: string;
  content: string;
  timestamp: string;
  parentId?: string;
  answeredBy?: {
    _id: string;
    name: string;
  };
  answerContent?: string;
  replies?: Comment[];
}

export default function CoursePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const router = useRouter();
  const params = useParams();

  const fetchComments = async (lessonId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/lessons/${lessonId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data.data);
      } else {
        console.error("Error fetching comments:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handlePostComment = async (lessonId: string, parentId?: string) => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/lessons/${lessonId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment, parentId }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments(lessonId);
      } else {
        console.error("Error posting comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleReplyComment = async (commentId: string, replyContent: string) => {
    if (!replyContent.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/comments/${commentId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answerContent: replyContent }),
      });

      if (response.ok) {
        fetchComments(currentLessonData?._id || "");
      } else {
        console.error("Error replying to comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };

  const checkCourseCompletion = async (courseId: string, token: string) => {
    try {
      const response = await fetch(`/api/certificates/check-completion?courseId=${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setIsCourseCompleted(data.completed);
      }
    } catch (error) {
      console.error("Error checking course completion:", error);
    }
  };

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
      const response = await fetch(`/api/courses/${params.id}?populate=modules.lessons`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
        checkCourseCompletion(params.id as string, token);

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
    if (course?.modules[moduleIndex]?.lessons[lessonIndex]?._id) {
      fetchComments(course.modules[moduleIndex].lessons[lessonIndex]._id);
    }
  };

  useEffect(() => {
    if (currentLessonData?._id) {
      fetchComments(currentLessonData._id);
    }
  }, [currentLessonData]);

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

              {/* Tasks */}
              {currentLessonData.tasks && currentLessonData.tasks.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4 mt-6">
                  <h3 className="text-xl font-bold mb-4">Tarefas</h3>
                  <ul className="list-disc list-inside">
                    {currentLessonData.tasks.map((task, index) => (
                      <li key={index} className="text-gray-300 mb-2">
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              )}



              {/* Controls */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button
                    onClick={markAsCompleted}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Marcar como Concluída
                  </button>
                  {isCourseCompleted && (
                    <a
                      href={`/api/certificates/generate?courseId=${params.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Gerar Certificado
                    </a>
                  )}
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




              {/* Comments Section */}
              <div className="bg-gray-900 rounded-lg p-4 mt-6">
                <h3 className="text-xl font-bold mb-4">Dúvidas e Comentários</h3>
                <div className="mb-4">
                  <textarea
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-500"
                    rows={3}
                    placeholder="Escreva sua dúvida ou comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                  <button
                    onClick={() => handlePostComment(currentLessonData?._id || "")}
                    className="mt-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Postar Comentário
                  </button>
                </div>

                <div>
                  {comments.length === 0 ? (
                    <p className="text-gray-400">Nenhum comentário ainda. Seja o primeiro a perguntar!</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment._id} className="bg-gray-800 p-3 rounded-lg mb-3 border border-gray-700">
                        <p className="text-gray-300 text-sm mb-1">
                          <strong>{comment.userId.name}</strong> em {new Date(comment.timestamp).toLocaleString("pt-BR")}
                        </p>
                        <p className="text-white mb-2">{comment.content}</p>
                        {comment.answerContent && (
                          <div className="bg-gray-700 p-2 rounded-lg mt-2 border border-gray-600">
                            <p className="text-gray-300 text-sm mb-1">
                              <strong>{comment.answeredBy?.name || "Admin"} (Resposta):</strong>
                            </p>
                            <p className="text-white">{comment.answerContent}</p>
                          </div>
                        )}
                        {/* Reply form for admin */}
                        {/* This part would typically be conditionally rendered based on user role */}
                        {/* For simplicity, assuming admin can reply directly here */}
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Responder..."
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleReplyComment(comment._id, (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>


