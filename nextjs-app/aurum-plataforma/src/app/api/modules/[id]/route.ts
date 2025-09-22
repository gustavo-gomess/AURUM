import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const prisma = dbConnect();
  try {
    const { id } = params;
    const module = await prisma.module.findUnique({
      where: { id },
      include: { 
        lessons: {
          orderBy: { order: 'asc' }
        },
        course: true
      }
    });
    if (!module) {
      return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: module }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
    const { id } = params;
    const body = await req.json();
    const module = await prisma.module.update({
      where: { id },
      data: body,
      include: { 
        lessons: {
          orderBy: { order: 'asc' }
        }
      }
    });
    return NextResponse.json({ success: true, data: module }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
    const { id } = params;
    
    // Deletar o módulo (Prisma deletará automaticamente as lessons devido ao cascade)
    const module = await prisma.module.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}