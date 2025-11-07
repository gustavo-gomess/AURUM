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
    const { title, description, order, courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID is required' }, { status: 400 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }

    const courseModule = await prisma.module.create({
      data: { title, description, order, courseId }
    });

    return NextResponse.json({ success: true, data: courseModule }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const prisma = dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    let modules;
    if (courseId) {
      modules = await prisma.module.findMany({
        where: { courseId },
        orderBy: { order: 'asc' },
        include: { lessons: true }
      });
    } else {
      modules = await prisma.module.findMany({
        orderBy: { order: 'asc' },
        include: { lessons: true }
      });
    }

    return NextResponse.json({ success: true, data: modules }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}