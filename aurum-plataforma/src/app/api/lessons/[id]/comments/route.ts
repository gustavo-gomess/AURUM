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
    const body = await req.json();
    const { content, parentId } = body;

    console.log('📝 POST /api/lessons/[id]/comments - Payload recebido:', { lessonId, content, parentId });

    if (!content || content.trim() === '') {
      console.error('❌ Conteúdo vazio');
      return NextResponse.json({ success: false, message: "Content is required" }, { status: 400 });
    }

    const token = extractTokenFromRequest(req);
    if (!token) {
      console.error('❌ Token não fornecido');
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 });
    }

    const payload: any = verifyToken(token);
    if (!payload) {
      console.error('❌ Token inválido');
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    console.log('✅ Usuário autenticado:', payload.userId);

    // Criar o comentário primeiro
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

    console.log('✅ Comentário criado:', comment.id);

    // Tentar criar notificação (não falhar se der erro)
    if (parentId) {
      try {
        // Buscar usuário que está comentando
        const currentUser = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { role: true, name: true }
        });

        // Se for ADMIN (professor), criar notificação
        if (currentUser?.role === 'ADMIN') {
          // Buscar o comentário pai para pegar o userId do aluno
          const parentComment = await prisma.comment.findUnique({
            where: { id: parentId },
            select: { 
              userId: true,
              user: {
                select: {
                  name: true
                }
              }
            }
          });

          if (parentComment && parentComment.userId !== payload.userId) {
            // Criar notificação para o aluno
            await prisma.notification.create({
              data: {
                userId: parentComment.userId,
                commentId: comment.id,
                message: `Olá! Sua dúvida foi respondida pelo professor. A resposta está disponível na seção "Perguntas realizadas" na página inicial.`,
                read: false
              }
            });

            console.log(`✅ Notificação criada para o usuário ${parentComment.userId}`);
          }
        }
      } catch (notificationError) {
        // Log do erro mas não falhar a criação do comentário
        console.error("⚠️ Erro ao criar notificação (comentário criado com sucesso):", notificationError);
      }
    }

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error posting comment:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}