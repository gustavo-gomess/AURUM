import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to verify admin token
async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true }
    })
    
    return user && user.role === 'ADMIN' ? user : null
  } catch {
    return null
  }
}

// GET - Listar todas as lives (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status && status !== 'all' 
      ? { status: status.toUpperCase() as 'LIVE' | 'UPCOMING' | 'FINISHED' }
      : {}

    const lives = await prisma.live.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // LIVE primeiro, depois UPCOMING, depois FINISHED
        { createdAt: 'desc' }
      ]
    })

    // Mapear para o formato esperado pelo frontend
    const formattedLives = lives.map(live => ({
      id: live.id,
      title: live.title,
      description: live.description,
      instructorName: live.instructorName,
      instructorAvatar: live.instructorAvatar,
      instructorBio: live.instructorBio,
      thumbnailUrl: live.thumbnailUrl,
      vimeoVideoId: live.vimeoVideoId,
      scheduledDate: live.scheduledDate,
      scheduledTime: live.scheduledTime,
      duration: live.duration,
      category: live.category,
      status: live.status.toLowerCase(),
      viewersCount: live.viewersCount,
    }))

    return NextResponse.json({ lives: formattedLives }, { status: 200 })
  } catch (error) {
    console.error('Error fetching lives:', error)
    return NextResponse.json({ error: 'Erro ao buscar lives' }, { status: 500 })
  }
}

// POST - Criar nova live (apenas admin)
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()

    // Validações
    if (!data.title || !data.description || !data.scheduledDate || !data.scheduledTime ||
        !data.duration || !data.instructorName || !data.category || !data.vimeoVideoId) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const live = await prisma.live.create({
      data: {
        title: data.title,
        description: data.description,
        instructorName: data.instructorName,
        instructorAvatar: data.instructorAvatar || null,
        instructorBio: data.instructorBio || null,
        thumbnailUrl: data.thumbnailUrl,
        vimeoVideoId: data.vimeoVideoId,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        duration: data.duration,
        category: data.category,
        status: data.status?.toUpperCase() || 'UPCOMING',
        viewersCount: data.viewersCount || 0,
      }
    })

    const formattedLive = {
      ...live,
      status: live.status.toLowerCase()
    }

    return NextResponse.json({ live: formattedLive }, { status: 201 })
  } catch (error) {
    console.error('Error creating live:', error)
    return NextResponse.json({ error: 'Erro ao criar live' }, { status: 500 })
  }
}

