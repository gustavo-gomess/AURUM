import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();
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

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });

    if (!enrollment) {
      return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 });
    }

    const course = await Course.findById(courseId).populate({ path: 'modules', populate: { path: 'lessons' } });

    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }

    let allLessonsCompleted = true;
    for (const module of course.modules) {
      for (const lesson of (module as any).lessons) {
        const progress = enrollment.progress.find(
          (p) => p.moduleIndex === (module as any).order && p.lessonIndex === lesson.order
        );
        if (!progress || !progress.completed) {
          allLessonsCompleted = false;
          break;
        }
      }
      if (!allLessonsCompleted) break;
    }

    return NextResponse.json({ success: true, completed: allLessonsCompleted }, { status: 200 });
  } catch (error: any) {
    console.error("Error checking completion:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


