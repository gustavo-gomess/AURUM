import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const prisma = dbConnect();
  try {
    const { id: lessonId } = await params;
    
    // Buscar comentários principais (sem parentId) com otimizações
    const comments = await prisma.comment.findMany({
      where: { 
        lessonId, 
        parentId: null 
      },
      select: {
        id: true,
        content: true,
        timestamp: true,
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        replies: {
          select: {
            id: true,
            content: true,
            timestamp: true,
            user: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          },
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: { timestamp: 'desc' }, // Comentários mais recentes primeiro
      take: 50 // Limitar a 50 comentários principais por performance
    });

    return NextResponse.json({ 
      success: true, 
      data: comments 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=10' // Cache de 10 segundos
      }
    });
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const prisma = dbConnect();
  try {
    const { id: lessonId } = await params;
    const { content, parentId } = await req.json();

    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 });
    }

    const payload: any = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const comment = await prisma.comment.create({
      data: { 
        userId: payload.userId, 
        lessonId, 
        content, 
        parentId: parentId || null 
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error: any) {
    console.error("Error posting comment:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}