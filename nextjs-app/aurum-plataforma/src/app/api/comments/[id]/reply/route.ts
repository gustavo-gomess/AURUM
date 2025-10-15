import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const prisma = dbConnect();
  try {
    const { id: commentId } = await params;
    const { answerContent } = await req.json();

    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: 'Authorization token required' }, { status: 401 });
    }

    const payload: any = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return NextResponse.json({ success: false, message: 'Comment not found' }, { status: 404 });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        answeredBy: payload.userId,
        answerContent: answerContent,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        answeredByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: updatedComment }, { status: 200 });
  } catch (error: any) {
    console.error('Error replying to comment:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}