import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

// Cache de progresso por usuário (válido por 30 segundos)
const progressCache = new Map<string, { data: any, time: number }>();
const PROGRESS_CACHE_DURATION = 30 * 1000; // 30 segundos

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

    // Verificar cache
    const cacheKey = `${payload.userId}-${courseId}`;
    const cached = progressCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.time) < PROGRESS_CACHE_DURATION) {
      return NextResponse.json(cached.data, {
        headers: { 'X-Cache': 'HIT' }
      });
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

    let responseData;
    
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

      responseData = {
        progress: newEnrollment.progress,
      };
    } else {
      responseData = {
        progress: enrollment.progress,
      };
    }

    // Atualizar cache
    progressCache.set(cacheKey, { data: responseData, time: now });

    return NextResponse.json(responseData, {
      headers: { 'X-Cache': 'MISS' }
    });

  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

