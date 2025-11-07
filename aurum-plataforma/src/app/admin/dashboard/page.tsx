'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Enrollment {
  _id: string;
  course: {
    _id: string;
    title: string;
  };
  progress: {
    moduleIndex: number;
    lessonIndex: number;
    completed: boolean;
  }[];
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUsers(token);
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      } else if (response.status === 403) {
        alert('Acesso negado. Você não tem permissão para acessar esta página.');
        router.push('/dashboard');
      } else {
        alert('Erro ao carregar usuários.');
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      alert('Erro ao buscar usuários.');
    } finally {
      setLoading(false);
    }
  };

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);

  const fetchUserProgress = async (userId: string, token: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data.user);
        setUserEnrollments(data.enrollments);
      } else {
        alert('Erro ao carregar progresso do usuário.');
      }
    } catch (error) {
      console.error('Erro ao buscar progresso do usuário:', error);
      alert('Erro ao buscar progresso do usuário.');
    }
  };

  const handleViewProgress = (user: User) => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProgress(user._id, token);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (response.ok) {
        // Atualiza a lista em memória
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
      } else if (response.status === 403) {
        alert('Apenas administradores podem alterar papéis.');
      } else {
        alert('Erro ao atualizar papel do usuário.');
      }
    } catch (e) {
      alert('Erro de conexão ao atualizar papel.');
    }
  };



  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Carregando...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h2>
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left text-gray-300">Nome</th>
                <th className="py-3 px-4 text-left text-gray-300">Email</th>
                <th className="py-3 px-4 text-left text-gray-300">Papel</th>
                <th className="py-3 px-4 text-left text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-700">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.role}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-gray-700 text-white p-2 rounded mr-2"
                    >
                      <option value="student">Aluno</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleViewProgress(user)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ver Progresso
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Progresso de {selectedUser.name}</h2>
            <p className="text-gray-300 mb-6">Email: {selectedUser.email}</p>

            {userEnrollments.length > 0 ? (
              userEnrollments.map((enrollment: Enrollment) => (
                <div key={enrollment._id} className="bg-gray-700 p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-semibold mb-2">Curso: {enrollment.course.title}</h3>
                  <ul className="list-disc list-inside text-gray-300">
                    {enrollment.progress.map((p: { moduleIndex: number; lessonIndex: number; completed: boolean }, idx: number) => (
                      <li key={idx}>
                        Módulo {p.moduleIndex + 1}, Aula {p.lessonIndex + 1}: {p.completed ? <span className="text-green-400">Concluída</span> : <span className="text-red-400">Pendente</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-300">Nenhum curso matriculado ou progresso encontrado.</p>
            )}

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}