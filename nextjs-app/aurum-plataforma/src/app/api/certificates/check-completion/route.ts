import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const prisma = dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: 'Authorization token required' }, { status: 401 });
    }

    const payload: any = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = payload.userId;

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID is required' }, { status: 400 });
    }

    // Buscar enrollment com progresso
    const enrollment = await prisma.enrollment.findFirst({
      where: { 
        userId: userId, 
        courseId: courseId 
      },
      include: {
        progress: true,
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  orderBy: { order: 'asc' }
                }
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 });
    }

    // Verificar se todas as aulas foram completadas
    let allLessonsCompleted = true;
    let totalLessons = 0;
    let completedLessons = 0;

    for (const module of enrollment.course.modules) {
      for (const lesson of module.lessons) {
        totalLessons++;
        const progress = enrollment.progress.find(
          (p) => p.moduleIndex === module.order && p.lessonIndex === lesson.order
        );
        if (progress && progress.completed) {
          completedLessons++;
        } else {
          allLessonsCompleted = false;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      completed: allLessonsCompleted,
      totalLessons,
      completedLessons,
      progressPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error checking completion:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}