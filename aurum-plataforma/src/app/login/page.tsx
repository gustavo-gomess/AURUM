'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salvar token no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirecionar para dashboard
        router.push('/dashboard');
      } else {
        // Mostrar mensagem de erro mais específica
        if (response.status === 401) {
          setError(data.error || 'Email ou senha incorretos');
        } else if (response.status === 429) {
          setError('Muitas tentativas. Aguarde um momento e tente novamente.');
        } else {
          setError(data.error || data.message || 'Erro ao fazer login');
        }
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg p-8 shadow-lg shadow-yellow-500/20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <Logo variant="light" size="md" />
            </div>
            <h1 className="text-2xl font-bold text-yellow-500">Entrar na sua conta</h1>
            <p className="text-gray-400 mt-2">Acesse seus cursos e continue aprendendo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-yellow-500">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-yellow-500">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-500"
                placeholder="Sua senha"
              />
            </div>

            {error && (
              <div className="bg-red-900 border-2 border-red-700 text-red-100 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black py-3 px-4 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg shadow-yellow-500/30"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

