import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const prisma = dbConnect();
  try {
    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 });
    }

    const payload: any = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    // Buscar apenas os comentários principais (perguntas) do usuário logado
    const userQuestions = await prisma.comment.findMany({
      where: { 
        userId: payload.userId,
        parentId: null // Apenas comentários principais (perguntas)
      },
      select: {
        id: true,
        content: true,
        timestamp: true,
        lesson: {
          select: {
            id: true,
            title: true,
            module: {
              select: {
                courseId: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        replies: {
          where: {
            user: {
              role: 'ADMIN' // Apenas respostas de administradores/professores
            }
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
            }
          },
          orderBy: { timestamp: 'asc' },
          take: 1 // Apenas a primeira resposta do professor
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 5 // Limitar às últimas 5 perguntas
    });

    return NextResponse.json({ 
      success: true, 
      questions: userQuestions 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=30' // Cache de 30 segundos
      }
    });
  } catch (error: any) {
    console.error("Error fetching user questions:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

