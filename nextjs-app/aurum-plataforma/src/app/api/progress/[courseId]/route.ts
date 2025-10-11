import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const prisma = dbConnect();
    const { courseId } = await params;

    // Extrair token do header Authorization
    const token = extractTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verificar token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Buscar matrícula do usuário no curso
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: payload.userId,
        courseId: courseId,
      },
      include: {
        progress: {
          orderBy: [
            { moduleIndex: 'asc' },
            { lessonIndex: 'asc' }
          ]
        }
      }
    });

    if (!enrollment) {
      // Se não tem matrícula, criar automaticamente
      const newEnrollment = await prisma.enrollment.create({
        data: {
          userId: payload.userId,
          courseId: courseId,
        },
        include: {
          progress: true
        }
      });

      return NextResponse.json({
        progress: newEnrollment.progress,
      });
    }

    return NextResponse.json({
      progress: enrollment.progress,
    });

  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

