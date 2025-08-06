import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Module from '@/models/Module';
import Lesson from '@/models/Lesson';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { title, description, order, courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID is required' }, { status: 400 });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }

    const module = await Module.create({ title, description, order, courseId });

    course.modules.push(module._id);
    await course.save();

    return NextResponse.json({ success: true, data: module }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    let modules;
    if (courseId) {
      modules = await Module.find({ courseId }).sort({ order: 1 });
    } else {
      modules = await Module.find({}).sort({ order: 1 });
    }

    return NextResponse.json({ success: true, data: modules }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}


