import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const prisma = dbConnect();
  try {
    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: 'Authorization token required' }, { status: 401 });
    }
    const payload: any = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }
    const { title, description, vimeoVideoId, order, moduleId, courseId, tasks } = await req.json();

    if (!moduleId || !courseId) {
      return NextResponse.json({ success: false, message: 'Module ID and Course ID are required' }, { status: 400 });
    }

    const courseModule = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!courseModule) {
      return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 });
    }

    const lesson = await prisma.lesson.create({
      data: { 
        title, 
        description, 
        vimeoVideoId, 
        order, 
        moduleId, 
        courseId, 
        tasks: tasks || [] 
      }
    });

    return NextResponse.json({ success: true, data: lesson }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const prisma = dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get('moduleId');

    let lessons;
    if (moduleId) {
      lessons = await prisma.lesson.findMany({
        where: { moduleId },
        orderBy: { order: 'asc' }
      });
    } else {
      lessons = await prisma.lesson.findMany({
        orderBy: { order: 'asc' }
      });
    }

    return NextResponse.json({ success: true, data: lessons }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}