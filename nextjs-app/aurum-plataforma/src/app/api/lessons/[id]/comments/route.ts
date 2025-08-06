import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id: lessonId } = params;
    const comments = await Comment.find({ lessonId, parentId: { $exists: false } })
      .populate("userId", "name")
      .populate("answeredBy", "name")
      .sort({ timestamp: 1 });

    const populatedComments = await Promise.all(comments.map(async (comment) => {
      const replies = await Comment.find({ parentId: comment._id })
        .populate("userId", "name")
        .populate("answeredBy", "name")
        .sort({ timestamp: 1 });
      return { ...comment.toObject(), replies };
    }));

    return NextResponse.json({ success: true, data: populatedComments }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id: lessonId } = params;
    const { content, parentId } = await req.json();

    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 });
    }

    const payload: any = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const comment = await Comment.create({ userId: payload.userId, lessonId, content, parentId });

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error: any) {
    console.error("Error posting comment:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}


