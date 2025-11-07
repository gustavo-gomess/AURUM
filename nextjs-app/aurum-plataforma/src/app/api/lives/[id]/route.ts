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

// GET - Buscar uma live específica (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const live = await prisma.live.findUnique({
      where: { id }
    })

    if (!live) {
      return NextResponse.json({ error: 'Live não encontrada' }, { status: 404 })
    }

    const formattedLive = {
      ...live,
      status: live.status.toLowerCase()
    }

    return NextResponse.json({ live: formattedLive }, { status: 200 })
  } catch (error) {
    console.error('Error fetching live:', error)
    return NextResponse.json({ error: 'Erro ao buscar live' }, { status: 500 })
  }
}

// PUT - Atualizar uma live (apenas admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    // Verificar se a live existe
    const existingLive = await prisma.live.findUnique({
      where: { id }
    })

    if (!existingLive) {
      return NextResponse.json({ error: 'Live não encontrada' }, { status: 404 })
    }

    const live = await prisma.live.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        instructorName: data.instructorName,
        instructorAvatar: data.instructorAvatar,
        instructorBio: data.instructorBio,
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

    return NextResponse.json({ live: formattedLive }, { status: 200 })
  } catch (error) {
    console.error('Error updating live:', error)
    return NextResponse.json({ error: 'Erro ao atualizar live' }, { status: 500 })
  }
}

// DELETE - Deletar uma live (apenas admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Verificar se a live existe
    const existingLive = await prisma.live.findUnique({
      where: { id }
    })

    if (!existingLive) {
      return NextResponse.json({ error: 'Live não encontrada' }, { status: 404 })
    }

    await prisma.live.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Live deletada com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting live:', error)
    return NextResponse.json({ error: 'Erro ao deletar live' }, { status: 500 })
  }
}

