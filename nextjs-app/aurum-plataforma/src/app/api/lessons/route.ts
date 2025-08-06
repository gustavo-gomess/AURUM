import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Module from '@/models/Module';
import Lesson from '@/models/Lesson';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { title, description, vimeoVideoId, order, moduleId, courseId, tasks } = await req.json();

    if (!moduleId || !courseId) {
      return NextResponse.json({ success: false, message: 'Module ID and Course ID are required' }, { status: 400 });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 });
    }

    const lesson = await Lesson.create({ title, description, vimeoVideoId, order, moduleId, courseId, tasks });

    module.lessons.push(lesson._id);
    await module.save();

    return NextResponse.json({ success: true, data: lesson }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get('moduleId');

    let lessons;
    if (moduleId) {
      lessons = await Lesson.find({ moduleId }).sort({ order: 1 });
    } else {
      lessons = await Lesson.find({}).sort({ order: 1 });
    }

    return NextResponse.json({ success: true, data: lessons }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}


