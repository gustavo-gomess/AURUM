import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const prisma = dbConnect();
  try {
    const { id } = await params;
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        module: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            },
            replies: true
          }
        }
      }
    });
    if (!lesson) {
      return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: lesson }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params;
    const body = await req.json();
    const lesson = await prisma.lesson.update({
      where: { id },
      data: body,
      include: {
        module: true
      }
    });
    return NextResponse.json({ success: true, data: lesson }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params;
    
    // Deletar a lesson (Prisma deletará automaticamente comentários devido ao cascade)
    const lesson = await prisma.lesson.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}