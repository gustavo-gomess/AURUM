import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id: commentId } = params;
    const { answerContent } = await req.json();

    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: 'Authorization token required' }, { status: 401 });
    }

    const payload: any = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ success: false, message: 'Comment not found' }, { status: 404 });
    }

    comment.answeredBy = payload.userId;
    comment.answerContent = answerContent;
    await comment.save();

    return NextResponse.json({ success: true, data: comment }, { status: 200 });
  } catch (error: any) {
    console.error('Error replying to comment:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}


