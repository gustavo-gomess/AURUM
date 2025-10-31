'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Menu, X, BookOpen, Home, Bell, Settings, Users, Shield, ChevronDown, MessageSquare, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  commentId: string;
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationCount, setNotificationCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUserData(token)
      fetchNotifications(token)
      
      // Atualizar notificações a cada 30 segundos
      const interval = setInterval(() => {
        fetchNotifications(token)
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [])

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.notifications-dropdown') && !target.closest('.admin-dropdown')) {
        setIsNotificationsOpen(false)
        setIsAdminMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  const fetchNotifications = async (token: string) => {
    try {
      const response = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setNotificationCount(data.count || 0)
      } else {
        // Se der erro, apenas log e não quebre a aplicação
        console.warn('Notifications not available:', response.status)
        setNotifications([])
        setNotificationCount(0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      // Garantir que não quebre a aplicação
      setNotifications([])
      setNotificationCount(0)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationId })
      })

      if (response.ok) {
        // Atualizar estado local
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        setNotificationCount(prev => Math.max(0, prev - 1))
      } else {
        console.warn('Failed to mark notification as read:', response.status)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      // Não quebrar a aplicação
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setNotifications([])
        setNotificationCount(0)
        setIsNotificationsOpen(false)
      } else {
        console.warn('Failed to mark all notifications as read:', response.status)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      // Não quebrar a aplicação
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    setIsNotificationsOpen(false)
    router.push('/dashboard') // Redirecionar para o dashboard onde está a seção de perguntas
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const navigationItems = [
    {
      name: 'Casa',
      href: '/dashboard',
      icon: Home,
      active: pathname === '/dashboard'
    },
    {
      name: 'Aulas',
      href: '/cursos/aurum-course-id',
      icon: GraduationCap,
      active: pathname.startsWith('/cursos')
    }
  ]

  const adminMenuItems = [
    {
      name: 'Gerenciamento de Usuários',
      href: '/admin/usuarios',
      icon: Users
    },
    {
      name: 'Perguntas dos Usuários',
      href: '/admin/perguntas',
      icon: MessageSquare
    }
  ]

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
            
            {/* Menu Admin Dropdown */}
            {user?.role === 'ADMIN' && (
              <div className="relative admin-dropdown">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname.startsWith('/admin')
                      ? "bg-yellow-500 text-black"
                      : "text-gray-300 hover:text-yellow-500 hover:bg-gray-800"
                  )}
                >
                  <Shield className="w-4 h-4" />
                  <span>Administração</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    isAdminMenuOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown Menu */}
                {isAdminMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 admin-dropdown">
                    {adminMenuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            router.push(item.href)
                            setIsAdminMenuOpen(false)
                          }}
                          className={cn(
                            "w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors border-b border-gray-700 last:border-b-0",
                            pathname === item.href
                              ? "bg-yellow-500 text-black"
                              : "text-gray-300 hover:bg-gray-700 hover:text-yellow-500"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative notifications-dropdown">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative text-gray-300 hover:text-yellow-500 hover:bg-gray-800"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  </>
                )}
              </Button>

              {/* Dropdown de Notificações */}
              {isNotificationsOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto notifications-dropdown">
                  <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Notificações</h3>
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs text-yellow-500 hover:text-yellow-400 h-auto py-1 px-2"
                      >
                        Marcar todas como lidas
                      </Button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">Nenhuma notificação nova</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-700">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className="w-full p-4 text-left hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-200 leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.createdAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

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
              
              {/* Admin Menu Mobile */}
              {user?.role === 'ADMIN' && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-yellow-500 font-semibold text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Administração</span>
                  </div>
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          router.push(item.href)
                          setIsMenuOpen(false)
                        }}
                        className={cn(
                          "flex items-center space-x-3 w-full px-6 py-2 text-sm transition-colors",
                          pathname === item.href
                            ? "bg-yellow-500 text-black"
                            : "text-gray-400 hover:text-yellow-500 hover:bg-gray-800"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
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
