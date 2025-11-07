'use client'

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Play,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  User,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  X,
  Camera,
  Tag,
  FileText,
  Video,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Interface para os dados de uma live
interface LiveItem {
  id: string
  title: string
  description: string
  instructorName: string
  instructorAvatar?: string
  instructorBio?: string
  thumbnailUrl: string
  vimeoVideoId: string
  scheduledDate: string
  scheduledTime: string
  duration: string
  category: string
  status: 'live' | 'upcoming' | 'finished'
  viewersCount?: number
}

export default function AdminLivesPage() {
  const [lives, setLives] = useState<LiveItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLive, setEditingLive] = useState<LiveItem | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Estados do formulário
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: "",
    instructorName: "",
    instructorBio: "",
    category: "",
    vimeoVideoId: "",
    status: "upcoming" as LiveItem['status'],
  })

  const [instructorAvatarFile, setInstructorAvatarFile] = useState<File | null>(null)
  const [instructorAvatarPreview, setInstructorAvatarPreview] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState("")

  // Carregar lives da API
  useEffect(() => {
    fetchLives()
  }, [])

  const fetchLives = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/lives')
      if (response.ok) {
        const data = await response.json()
        setLives(data.lives)
      }
    } catch (error) {
      console.error('Erro ao carregar lives:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Abrir modal para criar nova live
  const handleCreateNew = () => {
    setEditingLive(null)
    setFormData({
      title: "",
      description: "",
      scheduledDate: "",
      scheduledTime: "",
      duration: "",
      instructorName: "",
      instructorBio: "",
      category: "",
      vimeoVideoId: "",
      status: "upcoming",
    })
    setInstructorAvatarFile(null)
    setInstructorAvatarPreview("")
    setThumbnailFile(null)
    setThumbnailPreview("")
    setSaveError("")
    setSaveSuccess(false)
    setIsModalOpen(true)
  }

  // Abrir modal para editar live existente
  const handleEdit = (live: LiveItem) => {
    setEditingLive(live)
    setFormData({
      title: live.title,
      description: live.description,
      scheduledDate: live.scheduledDate,
      scheduledTime: live.scheduledTime,
      duration: live.duration,
      instructorName: live.instructorName,
      instructorBio: live.instructorBio || "",
      category: live.category,
      vimeoVideoId: live.vimeoVideoId,
      status: live.status,
    })
    setInstructorAvatarFile(null)
    setInstructorAvatarPreview(live.instructorAvatar || "")
    setThumbnailFile(null)
    setThumbnailPreview(live.thumbnailUrl)
    setSaveError("")
    setSaveSuccess(false)
    setIsModalOpen(true)
  }

  // Deletar live
  const handleDelete = async (liveId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta live?")) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Sessão expirada. Faça login novamente.')
        return
      }

      const response = await fetch(`/api/lives/${liveId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Remover da lista local
        setLives(lives.filter(live => live.id !== liveId))
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao deletar live')
      }
    } catch (error) {
      console.error('Erro ao deletar live:', error)
      alert('Erro ao deletar live')
    }
  }

  // Upload de imagem para Imgur
  const uploadImageToImgur = async (imageFile: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Client-ID 4e155b6c5e8f9c5',
        },
        body: formData,
      })

      if (!response.ok) {
        // Se for erro 429 (Too Many Requests) ou outros erros, usar fallback silenciosamente
        if (response.status === 429) {
          // Imgur sobrecarregado, usar base64 sem logar erro
          throw new Error('IMGUR_OVERLOADED')
        }
        const errorText = await response.text()
        // Apenas logar se não for um erro comum
        if (response.status !== 403 && response.status !== 429) {
          console.warn('Imgur API Error:', response.status)
        }
        throw new Error(`Erro ao fazer upload: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success || !data.data?.link) {
        throw new Error(data.data?.error || 'Erro ao fazer upload da imagem')
      }

      return data.data.link
    } catch (error: any) {
      // Se for erro de sobrecarga do Imgur ou qualquer outro erro, usar base64 silenciosamente
      if (error.message === 'IMGUR_OVERLOADED' || error.message.includes('Failed to fetch') || error.message.includes('ERR_HTTP2')) {
        // Usar base64 como fallback sem logar erro (funcionalidade normal)
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64String = reader.result as string
            resolve(base64String)
          }
          reader.onerror = () => {
            reject(new Error('Erro ao processar a imagem'))
          }
          reader.readAsDataURL(imageFile)
        })
      }
      
      // Para outros erros, tentar base64 também
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          resolve(base64String)
        }
        reader.onerror = () => {
          reject(new Error('Erro ao processar a imagem'))
        }
        reader.readAsDataURL(imageFile)
      })
    }
  }

  // Selecionar avatar do instrutor
  const handleInstructorAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSaveError('Por favor, selecione apenas arquivos de imagem')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setSaveError('A imagem deve ter no máximo 5MB')
        return
      }

      setInstructorAvatarFile(file)
      // Limpar URL se houver
      const reader = new FileReader()
      reader.onloadend = () => {
        setInstructorAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setSaveError('')
    }
  }

  // Selecionar thumbnail
  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSaveError('Por favor, selecione apenas arquivos de imagem')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setSaveError('A imagem deve ter no máximo 5MB')
        return
      }

      setThumbnailFile(file)
      // Limpar URL se houver
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setSaveError('')
    }
  }

  // Salvar live (criar ou editar)
  const handleSave = async () => {
    // Validações
    if (!formData.title.trim()) {
      setSaveError('Título é obrigatório')
      return
    }
    if (!formData.description.trim()) {
      setSaveError('Descrição é obrigatória')
      return
    }
    if (!formData.scheduledDate) {
      setSaveError('Data é obrigatória')
      return
    }
    if (!formData.scheduledTime) {
      setSaveError('Horário é obrigatório')
      return
    }
    if (!formData.duration.trim()) {
      setSaveError('Duração é obrigatória')
      return
    }
    if (!formData.instructorName.trim()) {
      setSaveError('Nome do instrutor é obrigatório')
      return
    }
    if (!formData.category.trim()) {
      setSaveError('Categoria é obrigatória')
      return
    }
    if (!formData.vimeoVideoId.trim()) {
      setSaveError('ID do vídeo Vimeo é obrigatório')
      return
    }

    setIsSaving(true)
    setSaveError('')
    setSaveSuccess(false)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setSaveError('Sessão expirada. Faça login novamente.')
        setIsSaving(false)
        return
      }

      let instructorAvatarUrl = instructorAvatarPreview
      let thumbnailUrl = thumbnailPreview

      // Upload de avatar do instrutor se foi selecionado um arquivo
      if (instructorAvatarFile) {
        // Se já é uma URL HTTP válida, usar diretamente
        if (instructorAvatarPreview && instructorAvatarPreview.startsWith('http')) {
          instructorAvatarUrl = instructorAvatarPreview
        } else {
          try {
            instructorAvatarUrl = await uploadImageToImgur(instructorAvatarFile)
            // Se retornou base64, significa que o Imgur não estava disponível
            // Mas funciona normalmente, então não precisamos avisar o usuário
          } catch (error: any) {
            setSaveError(`Erro ao processar a imagem do instrutor: ${error.message || 'Erro desconhecido'}`)
            setIsSaving(false)
            return
          }
        }
      } else if (instructorAvatarPreview && instructorAvatarPreview.startsWith('http')) {
        // Se não há arquivo mas há uma URL, usar a URL
        instructorAvatarUrl = instructorAvatarPreview
      }

      // Upload de thumbnail se foi selecionado um arquivo
      if (thumbnailFile) {
        // Se já é uma URL HTTP válida, usar diretamente
        if (thumbnailPreview && thumbnailPreview.startsWith('http')) {
          thumbnailUrl = thumbnailPreview
        } else {
          try {
            thumbnailUrl = await uploadImageToImgur(thumbnailFile)
            // Se retornou base64, significa que o Imgur não estava disponível
            // Mas funciona normalmente, então não precisamos avisar o usuário
          } catch (error: any) {
            setSaveError(`Erro ao processar a thumbnail: ${error.message || 'Erro desconhecido'}`)
            setIsSaving(false)
            return
          }
        }
      } else if (thumbnailPreview && thumbnailPreview.startsWith('http')) {
        // Se não há arquivo mas há uma URL, usar a URL
        thumbnailUrl = thumbnailPreview
      }

      // Formatar data para exibição
      const dateObj = new Date(formData.scheduledDate)
      const formattedDate = dateObj.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      })

      const livePayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        instructorName: formData.instructorName.trim(),
        instructorAvatar: instructorAvatarUrl,
        instructorBio: formData.instructorBio.trim() || null,
        thumbnailUrl: thumbnailUrl,
        vimeoVideoId: formData.vimeoVideoId.trim(),
        scheduledDate: formattedDate,
        scheduledTime: formData.scheduledTime,
        duration: formData.duration.trim(),
        category: formData.category.trim(),
        status: formData.status,
        viewersCount: editingLive?.viewersCount || 0,
      }

      const url = editingLive ? `/api/lives/${editingLive.id}` : '/api/lives'
      const method = editingLive ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(livePayload)
      })

      if (!response.ok) {
        const data = await response.json()
        setSaveError(data.error || 'Erro ao salvar live')
        return
      }

      const data = await response.json()
      const savedLive = data.live

      if (editingLive) {
        // Atualizar na lista
        setLives(lives.map(live => live.id === editingLive.id ? savedLive : live))
      } else {
        // Adicionar à lista
        setLives([savedLive, ...lives])
      }

      setSaveSuccess(true)

      // Fechar modal após 1 segundo
      setTimeout(() => {
        setIsModalOpen(false)
        setSaveSuccess(false)
      }, 1000)

    } catch (error) {
      console.error('Erro ao salvar live:', error)
      setSaveError('Erro ao salvar live. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  // Função para obter a configuração do badge baseado no status
  const getStatusBadge = (status: LiveItem['status']) => {
    switch (status) {
      case 'live':
        return { label: 'AO VIVO', className: 'bg-red-500 text-white' }
      case 'upcoming':
        return { label: 'AGENDADA', className: 'bg-blue-500 text-white' }
      case 'finished':
        return { label: 'FINALIZADA', className: 'bg-gray-600 text-gray-300' }
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Carregando lives...</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
        {/* Header */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20">
                    <Play className="h-6 w-6 text-yellow-500" />
                  </div>
                  Configurar Lives
                </CardTitle>
                <CardDescription className="text-gray-400 mt-2">
                  Gerencie todas as lives da plataforma
                </CardDescription>
              </div>
              <Button
                onClick={handleCreateNew}
                className="bg-yellow-500 text-black hover:bg-yellow-400 font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Live
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Lista de Lives */}
        <div className="grid gap-6">
          {lives.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="py-16 text-center">
                <Play className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhuma live cadastrada</p>
                <Button
                  onClick={handleCreateNew}
                  className="mt-4 bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  Criar primeira live
                </Button>
              </CardContent>
            </Card>
          ) : (
            lives.map((live) => {
              const statusBadge = getStatusBadge(live.status)
              
              return (
                <Card key={live.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                  <div className="grid md:grid-cols-[300px_1fr] gap-6">
                    {/* Thumbnail */}
                    <div className="relative aspect-video md:aspect-auto">
                      <img
                        src={live.thumbnailUrl}
                        alt={live.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={cn("px-3 py-1 font-semibold", statusBadge.className)}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-yellow-500 text-black font-medium">
                              {live.category}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {live.title}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {live.description}
                          </p>
                        </div>
                        
                        {/* Ações */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(live)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-yellow-500"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(live.id)}
                            className="border-gray-700 text-gray-300 hover:bg-red-900 hover:text-red-400 hover:border-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Informações */}
                      <div className="grid sm:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="h-4 w-4 text-yellow-500" />
                          {live.scheduledDate}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          {live.scheduledTime} - {live.duration}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Video className="h-4 w-4 text-yellow-500" />
                          ID: {live.vimeoVideoId}
                        </div>
                      </div>

                      {/* Instrutor */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                        <Avatar className="h-10 w-10 border-2 border-yellow-500/50">
                          <AvatarImage src={live.instructorAvatar} />
                          <AvatarFallback className="bg-yellow-500 text-black text-sm font-bold">
                            {live.instructorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs text-gray-500">Instrutor</p>
                          <p className="text-sm font-semibold text-white">{live.instructorName}</p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
            })
          )}
        </div>
          </>
        )}
      </main>

      {/* Modal de Criar/Editar Live */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] bg-gray-900 border-gray-800 p-0 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-800">
            <DialogTitle className="text-2xl font-bold text-white">
              {editingLive ? 'Editar Live' : 'Nova Live'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingLive ? 'Atualize as informações da live' : 'Preencha os dados para criar uma nova live'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-200">
                <FileText className="w-4 h-4 mr-2 text-yellow-500" />
                Título da Live
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Estratégias Avançadas de Investimento"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-200">
                <FileText className="w-4 h-4 mr-2 text-yellow-500" />
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o conteúdo da live..."
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
              />
            </div>

            {/* Data e Horário */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200">
                  <Calendar className="w-4 h-4 mr-2 text-yellow-500" />
                  Data
                </label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200">
                  <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                  Horário
                </label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            {/* Duração e Categoria */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200">
                  <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                  Duração Estimada
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Ex: 2h ou 1h30min"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200">
                  <Tag className="w-4 h-4 mr-2 text-yellow-500" />
                  Categoria (Badge)
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Investimentos"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            {/* Instrutor */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-200">
                <User className="w-4 h-4 mr-2 text-yellow-500" />
                Nome do Instrutor
              </label>
              <Input
                value={formData.instructorName}
                onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                placeholder="Ex: Gustavo Henrique"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Bio do Instrutor */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-200">
                <User className="w-4 h-4 mr-2 text-yellow-500" />
                Bio do Instrutor (opcional)
              </label>
              <Input
                value={formData.instructorBio}
                onChange={(e) => setFormData({ ...formData, instructorBio: e.target.value })}
                placeholder="Ex: Especialista em mercado financeiro..."
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Avatar do Instrutor */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-200">
                <User className="w-4 h-4 mr-2 text-yellow-500" />
                Foto do Instrutor
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="instructor-avatar"
                  className="hidden"
                  accept="image/*"
                  onChange={handleInstructorAvatarSelect}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('instructor-avatar')?.click()}
                  className="relative group"
                >
                  <Avatar className="h-20 w-20 border-2 border-yellow-500">
                    <AvatarImage src={instructorAvatarPreview} />
                    <AvatarFallback className="bg-gray-800 text-gray-400">
                      {formData.instructorName.charAt(0) || <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6 text-yellow-500" />
                  </div>
                </button>
                <div className="flex-1 space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('instructor-avatar')?.click()}
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Selecionar Imagem
                  </Button>
                  <Input
                    type="url"
                    placeholder="Ou cole a URL da imagem aqui"
                    value={instructorAvatarPreview && instructorAvatarPreview.startsWith('http') ? instructorAvatarPreview : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setInstructorAvatarPreview(e.target.value)
                        setInstructorAvatarFile(null)
                      }
                    }}
                    className="bg-gray-800 border-gray-700 text-white text-xs"
                  />
                  <p className="text-xs text-gray-500">Máximo 5MB ou URL direta</p>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-200">
                <ImageIcon className="w-4 h-4 mr-2 text-yellow-500" />
                Thumbnail da Live
              </label>
              <div className="space-y-3">
                {thumbnailPreview && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-yellow-500">
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="thumbnail"
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('thumbnail')?.click()}
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {thumbnailPreview ? 'Alterar Thumbnail' : 'Selecionar Thumbnail'}
                </Button>
                <Input
                  type="url"
                  placeholder="Ou cole a URL da thumbnail aqui"
                  value={thumbnailPreview && thumbnailPreview.startsWith('http') ? thumbnailPreview : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setThumbnailPreview(e.target.value)
                      setThumbnailFile(null)
                    }
                  }}
                  className="bg-gray-800 border-gray-700 text-white text-xs"
                />
                <p className="text-xs text-gray-500">Recomendado: 800x450px, máximo 5MB ou URL direta</p>
              </div>
            </div>

            {/* ID Vimeo */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-200">
                <Video className="w-4 h-4 mr-2 text-yellow-500" />
                ID do Vídeo Vimeo
              </label>
              <Input
                value={formData.vimeoVideoId}
                onChange={(e) => setFormData({ ...formData, vimeoVideoId: e.target.value })}
                placeholder="Ex: 927750808"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-500">
                Encontre o ID na URL do vídeo: vimeo.com/<strong>927750808</strong>
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-200">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'upcoming' })}
                  className={cn(
                    "px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all",
                    formData.status === 'upcoming'
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-blue-500"
                  )}
                >
                  Agendada
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'live' })}
                  className={cn(
                    "px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all",
                    formData.status === 'live'
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-red-500"
                  )}
                >
                  Ao Vivo
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'finished' })}
                  className={cn(
                    "px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all",
                    formData.status === 'finished'
                      ? "bg-gray-600 border-gray-600 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  )}
                >
                  Finalizada
                </button>
              </div>
            </div>

            {/* Mensagens de erro/sucesso */}
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
                  <p className="text-xs text-green-300 font-medium">
                    Live {editingLive ? 'atualizada' : 'criada'} com sucesso!
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 px-6 pb-6 pt-4 border-t border-gray-800">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-yellow-500 text-black hover:bg-yellow-400 font-semibold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {editingLive ? 'Atualizar' : 'Criar'} Live
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

