import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const prisma = dbConnect();

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

    const { courseId, moduleIndex, lessonIndex, completed } = await request.json();

    if (courseId === undefined || moduleIndex === undefined || lessonIndex === undefined || completed === undefined) {
      return NextResponse.json(
        { error: 'courseId, moduleIndex, lessonIndex, and completed are required' },
        { status: 400 }
      );
    }

    // Buscar matrícula do usuário no curso
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: payload.userId,
        courseId: courseId,
      },
      include: {
        progress: true
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Buscar se já existe progresso para esta aula
    const existingProgress = await prisma.progress.findFirst({
      where: {
        enrollmentId: enrollment.id,
        moduleIndex: moduleIndex,
        lessonIndex: lessonIndex,
      }
    });

    if (existingProgress) {
      // Atualizar progresso existente
      await prisma.progress.update({
        where: { id: existingProgress.id },
        data: {
          completed,
          completedAt: completed ? new Date() : null,
        }
      });
    } else {
      // Criar novo progresso
      await prisma.progress.create({
        data: {
          enrollmentId: enrollment.id,
          moduleIndex,
          lessonIndex,
          completed,
          completedAt: completed ? new Date() : null,
        }
      });
    }

    // Buscar progresso atualizado
    const updatedProgress = await prisma.progress.findMany({
      where: { enrollmentId: enrollment.id }
    });

    return NextResponse.json({
      message: 'Progress updated successfully',
      progress: updatedProgress,
    });

  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}