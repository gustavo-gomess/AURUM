'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Menu, X, BookOpen, Home, Bell, Settings, Users, Shield, ChevronDown, MessageSquare, GraduationCap, Loader2, User as UserIcon, Mail, Image as ImageIcon, CheckCircle2, Upload, Camera, Lock, Eye, EyeOff, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationCount, setNotificationCount] = useState(0)
  
  // Estados do formulário de configurações
  const [editName, setEditName] = useState('')
  const [editAvatarUrl, setEditAvatarUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  
  // Estados para troca de senha
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
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

  const handleOpenSettings = () => {
    setEditName(user?.name || '')
    setEditAvatarUrl(user?.avatarUrl || '')
    setSelectedImage(null)
    setImagePreview('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    setSaveError('')
    setSaveSuccess(false)
    setIsSettingsOpen(true)
    setIsMenuOpen(false) // Fechar menu mobile se estiver aberto
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setSaveError('Por favor, selecione apenas arquivos de imagem')
        return
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSaveError('A imagem deve ter no máximo 5MB')
        return
      }

      setSelectedImage(file)
      
      // Criar preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      setSaveError('')
    }
  }

  const uploadImageToImgur = async (imageFile: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 4e155b6c5e8f9c5', // Client ID público do Imgur
      },
      body: formData,
    })

    const data = await response.json()
    
    if (!data.success) {
      throw new Error('Erro ao fazer upload da imagem')
    }

    return data.data.link
  }

  const handleSaveSettings = async () => {
    if (!editName.trim()) {
      setSaveError('Nome é obrigatório')
      return
    }

    // Validar campos de senha se algum foi preenchido
    const isChangingPassword = currentPassword || newPassword || confirmPassword
    
    if (isChangingPassword) {
      if (!currentPassword) {
        setSaveError('Digite sua senha atual para alterá-la')
        return
      }
      if (!newPassword) {
        setSaveError('Digite a nova senha')
        return
      }
      if (newPassword.length < 6) {
        setSaveError('A nova senha deve ter no mínimo 6 caracteres')
        return
      }
      if (newPassword !== confirmPassword) {
        setSaveError('As senhas não coincidem')
        return
      }
    }

    setIsSaving(true)
    setSaveError('')
    setSaveSuccess(false)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setSaveError('Sessão expirada. Faça login novamente.')
        return
      }

      let finalAvatarUrl = editAvatarUrl.trim() || null

      // Se uma imagem foi selecionada, fazer upload primeiro
      if (selectedImage) {
        try {
          finalAvatarUrl = await uploadImageToImgur(selectedImage)
        } catch (uploadError) {
          console.error('Erro no upload:', uploadError)
          setSaveError('Erro ao fazer upload da imagem. Tente novamente.')
          return
        }
      }

      // Preparar dados para envio
      const updateData: any = {
        name: editName.trim(),
        avatarUrl: finalAvatarUrl,
      }

      // Adicionar dados de senha se estiver trocando
      if (isChangingPassword) {
        updateData.currentPassword = currentPassword
        updateData.newPassword = newPassword
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        setSaveError(data.error || 'Erro ao salvar alterações')
        return
      }

      // Atualizar o estado do usuário com os novos dados
      setUser(data.user)
      setSaveSuccess(true)

      // Limpar estado da imagem e senhas
      setSelectedImage(null)
      setImagePreview('')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Fechar o modal após 1 segundo
      setTimeout(() => {
        setIsSettingsOpen(false)
        setSaveSuccess(false)
      }, 1000)

    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      setSaveError('Erro ao salvar alterações. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
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
    },
    {
      name: 'Live',
      href: '/lives',
      icon: Play,
      active: pathname.startsWith('/live')
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
    },
    {
      name: 'Configurar Lives',
      href: '/admin/lives',
      icon: Play
    }
  ]

  return (
    <header className="bg-gray-900 border-b-2 border-yellow-500 sticky top-0 z-50 shadow-lg shadow-yellow-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Logo variant="light" size="sm" clickable href="/dashboard" />
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
                      ? "bg-yellow-500 text-black font-bold"
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
                <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || 'Usuário'} />
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-yellow-500 hover:bg-gray-800"
                onClick={handleOpenSettings}
              >
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
                  <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || 'Usuário'} />
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
                  onClick={handleOpenSettings}
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

      {/* Modal de Configurações */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[480px] bg-gray-900 border-gray-800 p-0">
          <DialogHeader className="space-y-2 px-5 pt-5 pb-3">
            <DialogTitle className="text-xl font-bold text-white text-center">
              Configurações do Perfil
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 text-center">
              Edite suas informações e segurança
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-5 max-h-[400px] overflow-y-auto custom-scrollbar">
            {/* Preview do Avatar com efeito - Botão de Upload */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <input 
                type="file" 
                id="avatar-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageSelect}
              />
              <button
                type="button"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="relative group cursor-pointer"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full opacity-75 group-hover:opacity-100 blur transition-all duration-300"></div>
                <Avatar className="relative w-20 h-20 border-2 border-gray-900 ring-2 ring-yellow-500 transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage 
                    src={imagePreview || editAvatarUrl || undefined} 
                    alt={editName} 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black text-2xl font-bold">
                    {editName?.charAt(0)?.toUpperCase() || <UserIcon className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
                {/* Overlay com ícone de câmera */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="w-6 h-6 text-yellow-500" />
                </div>
              </button>
              <div className="text-center">
                {selectedImage ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null)
                      setImagePreview('')
                    }}
                    className="text-xs text-red-400 hover:text-red-300 underline transition-colors"
                  >
                    Remover imagem
                  </button>
                ) : (
                  <p className="text-xs text-gray-500">Clique para alterar (máx. 5MB)</p>
                )}
              </div>
            </div>

            {/* Campo Nome com ícone */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="flex items-center text-xs font-semibold text-gray-200">
                <UserIcon className="w-3.5 h-3.5 mr-1.5 text-yellow-500" />
                Nome Completo
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                  placeholder="Digite seu nome completo"
                  maxLength={60}
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
              <p className={cn(
                "text-xs text-right",
                editName.length > 50 ? "text-yellow-500" : "text-gray-500"
              )}>
                {editName.length}/60
              </p>
            </div>

            {/* Separador - Segurança */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 py-0.5 text-gray-500 font-semibold rounded-full border border-gray-700 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Segurança
                </span>
              </div>
            </div>

            {/* Campo Senha Atual */}
            <div className="space-y-1.5">
              <label htmlFor="currentPassword" className="flex items-center text-xs font-semibold text-gray-200">
                <Lock className="w-3.5 h-3.5 mr-1.5 text-yellow-500" />
                Senha Atual (opcional)
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                  placeholder="Digite sua senha atual"
                  autoComplete="current-password"
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Campo Nova Senha */}
            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="flex items-center text-xs font-semibold text-gray-200">
                <Lock className="w-3.5 h-3.5 mr-1.5 text-yellow-500" />
                Nova Senha
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Campo Confirmar Nova Senha */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="flex items-center text-xs font-semibold text-gray-200">
                <Lock className="w-3.5 h-3.5 mr-1.5 text-yellow-500" />
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-400 flex items-center">
                  <X className="w-3 h-3 mr-1" />
                  As senhas não coincidem
                </p>
              )}
            </div>

            {/* Mensagens de Erro e Sucesso com ícones */}
            {saveError && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-md">
                <div className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 font-medium">{saveError}</p>
                </div>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-md">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-300 font-medium">Alterações salvas com sucesso!</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 px-5 pb-4 pt-3 border-t border-gray-800">
            <Button
              variant="outline"
              onClick={() => setIsSettingsOpen(false)}
              disabled={isSaving}
              className="flex-1 sm:flex-none h-9 text-sm border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 hover:text-white transition-all duration-200 font-medium"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving || !editName.trim()}
              className="flex-1 sm:flex-none h-9 text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-yellow-500/50 transition-all duration-200"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Salvar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
