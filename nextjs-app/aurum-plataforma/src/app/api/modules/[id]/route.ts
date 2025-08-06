import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Module from '@/models/Module';
import Course from '@/models/Course';
import Lesson from '@/models/Lesson';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = params;
    const module = await Module.findById(id).populate("lessons");
    if (!module) {
      return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: module }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = params;
    const body = await req.json();
    const module = await Module.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!module) {
      return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: module }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = params;
    const module = await Module.findByIdAndDelete(id);
    if (!module) {
      return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 });
    }
    // Remove module reference from course
    await Course.findByIdAndUpdate(module.courseId, { $pull: { modules: module._id } });
    // Delete all lessons associated with this module
    await Lesson.deleteMany({ moduleId: module._id });

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}


