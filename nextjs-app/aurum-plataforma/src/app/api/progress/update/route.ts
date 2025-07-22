import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

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
    const enrollment = await Enrollment.findOne({
      user: payload.userId,
      course: courseId,
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Buscar se já existe progresso para esta aula
    const existingProgressIndex = enrollment.progress.findIndex(
      (p: any) => p.moduleIndex === moduleIndex && p.lessonIndex === lessonIndex
    );

    if (existingProgressIndex >= 0) {
      // Atualizar progresso existente
      enrollment.progress[existingProgressIndex].completed = completed;
      if (completed) {
        enrollment.progress[existingProgressIndex].completedAt = new Date();
      } else {
        enrollment.progress[existingProgressIndex].completedAt = undefined;
      }
    } else {
      // Criar novo progresso
      enrollment.progress.push({
        moduleIndex,
        lessonIndex,
        completed,
        completedAt: completed ? new Date() : undefined,
      });
    }

    await enrollment.save();

    return NextResponse.json({
      message: 'Progress updated successfully',
      progress: enrollment.progress,
    });

  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

