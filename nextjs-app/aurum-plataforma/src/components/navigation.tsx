'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Menu, X, BookOpen, LayoutDashboard, Bell, Settings, Users, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUserData(token)
    }
  }, [])

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard'
    },
    {
      name: 'Cursos',
      href: '/cursos',
      icon: BookOpen,
      active: pathname.startsWith('/cursos')
    }
  ]

  // Adicionar item admin se o usuário for administrador
  if (user?.role === 'ADMIN') {
    navigationItems.push({
      name: 'Administração',
      href: '/admin/usuarios',
      icon: Shield,
      active: pathname.startsWith('/admin')
    })
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-yellow-500">AURUM</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    item.active
                      ? "bg-yellow-500 text-black"
                      : "text-gray-300 hover:text-yellow-500 hover:bg-gray-800"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative text-gray-300 hover:text-yellow-500 hover:bg-gray-800">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-yellow-500 text-black">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-200">
                    {user?.name || 'Usuário'}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs",
                      user?.role === 'ADMIN' 
                        ? "bg-yellow-500 text-black" 
                        : "bg-gray-700 text-gray-200"
                    )}
                  >
                    {user?.role === 'ADMIN' ? 'Admin' : 'Estudante'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Settings & Logout */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-500 hover:bg-gray-800">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-black">
                Sair
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-300 hover:text-yellow-500 hover:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href)
                      setIsMenuOpen(false)
                    }}
                    className={cn(
                      "flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-colors",
                      item.active
                        ? "bg-yellow-500 text-black"
                        : "text-gray-300 hover:text-yellow-500 hover:bg-gray-800"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Mobile User Actions */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center space-x-3 px-3 py-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-yellow-500 text-black">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-gray-200">
                    {user?.name || 'Usuário'}
                  </div>
                  <div className="text-xs text-gray-400">{user?.email}</div>
                </div>
              </div>
              
              <div className="mt-2 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-300 hover:text-yellow-500 hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-300 hover:text-yellow-500 hover:bg-gray-800"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
